
import React, { memo } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    useTheme,
} from "@mui/material";

import { useGetCallsLeft } from "../../CommonCode/useQuery";

const EmployeeTargetCard = ({ data = [] }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const emp = data[0];

    const { data: callsLeftCount = 0 } = useGetCallsLeft(
        emp?.employee_id
    );

    if (!emp) return null;

    const totalTarget =
        Number(emp.normal_target || 0) +
        Number(emp.renewal_target || 0);

    const totalSold = Number(emp.total_sold || 0);

    const achievement =
        totalTarget > 0
            ? ((totalSold / totalTarget) * 100).toFixed(2)
            : "0.00";

    const cards = [
        {
            title: "Total Target",
            value: totalTarget,
            color: "#6366f1",
            light: "rgba(99, 102, 241, 0.10)",
            dark: "rgba(99, 102, 241, 0.17)",
        },
        {
            title: "Total Sold",
            value: totalSold,
            color: "#10b981",
            light: "rgba(16, 185, 129, 0.10)",
            dark: "rgba(16, 185, 129, 0.17)",
        },
        {
            title: "Calls Left",
            value: callsLeftCount,
            color: "#f59e0b",
            light: "rgba(245, 158, 11, 0.10)",
            dark: "rgba(245, 158, 11, 0.17)",
        },
        {
            title: "Achievement",
            value: `${achievement}%`,
            color: "#a855f7",
            light: "rgba(168, 85, 247, 0.10)",
            dark: "rgba(168, 85, 247, 0.17)",
        },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.8,
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "stretch",
            }}
        >
            {cards.map((card) => (
                <Card
                    key={card.title}
                    elevation={0}
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                        flex: "1 1 90px",
                        minWidth: {
                            xs: "calc(50% - 6px)",
                            sm: 90,
                        },
                        maxWidth: {
                            xs: "none",
                            sm: 120,
                        },
                        borderRadius: "12px",

                        background: isDark
                            ? `linear-gradient(145deg, ${card.dark}, #111c2b 85%)`
                            : `linear-gradient(145deg, #ffffff 5%, ${card.light} 100%)`,

                        border: `1px solid ${card.color}${isDark ? "35" : "30"}`,

                        boxShadow: isDark
                            ? "0 3px 10px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.06)"
                            : `0 3px 10px ${card.color}12, inset 0 1px 0 #ffffff`,

                        transition: "all 0.2s ease",

                        "&::before": {
                            content: '""',
                            position: "absolute",
                            width: 65,
                            height: 65,
                            borderRadius: "50%",
                            top: -38,
                            right: -20,
                            background: card.color,
                            opacity: isDark ? 0.12 : 0.08,
                            filter: "blur(3px)",
                        },

                        "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "12%",
                            width: "76%",
                            height: "1px",
                            background: `linear-gradient(90deg, transparent, ${card.color}90, transparent)`,
                        },

                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 5px 14px ${card.color}22`,
                        },
                    }}
                >
                    <CardContent
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            px: 1.2,
                            py: 1,
                            "&:last-child": {
                                pb: 1,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.55,
                                mb: 0.45,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,
                                    flexShrink: 0,
                                    borderRadius: "50%",
                                    background: card.color,
                                    boxShadow: `0 0 6px ${card.color}90`,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 7,
                                    fontWeight: 800,
                                    letterSpacing: "0.35px",
                                    textTransform: "uppercase",
                                    color: isDark ? "#aebbc9" : "#64748b",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    lineHeight: 1.3,
                                }}
                                title={card.title}
                            >
                                {card.title}
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 17,
                                    sm: 18,
                                },
                                fontWeight: 900,
                                lineHeight: 1.2,
                                letterSpacing: "-0.5px",
                                fontVariantNumeric: "tabular-nums",
                                color: isDark ? "#f8fafc" : "#172033",
                            }}
                        >
                            {card.value}
                        </Typography>

                        <Box
                            sx={{
                                mt: 0.7,
                                width: 24,
                                height: 2,
                                borderRadius: 5,
                                background: card.color,
                                opacity: 0.8,
                                boxShadow: `0 0 5px ${card.color}70`,
                            }}
                        />
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default memo(EmployeeTargetCard);
