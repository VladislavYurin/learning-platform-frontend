import {apiClient} from "./apiClient";

export const userApi = {
    me: async () => {
        const {data} = await apiClient.get("/user/me");
        return data;
    },

    updateMe: async (payload) => {
        const {data} = await apiClient.put("/user/me", payload);
        return data;
    },

    getById: async (userId) => {
        const {data} = await apiClient.get(`/user/${userId}`);
        return data;
    },

    getMyAvatar: async () => {
        const {data} = await apiClient.get("/user/me/avatar", {responseType: "blob"});
        return data;
    },

    getAvatarById: async (userId) => {
        const {data} = await apiClient.get(`/user/${userId}/avatar`, {responseType: "blob"});
        return data;
    },

    updateMyAvatar: async (file) => {
        const form = new FormData();
        form.append("avatar", file);
        const {data} = await apiClient.put("/user/me/avatar", form, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    },

    assignMentorRole: async () => {
        const {data} = await apiClient.post("/user/mentor/register");
        return data;
    },
};
