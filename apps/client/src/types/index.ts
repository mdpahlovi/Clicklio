import { fabric } from "fabric";

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

export type FloatingMenuProps = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    pasteTimeRef: React.MutableRefObject<number | null>;
    copiedObjectRef: React.MutableRefObject<fabric.Object[]>;
};

export type FloatingMenuItemProps = {
    open: boolean;
    onOpenChange: () => void;
    currentObject: fabric.Object | null;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export type FloatingMenuSubItemProps = {
    currentObject: fabric.Object | null;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export type RightSidebarProps = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    pasteTimeRef: React.MutableRefObject<number | null>;
    copiedObjectRef: React.MutableRefObject<fabric.Object[]>;
};

export type ActionsProps = {
    fabricRef: React.MutableRefObject<fabric.Canvas | null>;
    pasteTimeRef: React.MutableRefObject<number | null>;
    copiedObjectRef: React.MutableRefObject<fabric.Object[]>;
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
    isPanning: React.MutableRefObject<Pointer | null>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
    baseColorRef: React.MutableRefObject<string | undefined>;
};

export type CanvasMouseMove = {
    options: fabric.IEvent<MouseEvent>;
    canvas: fabric.Canvas;
    isPanning: React.MutableRefObject<Pointer | null>;
    selectedToolRef: React.MutableRefObject<Tool | null>;
    shapeRef: React.MutableRefObject<fabric.Object | null>;
    deleteObjectRef: React.MutableRefObject<fabric.Object[]>;
};

export type CanvasMouseUp = {
    canvas: fabric.Canvas;
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
};

export type CanvasPathCreated = {
    roomRef: React.MutableRefObject<string | null>;
    setShape: (shape: fabric.Object) => void;
    options: any;
};

export type CanvasSetCurrentObject = {
    options: fabric.IEvent<MouseEvent>;
    pasteTimeRef: React.MutableRefObject<number | null>;
    setCurrentObject: (object: fabric.Object) => void;
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
    pasteTimeRef: React.MutableRefObject<number | null>;
    copiedObjectRef: React.MutableRefObject<fabric.Object[]>;
    setShape: (shape: fabric.Object) => void;
    deleteShape: (id: string) => void;
    undo: (steps?: number) => void;
    redo: (steps?: number) => void;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setMode: (mode: "light" | "dark" | null) => void;
    setRefresh: () => void;
};
