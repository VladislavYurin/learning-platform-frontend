import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Box, Button, CircularProgress, Container, Typography} from "@mui/material";
import {courseApi} from "../../api/courseApi";

const MentorCoursePage = () => {
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
                const data = await courseApi.getById(courseId); // /course/{id} (with modules)
                if (!alive) return;

                setCourse(data);

                const list = Array.isArray(data?.modules) ? data.modules : [];
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
            <Box sx={{mb: 2, display: "flex", gap: 1}}>
                <Button variant="text" onClick={() => navigate(-1)}>
                    ← Назад
                </Button>
                <Button variant="outlined" onClick={() => navigate("/mentor/stats")}>
                    Статистика по курсу (позже)
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                {course?.courseTitle}
            </Typography>

            {course?.courseDescription && (
                <Typography color="text.secondary" sx={{mb: 2}}>
                    {course.courseDescription}
                </Typography>
            )}

            <Typography variant="h5" gutterBottom>
                Модули
            </Typography>

            {/* ModuleList уже есть: он открывает /user/... — мы его не ломаем.
          Для ментора нужен отдельный список/карточка, но чтобы быстро запустить —
          делаем свой рендер ниже (чтобы маршруты были /mentor/...). */}

            <ModuleListMentor modules={modules} courseId={courseId}/>
        </Container>
    );
};

const ModuleListMentor = ({modules, courseId}) => {
    const navigate = useNavigate();

    if (!modules?.length) {
        return <Typography color="text.secondary">В курсе пока нет модулей</Typography>;
    }

    return (
        <Box sx={{display: "grid", gridTemplateColumns: {xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr"}, gap: 2}}>
            {modules.map((m) => (
                <Box
                    key={m.id}
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 3,
                        p: 2,
                        transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                        "&:hover": {transform: "translateY(-3px)", boxShadow: 4, borderColor: "text.primary"},
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{lineHeight: 1.2}}>
                        {m.moduleTitle}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                        #{m.moduleOrderNumber ?? "—"} • {m.isActive === false ? "Неактивен" : "Активен"}
                    </Typography>

                    <Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => navigate(`/mentor/courses/${courseId}/modules/${m.id}`)}
                        >
                            Открыть
                        </Button>

                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/mentor/courses/${courseId}/modules/${m.id}/edit`)}
                        >
                            Редактировать
                        </Button>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default MentorCoursePage;
