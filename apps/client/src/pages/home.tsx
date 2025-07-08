import Canvas from "@/components/canvas";
import HelpModal from "@/components/canvas/help-modal";
import Navbar from "@/components/home/navbar";
import ShareModal from "@/components/home/share-modal";
import { useCanvas } from "@/hooks/useCanvas";
import { useCanvasState } from "@/hooks/useCanvasState";
import { type User, useRoomState } from "@/hooks/useRoomState";
import { useShapeState } from "@/hooks/useShapeState";
import { renderCanvas } from "@/utils/canvas";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [shareTo, setShareTo] = useState(null);
    const { refresh, setRefresh } = useCanvasState();
    const { name, setName, updateName, setUsers } = useRoomState();
    const { canvasRef, fabricRef, roomRef, selectedToolRef } = useCanvas();
    const { shapes, history, position, setShapes, setShape, updateShape, deleteShape, setInitialState, undo, redo } = useShapeState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => renderCanvas({ shapes, fabricRef }), [refresh]);

    useEffect(() => {
        if (roomRef.current) socket.emit("join:room", { room: roomRef.current, name });

        socket.on("room:users", ({ users, to }) => {
            setName(users?.find((user: User) => user.id === socket.id)?.name);
            setUsers(users);

            if (to && users?.length > 1 && users[0]?.id === socket.id) setShareTo(to);
        });

        socket.on("update:name", ({ id, name }) => updateName(id, name));

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
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    fabricRef.current?.clear();
                }
                setRefresh();
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (shareTo) {
            socket.emit("initial:state", { to: shareTo, shapes, history, position });
            setShareTo(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shareTo]);

    return (
        <div>
            <Navbar />
            <Canvas {...{ canvasRef, fabricRef, selectedToolRef }} />

            <HelpModal />
            <ShareModal {...{ roomRef }} />
        </div>
    );
}
