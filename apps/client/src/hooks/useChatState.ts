import { create } from "zustand";

type MediaStreamInfo = {
    id: string;
    stream: MediaStream;
};

type ChatStateStore = {
    isCallActive: boolean;

    isMicEnabled: boolean;
    isCameraEnabled: boolean;
    isScreenSharing: boolean;

    currentMedia: MediaStream | null;
    remoteMedias: MediaStreamInfo[];

    toggleCal: () => void;

    toggleMic: () => void;
    toggleCamera: () => void;
    toggleScreen: () => void;

    setCurrentMedia: (media: MediaStream) => void;
    setRemoteMedias: (medias: MediaStreamInfo[]) => void;

    endCall: () => void;
};

export const useChatState = create<ChatStateStore>((set) => ({
    isCallActive: false,

    isMicEnabled: true,
    isCameraEnabled: true,
    isScreenSharing: false,

    currentMedia: null,
    remoteMedias: [],

    toggleCal: () => set((state) => ({ isCallActive: !state.isCallActive })),

    toggleMic: () => set((state) => ({ isMicEnabled: !state.isMicEnabled })),
    toggleCamera: () => set((state) => ({ isCameraEnabled: !state.isCameraEnabled })),
    toggleScreen: () => set((state) => ({ isScreenSharing: !state.isScreenSharing })),

    setCurrentMedia: (media) => set(() => ({ currentMedia: media })),
    setRemoteMedias: (medias) => set(() => ({ remoteMedias: medias })),

    endCall: () =>
        set(() => ({
            isCallActive: false,

            isMicEnabled: true,
            isCameraEnabled: true,
            isScreenSharing: false,

            currentMedia: null,
            remoteMedias: [],
        })),
}));
