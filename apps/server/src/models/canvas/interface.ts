import { Document, Model } from "mongoose";

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

export interface ICanvas extends Document {
    code: string;
    name: string;
    image: string;
    elements: Element[];
}

export type CanvasModel = Model<ICanvas, Record<string, unknown>>;
