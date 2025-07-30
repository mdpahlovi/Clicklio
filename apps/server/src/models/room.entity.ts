import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum RoomUserRole {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR",
    USER = "USER",
}

export enum EventType {
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    UNDO = "UNDO",
    REDO = "REDO",
}

@Entity("rooms")
@Index(["ownerId"])
export class Room {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "is_active", type: "boolean", default: true })
    isActive: boolean;

    @Column({ type: "text" })
    name: string;

    @Column({ type: "text", nullable: true })
    photo: string | null;

    @Column({ type: "text", nullable: true })
    description: string | null;

    @Column({ name: "owner_id", type: "uuid" })
    ownerId: string;

    @ManyToOne(() => User, (user) => user.ownedRooms, { onDelete: "CASCADE" })
    @JoinColumn({ name: "owner_id" })
    ownerInfo: User;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;

    @OneToMany(() => RoomUser, (roomUser) => roomUser.roomInfo)
    roomUsers: RoomUser[];

    @OneToMany(() => ShapeEvent, (shapeEvent) => shapeEvent.roomInfo)
    shapeEvents: ShapeEvent[];
}

@Entity("room_users")
@Unique(["roomId", "userId"])
export class RoomUser {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "room_id", type: "uuid" })
    roomId: string;

    @ManyToOne(() => Room, (room) => room.roomUsers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "room_id" })
    roomInfo: Room;

    @Column({ name: "user_id", type: "uuid" })
    userId: string;

    @ManyToOne(() => User, (user) => user.joinedRooms, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    userInfo: User;

    @Column({ type: "enum", enum: RoomUserRole, default: RoomUserRole.USER })
    role: RoomUserRole;

    @CreateDateColumn({ name: "joined_at", type: "timestamp" })
    joinAt: Date;
}

@Entity("shape_events")
@Index(["roomId", "userId"])
export class ShapeEvent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "room_id", type: "uuid" })
    roomId: string;

    @ManyToOne(() => Room, (room) => room.shapeEvents, { onDelete: "CASCADE" })
    @JoinColumn({ name: "room_id" })
    roomInfo: Room;

    @Column({ name: "user_id", type: "uuid" })
    userId: string;

    @ManyToOne(() => User, (user) => user.shapeEvents, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    userInfo: User;

    @Column({ type: "enum", enum: EventType })
    type: EventType;

    @Column({ name: "shape_id", type: "uuid", nullable: true })
    shapeId: string | null;

    @Column({ name: "event_id", type: "uuid", nullable: true })
    eventId: string | null;

    @Column({ type: "jsonb", nullable: true })
    data: Record<string, unknown> | null;

    @CreateDateColumn({ name: "fired_at", type: "timestamp" })
    firedAt: Date;
}
