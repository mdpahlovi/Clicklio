import "@/styles/index.css";
import "@fontsource/poppins";

import router from "@/routes";
import themes from "@/themes";
import { CssVarsProvider } from "@mui/joy";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
    <CssVarsProvider theme={themes}>
        <RouterProvider router={router} />
    </CssVarsProvider>
);
