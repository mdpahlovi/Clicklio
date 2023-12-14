import Main from "@/layout/main";
import CreateRoom from "@/pages/auth/create-room";
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
    { path: "/create-room", element: <CreateRoom /> },
]);

export default router;
