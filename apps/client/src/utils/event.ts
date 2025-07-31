import { useAuthState } from "@/stores/auth/useAuthStore";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { StoreCreateEvent } from "@/types";
import type { ShapeEvent } from "@/types/event";
import { socket } from "@/utils/socket";
import { v4 as uuid } from "uuid";

export const handleCreateEvent = ({ action, object, createEvent }: StoreCreateEvent) => {
    const auth = useAuthState.getState().user?.id;
    const user = useCanvasState.getState().user;
    const room = useCanvasState.getState().room;

    const wPathname = window.location.pathname.split("/")[1];
    const isPrivate = !!auth && wPathname === "room";

    let event: ShapeEvent | null = null;
    switch (action) {
        case "CREATE":
        case "UPDATE":
        case "DELETE": {
            if (object?.uid) {
                event = {
                    id: uuid(),
                    type: action,
                    userId: isPrivate ? auth : user,
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
                    userId: isPrivate ? auth : user,
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
                    userId: isPrivate ? auth : user,
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
        createEvent(event, isPrivate);

        // Refresh canvas
        if (event.type === "UNDO" || event.type === "REDO") {
            useCanvasState.setState({ refresh: Math.random() * 100 });
        }

        // Emit event to server
        if (socket.connected && room) {
            socket.emit("create:event", { room, event, isPrivate });
        }
    }
};
