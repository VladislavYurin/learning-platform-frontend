import React, {useEffect, useMemo, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {userApi} from "../../api/userApi";
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {updateUser} from "../../store/authSlice";

const MentorProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [me, setMe] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        tgNickname: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarSaving, setAvatarSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const avatarObjectUrlRef = useRef("");

    const displayName = useMemo(() => {
        if (!me) return "Ментор";
        if (me.firstName || me.lastName) return `${me.firstName || ""} ${me.lastName || ""}`.trim();
        return me.username || "Ментор";
    }, [me]);

    const loadAvatar = async () => {
        try {
            const blob = await userApi.getMyAvatar();
            const nextUrl = URL.createObjectURL(blob);
            if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
            avatarObjectUrlRef.current = nextUrl;
            setAvatarUrl(nextUrl);
        } catch (e) {
            // аватар может отсутствовать
        }
    };

    useEffect(() => {
        let alive = true;

        const fetchMe = async () => {
            try {
                const data = await userApi.me();
                if (!alive) return;
                setMe(data);
                setForm({
                    firstName: data?.firstName || "",
                    lastName: data?.lastName || "",
                    tgNickname: data?.tgNickname || "",
                });
                dispatch(updateUser({username: data?.username, role: data?.role}));
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message || "Не удалось загрузить профиль";
                if (alive) setError(msg);
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchMe();
        loadAvatar();
        return () => {
            alive = false;
            if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
        };
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        if (!me) return;
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await userApi.updateMe({
                ...me,
                firstName: form.firstName || null,
                lastName: form.lastName || null,
                tgNickname: form.tgNickname || null,
            });
            const fresh = await userApi.me();
            setMe(fresh);
            setForm({
                firstName: fresh?.firstName || "",
                lastName: fresh?.lastName || "",
                tgNickname: fresh?.tgNickname || "",
            });
            dispatch(updateUser({username: fresh?.username, role: fresh?.role}));
            setSuccess("Профиль обновлён");
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось сохранить профиль";
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await userApi.updateMyAvatar(file);
            await loadAvatar();
            setSuccess("Аватар обновлён");
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось обновить аватар";
            setError(msg);
        } finally {
            setAvatarSaving(false);
            e.target.value = "";
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{mb: 2}}>
                <Button variant="text" onClick={() => navigate(-1)}>
                    ← Назад
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                Профиль ментора
            </Typography>

            {loading ? (
                <CircularProgress/>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
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

                    <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 2}}>
                        <Avatar src={avatarUrl || undefined} sx={{width: 72, height: 72}}>
                            {(displayName?.[0] || "?").toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="h6">{displayName}</Typography>
                            <Typography color="text.secondary">Роль: {me?.role || "MENTOR"}</Typography>
                        </Box>
                    </Stack>

                    <Button component="label" variant="outlined" disabled={avatarSaving} sx={{mb: 2}}>
                        {avatarSaving ? "Загрузка..." : "Обновить аватар"}
                        <input hidden type="file" accept="image/*" onChange={handleAvatarUpload}/>
                    </Button>

                    <Divider sx={{my: 2}}/>

                    <TextField label="Email" value={me?.username || ""} fullWidth margin="normal" disabled/>
                    <TextField
                        name="firstName"
                        label="Имя"
                        value={form.firstName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="lastName"
                        label="Фамилия"
                        value={form.lastName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="tgNickname"
                        label="Telegram"
                        value={form.tgNickname}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <Button variant="contained" onClick={handleSave} disabled={saving} sx={{mt: 2}}>
                        {saving ? "Сохранение..." : "Сохранить"}
                    </Button>
                </Paper>
            )}
        </Container>
    );
};

export default MentorProfilePage;
