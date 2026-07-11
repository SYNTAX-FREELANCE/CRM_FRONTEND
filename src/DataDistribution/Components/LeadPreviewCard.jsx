import React, { memo } from "react";
import { Box, Stack, Typography, Chip } from "@mui/material";

const LeadPreviewCard = ({ row }) => {
    return (
        <Box
            sx={{
                p: 1.2,
                borderRadius: 2,
                bgcolor: "#fff",
                border: "1px solid #e2e8f0",
            }}
        >
            <Stack direction="row" justifyContent="space-between" gap={1}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: { xs: 10, sm: 13 },
                            fontWeight: 800,
                        }}
                    >
                        {row.customer_name}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: 8, sm: 10 },
                            color: "#64748b",
                        }}
                    >
                        {row.registration_number}
                    </Typography>
                </Box>

                <Chip
                    size="small"
                    label={row.work_status?.replace("_", " ") || "-"}
                    sx={{
                        fontWeight: 700,
                        bgcolor: "#e0f2fe",
                        color: "#0369a1",
                        fontSize: { xs: 8, sm: 10 },
                    }}
                />
            </Stack>
        </Box>
    );
}
export default memo(LeadPreviewCard)

