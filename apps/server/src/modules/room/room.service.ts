import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Room, RoomUser, RoomUserRole, ShapeEvent } from "src/models/room.entity";
import { User } from "src/models/user.entity";
import { DeepPartial, FindOptionsWhere, In, Repository } from "typeorm";
import { RedisService } from "../../common/service/redis.service";
import { CreateRoomDto, UpdateRoomDto } from "./room.dto";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(RoomUser)
        private readonly roomUserRepository: Repository<RoomUser>,
        @InjectRepository(ShapeEvent)
        private readonly shapeEventRepository: Repository<ShapeEvent>,
        private readonly redisService: RedisService,
    ) {}

    async createRoom(createRoomDto: CreateRoomDto, user: User) {
        const createRoomPayload: DeepPartial<Room> = {
            name: createRoomDto.name,
            description: createRoomDto.description,
            ownerId: user.id,
        };

        const createRoom = await this.roomRepository.save(createRoomPayload);

        const roomUserPayload: DeepPartial<RoomUser> = {
            userId: user.id,
            roomId: createRoom.id,
            role: RoomUserRole.ADMIN,
        };

        await this.roomUserRepository.save(roomUserPayload);

        return {
            status: 201,
            message: "Room created successfully",
            data: createRoom,
        };
    }

    async getRooms(query: Record<string, string>, user: User) {
        const roomWhere: FindOptionsWhere<Room> = {
            roomUsers: { userId: In([user.id]) },
        };

        const total = await this.roomRepository.countBy(roomWhere);

        const rooms = await this.roomRepository.find({
            where: roomWhere,
            order: { createdAt: "DESC" },
            relations: ["ownerInfo", "roomUsers", "roomUsers.userInfo"],
            select: {
                id: true,
                name: true,
                photo: true,
                description: true,
                ownerInfo: {
                    id: true,
                    name: true,
                    email: true,
                    photo: true,
                },
                roomUsers: {
                    role: true,
                    userInfo: {
                        id: true,
                        name: true,
                        email: true,
                        photo: true,
                    },
                },
                createdAt: true,
            },
        });

        return {
            status: 200,
            message: "Rooms fetched successfully",
            data: { total, rooms },
        };
    }

    async getOneRoom(id: string, user: User) {
        const room = await this.roomRepository.findOne({
            where: { id },
            select: { id: true, name: true, photo: true, description: true, createdAt: true },
        });

        if (!room) {
            throw new NotFoundException("Room not found");
        }

        // get current user data
        const currUser = await this.roomUserRepository
            .findOne({
                where: { roomId: id, userId: user.id },
                relations: { userInfo: true },
                select: { id: true, userInfo: { name: true }, role: true, roomId: true, joinAt: true },
            })
            .then((user) => {
                if (!user) throw new NotFoundException("Room user not found");

                const { userInfo, ...restData } = user;
                return { name: userInfo.name, ...restData };
            });

        await this.redisService.client.hset(`room:${id}:users`, currUser.id, JSON.stringify(currUser));
        const roomUser = await this.redisService.client.hgetall(`room:${id}:users`);
        const eventStr = await this.redisService.client.lrange(`room:${id}:events_pvt`, 0, -1);

        let events: ShapeEvent[] = [];
        if (eventStr.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
            events = eventStr.map((event) => JSON.parse(event));
        } else {
            events = await this.shapeEventRepository.find({
                where: { roomId: id },
                order: { firedAt: "ASC" },
                select: { id: true, type: true, userId: true, shapeId: true, eventId: true, data: true, firedAt: true },
            });

            await this.redisService.client.rpush(`room:${id}:events_pvt`, ...events.map((event) => JSON.stringify(event)));
        }

        delete roomUser[user.id];
        return {
            status: 200,
            message: "Room fetched successfully",
            data: { room, currUser, roomUser, events },
        };
    }

    async updateRoom(id: string, updateRoomDto: UpdateRoomDto) {
        const room = await this.roomRepository.findOne({ where: { id } });

        if (!room) {
            throw new NotFoundException("Room not found");
        }

        await this.roomRepository.update(id, { photo: updateRoomDto.photo });
        const events: DeepPartial<ShapeEvent>[] = updateRoomDto.events.map((event) => ({
            id: event.id,
            roomId: id,
            userId: event.userId,
            type: event.type,
            shapeId: event.shapeId,
            eventId: event.eventId,
            data: event.data,
            firedAt: event.firedAt,
        }));

        await this.shapeEventRepository.save(events);

        return {
            status: 200,
            message: "Room updated successfully",
            data: updateRoomDto.events.map((event) => event.id),
        };
    }
}
