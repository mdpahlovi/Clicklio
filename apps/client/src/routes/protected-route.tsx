import Loader from "@/components/ui/loader";
import { useAuthState } from "@/stores/auth/useAuthStore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
    const { user, signinLoading, signupLoading, oAuthSigninLoading } = useAuthState();

    if (!signinLoading && !signupLoading && !oAuthSigninLoading) {
        if (user && user?.id) {
            return children;
        } else {
            return (
                <>
                    <Loader />
                    <Navigate to="/signin" replace />
                </>
            );
        }
    } else {
        return <Loader />;
    }
}
