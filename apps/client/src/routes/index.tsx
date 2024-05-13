import HomePage from "@/pages/home";
import SigninPage from "@/pages/auth/signin";
import SignupPage from "@/pages/auth/signup";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/signin", element: <SigninPage /> },
    { path: "/signup", element: <SignupPage /> },
]);

export default router;
