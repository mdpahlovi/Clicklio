import Canvas from "@/components/canvas";
import GuideModal from "@/components/canvas/guide-modal";
import RoomNavbar from "@/components/rooms/room-navbar";
import ApiError from "@/components/ui/api-error";
import Loader from "@/components/ui/loader";
import { useCanvas } from "@/hooks/useCanvas";
import type { ApiResponse, Room } from "@/types/room";
import axios from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

type Response = ApiResponse<{ room: Room; events: [] }>;

export default function RoomPage() {
    const { id } = useParams();

    const { data, isLoading, isError } = useQuery<Response>({
        queryKey: ["room", id],
        queryFn: async () => await axios.get(`/room/${id}`),
    });

    if (isLoading) return <Loader />;
    if (isError) return <ApiError />;

    if (data?.data) return <Room room={data?.data?.room} />;
}

function Room({ room }: { room: Room }) {
    const [isOpen, setIsOpen] = useState(false);
    const { canvasRef, fabricRef, selectedToolRef } = useCanvas();

    return (
        <>
            <RoomNavbar room={room} setIsOpen={setIsOpen} />
            <Canvas {...{ canvasRef, fabricRef, selectedToolRef }} />

            <GuideModal isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}
