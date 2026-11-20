
import React from "react";
import { Card, CardContent, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
    1: "#2563eb", // NEW
    2: "#d97706", // CALLBACK
    3: "#7c3aed", // QUOTE
    4: "#0891b2", // APPOINTMENT
    5: "#16a34a", // SOLD
    6: "#dc2626", // LOST
    7: "#059669", // PAID
    8: "#6366f1", // RECALL
};

const StatusCountCard = ({
    title,
    statusId,
    count,
    color = "#2563eb",
}) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const FinalTitle = title === "SOLD" ? "CAPTURED" : title;

    const statusColor = STATUS_COLORS[statusId] || color;

    return (
        <Card
            onClick={() =>
                navigate("/home/freshcalls", {
                    state: { status: statusId },
                })
            }
            elevation={0}
            sx={{
                minWidth: 0,
                height: "100%",
                borderRadius: "19px",
                border: isDark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid #e5e7eb",
                borderTop: `3px solid ${statusColor}`,
                cursor: "pointer",
                background: isDark ? "#1e293b" : "#ffffff",
                boxShadow: isDark
                    ? "0 4px 12px rgba(0,0,0,0.2)"
                    : "0 4px 12px rgba(15,23,42,0.045)",
                transition: "all 0.2s ease",

                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 8px 20px ${statusColor}25`,
                },
            }}
        >
            <CardContent
                sx={{
                    px: 1.7,
                    py: 1.4,
                    "&:last-child": { pb: 1.4 },
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "Bahnschrift",
                        color: isDark ? "#94a3b8" : "#64748b",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.7px",
                        fontSize: 10,
                        mb: 0.5,
                    }}
                >
                    {FinalTitle}
                </Typography>

                <Typography
                    sx={{
                        fontFamily: "Bahnschrift",
                        fontWeight: 900,
                        fontSize: { xs: 27, sm: 30, md: 32 },
                        lineHeight: 1.2,
                        color: isDark ? "#f8fafc" : "#1e293b",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {count}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default React.memo(StatusCountCard);
