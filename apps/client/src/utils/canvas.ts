import { transformerConfig } from "@/constants";
import type {
    CanvasDoubleClick,
    CanvasMouseDown,
    CanvasMouseMove,
    CanvasMouseUp,
    CanvasZoom,
    InitializeKonva,
    RenderCanvas,
} from "@/types";
import { handleCreateEvent } from "@/utils/event";
import { createSpecificShape } from "@/utils/shapes";
import Konva from "konva";

/**
 * initialize Konva stage
 * initialize Konva layer
 * add Konva layer to Konva stage
 * return Konva stage
 */
export const initializeKonva = ({ stageRef }: InitializeKonva) => {
    const stage = new Konva.Stage({
        container: "canvas",
        width: window.innerWidth,
        height: window.innerHeight,
    });

    stageRef.current = stage;
    const layer = new Konva.Layer();

    stage.add(layer);

    return stage;
};

/**
 * handle mouse down event on canvas to start drawing shapes
 * create shape and add it to Konva layer
 */
export const handleCanvasMouseDown = ({ stage, selectedToolRef, deleteObjectRef, shapeRef }: CanvasMouseDown) => {
    if (!selectedToolRef.current) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    stage.find("Transformer").forEach((tr) => tr.destroy());

    if (selectedToolRef.current === "eraser" && deleteObjectRef.current === null) {
        deleteObjectRef.current = new Map<string, Konva.Node>();
        return;
    }

    shapeRef.current = createSpecificShape(selectedToolRef.current, pointer) || null;
    if (shapeRef.current) stage.getLayers()[0].add(shapeRef.current);
};

/**
 * handle mouse move event on canvas to draw shapes
 * update shape position
 * update Konva layer
 */
export const handleCanvasMouseMove = ({ e, stage, selectedToolRef, deleteObjectRef, shapeRef }: CanvasMouseMove) => {
    if (!selectedToolRef.current) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    if (selectedToolRef.current === "eraser" && deleteObjectRef.current !== null) {
        if (e.target instanceof Konva.Shape) {
            deleteObjectRef.current.set(e.target.id(), e.target);
            e.target.opacity(0.5);
        }
        stage.batchDraw();
    }

    if (!shapeRef.current) return;
};

/**
 * handle mouse up event on canvas to stop drawing shapes
 * if tool is eraser, delete shapes form deleteObjectRef
 * set shapeRef to actual Konva shape
 * set shapeRef and selectedToolRef to null
 */
export const handleCanvasMouseUp = ({ stage, shapeRef, selectedToolRef, deleteObjectRef, setTool, createEvent }: CanvasMouseUp) => {
    if (!selectedToolRef.current) return;

    if (selectedToolRef.current === "eraser" && deleteObjectRef.current !== null) {
        deleteObjectRef.current.forEach((object) => {
            if (object?.id()) {
                object.destroy();

                handleCreateEvent({
                    action: "DELETE",
                    object,
                    createEvent,
                });
            }
        });
    }

    // sync shape in storage
    if (shapeRef.current?.id()) {
        const tr = new Konva.Transformer(transformerConfig([shapeRef.current]));
        stage.getLayers()[0].add(tr);

        handleCreateEvent({
            action: "CREATE",
            object: shapeRef.current,
            createEvent,
        });
    }

    shapeRef.current = null;
    selectedToolRef.current = null;
    deleteObjectRef.current = null;

    setTool("select");
};

export const handleCanvasDoubleClick = ({ e, stage, isEditing, createEvent }: CanvasDoubleClick) => {
    if (isEditing.current) return;
    if (!(e.target instanceof Konva.Text)) return;

    isEditing.current = true;

    const tNode = e.target;
    const layer = stage.getLayers()[0];

    // Hide the text node and its transformer
    tNode.hide();
    const tr = layer.findOne("Transformer");
    if (tr) tr.hide();
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
        layer.draw();
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

// render canvas objects coming from storage on canvas
export const renderCanvas = ({ stageRef, shapes }: RenderCanvas) => {
    if (!stageRef.current) return;

    // clear canvas
    stageRef.current.getLayers()[0].destroyChildren();

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
