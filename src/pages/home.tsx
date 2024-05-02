import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { handleKeyDown } from "@/utils/key-events";
import { handleImageUpload } from "@/utils/shapes";
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

import type { Pointer, NavElement, Attributes, Shape } from "@/types";
import { useShapeState } from "@/hooks/useShapeState";

export default function HomePage() {
    const [zoom, setZoom] = useState(1);

    const { shapes, setShape, updateShape, deleteShape } = useShapeState();

    console.log({ shapes: JSON.parse(JSON.stringify(shapes)) });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const isDrawing = useRef(false);
    const isPanning = useRef<Pointer | null>(null);
    const shapeRef = useRef<fabric.Object | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const selectedShapeRef = useRef<Shape | null>(null);

    const activeObjectRef = useRef<fabric.Object | null>(null);
    const isEditingRef = useRef(false);

    const [activeElement, setActiveElement] = useState<NavElement | null>(null);
    const [elementAttributes, setElementAttributes] = useState<Attributes | null>(null);

    console.log({ elementAttributes });

    const handleActiveElement = (element: NavElement) => {
        setActiveElement(element);
        if (fabricRef.current) {
            fabricRef.current.isDrawingMode = false;
            fabricRef.current.defaultCursor = "default";
        }

        switch (element.value) {
            case "panning":
                selectedShapeRef.current = "panning";
                if (fabricRef.current) fabricRef.current.defaultCursor = "grab";
                break;

            case "freeform":
                if (fabricRef.current) {
                    fabricRef.current.isDrawingMode = true;
                    fabricRef.current.freeDrawingBrush.width = 5;
                }
                break;

            case "image":
                imageInputRef.current?.click();
                break;

            default:
                selectedShapeRef.current = element.value;
                break;
        }
    };

    useEffect(() => {
        const canvas = initializeFabric({ canvasRef, fabricRef });

        setZoom(canvas.getZoom());

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({ options, canvas, isDrawing, isPanning, shapeRef, selectedShapeRef });
        });

        canvas.on("mouse:move", (options) => {
            handleCanvasMouseMove({ options, canvas, isDrawing, isPanning, shapeRef, selectedShapeRef });
        });

        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({ canvas, isDrawing, isPanning, shapeRef, activeObjectRef, selectedShapeRef, setActiveElement, setShape });
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
                <Toolbar {...{ activeElement, handleActiveElement }} />
                <Button>Share</Button>
            </div>
            {/* <div className="fixed left-6 top-24 z-10 h-80 w-60 rounded bg-foreground"></div> */}
            <div className="fixed bottom-6 left-6 z-10">
                <BottomToolbar canvas={fabricRef} {...{ zoom, setZoom }} />
            </div>

            <div id="canvas" className="h-screen w-full">
                <canvas ref={canvasRef} />
            </div>

            <input
                hidden
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(e) => {
                    // @ts-ignore
                    if (e?.target?.files?.length) handleImageUpload({ file: e.target.files[0], canvas: fabricRef, shapeRef, setShape });
                }}
            />
        </>
    );
}
