import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import type { ShapeEvent } from "@/types/event";
import { create } from "zustand";

interface EventStore {
    events: ShapeEvent[];
    shapes: Map<string, Record<string, unknown>>;

    userUndoStacks: Map<string, string[]>;
    userRedoStacks: Map<string, string[]>;

    lastProcessedEventCount: number;
    cachedUndoneEvents: Set<string>;
    createEvent: (event: ShapeEvent) => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    resetEvent: () => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
    events: [],
    shapes: new Map(),
    userUndoStacks: new Map(),
    userRedoStacks: new Map(),
    lastProcessedEventCount: 0,
    cachedUndoneEvents: new Set(),

    createEvent: (event: ShapeEvent) => {
        const state = get();
        const newEvents = [...state.events, event];

        const newUserUndoStacks = new Map(state.userUndoStacks);
        const newUserRedoStacks = new Map(state.userRedoStacks);

        switch (event.type) {
            case "CREATE":
            case "UPDATE":
            case "DELETE": {
                const undoStack = [...(newUserUndoStacks.get(event.userId) || [])];
                undoStack.push(event.id);
                newUserUndoStacks.set(event.userId, undoStack);

                newUserRedoStacks.set(event.userId, []);
                break;
            }

            case "UNDO": {
                const userUndoStack = [...(newUserUndoStacks.get(event.userId) || [])];
                const userRedoStack = [...(newUserRedoStacks.get(event.userId) || [])];

                if (userUndoStack.length > 0) {
                    const lastOpId = userUndoStack.pop()!;
                    userRedoStack.push(lastOpId);
                    newUserUndoStacks.set(event.userId, userUndoStack);
                    newUserRedoStacks.set(event.userId, userRedoStack);
                }
                break;
            }

            case "REDO": {
                const userRedoStack = [...(newUserRedoStacks.get(event.userId) || [])];
                const userUndoStack = [...(newUserUndoStacks.get(event.userId) || [])];

                if (userRedoStack.length > 0) {
                    const lastOpId = userRedoStack.pop()!;
                    userUndoStack.push(lastOpId);
                    newUserRedoStacks.set(event.userId, userRedoStack);
                    newUserUndoStacks.set(event.userId, userUndoStack);
                }
                break;
            }
        }

        let undoneEvents = state.cachedUndoneEvents;
        const needsUndoneReCalc = event.type === "UNDO" || event.type === "REDO" || state.lastProcessedEventCount !== state.events.length;

        if (needsUndoneReCalc) {
            undoneEvents = new Set<string>();
            for (const op of newEvents) {
                if (op.type === "UNDO" && op.eventId) {
                    undoneEvents.add(op.eventId);
                } else if (op.type === "REDO" && op.eventId) {
                    undoneEvents.delete(op.eventId);
                }
            }
        }

        let newShapes = state.shapes;
        const needsShapeRebuild = needsUndoneReCalc || ["CREATE", "UPDATE", "DELETE"].includes(event.type);

        if (needsShapeRebuild) {
            newShapes = new Map();

            for (const op of newEvents) {
                if (undoneEvents.has(op.id)) {
                    continue;
                }

                switch (op.type) {
                    case "CREATE":
                    case "UPDATE":
                        newShapes.set(op.shapeId!, op.data!);
                        break;
                    case "DELETE":
                        newShapes.delete(op.shapeId!);
                        break;
                }
            }
        }

        set({
            events: newEvents,
            shapes: newShapes,
            userUndoStacks: newUserUndoStacks,
            userRedoStacks: newUserRedoStacks,
            lastProcessedEventCount: newEvents.length,
            cachedUndoneEvents: undoneEvents,
        });
    },

    canUndo: () => {
        const userId = useCanvasState.getState().user;
        const userStack = get().userUndoStacks.get(userId) || [];
        return userStack.length > 0;
    },

    canRedo: () => {
        const userId = useCanvasState.getState().user;
        const userStack = get().userRedoStacks.get(userId) || [];
        return userStack.length > 0;
    },

    resetEvent: () => {
        set({
            events: [],
            shapes: new Map(),
            userUndoStacks: new Map(),
            userRedoStacks: new Map(),
            lastProcessedEventCount: 0,
            cachedUndoneEvents: new Set(),
        });
    },
}));
