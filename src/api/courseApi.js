import {apiClient} from "./apiClient";

export const courseApi = {
    getAll: async (pageNumber = 0, pageSize = 10) => {
        const { data } = await apiClient.get("/course/all", {
            params: { pageNumber, pageSize },
        });

        return Array.isArray(data) ? data : data.content ?? [];
    },

    getActive: async (pageNumber = 0, pageSize = 10) => {
        const { data } = await apiClient.get("/course/all/active", {
            params: { pageNumber, pageSize },
        });

        return Array.isArray(data) ? data : data.content ?? [];
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