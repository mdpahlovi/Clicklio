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

type JoinRoom = { room: string; user: RoomUser; events: Record<string, string>[]; isPrivate?: boolean };
type LeaveRoom = { room: string };
type UpdateUser = { room: string; user: RoomUser };
type Cursor = { room: string; cursor: Pointer };

@WebSocketGateway({ cors: { origin: "*" } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly redisService: RedisService) {}

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);

        client.on("disconnecting", async () => {
            const rooms = Array.from(client.rooms).filter((room) => room !== client.id);

            for (const room of rooms) {
                await this.handleDelete(client, room);
            }
        });
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage("join:room")
    async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() { room, ...data }: JoinRoom) {
        if (!room) return;

        await client.join(room);

        const pipeline = this.redisService.client.pipeline();

        if (data.isPrivate === true) pipeline.sadd(`room`, room);
        pipeline.hset(`room:${room}:users`, client.id, JSON.stringify(data.user));

        const eventEntries: string[] = [];
        const eventOnlyIds: string[] = [];

        for (const event of data.events) {
            eventEntries.push(event.id, JSON.stringify(event));
            eventOnlyIds.push(event.id);
        }

        if (eventEntries.length > 0 && eventOnlyIds.length > 0) {
            pipeline.hset(`room:${room}:events`, ...eventEntries);
            pipeline.rpush(`room:${room}:events_sorted`, ...eventOnlyIds);
            pipeline.sadd(`room:${room}:events_pending`, ...eventOnlyIds);
        }

        await pipeline.exec();

        client.to(room).emit("create:user", { key: client.id, value: data.user });

        const [users, events, eventIds] = await Promise.all([
            this.redisService.client.hgetall(`room:${room}:users`),
            this.redisService.client.hgetall(`room:${room}:events`),
            this.redisService.client.lrange(`room:${room}:events_sorted`, 0, -1),
        ]);

        delete users[client.id];
        client.emit("join:room", { users, events, eventIds });
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
        const isPrivate = await this.redisService.client.sismember(`rooms`, room);
        const totalUser = await this.redisService.client.hlen(`room:${room}:users`);

        const pipeline = this.redisService.client.pipeline();

        // Remove user from room
        pipeline.hdel(`room:${room}:users`, client.id);

        // Remove user if there is only one user
        if (totalUser === 1 && isPrivate === 0) {
            pipeline.del(`room:${room}:events`);
            pipeline.del(`room:${room}:events_sorted`);
            pipeline.del(`room:${room}:events_pending`);
        }

        await pipeline.exec();

        client.to(room).emit("delete:user", { key: client.id });
    }
}
