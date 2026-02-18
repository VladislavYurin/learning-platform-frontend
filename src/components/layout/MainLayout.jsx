import React from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppBar, Box, Button, Container, Toolbar, Typography} from "@mui/material";
import {logout} from "../../store/authSlice";

const MainLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isAuthenticated, user} = useSelector((s) => s.auth);

    const basePath =
        user?.role === "MENTOR" ? "/mentor" : user?.role === "ADMIN" ? "/admin" : "/user";
    const profilePath =
        user?.role === "MENTOR" ? "/mentor/profile" : user?.role === "ADMIN" ? "/admin" : "/user/profile";

    const handleLogout = () => {
        dispatch(logout());
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

                    {isAuthenticated && (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate(profilePath)}
                                sx={{ mr: 2, textTransform: "none", fontWeight: 500 }}
                            >
                                {user?.username || "Пользователь"} ({user?.role || "USER"})
                            </Button>
                            {user?.role === "ADMIN" && (
                                <Button color="inherit" component={Link} to="/admin">
                                    Админ
                                </Button>
                            )}

                            <Button color="inherit" component={Link} to={basePath}>
                                Кабинет
                            </Button>

                            {user?.role !== "ADMIN" && (
                                <Button color="inherit" component={Link} to={`${basePath}/slots`}>
                                    Слоты
                                </Button>
                            )}

                            <Button color="inherit" onClick={handleLogout}>
                                Выйти
                            </Button>
                        </>
                    )}

                    {!isAuthenticated && (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Войти
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Регистрация
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
