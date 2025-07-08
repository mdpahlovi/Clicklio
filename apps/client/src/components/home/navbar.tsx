import AuthDropdown from "@/components/ui/auth-dropdown";
import Logo from "@/components/ui/logo";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useAuthState } from "@/hooks/useAuthState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useRoomState } from "@/hooks/useRoomState";
import { Box, Button, Divider, IconButton, Sheet, Stack } from "@mui/joy";
import { PiQuestion, PiShareFat } from "react-icons/pi";
import { SlLogin } from "react-icons/sl";
import { Link } from "react-router-dom";
import RoomUsers from "./room-users";

export default function Navbar() {
    const { user } = useAuthState();
    const { toggleShareModal } = useRoomState();
    const { toggleHelpModal } = useCanvasState();

    return (
        <Sheet
            style={{ borderWidth: "0 0 1px 0" }}
            sx={{ height: 64, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
            <Logo sx={{ display: { xs: "none", sm: "block" } }} />
            <Box sx={{ display: { xs: "block", sm: "none" } }} style={{ height: 40 }}>
                <img src="/logo/icon.png" alt="" width={40} height={40} />
            </Box>
            <Stack direction="row" alignItems="center" gap={{ xs: 1.5, md: 2.5 }}>
                <RoomUsers />
                <Button variant="outlined" color="neutral" startDecorator={<PiShareFat size={20} />} onClick={toggleShareModal}>
                    Share
                </Button>
                <ThemeToggle />
                <Divider orientation="vertical" sx={{ mr: { xs: 1, sm: 0 } }} />
                <IconButton onClick={toggleHelpModal} sx={{ display: { xs: "none", md: "inline-flex" } }}>
                    <PiQuestion size={24} />
                </IconButton>

                {user && user?.id ? (
                    <AuthDropdown />
                ) : (
                    <Link to="/signin" style={{ userSelect: "none", display: "flex" }}>
                        <SlLogin size={24} />
                    </Link>
                )}
            </Stack>
        </Sheet>
    );
}
