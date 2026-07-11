import React from "react";
import {
    Box,
    Sheet,
    Skeleton,
} from "@mui/joy";

const EmployeeCardSkeleton = () => {
    return (
        <Sheet
            variant="outlined"
            sx={{
                borderRadius: "12px",
                p: { xs: 1.25, sm: 1.5 },
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.25, sm: 1.75 },
                bgcolor: "background.surface",
                borderColor: "divider",
            }}
        >
            {/* Avatar */}
            <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                    width: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                    borderRadius: "10px",
                    flexShrink: 0,
                }}
            />

            {/* Employee Info */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.8,
                }}
            >
                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: "60%",
                        height: 10,
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: "45%",
                        height: 10,
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: "80%",
                        height: 10,
                    }}
                />

                <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{
                        width: "65%",
                        height: 10,
                    }}
                />
            </Box>

            {/* Stats */}
            <Box
                sx={{
                    width: { xs: 150, sm: 150 },
                    display: "flex",
                    gap: 0.75,
                }}
            >
                {[1, 2].map((item) => (
                    <Box
                        key={item}
                        sx={{
                            flex: 1,
                            borderRadius: "8px",
                            p: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "#fff",
                        }}
                    >
                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: "70%", height: 5 }}
                        />

                        <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: "40%", height: 8, mt: 0.5 }}
                        />

                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            sx={{
                                mt: 1,
                                width: "100%",
                                height: 10,
                                borderRadius: 1,
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Sheet>
    );
};

export default EmployeeCardSkeleton;