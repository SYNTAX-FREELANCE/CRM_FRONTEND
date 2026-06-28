import React from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    alpha,
} from "@mui/material";

import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FiberNewIcon from "@mui/icons-material/FiberNew";

const statusConfig = {
    CALLBACK: {
        icon: <PhoneCallbackIcon />,
        color: "#f97316",
        desc: "Schedule another call",
    },
    QUOTE: {
        icon: <RequestQuoteIcon />,
        color: "#2563eb",
        desc: "Prepare quotation",
    },
    APPOINTMENT: {
        icon: <EventAvailableIcon />,
        color: "#7c3aed",
        desc: "Book customer visit",
    },
    SOLD: {
        icon: <CheckCircleIcon />,
        color: "#16a34a",
        desc: "Policy renewed",
    },
    LOST: {
        icon: <CancelIcon />,
        color: "#ef4444",
        desc: "Lead closed",
    },
    NEW: {
        icon: <FiberNewIcon />,
        color: "#0891b2",
        desc: "Fresh Lead",
    },
};

const StatusActionCards = ({
    statuses = [],
    selectedStatus = {},
    onStatusClick,
    onReset,
    title = "Choose Next Action",
}) => {
    const displayStatuses = selectedStatus
        ? statuses.filter((s) => s.status_id === selectedStatus?.status_id)
        : statuses;

    return (
        <Stack spacing={2.5}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography
                    sx={{
                        fontWeight: 900,
                        fontSize: 18,
                        color: "#0f172a",
                    }}
                >
                    {title}
                </Typography>

                {selectedStatus && (
                    <Button
                        onClick={onReset}
                        size="small"
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 3,
                        }}
                    >
                        Change Status
                    </Button>
                )}
            </Stack>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: selectedStatus ? "1fr" : "repeat(2,1fr)",
                        md: selectedStatus ? "1fr" : "repeat(3,1fr)",
                    },
                    gap: 2,
                }}
            >
                {displayStatuses?.map((item) => {
                    const cfg =
                        statusConfig[item.status_name?.toUpperCase()] || {
                            icon: <FiberNewIcon />,
                            color: "#2563eb",
                            desc: "Update Lead Status",
                        };

                    const active =
                        selectedStatus &&
                        item.status_id ===
                        selectedStatus?.status_id;

                    return (
                        <Box
                            key={item.status_id}
                            onClick={() => onStatusClick(item)}
                            sx={{
                                cursor: "pointer",
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: 4,
                                p: 2,
                                transition: ".3s",

                                background: active
                                    ? `linear-gradient(135deg,
                     ${alpha(cfg.color, .12)},
                     #ffffff)`
                                    : "linear-gradient(135deg,#ffffff,#f8fbff)",

                                border: `2px solid ${active
                                    ? cfg.color
                                    : alpha(cfg.color, .15)
                                    }`,

                                boxShadow: active
                                    ? `0 18px 45px ${alpha(
                                        cfg.color,
                                        .25
                                    )}`
                                    : "0 8px 25px rgba(15,23,42,.05)",

                                "&:hover": {
                                    transform: "translateY(-6px)",
                                    borderColor: cfg.color,
                                    boxShadow: `0 20px 40px ${alpha(
                                        cfg.color,
                                        .22
                                    )}`,
                                },

                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    right: -20,
                                    top: -20,
                                    width: 90,
                                    height: 90,
                                    borderRadius: "50%",
                                    background: alpha(cfg.color, .08),
                                },
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                <Box
                                    sx={{
                                        width: active ? 40 : 30,
                                        height: active ? 40 : 30,
                                        borderRadius: "18px",
                                        bgcolor: alpha(cfg.color, .12),
                                        color: cfg.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        "& svg": {
                                            fontSize: active ? 25 : 20,
                                        },
                                    }}
                                >
                                    {cfg.icon}
                                </Box>

                                <Box flex={1}>
                                    <Typography
                                        sx={{
                                            fontWeight: 900,
                                            fontSize: active ? 15 : 10,
                                            color: "#0f172a",
                                        }}
                                    >
                                        {item.status_name}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: .5,
                                            color: "#64748b",
                                            fontWeight: 600,
                                            fontSize: active ? 12 : 8,
                                        }}
                                    >
                                        {cfg.desc}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    );
                })}
            </Box>
        </Stack>
    );
};

export default StatusActionCards;