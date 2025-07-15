import { getRandomName } from "@/utils/utils";
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useAuthState } from "../auth/useAuthStore";

export type RoomUserRole = "ADMIN" | "MODERATOR" | "USER";
export type RoomUser = { id: string; name: string; role: RoomUserRole; roomId: string; joinAt: string };

type UserState = {
    room: string | null;
    currUser: RoomUser | null;
    roomUser: Map<string, RoomUser>;

    createCurrUser: (room: string, role: RoomUserRole) => void;
    updateCurrUser: (user: RoomUser) => void;

    createUser: (key: string, value: RoomUser) => void;
    updateUser: (key: string, value: RoomUser) => void;
    deleteUser: (key: string) => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            room: null,
            currUser: null,
            roomUser: new Map<string, RoomUser>(),

            createCurrUser: (room: string, role: RoomUserRole) => {
                const userUser = useAuthState.getState().user;
                const currUser: RoomUser = {
                    id: userUser?.uid || uuid(),
                    name: userUser?.name || getRandomName(),
                    role,
                    roomId: room,
                    joinAt: new Date().toISOString(),
                };

                set({ room, currUser });
            },

            updateCurrUser: (currUser: RoomUser) => set({ currUser }),

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
        }),
        {
            name: "clicklio-room",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ currUser: state.currUser }),
        },
    ),
);
