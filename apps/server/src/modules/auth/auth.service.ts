import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { HashService } from "../../common/service/hash.service";
import { Provider, User } from "../../model/user.entity";
import { OAuthUserDto, SigninUserDto, SignupUserDto } from "./auth.dto";
import { RedisService } from "src/common/service/redis.service";

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
            const updateUserPayload: DeepPartial<User> = {
                name,
                photo,
                provider,
            };

            await this.userRepository.update(user.uid, updateUserPayload);

            createdUser = (await this.userRepository.findOne({
                where: { uid: user.uid },
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

    // eslint-disable-next-line @typescript-eslint/require-await
    async jwtSignin(user: User) {
        const payload = {
            id: user.id,
            uid: user.uid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            photo: user.photo,
            otherInfo: user.otherInfo,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: "1h" }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: "7d" }),
        };
    }

    async updateProfile(body: Partial<User>, user: User) {
        const updateUserPayload: DeepPartial<User> = {
            ...(body?.isActive ? { isActive: body.isActive } : {}),
            ...(body?.name ? { name: body.name } : {}),
            ...(body?.email ? { email: body.email } : {}),
            ...(body?.phone ? { phone: body.phone } : {}),
            ...(body?.photo ? { photo: body.photo } : {}),
            ...(body?.otherInfo ? { otherInfo: body.otherInfo } : {}),
        };

        await this.userRepository.update(user.uid, updateUserPayload);

        const updatedUser = (await this.userRepository.findOne({
            where: { uid: user.uid },
        })) as User;

        return {
            message: "User profile updated successfully",
            data: {
                id: updatedUser.id,
                uid: updatedUser.uid,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                photo: updatedUser.photo,
                otherInfo: updatedUser.otherInfo,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            },
        };
    }
}
