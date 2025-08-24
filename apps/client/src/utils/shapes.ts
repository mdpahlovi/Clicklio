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

export const createDiamond = (pointer: fabric.Point, baseColor: string) => {
    const points = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
    ];

    return new fabric.Polygon(points, {
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
    return new fabric.Ellipse({
        left: pointer.x,
        top: pointer.y,
        rx: 0,
        ry: 0,
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

        case "diamond":
            return createDiamond(pointer, baseColor);

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

export const updateSpecificShape = (
    shape: Tool,
    pointer: fabric.Point,
    startPoint: fabric.Point,
    object: fabric.FabricObject,
    shiftKey: boolean,
) => {
    const left = Math.min(startPoint.x, pointer.x);
    const top = Math.min(startPoint.y, pointer.y);
    const width = Math.abs(pointer.x - startPoint.x);
    const height = Math.abs(pointer.y - startPoint.y);

    switch (shape) {
        case "rect":
            (object as fabric.Rect).set({
                left,
                top,
                width,
                height,
            });
            break;

        case "diamond": {
            const halfWidth = width / 2;
            const halfHeight = height / 2;

            const newPoints = [
                { x: 0, y: -halfHeight },
                { x: halfWidth, y: 0 },
                { x: 0, y: halfHeight },
                { x: -halfWidth, y: 0 },
            ];

            (object as fabric.Polygon).set({
                points: newPoints,
                left,
                top,
                width,
                height,
            });
            break;
        }

        case "triangle":
            (object as fabric.Triangle).set({
                left,
                top,
                width,
                height,
            });
            break;

        case "circle": {
            if (!shiftKey) {
                (object as fabric.Ellipse).set({
                    left,
                    top,
                    rx: width / 2,
                    ry: height / 2,
                });
            } else {
                (object as fabric.Ellipse).set({
                    left,
                    top,
                    rx: Math.max(width / 2, height / 2),
                    ry: Math.max(width / 2, height / 2),
                });
            }
            break;
        }

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
