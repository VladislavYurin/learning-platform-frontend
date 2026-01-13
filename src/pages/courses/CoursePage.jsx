import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {courseApi} from "../../api/courseApi";
import ModuleList from "../../components/courses/ModuleList";
import {Alert, Box, Button, CircularProgress, Container, Typography} from "@mui/material";

const CoursePage = () => {
    const {courseId} = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        const fetchCourse = async () => {
            try {
                const data = await courseApi.getById(courseId); // /course/{courseId}
                if (!alive) return;

                setCourse(data);

                // бэк возвращает modules в CourseDto
                const list = Array.isArray(data?.modules) ? data.modules : [];

                // сортировка по порядковому номеру
                list.sort((a, b) => (a.moduleOrderNumber ?? 0) - (b.moduleOrderNumber ?? 0));

                setModules(list);
            } catch (err) {
                const msg =
                    err?.response?.data?.message || err?.message || "Не удалось загрузить курс";
                if (alive) setError(msg);
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchCourse();
        return () => {
            alive = false;
        };
    }, [courseId]);

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="lg">
            <Box sx={{mb: 2}}>
                <Button variant="text" onClick={() => navigate(-1)}>
                    ← Назад
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                {course?.courseTitle}
            </Typography>

            {course?.courseDescription && (
                <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>
                    {course.courseDescription}
                </Typography>
            )}

            <Typography variant="h5" gutterBottom>
                Модули курса
            </Typography>

            <ModuleList modules={modules} courseId={courseId}/>
        </Container>
    );
};

export default CoursePage;
