import type {
    CanvasMouseDown,
    CanvasMouseMove,
    CanvasMouseUp,
    CanvasObjectModified,
    CanvasObjectScaling,
    CanvasPathCreated,
    CanvasZoom,
    InitializeFabric,
    RenderCanvas,
} from "@/types";
import { handleCreateEvent } from "@/utils/event";
import { createSpecificShape, updateSpecificShape } from "@/utils/shapes";
import * as fabric from "fabric";
import { v4 as uuid } from "uuid";

fabric.FabricObject.ownDefaults.cornerColor = "#4882ED";
fabric.FabricObject.ownDefaults.cornerStyle = "circle";
fabric.FabricObject.ownDefaults.transparentCorners = false;

export const initializeFabric = ({ fabricRef, canvasRef }: InitializeFabric) => {
    const canvasElement = document.getElementById("canvas");

    const canvas = new fabric.Canvas(canvasRef.current!, {
        width: canvasElement?.clientWidth,
        height: canvasElement?.clientHeight,
    });

    canvas.setZoom(2);

    fabricRef.current = canvas;

    return canvas;
};

export const handleCanvasMouseDown = ({ option, canvas, isPanning, shapeRef, selectedToolRef, deleteObjectRef }: CanvasMouseDown) => {
    if (!selectedToolRef.current) return;

    const pointer = canvas.getScenePoint(option.e);

    if (selectedToolRef.current === "panning" && isPanning.current === null) {
        return (isPanning.current = pointer);
    }
    if (selectedToolRef.current === "eraser" && deleteObjectRef.current === null) {
        return (deleteObjectRef.current = []);
    }

    shapeRef.current = createSpecificShape(selectedToolRef.current, pointer);
    if (shapeRef.current) canvas.add(shapeRef.current);
};

export const handleCanvasMouseMove = ({ option, canvas, isPanning, shapeRef, selectedToolRef, deleteObjectRef }: CanvasMouseMove) => {
    if (!selectedToolRef.current) return;

    const pointer = canvas.getScenePoint(option.e);

    if (selectedToolRef.current === "panning" && isPanning.current) {
        const deltaX = pointer.x - isPanning.current.x;
        const deltaY = pointer.y - isPanning.current.y;

        canvas.relativePan(new fabric.Point({ x: deltaX, y: deltaY }));
        isPanning.current = pointer;
        return;
    }

    if (selectedToolRef.current === "eraser" && deleteObjectRef.current !== null) {
        if (!option.target?.uid) return;
        if (!deleteObjectRef.current.find(({ uid }) => uid === option.target?.uid)) {
            option.target.set({ opacity: 0.25 });
            deleteObjectRef.current.push(option.target);

            canvas.requestRenderAll();
            return;
        }
    }

    if (shapeRef.current === null) return;
    updateSpecificShape(selectedToolRef.current, pointer, shapeRef.current);

    canvas.requestRenderAll();
};

export const handleCanvasMouseUp = ({
    canvas,
    isPanning,
    shapeRef,
    selectedToolRef,
    deleteObjectRef,
    setTool,
    createEvent,
}: CanvasMouseUp) => {
    if (!selectedToolRef.current) return;

    if (selectedToolRef.current === "panning") return (isPanning.current = null);

    if (selectedToolRef.current === "eraser" && deleteObjectRef.current?.length) {
        deleteObjectRef.current.forEach((object) => {
            if (object?.uid) {
                canvas.remove(object);

                handleCreateEvent({
                    action: "DELETE",
                    object,
                    createEvent,
                });
            }
        });

        canvas.requestRenderAll();
        return;
    }

    if (shapeRef.current?.uid) {
        canvas.setActiveObject(shapeRef.current);
        shapeRef.current.setCoords();

        handleCreateEvent({
            action: "CREATE",
            object: shapeRef.current,
            createEvent,
        });
    }

    shapeRef.current = null;
    selectedToolRef.current = null;

    setTool("select");
};

export const handleCanvasObjectScaling = ({ option, canvas }: CanvasObjectScaling) => {
    const target = option.target;

    switch (target.type) {
        case "textbox":
        case "i-text": {
            const newFontSize = (target as fabric.IText).fontSize * Math.max(target.scaleX, target.scaleY);
            target.set({
                fontSize: newFontSize,
                scaleX: 1,
                scaleY: 1,
            });
            break;
        }
    }

    target.setCoords();
    canvas.requestRenderAll();
};

export const handleCanvasObjectModified = ({ option, createEvent }: CanvasObjectModified) => {
    const target = option.target;

    if (target instanceof fabric.ActiveSelection) {
        // TODO: Handle active selection for multiple objects modification
    } else {
        if (target?.uid) {
            handleCreateEvent({
                action: "UPDATE",
                object: target,
                createEvent,
            });
        }
    }
};

export const handlePathCreated = ({ option, createEvent }: CanvasPathCreated) => {
    const path = option.path;
    if (!path) return;

    path.set({ uid: uuid() });

    if (path?.uid) {
        handleCreateEvent({
            action: "CREATE",
            object: path,
            createEvent,
        });
    }
};

export const renderCanvas = ({ fabricRef, shapes }: RenderCanvas) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.clear();

    shapes.forEach((object, key) => {
        fabric.util.enlivenObjects([object]).then((enlivenedObjects) => {
            enlivenedObjects.forEach((enlivenedObj) => {
                const object = enlivenedObj as fabric.FabricObject;
                object.set({ uid: key });

                if (object?.uid) canvas.add(object);
            });
        });
    });

    canvas.requestRenderAll();
};

export const handleResize = ({ canvas }: { canvas: fabric.Canvas | null }) => {
    const canvasElement = document.getElementById("canvas");
    if (!canvas || !canvasElement) return;

    canvas.setDimensions({ width: canvasElement.clientWidth, height: canvasElement.clientHeight });
};

export const handleCanvasZoom = ({ option, canvas, setZoom }: CanvasZoom) => {
    const delta = option.e?.deltaY;
    let zoom = canvas.getZoom();

    const minZoom = 1;
    const maxZoom = 10;
    const zoomStep = 0.001;

    zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);

    setZoom(zoom);
    canvas.zoomToPoint(new fabric.Point({ x: option.e.offsetX, y: option.e.offsetY }), zoom);

    option.e.preventDefault();
    option.e.stopPropagation();
};
