import { Suspense, lazy } from "react";
import Loader from "@/components/ui/loader";
import ProtectedRoute from "@/routes/protected-route";
import DashboardLayout from "@/layout/dashboard";
import { createBrowserRouter } from "react-router-dom";

import RoomPage from "@/pages/room";
import SettingPage from "@/pages/setting";
import SigninPage from "@/pages/auth/signin";
import SignupPage from "@/pages/auth/signup";

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
    {
        path: "/room/:id",
        element: (
            <Suspense fallback={<Loader />}>
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>{" "}
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
            { path: "/rooms", element: <RoomPage /> },
            { path: "/setting", element: <SettingPage /> },
        ],
    },
]);

export default router;
