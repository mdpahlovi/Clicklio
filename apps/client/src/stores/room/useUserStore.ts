import { create } from "zustand";

export type RoomUserRole = "ADMIN" | "MODERATOR" | "USER";
export type RoomUser = { id: string; name: string; role: RoomUserRole; roomId: string; joinAt: string };

type UserState = {
    currUser: RoomUser | null;
    roomUser: Map<string, RoomUser>;

    setCurUser: (user: RoomUser) => void;
    createUser: (key: string, value: RoomUser) => void;
    updateUser: (key: string, value: RoomUser) => void;
    deleteUser: (key: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
    currUser: null,
    roomUser: new Map<string, RoomUser>(),

    setCurUser: (user: RoomUser) => {
        sessionStorage.setItem("currUser", JSON.stringify(user));
        set({ currUser: user });
    },

    createUser: (key: string, value: RoomUser) =>
        set((state) => ({
            roomUser: new Map(state.roomUser).set(key, value),
        })),

    updateUser: (key: string, value: RoomUser) =>
        set((state) => ({
            roomUser: new Map(state.roomUser).set(key, value),
        })),

    deleteUser: (key: string) =>
        set((state) => {
            const newRoomUser = new Map(state.roomUser);
            newRoomUser.delete(key);
            return { roomUser: newRoomUser };
        }),
}));
