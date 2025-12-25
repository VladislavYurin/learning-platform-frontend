import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Container, Typography, Grid, Card, CardContent } from '@mui/material';

const HomePage = () => {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <Container maxWidth="lg">
            <Typography variant="h2" gutterBottom align="center" mt={4}>
                Добро пожаловать на образовательную платформу
            </Typography>

            <Typography variant="h5" gutterBottom align="center" mb={4}>
                Изучайте новые технологии с лучшими менторами
            </Typography>

            {!isAuthenticated && (
                <Grid container spacing={2} justifyContent="center" mb={4}>
                    <Grid item>
                        <Button variant="contained" color="primary" component={Link} to="/login">
                            Войти
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color="primary" component={Link} to="/register">
                            Зарегистрироваться
                        </Button>
                    </Grid>
                </Grid>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Курсы</Typography>
                            <Typography>
                                Доступные курсы по различным технологиям и направлениям разработки
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Модули</Typography>
                            <Typography>
                                Структурированные модули с теорией и практическими заданиями
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>Менторы</Typography>
                            <Typography>
                                Опытные разработчики, готовые помочь в освоении материала
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default HomePage;