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
import AuthModal from "@/components/home/auth-modal";
import HelpModal from "@/components/home/help-modal";
import ShareModal from "@/components/home/share-modal";
import SideToolbar from "@/components/home/side-toolbar";
import RemoteCursor from "@/components/ui/remote-cursor";
import BottomToolbar from "@/components/home/buttom-toolbar";
import CanvasContainer from "@/components/home/canvas-container";

export default function HomePage() {
    const { undo, redo } = useShapeState.temporal.getState();
    const { refresh, setRefresh } = useCanvasState();
    const { saveShapes, isUpToDate } = usePeriodicSave();
    const { shapes, setShape, updateShape, deleteShape } = useShapeState();
    const { canvasRef, fabricRef, roomRef, selectedToolRef, isEditingRef, pasteTimeRef, copiedObjectRef } = useCanvas();

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
        <>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar {...{ saveShapes, isUpToDate }} />

                <SideToolbar {...{ fabricRef, isEditingRef, pasteTimeRef, copiedObjectRef }} />

                <CanvasContainer>
                    <RemoteCursor {...{ roomRef }} />
                    <Toolbar {...{ fabricRef, selectedToolRef }} />
                    <BottomToolbar {...{ fabricRef }} />
                    <canvas ref={canvasRef} />
                </CanvasContainer>
            </div>

            <AuthModal />
            <HelpModal />
            <ShareModal {...{ roomRef }} />
        </>
    );
}
