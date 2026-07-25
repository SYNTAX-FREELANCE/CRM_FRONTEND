// src/components/DetailLine.jsx
import React, { memo } from "react";
import { Stack, Typography } from "@mui/material";

const themeColors = {
    textDark: "#1E293B",
    textLight: "#64748B",
};

const DetailLine = ({ label, value }) => (
    <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
            bgcolor: "#fffffe",
            p: 0.5,
            borderBottom: "0.5px solid #716c6c3d",
        }}
    >
        <Typography
            variant="body2"
            sx={{
                color: themeColors.textLight,
                minWidth: 110,
                fontWeight: 800,
                fontSize: { xs: 10, sm: 14 },
            }}
        >
            {label}
        </Typography>
        <Typography
            variant="body2"
            sx={{
                color: themeColors.textDark,
                fontWeight: 800,
                textAlign: "right",
                fontSize: { xs: 12, sm: 14 },
            }}
        >
            {value}
        </Typography>
    </Stack>
);

export default memo(DetailLine);