import type { ImageUpload, Tool } from "@/types";
import { handleCreateEvent } from "@/utils/event";
import Konva from "konva";
import type { Vector2d } from "konva/lib/types";
import { v4 as uuid } from "uuid";

export const createRectangle = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Rect({
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        fill: baseColor,
        id: uuid(),
        draggable: true,
    });
};

export const createTriangle = (pointer: Vector2d, baseColor: string) => {
    return new Konva.RegularPolygon({
        x: pointer.x,
        y: pointer.y,
        sides: 3,
        radius: 0,
        fill: baseColor,
        id: uuid(),
        draggable: true,
    });
};

export const createCircle = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Circle({
        x: pointer.x,
        y: pointer.y,
        radius: 0,
        fill: baseColor,
        id: uuid(),
        draggable: true,
    });
};

export const createLine = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Line({
        points: [pointer.x, pointer.y, pointer.x, pointer.y],
        stroke: baseColor,
        strokeWidth: 2,
        id: uuid(),
        draggable: true,
        hitStrokeWidth: 15,
        perfectDrawEnabled: false,
    });
};

export const createArrow = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Arrow({
        points: [pointer.x, pointer.y, pointer.x, pointer.y],
        fill: baseColor,
        stroke: baseColor,
        strokeWidth: 2,
        id: uuid(),
        draggable: true,
        hitStrokeWidth: 15,
        pointerLength: 10,
        pointerWidth: 10,
        perfectDrawEnabled: false,
    });
};

export const createPath = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Line({
        points: [pointer.x, pointer.y],
        stroke: baseColor,
        strokeWidth: 2,
        id: uuid(),
        draggable: true,
        hitStrokeWidth: 15,
        lineCap: "round",
        lineJoin: "round",
        perfectDrawEnabled: false,
    });
};

export const createText = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Text({
        x: pointer.x,
        y: pointer.y,
        text: "Tap To Type",
        fill: baseColor,
        fontFamily: "Poppins",
        fontSize: 16,
        fontStyle: "normal",
        id: uuid(),
        draggable: true,
    });
};

export const createSpecificShape = (shape: Tool, pointer: Vector2d) => {
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

        case "path":
            return createPath(pointer, baseColor);

        case "text":
            return createText(pointer, baseColor);
    }
};

export const handleImageUpload = ({ file, stageRef, createEvent }: ImageUpload) => {
    const reader = new FileReader();

    reader.onload = () => {
        Konva.Image.fromURL(reader.result as string, (image) => {
            const height = 160 * (image.height() / image.width());

            image.id(uuid());
            image.width(160);
            image.height(height);
            image.draggable(true);

            if (stageRef?.current && image?.id()) {
                stageRef.current.getLayers()[0].add(image);

                handleCreateEvent({
                    action: "CREATE",
                    object: image,
                    createEvent,
                });
            }
        });
    };

    reader.readAsDataURL(file);
};
