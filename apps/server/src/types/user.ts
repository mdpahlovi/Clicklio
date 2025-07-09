export type RoomUser = {
    id: string;
    ip: string;
    name: string;
    email: string;
    isAuthenticated: boolean;
    role: "ADMIN" | "MODERATOR" | "USER";
    roomId: string;
    socketId: string;
};
