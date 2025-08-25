import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "src/common/service/room.service";

type CreateMessage = { room: string; event: Record<string, unknown> };

@WebSocketGateway({ cors: { origin: "*" } })
export class CanvasGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly roomService: RoomService) {}

    @SubscribeMessage("create:event")
    async handleSetShape(@ConnectedSocket() client: Socket, @MessageBody() { room, event }: CreateMessage) {
        if (!room) return { success: false, message: "Room is required" };

        await this.roomService.createEvent(client, room, event);
    }
}
