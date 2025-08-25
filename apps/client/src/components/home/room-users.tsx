import { useUserStore } from "@/stores/room/useUserStore";
import { Avatar, AvatarGroup } from "@mui/joy";

export default function RoomUsers() {
    const { currUser, roomUser } = useUserStore();

    if (currUser) {
        const users = Array.from(roomUser.values());

        return (
            <AvatarGroup>
                <Avatar alt={currUser.name} />
                {users?.length ? <Avatar>+{`${users.length}`.padStart(2, "0")}</Avatar> : null}
            </AvatarGroup>
        );
    }
}
