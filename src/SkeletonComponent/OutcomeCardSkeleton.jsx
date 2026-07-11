import React, { memo } from "react";
import { Box, Skeleton } from "@mui/material";

const OutcomeCardSkeleton = () => {
    return (
        <Box
            sx={{
                p: 1.25,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Skeleton
                variant="rounded"
                width={30}
                height={30}
                sx={{ borderRadius: "10px", flexShrink: 0 }}
            />

            <Box sx={{ flex: 1 }}>
                <Skeleton
                    variant="text"
                    width="70%"
                    height={16}
                />
            </Box>
        </Box>
    );
};

export default memo(OutcomeCardSkeleton);