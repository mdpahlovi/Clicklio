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

export const modifyShape = ({ fabricRef, property, value, updateShape }: ModifyShape) => {
    if (!fabricRef.current) return;
    const selectedElement = fabricRef.current.getActiveObject();
    if (!selectedElement || selectedElement?.type === "activeSelection") return;

    // update the value of each property
    switch (property) {
        case "top":
            selectedElement.set({ top: Number(value) });
            break;

        case "left":
            selectedElement.set({ left: Number(value) });
            break;

        case "width":
            selectedElement.set({ scaleX: 1, width: Number(value) });
            break;

        case "height":
            selectedElement.set({ scaleY: 1, height: Number(value) });
            break;

        case "fontSize":
            // @ts-ignore
            selectedElement.set({ fontSize: Number(value) });
            break;

        case "fontFamily":
            // @ts-ignore
            selectedElement.set({ fontFamily: value });
            break;

        case "fontWeight":
            // @ts-ignore
            selectedElement.set({ fontWeight: value });
            break;

        case "fill":
            selectedElement.set({ fill: value });
            break;

        case "stroke":
            selectedElement.set({ stroke: value });
            break;
    }

    // sync shape in storage
    // @ts-ignore
    if (selectedElement?.objectId) {
        // @ts-ignore
        updateShape({ objectId: selectedElement.objectId, ...selectedElement.toJSON() });
        // @ts-ignore
        socket.emit("update:shape", { objectId: selectedElement.objectId, ...selectedElement.toJSON() });
    }
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
