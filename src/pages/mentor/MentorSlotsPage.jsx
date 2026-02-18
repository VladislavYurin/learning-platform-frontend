import React, {useEffect, useState} from "react";
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
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {slotApi} from "../../api/slotApi";

const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("ru-RU");
};

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
            setSlots(Array.isArray(data) ? data : []);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось загрузить слоты";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSlots();
    }, []);

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
            const msg = err?.response?.data?.message || err?.message || "Не удалось создать слот";
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
            const msg = err?.response?.data?.message || err?.message || "Не удалось отменить слот";
            setError(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Управление слотами
            </Typography>

            <Card elevation={0} sx={{border: "1px solid", borderColor: "divider", borderRadius: 3, mb: 3}}>
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
                                InputLabelProps={{shrink: true}}
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
                                InputLabelProps={{shrink: true}}
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
                                inputProps={{min: 1, max: 50}}
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
                <CardActions sx={{px: 2, pb: 2, pt: 0}}>
                    <Button variant="contained" onClick={handleCreate} disabled={saving}>
                        {saving ? "Создание..." : "Создать слот"}
                    </Button>
                </CardActions>
            </Card>

            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{mb: 2}}>
                    {success}
                </Alert>
            )}

            <Typography variant="h6" gutterBottom>
                Мои слоты
            </Typography>

            {loading ? (
                <CircularProgress/>
            ) : slots.length === 0 ? (
                <Typography color="text.secondary">Слотов пока нет</Typography>
            ) : (
                <Grid container spacing={2}>
                    {slots.map((slot) => (
                        <Grid item xs={12} md={6} key={slot.id || slot.requestId}>
                            <Card elevation={0} sx={{border: "1px solid", borderColor: "divider", borderRadius: 3}}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {slot.slotMeetingType || "Встреча"} ({slot.slotType || "—"})
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Начало: {formatDateTime(slot.startTime)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Окончание: {formatDateTime(slot.endTime)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Статус: {slot.isActive === false ? "Неактивен" : "Активен"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Участников: {slot.participants?.length || 0} / {slot.maxParticipants ?? "—"}
                                    </Typography>

                                    {slot.description && <Typography sx={{mt: 1}}>{slot.description}</Typography>}
                                    {slot.meetingLink && (
                                        <Typography variant="body2" sx={{mt: 1}}>
                                            Ссылка: {slot.meetingLink}
                                        </Typography>
                                    )}

                                    {slot.participants?.length > 0 && (
                                        <Box sx={{mt: 1.5}}>
                                            <Typography variant="subtitle2">Участники:</Typography>
                                            <Stack spacing={0.4} sx={{mt: 0.5}}>
                                                {slot.participants.map((p) => (
                                                    <Typography key={p.id} variant="body2" color="text.secondary">
                                                        {p.firstName || p.lastName
                                                            ? `${p.firstName || ""} ${p.lastName || ""}`.trim()
                                                            : p.username || `ID: ${p.id}`}
                                                    </Typography>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}
                                </CardContent>

                                <CardActions sx={{px: 2, pb: 2, pt: 0}}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        disabled={Boolean(actionLoadingId)}
                                        onClick={() => handleCancel(slot.id)}
                                    >
                                        {actionLoadingId === slot.id ? "Отмена..." : "Отменить слот"}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MentorSlotsPage;
