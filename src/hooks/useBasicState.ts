import { create } from "zustand";

type BasicStateStore = {
    menu: boolean;
    toggleMenu: () => void;
};

export const useBasicState = create<BasicStateStore>()((set) => ({
    menu: false,
    toggleMenu: () => set(({ menu }) => ({ menu: !menu })),
}));
