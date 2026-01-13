import React from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Card, CardActions, CardContent, Typography} from "@mui/material";

const ModuleCard = ({module, courseId}) => {
    const navigate = useNavigate();

    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 4,
                    borderColor: "text.primary",
                },
            }}
        >
            <CardContent sx={{flexGrow: 1}}>
                <Box sx={{display: "flex", justifyContent: "space-between", gap: 2}}>
                    <Typography variant="h6" gutterBottom sx={{lineHeight: 1.2}}>
                        {module.moduleTitle}
                    </Typography>

                    {typeof module.moduleOrderNumber === "number" && (
                        <Typography
                            variant="caption"
                            sx={{
                                px: 1,
                                py: 0.4,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                whiteSpace: "nowrap",
                                height: "fit-content",
                            }}
                        >
                            #{module.moduleOrderNumber}
                        </Typography>
                    )}
                </Box>

                <Typography variant="body2" color="text.secondary">
                    {module.isActive === false ? "Модуль неактивен" : "Доступен к изучению"}
                </Typography>
            </CardContent>

            <CardActions sx={{px: 2, pb: 2, pt: 0}}>
                <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/user/courses/${courseId}/modules/${module.id}`)}
                >
                    Открыть
                </Button>
            </CardActions>
        </Card>
    );
};

export default ModuleCard;
