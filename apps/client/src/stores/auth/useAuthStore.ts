import axios, { type AxiosResponse, type ErrorResponse } from "@/utils/axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type User = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    photo: string | null;
    otherInfo: Record<string, string> | null;
    createdAt: Date;
    updatedAt: Date;
};

export type Credentials = { email: string; password: string };
export type ApiResponse = AxiosResponse<{ user: User; accessToken: string; refreshToken: string }>;

type AuthStateStore = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    signinLoading: boolean;
    signupLoading: boolean;
    oAuthSigninLoading: boolean;
    signoutLoading: boolean;
    updateProfileLoading: boolean;
    signin: (credentials: Credentials) => Promise<void>;
    signup: (credentials: { name: string } & Credentials) => Promise<void>;
    oAuthSignin: () => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (user: Partial<User>) => Promise<void>;
};

export const useAuthState = create<AuthStateStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            signinLoading: false,
            signupLoading: false,
            oAuthSigninLoading: false,
            signoutLoading: false,
            updateProfileLoading: false,

            signin: async ({ email, password }) => {
                set({ signinLoading: true });
                try {
                    const response = (await axios.post("/auth/signin", { email, password })) as ApiResponse;
                    set({
                        user: response.data.user,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    });
                    toast.success(response.message);
                } catch (error) {
                    toast.error((error as ErrorResponse)?.message);
                } finally {
                    set({ signinLoading: false });
                }
            },

            signup: async ({ name, email, password }) => {
                set({ signupLoading: true });
                try {
                    const response = (await axios.post("/auth/signup", { name, email, password })) as ApiResponse;
                    set({
                        user: response.data.user,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    });
                    toast.success(response.message);
                } catch (error) {
                    toast.error((error as ErrorResponse)?.message);
                } finally {
                    set({ signupLoading: false });
                }
            },

            oAuthSignin: async () => {
                set({ oAuthSigninLoading: true });
                try {
                    toast.error("Work in progress...");
                    // const response = (await axios.post("/auth/oauth-signin", {
                    //     name: "",
                    //     email: "",
                    //     photo: "",
                    //     provider: "GOOGLE",
                    // })) as ApiResponse;
                    // set({
                    //     user: response.data.user,
                    //     accessToken: response.data.accessToken,
                    //     refreshToken: response.data.refreshToken,
                    // });
                    // toast.success(response.message);
                } catch (error) {
                    toast.error((error as ErrorResponse)?.message);
                } finally {
                    set({ oAuthSigninLoading: false }); // Fixed: was setting signupLoading instead
                }
            },

            signOut: async () => {
                set({ signoutLoading: true });
                setTimeout(() => {
                    set({ user: null, accessToken: null, refreshToken: null });
                    set({ signoutLoading: false });
                }, 1500);
            },

            updateProfile: async (user) => {
                set({ updateProfileLoading: true });
                try {
                    const response = await axios.post("/auth/update-profile", user);
                    set({ user: response.data });

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    toast.success(response.message);
                } catch (error) {
                    toast.error((error as ErrorResponse)?.message);
                } finally {
                    set({ updateProfileLoading: false });
                }
            },
        }),
        {
            name: "clicklio-auth",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        },
    ),
);
