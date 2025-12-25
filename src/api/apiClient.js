import axios from "axios";
import { store } from "../store/store";
import { refreshTokenSuccess, logout } from "../store/authSlice";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// attach access token
apiClient.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state?.auth?.token; // <-- твое имя
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

let isRefreshing = false;
let refreshQueue = [];

function resolveQueue(error, token = null) {
    refreshQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    refreshQueue = [];
}

apiClient.interceptors.response.use(
    (r) => r,
    async (error) => {
        const original = error.config;
        const status = error?.response?.status;

        if (status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        original._retry = true;

        const state = store.getState();
        const refreshToken = state?.auth?.refreshToken;

        if (!refreshToken) {
            store.dispatch(logout());
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({
                    resolve: (newToken) => {
                        original.headers.Authorization = `Bearer ${newToken}`;
                        resolve(apiClient(original));
                    },
                    reject,
                });
            });
        }

        isRefreshing = true;

        try {
            const resp = await axios.post(
                `${BASE_URL}/auth/token/refresh`,
                null,
                { headers: { Authorization: `Bearer ${refreshToken}` } }
            );

            const newAccessToken = resp.data?.accessToken;

            store.dispatch(
                refreshTokenSuccess({
                    accessToken: resp.data?.accessToken,
                    refreshToken: resp.data?.refreshToken,
                })
            );

            resolveQueue(null, newAccessToken);

            original.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(original);
        } catch (e) {
            resolveQueue(e, null);
            store.dispatch(logout());
            return Promise.reject(e);
        } finally {
            isRefreshing = false;
        }
    }
);
