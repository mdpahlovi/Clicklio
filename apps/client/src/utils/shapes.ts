import * as fabric from "fabric";
import { socket } from "./socket";
import { v4 as uuidv4 } from "uuid";
import { objectCorner } from "@/constants";
import type { Pointer, ImageUpload, ModifyShape, Tool } from "@/types";

export const createRectangle = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColorRef.current,
        objectId: uuidv4(),
        ...objectCorner,
    });
};

export const createTriangle = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.Triangle({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColorRef.current,
        objectId: uuidv4(),
        ...objectCorner,
    });
};

export const createCircle = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: baseColorRef.current,
        objectId: uuidv4(),
        ...objectCorner,
    });
};

export const createLine = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: baseColorRef.current,
        strokeWidth: 2,
        objectId: uuidv4(),
        ...objectCorner,
    });
};

export const createText = (pointer: Pointer, baseColorRef: React.MutableRefObject<string | undefined>) => {
    return new fabric.IText("Tap To Type", {
        left: pointer.x,
        top: pointer.y,
        fill: baseColorRef.current,
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "400",
        objectId: uuidv4(),
        ...objectCorner,
    });
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
        fabric.FabricImage.fromURL(reader.result as string).then((image) => {
            image.scaleToWidth(160);
            image.scaleToHeight(160);
            image.set({ objectId: uuidv4(), ...objectCorner });

            // sync shape in storage
            if (image?.objectId) {
                setShape({ objectId: image?.objectId, ...image.toJSON() });
                socket.emit("set:shape", { room, objectId: image?.objectId, ...image.toJSON() });
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
    if (selectedElement?.objectId) {
        updateShape({ objectId: selectedElement?.objectId, ...selectedElement.toJSON() });
        socket.emit("update:shape", { room, objectId: selectedElement?.objectId, ...selectedElement.toJSON() });
    }
};
