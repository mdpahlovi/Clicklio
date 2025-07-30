import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Room, RoomUser, RoomUserRole, ShapeEvent } from "src/models/room.entity";
import { User } from "src/models/user.entity";
import { DeepPartial, FindOptionsWhere, In, Repository } from "typeorm";
import { CreateRoomDto } from "./room.dto";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(RoomUser)
        private readonly roomUserRepository: Repository<RoomUser>,
        @InjectRepository(ShapeEvent)
        private readonly shapeEventRepository: Repository<ShapeEvent>,
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

        const currUser = await this.roomUserRepository.findOne({
            where: { roomId: id, userId: user.id },
            relations: { userInfo: true },
            select: { id: true, userInfo: { name: true }, role: true, roomId: true, joinAt: true },
        });

        const events = await this.shapeEventRepository.find({
            where: { roomId: id },
            order: { firedAt: "DESC" },
            select: { id: true, type: true, userId: true, shapeId: true, eventId: true, data: true, firedAt: true },
        });

        const { userInfo, ...restData } = currUser!;

        return {
            status: 200,
            message: "Room fetched successfully",
            data: { room, currUser: { name: userInfo.name, ...restData }, events },
        };
    }
}
