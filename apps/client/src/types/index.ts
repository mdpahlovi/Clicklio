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
    currentObject: Konva.Node | null;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export type FloatingMenuSubItemProps = {
    currentObject: Konva.Node | null;
    handleInputChange: (property: keyof Attributes, value: string) => void;
};

export type ActionsProps = {
    stage: Konva.Stage;
    currentObject: Konva.Node;
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
    selectedToolRef: React.RefObject<Tool | null>;
    shapeRef: React.RefObject<Konva.Shape | null>;
    deleteObjectRef: React.RefObject<Map<string, Konva.Node> | null>;
    lastPanPointRef: React.RefObject<{ x: number; y: number } | null>;
    selectRPointRef: React.RefObject<{ x: number; y: number } | null>;
};

export type CanvasMouseMove = {
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>;
    stage: Konva.Stage;
    selectedToolRef: React.RefObject<Tool | null>;
    shapeRef: React.RefObject<Konva.Shape | null>;
    deleteObjectRef: React.RefObject<Map<string, Konva.Node> | null>;
    lastPanPointRef: React.RefObject<{ x: number; y: number } | null>;
    selectRPointRef: React.RefObject<{ x: number; y: number } | null>;
};

export type CanvasMouseUp = {
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>;
    stage: Konva.Stage;
    selectedToolRef: React.RefObject<Tool | null>;
    shapeRef: React.RefObject<Konva.Shape | null>;
    deleteObjectRef: React.RefObject<Map<string, Konva.Node> | null>;
    lastPanPointRef: React.RefObject<{ x: number; y: number } | null>;
    selectRPointRef: React.RefObject<{ x: number; y: number } | null>;

    setTool: (tool: Tool) => void;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
    setCurrentObject: (object: Konva.Node | null) => void;
};

export type CanvasClick = {
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>;
    stage: Konva.Stage;

    setCurrentObject: (object: Konva.Node | null) => void;
};

export type CanvasDoubleClick = {
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>;
    stage: Konva.Stage;
    isEditing: React.RefObject<boolean>;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};

export type CanvasDragEnd = {
    e: Konva.KonvaEventObject<DragEvent>;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
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
    copiedObjectRef: React.RefObject<Konva.Node | null>;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
    setTool: (tool: Tool) => void;
    setZoom: (zoom: number) => void;
};

export type StoreCreateEvent = {
    action: Action;
    object: Konva.Node | null;
    createEvent: (event: ShapeEvent, isPrivate: boolean) => void;
};
