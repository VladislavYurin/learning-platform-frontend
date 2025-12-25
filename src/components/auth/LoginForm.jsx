import React, { useState } from "react";
import { Box, TextField, Button, Alert } from "@mui/material";

const LoginForm = ({ onSubmit, error }) => {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                name="username"
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={form.username}
                onChange={handleChange}
                required
            />

            <TextField
                name="password"
                label="Пароль"
                type="password"
                fullWidth
                margin="normal"
                value={form.password}
                onChange={handleChange}
                required
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
            >
                Войти
            </Button>
        </Box>
    );
};

export default LoginForm;