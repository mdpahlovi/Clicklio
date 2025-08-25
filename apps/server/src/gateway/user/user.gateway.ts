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
import { RedisService } from "src/common/service/redis.service";
import { Pointer, RoomUser } from "src/types/user";

type JoinRoom = { room: string; user: RoomUser; events: Record<string, string>[] };
type JoinRoomPvt = { room: string; user: RoomUser };
type LeaveRoom = { room: string };
type UpdateUser = { room: string; user: RoomUser };
type Cursor = { room: string; cursor: Pointer };

@WebSocketGateway({ cors: { origin: "*" } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(UserGateway.name);

    @WebSocketServer() server: Server;

    constructor(private readonly redisService: RedisService) {}

    handleConnection(client: Socket) {
        this.logger.debug(`Client connected: ${client.id}`);

        client.on("disconnecting", async () => {
            const rooms = Array.from(client.rooms).filter((room) => room !== client.id);

            for (const room of rooms) {
                await this.handleDelete(client, room);
            }
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.debug(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage("join:room")
    async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() { room, ...data }: JoinRoom) {
        if (!room) return;

        await client.join(room);

        const pipeline = this.redisService.client.pipeline();

        pipeline.hset(`room:${room}:users`, client.id, JSON.stringify(data.user));

        if (data.events.length > 0) {
            pipeline.rpush(`room:${room}:events_pub`, ...data.events.map((event) => JSON.stringify(event)));
        }

        await pipeline.exec();

        client.to(room).emit("create:user", { key: client.id, value: data.user });

        const [users, events] = await Promise.all([
            this.redisService.client.hgetall(`room:${room}:users`),
            this.redisService.client.lrange(`room:${room}:events_pub`, 0, -1),
        ]);

        delete users[client.id];
        client.emit("join:room", { users, events });
    }

    @SubscribeMessage("join:room_pvt")
    async handleJoinRoomPvt(@ConnectedSocket() client: Socket, @MessageBody() { room, user }: JoinRoomPvt) {
        if (!room) return;

        await client.join(room);

        client.to(room).emit("create:user", { key: client.id, value: user });
    }

    @SubscribeMessage("leave:room")
    async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() { room }: LeaveRoom) {
        if (!room) return;

        await client.leave(room);
        await this.handleDelete(client, room);
    }

    @SubscribeMessage("update:user")
    async handleUpdateName(@ConnectedSocket() client: Socket, @MessageBody() { room, user }: UpdateUser) {
        if (!room) return;

        await this.redisService.client.hset(`room:${room}:users`, client.id, JSON.stringify(user));

        client.to(room).emit("update:user", { key: client.id, value: user });
    }

    @SubscribeMessage("cursor")
    handleCursor(@ConnectedSocket() client: Socket, @MessageBody() { room, cursor }: Cursor) {
        if (!room) return;

        client.to(room).emit("cursor", { key: client.id, value: cursor });
    }

    async handleDelete(client: Socket, room: string): Promise<void> {
        const totalUser = await this.redisService.client.hlen(`room:${room}:users`);

        const pipeline = this.redisService.client.pipeline();

        // Remove user from room
        pipeline.hdel(`room:${room}:users`, client.id);

        // Remove user if there is only one user
        if (totalUser === 1) {
            pipeline.del(`room:${room}:events_pub`);
        }

        await pipeline.exec();

        client.to(room).emit("delete:user", { key: client.id });
    }
}
