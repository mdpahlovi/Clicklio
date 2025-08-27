import RoomUsers from "@/components/home/room-users";
import { ChattingIcon, ShareIcon, SigninIcon } from "@/components/icons";
import AuthDropdown from "@/components/ui/auth-dropdown";
import Menubar from "@/components/ui/menubar";
import { useAuthState } from "@/stores/auth/useAuthStore";
import { socket, type SocketResponse } from "@/utils/socket";
import { Button, IconButton, Sheet, styled, Tooltip } from "@mui/joy";
import { Device, types } from "mediasoup-client";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

type NavbarProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    setIsGuideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsShareModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    room: string | null;
    device: Device | null;
    setDevice: React.Dispatch<React.SetStateAction<Device | null>>;
};

type CreateRouterResponse = SocketResponse<{ rtpCapabilities: types.RtpCapabilities }>;

export default function Navbar({ canvasRef, setIsGuideModalOpen, setIsShareModalOpen, room, device, setDevice }: NavbarProps) {
    const { user } = useAuthState();

    return (
        <>
            <NavbarSheet position="left">
                <Menubar {...{ canvasRef, setIsGuideModalOpen }} />
            </NavbarSheet>
            {room ? (
                <NavbarSheet position="center">
                    <Tooltip title="Chat">
                        <IconButton
                            onClick={async () => {
                                try {
                                    socket.emit("create:router", { room }, async (response: CreateRouterResponse) => {
                                        const device = new Device();
                                        await device.load({ routerRtpCapabilities: response.data.rtpCapabilities });

                                        setDevice(device);
                                    });
                                } catch (error) {
                                    toast.error("Failed to create router");
                                }
                            }}
                            disabled={device !== null}
                        >
                            <ChattingIcon />
                        </IconButton>
                    </Tooltip>
                    <RoomUsers />
                </NavbarSheet>
            ) : null}
            <NavbarSheet position="right">
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

const NavbarSheet = styled(Sheet)<{ position: "left" | "right" | "center" }>(({ position }) => ({
    position: "fixed",
    top: 16,
    ...(position === "center" ? { right: 178 } : { [position]: 16 }),
    zIndex: 10,
    padding: 4,
    borderRadius: 99,
    display: "flex",
    gap: 4,
}));
