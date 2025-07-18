import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { StoreCreateEvent } from "@/types";
import type { ShapeEvent } from "@/types/event";
import { v4 as uuid } from "uuid";
import { socket } from "./socket";

export const handleCreateEvent = ({ action, object, createEvent }: StoreCreateEvent) => {
    const user = useCanvasState.getState().user;
    const room = useCanvasState.getState().room;

    let event: ShapeEvent | null = null;
    switch (action) {
        case "CREATE":
        case "UPDATE":
        case "DELETE": {
            if (object?.uid) {
                event = {
                    id: uuid(),
                    type: action,
                    userId: user,
                    shapeId: object?.uid,
                    eventId: null,
                    data: action !== "DELETE" ? object?.toJSON() : null,
                    firedAt: new Date().toISOString(),
                };
            }
            break;
        }
        case "UNDO": {
            const userUndoStack = useEventStore.getState().userUndoStacks.get(user) || [];
            if (userUndoStack.length > 0) {
                event = {
                    id: uuid(),
                    type: "UNDO",
                    userId: user,
                    eventId: userUndoStack[userUndoStack.length - 1],
                    shapeId: null,
                    data: null,
                    firedAt: new Date().toISOString(),
                };
            }
            break;
        }
        case "REDO": {
            const userRedoStack = useEventStore.getState().userRedoStacks.get(user) || [];
            if (userRedoStack.length > 0) {
                event = {
                    id: uuid(),
                    type: "REDO",
                    userId: user,
                    eventId: userRedoStack[userRedoStack.length - 1],
                    shapeId: null,
                    data: null,
                    firedAt: new Date().toISOString(),
                };
            }
            break;
        }
    }

    if (event) {
        createEvent(event);

        // Refresh canvas
        if (event.type === "UNDO" || event.type === "REDO") {
            useCanvasState.setState({ refresh: Math.random() * 100 });
        }

        // Emit event to server
        if (socket.connected && room) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (event?.data !== null) event.data = JSON.stringify(event.data);

            socket.emit("create:event", { room, event });
        }
    }
};
