import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { handleKeyDown } from "@/utils/key-events";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";

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

import { useEventStore } from "@/stores/canvas/useEventStore";
import type { Pointer, Tool } from "@/types";
import { useColorScheme } from "@mui/joy";

export function useCanvas() {
    const { addEvent } = useEventStore();
    const { mode, setMode } = useColorScheme();
    const { setTool, setZoom, setCurrentObject } = useCanvasState();

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
        switch (mode) {
            case "light":
                baseColorRef.current = "#000000";
                break;
            case "dark":
                baseColorRef.current = "#FFFFFF";
                break;
        }

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
                isPanning,
                shapeRef,
                selectedToolRef,
                deleteObjectRef,
                setTool,
                addEvent,
            });
        });

        canvas.on("path:created", (options) => {
            handlePathCreated({ options, addEvent });
        });

        canvas.on("object:modified", (options) => {
            handleCanvasObjectModified({ options, addEvent });
        });

        canvas.on("selection:created", (options) => {
            if (options?.selected?.length === 1) setCurrentObject(options?.selected[0]);
        });

        canvas.on("selection:updated", (options) => {
            if (options?.selected?.length === 1) setCurrentObject(options?.selected[0]);
        });

        canvas.on("selection:cleared", () => setCurrentObject(null));

        canvas.on("text:editing:entered", () => (isEditing.current = true));

        canvas.on("text:editing:exited", () => (isEditing.current = false));

        canvas.on("mouse:wheel", (options) => handleCanvasZoom({ options, canvas, setZoom }));

        window.addEventListener("resize", () => handleResize({ canvas }));
        window.addEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
        window.addEventListener("keydown", (e) =>
            handleKeyDown({
                e,
                canvas,
                isEditing,
                copiedObjectRef,
                addEvent,
                undo: () => {
                    // UNDO REDO FUNCTIONALITY
                },
                redo: () => {
                    // UNDO REDO FUNCTIONALITY
                },
                setTool,
                setZoom,
                setMode,
            }),
        );

        return () => {
            canvas.dispose();
            window.removeEventListener("resize", () => handleResize({ canvas: null }));
            window.removeEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
            window.removeEventListener("keydown", (e) =>
                handleKeyDown({
                    e,
                    canvas: null,
                    isEditing,
                    copiedObjectRef,
                    addEvent,
                    undo: () => {
                        // UNDO REDO FUNCTIONALITY
                    },
                    redo: () => {
                        // UNDO REDO FUNCTIONALITY
                    },
                    setTool,
                    setZoom,
                    setMode,
                }),
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { canvasRef, fabricRef, selectedToolRef };
}
