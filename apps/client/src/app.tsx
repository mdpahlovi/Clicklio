import Loader from "@/components/ui/loader";
import { ToastProvider } from "@/components/ui/toast-provider";
import { useAuthStateChange } from "@/hooks/useAuthStateChange";
import { CssVarsProvider } from "@mui/joy";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import themes from "./themes";

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
