import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Box, Button, CircularProgress, Container, Typography} from "@mui/material";
import {moduleApi} from "../../api/moduleApi";

const MentorModulePage = () => {
    const {courseId, moduleId} = useParams();
    const navigate = useNavigate();

    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        const fetchModule = async () => {
            try {
                const data = await moduleApi.getById(courseId, moduleId); // /module/{courseId}/{moduleId}
                if (alive) setModule(data);
            } catch (err) {
                const msg =
                    err?.response?.data?.message || err?.message || "Не удалось загрузить модуль";
                if (alive) setError(msg);
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchModule();
        return () => {
            alive = false;
        };
    }, [courseId, moduleId]);

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="lg">
            <Box sx={{mb: 2, display: "flex", gap: 1, flexWrap: "wrap"}}>
                <Button variant="text" onClick={() => navigate(-1)}>
                    ← Назад
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => navigate(`/mentor/courses/${courseId}/modules/${moduleId}/edit`)}
                >
                    Редактировать
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                {module?.moduleTitle}
            </Typography>

            <div dangerouslySetInnerHTML={{__html: module?.moduleContent || ""}}/>
        </Container>
    );
};

export default MentorModulePage;
