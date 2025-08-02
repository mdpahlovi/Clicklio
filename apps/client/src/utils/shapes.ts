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
    });
};

export const createDiamond = (pointer: Vector2d, baseColor: string) => {
    return new Konva.RegularPolygon({
        x: pointer.x,
        y: pointer.y,
        sides: 4,
        radius: 0,
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
    });
};

export const createCircle = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Circle({
        x: pointer.x,
        y: pointer.y,
        radius: 0,
        fill: baseColor,
        id: uuid(),
    });
};

export const createLine = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Line({
        points: [pointer.x, pointer.y, pointer.x, pointer.y],
        stroke: baseColor,
        strokeWidth: 2,
        id: uuid(),

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
    });
};

export const createSpecificShape = (shape: Tool, pointer: Vector2d) => {
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

        case "path":
            return createPath(pointer, baseColor);

        case "text":
            return createText(pointer, baseColor);
    }
};

export const updateSpecificShape = (shape: Tool, pointer: Vector2d, object: Konva.Node) => {
    switch (shape) {
        case "rect": {
            const { x, y } = object.attrs;
            (object as Konva.Rect).width(pointer.x - x);
            (object as Konva.Rect).height(pointer.y - y);
            break;
        }
        case "diamond": {
            const { x, y } = object.attrs;
            const radius = Math.sqrt((pointer.x - x) ** 2 + (pointer.y - y) ** 2);
            (object as Konva.RegularPolygon).radius(radius);
            break;
        }
        case "triangle": {
            const { x, y } = object.attrs;
            const radius = Math.sqrt((pointer.x - x) ** 2 + (pointer.y - y) ** 2);
            (object as Konva.RegularPolygon).radius(radius);
            break;
        }
        case "circle": {
            const { x, y } = object.attrs;
            const radius = Math.sqrt((pointer.x - x) ** 2 + (pointer.y - y) ** 2);
            (object as Konva.Circle).radius(radius);
            break;
        }
        case "line":
        case "arrow": {
            const [...points] = (object as Konva.Line).points();
            if (points.length === 0) break;
            (object as Konva.Line).points([points[0], points[1], pointer.x, pointer.y]);
            break;
        }
        case "path": {
            const [...points] = (object as Konva.Line).points();
            if (points.length === 0) break;
            (object as Konva.Line).points([...points, pointer.x, pointer.y]);
            break;
        }
    }
};

export const handleImageUpload = ({ file, stage, createEvent }: ImageUpload) => {
    const reader = new FileReader();

    reader.onload = () => {
        Konva.Image.fromURL(reader.result as string, (image) => {
            const height = 160 * (image.height() / image.width());

            image.id(uuid());
            image.width(160);
            image.height(height);

            if (image?.id()) {
                stage.getLayers()[0].add(image);

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
