import React, { memo } from "react";
import { Box, Typography } from "@mui/joy";

const DetailItem = ({ icon, text, color }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                px: 1.5,
                py: 1.1,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(0,0,0,0.05)",
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
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

export default memo(DetailItem);