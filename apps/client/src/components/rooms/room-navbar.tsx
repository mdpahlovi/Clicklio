import type { Room } from "@/types/room";
import { Divider, IconButton, Sheet, Stack, Typography } from "@mui/joy";
import { PiQuestion } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ui/theme-toggle";

export default function RoomNavbar({ room, setIsOpen }: { room: Room; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate = useNavigate();

    return (
        <Sheet
            style={{ height: 64, paddingInline: 24, borderWidth: "0 0 1px 0" }}
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: { xs: 1.5, md: 2.5 } }}
        >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
                <IconButton variant="solid" color="primary" onClick={() => navigate(`/rooms`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                        <path
                            d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </IconButton>

                <Typography level="h4" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {room.name}
                </Typography>
            </Stack>
            <Stack direction="row" gap={{ xs: 1.5, md: 2.5 }}>
                <ThemeToggle />
                <Divider orientation="vertical" sx={{ mr: { xs: 1, sm: 0 }, display: { xs: "none", md: "inline-flex" } }} />
                <IconButton onClick={() => setIsOpen(true)} sx={{ display: { xs: "none", md: "inline-flex" } }}>
                    <PiQuestion size={24} />
                </IconButton>
            </Stack>
        </Sheet>
    );
}
