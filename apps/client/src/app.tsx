import { ToastProvider } from "@/components/ui/toast-provider";
import { CssVarsProvider } from "@mui/joy";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import themes from "./themes";

export default function App() {
    return (
        <CssVarsProvider theme={themes}>
            <ToastProvider />
            <RouterProvider router={router} />
        </CssVarsProvider>
    );
}
