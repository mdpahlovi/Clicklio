import { useAuthState, type User } from "@/hooks/zustand/useAuthState";
import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    return { loading };
}
