import {apiClient} from "./apiClient";
import {asArray, asSlotArray} from "./normalize";

const withPage = (params = {}) => ({
    pageNumber: params.pageNumber ?? 0,
    pageSize: params.pageSize ?? 20,
});

export const adminApi = {
    getCourses: async (params) => {
        const {data} = await apiClient.get("/admin/course/all", {params: withPage(params)});
        return asArray(data);
    },

    getCourseById: async (courseId) => {
        const {data} = await apiClient.get(`/admin/course/${courseId}`);
        return data;
    },

    getModules: async (params) => {
        const {data} = await apiClient.get("/admin/module/all", {params: withPage(params)});
        return asArray(data);
    },

    getModuleById: async (moduleId) => {
        const {data} = await apiClient.get(`/admin/module/${moduleId}`);
        return data;
    },

    getSlots: async (params) => {
        const {data} = await apiClient.get("/admin/slot/all", {params: withPage(params)});
        return asSlotArray(data);
    },

    getMe: async () => {
        const {data} = await apiClient.get("/admin/user/me");
        return data;
    },

    getUserById: async (userId) => {
        const {data} = await apiClient.get(`/admin/user/${userId}`);
        return data;
    },
};
