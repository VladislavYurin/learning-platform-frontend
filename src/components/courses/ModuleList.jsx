import React from "react";
import {Grid, Typography} from "@mui/material";
import ModuleCard from "./ModuleCard";

const ModuleList = ({modules, courseId}) => {
    if (!modules || modules.length === 0) {
        return <Typography color="text.secondary">Доступных модулей нет</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {modules.map((m) => (
                <Grid item xs={12} sm={6} md={4} key={m.id}>
                    <ModuleCard module={m} courseId={courseId}/>
                </Grid>
            ))}
        </Grid>
    );
};

export default ModuleList;
