import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "../../decorators/public.decorator";
import { SigninUserDto, SignupUserDto } from "./auth.dto";
import { AuthService } from "./auth.service";

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
}
