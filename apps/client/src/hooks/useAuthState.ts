import { create } from "zustand";
import { auth, db } from "@/utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export type User = { id: string; name: string; email: string };
export type Credentials = { email: string; password: string };

type AuthStateStore = {
    user: User | null;
    loading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setError: (error: string | null) => void;
    signin: (credentials: Credentials) => Promise<void>;
    signup: (credentials: { name: string } & Credentials) => Promise<void>;
    signOut: () => Promise<void>;
};

export const useAuthState = create<AuthStateStore>((set) => ({
    user: null,
    loading: false,
    error: null,

    setUser: (user) => set({ user }),
    setError: (error) => set({ error }),

    signin: async ({ email, password }) => {
        set({ loading: true, error: null });
        try {
            const data = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, "users", data.user.uid));
            if (userDoc.exists()) {
                set({ user: { id: userDoc.id, ...userDoc.data() } as User });
            } else {
                set({ error: "User data not found" });
            }
        } catch (error) {
            if (error instanceof FirebaseError) set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    signup: async ({ name, email, password }) => {
        set({ loading: true, error: null });
        try {
            const data = await createUserWithEmailAndPassword(auth, email, password);
            const user = { id: data.user.uid, name, email };
            await setDoc(doc(db, "users", user.id), user);
            set({ user });
        } catch (error) {
            if (error instanceof FirebaseError) set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        set({ loading: true, error: null });
        try {
            await signOut(auth);
            set({ user: null });
        } catch (error) {
            if (error instanceof FirebaseError) set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },
}));
