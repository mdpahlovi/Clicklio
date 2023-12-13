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

        elements.forEach((ele) => {
            if (ele.tool === "rectangle") {
                roughCanvas.draw(
                    generator.rectangle(ele.offsetX, ele.offsetY, ele.width!, ele.height!, {
                        stroke: ele.stroke,
                        roughness: 0,
                        strokeWidth: 5,
                    }),
                );
            } else if (ele.tool === "line") {
                roughCanvas.draw(
                    generator.line(ele.offsetX, ele.offsetY, ele.width!, ele.height!, {
                        stroke: ele.stroke,
                        roughness: 0,
                        strokeWidth: 5,
                    }),
                );
            } else if (ele.tool === "pencil") {
                roughCanvas.linearPath(ele.path!, {
                    stroke: ele.stroke,
                    roughness: 0,
                    strokeWidth: 5,
                });
            }
        });
        const canvasImage = canvasRef.current.toDataURL();
        console.log(canvasImage);
    }, [canvasRef, elements]);

    const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "pencil") {
            setElements({ offsetX, offsetY, path: [[offsetX, offsetY]], stroke, tool });
        } else {
            setElements({ offsetX, offsetY, stroke, tool });
        }

        setDrawing(true);
    };
    const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
        if (!drawing) return;
        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "rectangle") {
            updateElements(
                elements.map((ele, index) =>
                    index === elements.length - 1
                        ? {
                              offsetX: ele.offsetX,
                              offsetY: ele.offsetY,
                              width: offsetX - ele.offsetX,
                              height: offsetY - ele.offsetY,
                              stroke: ele.stroke,
                              tool: ele.tool,
                          }
                        : ele,
                ),
            );
        } else if (tool === "line") {
            updateElements(
                elements.map((ele, index) =>
                    index === elements.length - 1
                        ? {
                              offsetX: ele.offsetX,
                              offsetY: ele.offsetY,
                              width: offsetX,
                              height: offsetY,
                              stroke: ele.stroke,
                              tool: ele.tool,
                          }
                        : ele,
                ),
            );
        } else if (tool === "pencil") {
            updateElements(
                elements.map((ele, index) =>
                    index === elements.length - 1
                        ? {
                              offsetX: ele.offsetX,
                              offsetY: ele.offsetY,
                              path: [...ele.path!, [offsetX, offsetY]],
                              stroke: ele.stroke,
                              tool: ele.tool,
                          }
                        : ele,
                ),
            );
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
