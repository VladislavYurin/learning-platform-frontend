import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
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
    TextField,
    Typography,
} from "@mui/material";
import {moduleApi} from "../../api/moduleApi";
import HtmlEditor from "../../components/editor/HtmlEditor"; // поправь путь под свой
import {accessApi} from "../../api/accessApi";

const MentorModuleEditorPage = () => {
    const {courseId, moduleId} = useParams();
    const navigate = useNavigate();

    const [module, setModule] = useState(null);
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // dialogs
    const [dlg, setDlg] = useState({open: false, mode: null}); // mode: giveCourse|revokeCourse|giveModule|revokeModule
    const [userId, setUserId] = useState("");

    useEffect(() => {
        let alive = true;

        const fetchModule = async () => {
            try {
                const data = await moduleApi.getById(courseId, moduleId);
                if (!alive) return;
                setModule(data);
                setContent(data?.moduleContent || "");
            } catch (err) {
                const msg =
                    err?.response?.data?.message || err?.message || "Не удалось загрузить модуль";
                if (alive) setError(msg);
            } finally {
                if (alive) setLoading(false);
            }
        };

        fetchModule();
        return () => {
            alive = false;
        };
    }, [courseId, moduleId]);

    const handleSaveStub = async () => {
        // пока нет update endpoint — делаем заглушку
        setSaving(true);
        try {
            await new Promise((r) => setTimeout(r, 400));
            alert("Сохранение пока заглушка: в API нет endpoint для обновления модуля (PUT/PATCH).");
        } finally {
            setSaving(false);
        }
    };

    const openDlg = (mode) => {
        setUserId("");
        setDlg({open: true, mode});
    };

    const closeDlg = () => setDlg({open: false, mode: null});

    const submitAccess = async () => {
        const uid = Number(userId);
        if (!uid) return alert("Введите userId числом");

        try {
            if (dlg.mode === "giveCourse") {
                await accessApi.giveCourse({userId: uid, courseId: Number(courseId)});
            } else if (dlg.mode === "revokeCourse") {
                await accessApi.revokeCourse({userId: uid, courseId: Number(courseId)});
            } else if (dlg.mode === "giveModule") {
                await accessApi.giveModule({
                    userId: uid,
                    courseId: Number(courseId),
                    moduleId: Number(moduleId),
                });
            } else if (dlg.mode === "revokeModule") {
                await accessApi.revokeModule({
                    userId: uid,
                    courseId: Number(courseId),
                    moduleId: Number(moduleId),
                });
            }
            alert("Готово (если сервер вернул OK).");
            closeDlg();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Ошибка";
            alert(msg);
        }
    };

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="lg">
            <Box sx={{mb: 2, display: "flex", gap: 1, flexWrap: "wrap"}}>
                <Button variant="text" onClick={() => navigate(-1)}>
                    ← Назад
                </Button>

                <Button variant="contained" disabled={saving} onClick={handleSaveStub}>
                    {saving ? "Сохранение..." : "Сохранить"}
                </Button>

                <Button variant="outlined" onClick={() => openDlg("giveCourse")}>
                    Выдать доступ к курсу (заглушка)
                </Button>
                <Button variant="outlined" onClick={() => openDlg("revokeCourse")}>
                    Отозвать доступ к курсу (заглушка)
                </Button>

                <Button variant="outlined" onClick={() => openDlg("giveModule")}>
                    Выдать доступ к модулю (заглушка)
                </Button>
                <Button variant="outlined" onClick={() => openDlg("revokeModule")}>
                    Отозвать доступ к модулю (заглушка)
                </Button>
            </Box>

            <Typography variant="h4" gutterBottom>
                Редактирование: {module?.moduleTitle}
            </Typography>

            <HtmlEditor value={content} onChange={setContent}/>

            <Dialog open={dlg.open} onClose={closeDlg} fullWidth maxWidth="xs">
                <DialogTitle>Управление доступом</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{mb: 1}} color="text.secondary">
                        Пока вводим userId вручную. Позже заменим на поиск пользователей.
                    </Typography>
                    <TextField
                        label="User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        fullWidth
                        inputMode="numeric"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDlg}>Отмена</Button>
                    <Button variant="contained" onClick={submitAccess}>
                        Выполнить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MentorModuleEditorPage;