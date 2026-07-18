import React, { memo } from "react";
import { Box, Typography, useTheme } from "@mui/joy";

const DetailItem = ({ icon, text, color }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                px: 1.5,
                py: 1.1,
                borderRadius: 2,
                bgcolor: isDark ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.7)",
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.05)",
            }}
        >
            <Box sx={{ color }}>
                {icon}
            </Box>

            <Typography
                sx={{
                    fontSize: { xs: 12, sm: 14 },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: isDark ? "#f8fafc" : "inherit",
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

export default memo(DetailItem);