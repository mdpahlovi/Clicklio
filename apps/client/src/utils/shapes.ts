import { Arrow } from "@/constants/fabric/arrow";
import type { ImageUpload, ModifyShape, Pointer, Tool } from "@/types";
import { handleCreateEvent } from "@/utils/event";
import * as fabric from "fabric";
import { v4 as uuid } from "uuid";

export const createRectangle = (pointer: Pointer, baseColor: string) => {
    return new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColor,
        uid: uuid(),
    });
};

export const createTriangle = (pointer: Pointer, baseColor: string) => {
    return new fabric.Triangle({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColor,
        uid: uuid(),
    });
};

export const createCircle = (pointer: Pointer, baseColor: string) => {
    return new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: baseColor,
        uid: uuid(),
    });
};

export const createLine = (pointer: Pointer, baseColor: string) => {
    return new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        fill: baseColor,
        stroke: baseColor,
        strokeWidth: 2,
        uid: uuid(),
    });
};

export const createArrow = (pointer: Pointer, baseColor: string) => {
    return new Arrow([pointer.x, pointer.y, pointer.x, pointer.y], {
        fill: baseColor,
        stroke: baseColor,
        strokeWidth: 2,
        uid: uuid(),
    });
};

export const createText = (pointer: Pointer, baseColor: string) => {
    return new fabric.IText("Tap To Type", {
        left: pointer.x,
        top: pointer.y,
        fill: baseColor,
        fontFamily: "Poppins",
        fontSize: 16,
        fontWeight: "400",
        uid: uuid(),
    });
};

export const createSpecificShape = (shape: Tool | null, pointer: Pointer) => {
    const baseColor = "#FFFFFF";

    switch (shape) {
        case "rect":
            return createRectangle(pointer, baseColor);

        case "triangle":
            return createTriangle(pointer, baseColor);

        case "circle":
            return createCircle(pointer, baseColor);

        case "line":
            return createLine(pointer, baseColor);

        case "arrow":
            return createArrow(pointer, baseColor);

        case "i-text":
            return createText(pointer, baseColor);

        default:
            return null;
    }
};

export const handleImageUpload = ({ file, fabricRef, createEvent }: ImageUpload) => {
    const reader = new FileReader();

    reader.onload = () => {
        fabric.FabricImage.fromURL(reader.result as string).then((image) => {
            image.scaleToWidth(100);
            image.set({ uid: uuid() });

            if (fabricRef?.current && image?.uid) {
                fabricRef.current.add(image);

                // sync in storage
                handleCreateEvent({
                    action: "CREATE",
                    object: image,
                    createEvent,
                });

                fabricRef.current.requestRenderAll();
            }
        });
    };

    reader.readAsDataURL(file);
};

export const modifyShape = ({ fabricRef, property, value, createEvent }: ModifyShape) => {
    if (!fabricRef.current) return;
    const selectedElement = fabricRef.current.getActiveObject();
    if (!selectedElement || selectedElement?.type === "activeSelection") return;

    // update the value of each property
    switch (property) {
        case "fontSize":
            selectedElement.set({ fontSize: Number(value) });
            break;

        case "fontFamily":
            selectedElement.set({ fontFamily: value });
            break;

        case "fontWeight":
            selectedElement.set({ fontWeight: value });
            break;

        case "fill":
            selectedElement.set({ fill: value ? value : null });
            break;

        case "stroke":
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

    // sync in storage
    if (selectedElement?.uid && selectedElement?.uid !== "webcam") {
        handleCreateEvent({
            action: "UPDATE",
            object: selectedElement,
            createEvent,
        });
    }
};
