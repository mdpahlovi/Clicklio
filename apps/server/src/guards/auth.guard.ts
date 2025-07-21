import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { RedisService } from "../common/service/redis.service";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { User } from "../models/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        private readonly redisService: RedisService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        const accessToken = await this.getAccessToken(request);
        const refreshToken = await this.getRefreshToken(request);

        if (!accessToken || !refreshToken) {
            throw new UnauthorizedException("Please login again");
        }

        // Try to authenticate with access token first
        const userFromAccessToken = await this.tryVerifyAccessToken(accessToken);
        if (userFromAccessToken) {
            request.user = userFromAccessToken;
            return true;
        }

        // If access token failed, try refresh token
        const userFromRefreshToken = await this.tryRefreshTokenFlow(refreshToken, response);
        if (userFromRefreshToken) {
            request.user = userFromRefreshToken;
            return true;
        }

        // Both tokens failed
        throw new UnauthorizedException("Invalid token, Please login again");
    }

    private async getAccessToken(request: Request): Promise<string | null> {
        const [type, tokenKey] = request.headers.authorization?.split(" ") ?? [];

        if (type === "Bearer") {
            try {
                const token = await this.redisService.client.get(`auth:acc-token:${tokenKey}`);
                return typeof token === "string" ? token : null;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                return null;
            }
        } else {
            return null;
        }
    }

    private async getRefreshToken(request: Request): Promise<string | null> {
        const tokenKey = request.headers["x-refresh-token"];

        if (typeof tokenKey === "string") {
            try {
                const token = await this.redisService.client.get(`auth:ref-token:${tokenKey}`);
                return typeof token === "string" ? token : null;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                return null;
            }
        } else {
            return null;
        }
    }

    private async verifyToken(token: string): Promise<User> {
        try {
            const payload: JwtPayload = await this.jwtService.verifyAsync(token);

            // Clean up JWT metadata
            delete payload.iat;
            delete payload.exp;

            return payload as User;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new UnauthorizedException("Invalid token, Please login again");
        }
    }

    private async tryVerifyAccessToken(accessToken: string): Promise<User | null> {
        try {
            return await this.verifyToken(accessToken);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return null;
        }
    }

    private async tryRefreshTokenFlow(refreshToken: string, response: Response): Promise<User | null> {
        try {
            const user = await this.verifyToken(refreshToken);

            // Generate new access token
            const newAccessToken = this.jwtService.sign(user, { expiresIn: "1h" });
            response.setHeader("x-access-token", newAccessToken);

            return user;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return null;
        }
    }
}
