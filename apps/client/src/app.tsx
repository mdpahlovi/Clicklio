import router from "./routes";
import themes from "./themes";
import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthState, User } from "@/hooks/useAuthState";
import { CircularProgress, CssVarsProvider } from "@mui/joy";
import { ToastProvider } from "@/components/ui/toast-provider";

export default function App() {
    const { setUser } = useAuthState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            try {
                if (!user) throw new Error("User Not Found!...");

                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) setUser({ id: userDoc.id, ...userDoc.data() } as User);
                setLoading(false);
            } catch (error) {
                setUser(null);
                setLoading(false);
            }
        });
    }, []);

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
