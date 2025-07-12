import { create } from "zustand";

export type RoomUserRole = "ADMIN" | "MODERATOR" | "USER";
export type RoomUser = { id: string; name: string; role: RoomUserRole; roomId: string; joinAt: string };
export type Pointer = { x: number; y: number };

type RoomUserState = {
    shareModal: boolean;
    currUser: RoomUser | null;
    roomUser: Map<string, RoomUser>;
    pointers: Map<string, Pointer>;

    setShareModal: (shareModal: boolean) => void;
    setCurUser: (user: RoomUser) => void;
    createUser: (key: string, value: RoomUser) => void;
    updateUser: (key: string, value: RoomUser) => void;
    deleteUser: (key: string) => void;
    setPointer: (key: string, value: Pointer) => void;
    deletePointer: (key: string) => void;

    reset: () => void;
};

export const useRoomUserStore = create<RoomUserState>((set) => ({
    shareModal: false,
    currUser: null,
    roomUser: new Map<string, RoomUser>(),
    pointers: new Map<string, Pointer>(),

    setShareModal: (shareModal: boolean) => set({ shareModal }),

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

    setPointer: (key: string, value: Pointer) =>
        set((state) => ({
            pointers: new Map(state.pointers).set(key, value),
        })),

    deletePointer: (key: string) =>
        set((state) => {
            const newPointers = new Map(state.pointers);
            newPointers.delete(key);
            return { pointers: newPointers };
        }),

    reset: () =>
        set({
            currUser: null,
            roomUser: new Map<string, RoomUser>(),
            pointers: new Map<string, Pointer>(),
        }),
}));
