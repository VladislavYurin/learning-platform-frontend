import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {authApi} from "../../api/authApi";
import {loginFailure, loginStart, loginSuccess} from "../../store/authSlice";
import LoginForm from "../../components/auth/LoginForm";
import {Box, Container, Typography} from "@mui/material";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (values) => {
        dispatch(loginStart());

        try {
            const {username, password} = values;

            const response = await authApi.login({username, password});
            // response: { accessToken, refreshToken, role }

            dispatch(
                loginSuccess({
                    user: {
                        username,
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
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Ошибка авторизации";

            dispatch(loginFailure(msg));
            setError(msg);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Typography variant="h4" align="center" gutterBottom>
                    Вход в систему
                </Typography>

                <LoginForm onSubmit={handleSubmit} error={error}/>
            </Box>
        </Container>
    );
};

export default LoginPage;
