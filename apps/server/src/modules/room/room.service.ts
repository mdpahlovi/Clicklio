import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Room, RoomUserRole } from "src/models/room.entity";
import { User } from "src/models/user.entity";
import { DeepPartial, FindOptionsWhere, In, Repository } from "typeorm";
import { CreateRoomDto } from "./room.dto";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
    ) {}

    async createRoom(createRoomDto: CreateRoomDto, user: User) {
        const createRoomPayload: DeepPartial<Room> = {
            name: createRoomDto.name,
            ownerId: user.id,
            roomUsers: [{ role: RoomUserRole.ADMIN, userId: user.id }],
        };

        const createRoom = await this.roomRepository.save(createRoomPayload);

        return {
            status: 201,
            message: "Room created successfully",
            data: createRoom,
        };
    }

    async getRooms(query: Record<string, string>, user: User) {
        const page: number = parseInt(query?.page || "1");
        const size: number = parseInt(query?.size || "6");

        const roomWhere: FindOptionsWhere<Room> = {
            roomUsers: { userId: In([user.id]) },
        };

        const total = await this.roomRepository.countBy(roomWhere);

        const rooms = await this.roomRepository.find({
            where: roomWhere,
            skip: (page - 1) * size,
            take: size,
            cache: true,
            order: { createdAt: "DESC" },
            relations: ["roomUsers", "roomUsers.userInfo"],
            select: {
                id: true,
                name: true,
                photo: true,
                description: true,
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
}
