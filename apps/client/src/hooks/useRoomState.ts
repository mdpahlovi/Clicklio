import { create } from "zustand";
import { User } from "./useAuthState";

type Cursor = { x: number; y: number } & User;

type RoomStateStore = {
    cursor: Cursor[];
    shareModal: boolean;
    toggleShareModal: () => void;
    authModal: boolean;
    toggleAuthModal: () => void;
    setCursor: (cursor: Cursor) => void;
};

export const useRoomState = create<RoomStateStore>((set) => ({
    cursor: [],
    shareModal: false,
    toggleShareModal: () => set(({ shareModal }) => ({ shareModal: !shareModal })),
    authModal: false,
    toggleAuthModal: () => set(({ authModal }) => ({ authModal: !authModal })),
    setCursor: (cursor) => set(({ cursor: all_cursor }) => ({ cursor: updateCursor(all_cursor, cursor) })),
}));

function updateCursor(all_cursor: Cursor[], cursor: Cursor) {
    const index = all_cursor.findIndex(({ id }) => id === cursor.id);

    if (index) {
        all_cursor[index] = cursor;

        return all_cursor;
    } else {
        return [...all_cursor, cursor];
    }
}
