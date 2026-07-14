import React, { memo } from "react";
import {
    Box,
    Stack,
    Typography,
    Avatar,
    Skeleton,
} from "@mui/material";

const ExecutiveCardSkeleton = ({ highlight = false }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 3,
            border: "1px solid rgba(226,232,240,.8)",
            bgcolor: highlight ? "#f8fbff" : "#fff",
        }}
    >
        <Skeleton variant="circular">
            <Avatar sx={{ width: 54, height: 54 }} />
        </Skeleton>

        <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="55%" height={28} />
            <Skeleton variant="text" width="35%" height={18} />

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Skeleton variant="rounded" width={70} height={24} />
                <Skeleton variant="rounded" width={70} height={24} />
            </Stack>
        </Box>

        <Skeleton variant="circular" width={36} height={36} />
    </Box>
);

const TopSalesExecutivesSkeleton = () => {
    return (
        <Box
            sx={{
                borderRadius: 4,
                bgcolor: "#fff",
                border: "1px solid #E2E8F0",
                height: "100%",
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2.25 }}>
                <Skeleton variant="text" width={220} height={38} />
                <Skeleton variant="text" width={280} height={20} />
            </Box>

            {/* Executive Cards */}
            <Stack spacing={2} sx={{ p: 2.25 }}>
                <ExecutiveCardSkeleton highlight />
                <ExecutiveCardSkeleton />
                <ExecutiveCardSkeleton />
            </Stack>
        </Box>
    );
};

export default memo(TopSalesExecutivesSkeleton);