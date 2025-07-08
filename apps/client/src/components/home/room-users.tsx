import { useRoomState } from "@/hooks/useRoomState";
import { socket } from "@/utils/socket";
import { Avatar, AvatarGroup } from "@mui/joy";
import { useSearchParams } from "react-router-dom";

export default function RoomUsers() {
    const { users } = useRoomState();
    const [searchParams] = useSearchParams();

    const room = searchParams.get("room");

    if (room && users?.length) {
        const currentUserIndex = users.findIndex(({ id }) => id === socket.id);

        if (currentUserIndex !== -1) {
            return (
                <AvatarGroup>
                    <Avatar alt={users[currentUserIndex].name} />
                    {users.length - 1 ? <Avatar>+{(users.length - 1).toString().padStart(2, "0")}</Avatar> : null}
                </AvatarGroup>
            );
        }
    }
}
