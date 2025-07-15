import { useAuthState } from "@/stores/auth/useAuthStore";
import type { Tool } from "@/types";
import * as fabric from "fabric";
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CanvasStateStore = {
    room: string | null;
    user: string;
    tool: Tool;
    zoom: number;
    refresh: number | null;
    currentObject: fabric.FabricObject | null;
    openedFloatingMenu: { [key: string]: boolean };
    userMedia: MediaStream | null;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setRefresh: () => void;
    setCurrentObject: (object: fabric.FabricObject | null) => void;
    setOpenedFloatingMenu: (key: string) => void;
    setUserMedia: (media: MediaStream | null) => void;
};

export const useCanvasState = create<CanvasStateStore>()(
    persist(
        (set) => ({
            room: null,
            user: useAuthState.getState().user?.uid || uuid(),
            tool: "select",
            zoom: 2,
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
            partialize: (state) => ({ room: state.room, user: state.user }),
        },
    ),
);
