import React, { memo } from "react";
import { Box, Skeleton } from "@mui/material";

const ReminderCardSkeleton = ({ active = false }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: { xs: 1.25, md: 1.5 },
                borderRadius: 3,
                bgcolor: active ? "rgba(37,99,235,0.06)" : "#fff",
                border: active
                    ? "1px solid rgba(37,99,235,0.35)"
                    : "1px solid rgba(226,232,240,0.9)",
                boxShadow: active
                    ? "0 10px 25px rgba(37,99,235,0.10)"
                    : "0 6px 18px rgba(15,23,42,0.04)",
            }}
        >
            <Skeleton
                variant="circular"
                sx={{
                    width: { xs: 36, md: 40 },
                    height: { xs: 36, md: 40 },
                    flexShrink: 0,
                }}
            />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton
                    variant="text"
                    sx={{
                        fontSize: { xs: 10, md: 12 },
                        width: "70%",
                    }}
                />
            </Box>

            <Skeleton
                variant="rounded"
                sx={{
                    width: 34,
                    height: 24,
                    borderRadius: 2,
                    flexShrink: 0,
                }}
            />
        </Box>
    );
};

export default memo(ReminderCardSkeleton);