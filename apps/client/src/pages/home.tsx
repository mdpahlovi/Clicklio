import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { renderCanvas } from "@/utils/canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useShapeState } from "@/hooks/useShapeState";

import { Stack } from "@mui/joy";
import Navbar from "@/components/home/navbar";
import { RxCursorArrow } from "react-icons/rx";
import Toolbar from "@/components/home/toolbar";
import BottomToolbar from "@/components/home/buttom-toolbar";
import SideToolbar from "@/components/home/side-toolbar";

export default function HomePage() {
    const { undo, redo } = useShapeState.temporal.getState();
    const { shapes, setShape, updateShape, deleteShape } = useShapeState();
    const [position, setPosition] = useState<{ x: number; y: number } | null>();
    const { canvasRef, fabricRef, selectedToolRef, isEditingRef, pasteTimeRef, copiedObjectRef } = useCanvas();

    useEffect(() => renderCanvas({ shapes, fabricRef }), [shapes]);

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

                <div id="canvas" style={{ position: "relative", width: "100%", height: "calc(100vh - 65px)" }}>
                    <RxCursorArrow
                        style={position ? { position: "absolute", zIndex: 1, top: position.y, left: position.x } : { display: "none" }}
                    />
                    <Toolbar {...{ fabricRef, selectedToolRef }} />
                    <BottomToolbar {...{ fabricRef }} />
                    <canvas ref={canvasRef} />
                </div>
            </Stack>
        </>
    );
}

{
    /* 

           

          
         
 */
}
