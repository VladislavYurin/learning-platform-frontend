import React, {useState} from "react";
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

const UserSlotsPage = () => {
    const [mentorId, setMentorId] = useState("");
    const [slots, setSlots] = useState([]);
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
            setSlots(data);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось загрузить слоты";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (slotId) => {
        setActionLoadingId(slotId);
        setError(null);
        setSuccess(null);

        try {
            await slotApi.book(slotId);
            setSuccess("Слот успешно забронирован");
            await loadSlots();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось забронировать слот";
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
            const msg = err?.response?.data?.message || err?.message || "Не удалось отменить бронь";
            setError(msg);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Слоты менторов
            </Typography>

            <Box sx={{display: "flex", gap: 1, alignItems: "center", mb: 2, flexWrap: "wrap"}}>
                <TextField
                    label="ID ментора"
                    value={mentorId}
                    onChange={(e) => setMentorId(e.target.value)}
                    inputMode="numeric"
                    sx={{minWidth: 220}}
                />
                <Button variant="contained" onClick={loadSlots} disabled={loading}>
                    {loading ? "Загрузка..." : "Загрузить слоты"}
                </Button>
            </Box>

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

            {loading ? (
                <CircularProgress/>
            ) : slots.length === 0 ? (
                <Typography color="text.secondary">Слоты не найдены</Typography>
            ) : (
                <Grid container spacing={2}>
                    {slots.map((slot) => (
                        <Grid item xs={12} md={6} key={slot.id || slot.requestId}>
                            <Card
                                elevation={0}
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 3,
                                    height: "100%",
                                }}
                            >
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
                                        Участников: {slot.maxParticipants ?? "—"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Статус: {slot.slotFull ? "Заполнен" : slot.isActive === false ? "Неактивен" : "Доступен"}
                                    </Typography>

                                    {slot.description && (
                                        <Typography variant="body2" sx={{mt: 1}}>
                                            {slot.description}
                                        </Typography>
                                    )}

                                    {slot.meetingLink && (
                                        <Typography variant="body2" sx={{mt: 1}}>
                                            Ссылка: {slot.meetingLink}
                                        </Typography>
                                    )}
                                </CardContent>

                                <CardActions sx={{px: 2, pb: 2, pt: 0, gap: 1}}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        disabled={Boolean(actionLoadingId) || slot.slotFull || slot.isActive === false}
                                        onClick={() => handleBook(slot.id)}
                                    >
                                        {actionLoadingId === slot.id ? "Обработка..." : "Забронировать"}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        disabled={Boolean(actionLoadingId)}
                                        onClick={() => handleCancel(slot.id)}
                                    >
                                        Отменить бронь
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

export default UserSlotsPage;
