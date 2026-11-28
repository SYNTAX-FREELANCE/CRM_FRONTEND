
import React from "react";
import { Card, CardContent, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
    1: {
        light: {
            bg: "linear-gradient(110deg, #EFF6FF 0%, #DBEAFE 100%)",
            border: "rgba(191, 219, 254, 0.8)",
            accent: "#2563EB",
        },
        dark: {
            bg: "linear-gradient(110deg, #172B43 0%, #1C3552 100%)",
            border: "rgba(96, 165, 250, 0.12)",
            accent: "#60A5FA",
        },
    },
    2: {
        light: {
            bg: "linear-gradient(110deg, #FFFBEB 0%, #FEF3C7 100%)",
            border: "rgba(253, 230, 138, 0.8)",
            accent: "#D97706",
        },
        dark: {
            bg: "linear-gradient(110deg, #382B18 0%, #49351B 100%)",
            border: "rgba(251, 191, 36, 0.12)",
            accent: "#FBBF24",
        },
    },
    3: {
        light: {
            bg: "linear-gradient(110deg, #F5F3FF 0%, #EDE9FE 100%)",
            border: "rgba(221, 214, 254, 0.8)",
            accent: "#7C3AED",
        },
        dark: {
            bg: "linear-gradient(110deg, #2B2045 0%, #382858 100%)",
            border: "rgba(167, 139, 250, 0.12)",
            accent: "#A78BFA",
        },
    },
    4: {
        light: {
            bg: "linear-gradient(110deg, #ECFEFF 0%, #CFFAFE 100%)",
            border: "rgba(165, 243, 252, 0.8)",
            accent: "#0891B2",
        },
        dark: {
            bg: "linear-gradient(110deg, #16333D 0%, #1B414C 100%)",
            border: "rgba(34, 211, 238, 0.12)",
            accent: "#22D3EE",
        },
    },
    5: {
        light: {
            bg: "linear-gradient(110deg, #F0FDF4 0%, #DCFCE7 100%)",
            border: "rgba(187, 247, 208, 0.8)",
            accent: "#16A34A",
        },
        dark: {
            bg: "linear-gradient(110deg, #102C25 0%, #142F25 100%)",
            border: "rgba(74, 222, 128, 0.12)",
            accent: "#4ADE80",
        },
    },
    6: {
        light: {
            bg: "linear-gradient(110deg, #FEF2F2 0%, #FEE2E2 100%)",
            border: "rgba(254, 202, 202, 0.8)",
            accent: "#DC2626",
        },
        dark: {
            bg: "linear-gradient(110deg, #3B2022 0%, #482629 100%)",
            border: "rgba(248, 113, 113, 0.12)",
            accent: "#F87171",
        },
    },
    7: {
        light: {
            bg: "linear-gradient(110deg, #ECFDF5 0%, #D1FAE5 100%)",
            border: "rgba(167, 243, 208, 0.8)",
            accent: "#059669",
        },
        dark: {
            bg: "linear-gradient(110deg, #102F29 0%, #174137 100%)",
            border: "rgba(52, 211, 153, 0.12)",
            accent: "#34D399",
        },
    },
    8: {
        light: {
            bg: "linear-gradient(110deg, #EEF2FF 0%, #E0E7FF 100%)",
            border: "rgba(199, 210, 254, 0.8)",
            accent: "#6366F1",
        },
        dark: {
            bg: "linear-gradient(110deg, #242747 0%, #30345B 100%)",
            border: "rgba(129, 140, 248, 0.12)",
            accent: "#818CF8",
        },
    },
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

    // Select the correct light/dark status style
    const statusStyle = STATUS_STYLES[Number(statusId)];

    const currentStyle = statusStyle
        ? (isDark ? statusStyle.dark : statusStyle.light)
        : {
            bg: isDark
                ? "linear-gradient(110deg, #102c25 0%, #142f25 100%)"
                : "linear-gradient(110deg, #e8f5ed 0%, #dcefe3 100%)",
            border: isDark
                ? "rgba(74, 222, 128, 0.08)"
                : "rgba(249, 253, 251, 1)",
            accent: color,
        };

    return (
        <Card
            onClick={() =>
                navigate("/home/freshcalls", {
                    state: { status: statusId },
                })
            }
            elevation={0}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: { xs: 1.25, md: 1 },
                borderRadius: 3,

                background: currentStyle.bg,

                border: `1px solid ${currentStyle.border}`,
                borderTop: `5px solid ${currentStyle.accent}`,

                boxShadow: isDark
                    ? "0 8px 25px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.07)"
                    : "0 8px 25px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)",

                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",

                cursor: "pointer",
                transition: "all 0.25s ease",

                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: isDark
                        ? "0 12px 30px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.12)"
                        : "0 12px 30px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,1)",
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
                        color: isDark ? "#CBD5E1" : "#64748b",
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
                        color: isDark ? "#F8FAFC" : "#1E293B",
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
