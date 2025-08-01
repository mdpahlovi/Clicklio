import * as fabric from "fabric";
import type { ShapeEvent } from "./event";

export type Pointer = { x: number; y: number };
type Action = "CREATE" | "UPDATE" | "DELETE" | "UNDO" | "REDO";

export type Attributes = {
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fill: string;
    stroke: string;
    strokeWidth: string;
    opacity: string;
};

export type Tool = "panning" | "select" | "rect" | "triangle" | "circle" | "line" | "arrow" | "path" | "i-text" | "image" | "eraser";

export type CanvasProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    fabricRef: React.RefObject<fabric.Canvas | null>;
    selectedToolRef: React.RefObject<Tool | null>;
};

export type ImageUpload = {
    file: File;
    fabricRef: React.RefObject<fabric.Canvas | null>;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};

export type SidebarProps = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
};

export type FloatingMenuProps = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
};

export type FloatingMenuItemProps = {
    open: boolean;
    onOpenChange: () => void;
    currentObject: fabric.FabricObject | null;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export type FloatingMenuSubItemProps = {
    currentObject: fabric.FabricObject | null;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export type ActionsProps = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    currentObject: fabric.FabricObject;
};

export type ToolbarProps = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    selectedToolRef: React.RefObject<Tool | null>;
};

export type InitializeFabric = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export type CanvasMouseDown = {
    options: fabric.TPointerEventInfo<fabric.TPointerEvent>;
    canvas: fabric.Canvas;
    selectedToolRef: React.RefObject<Tool | null>;
    isPanning: React.RefObject<Pointer | null>;
    shapeRef: React.RefObject<fabric.FabricObject | null>;
};

export type CanvasMouseMove = {
    options: fabric.TPointerEventInfo<fabric.TPointerEvent>;
    canvas: fabric.Canvas;
    isPanning: React.RefObject<Pointer | null>;
    selectedToolRef: React.RefObject<Tool | null>;
    shapeRef: React.RefObject<fabric.FabricObject | null>;
    deleteObjectRef: React.RefObject<fabric.FabricObject[]>;
};

export type CanvasMouseUp = {
    canvas: fabric.Canvas;
    isPanning: React.RefObject<Pointer | null>;
    shapeRef: React.RefObject<fabric.FabricObject | null>;
    selectedToolRef: React.RefObject<Tool | null>;
    deleteObjectRef: React.RefObject<fabric.FabricObject[]>;
    setTool: (tool: Tool) => void;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};

export type CanvasObjectModified = {
    options: fabric.ModifiedEvent<fabric.TPointerEvent>;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};

export type CanvasPathCreated = {
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
    options: { path: fabric.FabricObject };
};

export type RenderCanvas = {
    shapes: Map<string, Record<string, unknown>>;
    fabricRef: React.RefObject<fabric.Canvas | null>;
};

export type CanvasZoom = {
    options: fabric.TPointerEventInfo<WheelEvent>;
    canvas: fabric.Canvas;
    setZoom: (zoom: number) => void;
};

export type WindowKeyDown = {
    e: KeyboardEvent;
    canvas: fabric.Canvas | null;
    isEditing: React.RefObject<boolean>;
    copiedObjectRef: React.RefObject<fabric.FabricObject | null>;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
};

export type StoreCreateEvent = {
    action: Action;
    object: fabric.FabricObject | null;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};
