import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { getRandomName } from "@/utils/utils";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useAuthState } from "../auth/useAuthStore";

export type RoomUserRole = "ADMIN" | "MODERATOR" | "USER";
export type RoomUser = { id: string; name: string; role: RoomUserRole; roomId: string; joinAt: string };

type UserState = {
    currUser: RoomUser | null;
    roomUser: Map<string, RoomUser>;

    createCurrUser: (room: string, role: RoomUserRole) => RoomUser;
    updateCurrUser: (user: RoomUser) => void;
    deleteCurrUser: () => void;

    createUser: (key: string, value: RoomUser) => void;
    updateUser: (key: string, value: RoomUser) => void;
    deleteUser: (key: string) => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            currUser: null,
            roomUser: new Map<string, RoomUser>(),

            createCurrUser: (room: string, role: RoomUserRole) => {
                useCanvasState.setState({ room });
                const currUser: RoomUser = {
                    id: useCanvasState.getState().user,
                    name: useAuthState.getState().user?.name || getRandomName(),
                    role,
                    roomId: room,
                    joinAt: new Date().toISOString(),
                };

                set({ currUser });
                return currUser;
            },

            updateCurrUser: (currUser: RoomUser) => set({ currUser }),
            deleteCurrUser: () => {
                useCanvasState.setState({ room: null });
                set({ currUser: null });
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
        }),
        {
            name: "clicklio-room",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ currUser: state.currUser }),
        },
    ),
);
