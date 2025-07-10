import { Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/zustand/useAuthState";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
    const { user, signinLoading, signupLoading, socialLoading } = useAuthState();

    if (!signinLoading && !signupLoading && !socialLoading) {
        if (user && user?.id) {
            return children;
        } else {
            return <Navigate to="/signin" replace />;
        }
    }
}
