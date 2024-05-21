import HomePage from "@/pages/home";
import RoomPage from "@/pages/room";
import SettingPage from "@/pages/setting";
import SigninPage from "@/pages/auth/signin";
import SignupPage from "@/pages/auth/signup";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/rooms", element: <RoomPage /> },
    { path: "/room/:id", element: <HomePage /> },
    { path: "/signin", element: <SigninPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/setting", element: <SettingPage /> },
]);

export default router;
