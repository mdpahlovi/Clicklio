import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RedisService } from "src/common/service/redis.service";

type CreateMessage = { room: string; event: Record<string, unknown>; isPrivate: boolean };

@WebSocketGateway({ cors: { origin: "*" } })
export class CanvasGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly redisService: RedisService) {}

    @SubscribeMessage("create:event")
    async handleSetShape(@ConnectedSocket() client: Socket, @MessageBody() data: CreateMessage) {
        if (!data.room) return;

        const { room, event, isPrivate } = data;
        if (isPrivate) {
            await this.redisService.client.rpush(`room:${room}:events_pvt`, JSON.stringify(event));
        } else {
            await this.redisService.client.rpush(`room:${room}:events_pub`, JSON.stringify(event));
        }

        client.to(data.room).emit("create:event", { event });
    }
}
