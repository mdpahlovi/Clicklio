import { useCanvasState } from "@/hooks/useCanvasState";
import { useShapeState } from "@/hooks/useShapeState";
import { handleKeyDown } from "@/utils/key-events";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasObjectModified,
    handleCanvasZoom,
    handlePathCreated,
    handleResize,
    initializeFabric,
} from "@/utils/canvas";

import type { Pointer, Tool } from "@/types";
import { useColorScheme } from "@mui/joy";

export function useCanvas() {
    const { mode, setMode } = useColorScheme();
    const { setShape, updateShape, deleteShape, undo, redo } = useShapeState();
    const { setTool, setZoom, setCurrentObject, removeCurrentObject, setRefresh } = useCanvasState();

    const [searchParams] = useSearchParams();
    const roomRef = useRef<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const isPanning = useRef<Pointer | null>(null);
    const isEditing = useRef<boolean>(false); // Means Talking Input From Keyboard
    const shapeRef = useRef<fabric.FabricObject | null>(null);

    const selectedToolRef = useRef<Tool | null>(null);
    const deleteObjectRef = useRef<fabric.FabricObject[]>([]);
    const copiedObjectRef = useRef<fabric.FabricObject | null>(null);

    const baseColorRef = useRef<string | null>(null);

    useEffect(() => {
        mode === "light" ? (baseColorRef.current = "#000000") : (baseColorRef.current = "#FFFFFF");

        if (fabricRef.current)
            fabricRef.current.forEachObject((object) => {
                switch (mode) {
                    case "light":
                        if (object.fill === "#FFFFFF") object.set({ fill: "#000000" });
                        if (object.stroke === "#FFFFFF") object.set({ stroke: "#000000" });
                        break;
                    case "dark":
                        if (object.fill === "#000000") object.set({ fill: "#FFFFFF" });
                        if (object.stroke === "#000000") object.set({ stroke: "#FFFFFF" });
                        break;
                }
            });

        fabricRef.current?.requestRenderAll();
    }, [mode]);

    useEffect(() => {
        roomRef.current = searchParams.get("room");

        const canvas = initializeFabric({ canvasRef, fabricRef });

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({ options, canvas, isPanning, shapeRef, selectedToolRef, baseColorRef });
        });

        canvas.on("mouse:move", (options) => {
            handleCanvasMouseMove({ options, canvas, isPanning, shapeRef, selectedToolRef, deleteObjectRef });
        });

        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({
                canvas,
                roomRef,
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
            handleCanvasObjectModified({ options, roomRef, updateShape });
        });

        canvas.on("selection:created", (options) => {
            if (options?.selected?.length === 1) setCurrentObject(options?.selected[0]);
        });

        canvas.on("selection:updated", (options) => {
            if (options?.selected?.length === 1) setCurrentObject(options?.selected[0]);
        });

        canvas.on("selection:cleared", () => removeCurrentObject());

        canvas.on("text:editing:entered", () => (isEditing.current = true));

        canvas.on("text:editing:exited", () => (isEditing.current = false));

        canvas.on("mouse:wheel", (options) => handleCanvasZoom({ options, canvas, setZoom }));

        window.addEventListener("resize", () => handleResize({ canvas }));
        window.addEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
        window.addEventListener("keydown", (e) =>
            handleKeyDown({
                e,
                canvas,
                roomRef,
                isEditing,
                copiedObjectRef,
                setShape,
                deleteShape,
                undo,
                redo,
                setTool,
                setZoom,
                setMode,
                setRefresh,
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
                    isEditing,
                    copiedObjectRef,
                    setShape,
                    deleteShape,
                    undo,
                    redo,
                    setTool,
                    setZoom,
                    setMode,
                    setRefresh,
                })
            );
        };
    }, []);

    return { canvasRef, fabricRef, roomRef, selectedToolRef };
}
