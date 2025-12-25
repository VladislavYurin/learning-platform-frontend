import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid } from '@mui/material';

const MentorDashboard = () => {
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Панель ментора
            </Typography>

            <Grid container spacing={3} mt={4}>
                <Grid item xs={12} md={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/mentor/courses"
                        fullWidth
                        size="large"
                    >
                        Мои курсы
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        size="large"
                        disabled
                    >
                        Статистика
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MentorDashboard;