/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RedisService } from "src/common/service/redis.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class CanvasGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly redisService: RedisService) {}

    @SubscribeMessage("initial:state")
    handleInitialState(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { to, ...state } = data;
        if (to) this.server.to(to).emit("initial:state", state);
    }

    @SubscribeMessage("set:shape")
    handleSetShape(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room, ...shape } = data;
        if (room) client.to(room).emit("set:shape", shape);
    }

    @SubscribeMessage("update:shape")
    handleUpdateShape(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room, ...shape } = data;
        if (room) client.to(room).emit("update:shape", shape);
    }

    @SubscribeMessage("delete:shape")
    handleDeleteShape(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room, uid } = data;
        if (room) client.to(room).emit("delete:shape", { uid });
    }

    @SubscribeMessage("undo:shape")
    handleUndoShape(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room, status } = data;
        if (room) client.to(room).emit("undo:shape", { status });
    }

    @SubscribeMessage("redo:shape")
    handleRedoShape(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room, status } = data;
        if (room) client.to(room).emit("redo:shape", { status });
    }

    @SubscribeMessage("reset:canvas")
    handleResetCanvas(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room, status } = data;
        if (room) client.to(room).emit("reset:canvas", { status });
    }

    @SubscribeMessage("cursor")
    handleCursor(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const { room, cursor } = data;
        if (room) client.to(room).emit("cursor", { id: client.id, ...cursor });
    }
}
