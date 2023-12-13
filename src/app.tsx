import router from "./routes";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import useThemeStore from "./hooks/useThemeStore";

export default function App() {
    const { mode, setMode } = useThemeStore();

    // Set Default Theme
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        if (!mode) {
            const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            setMode(systemMode);
            root.classList.add(systemMode);
            return;
        }
        root.classList.add(mode);
    }, [mode, setMode]);

    return <RouterProvider router={router} />;
}
