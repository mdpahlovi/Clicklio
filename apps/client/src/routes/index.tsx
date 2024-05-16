import HomePage from "@/pages/home";
import SigninPage from "@/pages/auth/signin";
import SignupPage from "@/pages/auth/signup";
import { createBrowserRouter } from "react-router-dom";
import Test from "@/pages/test";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/signin", element: <SigninPage /> },
    { path: "/signup", element: <SignupPage /> },
    { path: "/test", element: <Test /> },
]);

export default router;
