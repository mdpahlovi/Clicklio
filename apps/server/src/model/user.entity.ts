import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from "typeorm";

export enum Provider {
    CREDENTIAL = "CREDENTIAL",
    GOOGLE = "GOOGLE",
    FACEBOOK = "FACEBOOK",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Generated("uuid")
    @Column({ type: "uuid", unique: true })
    uid: string;

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

    @Column({
        type: "enum",
        enum: Provider,
        enumName: "provider",
    })
    provider: Provider;

    @Column({
        name: "other_info",
        type: "jsonb",
        nullable: true,
    })
    otherInfo: object | null;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp",
    })
    updatedAt: Date;
}
