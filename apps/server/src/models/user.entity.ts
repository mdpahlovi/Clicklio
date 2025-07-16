import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Room, RoomUser, ShapeEvent } from "./room.entity";

export enum Provider {
    CREDENTIAL = "CREDENTIAL",
    GOOGLE = "GOOGLE",
    FACEBOOK = "FACEBOOK",
}

@Entity("users")
@Index(["email"], { unique: true })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "is_active", type: "boolean", default: true })
    isActive: boolean;

    @Column({ type: "text" })
    name: string;

    @Column({ type: "text", unique: true })
    email: string;

    @Column({ type: "text", nullable: true })
    phone: string | null;

    @Column({ type: "text", nullable: true })
    photo: string | null;

    @Column({ type: "text", nullable: true })
    password: string | null;

    @Column({ type: "enum", enum: Provider })
    provider: Provider;

    @Column({ name: "other_info", type: "jsonb", nullable: true })
    otherInfo: object | null;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updatedAt: Date;

    @OneToMany(() => Room, (room) => room.ownerInfo)
    ownedRooms: Room[];

    @OneToMany(() => RoomUser, (roomUser) => roomUser.userInfo)
    joinedRooms: RoomUser[];

    @OneToMany(() => ShapeEvent, (shapeEvent) => shapeEvent.userInfo)
    shapeEvents: ShapeEvent[];
}
