import toast from "react-hot-toast";
import { auth, db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthState, User } from "@/hooks/useAuthState";

export function useAuthStateChange() {
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

    return { loading };
}
