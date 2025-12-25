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
};
