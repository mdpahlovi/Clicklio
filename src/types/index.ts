export type Path = [number, number];
export type Tool = "pencil" | "line" | "rectangle" | "ellipse";

export interface Element {
    offsetX: number;
    offsetY: number;
    path?: Path[];
    width?: number;
    height?: number;
    stroke: string;
    tool: Tool;
}

export interface Canvas {
    code: string;
    name: string;
    image: string;
    elements: [Element];
    createdAt: string;
    updatedAt: string;
}
