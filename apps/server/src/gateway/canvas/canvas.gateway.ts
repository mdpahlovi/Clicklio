import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RedisService } from "src/common/service/redis.service";

type CreateMessage = { room: string; key: string; value: Record<string, unknown> };
type UpdateMessage = { room: string; key: string; value: Record<string, unknown> };
type DeleteMessage = { room: string; uid: string };

@WebSocketGateway({ cors: { origin: "*" } })
export class CanvasGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly redisService: RedisService) {}

    @SubscribeMessage("create:shape")
    async handleSetShape(@ConnectedSocket() client: Socket, @MessageBody() data: CreateMessage) {
        if (!data.room || !data.key) return;

        await this.redisService.client.hset(`room:${data.room}:shape:${data.key}`, data.value);
        client.to(data.room).emit("create:shape", data);
    }

    @SubscribeMessage("update:shape")
    async handleUpdateShape(@ConnectedSocket() client: Socket, @MessageBody() data: UpdateMessage) {
        if (!data.room || !data.key) return;

        await this.redisService.client.hset(`room:${data.room}:shape:${data.key}`, data.value);
        client.to(data.room).emit("update:shape", data);
    }

    @SubscribeMessage("delete:shape")
    async handleDeleteShape(@ConnectedSocket() client: Socket, @MessageBody() data: DeleteMessage) {
        if (!data.room || !data.uid) return;

        await this.redisService.client.del(`room:${data.room}:shape:${data.uid}`);
        client.to(data.room).emit("delete:shape", data);
    }
}
