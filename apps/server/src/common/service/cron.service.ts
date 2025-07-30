import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { ShapeEvent } from "../../models/room.entity";
import { RedisService } from "./redis.service";

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(
        @InjectRepository(ShapeEvent)
        private readonly shapeEventRepository: Repository<ShapeEvent>,
        private readonly redisService: RedisService,
    ) {}

    @Cron(CronExpression.EVERY_10_MINUTES)
    async handleCron() {
        const eventPayloads: QueryDeepPartialEntity<ShapeEvent>[] = [];

        const rooms = await this.redisService.client.smembers("rooms");
        const events = await this.redisService.client.hgetall("events");
        const eventIds = await this.redisService.client.lrange("events_sorted", 0, -1);

        for (const room of rooms) {
            for (const eventId of eventIds) {
                const event = events[eventId];

                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                eventPayloads.push({ id: eventId, roomId: room, ...JSON.parse(event) });
            }
        }

        if (eventPayloads.length === 0) return;
        await this.shapeEventRepository.createQueryBuilder().insert().into(ShapeEvent).values(eventPayloads).execute();

        for (const room of rooms) {
            await this.redisService.client.srem(`room:${room}:events_pending`, ...eventIds);
        }

        this.logger.log(`${events.length} Events saved successfully`);
    }
}
