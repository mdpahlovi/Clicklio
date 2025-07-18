import Loader from "@/components/ui/loader";
import DashboardLayout from "@/layout/dashboard";
import ProtectedRoute from "@/routes/protected-route";
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import SigninPage from "@/pages/auth/signin";
import SignupPage from "@/pages/auth/signup";
import RoomPage from "@/pages/room";
import RoomsPage from "@/pages/rooms";
import SettingPage from "@/pages/setting";

const HomePage = lazy(() => import("@/pages/home"));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Loader />}>
                <HomePage />
            </Suspense>
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
            { path: "/rooms", element: <RoomsPage /> },
            { path: "/setting", element: <SettingPage /> },
        ],
    },
    {
        path: "/room/:id",
        element: (
            <Suspense fallback={<Loader />}>
                <RoomPage />
            </Suspense>
        ),
    },
]);

export default router;
