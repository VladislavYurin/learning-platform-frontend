import {apiClient} from "./apiClient";

export const moduleApi = {
    getById: async (courseId, moduleId) => {
        const {data} = await apiClient.get(`/module/${courseId}/${moduleId}`);
        return data; // ModuleDto
    },

    create: async (payload) => {
        const {data} = await apiClient.post("/module/create", payload);
        return data;
    },

    delete: async (courseId, moduleId) => {
        const {data} = await apiClient.delete(`/module/${courseId}/${moduleId}`);
        return data;
    },

    importMarkdown: async ({file, request}) => {
        const form = new FormData();
        form.append("file", file);
        // у вас в openapi request — объект CreateModuleRequest
        // иногда бек ждёт JSON-строкой, иногда как поля. оставим JSON-строкой:
        form.append("request", new Blob([JSON.stringify(request)], {type: "application/json"}));

        const {data} = await apiClient.post("/module/import", form, {
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    },
};