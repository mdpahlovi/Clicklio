import { Shape } from "@/types";
import { create } from "zustand";

type CanvasStateStore = {
    tool: Shape;
    zoom: number;
    setTool: (tool: Shape) => void;
    setZoom: (zoom: number) => void;
};

export const useCanvasState = create<CanvasStateStore>((set) => ({
    tool: "select",
    zoom: 1,
    setTool: (tool) => set({ tool }),
    setZoom: (zoom) => set({ zoom }),
}));
