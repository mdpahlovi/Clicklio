export type ShapeEvent = {
    id: string;
    type: "CREATE" | "UPDATE" | "DELETE" | "UNDO" | "REDO";
    userId: string;
    shapeId: string | null;
    eventId: string | null;
    data: Record<string, unknown> | null;
    firedAt: string;
};
