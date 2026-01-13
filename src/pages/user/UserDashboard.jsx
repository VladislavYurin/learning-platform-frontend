import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {courseApi} from "../../api/courseApi";
import CourseList from "../../components/courses/CourseList";
import {Alert, Box, CircularProgress, Container, Tab, Tabs,} from "@mui/material";

const UserDashboard = () => {
    const {user} = useSelector((state) => state.auth);

    const [tab, setTab] = useState(0);

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
                const [my, preview] = await Promise.all([
                    courseApi.getActive(),
                    courseApi.getActivePreview(),
                ]);

                if (!alive) return;

                setMyCourses(my);
                setPreviewCourses(preview);
            } catch (err) {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Ошибка загрузки курсов";

                if (alive) {
                    setErrorMy(msg);
                    setErrorPreview(msg);
                }
            } finally {
                if (alive) {
                    setLoadingMy(false);
                    setLoadingPreview(false);
                }
            }
        };

        fetchAll();

        return () => {
            alive = false;
        };
    }, []);

    const renderTabContent = () => {
        if (tab === 0) {
            if (loadingMy) return <CircularProgress/>;
            if (errorMy) return <Alert severity="error">{errorMy}</Alert>;
            return <CourseList courses={myCourses} variant="owned"/>;
        }

        if (tab === 1) {
            if (loadingPreview) return <CircularProgress/>;
            if (errorPreview) return <Alert severity="error">{errorPreview}</Alert>;
            return <CourseList courses={previewCourses} variant="preview"/>;
        }

        return null;
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{borderBottom: 1, borderColor: "divider", mb: 2}}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label="Мои курсы"/>
                    <Tab label="Все курсы"/>
                </Tabs>
            </Box>

            {renderTabContent()}
        </Container>
    );
};

export default UserDashboard;
