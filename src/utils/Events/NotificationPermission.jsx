
import { memo, useEffect, useState } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    Typography,
    Button,
    IconButton,
    Stack,
} from "@mui/material";

import {
    NotificationsActiveRounded,
    VolumeUpRounded,
    CloseRounded,
    CheckCircleRounded,
    DesktopWindowsRounded,
} from "@mui/icons-material";

import { enableNotificationSound } from "./notificationSound";

const NotificationPermission = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!("Notification" in window)) return;

        const checkPermission = () => {
            if (Notification.permission === "granted") {
                setOpen(false);
                localStorage.setItem(
                    "browserNotificationEnabled",
                    "true"
                );
                return;
            }

            if (Notification.permission === "denied") {
                setOpen(false);
                return;
            }

            // Don't show again automatically on every CRM opening
            const alreadyAsked = localStorage.getItem(
                "notificationPermissionAsked"
            );

            if (!alreadyAsked) {
                setOpen(true);
            }
        };

        // Initial check when CRM opens
        checkPermission();

        // Reopen when a new notification arrives
        const handleNewNotification = () => {
            if (Notification.permission === "default") {
                setOpen(true);
            }
        };

        window.addEventListener(
            "CRM_NEW_NOTIFICATION",
            handleNewNotification
        );

        return () => {
            window.removeEventListener(
                "CRM_NEW_NOTIFICATION",
                handleNewNotification
            );
        };
    }, []);

    const handleAllow = async () => {
        if (loading) return;

        setLoading(true);

        try {
            // Request browser permission directly from the button click
            const permissionPromise =
                Notification.requestPermission();

            // Enable notification sound
            await enableNotificationSound();

            const permission = await permissionPromise;

            localStorage.setItem(
                "notificationPermissionAsked",
                "true"
            );

            if (permission === "granted") {
                localStorage.setItem(
                    "browserNotificationEnabled",
                    "true"
                );
            } else {
                localStorage.removeItem(
                    "browserNotificationEnabled"
                );
            }

            setOpen(false);
        } catch (error) {
            console.error(
                "Notification permission error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleNotNow = () => {
        localStorage.setItem(
            "notificationPermissionAsked",
            "true"
        );

        setOpen(false);
    };
    if (!("Notification" in window)) return null;

    return (
        <Dialog
            open={open}
            onClose={handleNotNow}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "22px",
                    p: 1,
                    maxWidth: 390,
                    boxShadow: "0 24px 70px rgba(0,0,0,0.18)",
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: "rgba(15, 23, 42, 0.45)",
                    backdropFilter: "blur(4px)",
                },
            }}
        >
            <DialogContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="flex-end">
                    <IconButton
                        size="small"
                        onClick={handleNotNow}
                        disabled={loading}
                        sx={{ bgcolor: "action.hover" }}
                    >
                        <CloseRounded fontSize="small" />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        width: 68,
                        height: 68,
                        borderRadius: "20px",
                        mx: "auto",
                        mb: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "linear-gradient(135deg, #e0f2fe, #dbeafe)",
                        color: "#2563eb",
                    }}
                >
                    <NotificationsActiveRounded sx={{ fontSize: 35 }} />
                </Box>

                <Typography
                    textAlign="center"
                    fontSize={21}
                    fontWeight={750}
                    mb={1}
                >
                    Never Miss an Update
                </Typography>

                <Typography
                    textAlign="center"
                    color="text.secondary"
                    fontSize={13.5}
                    lineHeight={1.7}
                    mb={3}
                >
                    Get instant updates about new leads,
                    assignments and important CRM activities,
                    even when you're working in another application.
                </Typography>

                <Stack spacing={1.7} mb={3}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <DesktopWindowsRounded
                            sx={{ color: "#2563eb", fontSize: 21 }}
                        />
                        <Box>
                            <Typography fontSize={13} fontWeight={700}>
                                Desktop Notifications
                            </Typography>
                            <Typography fontSize={11.5} color="text.secondary">
                                Popups outside Chrome on your desktop
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <VolumeUpRounded
                            sx={{ color: "#16a34a", fontSize: 21 }}
                        />
                        <Box>
                            <Typography fontSize={13} fontWeight={700}>
                                Sound Alerts
                            </Typography>
                            <Typography fontSize={11.5} color="text.secondary">
                                Hear an alert whenever a notification arrives
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <CheckCircleRounded
                            sx={{ color: "#16a34a", fontSize: 21 }}
                        />
                        <Box>
                            <Typography fontSize={13} fontWeight={700}>
                                Instant CRM Updates
                            </Typography>
                            <Typography fontSize={11.5} color="text.secondary">
                                Stay informed about leads and assignments
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>

                <Stack spacing={1.2}>
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        onClick={handleAllow}
                        sx={{
                            py: 1.35,
                            borderRadius: "12px",
                            textTransform: "none",
                            fontSize: 14,
                            fontWeight: 700,
                            background:
                                "linear-gradient(100deg, #2563eb, #0d9488)",
                            boxShadow: "none",
                            "&:hover": {
                                background:
                                    "linear-gradient(100deg, #1d4ed8, #0f766e)",
                                boxShadow: "none",
                            },
                        }}
                    >
                        {loading
                            ? "Enabling..."
                            : "Enable Desktop Notifications"}
                    </Button>

                    <Button
                        fullWidth
                        disabled={loading}
                        onClick={handleNotNow}
                        sx={{
                            py: 1,
                            borderRadius: "12px",
                            textTransform: "none",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "text.secondary",
                        }}
                    >
                        Maybe Later
                    </Button>
                </Stack>

                <Typography
                    textAlign="center"
                    color="text.disabled"
                    fontSize={10.5}
                    mt={2}
                >
                    You can change your notification preferences anytime.
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default memo(NotificationPermission);
