import {apiClient} from "./apiClient";
import {asSlotArray} from "./normalize";

export const slotApi = {
    create: async (payload) => {
        const {data} = await apiClient.post("/slot/create", payload);
        return data;
    },

    book: async (timeSlotId) => {
        const {data} = await apiClient.post("/slot/book", null, {
            params: {timeSlotId},
        });
        return data;
    },

    cancel: async (timeSlotId) => {
        const {data} = await apiClient.post("/slot/cancel", null, {
            params: {timeSlotId},
        });
        return data;
    },

    getForUser: async (mentorId) => {
        const {data} = await apiClient.get("/slot", {params: {mentorId}});
        return asSlotArray(data);
    },

    my: async () => {
        const {data} = await apiClient.get("/slot/my");
        return asSlotArray(data);
    },
};
