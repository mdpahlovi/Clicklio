import { Body, Controller, Post, Req } from "@nestjs/common";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { User } from "src/models/user.entity";
import { Public } from "../../decorators/public.decorator";
import { OAuthUserDto, SigninUserDto, SignupUserDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post("signin")
    async signin(@Body() signinUserDto: SigninUserDto) {
        return await this.authService.signin(signinUserDto);
    }

    @Public()
    @Post("signup")
    async signup(@Body() signupUserDto: SignupUserDto) {
        return await this.authService.signup(signupUserDto);
    }

    @Public()
    @Post("oauth-signin")
    async oAuthSignin(@Body() oAuthUserDto: OAuthUserDto) {
        return await this.authService.oAuthSignin(oAuthUserDto);
    }

    @Post("update-profile")
    async updateProfile(@Body() body: Partial<User>, @CurrentUser() user: User) {
        return await this.authService.updateProfile(body, user);
    }

    @Post("signout")
    async signOut(@Req() req: Request) {
        return await this.authService.signOut(req);
    }
}
