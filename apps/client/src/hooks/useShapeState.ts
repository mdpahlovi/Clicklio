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
                // @ts-ignore
                setShape: (shape) => set(({ shapes }) => ({ shapes: [...shapes, { objectId: shape.objectId, ...shape.toJSON() }] })),
                // @ts-ignore
                updateShape: (shape) =>
                    // @ts-ignore
                    set(({ shapes }) => ({
                        shapes: shapes.map((previous) =>
                            // @ts-ignore
                            previous.objectId === shape.objectId ? { objectId: shape.objectId, ...shape.toJSON() } : previous,
                        ),
                    })),
                // @ts-ignore
                deleteShape: (id) => set(({ shapes }) => ({ shapes: shapes.filter(({ objectId }) => objectId !== id) })),
            }),
            { name: "clicklio" },
        ),
    ),
);
