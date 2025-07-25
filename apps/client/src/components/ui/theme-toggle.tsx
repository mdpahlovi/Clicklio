import { IconButton, useColorScheme } from "@mui/joy";
import { PiMoon, PiSun } from "react-icons/pi";

export default function ThemeToggle() {
    const { mode, setMode } = useColorScheme();

    return (
        <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")}>
            {mode === "light" ? <PiSun size={24} /> : <PiMoon size={24} />}
        </IconButton>
    );
}
