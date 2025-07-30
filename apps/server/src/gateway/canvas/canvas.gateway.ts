import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RedisService } from "src/common/service/redis.service";

type CreateMessage = { room: string; event: Record<string, unknown> };

@WebSocketGateway({ cors: { origin: "*" } })
export class CanvasGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly redisService: RedisService) {}

    @SubscribeMessage("create:event")
    async handleSetShape(@ConnectedSocket() client: Socket, @MessageBody() data: CreateMessage) {
        if (!data.room) return;

        const { room, event } = data;
        await this.redisService.client.hset(`room:${room}:events`, event?.id as string, JSON.stringify(event));
        await this.redisService.client.rpush(`room:${room}:events_sorted`, event?.id as string);
        await this.redisService.client.sadd(`room:${room}:events_pending`, event?.id as string);

        client.to(data.room).emit("create:event", { event });
    }
}
