import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { handleKeyDown } from "@/utils/key-event";
import Konva from "konva";
import { useCallback, useEffect, useRef } from "react";

import {
    handleCanvasClick,
    handleCanvasDoubleClick,
    handleCanvasDragEnd,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasZoom,
    handleResize,
    initializeKonva,
} from "@/utils/canvas";

import { useEventStore } from "@/stores/canvas/useEventStore";
import type { Tool } from "@/types";
import { useThrottledCallback } from "use-debounce";

export function useCanvas() {
    const { createEvent } = useEventStore();
    const { zoom, setTool, setZoom, setCurrentObject } = useCanvasState();

    const stageRef = useRef<Konva.Stage | null>(null);

    const isEditing = useRef<boolean>(false);
    const shapeRef = useRef<Konva.Shape | null>(null);

    const selectedToolRef = useRef<Tool>("select");
    const copiedObjectRef = useRef<Konva.Node[] | null>(null);
    const deleteObjectRef = useRef<Map<string, Konva.Node> | null>(null);
    const lastPanPointRef = useRef<{ x: number; y: number } | null>(null);
    const selectRPointRef = useRef<{ x: number; y: number } | null>(null);

    const throttledMouseMove = useThrottledCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!stageRef.current) return;
        handleCanvasMouseMove({ e, stage: stageRef.current, shapeRef, selectedToolRef, deleteObjectRef });
    }, 16);

    const throttledZoom = useThrottledCallback((options: Konva.KonvaEventObject<WheelEvent>) => {
        if (!stageRef.current) return;
        handleCanvasZoom({ options, stage: stageRef.current, setZoom });
    }, 16);

    const throttledResize = useThrottledCallback(() => {
        if (!stageRef.current) return;
        handleResize({ stage: stageRef.current });
    }, 100);

    const handleKeyUp = useCallback(
        (e: KeyboardEvent) => {
            if (isEditing.current) return;
            if (e.key === " " || e.keyCode === 32) setTool("select");
        },
        [setTool],
    );

    const handleKeyDownEvent = useCallback(
        (e: KeyboardEvent) => {
            if (!stageRef.current) return;
            handleKeyDown({
                e,
                stage: stageRef.current,
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
        const konva = initializeKonva({ stageRef });

        konva.stage.on("mousedown touchstart", (e) => {
            handleCanvasMouseDown({
                e,
                ...konva,
                shapeRef,
                selectedToolRef,
                deleteObjectRef,
                lastPanPointRef,
                selectRPointRef,
            });
        });

        konva.stage.on("mousemove touchmove", (e) => {
            handleCanvasMouseMove({
                e,
                ...konva,
                shapeRef,
                selectedToolRef,
                deleteObjectRef,
                lastPanPointRef,
                selectRPointRef,
            });
        });

        konva.stage.on("mouseup touchend", (e) => {
            handleCanvasMouseUp({
                e,
                ...konva,
                shapeRef,
                selectedToolRef,
                deleteObjectRef,
                lastPanPointRef,
                selectRPointRef,
                setTool,
                createEvent,
                setCurrentObject,
            });
        });

        konva.stage.on("click tap", (e) => {
            handleCanvasClick({ e, ...konva, setCurrentObject });
        });

        konva.stage.on("dblclick dbltap", (e) => {
            handleCanvasDoubleClick({ e, ...konva, isEditing, createEvent });
        });

        konva.stage.on("dragend", (e) => {
            handleCanvasDragEnd({ e, createEvent });
        });

        konva.tr.on("transformend", (e) => {
            handleCanvasDragEnd({ e, createEvent });
        });

        konva.stage.on("wheel", (options) => handleCanvasZoom({ options, ...konva, setZoom }));

        window.addEventListener("resize", () => handleResize({ ...konva }));
        window.addEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
        window.addEventListener("keydown", (e) =>
            handleKeyDown({ e, stage: konva.stage, isEditing, copiedObjectRef, createEvent, setTool, setZoom }),
        );

        return () => {
            konva.stage.destroy();
            window.removeEventListener("resize", () => handleResize({ stage: null }));
            window.removeEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
            window.removeEventListener("keydown", (e) =>
                handleKeyDown({ e, stage: null, isEditing, copiedObjectRef, createEvent, setTool, setZoom }),
            );
        };
    }, [throttledMouseMove, throttledZoom, throttledResize, handleKeyUp, handleKeyDownEvent]);

    return { stageRef, selectedToolRef };
}
