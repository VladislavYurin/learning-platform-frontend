import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {courseApi} from "../../api/courseApi";
import {moduleApi} from "../../api/moduleApi";

const MentorCoursePage = () => {
    const {courseId} = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [importing, setImporting] = useState(false);
    const [deletingModuleId, setDeletingModuleId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [createForm, setCreateForm] = useState({
        moduleTitle: "",
        moduleOrderNumber: "",
        moduleContentDescription: "",
    });
    const [importFile, setImportFile] = useState(null);

    const fetchCourse = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await courseApi.getById(courseId);
            setCourse(data);

            const list = Array.isArray(data?.modules) ? [...data.modules] : [];
            list.sort((a, b) => (a.moduleOrderNumber ?? 0) - (b.moduleOrderNumber ?? 0));
            setModules(list);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось загрузить курс";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const handleCreateFormChange = (e) => {
        setCreateForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreateModule = async () => {
        setCreating(true);
        setError(null);
        setSuccess(null);

        try {
            await moduleApi.create({
                courseId: Number(courseId),
                moduleTitle: createForm.moduleTitle,
                moduleOrderNumber: Number(createForm.moduleOrderNumber),
                moduleContentDescription: createForm.moduleContentDescription,
            });
            setSuccess("Модуль создан");
            setCreateForm({
                moduleTitle: "",
                moduleOrderNumber: "",
                moduleContentDescription: "",
            });
            await fetchCourse();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось создать модуль";
            setError(msg);
        } finally {
            setCreating(false);
        }
    };

    const handleImportModule = async () => {
        if (!importFile) {
            setError("Выберите markdown-файл");
            return;
        }

        setImporting(true);
        setError(null);
        setSuccess(null);

        try {
            await moduleApi.importMarkdown({
                file: importFile,
                request: {
                    courseId: Number(courseId),
                    moduleTitle: createForm.moduleTitle,
                    moduleOrderNumber: Number(createForm.moduleOrderNumber),
                    moduleContentDescription: createForm.moduleContentDescription || importFile.name,
                },
            });
            setSuccess("Модуль импортирован");
            setImportFile(null);
            await fetchCourse();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось импортировать модуль";
            setError(msg);
        } finally {
            setImporting(false);
        }
    };

    const handleDeleteModule = async (module) => {
        const moduleRef = module?.id ?? module?.moduleOrderNumber;
        setDeletingModuleId(moduleRef);
        setError(null);
        setSuccess(null);

        try {
            await moduleApi.delete(courseId, moduleRef);
            setSuccess("Модуль удалён");
            await fetchCourse();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось удалить модуль";
            setError(msg);
        } finally {
            setDeletingModuleId(null);
        }
    };

    if (loading) return <CircularProgress/>;
    if (error && !course) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="lg">
            <Box sx={{mb: 2, display: "flex", gap: 1, flexWrap: "wrap"}}>
                <Button variant="text" onClick={() => navigate(-1)}>
                    ← Назад
                </Button>
                <Button variant="outlined" onClick={() => navigate("/mentor/stats")}>
                    Статистика по курсу
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{mb: 2}}>
                    {success}
                </Alert>
            )}

            <Typography variant="h4" gutterBottom>
                {course?.courseTitle}
            </Typography>

            {course?.courseDescription && (
                <Typography color="text.secondary" sx={{mb: 2}}>
                    {course.courseDescription}
                </Typography>
            )}

            <Card elevation={0} sx={{border: "1px solid", borderColor: "divider", borderRadius: 3, mb: 3}}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Создать / импортировать модуль
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="moduleTitle"
                                label="Название модуля"
                                value={createForm.moduleTitle}
                                onChange={handleCreateFormChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="moduleOrderNumber"
                                label="Порядковый номер"
                                type="number"
                                value={createForm.moduleOrderNumber}
                                onChange={handleCreateFormChange}
                                fullWidth
                                inputProps={{min: 1}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="moduleContentDescription"
                                label="Markdown-содержимое"
                                value={createForm.moduleContentDescription}
                                onChange={handleCreateFormChange}
                                fullWidth
                                multiline
                                minRows={5}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions sx={{px: 2, pb: 2, pt: 0}}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Button variant="contained" onClick={handleCreateModule} disabled={creating}>
                            {creating ? "Создание..." : "Создать модуль"}
                        </Button>

                        <Button component="label" variant="outlined">
                            Выбрать .md
                            <input
                                hidden
                                type="file"
                                accept=".md,text/markdown,text/plain"
                                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                            />
                        </Button>

                        <Button variant="outlined" onClick={handleImportModule} disabled={importing}>
                            {importing ? "Импорт..." : "Импорт из Markdown"}
                        </Button>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ml: 1}}>
                        {importFile ? `Файл: ${importFile.name}` : ""}
                    </Typography>
                </CardActions>
            </Card>

            <Typography variant="h5" gutterBottom>
                Модули
            </Typography>

            <ModuleListMentor
                modules={modules}
                courseId={courseId}
                deletingModuleId={deletingModuleId}
                onDelete={handleDeleteModule}
            />
        </Container>
    );
};

const ModuleListMentor = ({modules, courseId, deletingModuleId, onDelete}) => {
    const navigate = useNavigate();

    if (!modules?.length) {
        return <Typography color="text.secondary">В курсе пока нет модулей</Typography>;
    }

    return (
        <Box sx={{display: "grid", gridTemplateColumns: {xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr"}, gap: 2}}>
            {modules.map((m) => {
                const moduleRef = m.id ?? m.moduleOrderNumber;

                return (
                    <Box
                        key={moduleRef}
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
                            ID: {m.id ?? "—"} • #{m.moduleOrderNumber ?? "—"} • {m.isActive === false ? "Неактивен" : "Активен"}
                        </Typography>

                        <Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => navigate(`/mentor/courses/${courseId}/modules/${moduleRef}`)}
                            >
                                Открыть
                            </Button>

                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => navigate(`/mentor/courses/${courseId}/modules/${moduleRef}/edit`)}
                            >
                                Редактировать
                            </Button>

                            <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                disabled={deletingModuleId === moduleRef}
                                onClick={() => onDelete(m)}
                            >
                                {deletingModuleId === moduleRef ? "Удаление..." : "Удалить"}
                            </Button>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default MentorCoursePage;
