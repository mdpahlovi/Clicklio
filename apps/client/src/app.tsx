import router from "./routes";
import themes from "./themes";
import { CssVarsProvider } from "@mui/joy";
import Loader from "@/components/ui/loader";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "@/components/ui/toast-provider";
import { useAuthStateChange } from "@/hooks/useAuthStateChange";

export default function App() {
    const { loading } = useAuthStateChange();

    if (loading) {
        return <Loader />;
    } else {
        return (
            <CssVarsProvider theme={themes}>
                <ToastProvider />
                <RouterProvider router={router} />
            </CssVarsProvider>
        );
    }
}
