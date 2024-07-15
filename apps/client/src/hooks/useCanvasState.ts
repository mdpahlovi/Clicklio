import { create } from "zustand";
import type { Tool } from "@/types";

type CanvasStateStore = {
    tool: Tool;
    zoom: number;
    refresh: number | null;
    helpModal: boolean;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setRefresh: () => void;
    toggleHelpModal: () => void;
};

export const useCanvasState = create<CanvasStateStore>((set) => ({
    tool: "select",
    zoom: 1,
    refresh: null,
    helpModal: false,
    setTool: (tool) => set({ tool }),
    setZoom: (zoom) => set({ zoom }),
    setRefresh: () => set({ refresh: Math.random() * 100 }),
    toggleHelpModal: () => set(({ helpModal }) => ({ helpModal: !helpModal })),
}));
