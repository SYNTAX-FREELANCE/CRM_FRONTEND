import React from "react";
import { Box, Avatar, Typography, Chip } from "@mui/material";
import { Today, EventAvailable, Schedule, ErrorOutline } from "@mui/icons-material";

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


    return (
        <Box
            sx={{
                p: { xs: 1.25, md: 1.5 },
                borderRadius: 3,
                bgcolor: "#fff",
                border: "1px solid rgba(226,232,240,0.9)",
                boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems:'center',
                    justifyContent:'center'
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
                            alignItems:'center',
                    justifyContent:'center',
                            gap: 1,
                        }}
                    >
                        <Box sx={{
                            width: "80%",
                           
                        }}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    fontSize: { xs: 10, sm: 12, md: 14 },
                                    lineHeight: 1.3,
                                }}
                            >
                                {item?.customer_name}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { xs: 8, sm: 8, md: 12 },
                                    color: "text.secondary",
                                    mt: 0.3,
                                }} >
                                Reg: {item?.registration_number} • Model: {item?.model}
                            </Typography>
                        </Box>
                        <Box sx={{
                            width: "20%",
                           
                        }}>


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

export default ReminderItem;