import type {
    CanvasMouseDown,
    CanvasMouseMove,
    CanvasMouseUp,
    CanvasObjectModified,
    CanvasPathCreated,
    CanvasZoom,
    InitializeFabric,
    RenderCanvas,
} from "@/types";
import { createSpecificShape } from "@/utils/shapes";
import * as fabric from "fabric";
import { v4 as uuid4 } from "uuid";
import { Arrow } from "./arrow";
import { handleAddEvent } from "./event";

fabric.FabricObject.ownDefaults.cornerColor = "#4882ED";
fabric.FabricObject.ownDefaults.cornerStyle = "circle";
fabric.FabricObject.ownDefaults.transparentCorners = false;

// initialize fabric canvas
export const initializeFabric = ({ fabricRef, canvasRef }: InitializeFabric) => {
    // get canvas element
    const canvasElement = document.getElementById("canvas");

    // create fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current!, {
        width: canvasElement?.clientWidth,
        height: canvasElement?.clientHeight,
    });

    canvas.setZoom(2);
    // set canvas reference to fabricRef so we can use it later anywhere outside canvas listener
    fabricRef.current = canvas;

    return canvas;
};

// instantiate creation of custom fabric object/shape and add it to canvas
export const handleCanvasMouseDown = ({ options, canvas, isPanning, selectedToolRef, shapeRef, baseColorRef }: CanvasMouseDown) => {
    // if canvas is in DrawingMode, return
    if (canvas.isDrawingMode) return;
    // if selectedTool is select or image, return
    if (selectedToolRef.current === "select" || selectedToolRef.current === "image") return;

    // get pointer coordinates
    const pointer = canvas.getScenePoint(options.e);

    // if selected shape is panning, set panning points
    if (selectedToolRef.current === "panning") return (isPanning.current = pointer);

    // create custom fabric object/shape and add it to canvas
    shapeRef.current = createSpecificShape(selectedToolRef.current, pointer, baseColorRef);
    if (shapeRef.current) canvas.add(shapeRef.current);
};

// handle mouse move event on canvas to draw shapes with different dimensions
export const handleCanvasMouseMove = ({ options, canvas, isPanning, selectedToolRef, deleteObjectRef, shapeRef }: CanvasMouseMove) => {
    // if canvas is in DrawingMode, return
    if (canvas.isDrawingMode) return;
    // if selectedTool is select or image, return
    if (selectedToolRef.current === "select" || selectedToolRef.current === "image") return;

    // get pointer coordinates
    const pointer = canvas.getScenePoint(options.e);

    // calculate deltaX and deltaY points for panning
    if (selectedToolRef.current === "panning" && isPanning.current) {
        const deltaX = pointer.x - isPanning.current.x;
        const deltaY = pointer.y - isPanning.current.y;

        canvas.relativePan(new fabric.Point({ x: deltaX, y: deltaY }));
        isPanning.current = pointer;
        return;
    }

    // set target object to deleteObjectRef for eraser
    if (selectedToolRef.current === "eraser") {
        if (!options.target?.uid) return;
        if (!deleteObjectRef.current.find(({ uid }) => uid === options.target?.uid)) {
            options.target.set({ opacity: 0.25 });
            deleteObjectRef.current.push(options.target);

            canvas.requestRenderAll();
            return;
        }
    }

    // if no shape.current, then return
    if (shapeRef.current === null) return;
    const { left, top } = shapeRef.current;

    // depending on the selected shape, set the dimensions of the shape stored in shapeRef in previous step of handelCanvasMouseDown
    // calculate shape dimensions based on pointer coordinates
    switch (selectedToolRef?.current) {
        case "rect":
            (shapeRef.current as fabric.Rect).set({
                width: pointer.x - left,
                height: pointer.y - top,
            });
            break;

        case "triangle":
            (shapeRef.current as fabric.Triangle).set({
                width: pointer.x - left,
                height: pointer.y - top,
            });
            break;

        case "circle":
            (shapeRef.current as fabric.Circle).set({
                radius: Math.abs(pointer.x - left) / 2,
            });
            break;

        case "line":
            (shapeRef.current as fabric.Line).set({
                x2: pointer.x,
                y2: pointer.y,
            });
            break;

        case "arrow":
            (shapeRef.current as Arrow).set({
                x2: pointer.x,
                y2: pointer.y,
            });
            break;
    }

    // render objects on canvas
    // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
    canvas.requestRenderAll();
};

// handle mouse up event on canvas to stop drawing shapes
export const handleCanvasMouseUp = ({
    canvas,
    roomRef,
    isPanning,
    shapeRef,
    selectedToolRef,
    deleteObjectRef,
    setTool,
    addEvent,
}: CanvasMouseUp) => {
    // if canvas is in DrawingMode, return
    if (canvas.isDrawingMode) return;
    // if selectedTool is select or image, return
    if (selectedToolRef.current === "select" || selectedToolRef.current === "image") return;

    // set panning to null
    if (selectedToolRef.current === "panning") return (isPanning.current = null);

    // eraser all shape from deleteObjectRef
    if (selectedToolRef.current === "eraser" && deleteObjectRef.current.length) {
        deleteObjectRef.current.forEach((object) => {
            if (object?.uid) {
                canvas.remove(object);

                // sync in storage
                handleAddEvent({
                    action: "DELETE",
                    object,
                    addEvent,
                    room: roomRef.current,
                });
            }
        });

        canvas.requestRenderAll();
        return;
    }

    // sync shape in storage
    if (shapeRef.current?.uid) {
        // set active object to current shape
        canvas.setActiveObject(shapeRef.current);
        shapeRef.current.setCoords();

        // sync in storage
        handleAddEvent({
            action: "CREATE",
            object: shapeRef.current,
            addEvent,
            room: roomRef.current,
        });
    }

    // set everything to null
    shapeRef.current = null;
    selectedToolRef.current = null;

    // if canvas is not in drawing mode, set active element to select
    if (!canvas.isDrawingMode) setTool("select");
};

// update shape in storage when object is modified
export const handleCanvasObjectModified = ({ options, roomRef, addEvent }: CanvasObjectModified) => {
    const target = options.target;
    if (!target) return;

    if (target instanceof fabric.ActiveSelection) {
        // console.log("activeselection", { target });
    } else {
        // sync shape in storage
        if (target?.uid) {
            handleAddEvent({
                action: "UPDATE",
                object: target,
                addEvent,
                room: roomRef.current,
            });
        }
    }
};

// update shape in storage when path is created when in path mode
export const handlePathCreated = ({ options, roomRef, addEvent }: CanvasPathCreated) => {
    // get path object
    const path = options.path;
    if (!path) return;

    // set unique id to path object
    path.set({ uid: uuid4() });

    // sync shape in storage
    if (path?.uid) {
        handleAddEvent({
            action: "CREATE",
            object: path,
            addEvent,
            room: roomRef.current,
        });
    }
};

// render canvas objects coming from storage on canvas
export const renderCanvas = ({ fabricRef, shapes }: RenderCanvas) => {
    // clear canvas
    fabricRef.current?.clear();

    // render all objects on canvas
    shapes.forEach((object, key) => {
        fabric.util.enlivenObjects([object]).then((enlivenedObjects) => {
            enlivenedObjects.forEach((enlivenedObj) => {
                const object = enlivenedObj as fabric.FabricObject;
                object.set({ uid: key });

                // add object to canvas
                if (object?.uid) fabricRef.current?.add(object);
            });
        });
    });

    fabricRef.current?.requestRenderAll();
};

// resize canvas dimensions on window resize
export const handleResize = ({ canvas }: { canvas: fabric.Canvas | null }) => {
    const canvasElement = document.getElementById("canvas");
    if (!canvas || !canvasElement) return;

    canvas.setDimensions({ width: canvasElement.clientWidth, height: canvasElement.clientHeight });
};

// zoom canvas on mouse scroll
export const handleCanvasZoom = ({ options, canvas, setZoom }: CanvasZoom) => {
    const delta = options.e?.deltaY;
    let zoom = canvas.getZoom();

    // allow zooming to min 100% and max 1000%
    const minZoom = 1;
    const maxZoom = 10;
    const zoomStep = 0.001;

    // calculate zoom based on mouse scroll wheel with min and max zoom
    zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);

    // set zoom to canvas
    // zoomToPoint: http://fabricjs.com/docs/fabric.Canvas.html#zoomToPoint
    setZoom(zoom);
    canvas.zoomToPoint(new fabric.Point({ x: options.e.offsetX, y: options.e.offsetY }), zoom);

    options.e.preventDefault();
    options.e.stopPropagation();
};
