import React, { memo, useMemo } from "react";
import {
    Box,
    Stack,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";

import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FiberNewIcon from "@mui/icons-material/FiberNew";

import { useLeadMaster } from "../../CommonCode/useQuery";

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
        desc: "Fresh lead",
    },
};

const TransferStatusCards = ({
    value,
    onChange,
}) => {
    const { data: LeadMasterDetail = [] } =
        useLeadMaster();

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const statuses = useMemo(() => {
        return Array.isArray(LeadMasterDetail)
            ? LeadMasterDetail.filter(
                (status) =>
                    status.is_active === 1 &&
                    status.status_id !== 1
            )
            : [];
    }, [LeadMasterDetail]);

    return (
        <Box>
            <Typography
                sx={{
                    mb: 1,
                    fontSize: 9,
                    fontWeight: 900,
                    color: "#64748b",
                    letterSpacing: 0.5,
                }}
            >
                MOVE STATUS TO
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(5, 1fr)",
                    },
                    gap: 1,
                }}
            >
                {statuses.map((item) => {
                    const cfg =
                        statusConfig[
                        item.status_name?.toUpperCase()
                        ] || {
                            icon: <FiberNewIcon />,
                            color: "#2563eb",
                            desc: "Update lead status",
                        };

                    const active =
                        Number(value) ===
                        Number(item.status_id);

                    const statusName =
                        item.status_name === "SOLD"
                            ? "CAPTURED"
                            : item.status_name;

                    return (
                        <Box
                            key={item.status_id}
                            onClick={() =>
                                onChange(item)
                            }
                            sx={{
                                position: "relative",
                                overflow: "hidden",
                                cursor: "pointer",
                                minHeight: 55,
                                px: 1.2,
                                py: 1,
                                borderRadius: 2.5,

                                background: active
                                    ? `linear-gradient(
                                        135deg,
                                        ${alpha(
                                        cfg.color,
                                        0.13
                                    )},
                                        ${alpha(
                                        cfg.color,
                                        0.04
                                    )}
                                    )`
                                    : isDark
                                        ? "rgba(255,255,255,0.025)"
                                        : "#f8fafc",

                                border: `1px solid ${active
                                        ? cfg.color
                                        : alpha(
                                            cfg.color,
                                            0.16
                                        )
                                    }`,

                                boxShadow: active
                                    ? `0 5px 16px ${alpha(
                                        cfg.color,
                                        0.18
                                    )}`
                                    : "none",

                                transition:
                                    "all .2s ease",

                                "&:hover": {
                                    borderColor:
                                        cfg.color,
                                    background:
                                        alpha(
                                            cfg.color,
                                            0.07
                                        ),
                                    transform:
                                        "translateY(-2px)",
                                    boxShadow: `0 6px 18px ${alpha(
                                        cfg.color,
                                        0.14
                                    )}`,
                                },

                                "&::after": {
                                    content: '""',
                                    position:
                                        "absolute",
                                    width: 45,
                                    height: 45,
                                    borderRadius:
                                        "50%",
                                    right: -18,
                                    top: -18,
                                    background:
                                        alpha(
                                            cfg.color,
                                            0.07
                                        ),
                                },
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    position:
                                        "relative",
                                    zIndex: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        flexShrink: 0,
                                        borderRadius:
                                            "9px",
                                        bgcolor:
                                            alpha(
                                                cfg.color,
                                                active
                                                    ? 0.18
                                                    : 0.1
                                            ),
                                        color:
                                            cfg.color,
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",

                                        "& svg": {
                                            fontSize: 17,
                                        },
                                    }}
                                >
                                    {cfg.icon}
                                </Box>

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 900,
                                            fontSize: 10,
                                            lineHeight: 1.1,
                                            color: isDark
                                                ? "#fff"
                                                : "#0f172a",
                                        }}
                                    >
                                        {statusName}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.35,
                                            fontSize: 7.5,
                                            fontWeight: 600,
                                            lineHeight: 1.1,
                                            color:
                                                "#64748b",
                                            whiteSpace:
                                                "nowrap",
                                            overflow:
                                                "hidden",
                                            textOverflow:
                                                "ellipsis",
                                        }}
                                    >
                                        {cfg.desc}
                                    </Typography>
                                </Box>

                                {active && (
                                    <Box
                                        sx={{
                                            ml: "auto",
                                            width: 7,
                                            height: 7,
                                            borderRadius:
                                                "50%",
                                            bgcolor:
                                                cfg.color,
                                            boxShadow: `0 0 0 3px ${alpha(
                                                cfg.color,
                                                0.12
                                            )}`,
                                        }}
                                    />
                                )}
                            </Stack>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default memo(
    TransferStatusCards
);