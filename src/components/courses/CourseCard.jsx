import React from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Card, CardActions, CardContent, Stack, Typography,} from "@mui/material";
import AuthorHover from "./AuthorHover";

const CourseCard = ({course, variant = "owned"}) => {
    const navigate = useNavigate();
    const author = course?.author;
    const isPreview = variant === "preview";

    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 4,
                    borderColor: "text.primary",
                },
            }}
        >
            <CardContent sx={{flexGrow: 1, pb: 1.5}}>
                <Typography variant="h6" gutterBottom sx={{lineHeight: 1.2}}>
                    {course.courseTitle}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {course.courseDescription}
                </Typography>

                {author && (
                    <Box sx={{mb: 1.5}}>
                        <Typography variant="caption" color="text.secondary">
                            Автор:&nbsp;
                        </Typography>
                        <AuthorHover author={author}/>
                    </Box>
                )}

                {course.tags && course.tags.length > 0 && (
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 2,
                            border: "1px dashed",
                            borderColor: "divider",
                            backgroundColor: "background.paper",
                            maxWidth: "100%",
                            overflow: "hidden",
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                            sx={{maxWidth: "100%", minWidth: 0, overflow: "hidden"}}
                        >
                            {course.tags.map((tag) => (
                                <Box
                                    key={tag.id}
                                    sx={{
                                        px: 1,
                                        py: 0.4,
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        lineHeight: 1.2,

                                        maxWidth: "100%",
                                        minWidth: 0,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",

                                        "&:hover": {borderColor: "primary.main"},
                                    }}
                                    title={tag.tagName}
                                >
                                    {tag.tagName}
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}

                {isPreview && (
                    <Typography variant="caption" color="text.secondary" sx={{display: "block", mt: 1.5}}>
                        Чтобы открыть курс, ментор должен выдать доступ.
                    </Typography>
                )}
            </CardContent>

            {!isPreview && (
                <CardActions sx={{px: 2, pb: 2, pt: 0}}>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/user/courses/${course.id}`)}
                    >
                        Открыть
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

export default CourseCard;
