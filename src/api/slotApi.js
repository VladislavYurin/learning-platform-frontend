import {apiClient} from "./apiClient";

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

    getForUser: async (mentorId) => {
        const {data} = await apiClient.get("/slot", {params: {mentorId}});
        return data;
    },

    my: async () => {
        const {data} = await apiClient.get("/slot/my");
        return data;
    },
};