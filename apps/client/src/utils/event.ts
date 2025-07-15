import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import type { StoreAddEvent } from "@/types";

export const handleAddEvent = (data: StoreAddEvent) => {
    console.log({ data, room: useCanvasState.getState().room });
};
