import { fabric } from "fabric";
import { v4 as uuid4 } from "uuid";
import { defaultNavElement } from "@/constants";
import { createSpecificShape } from "@/utils/shapes";

import type {
    InitializeFabric,
    CanvasMouseDown,
    CanvasMouseMove,
    CanvasMouseUp,
    CanvasObjectModified,
    CanvasObjectScaling,
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

    // define the custom method
    fabric.Object.prototype.toObject = (function (toObject) {
        return function (this: { objectId: string } & fabric.Object) {
            return fabric.util.object.extend(toObject.call(this), { objectId: this.objectId });
        };
    })(fabric.Object.prototype.toObject);

    // set canvas reference to fabricRef so we can use it later anywhere outside canvas listener
    fabricRef.current = canvas;

    return canvas;
};

// instantiate creation of custom fabric object/shape and add it to canvas
export const handleCanvasMouseDown = ({ options, canvas, isDrawing, isPanning, selectedShapeRef, shapeRef }: CanvasMouseDown) => {
    // if selected shape is freeform, return
    if (!selectedShapeRef.current) return;

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
    if (selectedShapeRef.current === "panning") {
        isDrawing.current = true;
        canvas.selection = false;
        isPanning.current = pointer;

        return;
    }

    // if target is the selected shape or active selection, set isDrawing to false
    if (target && (target.type === selectedShapeRef.current || target.type === "activeSelection")) {
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
        shapeRef.current = createSpecificShape(selectedShapeRef.current, pointer);
        if (shapeRef.current) canvas.add(shapeRef.current);
    }
};

// handle mouse move event on canvas to draw shapes with different dimensions
export const handleCanvasMouseMove = ({ options, canvas, isDrawing, isPanning, selectedShapeRef, shapeRef }: CanvasMouseMove) => {
    // if selected shape is freeform, return
    if (!isDrawing.current) return;
    if (!selectedShapeRef.current) return;

    // get pointer coordinates
    const pointer = canvas.getPointer(options.e);

    if (selectedShapeRef.current === "panning" && isPanning.current) {
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
    switch (selectedShapeRef?.current) {
        case "rectangle":
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

        case "image":
            (shapeRef.current as fabric.Image).set({
                width: pointer.x - (left || 0),
                height: pointer.y - (top || 0),
            });
            break;
    }

    // render objects on canvas
    // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
    canvas.renderAll();
};

// handle mouse up event on canvas to stop drawing shapes
export const handleCanvasMouseUp = ({
    canvas,
    isDrawing,
    isPanning,
    shapeRef,
    activeObjectRef,
    selectedShapeRef,
    setActiveElement,
    setShape,
}: CanvasMouseUp) => {
    isDrawing.current = false;
    if (!selectedShapeRef.current) return;

    // sync shape in storage
    // @ts-ignore
    if (shapeRef.current?.objectId) setShape(shapeRef.current);

    // set panning to null
    if (selectedShapeRef.current === "panning") {
        canvas.selection = true;
        isPanning.current = null;

        return;
    }

    // set everything to null
    shapeRef.current = null;
    activeObjectRef.current = null;
    selectedShapeRef.current = null;

    // if canvas is not in drawing mode, set active element to default nav element
    if (!canvas.isDrawingMode) setActiveElement(defaultNavElement);
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
        if (target?.objectId) updateShape(target);
    }
};

// update shape in storage when path is created when in freeform mode
export const handlePathCreated = ({ options, setShape }: CanvasPathCreated) => {
    // get path object
    const path = options.path;
    if (!path) return;

    // set unique id to path object
    path.set({ objectId: uuid4() });

    // sync shape in storage
    // @ts-ignore
    if (path?.objectId) setShape(path);
};

// check how object is moving on canvas and restrict it to canvas boundaries
export const handleCanvasObjectMoving = ({ options }: { options: fabric.IEvent }) => {
    // get target object which is moving
    const target = options.target as fabric.Object;

    // target.canvas is the canvas on which the object is moving
    const canvas = target.canvas as fabric.Canvas;

    // set coordinates of target object
    target.setCoords();

    // restrict object to canvas boundaries (horizontal)
    if (target && target.left) {
        target.left = Math.max(0, Math.min(target.left, (canvas.width || 0) - (target.getScaledWidth() || target.width || 0)));
    }

    // restrict object to canvas boundaries (vertical)
    if (target && target.top) {
        target.top = Math.max(0, Math.min(target.top, (canvas.height || 0) - (target.getScaledHeight() || target.height || 0)));
    }
};

// set element attributes when element is selected
export const handleCanvasSelectionCreated = ({ options, isEditingRef, setElementAttributes }: CanvasSelectionCreated) => {
    // if user is editing manually, return
    if (isEditingRef.current) return;

    // if no element is selected, return
    if (!options?.selected) return;

    // if only one element is selected, set element attributes
    if (options.selected.length === 1) {
        const { scaleX, scaleY, width, height } = options.selected[0];

        // calculate scaled dimensions of the object
        const scaledWidth = scaleX ? width! * scaleX : width;
        const scaledHeight = scaleY ? height! * scaleY : height;

        setElementAttributes((rest) => (rest ? { ...rest, width: scaledWidth || 0, height: scaledHeight || 0 } : null));
    }
};

// update element attributes when element is scaled
export const handleCanvasObjectScaling = ({ options, setElementAttributes }: CanvasObjectScaling) => {
    // if no target element, return
    if (!options.target) return;
    const { scaleX, scaleY, width, height } = options.target;

    // calculate scaled dimensions of the object
    const scaledWidth = scaleX ? width! * scaleX : width;
    const scaledHeight = scaleY ? height! * scaleY : height;

    setElementAttributes((rest) => (rest ? { ...rest, width: scaledWidth || 0, height: scaledHeight || 0 } : null));
};

// render canvas objects coming from storage on canvas
export const renderCanvas = ({ fabricRef, shapes, activeObjectRef }: RenderCanvas) => {
    // clear canvas
    fabricRef.current?.clear();

    // render all objects on canvas
    // @ts-ignore
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
                    // if element is active, keep it in active state so that it can be edited further
                    // @ts-ignore
                    if (activeObjectRef.current?.objectId === object?.objectId) {
                        fabricRef.current?.setActiveObject(enlivenedObj);
                    }

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
    if (!canvasElement) return;

    if (!canvas) return;

    canvas.setDimensions({ width: canvasElement.clientWidth, height: canvasElement.clientHeight });
};

// zoom canvas on mouse scroll
export const handleCanvasZoom = ({ options, canvas, setZoom }: CanvasZoom) => {
    const delta = options.e?.deltaY;
    let zoom = canvas.getZoom();

    // allow zooming to min 20% and max 100%
    const minZoom = 0.2;
    const maxZoom = 1;
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
