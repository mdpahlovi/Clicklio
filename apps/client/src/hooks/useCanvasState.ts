import { Tool } from "@/types";
import { create } from "zustand";

type CanvasStateStore = {
    tool: Tool;
    zoom: number;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
};

export const useCanvasState = create<CanvasStateStore>((set) => ({
    tool: "select",
    zoom: 1,
    setTool: (tool) => set({ tool }),
    setZoom: (zoom) => set({ zoom }),
}));
