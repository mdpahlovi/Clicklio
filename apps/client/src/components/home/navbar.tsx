import { SlLogin } from "react-icons/sl";
import { PiShareFat, PiSun, PiMoon, PiQuestion } from "react-icons/pi";
import { Button, Divider, Sheet, Stack, useColorScheme, useTheme } from "@mui/joy";

export default function Navbar() {
    const { palette } = useTheme();
    const { mode, setMode } = useColorScheme();

    return (
        <Sheet
            style={{ borderWidth: "0 0 1px 0" }}
            sx={{ height: 64, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
            <img src={`/logo/${palette.mode}.png`} alt="" width={128} />
            <Stack direction="row" alignItems="center" spacing={2.5}>
                <Button variant="outlined" color="neutral" startDecorator={<PiShareFat size={20} />}>
                    Share
                </Button>
                <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")}>
                    {mode === "light" ? <PiSun size={24} /> : <PiMoon size={24} />}
                </IconButton>
                <Divider orientation="vertical" />
                <IconButton>
                    <PiQuestion size={24} />
                </IconButton>
                <IconButton>
                    <SlLogin size={24} />
                </IconButton>
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
