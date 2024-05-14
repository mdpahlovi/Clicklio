import { Attributes, Tool } from "@/types";
import { create } from "zustand";

type CanvasStateStore = {
    tool: Tool;
    zoom: number;
    refresh: number | null;
    helpModal: boolean;
    attributes: Attributes | null;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setRefresh: () => void;
    toggleHelpModal: () => void;
    setAttributes: (attributes: Attributes) => void;
    updateAttributes: (key: keyof Attributes, value: string) => void;
};

export const useCanvasState = create<CanvasStateStore>((set) => ({
    tool: "select",
    zoom: 1,
    refresh: null,
    helpModal: false,
    attributes: null,
    setTool: (tool) => set({ tool }),
    setZoom: (zoom) => set({ zoom }),
    setRefresh: () => set({ refresh: Math.random() * 100 }),
    toggleHelpModal: () => set(({ helpModal }) => ({ helpModal: !helpModal })),
    setAttributes: (attributes) => set({ attributes }),
    updateAttributes: (key, value) => set(({ attributes }) => ({ attributes: attributes ? { ...attributes, [key]: value } : null })),
}));
