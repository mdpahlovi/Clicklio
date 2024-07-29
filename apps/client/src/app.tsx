import router from "./routes";
import themes from "./themes";
import toast from "react-hot-toast";
import { auth, db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthState, User } from "@/hooks/useAuthState";
import { CircularProgress, CssVarsProvider } from "@mui/joy";
import { ToastProvider } from "@/components/ui/toast-provider";

export default function App() {
    const { user, setUser } = useAuthState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user && user?.uid && user?.email && user?.displayName) {
                const { uid, email, displayName, photoURL } = user;
                setUser({ id: uid, email, name: displayName, image: photoURL ? photoURL : undefined });
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
            }
        });
    }, []);

    useEffect(() => {
        if (user?.id) {
            getDoc(doc(db, "users", user.id))
                .then((data) => {
                    if (data.exists()) {
                        setUser({ id: data.id, ...data.data() } as User);
                    } else {
                        toast.error("Something wants wrong!...");
                        setUser(null);
                    }
                })
                .catch((error) => {
                    toast.error(error?.message);
                    setUser(null);
                });
        }
    }, [user?.id]);

    if (loading) {
        return (
            <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress
                    sx={{
                        "--CircularProgress-trackThickness": "16px",
                        "--CircularProgress-size": "192px",
                        "--CircularProgress-progressThickness": "12px",
                    }}
                />
            </div>
        );
    } else {
        return (
            <CssVarsProvider theme={themes}>
                <ToastProvider />
                <RouterProvider router={router} />
            </CssVarsProvider>
        );
    }
}
