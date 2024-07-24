import { fabric } from "fabric";
import { create } from "zustand";
import type { Tool } from "@/types";

type CanvasStateStore = {
    tool: Tool;
    zoom: number;
    refresh: number | null;
    helpModal: boolean;
    currentObject: fabric.Object | null;
    openedFloatingMenu: { [key: string]: boolean };
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setRefresh: () => void;
    toggleHelpModal: () => void;
    setCurrentObject: (object: fabric.Object) => void;
    removeCurrentObject: () => void;
    setOpenedFloatingMenu: (key: string) => void;
};

export const useCanvasState = create<CanvasStateStore>((set) => ({
    tool: "select",
    zoom: 2,
    refresh: null,
    helpModal: false,
    currentObject: null,
    openedFloatingMenu: {},
    setTool: (tool) => set({ tool }),
    setZoom: (zoom) => set({ zoom }),
    setRefresh: () => set({ refresh: Math.random() * 100 }),
    toggleHelpModal: () => set(({ helpModal }) => ({ helpModal: !helpModal })),
    setCurrentObject: (object) => set({ currentObject: object, openedFloatingMenu: {} }),
    removeCurrentObject: () => set({ currentObject: null, openedFloatingMenu: {} }),
    setOpenedFloatingMenu: (key) =>
        set(({ openedFloatingMenu }) =>
            Object.keys(openedFloatingMenu).includes(key)
                ? { openedFloatingMenu: { [key]: !openedFloatingMenu[key] } }
                : { openedFloatingMenu: { [key]: true } }
        ),
}));
