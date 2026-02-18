import {apiClient} from "./apiClient";

export const accessApi = {
    giveCourseAccess: async (payload) => {
        const {data} = await apiClient.post("/access/course/get-access", payload);
        return data;
    },
    revokeCourseAccess: async (payload) => {
        const {data} = await apiClient.post("/access/course/delete-access", payload);
        return data;
    },
    giveModuleAccess: async (payload) => {
        const {data} = await apiClient.post("/access/module/get-access", payload);
        return data;
    },
    revokeModuleAccess: async (payload) => {
        const {data} = await apiClient.post("/access/module/delete-access", payload);
        return data;
    },

    // legacy aliases для совместимости
    giveCourse: async (payload) => accessApi.giveCourseAccess(payload),
    revokeCourse: async (payload) => accessApi.revokeCourseAccess(payload),
    giveModule: async (payload) => accessApi.giveModuleAccess(payload),
    revokeModule: async (payload) => accessApi.revokeModuleAccess(payload),
};
