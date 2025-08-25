import RoomUsers from "@/components/home/room-users";
import { ShareIcon, SigninIcon } from "@/components/icons";
import AuthDropdown from "@/components/ui/auth-dropdown";
import Menubar from "@/components/ui/menubar";
import { useAuthState } from "@/stores/auth/useAuthStore";
import { Button, IconButton, Sheet, styled } from "@mui/joy";
import { Link } from "react-router-dom";

type NavbarProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    setIsGuideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsShareModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    room: string | null;
};

export default function Navbar({ canvasRef, setIsGuideModalOpen, setIsShareModalOpen, room }: NavbarProps) {
    const { user } = useAuthState();

    return (
        <>
            <NavbarSheet position="left">
                <Menubar {...{ canvasRef, setIsGuideModalOpen }} />
            </NavbarSheet>
            <NavbarSheet position="right">
                {room ? <RoomUsers /> : null}
                <Button color="neutral" variant="plain" startDecorator={<ShareIcon />} onClick={() => setIsShareModalOpen(true)}>
                    Share
                </Button>
                {user && user?.id ? (
                    <AuthDropdown />
                ) : (
                    <Link to="/signin">
                        <IconButton>
                            <SigninIcon />
                        </IconButton>
                    </Link>
                )}
            </NavbarSheet>
        </>
    );
}

const NavbarSheet = styled(Sheet)<{ position: "left" | "right" }>(({ position }) => ({
    position: "fixed",
    top: 16,
    [position]: 16,
    zIndex: 10,
    padding: 4,
    borderRadius: 99,
    display: "flex",
    gap: 4,
}));
