import React, {useEffect, useState} from "react";
import {userApi} from "../../api/userApi";
import {Alert, Box, Button, CircularProgress, Container, Divider, Paper, Typography,} from "@mui/material";
import {useNavigate} from "react-router-dom";

const MyProfilePage = () => {
    const navigate = useNavigate();

    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        const fetchMe = async () => {
            try {
                const data = await userApi.me();
                if (alive) setMe(data);
            } catch (err) {
                const msg =
                    err?.response?.data?.message || err?.message || "Не удалось загрузить профиль";
                if (alive) setError(msg);
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchMe();
        return () => {
            alive = false;
        };
    }, []);

    return (
        <Container maxWidth="sm">
            <Box sx={{mb: 2}}>
                <Button variant="text" onClick={() => navigate(-1)}>
                    ← Назад
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                Мой профиль
            </Typography>

            {loading ? (
                <CircularProgress/>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
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
                    <Typography variant="h6" gutterBottom>
                        {me?.firstName || me?.lastName
                            ? `${me?.firstName || ""} ${me?.lastName || ""}`.trim()
                            : me?.username || "Пользователь"}
                    </Typography>

                    <Typography color="text.secondary" sx={{mb: 1}}>
                        Роль: {me?.role || "—"}
                    </Typography>

                    <Divider sx={{my: 2}}/>

                    <Typography variant="body2">
                        <b>Email:</b> {me?.username || "—"}
                    </Typography>

                    <Typography variant="body2" sx={{mt: 1}}>
                        <b>Telegram:</b> {me?.tgNickname || "—"}
                    </Typography>
                </Paper>
            )}
        </Container>
    );
};

export default MyProfilePage;
