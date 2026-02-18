import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Box, Container, Typography} from "@mui/material";
import RegisterForm from "../../components/auth/RegisterForm";
import {authApi} from "../../api/authApi";
import {loginFailure, loginStart, loginSuccess} from "../../store/authSlice";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setError(null);

        if (values.password !== values.confirmPassword) {
            const msg = "Пароль и подтверждение не совпадают";
            dispatch(loginFailure(msg));
            setError(msg);
            return;
        }

        if (!values.avatar) {
            const msg = "Загрузите аватар";
            dispatch(loginFailure(msg));
            setError(msg);
            return;
        }

        dispatch(loginStart());
        setLoading(true);

        try {
            const request = {
                username: values.username,
                password: values.password,
                confirmPassword: values.confirmPassword,
                firstName: values.firstName,
                lastName: values.lastName,
                tgNickname: values.tgNickname || undefined,
            };

            const response = await authApi.register({
                request,
                avatar: values.avatar,
            });

            dispatch(
                loginSuccess({
                    user: {
                        username: values.username,
                        role: response.role,
                    },
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                })
            );

            if (response.role === "MENTOR") navigate("/mentor");
            else if (response.role === "ADMIN") navigate("/admin");
            else navigate("/user");
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Ошибка регистрации";
            dispatch(loginFailure(msg));
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Typography variant="h4" align="center" gutterBottom>
                    Регистрация
                </Typography>

                <RegisterForm onSubmit={handleSubmit} error={error} loading={loading}/>
            </Box>
        </Container>
    );
};

export default RegisterPage;
