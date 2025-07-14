import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { RedisService } from "src/common/service/redis.service";
import { Pointer, RoomUser } from "src/types/user";
import { getRandomName } from "src/utils/getRandomName";

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
            await this.redisService.client.del(`room:${room}:user:${client.id}`);

            client.to(room).emit("delete:user", { key: client.id });
        }
    }

    @SubscribeMessage("join:room")
    async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string; user: RoomUser | null }) {
        if (!data.room) return;

        const { room, user } = data;
        const roomUser: RoomUser = {
            id: user?.id || randomUUID(),
            name: user?.name || getRandomName(),
            role: user?.role || "USER",
            roomId: room,
            joinAt: new Date().toISOString(),
        };

        await client.join(room);
        await this.redisService.client.hset(`room:${room}:user:${client.id}`, roomUser);

        // Current users
        let users = {};
        let userCursor = "0";
        do {
            const result = await this.redisService.client.scan(userCursor, "MATCH", `room:${room}:user:*`);
            userCursor = result[0];
            const keys = result[1];

            for (const key of keys) {
                const userData = await this.redisService.client.hgetall(key);
                users = { ...users, [`${key.split(":")[3]}`]: userData };
            }
        } while (userCursor !== "0");

        // Current shapes
        let shapes = {};
        let shapeCursor = "0";
        do {
            const result = await this.redisService.client.scan(shapeCursor, "MATCH", `room:${room}:shape:*`);
            shapeCursor = result[0];
            const keys = result[1];

            for (const key of keys) {
                const shapeData = await this.redisService.client.hgetall(key);
                shapes = { ...shapes, [`${key.split(":")[3]}`]: shapeData };
            }
        } while (shapeCursor !== "0");

        this.server.to(room).emit("join:room", { users, shapes });
    }

    @SubscribeMessage("leave:room")
    async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { room: string }) {
        if (!data.room) return;

        const { room } = data;

        await client.leave(room);
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
