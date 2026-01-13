import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

const MentorDashboard = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Кабинет ментора
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={() => navigate("/mentor/courses")}
                    >
                        Мои курсы
                    </Button>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        onClick={() => navigate("/mentor/courses?tab=all")}
                    >
                        Все курсы (превью)
                    </Button>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        size="large"
                        onClick={() => navigate("/mentor/stats")}
                    >
                        Статистика
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, color: "text.secondary" }}>
                Тут будет быстрый обзор (позже): последние ученики, активные курсы, ближайшие слоты.
            </Box>
        </Container>
    );
};

export default MentorDashboard;
