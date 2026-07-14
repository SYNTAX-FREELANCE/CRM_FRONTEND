import React, { memo } from "react";
import { Box, Skeleton, Stack } from "@mui/material";

const ReminderItemSkeleton = () => {
    return (
        <Box
            sx={{
                p: { xs: 1.25, md: 1.5 },
                borderRadius: 3,
                bgcolor: "#fff",
                border: "1px solid rgba(226,232,240,0.9)",
                boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Skeleton
                    variant="circular"
                    sx={{
                        width: { xs: 20, sm: 25, md: 34 },
                        height: { xs: 20, sm: 25, md: 34 },
                        flexShrink: 0,
                    }}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                        }}
                    >
                        <Box sx={{ width: "80%" }}>
                            <Skeleton
                                variant="text"
                                sx={{ fontSize: { xs: 10, sm: 12, md: 14 }, width: "70%" }}
                            />
                            <Skeleton
                                variant="text"
                                sx={{ fontSize: 10, width: "95%", mt: 0.4 }}
                            />
                            <Skeleton
                                variant="text"
                                sx={{ fontSize: 11, width: "90%", mt: 0.3 }}
                            />
                        </Box>

                        <Box sx={{ width: "20%", display: "flex", justifyContent: "flex-end" }}>
                            <Skeleton
                                variant="rounded"
                                sx={{
                                    width: 70,
                                    height: 24,
                                    borderRadius: 2,
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default memo(ReminderItemSkeleton);