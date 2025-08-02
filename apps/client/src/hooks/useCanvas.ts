import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { handleKeyDown } from "@/utils/key-event";
import Konva from "konva";
import { useEffect, useRef } from "react";

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

export function useCanvas() {
    const { createEvent } = useEventStore();
    const { setTool, setZoom, setCurrentObject } = useCanvasState();

    const stageRef = useRef<Konva.Stage | null>(null);

    const isEditing = useRef<boolean>(false); // Means Talking Input From Keyboard
    const shapeRef = useRef<Konva.Shape | null>(null);

    const selectedToolRef = useRef<Tool | null>(null);
    const copiedObjectRef = useRef<Konva.Node | null>(null);
    const deleteObjectRef = useRef<Map<string, Konva.Node> | null>(null);

    useEffect(() => {
        const stage = initializeKonva({ stageRef });

        stage.on("mousedown touchstart", (e) => {
            handleCanvasMouseDown({ e, stage, shapeRef, selectedToolRef, deleteObjectRef });
        });

        stage.on("mousemove touchmove", (e) => {
            handleCanvasMouseMove({ e, stage, shapeRef, selectedToolRef, deleteObjectRef });
        });

        stage.on("mouseup touchend", (e) => {
            handleCanvasMouseUp({ e, stage, shapeRef, selectedToolRef, deleteObjectRef, setTool, createEvent });
        });

        stage.on("dblclick dbltap", (e) => {
            handleCanvasDoubleClick({ e, stage, isEditing, createEvent });
        });

        stage.on("wheel", (options) => handleCanvasZoom({ options, stage, setZoom }));

        window.addEventListener("resize", () => handleResize({ stage }));
        window.addEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
        window.addEventListener("keydown", (e) => handleKeyDown({ e, stage, isEditing, copiedObjectRef, createEvent, setTool, setZoom }));

        return () => {
            stage.destroy();
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
