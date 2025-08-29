import type { Tool } from "@/types";
import Konva from "konva";
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CanvasStateStore = {
    user: string;
    tool: Tool;
    zoom: number;
    refresh: number | null;
    currentObject: Konva.Shape | null;
    openedFloatingMenu: { [key: string]: boolean };
    userMedia: MediaStream | null;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setRefresh: () => void;
    setCurrentObject: (object: Konva.Shape | null) => void;
    setOpenedFloatingMenu: (key: string) => void;
    setUserMedia: (media: MediaStream | null) => void;
};

export const useCanvasState = create<CanvasStateStore>()(
    persist(
        (set) => ({
            user: uuid(),
            tool: "select",
            zoom: 1,
            refresh: null,
            currentObject: null,
            openedFloatingMenu: {},
            userMedia: null,
            setTool: (tool) => set({ tool }),
            setZoom: (zoom) => set({ zoom }),
            setRefresh: () => set({ refresh: Math.random() * 100 }),
            setCurrentObject: (object) => set({ currentObject: object, openedFloatingMenu: {} }),
            setOpenedFloatingMenu: (key) =>
                set(({ openedFloatingMenu }) =>
                    Object.keys(openedFloatingMenu).includes(key)
                        ? { openedFloatingMenu: { [key]: !openedFloatingMenu[key] } }
                        : { openedFloatingMenu: { [key]: true } },
                ),
            setUserMedia: (media) => set({ userMedia: media }),
        }),
        {
            name: "clicklio-canvas",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ user: state.user }),
        },
    ),
);
