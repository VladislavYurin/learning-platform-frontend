export const asArray = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.content)) return payload.content;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.data)) return payload.data;

    // Некоторые endpoint'ы отдают одиночный объект вместо массива.
    return [payload];
};

export const normalizeSlotItem = (item) => {
    if (!item) return null;

    if (item.slotDto || item.mentorTimeSlotDto) {
        const dto = item.slotDto || item.mentorTimeSlotDto || {};
        return {
            ...dto,
            participants: Array.isArray(item.participants) ? item.participants : [],
            slotFull: Boolean(item.slotFull),
        };
    }

    return {
        ...item,
        participants: Array.isArray(item.participants) ? item.participants : [],
        slotFull: Boolean(item.slotFull),
    };
};

export const asSlotArray = (payload) =>
    asArray(payload)
        .map(normalizeSlotItem)
        .filter(Boolean);
