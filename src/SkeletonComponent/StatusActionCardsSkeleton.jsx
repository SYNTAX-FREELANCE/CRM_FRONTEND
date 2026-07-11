import React, { memo } from "react";
import {
    Box,
    Stack,
    Typography,
    Skeleton,
} from "@mui/material";

const StatusActionCardsSkeleton = ({ count = 6 }) => {

    return (
        <Stack spacing={2.5}>

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography
                    sx={{
                        fontWeight: 900,
                        fontSize: 18,
                        color: "#0f172a",
                    }}
                >
                    <Skeleton width={180} height={32} />
                </Typography>

                <Skeleton
                    variant="rounded"
                    width={120}
                    height={36}
                    sx={{ borderRadius: 3 }}
                />
            </Stack>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2,1fr)",
                        md: "repeat(3,1fr)",
                    },
                    gap: 2,
                }}
            >
                {Array.from({ length: count }).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            borderRadius: 4,
                            p: 2,
                            border: "2px solid #eef2f7",
                            boxShadow: "0 8px 25px rgba(15,23,42,.05)",
                            bgcolor: "#fff",
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >
                            <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                            />

                            <Box flex={1}>
                                <Skeleton
                                    variant="text"
                                    width="70%"
                                    height={28}
                                />

                                <Skeleton
                                    variant="text"
                                    width="90%"
                                    height={20}
                                />
                            </Box>
                        </Stack>
                    </Box>
                ))}
            </Box>

        </Stack>
    );
};

export default memo(StatusActionCardsSkeleton);