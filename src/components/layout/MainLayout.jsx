import React from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppBar, Box, Button, Container, Toolbar, Typography} from "@mui/material";

const MainLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isAuthenticated, user} = useSelector((s) => s.auth);

    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        style={{color: "inherit", textDecoration: "none"}}
                    >
                        Learning Platform
                    </Typography>

                    <Box sx={{flexGrow: 1}}/>

                    {!isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Войти
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Регистрация
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography sx={{mr: 2}}>
                                {user?.username || "Пользователь"} ({user?.role || "USER"})
                            </Typography>

                            {user?.role === "MENTOR" && (
                                <Button color="inherit" component={Link} to="/mentor">
                                    Ментор
                                </Button>
                            )}
                            {user?.role === "ADMIN" && (
                                <Button color="inherit" component={Link} to="/admin">
                                    Админ
                                </Button>
                            )}
                            <Button color="inherit" component={Link} to="/user">
                                Кабинет
                            </Button>

                            <Button color="inherit" onClick={handleLogout}>
                                Выйти
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{py: 3}}>
                <Outlet/>
            </Container>
        </>
    );
};

export default MainLayout;