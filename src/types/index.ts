/* eslint-disable @typescript-eslint/no-explicit-any */
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
    width: number;
    height: number;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fill: string;
    stroke: string;
};

export type Shape = "panning" | "select" | "rectangle" | "triangle" | "circle" | "line" | "freeform" | "text" | "image";

export type NavElement = {
    value: Shape;
    name: string;
    icon: React.ReactNode;
};

export type ModifyShape = {
    canvas: fabric.Canvas;
    property: string;
    value: any;
    activeObjectRef: React.MutableRefObject<fabric.Object | null>;
};

export type ElementDirection = {
    canvas: fabric.Canvas;
    direction: string;
};

export type ImageUpload = {
    file: File;
    canvas: React.MutableRefObject<fabric.Canvas>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
};

export type RightSidebarProps = {
    elementAttributes: Attributes;
    setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    activeObjectRef: React.MutableRefObject<fabric.Object | null>;
    isEditingRef: React.MutableRefObject<boolean>;
};

export type InitializeFabric = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

export type CanvasMouseDown = {
    options: fabric.IEvent;
    canvas: fabric.Canvas;
    selectedShapeRef: React.MutableRefObject<Shape | null>;
    isDrawing: React.MutableRefObject<boolean>;
    isPanning: React.MutableRefObject<Pointer | null>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
};

export type CanvasMouseMove = {
    options: fabric.IEvent;
    canvas: fabric.Canvas;
    isDrawing: React.MutableRefObject<boolean>;
    isPanning: React.MutableRefObject<Pointer | null>;
    selectedShapeRef: React.MutableRefObject<Shape | null>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
};

export type CanvasMouseUp = {
    canvas: fabric.Canvas;
    isDrawing: React.MutableRefObject<boolean>;
    isPanning: React.MutableRefObject<Pointer | null>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
    activeObjectRef: React.MutableRefObject<fabric.Object | null>;
    selectedShapeRef: React.MutableRefObject<Shape | null>;
    setActiveElement: React.Dispatch<React.SetStateAction<NavElement | null>>;
};

export type CanvasObjectModified = {
    options: fabric.IEvent;
};

export type CanvasPathCreated = {
    options: (fabric.IEvent & { path: { objectId: string } & fabric.Path }) | any;
};

export type CanvasSelectionCreated = {
    options: fabric.IEvent;
    isEditingRef: React.MutableRefObject<boolean>;
    setElementAttributes: React.Dispatch<React.SetStateAction<Attributes | null>>;
};

export type CanvasObjectScaling = {
    options: fabric.IEvent;
    setElementAttributes: React.Dispatch<React.SetStateAction<Attributes | null>>;
};

export type RenderCanvas = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    canvasObjects: any;
    activeObjectRef: React.MutableRefObject<fabric.Object | null>;
};

export type CanvasZoom = {
    options: fabric.IEvent & { e: WheelEvent };
    canvas: fabric.Canvas;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
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
        }>,
    ) => void;
};
