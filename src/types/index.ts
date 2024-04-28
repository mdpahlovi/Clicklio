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

export type Panning = { x: number; y: number };

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
    width: string;
    height: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fill: string;
    stroke: string;
};

export type ActiveElement = {
    name: string;
    value: string;
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
    fabricRef: React.RefObject<fabric.Canvas | null>;
    activeObjectRef: React.RefObject<fabric.Object | null>;
    isEditingRef: React.MutableRefObject<boolean>;
};

export type Presence = any;

export type InitializeFabric = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

export type CanvasMouseDown = {
    options: fabric.IEvent;
    canvas: fabric.Canvas;
    selectedShapeRef: any;
    isDrawing: React.MutableRefObject<boolean>;
    isPanning: React.MutableRefObject<Panning | null>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
};

export type CanvasMouseMove = {
    options: fabric.IEvent;
    canvas: fabric.Canvas;
    isDrawing: React.MutableRefObject<boolean>;
    isPanning: React.MutableRefObject<Panning | null>;
    selectedShapeRef: any;
    shapeRef: any;
};

export type CanvasMouseUp = {
    canvas: fabric.Canvas;
    isDrawing: React.MutableRefObject<boolean>;
    isPanning: React.MutableRefObject<Panning | null>;
    shapeRef: any;
    activeObjectRef: React.MutableRefObject<fabric.Object | null>;
    selectedShapeRef: any;
    setActiveElement: any;
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
    setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type CanvasObjectScaling = {
    options: fabric.IEvent;
    setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type RenderCanvas = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    canvasObjects: any;
    activeObjectRef: any;
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
