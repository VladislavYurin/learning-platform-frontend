import { apiClient } from "./apiClient";

export const authApi = {
    login: async ({ username, password }) => {
        const { data } = await apiClient.post("/auth/login", { username, password });
        return data; // JwtAuthResponse
    },

    register: async ({ request, avatar }) => {
        const form = new FormData();
        form.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
        if (avatar) form.append("avatar", avatar);

        const { data } = await apiClient.post("/auth/reg", form, {
            headers: { "Content-Type": "multipart/form-data" },
        });
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
