import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { handleKeyDown } from "@/utils/key-event";
import Konva from "konva";
import { useCallback, useEffect, useRef } from "react";

import {
    handleCanvasDoubleClick,
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

    const selectedToolRef = useRef<Tool | null>(null);
    const copiedObjectRef = useRef<Konva.Node | null>(null);
    const deleteObjectRef = useRef<Map<string, Konva.Node> | null>(null);

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
        const stage = initializeKonva({ stageRef });

        stage.on("mousedown touchstart", (e) => {
            handleCanvasMouseDown({ e, stage, shapeRef, selectedToolRef, deleteObjectRef });
        });

        stage.on("mousemove touchmove", throttledMouseMove);

        stage.on("mouseup touchend", (e) => {
            handleCanvasMouseUp({ e, stage, shapeRef, selectedToolRef, deleteObjectRef, setTool, createEvent });
        });

        stage.on("dblclick dbltap", (e) => {
            handleCanvasDoubleClick({ e, stage, isEditing, createEvent });
        });

        stage.on("click tap", (e) => {
            const clickedNode = e.target;
            if (clickedNode === stage) {
                setCurrentObject(null);
            } else {
                setCurrentObject(clickedNode);
            }
        });

        stage.on("wheel", throttledZoom);

        window.addEventListener("resize", throttledResize);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDownEvent);

        return () => {
            stage.destroy();

            throttledMouseMove.cancel();
            throttledZoom.cancel();
            throttledResize.cancel();

            window.removeEventListener("resize", throttledResize);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDownEvent);
        };
    }, [throttledMouseMove, throttledZoom, throttledResize, handleKeyUp, handleKeyDownEvent]);

    return { stageRef, selectedToolRef };
}
