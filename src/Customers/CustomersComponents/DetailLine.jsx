// src/components/DetailLine.jsx
import React, { memo } from "react";
import { Stack, Typography } from "@mui/material";

const DetailLine = ({ label, value, isDark }) => {

    return (

        <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{
                // bgcolor: isDark ? "rgba(30,41,59,0.7)" : "#ffffff",
                p: 0.5,
                borderBottom: "0.5px solid #716c6c3d",
                fontFamily: "Bahnschrift",
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: isDark ? "#f8fafc" : "text.secondary",
                    minWidth: 110,
                    fontWeight: 800,
                    fontSize: { xs: 10, sm: 16 },
                    fontFamily: "Bahnschrift",
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    color: isDark ? "rgba(40, 175, 51, 0.7)" : "#171717ff",
                    fontWeight: 800,
                    textAlign: "right",
                    fontSize: { xs: 12, sm: 16 },
                    fontFamily: "Bahnschrift",
                }}
            >
                {value}
            </Typography>
        </Stack>
    )
};

export default memo(DetailLine);