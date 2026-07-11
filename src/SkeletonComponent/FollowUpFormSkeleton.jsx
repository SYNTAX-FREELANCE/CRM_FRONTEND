import React, { memo } from "react";
import {
    Box,
    Grid,
    Skeleton,
    Stack,
} from "@mui/material";

const FollowUpFormSkeleton = () => {
    return (
        <Box
            sx={{
                mt: 3,
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                bgcolor: "#fff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 35px rgba(15,23,42,.08)",
            }}
        >
            <Stack spacing={3}>

                {/* Title */}
                <Skeleton width={150} height={28} />

                {/* Outcome Cards */}
                <Grid container spacing={2}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <Skeleton
                                variant="rounded"
                                height={55}
                                sx={{ borderRadius: 3 }}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Date Picker */}
                <Box>
                    <Skeleton width={180} height={24} />
                    <Skeleton
                        variant="rounded"
                        height={55}
                        sx={{ borderRadius: 3, mt: 1 }}
                    />
                </Box>

                {/* Textarea */}
                <Box>
                    <Skeleton width={120} height={24} />
                    <Skeleton
                        variant="rounded"
                        height={120}
                        sx={{ borderRadius: 3, mt: 1 }}
                    />
                </Box>

                {/* Bottom Section */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Skeleton width={250} height={20} />

                    <Stack direction="row" spacing={2}>
                        <Skeleton
                            variant="rounded"
                            width={110}
                            height={40}
                            sx={{ borderRadius: 3 }}
                        />
                        <Skeleton
                            variant="rounded"
                            width={140}
                            height={40}
                            sx={{ borderRadius: 3 }}
                        />
                    </Stack>
                </Stack>

            </Stack>
        </Box>
    );
};

export default memo(FollowUpFormSkeleton);