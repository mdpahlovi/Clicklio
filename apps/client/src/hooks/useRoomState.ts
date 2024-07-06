import { create } from "zustand";

export type Cursor = { id: string; name?: string; x: number; y: number };

type RoomStateStore = {
    cursor: Cursor[];
    shareModal: boolean;
    toggleShareModal: () => void;
    setCursor: (cursor: Cursor) => void;
    deleteCursor: (id: string) => void;
};

export const useRoomState = create<RoomStateStore>((set) => ({
    cursor: [],
    shareModal: false,
    toggleShareModal: () => set(({ shareModal }) => ({ shareModal: !shareModal })),
    setCursor: (cursor) => set(({ cursor: all_cursor }) => ({ cursor: updateCursor(all_cursor, cursor) })),
    deleteCursor: (id) => set(({ cursor }) => ({ cursor: cursor.filter((c) => c.id !== id) })),
}));

function updateCursor(all_cursor: Cursor[], cursor: Cursor) {
    const index = all_cursor.findIndex(({ id }) => id === cursor.id);

    if (index !== -1) {
        all_cursor[index] = cursor;

        return all_cursor;
    } else {
        return [...all_cursor, cursor];
    }
}
