import { create } from "zustand";

type BasicStateStore = {
    menu: boolean;
    toggleMenu: () => void;
    sidebar: boolean;
    toggleSidebar: () => void;
};

export const useBasicState = create<BasicStateStore>()((set) => ({
    menu: false,
    toggleMenu: () => set(({ menu }) => ({ menu: !menu })),
    sidebar: false,
    toggleSidebar: () => set(({ sidebar }) => ({ sidebar: !sidebar })),
}));
