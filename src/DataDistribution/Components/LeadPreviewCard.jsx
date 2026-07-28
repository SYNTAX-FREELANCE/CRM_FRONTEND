import React, { memo } from "react";
import { Box, Stack, Typography, Chip, useTheme } from "@mui/material";

const LeadPreviewCard = ({ row }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                p: 1.2,
                borderRadius: 2,
                bgcolor: isDark ? "rgba(30, 41, 59, 0.6)" : "#fff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e2e8f0",
            }}
        >
            <Stack direction="row" justifyContent="space-between" gap={1}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: { xs: 10, sm: 13 },
                            fontWeight: 800,
                            color: isDark ? "#f8fafc" : "inherit",
                        }}
                    >
                        {row.customer_name}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: 8, sm: 10 },
                            color: isDark ? "#94a3b8" : "#64748b",
                        }}
                    >
                        {row.registration_number}
                    </Typography>
                </Box>

                <Chip
                    size="small"
                    label={row.work_status?.replace("_", " ") || "-"}
                    sx={{
                        fontWeight: 700,
                        bgcolor: isDark ? "rgba(3, 105, 161, 0.25)" : "#e0f2fe",
                        color: isDark ? "#38bdf8" : "#0369a1",
                        fontSize: { xs: 8, sm: 10 },
                    }}
                />
            </Stack>
        </Box>
    );
};

export default memo(LeadPreviewCard);


