import {apiClient} from "./apiClient";

export const courseApi = {
    getAll: async () => {
        const {data} = await apiClient.get("/course/all");
        return data;
    },

    getActive: async () => {
        const {data} = await apiClient.get("/course/all/active");
        return data;
    },

    getActivePreview: async () => {
        const {data} = await apiClient.get("/course/all/active/preview");
        return data;
    },

    getById: async (courseId) => {
        const {data} = await apiClient.get(`/course/${courseId}`);
        return data;
    },

    create: async (payload) => {
        const {data} = await apiClient.post("/course/create", payload);
        return data;
    },

    delete: async (courseId) => {
        const {data} = await apiClient.delete(`/course/${courseId}`);
        return data;
    },
};