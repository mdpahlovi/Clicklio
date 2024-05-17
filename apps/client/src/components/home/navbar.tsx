import { Link } from "react-router-dom";
import { SlLogin } from "react-icons/sl";
import { useRoomState } from "@/hooks/useRoomState";
import { useAuthState } from "@/hooks/useAuthState";
import { useCanvasState } from "@/hooks/useCanvasState";
import { PiShareFat, PiSun, PiMoon, PiQuestion } from "react-icons/pi";
import { Button, Divider, Sheet, Stack, useColorScheme } from "@mui/joy";

export default function Navbar() {
    const { user } = useAuthState();
    const { mode, setMode } = useColorScheme();
    const { toggleShareModal } = useRoomState();
    const { toggleHelpModal } = useCanvasState();

    return (
        <Sheet
            style={{ borderWidth: "0 0 1px 0" }}
            sx={{ height: 64, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
            <img src={`/logo/${mode}.png`} alt="" width={128} />
            <Stack direction="row" alignItems="center" spacing={2.5}>
                <Button variant="outlined" color="neutral" startDecorator={<PiShareFat size={20} />} onClick={toggleShareModal}>
                    Share
                </Button>
                <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")}>
                    {mode === "light" ? <PiSun size={24} /> : <PiMoon size={24} />}
                </IconButton>
                <Divider orientation="vertical" />
                <IconButton onClick={toggleHelpModal}>
                    <PiQuestion size={24} />
                </IconButton>

                {user?.id ? (
                    ""
                ) : (
                    <Link
                        to="/signin"
                        style={{
                            userSelect: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: mode === "light" ? "black" : "white",
                        }}
                    >
                        <SlLogin size={24} />
                    </Link>
                )}
            </Stack>
        </Sheet>
    );
}

function IconButton({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            style={{ userSelect: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", ...style }}
            {...props}
        >
            {children}
        </div>
    );
}
