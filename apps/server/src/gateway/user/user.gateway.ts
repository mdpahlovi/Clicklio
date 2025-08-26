import { Logger } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "src/common/service/room.service";
import { Pointer, RoomUser } from "src/types/user";

type CreateRoom = { room: string; user: RoomUser; events: Record<string, unknown>[] };
type JoinRoom = { room: string; user: RoomUser };
type JoinRoomPvt = { room: string; user: RoomUser };
type UpdateUser = { room: string; user: RoomUser };
type Cursor = { room: string; cursor: Pointer };

@WebSocketGateway({ cors: { origin: "*" } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(UserGateway.name);

    @WebSocketServer() server: Server;

    constructor(private readonly roomService: RoomService) {}

    handleConnection(client: Socket) {
        this.logger.debug(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        this.logger.debug(`Client disconnected: ${client.id}`);

        await this.roomService.leaveRoom(client);
    }

    @SubscribeMessage("create:room")
    async handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody() { room, user, events }: CreateRoom) {
        if (!room) return { success: false, message: "Room is required" };

        return await this.roomService.createRoom(client, room, user, events);
    }

    @SubscribeMessage("join:room")
    async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() { room, user }: JoinRoom) {
        if (!room) return { success: false, message: "Room is required" };

        return await this.roomService.joinRoom(client, room, user);
    }

    @SubscribeMessage("join:room_private")
    async handleJoinRoomPvt(@ConnectedSocket() client: Socket, @MessageBody() { room, user }: JoinRoomPvt) {
        if (!room) return { success: false, message: "Room is required" };

        await client.join(room);

        client.to(room).emit("create:user", { key: client.id, value: user });
    }

    @SubscribeMessage("leave:room")
    async handleLeaveRoom(@ConnectedSocket() client: Socket) {
        return await this.roomService.leaveRoom(client);
    }

    @SubscribeMessage("update:user")
    async handleUpdateName(@ConnectedSocket() client: Socket, @MessageBody() { room, user }: UpdateUser) {
        if (!room) return { success: false, message: "Room is required" };

        return await this.roomService.updateUser(client, room, user);
    }

    @SubscribeMessage("cursor")
    handleCursor(@ConnectedSocket() client: Socket, @MessageBody() { room, cursor }: Cursor) {
        if (!room) return { success: false, message: "Room is required" };

        client.to(room).emit("cursor", { key: client.id, value: cursor });
    }
}
