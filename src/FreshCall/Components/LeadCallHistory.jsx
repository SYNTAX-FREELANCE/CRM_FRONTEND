
import React, { memo } from "react";
import {
    Box,
    Stack,
    Typography,
    Chip,
    Divider,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { format } from "date-fns";

const LeadCallHistory = ({ calls = [] }) => {

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
                    borderRadius: 2,
                    bgcolor: "rgba(148,163,184,0.06)",
                }}
            >
                <PhoneMissedIcon
                    sx={{
                        fontSize: 32,
                        color: "text.disabled",
                        mb: 1,
                    }}
                />

                <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.secondary"
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

                return (
                    <Box
                        key={item.call_log_id}
                        sx={{
                            border: "1px solid",
                            borderColor: answered
                                ? "rgba(22,163,74,0.22)"
                                : "rgba(239,68,68,0.20)",
                            borderRadius: 2.5,
                            p: 1.5,
                            bgcolor: "background.paper",
                            boxShadow: "0 2px 8px rgba(15,23,42,0.035)",
                        }}
                    >
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
                            >
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: answered
                                            ? "rgba(22,163,74,0.10)"
                                            : "rgba(239,68,68,0.10)",
                                        color: answered
                                            ? "#16a34a"
                                            : "#ef4444",
                                    }}
                                >
                                    {answered ? (
                                        <PhoneIcon fontSize="small" />
                                    ) : (
                                        <PhoneMissedIcon fontSize="small" />
                                    )}
                                </Box>

                                <Box>
                                    <Typography
                                        fontWeight={800}
                                        fontSize={13}
                                        color="text.primary"
                                    >
                                        {item.phone_number || "-"}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
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
                                    fontWeight: 800,
                                    fontSize: 10,
                                    bgcolor: answered
                                        ? "rgba(22,163,74,0.10)"
                                        : "rgba(239,68,68,0.10)",
                                    color: answered ? "#15803d" : "#dc2626",
                                    "& .MuiChip-icon": {
                                        color: "inherit",
                                        fontSize: 15,
                                    },
                                }}
                            />
                        </Stack>

                        <Divider sx={{ my: 1.3 }} />

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
                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <AccessTimeIcon
                                        sx={{
                                            fontSize: 14,
                                            color: "text.secondary",
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight={700}
                                    >
                                        Call Date
                                    </Typography>
                                </Stack>

                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    mt={0.5}
                                >
                                    {formatCallDate(callDate)}
                                </Typography>
                            </Box>

                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <AccessTimeIcon
                                        sx={{
                                            fontSize: 14,
                                            color: "text.secondary",
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight={700}
                                    >
                                        Duration
                                    </Typography>
                                </Stack>

                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    mt={0.5}
                                >
                                    {formatDuration(item.duration_seconds)}
                                </Typography>
                            </Box>

                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <SmartphoneIcon
                                        sx={{
                                            fontSize: 14,
                                            color: "text.secondary",
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight={700}
                                    >
                                        Source
                                    </Typography>
                                </Stack>

                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    mt={0.5}
                                >
                                    {item.source || "-"}
                                </Typography>
                            </Box>

                            <Box>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    alignItems="center"
                                >
                                    <PersonIcon
                                        sx={{
                                            fontSize: 14,
                                            color: "text.secondary",
                                        }}
                                    />

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        fontWeight={700}
                                    >
                                        Called By
                                    </Typography>
                                </Stack>

                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    mt={0.5}
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
