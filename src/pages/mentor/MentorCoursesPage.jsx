import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Container, Tab, Tabs } from "@mui/material";
import { courseApi } from "../../api/courseApi";
import { userApi } from "../../api/userApi";
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

    useEffect(() => {
        let alive = true;

        const fetchAll = async () => {
            try {
                const [meData, allCourses, preview] = await Promise.all([
                    userApi.me(),            // /user/me
                    courseApi.getAll(),      // /course/all
                    courseApi.getActivePreview(), // /course/all/active/preview
                ]);

                if (!alive) return;

                setMe(meData);

                const my = Array.isArray(allCourses)
                    ? allCourses.filter((c) => c?.author?.id === meData?.id)
                    : [];

                setMyCourses(my);
                setPreviewCourses(preview || []);
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message || "Ошибка загрузки";
                if (!alive) return;

                setErrorMy(msg);
                setErrorPreview(msg);
            } finally {
                if (!alive) return;
                setLoadingMy(false);
                setLoadingPreview(false);
            }
        };

        fetchAll();
        return () => {
            alive = false;
        };
    }, []);

    const myCount = useMemo(() => myCourses?.length || 0, [myCourses]);
    const allCount = useMemo(() => previewCourses?.length || 0, [previewCourses]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label={`Мои курсы (${myCount})`} />
                    <Tab label={`Все курсы (${allCount})`} />
                </Tabs>
            </Box>

            {tab === 0 && (
                <>
                    {loadingMy ? (
                        <CircularProgress />
                    ) : errorMy ? (
                        <Alert severity="error">{errorMy}</Alert>
                    ) : (
                        // ВАЖНО: для ментора "Мои курсы" должны открываться
                        <CourseList courses={myCourses} variant="owned" />
                    )}
                </>
            )}

            {tab === 1 && (
                <>
                    {loadingPreview ? (
                        <CircularProgress />
                    ) : errorPreview ? (
                        <Alert severity="error">{errorPreview}</Alert>
                    ) : (
                        <CourseList courses={previewCourses} variant="preview" />
                    )}
                </>
            )}
        </Container>
    );
};

export default MentorCoursesPage;
