import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { handleKeyDown } from "@/utils/key-event";
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

export function useCanvas() {
    const { createEvent } = useEventStore();
    const { setTool, setZoom, setCurrentObject } = useCanvasState();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const isPanning = useRef<Pointer | null>(null);
    const isEditing = useRef<boolean>(false); // Means Talking Input From Keyboard
    const shapeRef = useRef<fabric.FabricObject | null>(null);

    const selectedToolRef = useRef<Tool | null>(null);
    const deleteObjectRef = useRef<fabric.FabricObject[]>([]);
    const copiedObjectRef = useRef<fabric.FabricObject | null>(null);

    useEffect(() => {
        const canvas = initializeFabric({ canvasRef, fabricRef });

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({ options, canvas, isPanning, shapeRef, selectedToolRef });
        });

        canvas.on("mouse:move", (options) => {
            handleCanvasMouseMove({ options, canvas, isPanning, shapeRef, selectedToolRef, deleteObjectRef });
        });

        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({ canvas, isPanning, shapeRef, selectedToolRef, deleteObjectRef, setTool, createEvent });
        });

        canvas.on("path:created", (options) => {
            handlePathCreated({ options, createEvent });
        });

        canvas.on("object:modified", (options) => {
            handleCanvasObjectModified({ options, createEvent });
        });

        canvas.on("selection:created", (options) => {
            if (options?.selected?.length === 1) {
                setCurrentObject(options?.selected[0]);
            } else {
                canvas.discardActiveObject();
            }
        });

        canvas.on("selection:updated", (options) => {
            if (options?.selected?.length === 1) {
                setCurrentObject(options?.selected[0]);
            } else {
                canvas.discardActiveObject();
            }
        });

        canvas.on("selection:cleared", () => setCurrentObject(null));

        canvas.on("text:editing:entered", () => (isEditing.current = true));

        canvas.on("text:editing:exited", () => (isEditing.current = false));

        canvas.on("mouse:wheel", (options) => handleCanvasZoom({ options, canvas, setZoom }));

        window.addEventListener("resize", () => handleResize({ canvas }));
        window.addEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
        window.addEventListener("keydown", (e) => handleKeyDown({ e, canvas, isEditing, copiedObjectRef, createEvent, setTool, setZoom }));

        return () => {
            canvas.dispose();
            window.removeEventListener("resize", () => handleResize({ canvas: null }));
            window.removeEventListener("keyup", (e) => e.keyCode === 32 && setTool("select"));
            window.removeEventListener("keydown", (e) =>
                handleKeyDown({ e, canvas: null, isEditing, copiedObjectRef, createEvent, setTool, setZoom }),
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { canvasRef, fabricRef, selectedToolRef };
}
