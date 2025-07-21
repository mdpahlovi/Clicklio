import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Request } from "express";
import { RedisService } from "src/common/service/redis.service";
import { DeepPartial, Repository } from "typeorm";
import { HashService } from "../../common/service/hash.service";
import { Provider, User } from "../../models/user.entity";
import { OAuthUserDto, SigninUserDto, SignupUserDto } from "./auth.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
    ) {}

    async signin(signinUserDto: SigninUserDto) {
        const { email, password } = signinUserDto;

        const user = await this.userRepository.findOne({
            where: { email },
        });

        // If user does not exist, throw error
        if (!user) {
            throw new NotFoundException("Please check your credentials");
        }

        // If user has no password, throw error
        if (!user.password) {
            if (user.provider !== Provider.CREDENTIAL) {
                throw new BadRequestException(`Please use ${user.provider.toLowerCase()} to sign in`);
            } else {
                throw new BadRequestException("Please reset your password");
            }
        }

        // If password does not match, throw error
        if (!(await this.hashService.compare(password, user.password))) {
            throw new NotFoundException("Please check your credentials");
        }

        const tokens = await this.jwtSignin(user);

        return {
            message: "User signed in successfully",
            data: { user, ...tokens },
        };
    }

    async signup(signupUserDto: SignupUserDto) {
        const { name, email, password } = signupUserDto;

        const existingUser = await this.userRepository.findOne({
            where: { email },
        });

        // If user already exists, throw error
        if (existingUser) {
            throw new BadRequestException(`An account already exists with '${email}'. Please sign in.`);
        }

        const hashedPassword = await this.hashService.hash(password);

        const createUserPayload: DeepPartial<User> = {
            isActive: true,
            name,
            email,
            password: hashedPassword,
            provider: Provider.CREDENTIAL,
        };

        const createdUser = await this.userRepository.save(createUserPayload);
        const tokens = await this.jwtSignin(createdUser);

        return {
            message: "User signed up successfully",
            data: { user: createdUser, ...tokens },
        };
    }

    async oAuthSignin(oAuthUserDto: OAuthUserDto) {
        const { name, email, photo, provider } = oAuthUserDto;

        const user = await this.userRepository.findOne({
            where: { email },
        });

        let createdUser: User;
        if (user) {
            const updateUserPayload = {
                name,
                photo,
                provider,
            };

            await this.userRepository.update(user.id, updateUserPayload);

            createdUser = (await this.userRepository.findOne({
                where: { id: user.id },
            })) as User;
        } else {
            const createUserPayload: DeepPartial<User> = {
                isActive: true,
                name,
                email,
                photo,
                provider,
            };

            createdUser = await this.userRepository.save(createUserPayload);
        }

        const tokens = await this.jwtSignin(createdUser);

        return {
            message: "User signed in successfully",
            data: { user: createdUser, ...tokens },
        };
    }

    async jwtSignin(user: User) {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            photo: user.photo,
            otherInfo: user.otherInfo,
            createdAt: user.createdAt,
        };

        const accTokenKey = randomUUID();
        const refTokenKey = randomUUID();

        await this.redisService.client.set(`auth:acc-token:${accTokenKey}`, this.jwtService.sign(payload, { expiresIn: "1h" }));
        await this.redisService.client.set(`auth:ref-token:${refTokenKey}`, this.jwtService.sign(payload, { expiresIn: "7d" }));

        return { accessToken: accTokenKey, refreshToken: refTokenKey };
    }

    async updateProfile(body: Partial<User>, user: User) {
        const updateUserPayload = {
            ...(body?.isActive ? { isActive: body.isActive } : {}),
            ...(body?.name ? { name: body.name } : {}),
            ...(body?.email ? { email: body.email } : {}),
            ...(body?.phone ? { phone: body.phone } : {}),
            ...(body?.photo ? { photo: body.photo } : {}),
            ...(body?.otherInfo ? { otherInfo: body.otherInfo } : {}),
        };

        await this.userRepository.update(user.id, updateUserPayload);

        const updatedUser = (await this.userRepository.findOne({
            where: { id: user.id },
        })) as User;

        return {
            message: "User profile updated successfully",
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                photo: updatedUser.photo,
                otherInfo: updatedUser.otherInfo,
                createdAt: updatedUser.createdAt,
            },
        };
    }

    async signOut(req: Request) {
        const accTokenKey = req.headers.authorization?.split(" ")[1];
        const refTokenKey = req.headers["x-refresh-token"] as string;

        if (accTokenKey) await this.redisService.client.del(`auth:acc-token:${accTokenKey}`);
        if (refTokenKey) await this.redisService.client.del(`auth:ref-token:${refTokenKey}`);

        return {
            message: "User signed out successfully",
        };
    }
}
