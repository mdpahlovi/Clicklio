import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { renderCanvas } from "@/utils/canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useShapeState } from "@/hooks/useShapeState";

import { RxCursorArrow } from "react-icons/rx";
import { Button } from "@/components/ui/button";
import Toolbar from "@/components/home/toolbar";
import MenuButton from "@/components/home/menu";
import BottomToolbar from "@/components/home/buttom-toolbar";
import SideToolbar from "@/components/home/side-toolbar";

export default function HomePage() {
    const { undo, redo } = useShapeState.temporal.getState();
    const { shapes, setShape, updateShape, deleteShape } = useShapeState();
    const [position, setPosition] = useState<{ x: number; y: number } | null>();
    const { canvasRef, fabricRef, selectedToolRef, isEditingRef, pasteTimeRef, copiedObjectRef } = useCanvas();

    useEffect(() => {
        socket.on("set:shape", (shape) => setShape(shape));
        socket.on("update:shape", (shape) => updateShape(shape));
        socket.on("delete:shape", ({ objectId }) => deleteShape(objectId));
        socket.on("undo:shape", ({ status }) => status && undo());
        socket.on("redo:shape", ({ status }) => status && redo());
        socket.on("cursor", (position) => setPosition(position));

        return () => {
            socket.off("set:shape", (shape) => setShape(shape));
            socket.off("update:shape", (shape) => updateShape(shape));
            socket.off("delete:shape", ({ objectId }) => deleteShape(objectId));
            socket.off("undo:shape", ({ status }) => status && undo());
            socket.off("redo:shape", ({ status }) => status && redo());
            socket.off("cursor", (position) => setPosition(position));
        };
    }, []);

    useEffect(() => {
        renderCanvas({ shapes, fabricRef });
    }, [shapes]);

    return (
        <>
            <div className="fixed top-6 z-10 grid w-full grid-cols-[4.25rem_1fr_4.25rem] items-center px-6">
                <MenuButton />
                <Toolbar {...{ fabricRef, selectedToolRef }} />
                <Button>Share</Button>
            </div>

            <RxCursorArrow style={position ? { position: "fixed", top: position.y, left: position.x } : { display: "none" }} />

            <SideToolbar {...{ fabricRef, isEditingRef, pasteTimeRef, copiedObjectRef }} />
            <BottomToolbar {...{ fabricRef }} />

            <div id="canvas" className="h-screen w-full">
                <canvas ref={canvasRef} />
            </div>
        </>
    );
}
