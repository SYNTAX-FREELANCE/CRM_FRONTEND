import React from "react";
import { Grid, Card, Box, Typography, Avatar } from "@mui/joy";
import { NorthEast } from "@mui/icons-material";

const getStatusStyle = (statusName) => {
    const name = (statusName || "").toUpperCase();
    if (name.includes("NEW")) return { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.08)" };
    if (name.includes("CALLBACK")) return { color: "#ea580c", bg: "rgba(234, 88, 12, 0.08)" };
    if (name.includes("QUOTE")) return { color: "#6366f1", bg: "rgba(99, 102, 241, 0.08)" };
    if (name.includes("APPOINMENT") || name.includes("APPOINTMENT")) return { color: "#a855f7", bg: "rgba(168, 85, 247, 0.08)" };
    if (name.includes("SOLD")) return { color: "#10b981", bg: "rgba(16, 185, 129, 0.08)" };
    return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.08)" };
};

const StatsCards = ({ TotalCount = [] }) => {
    return (
        <Grid container spacing={2.5}>
            {TotalCount.map((item, idx) => {
                const style = getStatusStyle(item.status_name);
                return (
                    <Grid key={idx} xs={6} sm={4} md={2}>
                        <Card
                            sx={{
                                p: { xs: 1.5, sm: 2, md: 2.5 },
                                borderRadius: "20px",
                                bgcolor: "white",
                                border: "1px solid rgba(0,0,0,0.02)",
                                borderLeft: `6px solid ${style.color}`,
                                boxShadow: "0 6px 20px rgba(15, 23, 42, 0.015)",
                                position: "relative",
                                overflow: "hidden",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: `0 10px 25px rgba(15, 23, 42, 0.06)`
                                }
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 0.5 }}>
                                <Typography
                                    level="body-xs"
                                    sx={{
                                        color: "neutral.550",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        fontSize: { xs: "9px", sm: "10px", md: "11px" }
                                    }}
                                >
                                    {item.status_name}
                                </Typography>
                                <Avatar
                                    size="sm"
                                    sx={{
                                        bgcolor: style.bg,
                                        color: style.color,
                                        width: { xs: 20, md: 24 },
                                        height: { xs: 20, md: 24 },
                                        flexShrink: 0
                                    }}
                                >
                                    <NorthEast sx={{ fontSize: { xs: 9, md: 11 } }} />
                                </Avatar>
                            </Box>
                            <Typography
                                level="h2"
                                sx={{
                                    fontWeight: 950,
                                    color: "#1e1b4b",
                                    mt: 1.5,
                                    fontSize: { xs: "20px", sm: "22px", md: "26px" },
                                    fontFamily: "monospace"
                                }}
                            >
                                {item.total_count}
                            </Typography>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default StatsCards;
