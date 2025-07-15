import type { ShapeEvent } from "@/types/event";
import { create } from "zustand";

interface EventStore {
    events: ShapeEvent[];
    shapes: Map<string, Record<string, unknown>>;

    userUndoStacks: Map<string, string[]>;
    userRedoStacks: Map<string, string[]>;

    addEvent: (event: ShapeEvent) => void;
    computeState: () => Map<string, Record<string, unknown>>;
    canUndo: (userId: string) => boolean;
    canRedo: (userId: string) => boolean;
}

export const useEventStore = create<EventStore>((set, get) => ({
    events: [],
    shapes: new Map(),
    userUndoStacks: new Map(),
    userRedoStacks: new Map(),

    addEvent: (event: ShapeEvent) => {
        const state = get();
        const newEvents = [...state.events, event];

        const newUserUndoStacks = new Map(state.userUndoStacks);
        const newUserRedoStacks = new Map(state.userRedoStacks);

        switch (event.type) {
            case "CREATE":
            case "UPDATE":
            case "DELETE": {
                const undoStack = newUserUndoStacks.get(event.userId) || [];
                undoStack.push(event.eventId);
                newUserUndoStacks.set(event.userId, undoStack);

                newUserRedoStacks.set(event.userId, []);
                break;
            }

            case "UNDO": {
                const userUndoStack = newUserUndoStacks.get(event.userId) || [];
                const userRedoStack = newUserRedoStacks.get(event.userId) || [];

                if (userUndoStack.length > 0) {
                    const lastOpId = userUndoStack.pop()!;
                    userRedoStack.push(lastOpId);
                    newUserUndoStacks.set(event.userId, userUndoStack);
                    newUserRedoStacks.set(event.userId, userRedoStack);
                }
                break;
            }

            case "REDO": {
                const userRedoStack = newUserRedoStacks.get(event.userId) || [];
                const userUndoStack = newUserUndoStacks.get(event.userId) || [];

                if (userRedoStack.length > 0) {
                    const lastOpId = userRedoStack.pop()!;
                    userUndoStack.push(lastOpId);
                    newUserRedoStacks.set(event.userId, userRedoStack);
                    newUserUndoStacks.set(event.userId, userUndoStack);
                }
                break;
            }
        }

        const newShapes = get().computeState();

        set({
            events: newEvents,
            shapes: newShapes,
            userUndoStacks: newUserUndoStacks,
            userRedoStacks: newUserRedoStacks,
        });
    },

    computeState: () => {
        const state = get();
        const shapes = new Map<string, Record<string, unknown>>();
        const undoneEvents = new Set<string>();

        for (const op of state.events) {
            if (op.type === "UNDO") {
                undoneEvents.add(op.targetEventId);
            } else if (op.type === "REDO") {
                undoneEvents.delete(op.targetEventId);
            }
        }

        for (const op of state.events) {
            if (undoneEvents.has(op.eventId)) {
                continue;
            }

            switch (op.type) {
                case "CREATE":
                case "UPDATE":
                    shapes.set(op.shapeId, op.data);
                    break;
                case "DELETE":
                    shapes.delete(op.shapeId);
                    break;
            }
        }

        return shapes;
    },

    canUndo: (userId: string) => {
        const state = get();
        const userStack = state.userUndoStacks.get(userId) || [];
        return userStack.length > 0;
    },

    canRedo: (userId: string) => {
        const state = get();
        const userStack = state.userRedoStacks.get(userId) || [];
        return userStack.length > 0;
    },
}));
