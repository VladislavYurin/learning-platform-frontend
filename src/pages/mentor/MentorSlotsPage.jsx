import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import { slotApi } from "../../api/slotApi";
import SlotsWeekCalendar, {
    startOfWeek,
} from "../../components/slots/SlotsWeekCalendar";

const toIso = (value) => {
    if (!value) return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toISOString();
};

const MentorSlotsPage = () => {
    const [form, setForm] = useState({
        startTime: "",
        endTime: "",
        slotType: "INDIVIDUAL",
        slotMeetingType: "COMMUNICATION",
        maxParticipants: 1,
        meetingLink: "",
        description: "",
    });

    const [slots, setSlots] = useState([]);
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadSlots = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await slotApi.my();
            const list = Array.isArray(data) ? data : [];
            setSlots(list);
        } catch (err) {
            const msg =
                err?.response?.data?.message || err?.message || "Не удалось загрузить слоты";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSlots();
    }, []);

    const visibleSlots = useMemo(() => {
        const start = new Date(weekStart);
        const end = new Date(weekStart);
        end.setDate(end.getDate() + 7);

        return slots.filter((slot) => {
            const slotDate = new Date(slot.startTime);
            return slotDate >= start && slotDate < end;
        });
    }, [slots, weekStart]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreate = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                startTime: toIso(form.startTime),
                endTime: toIso(form.endTime),
                slotType: form.slotType,
                slotMeetingType: form.slotMeetingType,
                maxParticipants: Number(form.maxParticipants),
                meetingLink: form.meetingLink,
                description: form.description || undefined,
            };

            await slotApi.create(payload);
            setSuccess("Слот успешно создан");
            await loadSlots();
        } catch (err) {
            const msg =
                err?.response?.data?.message || err?.message || "Не удалось создать слот";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = async (slotId) => {
        setActionLoadingId(slotId);
        setError(null);
        setSuccess(null);

        try {
            await slotApi.cancel(slotId);
            setSuccess("Слот отменён");
            await loadSlots();
        } catch (err) {
            const msg =
                err?.response?.data?.message || err?.message || "Не удалось отменить слот";
            setError(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>
                Управление слотами
            </Typography>

            <Card
                elevation={0}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    mb: 3,
                }}
            >
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Новый слот
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="startTime"
                                label="Начало"
                                type="datetime-local"
                                value={form.startTime}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                name="endTime"
                                label="Окончание"
                                type="datetime-local"
                                value={form.endTime}
                                onChange={handleChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                name="slotType"
                                label="Тип слота"
                                value={form.slotType}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="INDIVIDUAL">INDIVIDUAL</MenuItem>
                                <MenuItem value="GROUP">GROUP</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                name="slotMeetingType"
                                label="Тип встречи"
                                value={form.slotMeetingType}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="ACQUAINTANCE">ACQUAINTANCE</MenuItem>
                                <MenuItem value="COMMUNICATION">COMMUNICATION</MenuItem>
                                <MenuItem value="ACCEPTING">ACCEPTING</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                name="maxParticipants"
                                label="Макс. участников"
                                type="number"
                                inputProps={{ min: 1, max: 50 }}
                                value={form.maxParticipants}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="meetingLink"
                                label="Ссылка на встречу"
                                value={form.meetingLink}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Описание"
                                value={form.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                minRows={3}
                            />
                        </Grid>
                    </Grid>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Button variant="contained" onClick={handleCreate} disabled={saving}>
                        {saving ? "Создание..." : "Создать слот"}
                    </Button>
                </CardActions>
            </Card>

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
                    {visibleSlots.length === 0 && (
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            На выбранной неделе слотов нет
                        </Typography>
                    )}

                    <Box sx={{ overflowX: "auto" }}>
                        <SlotsWeekCalendar
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
                            onCancelSlot={handleCancel}
                            actionLoadingId={actionLoadingId}
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default MentorSlotsPage;