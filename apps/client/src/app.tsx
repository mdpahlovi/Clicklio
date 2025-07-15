import { ToastProvider } from "@/components/ui/toast-provider";
import { CssVarsProvider } from "@mui/joy";
import { RouterProvider } from "react-router-dom";
import { useCanvasState } from "./hooks/zustand/useCanvasState";
import router from "./routes";
import { useAuthState } from "./stores/auth/useAuthStore";
import themes from "./themes";
import { useEffect } from "react";

export default function App() {
    const { user } = useAuthState();
    const { setUser } = useCanvasState();

    useEffect(() => {
        if (user) setUser(user.uid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <CssVarsProvider theme={themes}>
            <ToastProvider />
            <RouterProvider router={router} />
        </CssVarsProvider>
    );
}
