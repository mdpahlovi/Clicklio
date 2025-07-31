import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { EventType } from "../../models/room.entity";

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsEnum(EventType)
    @IsNotEmpty()
    type: EventType;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsOptional()
    shapeId: string | null;

    @IsString()
    @IsOptional()
    eventId: string | null;

    @IsObject()
    @IsOptional()
    data: Record<string, unknown> | null;

    @IsString()
    @IsNotEmpty()
    firedAt: string;
}

export class UpdateRoomDto {
    @IsString()
    @IsNotEmpty()
    photo: string;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateEventDto)
    events: CreateEventDto[];
}
