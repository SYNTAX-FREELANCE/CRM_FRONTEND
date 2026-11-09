
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    LinearProgress
} from "@mui/joy";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const DISPLAY_DURATION = 8000;

const RateLimitNotification = () => {
    const [notification, setNotification] = useState(null);
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const handleRateLimit = (event) => {
            setNotification({
                message:
                    event.detail?.message ||
                    "Your request limit has been reached. Please wait before making more requests."
            });

            setProgress(100);
            setVisible(true);
        };

        window.addEventListener("api-rate-limit", handleRateLimit);

        return () => {
            window.removeEventListener("api-rate-limit", handleRateLimit);
        };
    }, []);

    useEffect(() => {
        if (!visible) return;

        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(
                0,
                100 - (elapsed / DISPLAY_DURATION) * 100
            );

            setProgress(remaining);

            if (remaining <= 0) {
                setVisible(false);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [visible, notification]);

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <Box
            sx={{
                position: "fixed",
                top: visible ? 24 : -180,
                right: 24,
                zIndex: 99999,
                width: "min(400px, calc(100vw - 32px))",
                transition: "top 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                pointerEvents: visible ? "auto" : "none",
            }}
        >
            <Box
                sx={{
                    bgcolor: "#FFFEF7",
                    border: "1px solid #F5C451",
                    borderLeft: "5px solid #D97706",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 10px 35px rgba(120, 75, 0, 0.16)",
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                        }}
                    >
                        {/* Warning Icon */}
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                minWidth: 44,
                                borderRadius: "10px",
                                bgcolor: "#FEF3C7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid #FDE68A",
                            }}
                        >
                            <WarningAmberRoundedIcon
                                sx={{
                                    fontSize: 28,
                                    color: "#B45309",
                                }}
                            />
                        </Box>

                        {/* Message */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: 15,
                                    fontWeight: 800,
                                    color: "#92400E",
                                    lineHeight: 1.4,
                                }}
                            >
                                Too Many Requests!
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 12.5,
                                    color: "#78350F",
                                    mt: 0.6,
                                    lineHeight: 1.6,
                                }}
                            >
                                {notification?.message}
                            </Typography>

                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.7,
                                    mt: 1.2,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: "5px",
                                    bgcolor: "#FEF3C7",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        bgcolor: "#D97706",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 9.5,
                                        fontWeight: 800,
                                        color: "#92400E",
                                        letterSpacing: 0.6,
                                    }}
                                >
                                    HTTP 429 · RATE LIMIT EXCEEDED
                                </Typography>
                            </Box>
                        </Box>

                        {/* Close */}
                        <IconButton
                            size="sm"
                            variant="plain"
                            onClick={handleClose}
                            sx={{
                                color: "#92400E",
                                borderRadius: "7px",
                                "&:hover": {
                                    bgcolor: "#FEF3C7",
                                },
                            }}
                        >
                            <CloseRoundedIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Countdown Progress */}
                <LinearProgress
                    determinate
                    value={progress}
                    sx={{
                        height: 4,
                        borderRadius: 0,
                        bgcolor: "#FDECC8",
                        "--LinearProgress-progressColor": "#D97706",
                    }}
                />
            </Box>
        </Box>
    );
};

export default RateLimitNotification