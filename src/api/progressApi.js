import {apiClient} from "./apiClient";
import {asArray} from "./normalize";

export const progressApi = {
    courseStats: async (courseId) => {
        const {data} = await apiClient.get(`/progress/course/${courseId}/statistics`);
        return data;
    },
    courseUsers: async (courseId) => {
        const {data} = await apiClient.get(`/progress/course/${courseId}/users`);
        return asArray(data);
    },
};
