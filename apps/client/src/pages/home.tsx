import GuideModal from "@/components/canvas/guide-modal";
import ShareModal from "@/components/canvas/share-modal";
import Navbar from "@/components/home/navbar";
import { useCanvas } from "@/hooks/useCanvas";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import { useUserStore, type RoomUser } from "@/stores/room/useUserStore";
import type { ShapeEvent } from "@/types/event";
import { renderCanvas } from "@/utils/canvas";
import { socket, type SocketResponse } from "@/utils/socket";
import type { Device } from "mediasoup-client";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Canvas from "@/components/canvas";

type JoinRoomResponse = { users: Record<string, string>; events: string[] };

export default function HomePage() {
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [device, setDevice] = useState<Device | null>(null);

    const { refresh, setRefresh } = useCanvasState();
    const { shapes, createEvent, resetEvent } = useEventStore();
    const { stageRef, selectedToolRef } = useCanvas();
    const { currUser, createCurrUser, deleteCurrUser, createUser, updateUser, deleteUser, resetUser } = useUserStore();

    const [searchParam, setSearchParam] = useSearchParams();
    const room = searchParam.get("room");

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => renderCanvas({ shapes, stageRef }), [refresh]);

    useEffect(() => {
        if (room) {
            let user = currUser;
            if (!user) user = createCurrUser(room, "USER");
            socket.emit("join:room", { room, user }, (response: SocketResponse<JoinRoomResponse>) => {
                if (response.success) {
                    Object.entries(response.data.users).forEach(([key, value]) => createUser(key, JSON.parse(value)));
                    response.data.events.forEach((event) => createEvent(JSON.parse(event), false));
                    setRefresh();
                } else {
                    deleteCurrUser();
                    setSearchParam({});
                }
            });
        } else {
            deleteCurrUser();
        }

        socket.on("create:user", ({ key, value }: { key: string; value: RoomUser }) => createUser(key, value));
        socket.on("update:user", ({ key, value }: { key: string; value: RoomUser }) => updateUser(key, value));
        socket.on("delete:user", ({ key }: { key: string }) => deleteUser(key));

        socket.on("create:event", ({ event }: { event: ShapeEvent }) => {
            createEvent(event, false);
            setRefresh();
        });

        return () => {
            socket.emit("leave:room");
            socket.off("create:user");
            socket.off("update:user");
            socket.off("delete:user");
            socket.off("create:event");
            resetUser();
            resetEvent();
        };
    }, []);

    return (
        <div>
            <Navbar {...{ stageRef, setIsGuideModalOpen, setIsShareModalOpen, room, device, setDevice }} />
            <Canvas {...{ stageRef, selectedToolRef, room, device }} />

            <GuideModal isOpen={isGuideModalOpen} setIsOpen={setIsGuideModalOpen} />
            <ShareModal isOpen={isShareModalOpen} setIsOpen={setIsShareModalOpen} />
        </div>
    );
}
