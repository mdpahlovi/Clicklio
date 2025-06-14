import type { ImageUpload, ModifyShape, Pointer, Tool } from "@/types";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import { Arrow } from "./arrow";
import { socket } from "./socket";

export const createRectangle = (pointer: Pointer, baseColorRef: React.RefObject<string | null>) => {
    return new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColorRef.current,
        objectId: uuidv4(),
    });
};

export const createTriangle = (pointer: Pointer, baseColorRef: React.RefObject<string | null>) => {
    return new fabric.Triangle({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColorRef.current,
        objectId: uuidv4(),
    });
};

export const createCircle = (pointer: Pointer, baseColorRef: React.RefObject<string | null>) => {
    return new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: baseColorRef.current,
        objectId: uuidv4(),
    });
};

export const createLine = (pointer: Pointer, baseColorRef: React.RefObject<string | null>) => {
    return new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: baseColorRef.current,
        strokeWidth: 2,
        objectId: uuidv4(),
    });
};

export const createArrow = (pointer: Pointer, baseColorRef: React.RefObject<string | null>) => {
    return new Arrow([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: baseColorRef.current,
        strokeWidth: 2,
        objectId: uuidv4(),
    });
};

export const createText = (pointer: Pointer, baseColorRef: React.RefObject<string | null>) => {
    return new fabric.IText("Tap To Type", {
        left: pointer.x,
        top: pointer.y,
        fill: baseColorRef.current,
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "400",
        objectId: uuidv4(),
    });
};

export const createSpecificShape = (shape: Tool | null, pointer: Pointer, baseColorRef: React.RefObject<string | null>) => {
    switch (shape) {
        case "rect":
            return createRectangle(pointer, baseColorRef);

        case "triangle":
            return createTriangle(pointer, baseColorRef);

        case "circle":
            return createCircle(pointer, baseColorRef);

        case "line":
            return createLine(pointer, baseColorRef);

        case "arrow":
            return createArrow(pointer, baseColorRef);

        case "i-text":
            return createText(pointer, baseColorRef);

        default:
            return null;
    }
};

export const handleImageUpload = ({ file, room, fabricRef, setShape }: ImageUpload) => {
    const reader = new FileReader();

    reader.onload = () => {
        fabric.FabricImage.fromURL(reader.result as string).then((image) => {
            image.scaleToWidth(100);
            image.set({ objectId: uuidv4() });

            // sync shape in storage
            if (image?.objectId) {
                setShape({ objectId: image?.objectId, ...image.toJSON() });
                if (room) socket.emit("set:shape", { room, objectId: image?.objectId, ...image.toJSON() });
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

    // sync shape in storage
    if (selectedElement?.objectId && selectedElement?.objectId !== "webcam") {
        updateShape({ objectId: selectedElement?.objectId, ...selectedElement.toJSON() });
        if (room) socket.emit("update:shape", { room, objectId: selectedElement?.objectId, ...selectedElement.toJSON() });
    }
};
