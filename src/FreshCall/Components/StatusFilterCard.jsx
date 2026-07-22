import React, { memo } from "react";
import { Badge, Box, Typography } from "@mui/material";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import Groups3Icon from '@mui/icons-material/Groups3';

const STATUS_CONFIG = {
    NEW: {
        color: "#2563EB",
        icon: <AutorenewIcon fontSize="small" />,
    },
    CALLBACK: {
        color: "#ffa200",
        icon: <PhoneCallbackIcon fontSize="small" />,
    },
    QUOTE: {
        color: "#5309ff",
        icon: <RequestQuoteIcon fontSize="small" />,
    },
    APPOINTMENT: {
        color: "#0b7d87",
        icon: <Groups3Icon fontSize="small" />,
    },
    SOLD: {
        color: "#10B981",
        icon: <CheckCircleIcon fontSize="small" />,
    },
    LOST: {
        color: "#ff0a0a",
        icon: <CancelIcon fontSize="small" />,
    },
    PENDING: {
        color: "#454545",
        icon: <ScheduleIcon fontSize="small" />,
    },
    REMINDER: {
        color: "#1e7209",
        icon: <NotificationsActiveIcon fontSize="small" />,
    },
    RENEWAL: {
        color: "#67084a",
        icon: <ManageHistoryIcon fontSize="small" />,
    }
};

const StatusFilterCard = ({
    title,
    count = 0,
    active = false,
    onClick,
}) => {
    const config = STATUS_CONFIG[title] || STATUS_CONFIG.NEW;
    const displayTitle = title === "SOLD" ? "CAPTURED" : title;
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
                    : "1px solid #E5E7EB",

                bgcolor: active ? `${config.color}15` : "#fff",

                transition: ".25s",

                display: "flex",
                alignItems: 'center',
                justifyContent: 'center',
                // flexDirection: "column",
                gap: 1,

                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 22px rgba(0,0,0,.08)",
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
                        color: "#292a2b",
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
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: `${config.color}20`,
                            color: config.color,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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