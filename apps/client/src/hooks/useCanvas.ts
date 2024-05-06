import { useEffect, useRef } from "react";
import { handleKeyDown } from "@/utils/key-events";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";

import {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasObjectModified,
    handleCanvasObjectMoving,
    handleCanvasObjectScaling,
    handleCanvasSelectionCreated,
    handleCanvasZoom,
    handlePathCreated,
    handleResize,
    initializeFabric,
} from "@/utils/canvas";

import type { Pointer, Tool } from "@/types";

export function useCanvas() {
    const { setShape, updateShape, deleteShape } = useShapeState();
    const { setTool, setZoom, setAttributes, updateAttributes } = useCanvasState();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const isDrawing = useRef(false);
    const isEditingRef = useRef(false);
    const isPanning = useRef<Pointer | null>(null);
    const shapeRef = useRef<fabric.Object | null>(null);
    const selectedToolRef = useRef<Tool | null>(null);

    const pasteTimeRef = useRef<number | null>(null);
    const copiedObjectRef = useRef<fabric.Object[] | null>(null);

    useEffect(() => {
        const canvas = initializeFabric({ canvasRef, fabricRef });

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({ options, canvas, isDrawing, isPanning, shapeRef, selectedToolRef });
        });

        canvas.on("mouse:move", (options) => {
            handleCanvasMouseMove({ options, canvas, isDrawing, isPanning, shapeRef, selectedToolRef });
        });

        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({ canvas, isDrawing, isPanning, shapeRef, selectedToolRef, setTool, setShape });
        });

        canvas.on("path:created", (options) => {
            handlePathCreated({ options, setShape });
        });

        canvas.on("object:modified", (options) => {
            handleCanvasObjectModified({ options, updateShape });
        });

        canvas.on("object:moving", (options) => {
            handleCanvasObjectMoving({ options, updateAttributes });
        });

        canvas.on("selection:created", (options) => {
            handleCanvasSelectionCreated({ options, isEditingRef, pasteTimeRef, setAttributes });
        });

        canvas.on("object:scaling", (options) => {
            handleCanvasObjectScaling({ options, updateAttributes });
        });

        canvas.on("mouse:wheel", (options) => {
            handleCanvasZoom({ options, canvas, setZoom });
        });

        window.addEventListener("resize", () => handleResize({ canvas }));
        window.addEventListener("keydown", (e) => handleKeyDown({ e, canvas, pasteTimeRef, copiedObjectRef, setShape, deleteShape }));

        return () => {
            canvas.dispose();
            window.removeEventListener("resize", () => handleResize({ canvas: null }));
            window.removeEventListener("keydown", (e) =>
                handleKeyDown({ e, canvas: null, pasteTimeRef, copiedObjectRef, setShape, deleteShape }),
            );
        };
    }, []);

    return { canvasRef, fabricRef, isEditingRef, selectedToolRef, pasteTimeRef, copiedObjectRef };
}
