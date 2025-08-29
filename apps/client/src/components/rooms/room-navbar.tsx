import RoomUsers from "@/components/home/room-users";
import AuthDropdown from "@/components/ui/auth-dropdown";
import Menubar from "@/components/ui/menubar";
import type { Room } from "@/types/room";
import { Sheet, styled } from "@mui/joy";

type RoombarProps = {
    room: Room;
    setIsGuideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RoomNavbar({ room, setIsGuideModalOpen }: RoombarProps) {
    console.log(room);
    return (
        <>
            <RoomNavbarSheet position="left">
                <Menubar {...{ setIsGuideModalOpen }} />
            </RoomNavbarSheet>
            <RoomNavbarSheet position="right">
                <RoomUsers />
                <AuthDropdown />
            </RoomNavbarSheet>
        </>
    );
}

const RoomNavbarSheet = styled(Sheet)<{ position: "left" | "right" }>(({ position }) => ({
    position: "fixed",
    top: 16,
    [position]: 16,
    zIndex: 10,
    padding: 4,
    borderRadius: 99,
    display: "flex",
    gap: 4,
}));
