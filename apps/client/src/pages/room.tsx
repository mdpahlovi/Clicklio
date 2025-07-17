import RoomCard from "@/components/rooms/room-card";
import RoomSkeletonGrid from "@/components/rooms/room-skeleton";
import ApiError from "@/components/ui/api-error";
import NotFound from "@/components/ui/not-found";
import type { RoomUserRole } from "@/stores/room/useUserStore";
import axios from "@/utils/axios";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { BiPlus } from "react-icons/bi";

export type Room = {
    id: string;
    name: string;
    photo: string | null;
    description: string | null;
    roomUsers: {
        role: RoomUserRole;
        userInfo: {
            id: string;
            name: string;
            email: string;
            photo: string | null;
        };
    }[];
    createdAt: string;
};

type ApiResponse = {
    status: number;
    message: string;
    data: {
        rooms: Room[];
        total: number;
    };
};

export default function RoomPage() {
    const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
        queryKey: ["rooms"],
        queryFn: async () => await axios.get("/room"),
    });

    if (isLoading) return <RoomSkeletonGrid />;
    if (error) return <ApiError onRetry={() => refetch()} />;

    const { rooms, total } = data?.data || {};

    return (
        <Box sx={{ height: "100%" }}>
            {rooms?.length ? (
                <>
                    <Stack p={2} direction="row" alignItems="center" justifyContent="space-between">
                        <Typography level="title-sm">Total Room ({total})</Typography>
                        <Button startDecorator={<BiPlus size={20} />}>Create Room</Button>
                    </Stack>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: 2,
                            p: 2,
                            pt: 0,
                        }}
                    >
                        {rooms?.map((room, index) => (
                            <RoomCard key={index} room={room} />
                        ))}
                    </Box>
                </>
            ) : (
                <NotFound />
            )}
        </Box>
    );
}
