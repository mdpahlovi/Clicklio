import Canvas from "@/components/canvas";
import GuideModal from "@/components/canvas/guide-modal";
import RoomNavbar from "@/components/rooms/room-navbar";
import ApiError from "@/components/ui/api-error";
import Loader from "@/components/ui/loader";
import { useCanvas } from "@/hooks/useCanvas";
import { useEventStore } from "@/stores/canvas/useEventStore";
import type { RoomUser } from "@/stores/room/useUserStore";
import type { ApiResponse, Room } from "@/types/room";
import axios from "@/utils/axios";
import { socket } from "@/utils/socket";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Response = ApiResponse<{ room: Room; currUser: RoomUser; events: [] }>;

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

function Room({ room, currUser, events }: { room: Room; currUser: RoomUser; events: [] }) {
    const { resetEvent } = useEventStore();
    const { canvasRef, fabricRef, selectedToolRef } = useCanvas();

    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

    useEffect(() => {
        socket.emit("join:room", { room: room.id, user: currUser, events, isPrivate: true });

        return () => {
            socket.emit("leave:room", { room: room.id });
            resetEvent();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <RoomNavbar {...{ room, canvasRef, setIsGuideModalOpen }} />
            <Canvas {...{ canvasRef, fabricRef, selectedToolRef }} />

            <GuideModal isOpen={isGuideModalOpen} setIsOpen={setIsGuideModalOpen} />
        </>
    );
}
