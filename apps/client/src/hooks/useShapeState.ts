import * as fabric from "fabric";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ShapeStateStore = {
    shapes: fabric.FabricObject[];
    history: fabric.FabricObject[][];
    position: number;
    previous: fabric.FabricObject[];
    setShape: (shape: fabric.FabricObject) => void;
    setShapes: (shape: fabric.FabricObject[]) => void;
    updateShape: (shape: fabric.FabricObject) => void;
    deleteShape: (id: string) => void;
    setPrevious: (shape: fabric.FabricObject[]) => void;
    setInitialState: ({
        shapes,
        history,
        position,
    }: {
        shapes: fabric.FabricObject[];
        history: fabric.FabricObject[][];
        position: number;
    }) => void;
    undo: () => void;
    redo: () => void;
};

export const useShapeState = create<ShapeStateStore>()(
    persist(
        (set) => ({
            shapes: [],
            history: [],
            position: 0,
            previous: [],
            setShapes: (shapes) =>
                set((state) => {
                    const newHistory = [...state.history.slice(0, state.position + 1), shapes].slice(-20);
                    return {
                        shapes,
                        history: newHistory,
                        position: Math.min(newHistory.length - 1, 19),
                    };
                }),

            setShape: (shape) =>
                set((state) => {
                    const updatedShapes = [...state.shapes, shape];
                    const newHistory = [...state.history.slice(0, state.position + 1), updatedShapes].slice(-20);
                    return {
                        shapes: updatedShapes,
                        history: newHistory,
                        position: Math.min(newHistory.length - 1, 19),
                    };
                }),

            updateShape: (shape) =>
                set((state) => {
                    const updatedShapes = state.shapes.map((s) => (s?.objectId === shape?.objectId ? shape : s));
                    const newHistory = [...state.history.slice(0, state.position + 1), updatedShapes].slice(-20);
                    return {
                        shapes: updatedShapes,
                        history: newHistory,
                        position: Math.min(newHistory.length - 1, 19),
                    };
                }),

            deleteShape: (id) =>
                set((state) => {
                    const updatedShapes = state.shapes.filter(({ objectId }) => objectId !== id);
                    const newHistory = [...state.history.slice(0, state.position + 1), updatedShapes].slice(-20);
                    return {
                        shapes: updatedShapes,
                        history: newHistory,
                        position: Math.min(newHistory.length - 1, 19),
                    };
                }),

            setPrevious: (previous) => set({ previous }),

            setInitialState: ({ shapes, history, position }) =>
                set({
                    shapes,
                    history,
                    position,
                }),

            undo: () =>
                set((state) => {
                    if (state.position > 0) {
                        const newPosition = state.position - 1;
                        return {
                            shapes: state.history[newPosition],
                            position: newPosition,
                        };
                    }
                    return {};
                }),

            redo: () =>
                set((state) => {
                    if (state.position < state.history.length - 1) {
                        const newPosition = state.position + 1;
                        return {
                            shapes: state.history[newPosition],
                            position: newPosition,
                        };
                    }
                    return {};
                }),
        }),
        { name: "clicklio-shapes" }
    )
);
