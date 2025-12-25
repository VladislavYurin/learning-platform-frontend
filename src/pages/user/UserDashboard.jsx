import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {courseApi} from "../../api/courses";
import CourseList from "../../components/courses/CourseList";
import {Alert, CircularProgress, Container, Typography} from "@mui/material";

const UserDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {user} = useSelector((state) => state.auth);

    useEffect(() => {
        let alive = true;

        const fetchCourses = async () => {
            try {
                const data = await courseApi.getActive();
                if (alive) setCourses(data);
            } catch (err) {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Не удалось загрузить курсы";
                if (alive) setError(msg);
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchCourses();

        return () => {
            alive = false;
        };
    }, []);

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Добро пожаловать, {user?.username || "пользователь"}!
            </Typography>

            <Typography variant="h5" gutterBottom>
                Доступные курсы
            </Typography>

            <CourseList courses={courses}/>
        </Container>
    );
};

export default UserDashboard;