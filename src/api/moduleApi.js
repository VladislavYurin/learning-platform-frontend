import {apiClient} from "./apiClient";

const fetchByOrder = async (courseId, moduleOrderNum) => {
    const {data} = await apiClient.get(`/module/${courseId}/${moduleOrderNum}`);
    return data;
};

const resolveModuleOrderNumber = async (courseId, moduleId) => {
    const {data: course} = await apiClient.get(`/course/${courseId}`);
    const modules = Array.isArray(course?.modules) ? course.modules : [];

    const module = modules.find((m) => String(m?.id) === String(moduleId));
    return module?.moduleOrderNumber ?? null;
};

export const moduleApi = {
    getById: async (courseId, moduleId) => {
        try {
            return await fetchByOrder(courseId, moduleId);
        } catch (error) {
            const status = error?.response?.status;

            // сохраняем текущий роут c moduleId, но под капотом адаптируем к moduleOrderNum
            if (status !== 404 && status !== 400) throw error;

            const orderNumber = await resolveModuleOrderNumber(courseId, moduleId);
            if (orderNumber == null || String(orderNumber) === String(moduleId)) {
                throw error;
            }

            return fetchByOrder(courseId, orderNumber);
        }
    },

    create: async (payload) => {
        const {data} = await apiClient.post("/module/create", payload);
        return data;
    },

    delete: async (courseId, moduleId) => {
        try {
            const {data} = await apiClient.delete(`/module/${courseId}/${moduleId}`);
            return data;
        } catch (error) {
            const status = error?.response?.status;
            if (status !== 404 && status !== 400) throw error;

            const orderNumber = await resolveModuleOrderNumber(courseId, moduleId);
            if (orderNumber == null || String(orderNumber) === String(moduleId)) {
                throw error;
            }

            const {data} = await apiClient.delete(`/module/${courseId}/${orderNumber}`);
            return data;
        }
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
