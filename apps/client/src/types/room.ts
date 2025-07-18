import type { RoomUserRole } from "@/stores/room/useUserStore";

export type Room = {
    id: string;
    name: string;
    photo: string | null;
    description: string | null;
    ownerInfo: {
        id: string;
        name: string;
        email: string;
        photo: string | null;
    };
    roomUsers: {
        role: RoomUserRole;
        userInfo: {
            id: string;
            name: string;
            email: string;
            photo: string | null;
        };
    }[];
    createdAt: string;
};

export type ApiResponse<T> = {
    status: number;
    message: string;
    data: T;
};
