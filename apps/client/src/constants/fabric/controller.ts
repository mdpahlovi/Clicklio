import * as fabric from "fabric";

const controls = fabric.controlsUtils.createObjectDefaultControls();

type ControlRenderingStyleOverride = Partial<
    Pick<
        fabric.InteractiveFabricObject,
        "cornerStyle" | "cornerSize" | "cornerColor" | "cornerStrokeColor" | "cornerDashArray" | "transparentCorners"
    >
>;

function renderRoundedControl(
    this: fabric.Control,
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: ControlRenderingStyleOverride,
    fabricObject: fabric.InteractiveFabricObject,
) {
    styleOverride = styleOverride || {};
    const xSize = this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize,
        ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize,
        transparentCorners =
            typeof styleOverride.transparentCorners !== "undefined" ? styleOverride.transparentCorners : fabricObject.transparentCorners,
        methodName = transparentCorners ? "stroke" : "fill",
        stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor),
        xSizeBy2 = xSize / 2,
        ySizeBy2 = ySize / 2;
    ctx.save();
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor || "";
    ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor || "";
    ctx.translate(left, top);
    const angle = fabricObject.getTotalAngle();
    ctx.rotate(angle * (Math.PI / 180));

    ctx.beginPath();
    ctx.roundRect(-xSizeBy2, -ySizeBy2, xSize, ySize, 4);
    ctx[methodName]();

    if (stroke) ctx.stroke();
    ctx.restore();
}

export const defaultControls = {
    ...controls,
    ml: new fabric.Control({
        ...controls.ml,
        sizeX: 8,
        sizeY: 20,
        render: renderRoundedControl,
    }),
    mr: new fabric.Control({ ...controls.mr, sizeX: 8, sizeY: 20, render: renderRoundedControl }),
    mt: new fabric.Control({ ...controls.mt, sizeX: 20, sizeY: 8, render: renderRoundedControl }),
    mb: new fabric.Control({ ...controls.mb, sizeX: 20, sizeY: 8, render: renderRoundedControl }),
    mtr: new fabric.Control({ ...controls.mtr, offsetY: -24 }),
};
