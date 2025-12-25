import { apiClient } from "./apiClient";

export const authApi = {
    login: async ({ username, password }) => {
        const { data } = await apiClient.post("/auth/login", { username, password });
        return data; // JwtAuthResponse
    },

    register: async (payload) => {
        const { data } = await apiClient.post("/auth/reg", payload);
        return data; // JwtAuthResponse
    },

    refreshToken: async (refreshToken) => {
        const { data } = await apiClient.post(
            "/auth/token/refresh",
            null,
            { headers: { Authorization: `Bearer ${refreshToken}` } }
        );
        return data; // JwtAuthResponse
    },
};