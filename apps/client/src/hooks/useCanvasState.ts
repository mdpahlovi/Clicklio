import type { Tool } from "@/types";
import * as fabric from "fabric";
import { create } from "zustand";

type CanvasStateStore = {
    tool: Tool;
    zoom: number;
    refresh: number | null;
    helpModal: boolean;
    currentObject: fabric.FabricObject | null;
    openedFloatingMenu: { [key: string]: boolean };
    userMedia: MediaStream | null;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setRefresh: () => void;
    toggleHelpModal: () => void;
    setCurrentObject: (object: fabric.FabricObject) => void;
    removeCurrentObject: () => void;
    setOpenedFloatingMenu: (key: string) => void;
    setUserMedia: (media: MediaStream | null) => void;
};

export const useCanvasState = create<CanvasStateStore>((set) => ({
    tool: "select",
    zoom: 2,
    refresh: null,
    helpModal: false,
    currentObject: null,
    openedFloatingMenu: {},
    userMedia: null,
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
                : { openedFloatingMenu: { [key]: true } },
        ),
    setUserMedia: (media) => set({ userMedia: media }),
}));
