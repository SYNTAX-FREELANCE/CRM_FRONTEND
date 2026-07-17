import React, { memo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AnalyticsCard = ({ title, value, color, data }) => {
    return (
        <Paper
            elevation={0}
            sx={(theme) => ({
                p: 2,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(135deg, rgba(255,255,255,0.98) 0%, ${color}10 100%)`,
                boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
                overflow: "hidden",
            })}
        >
            <Typography
                sx={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "text.secondary",
                    textTransform: "uppercase",
                }}
            >
                {title}
            </Typography>

            <Typography
                sx={{
                    fontSize: 26,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    mt: 0.5,
                }}
            >
                {value}
            </Typography>

            <Box sx={{ width: "100%", height: 24, mt: 1.5 }}>
                <SparkLineChart
                    data={data}
                    area
                    showHighlight={false}
                    showTooltip={false}
                    curve="natural"
                    color={color}
                    height={24}
                    margin={{ top: 2, bottom: 2, left: 2, right: 2 }}
                    sx={{
                        width: "100%",
                        "& .MuiAreaElement-root": {
                            fill: `${color}20`,
                        },
                        "& .MuiLineElement-root": {
                            strokeWidth: 2,
                        },
                    }}
                />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                }}
            >
                {weekLabels.map((day) => (
                    <Typography
                        key={day}
                        sx={{
                            fontSize: 10,
                            color: "text.secondary",
                        }}
                    >
                        {day}
                    </Typography>
                ))}
            </Box>
        </Paper>
    );
};

export default memo(AnalyticsCard);