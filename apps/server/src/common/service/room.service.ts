import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { RoomUser } from "../../types/user";
import { MediasoupService } from "./mediasoup.service";
import { RedisService } from "./redis.service";

@Injectable()
export class RoomService {
    private readonly logger = new Logger(RoomService.name);

    constructor(
        private readonly redisService: RedisService,
        private readonly mediasoupService: MediasoupService,
    ) {}

    private getRoomUsersKey(room: string): string {
        return `room:${room}:users`;
    }

    private getRoomEventsKey(room: string): string {
        return `room:${room}:events`;
    }

    private getClientRoomKey(clientId: string): string {
        return `client:${clientId}:room`;
    }

    private getRoomExistsKey(room: string): string {
        return `room:${room}:exists`;
    }

    private async roomExists(room: string): Promise<string | null> {
        return await this.redisService.client.get(this.getRoomExistsKey(room));
    }

    async createRoom(client: Socket, room: string, user: RoomUser, events: Record<string, unknown>[]) {
        try {
            if (await this.roomExists(room)) return { success: false, message: "Room already exists" };

            await client.join(room);

            const pipeline = this.redisService.client.pipeline();

            pipeline.set(this.getRoomExistsKey(room), client.id);
            pipeline.hset(this.getRoomUsersKey(room), client.id, JSON.stringify(user));
            pipeline.set(this.getClientRoomKey(client.id), room);

            if (events.length > 0) {
                pipeline.lpush(this.getRoomEventsKey(room), ...events.map((event) => JSON.stringify(event)));
            }

            await pipeline.exec();

            return { success: true, message: "Room created successfully" };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to create room" };
        }
    }

    async joinRoom(client: Socket, room: string, user: RoomUser) {
        try {
            if (!(await this.roomExists(room))) return { success: false, message: "Room not found" };

            await client.join(room);

            const pipeline = this.redisService.client.pipeline();

            pipeline.hset(this.getRoomUsersKey(room), client.id, JSON.stringify(user));
            pipeline.set(this.getClientRoomKey(client.id), room);

            await pipeline.exec();

            const [users, events] = await Promise.all([
                this.redisService.client.hgetall(this.getRoomUsersKey(room)),
                this.redisService.client.lrange(this.getRoomEventsKey(room), 0, -1),
            ]);

            client.to(room).emit("create:user", { key: client.id, value: user });

            delete users[client.id];
            return {
                success: true,
                message: "Room joined successfully",
                data: { users, events },
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to join room" };
        }
    }

    async leaveRoom(client: Socket) {
        try {
            const room = await this.redisService.client.get(this.getClientRoomKey(client.id));

            if (!room) return { success: false, message: "Client not in any room" };

            await client.leave(room);

            this.mediasoupService.removeClient(room, client);

            const pipeline = this.redisService.client.pipeline();

            pipeline.hdel(this.getRoomUsersKey(room), client.id);
            pipeline.del(this.getClientRoomKey(client.id));

            await pipeline.exec();

            client.to(room).emit("delete:user", { key: client.id });

            return { success: true, message: "Room left successfully" };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to leave room" };
        }
    }

    async updateUser(client: Socket, room: string, user: RoomUser) {
        try {
            const userInRoom = await this.redisService.client.hexists(this.getRoomUsersKey(room), client.id);

            if (!userInRoom) return { success: false, message: "User not in room or room not found" };

            await this.redisService.client.hset(this.getRoomUsersKey(room), client.id, JSON.stringify(user));

            client.to(room).emit("update:user", { key: client.id, value: user });

            return { success: true, message: "User updated successfully" };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to update user" };
        }
    }

    async createEvent(client: Socket, room: string, event: Record<string, unknown>) {
        try {
            if (!(await this.roomExists(room))) return { success: false, message: "Room not found" };

            await this.redisService.client.lpush(this.getRoomEventsKey(room), JSON.stringify(event));

            client.to(room).emit("create:event", { event });

            return { success: true, message: "Event created successfully" };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return { success: false, message: "Failed to create event" };
        }
    }
}
