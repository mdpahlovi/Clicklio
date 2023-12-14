import { Element, Tool } from "@/types";
import { create } from "zustand";

export interface CanvasStore {
    stroke: string;
    tool: Tool;
    elements: Element[];
    image: string | null;
    setStroke: (stroke: string) => void;
    setTool: (tool: Tool) => void;
    setElements: (element: Element) => void;
    updateElements: (element: Element[]) => void;
    setImage: (image: string) => void;
}

const useCanvasStore = create<CanvasStore>()((set) => ({
    stroke: "#000000",
    tool: "pencil",
    elements: [],
    image: null,
    setStroke: (payload) => set({ stroke: payload }),
    setTool: (payload) => set({ tool: payload }),
    setElements: (payload) => set(({ elements }) => ({ elements: [...elements, payload] })),
    updateElements: (payload) => set({ elements: payload }),
    setImage: (payload) => set({ image: payload }),
}));

export default useCanvasStore;
