import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { handleKeyDown } from "@/utils/key-event";
import * as fabric from "fabric";
import { useCallback, useEffect, useRef } from "react";

import {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasObjectModified,
    handleCanvasObjectScaling,
    handleCanvasZoom,
    handlePathCreated,
    handleResize,
    initializeFabric,
} from "@/utils/canvas";

import { useEventStore } from "@/stores/canvas/useEventStore";
import type { Tool } from "@/types";
import { useThrottledCallback } from "use-debounce";

export function useCanvas() {
    const { createEvent } = useEventStore();
    const { setTool, setZoom, setCurrentObject } = useCanvasState();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const startPoint = useRef<fabric.Point | null>(null);
    const isPanning = useRef<fabric.Point | null>(null);
    const isEditing = useRef<boolean>(false);
    const shapeRef = useRef<fabric.FabricObject | null>(null);

    const selectedToolRef = useRef<Tool | null>(null);
    const copiedObjectRef = useRef<fabric.FabricObject | null>(null);
    const deleteObjectRef = useRef<fabric.FabricObject[] | null>(null);

    const throttledMouseMove = useThrottledCallback((option: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
        if (!fabricRef.current) return;
        handleCanvasMouseMove({
            option,
            canvas: fabricRef.current,
            startPoint,
            isPanning,
            shapeRef,
            selectedToolRef,
            deleteObjectRef,
        });
    }, 16);

    const throttledScaling = useThrottledCallback(
        (option: fabric.BasicTransformEvent<fabric.TPointerEvent> & { target: fabric.FabricObject }) => {
            if (!fabricRef.current) return;
            handleCanvasObjectScaling({ option, canvas: fabricRef.current });
        },
        16,
    );

    const throttledZoom = useThrottledCallback((option: fabric.TPointerEventInfo<WheelEvent>) => {
        if (!fabricRef.current) return;
        handleCanvasZoom({ option, canvas: fabricRef.current, setZoom });
    }, 16);

    const throttledResize = useThrottledCallback(() => {
        if (!fabricRef.current) return;
        handleResize({ canvas: fabricRef.current });
    }, 100);

    const handleKeyUp = useCallback(
        (e: KeyboardEvent) => {
            if (isEditing.current) return;
            if (e.key === " ") setTool("select");
        },
        [setTool],
    );

    const handleKeyDownEvent = useCallback(
        (e: KeyboardEvent) => {
            if (!fabricRef.current) return;
            handleKeyDown({
                e,
                canvas: fabricRef.current,
                isEditing,
                copiedObjectRef,
                createEvent,
                setTool,
                setZoom,
            });
        },
        [createEvent, setTool, setZoom],
    );

    useEffect(() => {
        const canvas = initializeFabric({ canvasRef, fabricRef });

        canvas.on("mouse:down", (option) => {
            handleCanvasMouseDown({
                option,
                canvas,
                startPoint,
                isPanning,
                shapeRef,
                selectedToolRef,
                deleteObjectRef,
            });
        });

        canvas.on("mouse:move", throttledMouseMove);

        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({
                canvas,
                startPoint,
                isPanning,
                shapeRef,
                selectedToolRef,
                deleteObjectRef,
                setTool,
                createEvent,
            });
        });

        canvas.on("path:created", (option) => {
            handlePathCreated({ option, createEvent });
        });

        canvas.on("object:scaling", throttledScaling);

        canvas.on("object:modified", (option) => {
            handleCanvasObjectModified({ option, createEvent });
        });

        canvas.on("selection:created", (option) => {
            if (option?.selected?.length === 1) {
                setCurrentObject(option?.selected[0]);
            } else {
                canvas.discardActiveObject();
            }
        });

        canvas.on("selection:updated", (option) => {
            if (option?.selected?.length === 1) {
                setCurrentObject(option?.selected[0]);
            } else {
                canvas.discardActiveObject();
            }
        });

        canvas.on("selection:cleared", () => setCurrentObject(null));

        canvas.on("text:editing:entered", () => (isEditing.current = true));

        canvas.on("text:editing:exited", () => (isEditing.current = false));

        canvas.on("mouse:wheel", throttledZoom);

        window.addEventListener("resize", throttledResize);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDownEvent);

        return () => {
            canvas.dispose();

            throttledMouseMove.cancel();
            throttledZoom.cancel();
            throttledResize.cancel();

            window.removeEventListener("resize", throttledResize);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDownEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [throttledMouseMove, throttledZoom, throttledResize, handleKeyUp, handleKeyDownEvent]);

    return { canvasRef, fabricRef, selectedToolRef };
}
