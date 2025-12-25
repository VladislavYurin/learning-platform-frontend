import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {moduleApi} from "../../api/modules";
import {Alert, CircularProgress, Container, Typography} from "@mui/material";

const ModulePage = () => {
    const {courseId, moduleId} = useParams();
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        const fetchModule = async () => {
            try {
                const data = await moduleApi.getById(courseId, moduleId);
                if (alive) setModule(data);
            } catch (err) {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Не удалось загрузить модуль";
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
            <Typography variant="h4" gutterBottom>
                {module?.moduleTitle}
            </Typography>

            <div dangerouslySetInnerHTML={{__html: module?.moduleContent}}/>
        </Container>
    );
};

export default ModulePage;
