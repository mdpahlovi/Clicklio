import RoomUsers from "@/components/home/room-users";
import { MenuIcon } from "@/components/icons";
import AuthDropdown from "@/components/ui/auth-dropdown";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useAuthState } from "@/stores/auth/useAuthStore";
import { Button, Divider, IconButton, Sheet, styled } from "@mui/joy";
import { PiQuestion, PiShareFat } from "react-icons/pi";
import { SlLogin } from "react-icons/sl";
import { Link } from "react-router-dom";

type NavbarProps = {
    setIsGuideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsShareModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navbar({ setIsGuideModalOpen, setIsShareModalOpen }: NavbarProps) {
    const { user } = useAuthState();

    return (
        <>
            <NavbarSheet position="left">
                <IconButton>
                    <MenuIcon />
                </IconButton>
            </NavbarSheet>
            <NavbarSheet position="right">
                <RoomUsers />
                <Button color="neutral" variant="plain" startDecorator={<PiShareFat size={20} />} onClick={() => setIsShareModalOpen(true)}>
                    Share
                </Button>
                <ThemeToggle />
                <Divider orientation="vertical" sx={{ mr: { xs: 1, sm: 0 } }} />
                <IconButton onClick={() => setIsGuideModalOpen(true)} sx={{ display: { xs: "none", md: "inline-flex" } }}>
                    <PiQuestion />
                </IconButton>

                {user && user?.id ? (
                    <AuthDropdown />
                ) : (
                    <Link to="/signin" style={{ userSelect: "none", display: "flex" }}>
                        <SlLogin />
                    </Link>
                )}
            </NavbarSheet>
        </>
    );
}

const NavbarSheet = styled(Sheet)<{ position: "left" | "right" }>(({ position }) => ({
    position: "absolute",
    top: 16,
    [position]: 16,
    zIndex: 10,
    padding: 4,
    borderRadius: 99,
    display: "flex",
    gap: 4,
}));
