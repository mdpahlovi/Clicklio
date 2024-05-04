import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

import type { Pointer, ElementDirection, ImageUpload, ModifyShape, Tool } from "@/types";
import { socket } from "./socket";

export const createRectangle = (pointer: Pointer) => {
    return new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: "#000000",
        objectId: uuidv4(),
    } as { objectId: string } & fabric.Rect);
};

export const createTriangle = (pointer: Pointer) => {
    return new fabric.Triangle({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: "#000000",
        objectId: uuidv4(),
    } as { objectId: string } & fabric.Triangle);
};

export const createCircle = (pointer: Pointer) => {
    return new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: "#000000",
        objectId: uuidv4(),
    } as { objectId: string } & fabric.Circle);
};

export const createLine = (pointer: Pointer) => {
    return new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: "#000000",
        strokeWidth: 2,
        objectId: uuidv4(),
    } as { objectId: string } & fabric.Line);
};

export const createText = (pointer: Pointer, text: string) => {
    return new fabric.IText(text, {
        left: pointer.x,
        top: pointer.y,
        fill: "#000000",
        fontFamily: "Helvetica",
        fontSize: 36,
        fontWeight: "400",
        objectId: uuidv4(),
    } as { objectId: string } & fabric.IText);
};

export const createSpecificShape = (shape: Tool | null, pointer: Pointer) => {
    switch (shape) {
        case "rect":
            return createRectangle(pointer);

        case "triangle":
            return createTriangle(pointer);

        case "circle":
            return createCircle(pointer);

        case "line":
            return createLine(pointer);

        case "i-text":
            return createText(pointer, "Tap To Type");

        default:
            return null;
    }
};

export const handleImageUpload = ({ file, fabricRef, setShape }: ImageUpload) => {
    const reader = new FileReader();

    reader.onload = () => {
        fabric.Image.fromURL(reader.result as string, (image) => {
            image.scaleToWidth(200);
            image.scaleToHeight(200);
            image.set({ top: 160, left: 320 });

            if (fabricRef?.current) fabricRef.current.add(image);

            // @ts-ignore
            image.objectId = uuidv4();

            // sync shape in storage
            // @ts-ignore
            if (image?.objectId) {
                // @ts-ignore
                setShape({ objectId: image.objectId, ...image.toJSON() });
                // @ts-ignore
                socket.emit("set:shape", { objectId: image.objectId, ...image.toJSON() });
            }

            if (fabricRef?.current) fabricRef.current.requestRenderAll();
        });
    };

    reader.readAsDataURL(file);
};

export const modifyShape = ({ canvas, property, value, activeObjectRef }: ModifyShape) => {
    const selectedElement = canvas.getActiveObject();

    if (!selectedElement || selectedElement?.type === "activeSelection") return;

    // if  property is width or height, set the scale of the selected element
    if (property === "width") {
        selectedElement.set("scaleX", 1);
        selectedElement.set("width", value);
    } else if (property === "height") {
        selectedElement.set("scaleY", 1);
        selectedElement.set("height", value);
    } else {
        if (selectedElement[property as keyof object] === value) return;
        selectedElement.set(property as keyof object, value);
    }

    // set selectedElement to activeObjectRef
    activeObjectRef.current = selectedElement;

    console.log({ selectedElement });
};

export const bringElement = ({ canvas, direction }: ElementDirection) => {
    if (!canvas) return;

    // get the selected element. If there is no selected element or there are more than one selected element, return
    const selectedElement = canvas.getActiveObject();

    if (!selectedElement || selectedElement?.type === "activeSelection") return;

    // bring the selected element to the front
    if (direction === "front") {
        canvas.bringToFront(selectedElement);
    } else if (direction === "back") {
        canvas.sendToBack(selectedElement);
    }

    // canvas.renderAll();
    console.log({ selectedElement });

    // re-render all objects on the canvas
};
