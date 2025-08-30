import Konva from "konva";
import type { Device } from "mediasoup-client";
import type { ShapeEvent } from "./event";

type Action = "CREATE" | "UPDATE" | "DELETE" | "UNDO" | "REDO";

export type Attributes = {
    fontSize: string;
    fontFamily: string;
    fontStyle: string;
    fill: string;
    stroke: string;
    strokeWidth: string;
    strokeStyle: string;
    cornerRadius: string;
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
    | "text"
    | "image"
    | "eraser";

export type CanvasProps = {
    stageRef: React.RefObject<Konva.Stage | null>;
    selectedToolRef: React.RefObject<Tool | null>;
    room: string | null;
    device: Device | null;
};

export type ImageUpload = {
    file: File;
    stage: Konva.Stage;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};

export type SidebarProps = {
    stage: Konva.Stage;
};

export type FloatingMenuProps = {
    stage: Konva.Stage;
};

export type FloatingMenuItemProps = {
    open: boolean;
    onOpenChange: () => void;
    currentObject: Konva.Shape;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export type FloatingMenuSubItemProps = {
    currentObject: Konva.Shape;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export type ActionsProps = {
    stage: Konva.Stage;
    currentObject: Konva.Shape;
};

export type ToolbarProps = {
    stage: Konva.Stage;
    selectedToolRef: React.RefObject<Tool | null>;
};

export type InitializeKonva = {
    stageRef: React.RefObject<Konva.Stage | null>;
};

export type CanvasMouseDown = {
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>;
    stage: Konva.Stage;
    layer: Konva.Layer;
    sr: Konva.Rect;
    tr: Konva.Transformer;
    a1: Konva.Circle;
    a2: Konva.Circle;
    startPointRef: React.RefObject<{ x: number; y: number } | null>;
    selectedToolRef: React.RefObject<Tool>;
    shapeRef: React.RefObject<Konva.Shape | null>;
    deleteObjectRef: React.RefObject<Map<string, Konva.Shape> | null>;
};

export type CanvasMouseMove = {
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>;
    stage: Konva.Stage;
    layer: Konva.Layer;
    sr: Konva.Rect;
    tr: Konva.Transformer;
    a1: Konva.Circle;
    a2: Konva.Circle;
    startPointRef: React.RefObject<{ x: number; y: number } | null>;
    selectedToolRef: React.RefObject<Tool>;
    shapeRef: React.RefObject<Konva.Shape | null>;
    deleteObjectRef: React.RefObject<Map<string, Konva.Shape> | null>;
};

export type CanvasMouseUp = {
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>;
    stage: Konva.Stage;
    layer: Konva.Layer;
    sr: Konva.Rect;
    tr: Konva.Transformer;
    a1: Konva.Circle;
    a2: Konva.Circle;
    startPointRef: React.RefObject<{ x: number; y: number } | null>;
    selectedToolRef: React.RefObject<Tool>;
    shapeRef: React.RefObject<Konva.Shape | null>;
    deleteObjectRef: React.RefObject<Map<string, Konva.Shape> | null>;
    setTool: (tool: Tool) => void;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
    setCurrentObject: (object: Konva.Shape | null) => void;
};

export type CanvasClick = {
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>;
    stage: Konva.Stage;
    layer: Konva.Layer;
    sr: Konva.Rect;
    tr: Konva.Transformer;
    a1: Konva.Circle;
    a2: Konva.Circle;
    setCurrentObject: (object: Konva.Shape | null) => void;
};

export type CanvasDoubleClick = {
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>;
    stage: Konva.Stage;
    layer: Konva.Layer;
    sr: Konva.Rect;
    tr: Konva.Transformer;
    isEditing: React.RefObject<boolean>;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};

export type CanvasDragEnd = {
    e: Konva.KonvaEventObject<DragEvent>;
    stage: Konva.Stage;
    layer: Konva.Layer;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
    setCurrentObject: (object: Konva.Shape | null) => void;
};

export type CanvasDragMove = {
    e: Konva.KonvaEventObject<DragEvent>;
    stage: Konva.Stage;
    layer: Konva.Layer;
    a1: Konva.Circle;
    a2: Konva.Circle;
};

export type RenderCanvas = {
    shapes: Map<string, Record<string, unknown>>;
    stageRef: React.RefObject<Konva.Stage | null>;
};

export type CanvasZoom = {
    options: Konva.KonvaEventObject<WheelEvent>;
    stage: Konva.Stage;
    setZoom: (zoom: number) => void;
};

export type WindowKeyDown = {
    e: KeyboardEvent;
    stage: Konva.Stage | null;
    isEditing: React.RefObject<boolean>;
    copiedObjectRef: React.RefObject<Konva.Shape[] | null>;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
    setCurrentObject: (object: Konva.Shape | null) => void;
};

export type StoreCreateEvent = {
    action: Action;
    object: Konva.Node | null;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};
