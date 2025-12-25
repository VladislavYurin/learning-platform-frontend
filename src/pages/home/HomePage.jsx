import React from 'react';
import {Card, CardContent, Container, Grid, Typography} from '@mui/material';

const HomePage = () => {
    return (
        <Container maxWidth="lg">
            <Typography variant="h2" gutterBottom align="center" mt={4}>
                Добро пожаловать на образовательную платформу. Убейте меня !!!!!
            </Typography>

            <Typography variant="h5" gutterBottom align="center" mb={4}>
                Изучайте новые технологии с лучшими менторами
            </Typography>

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