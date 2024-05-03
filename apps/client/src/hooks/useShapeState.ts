import { fabric } from "fabric";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type ShapeStateStore = {
    shapes: fabric.Object[];
    setShape: (shape: fabric.Object) => void;
    updateShape: (shape: fabric.Object) => void;
    deleteShape: (id: string) => void;
};

// @ts-ignore
export const useShapeState = create<ShapeStateStore, [["zustand/devtools", never], ["zustand/persist", ShapeStateStore]]>(
    devtools(
        persist(
            (set) => ({
                shapes: [],
                setShape: (shape) => set(({ shapes }) => ({ shapes: [...shapes, shape] })),
                // @ts-ignore
                updateShape: (shape) => set(({ shapes }) => ({ shapes: shapes.map((s) => (s.objectId === shape.objectId ? shape : s)) })),
                // @ts-ignore
                deleteShape: (id) => set(({ shapes }) => ({ shapes: shapes.filter(({ objectId }) => objectId !== id) })),
            }),
            { name: "clicklio" },
        ),
    ),
);
