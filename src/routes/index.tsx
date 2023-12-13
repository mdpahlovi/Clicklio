import Main from "@/layout/main";
import Login from "@/pages/auth/login";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [],
    },
    { path: "*" },
    { path: "/login", element: <Login /> },
]);

export default router;
