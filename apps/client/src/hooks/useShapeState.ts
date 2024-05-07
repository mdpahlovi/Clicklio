import { fabric } from "fabric";
import { create } from "zustand";
import { temporal } from "zundo";

type ShapeStateStore = {
    shapes: fabric.Object[];
    setShape: (shape: fabric.Object) => void;
    updateShape: (shape: fabric.Object) => void;
    deleteShape: (id: string) => void;
};

export const useShapeState = create<ShapeStateStore>()(
    temporal((set) => ({
        shapes: [],
        setShape: (shape) => set(({ shapes }) => ({ shapes: [...shapes, shape] })),

        updateShape: (shape) =>
            set(({ shapes }) => ({
                // @ts-ignore
                shapes: shapes.map((previous) => (previous.objectId === shape.objectId ? shape : previous)),
            })),

        // @ts-ignore
        deleteShape: (id) => set(({ shapes }) => ({ shapes: shapes.filter(({ objectId }) => objectId !== id) })),
    })),
);
