import React, { useRef, useState } from "react";
import {
    Box,
    Button,
    Fade,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import Popper from "@mui/material/Popper";

const CLOSE_DELAY_MS = 75;

const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("ru-RU");
};

const isDomNode = (value) =>
    value && typeof value === "object" && value.nodeType != null;

const UserSlotHoverPopover = ({
                                  slot,
                                  children,
                                  onBook,
                                  onCancelBooking,
                                  actionLoading,
                              }) => {
    const anchorRef = useRef(null);
    const popperRef = useRef(null);
    const closeTimerRef = useRef(null);

    const [open, setOpen] = useState(false);

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
        }, CLOSE_DELAY_MS);
    };

    const handleAnchorEnter = () => {
        clearCloseTimer();
        setOpen(true);
    };

    const handleAnchorLeave = (e) => {
        const next = e.relatedTarget;
        if (isDomNode(next) && popperRef.current?.contains(next)) return;
        scheduleClose();
    };

    const handlePopperEnter = () => {
        clearCloseTimer();
        setOpen(true);
    };

    const handlePopperLeave = (e) => {
        const next = e.relatedTarget;
        if (isDomNode(next) && anchorRef.current?.contains(next)) return;
        scheduleClose();
    };

    const disabledBook = Boolean(actionLoading) || slot?.slotFull || slot?.isActive === false;

    return (
        <>
            <Box
                ref={anchorRef}
                onMouseEnter={handleAnchorEnter}
                onMouseLeave={handleAnchorLeave}
                sx={{ width: "100%", height: "100%" }}
            >
                {children}
            </Box>

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
                disablePortal={false}
                sx={{ zIndex: 3000 }}
                modifiers={[
                    { name: "offset", options: { offset: [0, 12] } },
                    { name: "preventOverflow", options: { padding: 12 } },
                    { name: "flip", options: { fallbackPlacements: ["top-start", "right-start", "left-start"] } },
                ]}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={150}>
                        <Paper
                            ref={popperRef}
                            onMouseEnter={handlePopperEnter}
                            onMouseLeave={handlePopperLeave}
                            elevation={8}
                            sx={{
                                width: 360,
                                maxWidth: "calc(100vw - 32px)",
                                p: 2,
                                borderRadius: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "background.paper",
                                boxShadow: 8,
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                {slot?.slotMeetingType || "Встреча"}
                            </Typography>

                            <Stack spacing={0.75}>
                                <Typography variant="body2" color="text.secondary">
                                    <b>Тип слота:</b> {slot?.slotType || "—"}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    <b>Начало:</b> {formatDateTime(slot?.startTime)}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    <b>Окончание:</b> {formatDateTime(slot?.endTime)}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    <b>Статус:</b>{" "}
                                    {slot?.slotFull
                                        ? "Заполнен"
                                        : slot?.isActive === false
                                            ? "Неактивен"
                                            : "Доступен"}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    <b>Макс. участников:</b> {slot?.maxParticipants ?? "—"}
                                </Typography>

                                {slot?.description && (
                                    <Box sx={{ pt: 0.5 }}>
                                        <Typography variant="subtitle2">Описание</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {slot.description}
                                        </Typography>
                                    </Box>
                                )}

                                {slot?.meetingLink && (
                                    <Box sx={{ pt: 0.5 }}>
                                        <Typography variant="subtitle2">Ссылка</Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ wordBreak: "break-word" }}
                                        >
                                            {slot.meetingLink}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>

                            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    disabled={disabledBook}
                                    onClick={() => onBook?.(slot?.id)}
                                >
                                    {actionLoading ? "Обработка..." : "Записаться"}
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    disabled={Boolean(actionLoading)}
                                    onClick={() => onCancelBooking?.(slot?.id)}
                                >
                                    {actionLoading ? "Обработка..." : "Отменить бронь"}
                                </Button>
                            </Stack>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </>
    );
};

export default UserSlotHoverPopover;