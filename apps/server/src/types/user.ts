export type RoomUserRole = "ADMIN" | "MODERATOR" | "USER";
export type RoomUser = { id: string; name: string; role: RoomUserRole; roomId: string; joinAt: string };
export type Pointer = { x: number; y: number };
