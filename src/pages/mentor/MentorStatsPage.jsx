import React, {useEffect, useMemo, useState} from "react";
import {
    Alert,
    Box, Button,
    CircularProgress,
    Container,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {userApi} from "../../api/userApi";
import {courseApi} from "../../api/courseApi";
import {progressApi} from "../../api/progressApi";
import {useNavigate} from "react-router-dom";

const MentorStatsPage = () => {
    const navigate = useNavigate();
    const [me, setMe] = useState(null);
    const [myCourses, setMyCourses] = useState([]);

    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);

    const [loadingInit, setLoadingInit] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        const init = async () => {
            try {
                const [meData, all] = await Promise.all([userApi.me(), courseApi.getAll()]);
                if (!alive) return;

                setMe(meData);

                const my = Array.isArray(all) ? all.filter((c) => c?.author?.id === meData?.id) : [];
                setMyCourses(my);

                if (my.length > 0) {
                    setSelectedCourseId(String(my[0].id));
                }
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message || "Ошибка загрузки";
                if (alive) setError(msg);
            } finally {
                if (alive) setLoadingInit(false);
            }
        };

        init();
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        if (!selectedCourseId) return;

        let alive = true;
        setLoadingData(true);
        setError(null);

        const load = async () => {
            try {
                const cid = Number(selectedCourseId);
                const [s, u] = await Promise.all([
                    progressApi.courseStats(cid),
                    progressApi.courseUsers(cid),
                ]);
                if (!alive) return;

                setStats(s);
                // /users по схеме выглядит как список объектов, не Page
                setUsers(Array.isArray(u) ? u : u?.content || []);
            } catch (err) {
                const msg = err?.response?.data?.message || err?.message || "Ошибка загрузки статистики";
                if (alive) setError(msg);
            } finally {
                if (alive) setLoadingData(false);
            }
        };

        load();
        return () => {
            alive = false;
        };
    }, [selectedCourseId]);

    const courseTitle = useMemo(() => {
        const c = myCourses.find((x) => String(x.id) === String(selectedCourseId));
        return c?.courseTitle || stats?.courseTitle || "";
    }, [myCourses, selectedCourseId, stats]);

    if (loadingInit) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="lg">

            <Box sx={{mb: 2}}>
                <Button variant="text" onClick={() => navigate(-1)}>
                    ← Назад
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                Статистика
            </Typography>

            <Box sx={{maxWidth: 520, mb: 2}}>
                <TextField
                    select
                    label="Выберите курс"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    fullWidth
                >
                    {myCourses.map((c) => (
                        <MenuItem key={c.id} value={String(c.id)}>
                            {c.courseTitle} (#{c.id})
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {loadingData ? (
                <CircularProgress/>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            {courseTitle}
                        </Typography>

                        <Typography color="text.secondary">
                            Всего учеников: {stats?.statistic?.totalMenteeCount ?? "—"}
                        </Typography>

                        {/* moduleDistribution: { moduleId: count } */}
                        <Box sx={{mt: 1}}>
                            <Typography variant="subtitle2">Распределение по модулям:</Typography>
                            <Box sx={{color: "text.secondary", mt: 0.5}}>
                                {stats?.statistic?.moduleDistribution
                                    ? Object.entries(stats.statistic.moduleDistribution).map(([k, v]) => (
                                        <div key={k}>
                                            Модуль {k}: {v}
                                        </div>
                                    ))
                                    : "—"}
                            </Box>
                        </Box>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Ученики
                        </Typography>

                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Имя</TableCell>
                                    <TableCell>Фамилия</TableCell>
                                    <TableCell>Текущий модуль</TableCell>
                                    <TableCell>Telegram</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users?.length ? (
                                    users.map((u) => (
                                        <TableRow key={u.userId}>
                                            <TableCell>{u.userId}</TableCell>
                                            <TableCell>{u.firstName}</TableCell>
                                            <TableCell>{u.lastName}</TableCell>
                                            <TableCell>{u.currentModuleId ?? "—"}</TableCell>
                                            <TableCell>{u.tgNickname ?? "—"}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{color: "text.secondary"}}>
                                            Нет данных
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </>
            )}
        </Container>
    );
};

export default MentorStatsPage;
