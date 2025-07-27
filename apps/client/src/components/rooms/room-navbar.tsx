import RoomUsers from "@/components/home/room-users";
import { ArrowLeftIcon } from "@/components/icons";
import ThemeToggle from "@/components/ui/theme-toggle";
import type { Room } from "@/types/room";
import { IconButton, Sheet, styled } from "@mui/joy";
import { PiQuestion } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

type RoombarProps = {
    room: Room;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RoomNavbar({ room, setIsOpen }: RoombarProps) {
    const navigate = useNavigate();

    console.log(room);
    return (
        <>
            <RoomNavbarSheet position="left">
                <IconButton onClick={() => navigate(`/rooms`)}>
                    <ArrowLeftIcon />
                </IconButton>
            </RoomNavbarSheet>
            <RoomNavbarSheet position="right">
                <RoomUsers />
                <ThemeToggle />
                <IconButton onClick={() => setIsOpen(true)} sx={{ display: { xs: "none", md: "inline-flex" } }}>
                    <PiQuestion />
                </IconButton>
            </RoomNavbarSheet>
        </>
    );
}

const RoomNavbarSheet = styled(Sheet)<{ position: "left" | "right" }>(({ position }) => ({
    position: "absolute",
    top: 16,
    [position]: 16,
    zIndex: 10,
    height: 36,
    padding: 4,
    borderRadius: 99,
    display: "flex",
    gap: 4,
}));
