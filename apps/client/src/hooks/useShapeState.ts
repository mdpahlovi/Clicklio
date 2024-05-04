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

                updateShape: (shape) =>
                    set(({ shapes }) => ({
                        // @ts-ignore
                        shapes: shapes.map((previous) => (previous.objectId === shape.objectId ? shape : previous)),
                    })),

                // @ts-ignore
                deleteShape: (id) => set(({ shapes }) => ({ shapes: shapes.filter(({ objectId }) => objectId !== id) })),
            }),
            { name: "clicklio" },
        ),
    ),
);
