import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { renderCanvas } from "@/utils/canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useShapeState } from "@/hooks/useShapeState";

import Navbar from "@/components/home/navbar";
import Toolbar from "@/components/home/toolbar";
import Sidebar from "@/components/home/sidebar";
import SideToolbar from "@/components/home/side-toolbar";
import RemoteCursor from "@/components/ui/remote-cursor";
import BottomToolbar from "@/components/home/buttom-toolbar";
import CanvasContainer from "@/components/home/canvas-container";

export default function HomePage() {
    const { undo, redo } = useShapeState.temporal.getState();
    const { shapes, setShape, updateShape, deleteShape } = useShapeState();
    const { canvasRef, fabricRef, selectedToolRef, isEditingRef, pasteTimeRef, copiedObjectRef } = useCanvas();

    useEffect(() => renderCanvas({ shapes, fabricRef }), [shapes]);

    useEffect(() => {
        socket.on("set:shape", (shape) => setShape(shape));
        socket.on("update:shape", (shape) => updateShape(shape));
        socket.on("delete:shape", ({ objectId }) => deleteShape(objectId));
        socket.on("undo:shape", ({ status }) => status && undo());
        socket.on("redo:shape", ({ status }) => status && redo());

        return () => {
            socket.off("set:shape", (shape) => setShape(shape));
            socket.off("update:shape", (shape) => updateShape(shape));
            socket.off("delete:shape", ({ objectId }) => deleteShape(objectId));
            socket.off("undo:shape", ({ status }) => status && undo());
            socket.off("redo:shape", ({ status }) => status && redo());
        };
    }, []);

    return (
        <>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar />

                <SideToolbar {...{ fabricRef, isEditingRef, pasteTimeRef, copiedObjectRef }} />

                <CanvasContainer>
                    <RemoteCursor />
                    <Toolbar {...{ fabricRef, selectedToolRef }} />
                    <BottomToolbar {...{ fabricRef }} />
                    <canvas ref={canvasRef} />
                </CanvasContainer>
            </div>
        </>
    );
}
