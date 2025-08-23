import * as fabric from "fabric";
import type { ShapeEvent } from "./event";

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

export type Tool =
    | "panning"
    | "select"
    | "rect"
    | "diamond"
    | "triangle"
    | "circle"
    | "line"
    | "arrow"
    | "path"
    | "i-text"
    | "image"
    | "eraser";

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
    option: fabric.TPointerEventInfo<fabric.TPointerEvent>;
    canvas: fabric.Canvas;
    isPanning: React.RefObject<fabric.Point | null>;
    selectedToolRef: React.RefObject<Tool | null>;
    shapeRef: React.RefObject<fabric.FabricObject | null>;
    deleteObjectRef: React.RefObject<fabric.FabricObject[] | null>;
};

export type CanvasMouseMove = {
    option: fabric.TPointerEventInfo<fabric.TPointerEvent>;
    canvas: fabric.Canvas;
    isPanning: React.RefObject<fabric.Point | null>;
    selectedToolRef: React.RefObject<Tool | null>;
    shapeRef: React.RefObject<fabric.FabricObject | null>;
    deleteObjectRef: React.RefObject<fabric.FabricObject[] | null>;
};

export type CanvasMouseUp = {
    canvas: fabric.Canvas;
    isPanning: React.RefObject<fabric.Point | null>;
    selectedToolRef: React.RefObject<Tool | null>;
    shapeRef: React.RefObject<fabric.FabricObject | null>;
    deleteObjectRef: React.RefObject<fabric.FabricObject[] | null>;
    setTool: (tool: Tool) => void;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};

export type CanvasObjectScaling = {
    option: fabric.BasicTransformEvent<fabric.TPointerEvent> & {
        target: fabric.FabricObject;
    };
    canvas: fabric.Canvas;
};

export type CanvasObjectModified = {
    option: fabric.ModifiedEvent<fabric.TPointerEvent>;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};

export type CanvasPathCreated = {
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
    option: { path: fabric.FabricObject };
};

export type RenderCanvas = {
    shapes: Map<string, Record<string, unknown>>;
    fabricRef: React.RefObject<fabric.Canvas | null>;
};

export type CanvasZoom = {
    option: fabric.TPointerEventInfo<WheelEvent>;
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
