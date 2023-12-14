import { useRef } from "react";
import Canvas from "@/components/main/home/canvas";
import TopBar from "@/components/main/home/topbar";
import useCanvasStore from "@/hooks/useCanvasStore";

export default function CanvasPage() {
    const { elements, image, updateElements } = useCanvasStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Failed to get canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Failed to get context");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        updateElements([]);
    };

    console.log({ elements, image });

    return (
        <section className="space-y-6">
            <TopBar clearCanvas={clearCanvas} />
            <Canvas canvasRef={canvasRef} />
        </section>
    );
}
