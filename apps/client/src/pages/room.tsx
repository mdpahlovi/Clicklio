import Canvas from "@/components/canvas";
import GuideModal from "@/components/canvas/guide-modal";
import RoomNavbar from "@/components/rooms/room-navbar";
import ApiError from "@/components/ui/api-error";
import Loader from "@/components/ui/loader";
import { useCanvas } from "@/hooks/useCanvas";
import { usePersist } from "@/hooks/usePersist";
import { useCanvasState } from "@/stores/canvas/useCanvasState";
import { useEventStore } from "@/stores/canvas/useEventStore";
import { useUserStore, type RoomUser } from "@/stores/room/useUserStore";
import type { ShapeEvent } from "@/types/event";
import type { ApiResponse, Room } from "@/types/room";
import axios from "@/utils/axios";
import { renderCanvas } from "@/utils/canvas";
import { socket } from "@/utils/socket";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type RoomProps = {
    room: Room;
    currUser: RoomUser;
    roomUser: Record<string, string>;
    events: ShapeEvent[];
};
type Response = ApiResponse<RoomProps>;

export default function RoomPage() {
    const { id } = useParams();

    const { data, isLoading, isError } = useQuery<Response>({
        queryKey: ["room", id],
        queryFn: async () => await axios.get(`/room/${id}`),
    });

    if (isLoading) return <Loader />;
    if (isError) return <ApiError />;

    if (data?.data) return <Room {...data.data} />;
}

function Room({ room, currUser, roomUser, events }: RoomProps) {
    const { refresh, setRefresh } = useCanvasState();
    const { shapes, createEvent, resetEvent } = useEventStore();
    const { setInitialData, createUser, deleteUser, resetUser } = useUserStore();

    const { canvasRef, fabricRef, selectedToolRef } = useCanvas();

    // persist events
    usePersist({ canvasRef });

    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => renderCanvas({ shapes, fabricRef }), [refresh]);

    useEffect(() => {
        setInitialData({ currUser, roomUser });
        if (events.length > 0) {
            events.forEach((event) => createEvent(event, false));
            setRefresh();
        }

        socket.emit("join:room_private", { room: room.id, user: currUser });

        socket.on("create:user", ({ key, value }: { key: string; value: RoomUser }) => createUser(key, value));
        socket.on("delete:user", ({ key }: { key: string }) => deleteUser(key));

        socket.on("create:event", ({ event }: { event: ShapeEvent }) => {
            createEvent(event, false);
            setRefresh();
        });

        return () => {
            socket.emit("leave:room");
            socket.off("create:user");
            socket.off("delete:user");
            socket.off("create:event");
            resetUser();
            resetEvent();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <RoomNavbar {...{ room, canvasRef, setIsGuideModalOpen }} />
            <Canvas {...{ canvasRef, fabricRef, selectedToolRef, room: room.id }} />

            <GuideModal isOpen={isGuideModalOpen} setIsOpen={setIsGuideModalOpen} />
        </>
    );
}
