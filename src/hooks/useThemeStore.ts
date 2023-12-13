import { Theme } from "@/types/theme";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ThemeStore {
    mode: Theme;
    setMode: (payload: Theme) => void;
}

const useThemeStore = create<ThemeStore>()(
    devtools(
        persist(
            (set) => ({
                mode: "light",
                setMode: (payload) => set({ mode: payload }),
            }),
            { name: "ebay-retail" },
        ),
    ),
);

export default useThemeStore;
