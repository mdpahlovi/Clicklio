import { create } from "zustand";

export type Path = [number, number];
export type Tool = "pencil" | "line" | "rectangle" | "ellipse";

export interface Element {
    offsetX: number;
    offsetY: number;
    path?: Path[];
    width?: number;
    height?: number;
    stroke: string;
    tool: Tool;
}

export interface CanvasStore {
    stroke: string;
    tool: Tool;
    elements: Element[];
    setStroke: (stroke: string) => void;
    setTool: (tool: Tool) => void;
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
