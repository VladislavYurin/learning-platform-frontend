import React, {useState} from "react";
import {Alert, Box, Button, TextField, Typography} from "@mui/material";

const RegisterForm = ({onSubmit, error, loading = false}) => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        tgNickname: "",
    });
    const [avatar, setAvatar] = useState(null);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0] || null;
        setAvatar(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({...form, avatar});
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
            {error && (
                <Alert severity="error" sx={{mb: 2}}>
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
                name="firstName"
                label="Имя"
                fullWidth
                margin="normal"
                value={form.firstName}
                onChange={handleChange}
                required
            />

            <TextField
                name="lastName"
                label="Фамилия"
                fullWidth
                margin="normal"
                value={form.lastName}
                onChange={handleChange}
                required
            />

            <TextField
                name="tgNickname"
                label="Telegram (например @nickname)"
                fullWidth
                margin="normal"
                value={form.tgNickname}
                onChange={handleChange}
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

            <TextField
                name="confirmPassword"
                label="Подтверждение пароля"
                type="password"
                fullWidth
                margin="normal"
                value={form.confirmPassword}
                onChange={handleChange}
                required
            />

            <Box sx={{mt: 2}}>
                <Button component="label" variant="outlined">
                    Загрузить аватар
                    <input hidden type="file" accept="image/*" onChange={handleAvatarChange}/>
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                    {avatar ? `Файл: ${avatar.name}` : "Файл не выбран"}
                </Typography>
            </Box>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{mt: 3}}
                disabled={loading}
            >
                {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
            </Button>
        </Box>
    );
};

export default RegisterForm;
