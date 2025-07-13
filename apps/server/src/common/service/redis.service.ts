import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redisClient: Redis;

    constructor(configService: ConfigService) {
        this.redisClient = new Redis({
            host: configService.get("redis.host"),
            port: configService.get("redis.port"),
            password: configService.get("redis.password"),
        });
    }

    get client() {
        return this.redisClient;
    }

    onModuleDestroy() {
        this.redisClient.disconnect();
    }
}
