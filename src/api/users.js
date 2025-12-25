import {apiClient} from "./apiClient";

export const userApi = {
    me: async () => {
        const {data} = await apiClient.get("/user/me");
        return data;
    },

    getById: async (userId) => {
        const {data} = await apiClient.get(`/user/${userId}`);
        return data;
    },

    assignMentorRole: async () => {
        const {data} = await apiClient.post("/user/mentor/register");
        return data;
    },
};