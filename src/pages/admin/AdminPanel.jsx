import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    MenuItem,
    Paper,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {adminApi} from "../../api/adminApi";

const getMessage = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

const AdminPanel = () => {
    const [tab, setTab] = useState(0);

    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [slots, setSlots] = useState([]);
    const [me, setMe] = useState(null);
    const [userById, setUserById] = useState(null);
    const [courseById, setCourseById] = useState(null);
    const [moduleById, setModuleById] = useState(null);

    const [courseIdInput, setCourseIdInput] = useState("");
    const [moduleIdInput, setModuleIdInput] = useState("");
    const [userIdInput, setUserIdInput] = useState("");

    const [pageSize, setPageSize] = useState(20);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const loadCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getCourses({pageNumber: 0, pageSize});
            setCourses(data);
        } catch (err) {
            setError(getMessage(err, "Не удалось загрузить курсы"));
        } finally {
            setLoading(false);
        }
    };

    const loadModules = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getModules({pageNumber: 0, pageSize});
            setModules(data);
        } catch (err) {
            setError(getMessage(err, "Не удалось загрузить модули"));
        } finally {
            setLoading(false);
        }
    };

    const loadSlots = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getSlots({pageNumber: 0, pageSize});
            setSlots(data);
        } catch (err) {
            setError(getMessage(err, "Не удалось загрузить слоты"));
        } finally {
            setLoading(false);
        }
    };

    const loadMe = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getMe();
            setMe(data);
        } catch (err) {
            setError(getMessage(err, "Не удалось загрузить профиль админа"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 0) loadCourses();
        if (tab === 1) loadModules();
        if (tab === 2) loadSlots();
        if (tab === 3) loadMe();
    }, [tab, pageSize]);

    const handleFindCourse = async () => {
        const cid = Number(courseIdInput);
        if (!cid) return setError("Введите корректный ID курса");
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getCourseById(cid);
            setCourseById(data);
            setSuccess("Курс найден");
        } catch (err) {
            setError(getMessage(err, "Курс не найден"));
            setCourseById(null);
        } finally {
            setLoading(false);
        }
    };

    const handleFindModule = async () => {
        const mid = Number(moduleIdInput);
        if (!mid) return setError("Введите корректный ID модуля");
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getModuleById(mid);
            setModuleById(data);
            setSuccess("Модуль найден");
        } catch (err) {
            setError(getMessage(err, "Модуль не найден"));
            setModuleById(null);
        } finally {
            setLoading(false);
        }
    };

    const handleFindUser = async () => {
        const uid = Number(userIdInput);
        if (!uid) return setError("Введите корректный ID пользователя");
        setLoading(true);
        setError(null);
        try {
            const data = await adminApi.getUserById(uid);
            setUserById(data);
            setSuccess("Пользователь найден");
        } catch (err) {
            setError(getMessage(err, "Пользователь не найден"));
            setUserById(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Админ-панель
            </Typography>

            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 2}}>
                <TextField
                    select
                    size="small"
                    label="Размер страницы"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    sx={{width: 180}}
                >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </TextField>
            </Box>

            <Box sx={{borderBottom: 1, borderColor: "divider", mb: 2}}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label="Курсы"/>
                    <Tab label="Модули"/>
                    <Tab label="Слоты"/>
                    <Tab label="Пользователи"/>
                </Tabs>
            </Box>

            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{mb: 2}} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {loading && <CircularProgress sx={{mb: 2}}/>}

            {tab === 0 && (
                <Paper elevation={0} sx={{p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3}}>
                    <Typography variant="h6" gutterBottom>
                        Курсы
                    </Typography>

                    <Box sx={{display: "flex", gap: 1, mb: 2, flexWrap: "wrap"}}>
                        <Button variant="outlined" onClick={loadCourses}>Обновить</Button>
                        <TextField
                            size="small"
                            label="ID курса"
                            value={courseIdInput}
                            onChange={(e) => setCourseIdInput(e.target.value)}
                            inputMode="numeric"
                        />
                        <Button variant="contained" onClick={handleFindCourse}>Найти по ID</Button>
                    </Box>

                    {courseById && (
                        <Box sx={{mb: 2, p: 1.5, border: "1px dashed", borderColor: "divider", borderRadius: 2}}>
                            <Typography variant="subtitle2">Результат поиска:</Typography>
                            <Typography variant="body2">#{courseById.id} {courseById.courseTitle}</Typography>
                        </Box>
                    )}

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Автор</TableCell>
                                <TableCell>Активен</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.length ? courses.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.id}</TableCell>
                                    <TableCell>{c.courseTitle}</TableCell>
                                    <TableCell>{c.author?.username || c.author?.id || "—"}</TableCell>
                                    <TableCell>{c.isActive ? "Да" : "Нет"}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{color: "text.secondary"}}>
                                        Данных нет
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            {tab === 1 && (
                <Paper elevation={0} sx={{p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3}}>
                    <Typography variant="h6" gutterBottom>
                        Модули
                    </Typography>

                    <Box sx={{display: "flex", gap: 1, mb: 2, flexWrap: "wrap"}}>
                        <Button variant="outlined" onClick={loadModules}>Обновить</Button>
                        <TextField
                            size="small"
                            label="ID модуля"
                            value={moduleIdInput}
                            onChange={(e) => setModuleIdInput(e.target.value)}
                            inputMode="numeric"
                        />
                        <Button variant="contained" onClick={handleFindModule}>Найти по ID</Button>
                    </Box>

                    {moduleById && (
                        <Box sx={{mb: 2, p: 1.5, border: "1px dashed", borderColor: "divider", borderRadius: 2}}>
                            <Typography variant="subtitle2">Результат поиска:</Typography>
                            <Typography variant="body2">
                                #{moduleById.id} {moduleById.moduleTitle} (#{moduleById.moduleOrderNumber ?? "—"})
                            </Typography>
                        </Box>
                    )}

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Порядок</TableCell>
                                <TableCell>Активен</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {modules.length ? modules.map((m) => (
                                <TableRow key={m.id}>
                                    <TableCell>{m.id}</TableCell>
                                    <TableCell>{m.moduleTitle}</TableCell>
                                    <TableCell>{m.moduleOrderNumber ?? "—"}</TableCell>
                                    <TableCell>{m.isActive ? "Да" : "Нет"}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} sx={{color: "text.secondary"}}>
                                        Данных нет
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            {tab === 2 && (
                <Paper elevation={0} sx={{p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3}}>
                    <Typography variant="h6" gutterBottom>
                        Слоты
                    </Typography>

                    <Box sx={{display: "flex", gap: 1, mb: 2}}>
                        <Button variant="outlined" onClick={loadSlots}>Обновить</Button>
                    </Box>

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Mentor ID</TableCell>
                                <TableCell>Начало</TableCell>
                                <TableCell>Конец</TableCell>
                                <TableCell>Участников</TableCell>
                                <TableCell>Активен</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {slots.length ? slots.map((s) => (
                                <TableRow key={s.id || s.requestId}>
                                    <TableCell>{s.id}</TableCell>
                                    <TableCell>{s.mentorId ?? "—"}</TableCell>
                                    <TableCell>{s.startTime ? new Date(s.startTime).toLocaleString("ru-RU") : "—"}</TableCell>
                                    <TableCell>{s.endTime ? new Date(s.endTime).toLocaleString("ru-RU") : "—"}</TableCell>
                                    <TableCell>{s.participants?.length || 0} / {s.maxParticipants ?? "—"}</TableCell>
                                    <TableCell>{s.isActive ? "Да" : "Нет"}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{color: "text.secondary"}}>
                                        Данных нет
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            {tab === 3 && (
                <Paper elevation={0} sx={{p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3}}>
                    <Typography variant="h6" gutterBottom>
                        Пользователи
                    </Typography>

                    <Box sx={{display: "flex", gap: 1, mb: 2, flexWrap: "wrap"}}>
                        <Button variant="outlined" onClick={loadMe}>Обновить мой профиль</Button>
                        <TextField
                            size="small"
                            label="ID пользователя"
                            value={userIdInput}
                            onChange={(e) => setUserIdInput(e.target.value)}
                            inputMode="numeric"
                        />
                        <Button variant="contained" onClick={handleFindUser}>Найти по ID</Button>
                    </Box>

                    <Box sx={{mb: 2}}>
                        <Typography variant="subtitle2">Мой профиль:</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {me
                                ? `${me.id || "—"} | ${me.username || "—"} | ${me.role || "—"}`
                                : "Нет данных"}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2">Пользователь по ID:</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {userById
                                ? `${userById.id || "—"} | ${userById.username || "—"} | ${userById.role || "—"}`
                                : "Нет данных"}
                        </Typography>
                    </Box>
                </Paper>
            )}
        </Container>
    );
};

export default AdminPanel;
