import { Form, FormInput } from "@/components/form";
import RoomCard from "@/components/rooms/room-card";
import RoomSkeletonGrid from "@/components/rooms/room-skeleton";
import ApiError from "@/components/ui/api-error";
import Modal from "@/components/ui/modal";
import NotFound from "@/components/ui/not-found";
import type { ApiResponse, Room } from "@/types/room";
import axios from "@/utils/axios";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const createRoomSchema = yup.object().shape({
    name: yup
        .string()
        .required("Please provide your room name.")
        .min(3, "Room name must be at least 3 characters.")
        .max(50, "Room name must not exceed 50 characters."),
    description: yup.string(),
});

type Response = ApiResponse<{ rooms: Room[]; total: number }>;

export default function RoomsPage() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading, error, refetch } = useQuery<Response>({
        queryKey: ["rooms"],
        queryFn: async () => await axios.get("/room"),
    });

    const { mutate: createRoom, isPending: isCreating } = useMutation({
        mutationFn: async (data) => await axios.post("/room", data),
        onSuccess: (response) => {
            refetch();
            navigate(`/room/${response.data.id}`);
            setIsOpen(false);
        },
    });

    if (isLoading) return <RoomSkeletonGrid />;
    if (error) return <ApiError onRetry={() => refetch()} />;

    const { rooms, total } = data?.data || {};

    return (
        <Box sx={{ height: "100%" }}>
            {rooms?.length ? (
                <>
                    <Stack p={2} direction="row" alignItems="center" justifyContent="space-between">
                        <Typography level="title-md" fontWeight="bold">
                            Total Room ({total})
                        </Typography>
                        <Button startDecorator={<BiPlus size={20} />} onClick={() => setIsOpen(true)}>
                            Create Room
                        </Button>
                    </Stack>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                            gap: 2,
                            px: 2,
                            pb: 0,
                        }}
                    >
                        {rooms?.map((room, index) => (
                            <RoomCard key={index} room={room} />
                        ))}
                    </Box>
                </>
            ) : (
                <NotFound onClick={() => setIsOpen(true)} />
            )}

            <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Create Room">
                <Form
                    defaultValues={{ name: "", description: "" }}
                    validationSchema={createRoomSchema}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onSubmit={(data) => createRoom(data)}
                >
                    <FormInput name="name" label="Room Name" />
                    <FormInput name="description" label="Description" />
                    <Button type="submit" sx={{ mt: 0.5 }} loading={isCreating}>
                        Create Room
                    </Button>
                </Form>
            </Modal>
        </Box>
    );
}
