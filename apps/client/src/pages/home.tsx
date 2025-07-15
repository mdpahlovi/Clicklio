import Canvas from "@/components/canvas";
import GuideModal from "@/components/canvas/guide-modal";
import ShareModal from "@/components/canvas/share-modal";
import Navbar from "@/components/home/navbar";
import { useCanvas } from "@/hooks/useCanvas";
import { useCanvasState } from "@/hooks/zustand/useCanvasState";
import { useShapeStore } from "@/stores/room/useShapeStore";
import { useUserStore, type RoomUser } from "@/stores/room/useUserStore";
import { renderCanvas } from "@/utils/canvas";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type JoinRoomResponse = { users: Record<string, RoomUser>; shapes: Record<string, Record<string, unknown>> };

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const room = searchParams.get("room");

    const { refresh, setRefresh } = useCanvasState();
    const { canvasRef, fabricRef, selectedToolRef } = useCanvas();
    const { shapes, createShape, updateShape, deleteShape } = useShapeStore();
    const { currUser, createCurrUser, deleteCurrUser, createUser, updateUser, deleteUser } = useUserStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => renderCanvas({ shapes, fabricRef }), [refresh]);

    useEffect(() => {
        if (room) {
            if (socket.connected) {
                let user = currUser;
                if (!user) user = createCurrUser(room, "USER");
                socket.emit("join:room", { room: room, user });
            } else {
                searchParams.delete("room");
                setSearchParams(searchParams);
            }
        } else {
            deleteCurrUser();
        }

        // Room user events
        socket.on("join:room", ({ users, shapes }: JoinRoomResponse) => {
            Object.entries(users).forEach(([key, value]) => createUser(key, value));
            Object.entries(shapes).forEach(([key, value]) => createShape(key, value));

            setRefresh();
        });

        socket.on("create:user", ({ key, value }: { key: string; value: RoomUser }) => createUser(key, value));
        socket.on("update:user", ({ key, value }: { key: string; value: RoomUser }) => updateUser(key, value));
        socket.on("delete:user", ({ key }: { key: string }) => deleteUser(key));

        socket.on("create:shape", ({ key, value }: { key: string; value: Record<string, unknown> }) => {
            createShape(key, value);
            setRefresh();
        });
        socket.on("update:shape", ({ key, value }: { key: string; value: Record<string, unknown> }) => {
            updateShape(key, value);
            setRefresh();
        });
        socket.on("delete:shape", ({ key }: { key: string }) => {
            deleteShape(key);
            setRefresh();
        });
        // socket.on("undo:shape", ({ status }) => {
        //     // UNDO REDO FUNCTIONALITY
        // });
        // socket.on("redo:shape", ({ status }) => {
        //     // UNDO REDO FUNCTIONALITY
        // });
        // socket.on("reset:canvas", ({ status }) => {
        //     // RESET CANVAS FUNCTIONALITY
        // });

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // useEffect(() => {
    //     if (shareTo) {
    //         socket.emit("initial:state", { to: shareTo, shapes, history, position });
    //         setShareTo(null);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [shareTo]);

    return (
        <div>
            <Navbar {...{ setIsGuideModalOpen, setIsShareModalOpen }} />
            <Canvas {...{ canvasRef, fabricRef, selectedToolRef }} />

            <GuideModal isOpen={isGuideModalOpen} setIsOpen={setIsGuideModalOpen} />
            <ShareModal isOpen={isShareModalOpen} setIsOpen={setIsShareModalOpen} />
        </div>
    );
}
