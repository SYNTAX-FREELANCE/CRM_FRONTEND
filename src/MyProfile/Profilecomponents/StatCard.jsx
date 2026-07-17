import React, { memo } from "react";
import { Box, Paper, Typography } from "@mui/material";

const StatCard = ({ title, value, color, icon }) => {
    return (
        <Paper
            elevation={0}
            sx={(theme) => ({
                position: "relative",
                overflow: "hidden",
                p: 2.2,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(135deg, rgba(255,255,255,0.98) 0%, ${color}12 100%)`,
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                minHeight: { xs: 40, sm: 60 },
                transition: "all 0.25s ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 14px 36px rgba(15, 23, 42, 0.10)",
                },
                "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 6,
                    height: "100%",
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                    background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
                },
            })}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    pl: 0.5,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: { xs: 8, sm: 10 },
                            fontWeight: { xs: 900, sm: 700 },
                            color: "text.secondary",
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: { xs: 18, md: 30 },
                            fontWeight: 900,
                            lineHeight: 1,
                            color: "#0f172a",
                        }}
                    >
                        {value}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: { xs: 33, sm: 44 },
                        height: { xs: 33, sm: 44 },
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${color}18`,
                        color,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </Paper>
    );
};

export default memo(StatCard);