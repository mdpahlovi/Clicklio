import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { User } from "src/models/user.entity";
import { CreateRoomDto } from "./room.dto";
import { RoomService } from "./room.service";

@Controller("room")
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post()
    async createRoom(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: User) {
        return await this.roomService.createRoom(createRoomDto, user);
    }

    @Get()
    async getRooms(@Query() query: Record<string, string>, @CurrentUser() user: User) {
        return await this.roomService.getRooms(query, user);
    }

    @Get(":id")
    async getOneRoom(@Param("id") id: string) {
        return await this.roomService.getOneRoom(id);
    }
}
