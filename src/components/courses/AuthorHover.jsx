import React, {useMemo, useRef, useState} from "react";
import {Box, CircularProgress, Fade, Paper, Typography} from "@mui/material";
import Popper from "@mui/material/Popper";
import {userApi} from "../../api/userApi";
import AuthorPopoverCard from "./AuthorPopoverCard";

const CLOSE_DELAY_MS = 350;

const isNode = (v) => v && typeof v === "object" && v.nodeType != null; // безопаснее чем instanceof Node

const AuthorHover = ({author}) => {
    const authorId = author?.id;

    const anchorRef = useRef(null);
    const popperRef = useRef(null);
    const closeTimerRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [cache, setCache] = useState({});
    const [activeId, setActiveId] = useState(null);

    const active = useMemo(() => {
        if (!activeId) return null;
        return cache[activeId] || null;
    }, [activeId, cache]);

    const displayName =
        author?.firstName || author?.lastName
            ? `${author.firstName || ""} ${author.lastName || ""}`.trim()
            : author?.username || "Пользователь";

    const clearCloseTimer = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };

    const scheduleClose = () => {
        clearCloseTimer();
        closeTimerRef.current = setTimeout(() => {
            setOpen(false);
            setActiveId(null);
        }, CLOSE_DELAY_MS);
    };

    const ensureProfileLoaded = async (id) => {
        if (!id) return;
        if (cache[id]?.data || cache[id]?.loading) return;

        setCache((prev) => ({
            ...prev,
            [id]: {data: null, loading: true, error: null},
        }));

        try {
            const data = await userApi.getById(id);
            setCache((prev) => ({
                ...prev,
                [id]: {data, loading: false, error: null},
            }));
        } catch (err) {
            const msg =
                err?.response?.data?.message || err?.message || "Не удалось загрузить автора";
            setCache((prev) => ({
                ...prev,
                [id]: {data: null, loading: false, error: msg},
            }));
        }
    };

    const handleAnchorEnter = async () => {
        if (!authorId) return;
        clearCloseTimer();
        setActiveId(authorId);
        setOpen(true);
        await ensureProfileLoaded(authorId);
    };

    const handleAnchorLeave = (e) => {
        const next = e.relatedTarget;

        // если уходим в попап — не закрываем
        if (isNode(next) && popperRef.current && popperRef.current.contains(next)) return;

        scheduleClose();
    };

    const handlePopperEnter = () => {
        clearCloseTimer();
        setOpen(true);
    };

    const handlePopperLeave = (e) => {
        const next = e.relatedTarget;

        // если уходим обратно на имя — не закрываем
        if (isNode(next) && anchorRef.current && anchorRef.current.contains(next)) return;

        scheduleClose();
    };

    return (
        <>
            <Box
                ref={anchorRef}
                component="span"
                onMouseEnter={handleAnchorEnter}
                onMouseLeave={handleAnchorLeave}
                sx={{display: "inline-flex"}}
            >
                <Typography
                    component="span"
                    variant="caption"
                    sx={{
                        cursor: authorId ? "pointer" : "default",
                        textDecoration: authorId ? "underline" : "none",
                        textDecorationStyle: authorId ? "dotted" : "solid",
                        textUnderlineOffset: "3px",
                        "&:hover": authorId ? {color: "primary.main"} : undefined,
                    }}
                >
                    {displayName}
                </Typography>
            </Box>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
                disablePortal={false}
                sx={{zIndex: 3000}}
                modifiers={[
                    {name: "offset", options: {offset: [0, 10]}},
                    {name: "preventOverflow", options: {padding: 8}},
                ]}
            >
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={120}>
                        <Paper
                            ref={popperRef}
                            onMouseEnter={handlePopperEnter}
                            onMouseLeave={handlePopperLeave}
                            elevation={8}
                            sx={{
                                pointerEvents: "auto",
                                p: 2,
                                width: 320,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "background.paper",
                                boxShadow: 6,
                                userSelect: "text", // чтобы комфортно копировать
                            }}
                        >
                            {activeId && (active?.loading || !active) ? (
                                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                    <CircularProgress size={18}/>
                                    <Typography variant="body2">Загружаю профиль…</Typography>
                                </Box>
                            ) : active?.error ? (
                                <Typography variant="body2" color="error">
                                    {active.error}
                                </Typography>
                            ) : (
                                <AuthorPopoverCard user={active?.data} fallbackName={displayName}/>
                            )}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </>
    );
};

export default AuthorHover;
