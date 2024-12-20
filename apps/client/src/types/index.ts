import * as fabric from "fabric";

export type Pointer = { x: number; y: number };

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
    | "triangle"
    | "circle"
    | "line"
    | "arrow"
    | "path-1"
    | "path-5"
    | "path-10"
    | "i-text"
    | "image"
    | "video"
    | "eraser";

export type ModifyShape = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    property: keyof Attributes;
    value: string;
    room: string | null;
    updateShape: (shape: fabric.FabricObject) => void;
};

export type ElementDirection = {
    canvas: fabric.Canvas;
    direction: string;
};

export type ImageUpload = {
    file: File;
    room: string | null;
    fabricRef: React.RefObject<fabric.Canvas | null>;
    setShape: (shape: fabric.FabricObject) => void;
};

export type SidebarProps = {
    fabricRef: React.RefObject<fabric.Canvas | null>;
    saveShapes: () => void;
    isUpToDate: boolean;
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
    baseColorRef: React.RefObject<string | null>;
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
    roomRef: React.RefObject<string | null>;
    setTool: (tool: Tool) => void;
    setShape: (shape: fabric.FabricObject) => void;
    deleteShape: (id: string) => void;
};

export type CanvasObjectModified = {
    options: fabric.ModifiedEvent<fabric.TPointerEvent>;
    roomRef: React.RefObject<string | null>;
    updateShape: (shape: fabric.FabricObject) => void;
};

export type CanvasPathCreated = {
    roomRef: React.RefObject<string | null>;
    setShape: (shape: fabric.FabricObject) => void;
    options: { path: fabric.FabricObject };
};

export type RenderCanvas = {
    shapes: fabric.FabricObject[];
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
    roomRef: React.RefObject<string | null>;
    copiedObjectRef: React.RefObject<fabric.FabricObject | null>;
    setShape: (shape: fabric.FabricObject) => void;
    deleteShape: (id: string) => void;
    undo: (steps?: number) => void;
    redo: (steps?: number) => void;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setMode: (mode: "light" | "dark" | null) => void;
    setRefresh: () => void;
};
