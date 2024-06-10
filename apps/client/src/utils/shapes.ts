import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

import type { Pointer, ElementDirection, ImageUpload, ModifyShape, Tool } from "@/types";
import { socket } from "./socket";

export const createRectangle = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColorRef.current,
        objectId: uuidv4(),
    } as { objectId: string } & fabric.Rect);
};

export const createTriangle = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.Triangle({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColorRef.current,
        objectId: uuidv4(),
    } as { objectId: string } & fabric.Triangle);
};

export const createCircle = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: baseColorRef.current,
        objectId: uuidv4(),
    } as { objectId: string } & fabric.Circle);
};

export const createLine = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: baseColorRef.current,
        strokeWidth: 2,
        objectId: uuidv4(),
    } as { objectId: string } & fabric.Line);
};

export const createText = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.IText("Tap To Type", {
        left: pointer.x,
        top: pointer.y,
        fill: baseColorRef.current,
        fontFamily: "Helvetica",
        fontSize: 36,
        fontWeight: "400",
        objectId: uuidv4(),
    } as { objectId: string } & fabric.IText);
};

export const createSpecificShape = (shape: Tool | null, pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    switch (shape) {
        case "rect":
            return createRectangle(pointer, baseColorRef);

        case "triangle":
            return createTriangle(pointer, baseColorRef);

        case "circle":
            return createCircle(pointer, baseColorRef);

        case "line":
            return createLine(pointer, baseColorRef);

        case "i-text":
            return createText(pointer, baseColorRef);

        default:
            return null;
    }
};

export const handleImageUpload = ({ file, room, fabricRef, setShape }: ImageUpload) => {
    const reader = new FileReader();

    reader.onload = () => {
        fabric.Image.fromURL(reader.result as string, (image) => {
            image.scaleToWidth(160);
            image.scaleToHeight(160);
            // @ts-ignore
            image.set({ objectId: uuidv4() });

            // sync shape in storage
            // @ts-ignore
            if (image?.objectId) {
                // @ts-ignore
                setShape({ objectId: image.objectId, ...image.toJSON() });
                // @ts-ignore
                socket.emit("set:shape", { room, objectId: image.objectId, ...image.toJSON() });
            }

            if (fabricRef?.current) {
                fabricRef.current.add(image);
                fabricRef.current.requestRenderAll();
            }
        });
    };

    reader.readAsDataURL(file);
};

export const modifyShape = ({ fabricRef, room, property, value, updateShape }: ModifyShape) => {
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
            // @ts-ignore
            selectedElement.set({ fill: value ? value : null });
            break;

        case "stroke":
            // @ts-ignore
            selectedElement.set({ stroke: value ? value : null });
            break;

        case "strokeWidth":
            selectedElement.set({ strokeWidth: Number(value) });
            break;

        case "opacity":
            selectedElement.set({ opacity: Number(value) });
            break;
    }

    fabricRef.current.requestRenderAll();
    // sync shape in storage
    // @ts-ignore
    if (selectedElement?.objectId) {
        // @ts-ignore
        updateShape({ objectId: selectedElement.objectId, ...selectedElement.toJSON() });
        // @ts-ignore
        socket.emit("update:shape", { room, objectId: selectedElement.objectId, ...selectedElement.toJSON() });
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
