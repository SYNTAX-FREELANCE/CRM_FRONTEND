import React, { memo } from "react";
import {
    Box,
    Chip,
    Divider,
    Grid,
    Skeleton,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

const PolicyDetailsFormSkeleton = () => {
    return (
        <Box
            sx={{
                p: 2.5,
                bgcolor: "#fff",
                borderRadius: 3,
            }}
        >
            <Divider sx={{ mb: 3 }}>
                <Chip
                    icon={<VerifiedIcon />}
                    label="Policy Details"
                    color="success"
                    sx={{ fontWeight: 700 }}
                />
            </Divider>

            <Grid container spacing={2}>
                {Array.from({ length: 10 }).map((_, index) => (
                    <Grid key={index} size={{ xs: 12, md: 6 }}>
                        <Skeleton
                            variant="text"
                            width={120}
                            height={18}
                            sx={{ mb: 0.5 }}
                        />

                        <Skeleton
                            variant="rounded"
                            height={40}
                            sx={{ borderRadius: 2 }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default memo(PolicyDetailsFormSkeleton);