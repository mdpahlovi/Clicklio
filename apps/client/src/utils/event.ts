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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                event = {
                    id: uuid(),
                    type: action,
                    shapeId: object?.uid,
                    ...(action !== "DELETE" ? { data: object.toJSON() } : {}),
                    userId: user,
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
                    eventId: userUndoStack[userUndoStack.length - 1],
                    userId: user,
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
                    eventId: userRedoStack[userRedoStack.length - 1],
                    userId: user,
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
            if (event.type === "CREATE" || event.type === "UPDATE") {
                // @ts-expect-error
                event.data = JSON.stringify(event.data);
            }

            socket.emit("create:event", { room, event });
        }
    }
};
