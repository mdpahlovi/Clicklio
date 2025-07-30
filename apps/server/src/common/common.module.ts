import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShapeEvent } from "../models/room.entity";
import { CronService } from "./service/cron.service";
import { HashService } from "./service/hash.service";
import { RedisService } from "./service/redis.service";

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get("postgres.host"),
                port: configService.get("postgres.port"),
                username: configService.get("postgres.user"),
                password: configService.get("postgres.password"),
                database: configService.get("postgres.database"),
                autoLoadEntities: true,
                synchronize: true,
                logging: true,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([ShapeEvent]),
        JwtModule.registerAsync({
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.get("jwt.secret"),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [RedisService, CronService, HashService],
    exports: [RedisService, HashService],
})
export class CommonModule {}
