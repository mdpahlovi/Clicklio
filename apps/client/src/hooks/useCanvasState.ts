import { Attributes, Tool } from "@/types";
import { create } from "zustand";

type CanvasStateStore = {
    tool: Tool;
    zoom: number;
    attributes: Attributes | null;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setAttributes: (attributes: Attributes) => void;
    updateAttributes: (key: keyof Attributes, value: string) => void;
};

export const useCanvasState = create<CanvasStateStore>((set) => ({
    tool: "select",
    zoom: 1,
    attributes: null,
    setTool: (tool) => set({ tool }),
    setZoom: (zoom) => set({ zoom }),
    setAttributes: (attributes) => set({ attributes }),
    updateAttributes: (key, value) => set(({ attributes }) => ({ attributes: attributes ? { ...attributes, [key]: value } : null })),
}));
