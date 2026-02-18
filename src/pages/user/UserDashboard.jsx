import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {courseApi} from "../../api/courseApi";
import CourseList from "../../components/courses/CourseList";
import {Alert, Box, Button, CircularProgress, Container, Tab, Tabs,} from "@mui/material";

const UserDashboard = () => {
    const navigate = useNavigate();

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
            return <CourseList courses={myCourses} variant="owned" basePath="/user"/>;
        }

        if (tab === 1) {
            if (loadingPreview) return <CircularProgress/>;
            if (errorPreview) return <Alert severity="error">{errorPreview}</Alert>;
            return <CourseList courses={previewCourses} variant="preview" basePath="/user"/>;
        }

        return null;
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{display: "flex", justifyContent: "flex-end", mb: 2}}>
                <Button variant="outlined" onClick={() => navigate("/user/slots")}>
                    Слоты менторов
                </Button>
            </Box>

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
