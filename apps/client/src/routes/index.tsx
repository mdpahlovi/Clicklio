import HomePage from "@/pages/home";
import RoomPage from "@/pages/room";
import SigninPage from "@/pages/auth/signin";
import SignupPage from "@/pages/auth/signup";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/rooms", element: <RoomPage /> },
    { path: "/signin", element: <SigninPage /> },
    { path: "/signup", element: <SignupPage /> },
]);

export default router;
