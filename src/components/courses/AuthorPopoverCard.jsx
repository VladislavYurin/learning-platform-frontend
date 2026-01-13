import React from "react";
import {Avatar, Box, Divider, Stack, Typography} from "@mui/material";

const AuthorPopoverCard = ({user, fallbackName}) => {
    if (!user) return null;

    const fullName =
        user.firstName || user.lastName
            ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
            : null;

    const title = fullName || user.username || fallbackName || "Пользователь";

    return (
        <Box>
            <Box sx={{display: "flex", gap: 1.5, alignItems: "center", mb: 1}}>
                <Avatar sx={{width: 40, height: 40}}>
                    {(user.firstName?.[0] || user.username?.[0] || "?").toUpperCase()}
                </Avatar>

                <Box sx={{minWidth: 0}}>
                    <Typography variant="subtitle1" sx={{lineHeight: 1.1}}>
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Роль: {user.role || "—"}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{my: 1}}/>

            <Stack spacing={0.6}>
                {user.username && (
                    <Typography variant="body2">
                        <b>Email:</b> {user.username}
                    </Typography>
                )}
                {user.tgNickname && (
                    <Typography variant="body2">
                        <b>Telegram:</b> {user.tgNickname}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default AuthorPopoverCard;
