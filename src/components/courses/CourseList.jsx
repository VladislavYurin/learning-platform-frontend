import React from "react";
import {Grid, Typography} from "@mui/material";
import CourseCard from "./CourseCard";

/**
 * variant:
 * - "owned"  -> курсы с доступом (кнопка "Открыть")
 * - "preview"-> все активные (без кнопки)
 */
const CourseList = ({courses, variant = "owned"}) => {
    if (!courses || courses.length === 0) {
        return <Typography color="text.secondary">Курсы пока недоступны</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <CourseCard course={course} variant={variant}/>
                </Grid>
            ))}
        </Grid>
    );
};

export default CourseList;
