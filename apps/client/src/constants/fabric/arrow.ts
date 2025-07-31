import { Line, classRegistry } from "fabric";

// Define the arrow class
export class Arrow extends Line {
    static type = "arrow";

    constructor(points: [number, number, number, number], options = {}) {
        super(points, options);
    }

    static getDefaults() {
        return {
            ...Line.getDefaults(),
            type: "arrow",
        };
    }

    _render(ctx: CanvasRenderingContext2D) {
        super._render(ctx);

        // do not render if width/height are zeros or object is not visible
        if (this.width === 0 || this.height === 0 || !this.visible) return;

        ctx.save();

        const xDiff = this.x2! - this.x1!;
        const yDiff = this.y2! - this.y1!;
        const angle = Math.atan2(yDiff, xDiff);
        ctx.translate((this.x2! - this.x1!) / 2, (this.y2! - this.y1!) / 2);
        ctx.rotate(angle);
        ctx.beginPath();

        ctx.moveTo(6, 0);
        ctx.lineTo(-4, 4);
        ctx.lineTo(-4, -4);
        ctx.closePath();
        ctx.fillStyle = this.stroke as string;
        ctx.fill();

        ctx.restore();
    }
}

classRegistry.setClass(Arrow);
classRegistry.setSVGClass(Arrow);
