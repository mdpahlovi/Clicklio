import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import MenuButton from "@/components/home/menu";
import Toolbar from "@/components/home/toolbar";
import { Button } from "@/components/ui/button";
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
} from "@/utils/canvas";

import type { ActiveElement, Attributes } from "@/types";
import { defaultAttributes } from "@/constants";

export default function HomePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    const isDrawing = useRef(false);
    const shapeRef = useRef<fabric.Object | null>(null);
    const selectedShapeRef = useRef<string | null>(null);

    const activeObjectRef = useRef<fabric.Object | null>(null);
    const isEditingRef = useRef(false);

    const [activeElement, setActiveElement] = useState<ActiveElement>({ icon: null, name: "", value: "" });
    const [elementAttributes, setElementAttributes] = useState<Attributes>(defaultAttributes);

    console.log(elementAttributes);

    const handleActiveElement = (element: ActiveElement) => {
        setActiveElement(element);

        selectedShapeRef.current = element.value;
    };

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const canvas = initializeFabric({ canvasRef, fabricRef });

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({ options, canvas, isDrawing, shapeRef, selectedShapeRef });
        });

        canvas.on("mouse:move", (options) => {
            handleCanvasMouseMove({ options, canvas, isDrawing, selectedShapeRef, shapeRef });
        });

        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({ canvas, isDrawing, shapeRef, activeObjectRef, selectedShapeRef, setActiveElement });
        });

        canvas.on("path:created", (options) => {
            handlePathCreated({ options });
        });

        canvas.on("object:modified", (options) => {
            handleCanvasObjectModified({ options });
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
            handleCanvasZoom({ options, canvas });
        });

        window.addEventListener("resize", () => handleResize({ canvas: fabricRef.current }));

        return () => {
            canvas.dispose();
            window.removeEventListener("resize", () => handleResize({ canvas: null }));
        };
    }, [canvasRef]);

    return (
        <>
            <div className="fixed top-6 z-10 grid w-full grid-cols-[4.25rem_1fr_4.25rem] items-center px-6">
                <MenuButton {...{ menuOpen, setMenuOpen }} />
                <Toolbar {...{ activeElement, handleActiveElement }} />
                <Button>Share</Button>
            </div>
            <div className="fixed left-6 top-24 z-10 h-80 w-60 rounded bg-foreground"></div>
            <div className="fixed bottom-6 left-6 z-10">
                <BottomToolbar />
            </div>

            <div id="canvas" className="h-screen w-full">
                <canvas ref={canvasRef} />
            </div>
        </>
    );
}
