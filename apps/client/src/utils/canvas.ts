import { fabric } from "fabric";
import { v4 as uuid4 } from "uuid";
import { socket } from "@/utils/socket";
import { createSpecificShape } from "@/utils/shapes";

import type {
    InitializeFabric,
    CanvasMouseDown,
    CanvasMouseMove,
    CanvasMouseUp,
    CanvasObjectModified,
    CanvasObjectScaling,
    CanvasObjectMoving,
    CanvasPathCreated,
    CanvasSelectionCreated,
    CanvasZoom,
    RenderCanvas,
} from "@/types";

// initialize fabric canvas
export const initializeFabric = ({ fabricRef, canvasRef }: InitializeFabric) => {
    // get canvas element
    const canvasElement = document.getElementById("canvas");

    // create fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasElement?.clientWidth,
        height: canvasElement?.clientHeight,
    });

    // set canvas reference to fabricRef so we can use it later anywhere outside canvas listener
    fabricRef.current = canvas;

    return canvas;
};

// instantiate creation of custom fabric object/shape and add it to canvas
export const handleCanvasMouseDown = ({ options, canvas, isDrawing, isPanning, selectedToolRef, shapeRef }: CanvasMouseDown) => {
    // if selected shape is path, return
    if (!selectedToolRef.current) return;

    // get pointer coordinates
    const pointer = canvas.getPointer(options.e);

    /**
     * get target object i.e., the object that is clicked
     * findtarget() returns the object that is clicked
     *
     * findTarget: http://fabricjs.com/docs/fabric.Canvas.html#findTarget
     */
    const target = canvas.findTarget(options.e, false);

    // if selected shape is panning, set panning points
    if (selectedToolRef.current === "panning") {
        isDrawing.current = true;
        canvas.selection = false;
        isPanning.current = pointer;

        return;
    }

    // if target is the selected shape or active selection, set isDrawing to false
    if (target && (target.type === selectedToolRef.current || target.type === "activeSelection")) {
        isDrawing.current = false;

        // set active object to target
        canvas.setActiveObject(target);

        /**
         * setCoords() is used to update the controls of the object
         * setCoords: http://fabricjs.com/docs/fabric.Object.html#setCoords
         */
        target.setCoords();
    } else {
        isDrawing.current = true;

        // create custom fabric object/shape and add it to canvas
        shapeRef.current = createSpecificShape(selectedToolRef.current, pointer);
        if (shapeRef.current) canvas.add(shapeRef.current);
    }
};

// handle mouse move event on canvas to draw shapes with different dimensions
export const handleCanvasMouseMove = ({ options, canvas, isDrawing, isPanning, selectedToolRef, shapeRef }: CanvasMouseMove) => {
    // if selected shape is path, return
    if (!isDrawing.current) return;
    if (!selectedToolRef.current) return;

    // get pointer coordinates
    const pointer = canvas.getPointer(options.e);

    if (selectedToolRef.current === "panning" && isPanning.current) {
        const deltaX = pointer.x - isPanning.current.x;
        const deltaY = pointer.y - isPanning.current.y;

        canvas.relativePan({ x: deltaX, y: deltaY });
        isPanning.current = pointer;
        return;
    }

    // if no shape.current, then return
    if (shapeRef.current === null) return;
    const { left, top } = shapeRef.current;

    // depending on the selected shape, set the dimensions of the shape stored in shapeRef in previous step of handelCanvasMouseDown
    // calculate shape dimensions based on pointer coordinates
    switch (selectedToolRef?.current) {
        case "rect":
            (shapeRef.current as fabric.Rect).set({
                width: pointer.x - (left || 0),
                height: pointer.y - (top || 0),
            });
            break;

        case "triangle":
            (shapeRef.current as fabric.Triangle).set({
                width: pointer.x - (left || 0),
                height: pointer.y - (top || 0),
            });
            break;

        case "circle":
            (shapeRef.current as fabric.Circle).set({
                radius: Math.abs(pointer.x - (left || 0)) / 2,
            });
            break;

        case "line":
            (shapeRef.current as fabric.Line).set({
                x2: pointer.x,
                y2: pointer.y,
            });
            break;
    }

    // render objects on canvas
    // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
    canvas.renderAll();
};

// handle mouse up event on canvas to stop drawing shapes
export const handleCanvasMouseUp = ({ canvas, isDrawing, isPanning, shapeRef, selectedToolRef, setTool, setShape }: CanvasMouseUp) => {
    isDrawing.current = false;
    if (!selectedToolRef.current) return;

    // sync shape in storage
    // @ts-ignore
    if (shapeRef.current?.objectId) {
        // @ts-ignore
        setShape({ objectId: shapeRef.current.objectId, ...shapeRef.current.toJSON() });
        // @ts-ignore
        socket.emit("set:shape", { objectId: shapeRef.current.objectId, ...shapeRef.current.toJSON() });
    }

    // set panning to null
    if (selectedToolRef.current === "panning") {
        canvas.selection = true;
        isPanning.current = null;

        return;
    }

    // set everything to null
    shapeRef.current = null;
    selectedToolRef.current = null;

    // if canvas is not in drawing mode, set active element to select
    if (!canvas.isDrawingMode) setTool("select");
};

// update shape in storage when object is modified
export const handleCanvasObjectModified = ({ options, updateShape }: CanvasObjectModified) => {
    const target = options.target;
    if (!target) return;

    if (target?.type == "activeSelection") {
        // fix this
    } else {
        // sync shape in storage
        // @ts-ignore
        if (target?.objectId) {
            // @ts-ignore
            updateShape({ objectId: target.objectId, ...target.toJSON() });
            // @ts-ignore
            socket.emit("update:shape", { objectId: target.objectId, ...target.toJSON() });
        }
    }
};

// update shape in storage when path is created when in path mode
export const handlePathCreated = ({ options, setShape }: CanvasPathCreated) => {
    // get path object
    const path = options.path;
    if (!path) return;

    // set unique id to path object
    // @ts-ignore
    path.set({ objectId: uuid4() });

    // sync shape in storage
    // @ts-ignore
    if (path?.objectId) {
        // @ts-ignore
        setShape({ objectId: path.objectId, ...path.toJSON() });
        // @ts-ignore
        socket.emit("set:shape", { objectId: path.objectId, ...path.toJSON() });
    }
};

// check how object is moving on canvas and restrict it to canvas boundaries
export const handleCanvasObjectMoving = ({ options, updateAttributes }: CanvasObjectMoving) => {
    // get target object which is moving
    const target = options.target;

    // target.canvas is the canvas on which the object is moving
    const canvas = target?.canvas;

    // if no target element, return
    if (!target || !canvas) return;

    // set coordinates of target object
    target.setCoords();

    // restrict object to canvas boundaries (horizontal)
    if (target.left) {
        target.left = Math.max(0, Math.min(target.left, (canvas.width || 0) - (target.getScaledWidth() || target.width || 0)));

        updateAttributes("left", (target.left || 0).toString());
    }

    // restrict object to canvas boundaries (vertical)
    if (target.top) {
        target.top = Math.max(0, Math.min(target.top, (canvas.height || 0) - (target.getScaledHeight() || target.height || 0)));

        updateAttributes("top", (target.top || 0).toString());
    }
};

// set selectShape when element is selected
export const handleCanvasSelectionCreated = ({ options, isEditingRef, setAttributes }: CanvasSelectionCreated) => {
    // if user is editing manually, return
    if (isEditingRef.current) return;

    // if no element is selected, return
    if (!options?.selected) return;

    // if only one element is selected, set attributes
    // @ts-ignore
    if (options.selected.length === 1) setAttributes({ ...options.selected[0].toJSON() });
};

// update selectShape when element is scaled
export const handleCanvasObjectScaling = ({ options, updateAttributes }: CanvasObjectScaling) => {
    // if no target element, return
    if (!options.target) return;
    const { scaleX, scaleY, width, height } = options.target;
    const w = width ? width : 0;
    const h = height ? height : 0;

    // calculate scaled dimensions of the object
    updateAttributes("width", (scaleX ? w * scaleX : w).toString());
    updateAttributes("height", (scaleY ? h * scaleY : h).toString());
};

// render canvas objects coming from storage on canvas
export const renderCanvas = ({ fabricRef, shapes }: RenderCanvas) => {
    // clear canvas
    fabricRef.current?.clear();

    // render all objects on canvas
    shapes.forEach((object) => {
        /**
         * enlivenObjects() is used to render objects on canvas.
         * It takes two arguments:
         * 1. objectData: object data to render on canvas
         * 2. callback: callback function to execute after rendering objects
         * on canvas
         *
         * enlivenObjects: http://fabricjs.com/docs/fabric.util.html#.enlivenObjectEnlivables
         */
        fabric.util.enlivenObjects(
            [object],
            (enlivenedObjects: fabric.Object[]) => {
                enlivenedObjects.forEach((enlivenedObj) => {
                    // add object to canvas
                    fabricRef.current?.add(enlivenedObj);
                });
            },
            /**
             * specify namespace of the object for fabric to render it on canvas
             * A namespace is a string that is used to identify the type of
             * object.
             *
             * Fabric Namespace: http://fabricjs.com/docs/fabric.html
             */
            "fabric",
        );
    });

    fabricRef.current?.renderAll();
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

    // allow zooming to min 10% and max 1000%
    const minZoom = 0.1;
    const maxZoom = 10;
    const zoomStep = 0.001;

    // calculate zoom based on mouse scroll wheel with min and max zoom
    zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);

    // set zoom to canvas
    // zoomToPoint: http://fabricjs.com/docs/fabric.Canvas.html#zoomToPoint
    setZoom(zoom);
    canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);

    options.e.preventDefault();
    options.e.stopPropagation();
};
