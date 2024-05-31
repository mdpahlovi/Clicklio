import { Link } from "react-router-dom";
import Logo from "@/components/ui/logo";
import { SlLogin } from "react-icons/sl";
import { useRoomState } from "@/hooks/useRoomState";
import { useAuthState } from "@/hooks/useAuthState";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useCanvasState } from "@/hooks/useCanvasState";
import { PiShareFat, PiQuestion } from "react-icons/pi";
import AuthDropdown from "@/components/ui/auth-dropdown";
import { Box, Button, Divider, Sheet, Stack } from "@mui/joy";

export default function Navbar() {
    const { user } = useAuthState();
    const { toggleShareModal } = useRoomState();
    const { toggleHelpModal } = useCanvasState();

    return (
        <Sheet
            style={{ borderWidth: "0 0 1px 0" }}
            sx={{ height: 64, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
            <Box sx={{ display: { xs: "block", sm: "none" } }} />
            <Logo sx={{ display: { xs: "none", sm: "block" } }} />
            <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, md: 2.5 }}>
                <Button variant="outlined" color="neutral" startDecorator={<PiShareFat size={20} />} onClick={toggleShareModal}>
                    Share
                </Button>
                <ThemeToggle />
                <Divider orientation="vertical" />
                <IconButton onClick={toggleHelpModal}>
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

function IconButton({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div style={{ userSelect: "none", display: "flex", cursor: "pointer", ...style }} {...props}>
            {children}
        </div>
    );
}
