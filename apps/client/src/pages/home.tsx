import Canvas from "@/components/canvas";
import GuideModal from "@/components/canvas/guide-modal";
import ShareModal from "@/components/canvas/share-modal";
import Navbar from "@/components/home/navbar";
import { useCanvas } from "@/hooks/useCanvas";
import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useShapeState } from "@/hooks/zustand/useShapeState";
import { useRoomUserStore, type RoomUser } from "@/stores/useRoomUserStore";
import { renderCanvas } from "@/utils/canvas";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const [shareTo, setShareTo] = useState(null);
    const { refresh, setRefresh } = useCanvasState();
    const { canvasRef, fabricRef, roomRef, selectedToolRef } = useCanvas();
    const { setCurUser, createUser, updateUser, deleteUser } = useRoomUserStore();
    const { shapes, history, position, setShapes, setShape, updateShape, deleteShape, setInitialState, undo, redo } = useShapeState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => renderCanvas({ shapes, fabricRef }), [refresh]);

    useEffect(() => {
        if (roomRef.current) {
            const currUser = JSON.parse(sessionStorage.getItem("currUser") || "null");
            socket.emit("join:room", { room: roomRef.current, user: currUser });
        }

        // Room user events
        socket.on("join:room", ({ users }: { users: Record<string, RoomUser> }) => {
            Object.entries(users).forEach(([key, value]) => {
                if (key === socket.id) {
                    setCurUser(value);
                } else {
                    createUser(key, value);
                }
            });
        });
        socket.on("update:user", ({ key, value }: { key: string; value: RoomUser }) => updateUser(key, value));
        socket.on("delete:user", ({ key }: { key: string }) => deleteUser(key));

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

        return () => {};
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
            <Navbar {...{ setIsGuideModalOpen, setIsShareModalOpen }} />
            <Canvas {...{ canvasRef, fabricRef, selectedToolRef }} />

            <GuideModal isOpen={isGuideModalOpen} setIsOpen={setIsGuideModalOpen} />
            <ShareModal isOpen={isShareModalOpen} setIsOpen={setIsShareModalOpen} {...{ roomRef }} />
        </div>
    );
}
