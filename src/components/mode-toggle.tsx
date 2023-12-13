import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import useThemeStore from "@/hooks/useThemeStore";

export default function ModeToggle() {
    const { mode, setMode } = useThemeStore();

    return (
        <Button variant="outline" size="icon" onClick={() => setMode(mode === "light" ? "dark" : "light")}>
            <Sun size={20} className="absolute rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon size={20} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
}
