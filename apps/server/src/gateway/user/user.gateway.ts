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
    async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: JoinRoom) {
        if (!data.room) return;

        const { room, user, events } = data;
        await client.join(room);

        const pipeline = this.redisService.client.pipeline();

        pipeline.sadd(`room:${room}:users`, client.id);
        pipeline.hset(`room:${room}:user:${client.id}`, user);

        events.forEach((e) => {
            if (e?.data !== null) e.data = JSON.stringify(e.data);

            pipeline.sadd(`room:${room}:events`, e.id);
            pipeline.hset(`room:${room}:event:${e.id}`, e);
        });

        await pipeline.exec();

        client.to(room).emit("create:user", { key: client.id, value: user });

        // Get initial room data
        const [userIds, eventIds] = await Promise.all([
            this.redisService.client.smembers(`room:${room}:users`),
            this.redisService.client.smembers(`room:${room}:events`),
        ]);

        const roomUsers = {};
        const roomEvents = {};

        // Fetch all user data
        for (const userId of userIds) {
            if (userId === client.id) continue;
            const userData = await this.redisService.client.hgetall(`room:${room}:user:${userId}`);
            if (Object.keys(userData).length > 0) roomUsers[userId] = userData;
        }

        // Fetch all event data
        for (const eventId of eventIds) {
            const eventData = await this.redisService.client.hgetall(`room:${room}:event:${eventId}`);
            if (Object.keys(eventData).length > 0) roomEvents[eventId] = eventData;
        }

        client.emit("join:room", { users: roomUsers, events: roomEvents });
    }

    @SubscribeMessage("leave:room")
    async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
        if (!data.room) return;

        const { room } = data;

        await client.leave(room);
        await this.handleDelete(client, room);
    }

    @SubscribeMessage("update:user")
    async handleUpdateName(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string; user: RoomUser }) {
        if (!data.room) return;

        const { room, user } = data;
        await this.redisService.client.hset(`room:${room}:user:${client.id}`, user);

        client.to(room).emit("update:user", { key: client.id, value: user });
    }

    @SubscribeMessage("cursor")
    handleCursor(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string; cursor: Pointer }) {
        if (!data.room) return;

        const { room, cursor } = data;
        client.to(room).emit("cursor", { key: client.id, value: cursor });
    }

    async handleDelete(client: Socket, room: string): Promise<void> {
        const [users, events] = await Promise.all([
            this.redisService.client.smembers(`room:${room}:users`),
            this.redisService.client.smembers(`room:${room}:events`),
        ]);

        const pipeline = this.redisService.client.pipeline();

        // Remove user from room
        pipeline.srem(`room:${room}:users`, client.id);
        pipeline.del(`room:${room}:user:${client.id}`);

        // Remove user if there is only one user
        if (users?.length === 1) {
            pipeline.del(`room:${room}:events`);
            events.forEach((e) => {
                pipeline.del(`room:${room}:event:${e}`);
            });
        }

        await pipeline.exec();

        client.to(room).emit("delete:user", { key: client.id });
    }
}
