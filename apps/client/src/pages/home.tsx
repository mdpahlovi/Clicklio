import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { renderCanvas } from "@/utils/canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { usePeriodicSave } from "@/hooks/usePeriodicSave";

import Navbar from "@/components/home/navbar";
import Toolbar from "@/components/home/toolbar";
import Sidebar from "@/components/home/sidebar";
import HelpModal from "@/components/home/help-modal";
import ShareModal from "@/components/home/share-modal";
// import SideToolbar from "@/components/home/side-toolbar";
import RemoteCursor from "@/components/ui/remote-cursor";
import FloatingMenu from "@/components/home/floating-menu";
import BottomToolbar from "@/components/home/buttom-toolbar";
import CanvasContainer from "@/components/home/canvas-container";
import { Box } from "@mui/joy";

export default function HomePage() {
    const { undo, redo } = useShapeState.temporal.getState();
    const { refresh, setRefresh } = useCanvasState();
    const { shapes, setShape, updateShape, deleteShape } = useShapeState();
    const { canvasRef, fabricRef, roomRef, selectedToolRef } = useCanvas();
    const { saveShapes, isUpToDate } = usePeriodicSave({ fabricRef });

    useEffect(() => renderCanvas({ shapes, fabricRef }), [refresh]);

    useEffect(() => {
        socket.emit("join:room", { room: roomRef.current });

        socket.on("set:shape", (shape) => {
            setShape(shape);
            setRefresh();
        });
        socket.on("update:shape", (shape) => {
            updateShape(shape);
            setRefresh();
        });
        socket.on("delete:shape", ({ objectId }) => {
            deleteShape(objectId);
            setRefresh();
        });
        socket.on("undo:shape", ({ status }) => {
            if (status) undo();
            setRefresh();
        });
        socket.on("redo:shape", ({ status }) => {
            if (status) redo();
            setRefresh();
        });

        return () => {
            socket.off("set:shape", (shape) => {
                setShape(shape);
                setRefresh();
            });
            socket.off("update:shape", (shape) => {
                updateShape(shape);
                setRefresh();
            });
            socket.off("delete:shape", ({ objectId }) => {
                deleteShape(objectId);
                setRefresh();
            });
            socket.off("undo:shape", ({ status }) => {
                if (status) undo();
                setRefresh();
            });
            socket.off("redo:shape", ({ status }) => {
                if (status) redo();
                setRefresh();
            });
        };
    }, []);

    return (
        <Box sx={{ position: "fixed", width: "100vw", height: "100vh" }}>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar {...{ saveShapes, isUpToDate }} />
                <CanvasContainer>
                    <RemoteCursor {...{ roomRef }} />
                    <FloatingMenu {...{ fabricRef }} />
                    <Toolbar {...{ fabricRef, selectedToolRef }} />
                    <BottomToolbar {...{ fabricRef }} />
                    <canvas ref={canvasRef} />
                </CanvasContainer>
            </div>

            <HelpModal />
            <ShareModal {...{ roomRef }} />
        </Box>
    );
}
