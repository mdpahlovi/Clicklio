import { create } from "zustand";

export type User = { id: string; name: string };
export type Cursor = { id: string; name?: string; x: number; y: number };

type RoomStateStore = {
    users: User[];
    cursor: Cursor[];
    shareModal: boolean;
    toggleShareModal: () => void;
    setUsers: (users: User[]) => void;
    setCursor: (cursor: Cursor) => void;
    deleteCursor: (id: string) => void;
};

export const useRoomState = create<RoomStateStore>((set) => ({
    users: [],
    cursor: [],
    shareModal: false,
    toggleShareModal: () => set(({ shareModal }) => ({ shareModal: !shareModal })),
    setUsers: (users) => set({ users }),
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
