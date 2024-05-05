import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { renderCanvas } from "@/utils/canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useShapeState } from "@/hooks/useShapeState";

import { Button } from "@/components/ui/button";
import Toolbar from "@/components/home/toolbar";
import MenuButton from "@/components/home/menu";
import BottomToolbar from "@/components/home/buttom-toolbar";

export default function HomePage() {
    const [refresh, setRefresh] = useState<number>();
    const { shapes, setShape, updateShape, deleteShape } = useShapeState();
    const { canvasRef, fabricRef, selectedToolRef, activeObjectRef } = useCanvas();

    useEffect(() => {
        socket.on("set:shape", (shape) => {
            setShape(shape);
            setRefresh(Math.random() * 100);
        });
        socket.on("update:shape", (shape) => {
            updateShape(shape);
            setRefresh(Math.random() * 100);
        });
        socket.on("delete:shape", ({ objectId }) => {
            deleteShape(objectId);
            setRefresh(Math.random() * 100);
        });

        return () => {
            socket.off("set:shape", (shape) => {
                setShape(shape);
                setRefresh(Math.random() * 100);
            });
            socket.off("update:shape", (shape) => {
                updateShape(shape);
                setRefresh(Math.random() * 100);
            });
            socket.off("delete:shape", ({ objectId }) => {
                deleteShape(objectId);
                setRefresh(Math.random() * 100);
            });
        };
    }, []);

    useEffect(() => {
        renderCanvas({ shapes, fabricRef, activeObjectRef });
    }, [refresh]);

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
