import { Card, CardContent, Typography } from "@mui/material";
import { memo } from "react";

const DashboardStatCard = ({
    title,
    count,
    isDark = false,
    borderColor = "#ffb52c",
    onClick,
}) => {
    return (
        <Card
            elevation={0}
            onClick={onClick}
            sx={{
                minWidth: 0,
                borderRadius: 4,
                cursor: onClick ? "pointer" : "default",
                border: isDark
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(226,232,240,.8)",
                borderLeft: `4px solid ${borderColor}`,

                background: isDark
                    ? `radial-gradient(circle at 15% 20%, rgba(37,99,235,0.1) 0%, transparent 30%),
                       radial-gradient(circle at 85% 15%, rgba(249,115,22,0.1) 0%, transparent 28%),
                       linear-gradient(180deg, #1e293b 0%, #0f172a 100%)`
                    : `radial-gradient(circle at 15% 20%, rgba(37,99,235,0.14) 0%, transparent 30%),
                       radial-gradient(circle at 85% 15%, rgba(249,115,22,0.12) 0%, transparent 28%),
                       linear-gradient(180deg, #f8fbff 0%, #ffffff 45%, #f8fafc 100%)`,

                boxShadow: isDark
                    ? `0 12px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`
                    : `0 12px 30px rgba(15,23,42,.06), inset 0 1px 0 rgba(255,255,255,.8)`,

                backdropFilter: "blur(12px)",
                transition: "all .25s ease",

                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: isDark
                        ? `0 18px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)`
                        : `0 18px 40px rgba(37,99,235,.12), inset 0 1px 0 rgba(255,255,255,.9)`,
                },
            }}
        >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: isDark ? "#94a3b8" : "#475569",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: 8,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    fontWeight={900}
                    fontSize={{ xs: 20, sm: 20, md: 24 }}
                    sx={{
                        mb: 0.5,
                        color: isDark ? "#f8fafc" : "#050505",
                        letterSpacing: 1,
                        textShadow: isDark
                            ? "0px 4px 12px rgba(0,0,0,0.6)"
                            : `
                                1px 1px 0px #fff,
                                2px 2px 0px #d1d5db,
                                3px 3px 0px #cbd5e1,
                                4px 4px 6px rgba(0,0,0,0.25)
                              `,
                    }}
                >
                    {count}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default memo(DashboardStatCard);