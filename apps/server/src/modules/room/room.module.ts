import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Room, RoomUser, ShapeEvent } from "src/models/room.entity";
import { User } from "src/models/user.entity";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, Room, RoomUser, ShapeEvent])],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule {}
