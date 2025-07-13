import { create } from "zustand";

export type Pointer = { x: number; y: number };

type PointerState = {
    pointers: Map<string, Pointer>;

    setPointer: (key: string, value: Pointer) => void;
    deletePointer: (key: string) => void;
};

export const usePointerStore = create<PointerState>((set) => ({
    pointers: new Map<string, Pointer>(),

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
}));
