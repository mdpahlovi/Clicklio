import { anchorConfig, selectRectConfig, transformerConfig } from "@/constants";
import type {
    CanvasClick,
    CanvasDoubleClick,
    CanvasDragEnd,
    CanvasDragMove,
    CanvasMouseDown,
    CanvasMouseMove,
    CanvasMouseUp,
    CanvasTransformEnd,
    CanvasZoom,
    InitializeKonva,
    RenderCanvas,
} from "@/types";
import { handleCreateEvent } from "@/utils/event";
import { createSpecificShape, updateSpecificShape } from "@/utils/shapes";
import { setTransformer } from "@/utils/utils";
import Konva from "konva";

/**
 * Initialize Konva stage with all essential components
 * Creates stage, layer, transformer, and selection rectangle
 * Returns stage with all utilities ready
 */
export const initializeKonva = ({ stageRef }: InitializeKonva) => {
    // Create stage
    const stage = new Konva.Stage({
        container: "canvas",
        width: window.innerWidth,
        height: window.innerHeight,
    });

    stageRef.current = stage;

    // Create layer
    const layer = new Konva.Layer();

    // Create select rect and transformer
    const sr = new Konva.Rect(selectRectConfig);
    const tr = new Konva.Transformer(transformerConfig);
    const a1 = new Konva.Circle({ ...anchorConfig, name: "Anchor_1" });
    const a2 = new Konva.Circle({ ...anchorConfig, name: "Anchor_2" });

    layer.add(sr);
    layer.add(tr);
    layer.add(a1);
    layer.add(a2);
    stage.add(layer);

    return { stage, layer, sr, tr, a1, a2 };
};

/**
 * handle mouse down event on canvas to start drawing shapes
 * create shape and add it to Konva layer
 */
export const handleCanvasMouseDown = ({
    e,
    stage,
    layer,
    sr,
    startPointRef,
    selectedToolRef,
    shapeRef,
    deleteObjectRef,
}: CanvasMouseDown) => {
    const pointer = stage.getRelativePointerPosition();
    if (!pointer) return;
    startPointRef.current = { x: pointer.x, y: pointer.y };

    if (selectedToolRef.current === "panning") {
        stage.draggable(true);
        stage.container().style.cursor = "grabbing";
        return;
    }

    if (selectedToolRef.current === "select") {
        if (e.target instanceof Konva.Shape) return;

        sr.setAttrs({
            x: pointer.x,
            y: pointer.y,
            width: 0,
            height: 0,
            visible: true,
        });

        sr.moveToTop();
        return;
    }

    if (selectedToolRef.current === "eraser" && deleteObjectRef.current === null) {
        deleteObjectRef.current = new Map<string, Konva.Shape>();
        return;
    }

    shapeRef.current = createSpecificShape(selectedToolRef.current, pointer) || null;
    if (shapeRef?.current?.id()) layer.add(shapeRef.current);
};

/**
 * handle mouse move event on canvas to draw shapes
 * update shape position
 * update Konva layer
 */
export const handleCanvasMouseMove = ({ e, stage, sr, startPointRef, selectedToolRef, shapeRef, deleteObjectRef }: CanvasMouseMove) => {
    const pointer = stage.getRelativePointerPosition();
    if (!pointer || !startPointRef.current) return;

    if (selectedToolRef.current === "panning") {
        return;
    }

    if (selectedToolRef.current === "select") {
        if (!sr.visible()) return;

        sr.setAttrs({
            x: Math.min(startPointRef.current.x, pointer.x),
            y: Math.min(startPointRef.current.y, pointer.y),
            width: Math.abs(pointer.x - startPointRef.current.x),
            height: Math.abs(pointer.y - startPointRef.current.y),
        });

        return;
    }

    if (selectedToolRef.current === "eraser" && deleteObjectRef.current !== null) {
        if (e.target instanceof Konva.Shape) {
            deleteObjectRef.current.set(e.target.id(), e.target);
            e.target.opacity(0.5);
        }
        return;
    }

    if (!shapeRef.current) return;
    updateSpecificShape(selectedToolRef.current, startPointRef.current, pointer, shapeRef.current, e.evt.shiftKey);
};

/**
 * handle mouse up event on canvas to stop drawing shapes
 * if tool is eraser, delete shapes form deleteObjectRef
 * set shapeRef to actual Konva shape
 * set shapeRef and selectedToolRef to null
 */
export const handleCanvasMouseUp = ({
    stage,
    sr,
    tr,
    a1,
    a2,
    startPointRef,
    selectedToolRef,
    shapeRef,
    deleteObjectRef,
    setTool,
    createEvent,
    setCurrentObject,
}: CanvasMouseUp) => {
    if (selectedToolRef.current === "panning") {
        stage.draggable(false);
        stage.container().style.cursor = "grab";
        return;
    }

    if (selectedToolRef.current === "select") {
        if (!sr.visible()) return;

        if (sr.width() > 5 || sr.height() > 5) {
            const cr = sr.getClientRect();

            const allShapes = stage.find("Shape").filter((shape) => !!shape.id());
            const fltShapes = allShapes.filter((shape) => {
                const shapeBox = shape.getClientRect();
                return Konva.Util.haveIntersection(cr, shapeBox);
            });

            setTransformer(tr, a1, a2, fltShapes, setCurrentObject);
        }

        sr.visible(false);
        return;
    }

    if (selectedToolRef.current === "eraser" && deleteObjectRef.current !== null) {
        if (deleteObjectRef.current.size === 0) return;

        tr.nodes(tr.nodes().filter((node) => !deleteObjectRef.current!.has(node.id())));
        deleteObjectRef.current.forEach((object) => {
            if (object.id()) {
                object.destroy();
                handleCreateEvent({
                    action: "DELETE",
                    object,
                    createEvent,
                });
            }
        });

        deleteObjectRef.current = null;
    }

    // sync shape in storage
    if (shapeRef.current?.id()) {
        if (shapeRef.current.width() > 5 || shapeRef.current.height() > 5) {
            handleCreateEvent({
                action: "CREATE",
                object: shapeRef.current,
                createEvent,
            });

            setTransformer(tr, a1, a2, [shapeRef.current], setCurrentObject);
        } else {
            shapeRef.current.destroy();
        }
    }

    startPointRef.current = null;
    selectedToolRef.current = "select";
    shapeRef.current = null;
    setTool("select");
};

export const handleCanvasClick = ({ e, tr, a1, a2, setCurrentObject }: CanvasClick) => {
    // if (e.target.name().includes("Anchor")) return;

    // If clicking on empty area
    if (e.target instanceof Konva.Stage) {
        tr.nodes([]);
        a1.visible(false);
        a2.visible(false);
        setCurrentObject(null);
        return;
    }

    // If clicking on a shape
    if (e.target instanceof Konva.Shape) {
        const isMPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().includes(e.target);

        let nodes = [];
        if (!isMPressed) {
            nodes = [e.target];
        } else {
            nodes = [...tr.nodes()];
            if (isSelected) {
                const index = nodes.indexOf(e.target);
                if (index > -1) nodes.splice(index, 1);
            } else {
                nodes.push(e.target);
            }
        }

        setTransformer(tr, a1, a2, nodes, setCurrentObject);
    }
};

/**
 * handle double click event on canvas to edit text
 */
export const handleCanvasDoubleClick = ({ e, stage, layer, tr, isEditing, createEvent }: CanvasDoubleClick) => {
    if (isEditing.current) return;
    if (!(e.target instanceof Konva.Text)) return;

    isEditing.current = true;

    const tNode = e.target;

    // Hide the text node and its transformer
    tNode.hide();
    tr.hide();
    layer.draw();

    // Get position relative to the stage container
    const textPosition = tNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
    };

    // Create textarea for editing
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = tNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = tNode.width() - tNode.padding() * 2 + "px";
    textarea.style.height = tNode.height() - tNode.padding() * 2 + 5 + "px";
    textarea.style.fontSize = tNode.fontSize() + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = tNode.lineHeight()?.toString() || "1";
    textarea.style.fontFamily = tNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = tNode.align();
    textarea.style.color = tNode.fill()?.toString() || "#000";

    const rotation = tNode.rotation();
    let transform = "";
    if (rotation) {
        transform += "rotateZ(" + rotation + "deg)";
    }
    transform += "translateY(-2px)";
    textarea.style.transform = transform;

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + 3 + "px";

    textarea.focus();

    function removeTextarea() {
        textarea.parentNode?.removeChild(textarea);
        window.removeEventListener("click", handleOutsideClick);
        window.removeEventListener("touchstart", handleOutsideClick);
        tNode.show();
        if (tr) tr.show();

        isEditing.current = false;
    }

    function setTextareaWidth(newWidth = 0) {
        if (!newWidth) {
            newWidth = tNode.text().length * tNode.fontSize();
        }
        textarea.style.width = newWidth + "px";
    }

    textarea.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            tNode.text(textarea.value);
            handleCreateEvent({
                action: "UPDATE",
                object: tNode,
                createEvent,
            });
            removeTextarea();
        }
        if (e.key === "Escape") {
            removeTextarea();
        }
    });

    textarea.addEventListener("input", function () {
        const scale = tNode.getAbsoluteScale().x;
        setTextareaWidth(tNode.width() * scale);
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + tNode.fontSize() + "px";
    });

    function handleOutsideClick(e: MouseEvent | TouchEvent) {
        if (e.target !== textarea) {
            tNode.text(textarea.value);
            handleCreateEvent({
                action: "UPDATE",
                object: tNode,
                createEvent,
            });
            removeTextarea();
        }
    }

    setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
        window.addEventListener("touchstart", handleOutsideClick);
    }, 0);
};

export const handleCanvasDragMove = ({ e, layer, a1, a2 }: CanvasDragMove) => {
    const node = e.target;

    if (node.name() === "Anchor_1") {
        const shape = layer.findOne(`#${node.getAttr("shapeId")}`);
        if (shape) {
            const [, , x2, y2] = (shape as Konva.Line).points();

            const relativeX1 = node.x() - shape.x();
            const relativeY1 = node.y() - shape.y();

            (shape as Konva.Line).points([relativeX1, relativeY1, x2, y2]);
        }
    }

    if (node.name() === "Anchor_2") {
        const shape = layer.findOne(`#${node.getAttr("shapeId")}`);
        if (shape) {
            const [x1, y1] = (shape as Konva.Line).points();

            const relativeX2 = node.x() - shape.x();
            const relativeY2 = node.y() - shape.y();

            (shape as Konva.Line).points([x1, y1, relativeX2, relativeY2]);
        }
    }

    if ((node instanceof Konva.Line || node instanceof Konva.Arrow) && node.points().length === 4) {
        const points = node.points();
        a1.setPosition({ x: points[0] + node.x(), y: points[1] + node.y() });
        a2.setPosition({ x: points[2] + node.x(), y: points[3] + node.y() });
    }
};

export const handleCanvasDragEnd = ({ e, layer, createEvent, setCurrentObject }: CanvasDragEnd) => {
    const node = e.target;

    if (node.name() === "Anchor_1") {
        const shape = layer.findOne(`#${node.getAttr("shapeId")}`);
        if (shape) {
            setCurrentObject(shape as Konva.Shape);
        }

        return;
    }

    if (node.name() === "Anchor_2") {
        const shape = layer.findOne(`#${node.getAttr("shapeId")}`);
        if (shape) {
            setCurrentObject(shape as Konva.Shape);
        }

        return;
    }

    if (node instanceof Konva.Shape) {
        if (node.id()) {
            handleCreateEvent({
                action: "UPDATE",
                object: e.target,
                createEvent,
            });
        }

        setCurrentObject(node);
    }
};

export const handleCanvasTransformEnd = ({ e, createEvent, setCurrentObject }: CanvasTransformEnd) => {
    const node = e.target;

    if (node instanceof Konva.Shape) {
        node.setAttrs({
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            scaleX: 1,
            scaleY: 1,
        });

        if (node.id()) {
            handleCreateEvent({
                action: "UPDATE",
                object: e.target,
                createEvent,
            });
        }

        setCurrentObject(node);
    }
};

// render canvas objects coming from storage on canvas
export const renderCanvas = ({ stageRef, shapes }: RenderCanvas) => {
    if (!stageRef.current) return;

    const layer = stageRef.current.getLayers()[0];

    layer.find("Shape").forEach((shape) => {
        if (shape.id()) shape.destroy();
    });

    shapes.forEach((object, key) => {
        const shape = Konva.Node.create(object, undefined);
        shape.setAttr("id", key);
        stageRef.current?.getLayers()[0].add(shape);
    });
};

// resize canvas dimensions on window resize
export const handleResize = ({ stage }: { stage: Konva.Stage | null }) => {
    const canvasElement = document.getElementById("canvas");
    if (!stage || !canvasElement) return;

    stage.width(canvasElement.clientWidth);
    stage.height(canvasElement.clientHeight);
};

// zoom canvas on mouse scroll
export const handleCanvasZoom = ({ options, stage, setZoom }: CanvasZoom) => {
    const scaleBy = 1.1;
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = options.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setZoom(newScale);
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
};
