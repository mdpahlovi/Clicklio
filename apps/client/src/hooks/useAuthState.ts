import { create } from "zustand";

export type User = { id: string; name: string };

type AuthStateStore = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const useAuthState = create<AuthStateStore>()((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
