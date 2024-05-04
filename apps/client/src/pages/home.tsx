import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { handleKeyDown } from "@/utils/key-events";
import { Button } from "@/components/ui/button";
import Toolbar from "@/components/home/toolbar";
import MenuButton from "@/components/home/menu";
import BottomToolbar from "@/components/home/buttom-toolbar";
import {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasObjectModified,
    handleCanvasObjectMoving,
    handleCanvasObjectScaling,
    handleCanvasSelectionCreated,
    handleCanvasZoom,
    handlePathCreated,
    handleResize,
    initializeFabric,
    renderCanvas,
} from "@/utils/canvas";

import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import type { Pointer, Attributes, Shape } from "@/types";

export default function HomePage() {
    const { setTool, setZoom } = useCanvasState();
    const { shapes, setShape, updateShape, deleteShape } = useShapeState();

    console.log({ shapes: JSON.parse(JSON.stringify(shapes)) });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const isDrawing = useRef(false);
    const isPanning = useRef<Pointer | null>(null);
    const shapeRef = useRef<fabric.Object | null>(null);
    const selectedShapeRef = useRef<Shape | null>(null);

    const activeObjectRef = useRef<fabric.Object | null>(null);
    const isEditingRef = useRef(false);

    const [elementAttributes, setElementAttributes] = useState<Attributes | null>(null);

    console.log({ elementAttributes });

    useEffect(() => {
        const canvas = initializeFabric({ canvasRef, fabricRef });

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({ options, canvas, isDrawing, isPanning, shapeRef, selectedShapeRef });
        });

        canvas.on("mouse:move", (options) => {
            handleCanvasMouseMove({ options, canvas, isDrawing, isPanning, shapeRef, selectedShapeRef });
        });

        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({ canvas, isDrawing, isPanning, shapeRef, activeObjectRef, selectedShapeRef, setTool, setShape });
        });

        canvas.on("path:created", (options) => {
            handlePathCreated({ options, setShape });
        });

        canvas.on("object:modified", (options) => {
            handleCanvasObjectModified({ options, updateShape });
        });

        canvas.on("object:moving", (options) => {
            handleCanvasObjectMoving({ options });
        });

        canvas.on("selection:created", (options) => {
            handleCanvasSelectionCreated({ options, isEditingRef, setElementAttributes });
        });

        canvas.on("object:scaling", (options) => {
            handleCanvasObjectScaling({ options, setElementAttributes });
        });

        canvas.on("mouse:wheel", (options) => {
            handleCanvasZoom({ options, canvas, setZoom });
        });

        window.addEventListener("resize", () => handleResize({ canvas: fabricRef.current }));
        window.addEventListener("keydown", (e) => handleKeyDown({ e, canvas: fabricRef.current, setShape, deleteShape }));

        return () => {
            canvas.dispose();
            window.removeEventListener("resize", () => handleResize({ canvas: null }));
            window.removeEventListener("keydown", (e) => handleKeyDown({ e, canvas: null, setShape, deleteShape }));
        };
    }, []);

    useEffect(() => {
        if (shapes.length) renderCanvas({ shapes, fabricRef, activeObjectRef });
    }, []);

    return (
        <>
            <div className="fixed top-6 z-10 grid w-full grid-cols-[4.25rem_1fr_4.25rem] items-center px-6">
                <MenuButton />
                <Toolbar {...{ fabricRef, selectedShapeRef }} />
                <Button>Share</Button>
            </div>

            {/* <div className="fixed left-6 top-24 z-10 h-80 w-60 rounded bg-foreground"></div> */}

            <div className="fixed bottom-6 left-6 z-10">
                <BottomToolbar {...{ fabricRef }} />
            </div>

            <div id="canvas" className="h-screen w-full">
                <canvas ref={canvasRef} />
            </div>
        </>
    );
}
