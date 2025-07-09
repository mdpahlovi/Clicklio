import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import configuration from "./config/configuration";
import { CanvasModule } from "./gateway/canvas/canvas.module";
import { UserModule } from "./gateway/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: ["../../.env", ".env"],
        }),
        CommonModule,
        UserModule,
        CanvasModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
