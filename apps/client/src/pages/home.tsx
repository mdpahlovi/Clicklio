import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import { renderCanvas } from "@/utils/canvas";
import { useCanvas } from "@/hooks/useCanvas";
import { useAuthState } from "@/hooks/useAuthState";
import { useShapeState } from "@/hooks/useShapeState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { usePeriodicSave } from "@/hooks/usePeriodicSave";
import { User, useRoomState } from "@/hooks/useRoomState";

import Navbar from "@/components/home/navbar";
import Toolbar from "@/components/home/toolbar";
import Sidebar from "@/components/home/sidebar";
import HelpModal from "@/components/home/help-modal";
import ShareModal from "@/components/home/share-modal";
import RemoteCursor from "@/components/ui/remote-cursor";
import FloatingMenu from "@/components/home/floating-menu";
import BottomToolbar from "@/components/home/buttom-toolbar";
import CanvasContainer from "@/components/home/canvas-container";
import { Box } from "@mui/joy";

export default function HomePage() {
    const [shareTo, setShareTo] = useState(null);
    const { user } = useAuthState();
    const { setUsers } = useRoomState();
    const { refresh, setRefresh } = useCanvasState();
    const { canvasRef, fabricRef, roomRef, selectedToolRef } = useCanvas();
    const { saveShapes, isUpToDate } = usePeriodicSave({ fabricRef });
    const { shapes, history, position, setShapes, setShape, updateShape, deleteShape, setInitialState, undo, redo } = useShapeState();

    useEffect(() => renderCanvas({ shapes, fabricRef }), [refresh]);

    useEffect(() => {
        if (roomRef.current) socket.emit("join:room", { room: roomRef.current, name: user?.name });

        socket.on("room:users", ({ users: userData, to }) => {
            const users: User[] = userData.map((user: string) => JSON.parse(user));
            setUsers(users);

            if (to && users?.length > 1 && users[0]?.id === socket.id) setShareTo(to);
        });

        socket.on("initial:state", ({ shapes, history, position }) => {
            setInitialState({ shapes, history, position });
            setRefresh();
        });

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
        socket.on("reset:canvas", ({ status }) => {
            if (status) {
                setShapes([]);
                fabricRef.current?.clear();
            }
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
            socket.off("reset:canvas", ({ status }) => {
                if (status) {
                    setShapes([]);
                    fabricRef.current?.clear();
                }
                setRefresh();
            });
        };
    }, []);

    useEffect(() => {
        if (shareTo) {
            socket.emit("initial:state", { to: shareTo, shapes, history, position });
            setShareTo(null);
        }
    }, [shareTo]);

    return (
        <Box sx={{ position: "fixed", width: "100vw", height: "100vh" }}>
            <Navbar />
            <div style={{ display: "flex" }}>
                <Sidebar {...{ fabricRef, saveShapes, isUpToDate }} />
                <CanvasContainer>
                    <RemoteCursor />
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
