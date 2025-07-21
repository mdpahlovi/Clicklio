import axios from "axios";
import { useAuthState } from "../stores/auth/useAuthStore";

const BASE_URL = import.meta.env.VITE_APP_SERVER;
const baseAxios = axios.create({ baseURL: `${BASE_URL}/api/v1`, timeout: 60000 });

export type ErrorResponse = { status: number; message: string };
export type AxiosResponse<T> = { status: number; message: string; data: T };

baseAxios.interceptors.request.use(function (config) {
    const authState = useAuthState.getState();

    if (authState?.accessToken && authState?.refreshToken) {
        config.headers.authorization = `Bearer ${authState?.accessToken}`;
        config.headers["x-refresh-token"] = authState?.refreshToken;
    }

    return config;
});

baseAxios.interceptors.response.use(
    function (res) {
        const newAccToken = res.headers["x-access-token"];
        if (newAccToken) useAuthState.setState({ accessToken: newAccToken });

        return res.data;
    },
    function (error) {
        const status = error?.response?.status || 500;
        const message = error?.response?.data?.message || error?.message || "Something went wrong...";

        if (status === 401) {
            useAuthState.setState({ user: null, accessToken: null, refreshToken: null });
        }

        return Promise.reject({ status, message });
    },
);

export default baseAxios;
