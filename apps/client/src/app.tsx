import router from "./routes";
import themes from "./themes";
import { CssVarsProvider } from "@mui/joy";
import { RouterProvider } from "react-router-dom";
import ToastProvider from "./components/ui/toast-provider";

export default function App() {
    return (
        <CssVarsProvider theme={themes}>
            <ToastProvider />
            <RouterProvider router={router} />
        </CssVarsProvider>
    );
}
