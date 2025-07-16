import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import { config } from "./config/env.config";
import { CanvasModule } from "./gateway/canvas/canvas.module";
import { UserModule } from "./gateway/user/user.module";
import { AuthGuard } from "./guards/auth.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { RoomModule } from "./modules/room/room.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
            envFilePath: ["../../.env", ".env"],
        }),
        CommonModule,
        UserModule,
        CanvasModule,
        AuthModule,
        RoomModule,
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
