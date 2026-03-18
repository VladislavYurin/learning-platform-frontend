import React, { useMemo } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import UserSlotHoverPopover from "./UserSlotHoverPopover";

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 22;
const HOUR_HEIGHT = 64;
const HEADER_HEIGHT = 56;
const GRID_BORDER = "1px solid rgba(0,0,0,0.12)";

const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + diff);
    return d;
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const isSameDay = (a, b) => {
    const da = new Date(a);
    const db = new Date(b);
    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
    );
};

const minutesFromStart = (date) => {
    const d = new Date(date);
    return (d.getHours() - DAY_START_HOUR) * 60 + d.getMinutes();
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const formatDayLabel = (date) =>
    new Intl.DateTimeFormat("ru-RU", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
    }).format(date);

const formatTime = (date) =>
    new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));

const buildHourRows = () => {
    const rows = [];
    for (let h = DAY_START_HOUR; h <= DAY_END_HOUR; h += 1) {
        rows.push(h);
    }
    return rows;
};

const getSlotStyle = (slot) => {
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);

    const totalMinutes = (DAY_END_HOUR - DAY_START_HOUR) * 60;
    const startMinutes = clamp(minutesFromStart(start), 0, totalMinutes);
    const endMinutes = clamp(minutesFromStart(end), 0, totalMinutes);

    const top = (startMinutes / 60) * HOUR_HEIGHT;
    const height = Math.max(((endMinutes - startMinutes) / 60) * HOUR_HEIGHT, 28);

    return { top, height };
};

const UserSlotsWeekCalendar = ({
                                   slots = [],
                                   weekStart,
                                   onPrevWeek,
                                   onNextWeek,
                                   onToday,
                                   onBookSlot,
                                   onCancelBooking,
                                   actionLoadingId,
                               }) => {
    const days = useMemo(
        () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
        [weekStart]
    );

    const hours = useMemo(() => buildHourRows(), []);

    const slotsByDay = useMemo(() => {
        return days.map((day) =>
            slots.filter((slot) => slot?.startTime && isSameDay(slot.startTime, day))
        );
    }, [slots, days]);

    const weekLabel = `${new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "long",
    }).format(days[0])} — ${new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "long",
    }).format(days[6])}`;

    return (
        <Paper
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Typography variant="h6">Календарь слотов</Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="outlined" size="small" onClick={onPrevWeek}>
                        ← Неделя
                    </Button>
                    <Button variant="outlined" size="small" onClick={onToday}>
                        Сегодня
                    </Button>
                    <Button variant="outlined" size="small" onClick={onNextWeek}>
                        Неделя →
                    </Button>
                </Stack>
            </Box>

            <Box sx={{ px: 2, pt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    {weekLabel}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "72px repeat(7, 148px)",
                    width: "fit-content",
                }}
            >
                <Box
                    sx={{
                        boxSizing: "border-box",
                        height: HEADER_HEIGHT,
                        borderBottom: GRID_BORDER,
                        borderRight: GRID_BORDER,
                        backgroundColor: "background.paper",
                    }}
                />

                {days.map((day) => (
                    <Box
                        key={day.toISOString()}
                        sx={{
                            boxSizing: "border-box",
                            height: HEADER_HEIGHT,
                            borderBottom: GRID_BORDER,
                            borderRight: GRID_BORDER,
                            px: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "background.paper",
                        }}
                    >
                        <Typography variant="subtitle2">{formatDayLabel(day)}</Typography>
                    </Box>
                ))}

                <Box sx={{ position: "relative" }}>
                    {hours.map((hour, idx) => (
                        <Box
                            key={hour}
                            sx={{
                                boxSizing: "border-box",
                                height: HOUR_HEIGHT,
                                borderBottom: idx === hours.length - 1 ? "none" : GRID_BORDER,
                                borderRight: GRID_BORDER,
                                px: 1,
                                pt: 0.5,
                                color: "text.secondary",
                                fontSize: 12,
                            }}
                        >
                            {String(hour).padStart(2, "0")}:00
                        </Box>
                    ))}
                </Box>

                {days.map((day, dayIndex) => (
                    <Box
                        key={day.toISOString() + "-col"}
                        sx={{
                            boxSizing: "border-box",
                            position: "relative",
                            height: (DAY_END_HOUR - DAY_START_HOUR) * HOUR_HEIGHT,
                            borderRight: GRID_BORDER,
                            backgroundColor: "background.default",
                        }}
                    >
                        {hours.slice(0, -1).map((hour, idx) => (
                            <Box
                                key={`${day.toISOString()}-${hour}`}
                                sx={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: idx * HOUR_HEIGHT,
                                    height: HOUR_HEIGHT,
                                    borderBottom: GRID_BORDER,
                                    boxSizing: "border-box",
                                }}
                            />
                        ))}

                        {slotsByDay[dayIndex].map((slot) => {
                            const style = getSlotStyle(slot);

                            return (
                                <Box
                                    key={slot.id || slot.requestId}
                                    sx={{
                                        position: "absolute",
                                        left: 4,
                                        right: 4,
                                        top: style.top,
                                        height: style.height,
                                    }}
                                >
                                    <UserSlotHoverPopover
                                        slot={slot}
                                        onBook={onBookSlot}
                                        onCancelBooking={onCancelBooking}
                                        actionLoading={actionLoadingId === slot.id}
                                    >
                                        <Box
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: 2,
                                                p: 1,
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                border: "1px solid",
                                                borderColor:
                                                    slot.slotFull || slot.isActive === false
                                                        ? "grey.400"
                                                        : "primary.main",
                                                backgroundColor:
                                                    slot.slotFull || slot.isActive === false
                                                        ? "grey.100"
                                                        : "rgba(25, 118, 210, 0.12)",
                                                "&:hover": {
                                                    boxShadow: 3,
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{ fontWeight: 700, display: "block" }}
                                            >
                                                {slot.slotMeetingType || "Встреча"}
                                            </Typography>

                                            <Typography variant="caption" sx={{ display: "block" }}>
                                                {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ display: "block" }}
                                            >
                                                {slot.slotType || "—"} • {slot.maxParticipants ?? "—"} мест
                                            </Typography>
                                        </Box>
                                    </UserSlotHoverPopover>
                                </Box>
                            );
                        })}
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export { startOfWeek };
export default UserSlotsWeekCalendar;