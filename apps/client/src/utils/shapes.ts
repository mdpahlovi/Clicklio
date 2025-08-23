import { Arrow } from "@/constants/fabric/arrow";
import type { ImageUpload, Tool } from "@/types";
import { handleCreateEvent } from "@/utils/event";
import * as fabric from "fabric";
import { v4 as uuid } from "uuid";

export const createRectangle = (pointer: fabric.Point, baseColor: string) => {
    return new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColor,
        uid: uuid(),
    });
};

export const createTriangle = (pointer: fabric.Point, baseColor: string) => {
    return new fabric.Triangle({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: baseColor,
        uid: uuid(),
    });
};

export const createCircle = (pointer: fabric.Point, baseColor: string) => {
    return new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: baseColor,
        uid: uuid(),
    });
};

export const createLine = (pointer: fabric.Point, baseColor: string) => {
    return new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        fill: baseColor,
        stroke: baseColor,
        strokeWidth: 2,
        uid: uuid(),
    });
};

export const createArrow = (pointer: fabric.Point, baseColor: string) => {
    return new Arrow([pointer.x, pointer.y, pointer.x, pointer.y], {
        fill: baseColor,
        stroke: baseColor,
        strokeWidth: 2,
        uid: uuid(),
    });
};

export const createText = (pointer: fabric.Point, baseColor: string) => {
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

export const createSpecificShape = (shape: Tool, pointer: fabric.Point) => {
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

export const updateSpecificShape = (shape: Tool, pointer: fabric.Point, object: fabric.FabricObject) => {
    const { left, top } = object;

    switch (shape) {
        case "rect":
            (object as fabric.Rect).set({
                width: pointer.x - left,
                height: pointer.y - top,
            });
            break;

        case "triangle":
            (object as fabric.Triangle).set({
                width: pointer.x - left,
                height: pointer.y - top,
            });
            break;

        case "circle":
            (object as fabric.Circle).set({
                radius: Math.sqrt((pointer.x - left) ** 2 + (pointer.y - top) ** 2),
            });
            break;

        case "line":
            (object as fabric.Line).set({
                x2: pointer.x,
                y2: pointer.y,
            });
            break;

        case "arrow":
            (object as Arrow).set({
                x2: pointer.x,
                y2: pointer.y,
            });
            break;
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
