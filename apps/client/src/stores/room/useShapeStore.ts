import { create } from "zustand";

type ShapeStore = {
    shapes: Map<string, Record<string, unknown>>;

    createShape: (key: string, value: Record<string, unknown>) => void;
    updateShape: (key: string, value: Record<string, unknown>) => void;
    deleteShape: (key: string) => void;
};

export const useShapeStore = create<ShapeStore>((set) => ({
    shapes: new Map(),

    createShape: (key: string, value: Record<string, unknown>) =>
        set((state) => ({
            shapes: new Map(state.shapes).set(key, value),
        })),

    updateShape: (key: string, value: Record<string, unknown>) =>
        set((state) => ({
            shapes: new Map(state.shapes).set(key, value),
        })),

    deleteShape: (key: string) =>
        set((state) => {
            const newShapes = new Map(state.shapes);
            newShapes.delete(key);
            return { shapes: newShapes };
        }),
}));
