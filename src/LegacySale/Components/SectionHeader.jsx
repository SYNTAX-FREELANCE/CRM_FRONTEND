import React, { memo } from "react";
import { Box, Typography } from "@mui/material";

const SectionHeader = ({
    icon,
    title,
    subtitle,
    number,
    isDark,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2.5,
            }}
        >
            {/* ICON */}
            <Box
                sx={{
                    width: 42,
                    height: 42,
                    minWidth: 42,

                    borderRadius: "12px",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    bgcolor: isDark
                        ? "rgba(59,130,246,0.15)"
                        : "#eff6ff",

                    color: isDark
                        ? "#60a5fa"
                        : "#2563eb",
                }}
            >
                {icon}
            </Box>

            {/* TITLE + SUBTITLE */}
            <Box sx={{ flex: 1 }}>
                <Typography
                    sx={{
                        fontSize: "16px",
                        fontWeight: 800,

                        color: isDark
                            ? "text.primary"
                            : "#0f172a",
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: "11px",
                        color: "text.secondary",
                        mt: 0.3,
                    }}
                >
                    {subtitle}
                </Typography>
            </Box>

            {/* SECTION NUMBER */}
            <Box
                sx={{
                    width: 28,
                    height: 28,
                    minWidth: 28,

                    borderRadius: "50%",

                    bgcolor: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "#f1f5f9",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    fontSize: "12px",
                    fontWeight: 800,

                    color: "text.secondary",
                }}
            >
                {number}
            </Box>
        </Box>
    );
};

export default memo(SectionHeader);
