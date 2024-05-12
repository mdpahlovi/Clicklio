import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { renderCanvas } from "@/utils/canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useShapeState } from "@/hooks/useShapeState";

import { Stack } from "@mui/joy";
import Navbar from "@/components/home/navbar";
import Toolbar from "@/components/home/toolbar";
import SideToolbar from "@/components/home/side-toolbar";
import RemoteCursor from "@/components/ui/remote-cursor";
import BottomToolbar from "@/components/home/buttom-toolbar";

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
            <Stack direction="row">
                <Stack
                    py={3}
                    width={64}
                    height="calc(100vh - 113px)"
                    position="relative"
                    borderRight={1}
                    borderColor={({ palette }) => palette.divider}
                ></Stack>

                <SideToolbar {...{ fabricRef, isEditingRef, pasteTimeRef, copiedObjectRef }} />

                <div
                    id="canvas"
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "calc(100vh - 65px)",
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3e%3ccircle fill='rgb(0 0 0 / 0.25)' cx='10' cy='10' r='1.6257413380501518'%3e%3c/circle%3e%3c/svg%3e"`,
                    }}
                >
                    <RemoteCursor />
                    <Toolbar {...{ fabricRef, selectedToolRef }} />
                    <BottomToolbar {...{ fabricRef }} />
                    <canvas ref={canvasRef} />
                </div>
            </Stack>
        </>
    );
}
