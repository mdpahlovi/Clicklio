import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/models/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
