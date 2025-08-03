import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { handleKeyDown } from "@/utils/key-event";
import Konva from "konva";
import { useEffect, useRef } from "react";

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

export function useCanvas() {
    const { createEvent } = useEventStore();
    const { setTool, setZoom, setCurrentObject } = useCanvasState();

    const stageRef = useRef<Konva.Stage | null>(null);

    const isEditing = useRef<boolean>(false); // Means Talking Input From Keyboard
    const shapeRef = useRef<Konva.Shape | null>(null);

    const selectedToolRef = useRef<Tool>("select");
    const copiedObjectRef = useRef<Konva.Node[] | null>(null);
    const deleteObjectRef = useRef<Map<string, Konva.Node> | null>(null);
    const lastPanPointRef = useRef<{ x: number; y: number } | null>(null);
    const selectRPointRef = useRef<{ x: number; y: number } | null>(null);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { stageRef, selectedToolRef };
}
