import Main from "@/layout/main";
import Login from "@/pages/auth/login";
import CanvasPage from "@/pages/main/canvas";
import Home from "@/pages/main/home";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/canvas/:id",
                element: <CanvasPage />,
            },
        ],
    },
    { path: "*" },
    { path: "/login", element: <Login /> },
]);

export default router;
