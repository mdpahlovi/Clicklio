import { useEffect } from "react";
import { renderCanvas } from "@/utils/canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useShapeState } from "@/hooks/useShapeState";

import { Button } from "@/components/ui/button";
import Toolbar from "@/components/home/toolbar";
import MenuButton from "@/components/home/menu";
import BottomToolbar from "@/components/home/buttom-toolbar";
import { socket } from "@/utils/socket";

export default function HomePage() {
    const { shapes, setShape, updateShape, deleteShape } = useShapeState();
    const { canvasRef, fabricRef, selectedToolRef, activeObjectRef } = useCanvas();

    useEffect(() => {
        socket.on("set:shape", (shape) => setShape(shape));
        socket.on("update:shape", (shape) => updateShape(shape));
        socket.on("delete:shape", ({ objectId }) => deleteShape(objectId));

        return () => {
            socket.off("set:shape", (shape) => setShape(shape));
            socket.off("update:shape", (shape) => updateShape(shape));
            socket.off("delete:shape", ({ objectId }) => deleteShape(objectId));
        };
    }, []);

    useEffect(() => {
        if (shapes.length) renderCanvas({ shapes, fabricRef, activeObjectRef });
    }, [shapes]);

    return (
        <>
            <div className="fixed top-6 z-10 grid w-full grid-cols-[4.25rem_1fr_4.25rem] items-center px-6">
                <MenuButton />
                <Toolbar {...{ fabricRef, selectedToolRef }} />
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
