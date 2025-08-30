import type { CurrentObject, Tool } from "@/types";
import Konva from "konva";
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CanvasStateStore = {
    user: string;
    tool: Tool;
    zoom: number;
    refresh: number | null;
    currentObject: CurrentObject | null;
    userMedia: MediaStream | null;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setRefresh: () => void;
    setCurrentObject: (object: Konva.Shape | null) => void;
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
            userMedia: null,
            setTool: (tool) => set({ tool }),
            setZoom: (zoom) => set({ zoom }),
            setRefresh: () => set({ refresh: Math.random() * 100 }),
            setCurrentObject: (object) => {
                if (object) {
                    const clientRect = object.getClientRect();
                    const objectData = object.toObject();

                    set({
                        currentObject: {
                            id: object.id(),
                            name: object.name(),
                            type: object.className,
                            x: String(clientRect.x),
                            y: String(clientRect.y),
                            width: String(clientRect.width),
                            height: String(clientRect.height),
                            fontSize: objectData?.attrs?.fontSize ? String(objectData?.attrs?.fontSize) : "",
                            fontFamily: objectData?.attrs?.fontFamily || "",
                            fill: (objectData?.attrs?.fill as string) || "",
                            stroke: (objectData?.attrs?.stroke as string) || "",
                            strokeWidth: objectData?.attrs?.strokeWidth ? String(objectData?.attrs?.strokeWidth) : "",
                            strokeStyle: objectData?.attrs?.dash ? "dashed" : "solid",
                            cornerRadius: objectData?.attrs?.cornerRadius ? String(objectData?.attrs?.cornerRadius) : "",
                            maxCornerRadius: String(
                                Math.round(Math.min(objectData?.attrs?.width || 0, objectData?.attrs?.height || 0) / 4),
                            ),
                            opacity: String(objectData?.attrs?.opacity || 1),
                        },
                    });
                } else {
                    set({ currentObject: null });
                }
            },
            setUserMedia: (media) => set({ userMedia: media }),
        }),
        {
            name: "clicklio-canvas",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ user: state.user }),
        },
    ),
);
