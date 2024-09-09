import * as fabric from "fabric";
import { create } from "zustand";
import { temporal } from "zundo";

type ShapeStateStore = {
    shapes: fabric.FabricObject[];
    previous: fabric.FabricObject[];
    setShape: (shape: fabric.FabricObject) => void;
    setShapes: (shape: fabric.FabricObject[]) => void;
    updateShape: (shape: fabric.FabricObject) => void;
    deleteShape: (id: string) => void;
    setPrevious: (shape: fabric.FabricObject[]) => void;
};

export const useShapeState = create<ShapeStateStore>()(
    temporal((set) => ({
        shapes: [],
        previous: [],
        setShapes: (shapes) => set({ shapes }),
        setShape: (shape) => set(({ shapes }) => ({ shapes: [...shapes, shape] })),

        updateShape: (shape) =>
            set(({ shapes }) => ({
                shapes: shapes.map((previous) => (previous?.objectId === shape?.objectId ? shape : previous)),
            })),

        deleteShape: (id) => set(({ shapes }) => ({ shapes: shapes.filter(({ objectId }) => objectId !== id) })),

        setPrevious: (previous) => set({ previous }),
    }))
);
