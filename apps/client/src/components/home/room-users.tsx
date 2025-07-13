import { useUserStore } from "@/stores/room/useUserStore";
import { Avatar, AvatarGroup } from "@mui/joy";
import { useSearchParams } from "react-router-dom";

export default function RoomUsers() {
    const { currUser, roomUser } = useUserStore();

    const room = useSearchParams()[0].get("room");

    if (room && currUser) {
        const users = Array.from(roomUser.values());

        return (
            <AvatarGroup>
                <Avatar alt={currUser.name} />
                {users?.length ? <Avatar>+{`${users.length}`.padStart(2, "0")}</Avatar> : null}
            </AvatarGroup>
        );
    }
}
