export interface BaseEvent {
    eventId: string;
    firedAt: number;
    userId: string;
}

export interface CreateEvent extends BaseEvent {
    type: "CREATE";
    shapeId: string;
    data: Record<string, unknown>;
}

export interface UpdateEvent extends BaseEvent {
    type: "UPDATE";
    shapeId: string;
    data: Record<string, unknown>;
}

export interface DeleteEvent extends BaseEvent {
    type: "DELETE";
    shapeId: string;
}

export interface UndoEvent extends BaseEvent {
    type: "UNDO";
    targetEventId: string;
}

export interface RedoEvent extends BaseEvent {
    type: "REDO";
    targetEventId: string;
}

export type ShapeEvent = CreateEvent | UpdateEvent | DeleteEvent | UndoEvent | RedoEvent;
