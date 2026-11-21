
import React, { memo } from "react";
import {
    Box,
    Stack,
    Typography,
    Chip,
    Divider,
    useTheme,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { format } from "date-fns";

const LeadCallHistory = ({ calls = [] }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const colors = {
        card: isDark ? "#1b241e" : "#ffffff",
        border: isDark ? "#35443a" : "#e0ebe3",
        text: isDark ? "#e5eee7" : "#263b30",
        secondary: isDark ? "#a2b1a6" : "#78877e",
        divider: isDark ? "#35443a" : "#e8f0ea",
        mutedBg: isDark ? "#222d25" : "#f5f8f5",
        answered: isDark ? "#70cf91" : "#168044",
        answeredBg: isDark ? "#203b2b" : "#eaf6ed",
        answeredBorder: isDark ? "#426c4e" : "#cde6d4",
        missed: isDark ? "#f18b8b" : "#dc4444",
        missedBg: isDark ? "#402929" : "#fff0f0",
        missedBorder: isDark ? "#694040" : "#f3d4d4",
        iconBg: isDark ? "#29372d" : "#edf6f0",
    };

    const formatCallDate = (date) => {
        if (!date) return "-";

        try {
            return format(
                new Date(date.replace(" ", "T")),
                "dd MMM yyyy, hh:mm:ss a"
            );
        } catch {
            return "-";
        }
    };

    const formatDuration = (seconds) => {
        const totalSeconds = Number(seconds) || 0;

        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;

        if (minutes > 0) {
            return `${minutes} min ${remainingSeconds} sec`;
        }

        return `${remainingSeconds} sec`;
    };

    if (!calls || calls.length === 0) {
        return (
            <Box
                sx={{
                    py: 4,
                    textAlign: "center",
                    borderRadius: "12px",
                    bgcolor: colors.mutedBg,
                    border: `1px dashed ${colors.border}`,
                }}
            >
                <PhoneMissedIcon
                    sx={{
                        fontSize: 32,
                        color: colors.secondary,
                        mb: 1,
                    }}
                />

                <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ color: colors.secondary }}
                >
                    No call history available
                </Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={1.5}>
            {calls?.map((item, index) => {
                const answered =
                    Number(item.answered) === 1 ||
                    item.call_status === "ANSWERED";

                const callDate =
                    item.call_started_at ||
                    item.call_ended_at ||
                    item.created_at;

                const statusColor = answered
                    ? colors.answered
                    : colors.missed;

                const statusBg = answered
                    ? colors.answeredBg
                    : colors.missedBg;

                const statusBorder = answered
                    ? colors.answeredBorder
                    : colors.missedBorder;

                return (
                    <Box
                        key={item.call_log_id}
                        sx={{
                            border: `1px solid ${statusBorder}`,
                            borderRadius: "12px",
                            p: { xs: 1.25, sm: 1.5 },
                            bgcolor: colors.card,
                            boxShadow: isDark
                                ? "0 3px 10px rgba(0,0,0,0.16)"
                                : "0 2px 8px rgba(31,65,43,0.04)",
                            transition: "border-color 0.2s ease",
                        }}
                    >
                        {/* Call Header */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            flexWrap="wrap"
                            gap={1}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ minWidth: 0 }}
                            >
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: statusBg,
                                        color: statusColor,
                                        flexShrink: 0,
                                    }}
                                >
                                    {answered ? (
                                        <PhoneIcon fontSize="small" />
                                    ) : (
                                        <PhoneMissedIcon fontSize="small" />
                                    )}
                                </Box>

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        fontWeight={800}
                                        fontSize={13}
                                        sx={{
                                            color: colors.text,
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {item.phone_number || "-"}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: colors.secondary,
                                            fontSize: 10,
                                        }}
                                    >
                                        Call ID: #{item.call_log_id}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Chip
                                size="small"
                                icon={
                                    answered
                                        ? <CheckCircleIcon />
                                        : <PhoneMissedIcon />
                                }
                                label={
                                    item.call_status || (
                                        answered ? "ANSWERED" : "NOT ANSWERED"
                                    )
                                }
                                sx={{
                                    height: 23,
                                    fontWeight: 800,
                                    fontSize: 10,
                                    bgcolor: statusBg,
                                    color: statusColor,
                                    border: `1px solid ${statusBorder}`,
                                    borderRadius: "7px",
                                    "& .MuiChip-icon": {
                                        color: "inherit",
                                        fontSize: 15,
                                    },
                                }}
                            />
                        </Stack>

                        <Divider
                            sx={{
                                my: 1.3,
                                borderColor: colors.divider,
                            }}
                        />

                        {/* Call Details */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr 1fr",
                                    sm: "repeat(3, 1fr)",
                                },
                                gap: 1.5,
                            }}
                        >
                            {/* Call Date */}
                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <AccessTimeIcon
                                        sx={{
                                            fontSize: 14,
                                            color: colors.secondary,
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: colors.secondary,
                                            fontWeight: 700,
                                            fontSize: 10,
                                        }}
                                    >
                                        Call Date
                                    </Typography>
                                </Stack>

                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    mt={0.5}
                                    sx={{
                                        color: colors.text,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {formatCallDate(callDate)}
                                </Typography>
                            </Box>

                            {/* Duration */}
                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <AccessTimeIcon
                                        sx={{
                                            fontSize: 14,
                                            color: colors.secondary,
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: colors.secondary,
                                            fontWeight: 700,
                                            fontSize: 10,
                                        }}
                                    >
                                        Duration
                                    </Typography>
                                </Stack>

                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    mt={0.5}
                                    sx={{ color: colors.text }}
                                >
                                    {formatDuration(item.duration_seconds)}
                                </Typography>
                            </Box>

                            {/* Source */}
                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <SmartphoneIcon
                                        sx={{
                                            fontSize: 14,
                                            color: colors.secondary,
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: colors.secondary,
                                            fontWeight: 700,
                                            fontSize: 10,
                                        }}
                                    >
                                        Source
                                    </Typography>
                                </Stack>

                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    mt={0.5}
                                    sx={{
                                        color: colors.text,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {item.source || "-"}
                                </Typography>
                            </Box>

                            {/* Called By */}
                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <PersonIcon
                                        sx={{
                                            fontSize: 14,
                                            color: colors.secondary,
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: colors.secondary,
                                            fontWeight: 700,
                                            fontSize: 10,
                                        }}
                                    >
                                        Called By
                                    </Typography>
                                </Stack>

                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    mt={0.5}
                                    sx={{
                                        color: colors.text,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {item.employee_name ||
                                        (item.created_by
                                            ? `Employee #${item.created_by}`
                                            : "-")}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </Stack>
    );
};

export default memo(LeadCallHistory);
