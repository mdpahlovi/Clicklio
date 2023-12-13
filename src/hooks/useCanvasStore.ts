import { create } from "zustand";

type Path = [number, number];

interface Element {
    offsetX: number;
    offsetY: number;
    width?: number;
    height?: number;
    path?: Path[];
    stroke: string;
    tool: string;
}

interface CanvasStore {
    stroke: string;
    tool: string;
    elements: Element[];
    setStroke: (stroke: string) => void;
    setTool: (tool: string) => void;
    setElements: (element: Element) => void;
    updateElements: (element: Element[]) => void;
}

const useCanvasStore = create<CanvasStore>()((set) => ({
    stroke: "#000000",
    tool: "pencil",
    elements: [],
    setStroke: (payload) => set({ stroke: payload }),
    setTool: (payload) => set({ tool: payload }),
    setElements: (payload) => set(({ elements }) => ({ elements: [...elements, payload] })),
    updateElements: (payload) => set({ elements: payload }),
}));

export default useCanvasStore;
