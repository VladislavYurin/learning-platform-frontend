import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tab,
    Tabs,
    TextField,
} from "@mui/material";
import {courseApi} from "../../api/courseApi";
import {userApi} from "../../api/userApi";
import CourseList from "../../components/courses/CourseList";

const MentorCoursesPage = () => {
    const [tab, setTab] = useState(0);
    const [me, setMe] = useState(null);

    const [myCourses, setMyCourses] = useState([]);
    const [previewCourses, setPreviewCourses] = useState([]);

    const [loadingMy, setLoadingMy] = useState(true);
    const [loadingPreview, setLoadingPreview] = useState(true);

    const [errorMy, setErrorMy] = useState(null);
    const [errorPreview, setErrorPreview] = useState(null);

    const [createDlgOpen, setCreateDlgOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createForm, setCreateForm] = useState({
        courseName: "",
        courseDescription: "",
    });

    const fetchAll = useCallback(async () => {
        setLoadingMy(true);
        setLoadingPreview(true);
        setErrorMy(null);
        setErrorPreview(null);

        try {
            const [meData, allCourses, preview] = await Promise.all([
                userApi.me(),
                courseApi.getAll(),
                courseApi.getActivePreview(),
            ]);

            setMe(meData);
            const my = Array.isArray(allCourses)
                ? allCourses.filter((c) => c?.author?.id === meData?.id)
                : [];

            setMyCourses(my);
            setPreviewCourses(Array.isArray(preview) ? preview : []);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Ошибка загрузки";
            setErrorMy(msg);
            setErrorPreview(msg);
        } finally {
            setLoadingMy(false);
            setLoadingPreview(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const myCount = useMemo(() => myCourses?.length || 0, [myCourses]);
    const allCount = useMemo(() => previewCourses?.length || 0, [previewCourses]);

    const handleCreateFormChange = (e) => {
        setCreateForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreateCourse = async () => {
        if (!createForm.courseName || !createForm.courseDescription) return;

        setCreating(true);
        setErrorMy(null);

        try {
            await courseApi.create({
                authorId: me?.id,
                courseName: createForm.courseName,
                courseDescription: createForm.courseDescription,
                tagIds: [],
            });

            setCreateDlgOpen(false);
            setCreateForm({courseName: "", courseDescription: ""});
            await fetchAll();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Не удалось создать курс";
            setErrorMy(msg);
        } finally {
            setCreating(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{display: "flex", justifyContent: "flex-end", mb: 1}}>
                <Button variant="contained" onClick={() => setCreateDlgOpen(true)}>
                    Создать курс
                </Button>
            </Box>

            <Box sx={{borderBottom: 1, borderColor: "divider", mb: 2}}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label={`Мои курсы (${myCount})`}/>
                    <Tab label={`Все курсы (${allCount})`}/>
                </Tabs>
            </Box>

            {tab === 0 && (
                <>
                    {loadingMy ? (
                        <CircularProgress/>
                    ) : errorMy ? (
                        <Alert severity="error">{errorMy}</Alert>
                    ) : (
                        <CourseList courses={myCourses} variant="owned" basePath="/mentor"/>
                    )}
                </>
            )}

            {tab === 1 && (
                <>
                    {loadingPreview ? (
                        <CircularProgress/>
                    ) : errorPreview ? (
                        <Alert severity="error">{errorPreview}</Alert>
                    ) : (
                        <CourseList courses={previewCourses} variant="preview" basePath="/mentor"/>
                    )}
                </>
            )}

            <Dialog open={createDlgOpen} onClose={() => setCreateDlgOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Создать курс</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название курса"
                        name="courseName"
                        value={createForm.courseName}
                        onChange={handleCreateFormChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Описание"
                        name="courseDescription"
                        value={createForm.courseDescription}
                        onChange={handleCreateFormChange}
                        fullWidth
                        margin="normal"
                        multiline
                        minRows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDlgOpen(false)}>Отмена</Button>
                    <Button variant="contained" onClick={handleCreateCourse} disabled={creating}>
                        {creating ? "Создание..." : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MentorCoursesPage;
