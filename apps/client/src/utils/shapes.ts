import type { ImageUpload, Tool } from "@/types";
import { handleCreateEvent } from "@/utils/event";
import { getVisibleCenter } from "@/utils/utils";
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
        perfectDrawEnabled: false,
    });
};

export const createDiamond = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Shape({
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        fill: baseColor,
        id: uuid(),
        draggable: true,
        perfectDrawEnabled: false,
        sceneFunc: function (ctx, shape) {
            const width = shape.width();
            const height = shape.height();

            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width, height / 2);
            ctx.lineTo(width / 2, height);
            ctx.lineTo(0, height / 2);
            ctx.closePath();
            ctx.fillStrokeShape(shape);
        },
    });
};

export const createTriangle = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Shape({
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        fill: baseColor,
        id: uuid(),
        draggable: true,
        perfectDrawEnabled: false,
        sceneFunc: function (ctx, shape) {
            const width = shape.width();
            const height = shape.height();

            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            ctx.fillStrokeShape(shape);
        },
    });
};

export const createCircle = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Shape({
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        fill: baseColor,
        id: uuid(),
        draggable: true,
        perfectDrawEnabled: false,
        sceneFunc: function (ctx, shape) {
            const width = shape.width();
            const height = shape.height();

            ctx.beginPath();
            ctx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStrokeShape(shape);
        },
    });
};

export const createLine = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Line({
        points: [pointer.x, pointer.y, pointer.x, pointer.y],
        stroke: baseColor,
        strokeWidth: 2,
        lineCap: "round",
        id: uuid(),
        draggable: true,
        hitStrokeWidth: 20,
        perfectDrawEnabled: false,
    });
};

export const createArrow = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Arrow({
        points: [pointer.x, pointer.y, pointer.x, pointer.y],
        fill: baseColor,
        stroke: baseColor,
        strokeWidth: 2,
        lineCap: "round",
        id: uuid(),
        draggable: true,
        hitStrokeWidth: 20,
        perfectDrawEnabled: false,
    });
};

export const createPath = (pointer: Vector2d, baseColor: string) => {
    return new Konva.Line({
        points: [pointer.x, pointer.y],
        stroke: baseColor,
        strokeWidth: 2,
        lineCap: "round",
        lineJoin: "round",
        id: uuid(),
        draggable: true,
        hitStrokeWidth: 20,
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
        perfectDrawEnabled: false,
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

export const updateSpecificShape = (shape: Tool, startPoint: Vector2d, pointer: Vector2d, object: Konva.Node, shiftKey: boolean) => {
    const x = Math.min(startPoint.x, pointer.x);
    const y = Math.min(startPoint.y, pointer.y);
    const width = Math.abs(pointer.x - startPoint.x);
    const height = Math.abs(pointer.y - startPoint.y);

    switch (shape) {
        case "rect":
        case "diamond":
        case "triangle":
        case "circle": {
            (object as Konva.Rect).setAttrs({
                x,
                y,
                width: shiftKey ? Math.max(width, height) : width,
                height: shiftKey ? Math.max(width, height) : height,
            });
            break;
        }
        case "line":
        case "arrow": {
            const [...points] = (object as Konva.Line).points();

            let endX = pointer.x;
            let endY = pointer.y;

            if (shiftKey) {
                const deltaX = Math.abs(pointer.x - startPoint.x);
                const deltaY = Math.abs(pointer.y - startPoint.y);

                if (deltaX > deltaY) {
                    endY = startPoint.y;
                } else {
                    endX = startPoint.x;
                }
            }

            (object as Konva.Line).points([points[0], points[1], endX, endY]);
            break;
        }
        case "path": {
            const [...points] = (object as Konva.Line).points();
            (object as Konva.Line).points([...points, pointer.x, pointer.y]);
            break;
        }
    }
};

export const handleImageUpload = ({ file, stage, createEvent }: ImageUpload) => {
    const reader = new FileReader();

    reader.onload = () => {
        Konva.Image.fromURL(reader.result as string, (image) => {
            const canvasCenter = getVisibleCenter(stage);

            const height = 160 * (image.height() / image.width());

            image.x(canvasCenter.x - 160 / 2);
            image.y(canvasCenter.y - height / 2);
            image.width(160);
            image.height(height);
            image.id(uuid());
            image.draggable(true);
            image.perfectDrawEnabled(false);

            stage.getLayers()[0].add(image);

            handleCreateEvent({
                action: "CREATE",
                object: image,
                createEvent,
            });
        });
    };

    reader.readAsDataURL(file);
};
