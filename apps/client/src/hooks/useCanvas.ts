import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { handleKeyDown } from "@/utils/key-events";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";

import {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasObjectModified,
    handleCanvasSelectionCreated,
    handleCanvasZoom,
    handlePathCreated,
    handleResize,
    initializeFabric,
} from "@/utils/canvas";

import { useColorScheme } from "@mui/joy";
import type { Pointer, Tool } from "@/types";

export function useCanvas() {
    const { setMode } = useColorScheme();
    const { undo, redo } = useShapeState.temporal.getState();
    const { setTool, setZoom, setAttributes } = useCanvasState();
    const { setShape, updateShape, deleteShape } = useShapeState();

    const [searchParams] = useSearchParams();
    const roomRef = useRef<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const isDrawing = useRef(false);
    const isEditingRef = useRef(false);
    const isPanning = useRef<Pointer | null>(null);
    const shapeRef = useRef<fabric.Object | null>(null);
    const selectedToolRef = useRef<Tool | null>(null);

    const pasteTimeRef = useRef<number | null>(null);
    const deleteObjectRef = useRef<fabric.Object[]>([]);
    const copiedObjectRef = useRef<fabric.Object[] | null>(null);

    useEffect(() => {
        roomRef.current = searchParams.get("room");

        const canvas = initializeFabric({ canvasRef, fabricRef });

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({ options, canvas, isDrawing, isPanning, shapeRef, selectedToolRef });
        });

        canvas.on("mouse:move", (options) => {
            handleCanvasMouseMove({ options, canvas, isDrawing, isPanning, shapeRef, selectedToolRef, deleteObjectRef });
        });

        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({
                canvas,
                roomRef,
                isDrawing,
                isPanning,
                shapeRef,
                selectedToolRef,
                deleteObjectRef,
                setTool,
                setShape,
                deleteShape,
            });
        });

        canvas.on("path:created", (options) => {
            handlePathCreated({ options, roomRef, setShape });
        });

        canvas.on("object:modified", (options) => {
            handleCanvasObjectModified({ options, roomRef, updateShape, setAttributes });
        });

        canvas.on("selection:created", (options) => {
            handleCanvasSelectionCreated({ options, isEditingRef, pasteTimeRef, setAttributes });
        });

        canvas.on("mouse:wheel", (options) => {
            handleCanvasZoom({ options, canvas, setZoom });
        });

        window.addEventListener("resize", () => handleResize({ canvas }));
        window.addEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
        window.addEventListener("keydown", (e) =>
            handleKeyDown({
                e,
                canvas,
                roomRef,
                pasteTimeRef,
                copiedObjectRef,
                setShape,
                deleteShape,
                undo,
                redo,
                setTool,
                setZoom,
                setMode,
            })
        );

        return () => {
            canvas.dispose();
            window.removeEventListener("resize", () => handleResize({ canvas: null }));
            window.removeEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
            window.removeEventListener("keydown", (e) =>
                handleKeyDown({
                    e,
                    canvas: null,
                    roomRef,
                    pasteTimeRef,
                    copiedObjectRef,
                    setShape,
                    deleteShape,
                    undo,
                    redo,
                    setTool,
                    setZoom,
                    setMode,
                })
            );
        };
    }, []);

    return { canvasRef, fabricRef, roomRef, isEditingRef, selectedToolRef, pasteTimeRef, copiedObjectRef };
}
