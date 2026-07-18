import React, { memo } from "react";
import { Box, Avatar, Typography, Chip, useTheme } from "@mui/material";
import { Today, EventAvailable, Schedule, ErrorOutline } from "@mui/icons-material";
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CommentIcon from '@mui/icons-material/Comment';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const statusMeta = {
    overdue: {
        label: "Overdue",
        color: "#dc2626",
        bg: "rgba(220,38,38,0.08)",
        icon: <ErrorOutline fontSize="small" />,
    },
    today: {
        label: "Today",
        color: "#2563eb",
        bg: "rgba(37,99,235,0.08)",
        icon: <Today fontSize="small" />,
    },
    tomorrow: {
        label: "Tomorrow",
        color: "#7c3aed",
        bg: "rgba(124,58,237,0.08)",
        icon: <Schedule fontSize="small" />,
    },
    upcoming: {
        label: "Upcoming",
        color: "#059669",
        bg: "rgba(5,150,105,0.08)",
        icon: <EventAvailable fontSize="small" />,
    },
};

const ReminderItem = ({ item }) => {
    const meta = statusMeta[item?.status];

    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box
            onClick={() =>
                navigate("/home/freshcalls", {
                    state: {
                        status: item?.status_id,
                        leadId: item?.lead_id
                    },

                })
            }

            sx={{
                p: { xs: 1.25, md: 1.5 },
                borderRadius: 3,
                bgcolor: isDark ? "rgba(30,41,59,0.7)" : "#fff",
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(226,232,240,0.9)",
                boxShadow: isDark ? "none" : "0 6px 18px rgba(15,23,42,0.04)",
                cursor: 'pointer'
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: meta?.bg || "rgba(148,163,184,0.12)",
                        color: meta?.color || "#64748b",
                        width: { xs: 20, sm: 25, md: 34 },
                        height: { xs: 20, sm: 25, md: 34 },
                        flexShrink: 0,
                    }}
                >
                    {meta?.icon}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                        }}
                    >
                        <Box sx={{ width: "80%" }}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    color: isDark ? "#f8fafc" : "#0f172a",
                                    fontSize: { xs: 10, sm: 12, md: 14 },
                                    lineHeight: 1.3,
                                }}
                            >
                                {item?.customer_name}
                            </Typography>


                            <Typography
                                sx={{
                                    fontSize: 10,
                                    fontWeight: 800,
                                    color: isDark ? "#94a3b8" : "text.secondary",
                                    mt: 0.3,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    minWidth: 0,
                                }}
                            >
                                <AgricultureIcon sx={{ color: meta?.color, fontSize: 14, flexShrink: 0 }} />
                                <Box
                                    component="span"
                                    sx={{
                                        minWidth: 0,
                                        flex: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        display: "block",
                                    }}
                                    title={item?.registration_number}
                                >
                                    {item?.registration_number}
                                </Box>

                                <CalendarMonthIcon sx={{ color: meta?.color, fontSize: 14, flexShrink: 0 }} />
                                <Box
                                    component="span"
                                    sx={{
                                        minWidth: 0,
                                        flex: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        display: "block",
                                    }}
                                    title={item?.next_followup_date}
                                >
                                    {item?.next_followup_date
                                        ? format(parseISO(item.next_followup_date), "dd MMM yyyy a")
                                        : "-"}

                                </Box>
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    color: isDark ? "#94a3b8" : "text.secondary",
                                    mt: 0.3,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    minWidth: 0,
                                }}
                            >
                                <CommentIcon sx={{ color: meta?.color, fontSize: 14, flexShrink: 0 }} />
                                <Box
                                    component="span"
                                    sx={{
                                        minWidth: 0,
                                        flex: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        display: "block",
                                    }}
                                    title={item?.remarks}
                                >
                                    {item?.remarks}
                                </Box>

                                <MilitaryTechIcon sx={{ color: meta?.color, fontSize: 14, flexShrink: 0 }} />
                                <Box
                                    component="span"
                                    sx={{
                                        minWidth: 0,
                                        flex: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        display: "block",
                                    }}
                                    title={item?.status_name}
                                >
                                    {item?.status_name}
                                </Box>
                            </Typography>
                        </Box>

                        <Box sx={{ width: "20%" }}>
                            <Chip
                                label={meta?.label || "Reminder"}
                                size="small"
                                sx={{
                                    bgcolor: meta?.bg || "rgba(148,163,184,0.12)",
                                    color: meta?.color || "#64748b",
                                    fontWeight: 800,
                                    fontSize: { xs: 8, sm: 10, md: 12 },
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default memo(ReminderItem);