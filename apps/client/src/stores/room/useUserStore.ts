import { useAuthState } from "@/stores/auth/useAuthStore";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { getRandomName } from "@/utils/utils";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

    setInitialData: (data: { currUser: RoomUser; roomUser: Record<string, string> }) => void;
    resetUser: () => void;
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            currUser: null,
            roomUser: new Map<string, RoomUser>(),

            createCurrUser: (room: string, role: RoomUserRole) => {
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
            deleteCurrUser: () => set({ currUser: null }),

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

            setInitialData: (data: { currUser: RoomUser; roomUser: Record<string, string> }) =>
                set({
                    currUser: data.currUser,
                    roomUser: new Map(Object.entries(data.roomUser).map(([key, value]) => [key, JSON.parse(value)])),
                }),

            resetUser: () => set({ currUser: null, roomUser: new Map<string, RoomUser>() }),
        }),
        {
            name: "clicklio-room",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ currUser: state.currUser }),
        },
    ),
);
