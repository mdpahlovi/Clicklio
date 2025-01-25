import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = { id: string; name: string };
export type Cursor = { id: string; name?: string; x: number; y: number };

type RoomStateStore = {
    name: string;
    users: User[];
    cursor: Cursor[];
    shareModal: boolean;
    setName: (name: string) => void;
    updateName: (id: string, name: string) => void;
    setUsers: (users: User[]) => void;
    setCursor: (cursor: Cursor) => void;
    deleteCursor: (id: string) => void;
    toggleShareModal: () => void;
};

export const useRoomState = create<RoomStateStore>()(
    persist(
        (set) => ({
            name: "",
            users: [],
            cursor: [],
            shareModal: false,
            setName: (name) => set({ name }),
            updateName: (id, name) => set(({ users }) => ({ users: users.map((u) => (u.id === id ? { ...u, name } : u)) })),
            setUsers: (users) => set({ users }),
            setCursor: (cursor) => set(({ cursor: allCursor }) => ({ cursor: updateCursor(allCursor, cursor) })),
            deleteCursor: (id) => set(({ cursor }) => ({ cursor: cursor.filter((c) => c.id !== id) })),
            toggleShareModal: () => set(({ shareModal }) => ({ shareModal: !shareModal })),
        }),
        { name: "clicklio-room", partialize: (state) => ({ name: state.name }) }
    )
);

function updateCursor(allCursor: Cursor[], cursor: Cursor) {
    const index = allCursor.findIndex(({ id }) => id === cursor.id);

    if (index !== -1) {
        allCursor[index] = cursor;

        return allCursor;
    } else {
        return [...allCursor, cursor];
    }
}
