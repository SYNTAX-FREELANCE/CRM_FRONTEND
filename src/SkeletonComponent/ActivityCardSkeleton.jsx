import React, { memo } from "react";
import { Avatar, Box, Skeleton } from "@mui/material";

const ActivityCardSkeleton = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 2,
                borderRadius: 3,
                bgcolor: "#fff",
                border: "1px solid rgba(229,231,235,0.5)",
            }}
        >
            {/* Avatar */}
            <Skeleton
                variant="circular"
                width={44}
                height={44}
                sx={{ mr: 2, flexShrink: 0 }}
            />

            <Box sx={{ flex: 1 }}>
                {/* Name & Status */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Skeleton variant="text" width="45%" height={22} />
                    <Skeleton variant="rounded" width={60} height={20} />
                </Box>

                {/* Remarks */}
                <Skeleton variant="text" width="90%" height={18} />
                <Skeleton variant="text" width="70%" height={18} />

                {/* Date */}
                <Skeleton
                    variant="text"
                    width="40%"
                    height={16}
                    sx={{ mt: 1 }}
                />
            </Box>
        </Box>
    );
};

export default memo(ActivityCardSkeleton);