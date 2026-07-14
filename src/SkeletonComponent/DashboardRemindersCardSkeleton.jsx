// DashboardRemindersCardSkeleton.jsx
import React, { memo } from "react";
import {
    Card,
    CardContent,
    Box,
    Skeleton,
    Divider,
    Stack,
} from "@mui/material";

const DashboardRemindersCardSkeleton = () => {
    return (
        <Card
            sx={{
                borderRadius: 5,
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                border: "1px solid rgba(255,255,255,0.85)",
                height: "60vh",
                overflow: "hidden",
            }}
        >
            <CardContent sx={{ px: 2 }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                    <Skeleton variant="text" width={220} height={38} />
                    <Skeleton variant="text" width={280} height={20} />

                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Skeleton
                            variant="rounded"
                            width={90}
                            height={30}
                        />
                    </Box>
                </Box>

                {/* Summary Cards */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(2,1fr)",
                            md: "repeat(4,1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            height={95}
                            sx={{ borderRadius: 3 }}
                        />
                    ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Section Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                    }}
                >
                    <Skeleton width={180} height={30} />
                    <Skeleton
                        variant="rounded"
                        width={40}
                        height={28}
                    />
                </Box>

                {/* Reminder List */}
                <Stack spacing={1.5}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            height={82}
                            sx={{ borderRadius: 3 }}
                        />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default memo(DashboardRemindersCardSkeleton);