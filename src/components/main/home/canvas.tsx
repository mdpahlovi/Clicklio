import rough from "roughjs";
import useCanvasStore from "@/hooks/useCanvasStore";
import { useEffect, useLayoutEffect, useState } from "react";
import type { MouseEvent, RefObject } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
const generator = rough.generator();

export default function Canvas({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement> }) {
    const { stroke, tool, elements, setElements, updateElements } = useCanvasStore();
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Failed to get canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Failed to get context");

        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = stroke;
        context.lineWidth = 5;
    }, [canvasRef, stroke]);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Failed to get canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Failed to get context");

        const roughCanvas = rough.canvas(canvasRef.current);
        if (elements.length > 0) context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Show all of my elements on ui
        elements.forEach(({ offsetX, offsetY, width, height, path, stroke, tool }) => {
            switch (tool) {
                case "pencil":
                    roughCanvas.linearPath(path!, { stroke, roughness: 0, strokeWidth: 5 });
                    break;
                case "line":
                    roughCanvas.draw(generator.line(offsetX, offsetY, width!, height!, { stroke, roughness: 0, strokeWidth: 5 }));
                    break;
                case "rectangle":
                    roughCanvas.draw(generator.rectangle(offsetX, offsetY, width!, height!, { stroke, roughness: 0, strokeWidth: 5 }));
                    break;
                case "ellipse":
                    roughCanvas.draw(generator.ellipse(offsetX, offsetY, width!, height!, { stroke, roughness: 0, strokeWidth: 5 }));
                    break;
            }
        });
    }, [canvasRef, elements]);

    const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
        const { offsetX, offsetY } = e.nativeEvent;

        // On Mouse Set the Element
        switch (tool) {
            case "pencil":
                setElements({ offsetX, offsetY, path: [[offsetX, offsetY]], stroke, tool });
                break;
            default:
                setElements({ offsetX, offsetY, stroke, tool });
                break;
        }

        setDrawing(true);
    };

    const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
        if (!drawing) return;
        const { offsetX, offsetY } = e.nativeEvent;

        // On Mouse Move Update The Elements
        switch (tool) {
            case "pencil":
                updateElements(
                    elements.map((ele, idx) => (idx === elements.length - 1 ? { ...ele, path: [...ele.path!, [offsetX, offsetY]] } : ele)),
                );
                break;
            case "line":
                updateElements(
                    elements.map((ele, idx) => (idx === elements.length - 1 ? { ...ele, width: offsetX, height: offsetY } : ele)),
                );
                break;
            default:
                updateElements(
                    elements.map((ele, idx) =>
                        idx === elements.length - 1 ? { ...ele, width: offsetX - ele.offsetX, height: offsetY - ele.offsetY } : ele,
                    ),
                );
                break;
        }
    };

    return (
        <ScrollArea
            onMouseUp={() => setDrawing(false)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            className="border w-full h-[calc(100vh_-_354px)]"
        >
            <canvas ref={canvasRef} />
        </ScrollArea>
    );
}
