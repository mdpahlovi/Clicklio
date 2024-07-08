import { fabric } from "fabric";
import { Gradient, Pattern } from "fabric/fabric-impl";

export enum CursorMode {
    Hidden,
    Chat,
    ReactionSelector,
    Reaction,
}

export type CursorState =
    | { mode: CursorMode.Hidden }
    | { mode: CursorMode.Chat; message: string; previousMessage: string | null }
    | { mode: CursorMode.ReactionSelector }
    | { mode: CursorMode.Reaction; reaction: string; isPressed: boolean };

export type Reaction = {
    value: string;
    timestamp: number;
    point: { x: number; y: number };
};

export type ReactionEvent = {
    x: number;
    y: number;
    value: string;
};

export type Pointer = { x: number; y: number };

export type ShapeData = {
    type: string;
    width: number;
    height: number;
    fill: string | Pattern | Gradient;
    left: number;
    top: number;
    objectId: string | undefined;
};

export type Attributes = {
    type: string;
    top: string;
    left: string;
    width: string;
    height: string;
    scaleX: string;
    scaleY: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fill: string;
    stroke: string;
    strokeWidth: string;
    opacity: string;
};

export type Tool =
    | "panning"
    | "select"
    | "rect"
    | "triangle"
    | "circle"
    | "line"
    | "path-1"
    | "path-5"
    | "path-10"
    | "i-text"
    | "image"
    | "eraser";

export type ModifyShape = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    property: keyof Attributes;
    value: string;
    room: string | null;
    updateShape: (shape: fabric.Object) => void;
};

export type ElementDirection = {
    canvas: fabric.Canvas;
    direction: string;
};

export type ImageUpload = {
    file: File;
    room: string | null;
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    setShape: (shape: fabric.Object) => void;
};

export type RightSidebarProps = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    isEditingRef: React.MutableRefObject<boolean>;
    pasteTimeRef: React.MutableRefObject<number | null>;
    copiedObjectRef: React.MutableRefObject<fabric.Object[] | null>;
};

export type ActionsProps = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    pasteTimeRef: React.MutableRefObject<number | null>;
    copiedObjectRef: React.MutableRefObject<fabric.Object[] | null>;
};

export type ToolbarProps = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    selectedToolRef: React.MutableRefObject<Tool | null>;
};

export type InitializeFabric = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

export type CanvasMouseDown = {
    options: fabric.IEvent<MouseEvent>;
    canvas: fabric.Canvas;
    selectedToolRef: React.MutableRefObject<Tool | null>;
    isDrawing: React.MutableRefObject<boolean>;
    isPanning: React.MutableRefObject<Pointer | null>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
    baseColorRef: React.MutableRefObject<string | undefined>;
};

export type CanvasMouseMove = {
    options: fabric.IEvent<MouseEvent>;
    canvas: fabric.Canvas;
    isDrawing: React.MutableRefObject<boolean>;
    isPanning: React.MutableRefObject<Pointer | null>;
    selectedToolRef: React.MutableRefObject<Tool | null>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
    deleteObjectRef: React.MutableRefObject<fabric.Object[]>;
};

export type CanvasMouseUp = {
    canvas: fabric.Canvas;
    isDrawing: React.MutableRefObject<boolean>;
    isPanning: React.MutableRefObject<Pointer | null>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
    selectedToolRef: React.MutableRefObject<Tool | null>;
    deleteObjectRef: React.MutableRefObject<fabric.Object[]>;
    roomRef: React.MutableRefObject<string | null>;
    setTool: (tool: Tool) => void;
    setShape: (shape: fabric.Object) => void;
    deleteShape: (id: string) => void;
};

export type CanvasObjectModified = {
    options: fabric.IEvent<MouseEvent>;
    roomRef: React.MutableRefObject<string | null>;
    updateShape: (shape: fabric.Object) => void;
    setAttributes: (attributes: Attributes) => void;
};

export type CanvasPathCreated = {
    roomRef: React.MutableRefObject<string | null>;
    setShape: (shape: fabric.Object) => void;
    options: { path: fabric.Object };
};

export type CanvasSelectionCreated = {
    options: fabric.IEvent<MouseEvent>;
    isEditingRef: React.MutableRefObject<boolean>;
    pasteTimeRef: React.MutableRefObject<number | null>;
    setAttributes: (attributes: Attributes) => void;
};

export type RenderCanvas = {
    shapes: fabric.Object[];
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
};

export type CanvasZoom = {
    options: fabric.IEvent<WheelEvent>;
    canvas: fabric.Canvas;
    setZoom: (zoom: number) => void;
};

export type WindowKeyDown = {
    e: KeyboardEvent;
    canvas: fabric.Canvas | null;
    roomRef: React.MutableRefObject<string | null>;
    isEditingRef: React.MutableRefObject<boolean>;
    pasteTimeRef: React.MutableRefObject<number | null>;
    copiedObjectRef: React.MutableRefObject<fabric.Object[] | null>;
    setShape: (shape: fabric.Object) => void;
    deleteShape: (id: string) => void;
    undo: (steps?: number) => void;
    redo: (steps?: number) => void;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setMode: (mode: "light" | "dark" | null) => void;
    setRefresh: () => void;
};

export type CursorChatProps = {
    cursor: { x: number; y: number };
    cursorState: CursorState;
    setCursorState: (cursorState: CursorState) => void;
    updateMyPresence: (
        presence: Partial<{
            cursor: { x: number; y: number };
            cursorColor: string;
            message: string;
        }>
    ) => void;
};
