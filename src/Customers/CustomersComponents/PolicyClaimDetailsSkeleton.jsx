import React, { memo } from "react";
import {
    Box,
    Grid,
    Skeleton,
    Divider,
} from "@mui/material";

const PolicyClaimDetailsSkeleton = ({ isDark, count = 1 }) => {

    const skeletonColor = isDark
        ? "rgba(255,255,255,0.10)"
        : undefined;

    const DetailSkeleton = ({ fullWidth = false }) => (
        <Grid item xs={12} sm={6} md={fullWidth ? 12 : 4}>
            <Box
                sx={{
                    display: "flex",
                    gap: 1.2,
                    minHeight: 48,
                    alignItems: "flex-start",
                }}
            >
                {/* Icon */}
                <Skeleton
                    variant="rounded"
                    width={30}
                    height={30}
                    animation="wave"
                    sx={{
                        minWidth: 30,
                        borderRadius: "8px",
                        bgcolor: skeletonColor,
                    }}
                />

                {/* Label + Value */}
                <Box sx={{ flex: 1 }}>
                    <Skeleton
                        variant="text"
                        width="35%"
                        height={15}
                        animation="wave"
                        sx={{ bgcolor: skeletonColor }}
                    />

                    <Skeleton
                        variant="text"
                        width="70%"
                        height={20}
                        animation="wave"
                        sx={{ bgcolor: skeletonColor }}
                    />
                </Box>
            </Box>
        </Grid>
    );

    const SectionTitleSkeleton = () => (
        <Skeleton
            variant="text"
            width={150}
            height={20}
            animation="wave"
            sx={{
                mb: 1.5,
                bgcolor: skeletonColor,
            }}
        />
    );

    return (
        <Box>
            {Array.from({ length: count }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        mb: index !== count - 1 ? 2 : 0,
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: isDark
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid #E2E8F0",
                        background: isDark
                            ? "rgba(15,23,42,0.45)"
                            : "#FFFFFF",
                    }}
                >
                    {/* ================= HEADER ================= */}

                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            background: isDark
                                ? "rgba(249,115,22,0.06)"
                                : "#FFF8F2",
                            borderBottom: isDark
                                ? "1px solid rgba(255,255,255,0.07)"
                                : "1px solid #F1E5DA",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.2,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                width={38}
                                height={38}
                                animation="wave"
                                sx={{
                                    borderRadius: "10px",
                                    bgcolor: skeletonColor,
                                }}
                            />

                            <Box>
                                <Skeleton
                                    variant="text"
                                    width={65}
                                    height={15}
                                    animation="wave"
                                    sx={{
                                        bgcolor: skeletonColor,
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    width={150}
                                    height={22}
                                    animation="wave"
                                    sx={{
                                        bgcolor: skeletonColor,
                                    }}
                                />
                            </Box>
                        </Box>

                        <Skeleton
                            variant="rounded"
                            width={75}
                            height={25}
                            animation="wave"
                            sx={{
                                borderRadius: "6px",
                                bgcolor: skeletonColor,
                            }}
                        />
                    </Box>

                    {/* ================= CONTENT ================= */}

                    <Box sx={{ p: 2 }}>

                        {/* Claim Information */}

                        <SectionTitleSkeleton />

                        <Grid container spacing={2}>
                            <DetailSkeleton />
                            <DetailSkeleton />
                            <DetailSkeleton />
                            <DetailSkeleton />
                        </Grid>

                        <Divider
                            sx={{
                                my: 2,
                                borderColor: isDark
                                    ? "rgba(255,255,255,0.07)"
                                    : "#E2E8F0",
                            }}
                        />

                        {/* Accident Details */}

                        <SectionTitleSkeleton />

                        <Grid container spacing={2}>
                            <DetailSkeleton />
                            <DetailSkeleton />
                            <DetailSkeleton />
                        </Grid>

                        <Divider
                            sx={{
                                my: 2,
                                borderColor: isDark
                                    ? "rgba(255,255,255,0.07)"
                                    : "#E2E8F0",
                            }}
                        />

                        {/* Vehicle & Driver */}

                        <SectionTitleSkeleton />

                        <Grid container spacing={2}>
                            <DetailSkeleton />
                            <DetailSkeleton />
                            <DetailSkeleton />
                        </Grid>

                        <Divider
                            sx={{
                                my: 2,
                                borderColor: isDark
                                    ? "rgba(255,255,255,0.07)"
                                    : "#E2E8F0",
                            }}
                        />

                        {/* Repair & Inspection */}

                        <SectionTitleSkeleton />

                        <Grid container spacing={2}>
                            <DetailSkeleton />
                            <DetailSkeleton fullWidth />
                        </Grid>

                        <Divider
                            sx={{
                                my: 2,
                                borderColor: isDark
                                    ? "rgba(255,255,255,0.07)"
                                    : "#E2E8F0",
                            }}
                        />

                        {/* System Details */}

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 3,
                            }}
                        >
                            <Box>
                                <Skeleton
                                    variant="text"
                                    width={55}
                                    height={14}
                                    animation="wave"
                                    sx={{
                                        bgcolor: skeletonColor,
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    width={150}
                                    height={18}
                                    animation="wave"
                                    sx={{
                                        bgcolor: skeletonColor,
                                    }}
                                />
                            </Box>

                            <Box>
                                <Skeleton
                                    variant="text"
                                    width={80}
                                    height={14}
                                    animation="wave"
                                    sx={{
                                        bgcolor: skeletonColor,
                                    }}
                                />

                                <Skeleton
                                    variant="text"
                                    width={150}
                                    height={18}
                                    animation="wave"
                                    sx={{
                                        bgcolor: skeletonColor,
                                    }}
                                />
                            </Box>
                        </Box>

                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default memo(PolicyClaimDetailsSkeleton);

