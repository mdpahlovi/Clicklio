import HomePage from "@/pages/home";
import RoomPage from "@/pages/room";
import TrashPage from "@/pages/trash";
import SettingPage from "@/pages/setting";
import SigninPage from "@/pages/auth/signin";
import SignupPage from "@/pages/auth/signup";
import ProtectedRoute from "./protected-route";
import DashboardLayout from "@/layout/dashboard/dashboard-layout";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    {
        path: "/room/:id",
        element: (
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>
        ),
    },
    { path: "/signin", element: <SigninPage /> },
    { path: "/signup", element: <SignupPage /> },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "/rooms", element: <RoomPage /> },
            { path: "/trash", element: <TrashPage /> },
            { path: "/setting", element: <SettingPage /> },
        ],
    },
]);

export default router;
