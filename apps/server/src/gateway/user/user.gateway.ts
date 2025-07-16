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

@WebSocketGateway({ cors: { origin: "*" } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly redisService: RedisService) {}

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);

        const keys = await this.redisService.client.scan(0, "MATCH", `room:*:user:${client.id}`);
        if (keys[1].length) {
            const room = keys[1][0].split(":")[1];

            await this.redisService.client.srem(`room:${room}:users`, client.id);
            await this.redisService.client.del(`room:${room}:user:${client.id}`);

            client.to(room).emit("delete:user", { key: client.id });
        }
    }

    @SubscribeMessage("join:room")
    async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string; user: RoomUser }) {
        if (!data.room) return;

        const { room, user } = data;
        await client.join(room);

        await this.redisService.client.sadd(`room:${room}:users`, client.id);
        await this.redisService.client.hset(`room:${room}:user:${client.id}`, user);

        client.to(room).emit("create:user", { key: client.id, value: user });

        // Set initial users to current user
        const users = {};
        const userIds = await this.redisService.client.smembers(`room:${room}:users`);
        for (const id of userIds) {
            if (id === client.id) continue;

            const userData = await this.redisService.client.hgetall(`room:${room}:user:${id}`);
            users[id] = userData;
        }

        // Set initial events to current user
        const events = {};
        const eventIds = await this.redisService.client.smembers(`room:${room}:events`);
        for (const id of eventIds) {
            const eventData = await this.redisService.client.hgetall(`room:${room}:event:${id}`);
            events[id] = {
                ...eventData,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ...(eventData?.data ? { data: JSON.parse(eventData?.data) } : {}),
            };
        }

        client.emit("join:room", { users, events });
    }

    @SubscribeMessage("leave:room")
    async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
        if (!data.room) return;

        const { room } = data;

        await client.leave(room);
        await this.redisService.client.srem(`room:${room}:users`, client.id);
        await this.redisService.client.del(`room:${room}:user:${client.id}`);

        client.to(room).emit("delete:user", { key: client.id });
    }

    @SubscribeMessage("update:user")
    async handleUpdateName(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string; user: RoomUser }) {
        if (!data.room) return;

        const { room, user } = data;
        await this.redisService.client.hset(`room:${room}:user:${client.id}`, user);

        client.to(room).emit("update:user", { key: client.id, value: user });
    }

    @SubscribeMessage("cursor")
    handleDeleteUser(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string; cursor: Pointer }) {
        if (!data.room) return;

        const { room, cursor } = data;
        client.to(room).emit("cursor", { key: client.id, value: cursor });
    }
}
