
import React, { memo } from "react";
import { Badge, Box, Typography, useTheme } from "@mui/material";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import Groups3Icon from "@mui/icons-material/Groups3";

const STATUS_CONFIG = {
    NEW: { color: "#2563EB", icon: <AutorenewIcon fontSize="small" /> },
    CALLBACK: { color: "#ffa200", icon: <PhoneCallbackIcon fontSize="small" /> },
    QUOTE: { color: "#5309ff", icon: <RequestQuoteIcon fontSize="small" /> },
    APPOINTMENT: { color: "#0b7d87", icon: <Groups3Icon fontSize="small" /> },
    SOLD: { color: "#10B981", icon: <CheckCircleIcon fontSize="small" /> },
    LOST: { color: "#ff0a0a", icon: <CancelIcon fontSize="small" /> },
    PENDING: { color: "#454545", icon: <ScheduleIcon fontSize="small" /> },
    REMINDER: { color: "#1e7209", icon: <NotificationsActiveIcon fontSize="small" /> },
    RENEWAL: { color: "#67084a", icon: <ManageHistoryIcon fontSize="small" /> },
};

const StatusFilterCard = ({
    title,
    count = 0,
    active = false,
    onClick,
}) => {
    const config = STATUS_CONFIG[title] || STATUS_CONFIG.NEW;
    const displayTitle = title === "SOLD" ? "CAPTURED" : title;

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            onClick={onClick}
            sx={{
                cursor: "pointer",
                userSelect: "none",
                minWidth: 100,
                px: 2,
                py: 0.5,
                borderRadius: 2,

                border: active
                    ? `2px solid ${config.color}`
                    : `1px solid ${isDark
                        ? "rgba(255,255,255,0.10)"
                        : "rgba(255,255,255,0.9)"}`,

                bgcolor: active
                    ? `${config.color}15`
                    : isDark
                        ? "rgba(30,41,59,0.78)"
                        : "rgba(255,255,255,0.82)",

                backgroundImage: isDark
                    ? `linear-gradient(145deg,
                        rgba(255,255,255,0.075) 0%,
                        rgba(255,255,255,0.015) 45%,
                        rgba(0,0,0,0.08) 100%)`
                    : `linear-gradient(145deg,
                        rgb(226,242,232) 0%,
                        rgba(236, 247, 216, 0.55) 48%,
                        rgba(218, 255, 232, 0.28) 100%)`,

                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",

                boxShadow: active
                    ? `0 3px 12px ${config.color}22,
                       inset 0 1px 0 rgba(255,255,255,0.65),
                       inset 0 -1px 0 rgba(0,0,0,0.04)`
                    : isDark
                        ? `0 3px 10px rgba(0,0,0,0.20),
                           inset 0 1px 0 rgba(255,255,255,0.09),
                           inset 0 -1px 0 rgba(0,0,0,0.12)`
                        : `0 3px 10px rgba(15,23,42,0.055),
                           inset 0 1px 0 rgba(255,255,255,1),
                           inset 0 -1px 0 rgba(15,23,42,0.035)`,

                transition: ".25s",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,

                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: active
                        ? `0 8px 20px ${config.color}30,
                           inset 0 1px 0 rgba(255,255,255,0.7)`
                        : `0 8px 20px rgba(0,0,0,${isDark ? "0.28" : "0.10"}),
                           inset 0 1px 0 rgba(255,255,255,0.85)`,
                },
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={1}
            >
                <Typography
                    sx={{
                        fontWeight: 800,
                        fontSize: {
                            xs: 9,
                            sm: 12,
                        },
                        color: isDark ? "#f8fafc" : "#0f172a",
                        textTransform: "uppercase",
                        lineHeight: 1.2,
                    }}
                >
                    {displayTitle}
                </Typography>

                <Badge
                    badgeContent={count}
                    max={999}
                    overlap="circular"
                    sx={{
                        "& .MuiBadge-badge": {
                            bgcolor: config.color,
                            color: "#fff",
                            fontWeight: 700,
                            minWidth: 18,
                            height: 18,
                            fontSize: 10,
                            boxShadow: `0 2px 6px ${config.color}55`,
                            border: "1px solid rgba(255,255,255,0.35)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: `${config.color}20`,
                            backgroundImage: `linear-gradient(145deg,
                                ${config.color}30,
                                ${config.color}10)`,
                            color: config.color,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            boxShadow: `
                                inset 0 1px 2px rgba(255,255,255,0.55),
                                0 2px 5px ${config.color}18
                            `,
                        }}
                    >
                        {config.icon}
                    </Box>
                </Badge>
            </Box>
        </Box>
    );
};

export default memo(StatusFilterCard);
