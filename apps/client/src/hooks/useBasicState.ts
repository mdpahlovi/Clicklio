import { create } from "zustand";

type BasicStateStore = {
    renameModal: boolean;
    toggleRenameModal: () => void;
    renameLoading: boolean;
    toggleRenameLoading: () => void;
    sidebar: boolean;
    toggleSidebar: () => void;
};

export const useBasicState = create<BasicStateStore>()((set) => ({
    renameModal: false,
    toggleRenameModal: () => set(({ renameModal }) => ({ renameModal: !renameModal })),
    renameLoading: false,
    toggleRenameLoading: () => set(({ renameLoading }) => ({ renameLoading: !renameLoading })),
    sidebar: false,
    toggleSidebar: () => set(({ sidebar }) => ({ sidebar: !sidebar })),
}));
