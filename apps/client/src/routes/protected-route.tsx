import { Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
    const { user, loading } = useAuthState();

    if (!loading) {
        if (user && user?.id) {
            return children;
        } else {
            return <Navigate to="/signin" replace />;
        }
    }
}
