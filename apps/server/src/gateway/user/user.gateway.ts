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
import { RedisService } from "src/common/service/redis.service";
import { RoomUser, RoomUserRole } from "src/types/user";
import { getRandomName } from "src/utils/getRandomName";

@WebSocketGateway({ namespace: "user" })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly redisService: RedisService) {}

    handleConnection(client: Socket) {
        console.log("User connected", client.id);
    }

    @SubscribeMessage("join:room")
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() { room, user }: { room: string; user: { id: string; name?: string; role: RoomUserRole } },
    ) {
        if (!room || !user.id) return;

        const RoomUser: RoomUser = {
            id: user.id,
            name: user.name || getRandomName(),
            role: user.role,
            roomId: room,
        };

        await client.join(room);

        await this.redisService.client.hset(`room:${room}:user:${client.id}`, RoomUser);

        this.server.to(room).emit("join:room", RoomUser);
    }

    @SubscribeMessage("exit:room")
    async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
        if (!room) return;

        await client.leave(room);

        await this.redisService.client.hdel(`room:${room}:user:${client.id}`);

        client.to(room).emit("exit:room", client.id);
    }

    @SubscribeMessage("update:name")
    async handleUpdateName(@ConnectedSocket() client: Socket, @MessageBody() { room, name }: { room: string; name: string }) {
        if (!room || !name) return;

        await this.redisService.client.hset(`room:${room}:user:${client.id}`, "name", name);

        client.to(room).emit("update:name", { key: client.id, name });
    }

    handleDisconnect(client: Socket) {
        console.log("User disconnected", client.rooms);
    }
}
