import React, { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    TextField,
    Typography,
} from "@mui/material";
import { slotApi } from "../../api/slotApi";
import UserSlotsWeekCalendar, {
    startOfWeek,
} from "../../components/slots/UserSlotsWeekCalendar";

const UserSlotsPage = () => {
    const [mentorId, setMentorId] = useState("");
    const [slots, setSlots] = useState([]);
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));

    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadSlots = async () => {
        const mid = Number(mentorId);
        if (!mid) {
            setError("Введите корректный mentorId");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await slotApi.getForUser(mid);
            setSlots(Array.isArray(data) ? data : []);
        } catch (err) {
            const msg =
                err?.response?.data?.message || err?.message || "Не удалось загрузить слоты";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const visibleSlots = useMemo(() => {
        const start = new Date(weekStart);
        const end = new Date(weekStart);
        end.setDate(end.getDate() + 7);

        return slots.filter((slot) => {
            const slotDate = new Date(slot.startTime);
            return slotDate >= start && slotDate < end;
        });
    }, [slots, weekStart]);

    const handleBook = async (slotId) => {
        setActionLoadingId(slotId);
        setError(null);
        setSuccess(null);

        try {
            await slotApi.book(slotId);
            setSuccess("Слот успешно забронирован");
            await loadSlots();
        } catch (err) {
            const msg =
                err?.response?.data?.message || err?.message || "Не удалось забронировать слот";
            setError(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleCancel = async (slotId) => {
        setActionLoadingId(slotId);
        setError(null);
        setSuccess(null);

        try {
            await slotApi.cancel(slotId);
            setSuccess("Бронь слота отменена");
            await loadSlots();
        } catch (err) {
            const msg =
                err?.response?.data?.message || err?.message || "Не удалось отменить бронь";
            setError(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>
                Слоты менторов
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    mb: 2,
                    flexWrap: "wrap",
                }}
            >
                <TextField
                    label="ID ментора"
                    value={mentorId}
                    onChange={(e) => setMentorId(e.target.value)}
                    inputMode="numeric"
                    sx={{ minWidth: 220 }}
                />

                <Button variant="contained" onClick={loadSlots} disabled={loading}>
                    {loading ? "Загрузка..." : "Загрузить слоты"}
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {slots.length === 0 ? (
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Слоты не загружены
                        </Typography>
                    ) : visibleSlots.length === 0 ? (
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            На выбранной неделе слотов нет
                        </Typography>
                    ) : null}

                    {slots.length > 0 && (
                        <Box sx={{ overflowX: "auto" }}>
                            <UserSlotsWeekCalendar
                                slots={visibleSlots}
                                weekStart={weekStart}
                                onPrevWeek={() => {
                                    const d = new Date(weekStart);
                                    d.setDate(d.getDate() - 7);
                                    setWeekStart(d);
                                }}
                                onNextWeek={() => {
                                    const d = new Date(weekStart);
                                    d.setDate(d.getDate() + 7);
                                    setWeekStart(d);
                                }}
                                onToday={() => setWeekStart(startOfWeek(new Date()))}
                                onBookSlot={handleBook}
                                onCancelBooking={handleCancel}
                                actionLoadingId={actionLoadingId}
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default UserSlotsPage;