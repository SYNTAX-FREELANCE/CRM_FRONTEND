
import React, { memo } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const PolicyClaimStatusSelect = ({
    statuses = [],
    value,
    onChange,
}) => {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "repeat(3, minmax(0, 1fr))",
                    md: "repeat(4, minmax(0, 1fr))",
                },
                gap: 1.2,
            }}
        >
            {statuses
                .filter((status) => Number(status.is_active) === 1)
                .map((status) => {
                    const selected =
                        Number(value) === Number(status.claim_status_id);

                    const color = status.claim_status_color || "#64748b";

                    return (
                        <Card
                            key={status.claim_status_id}
                            elevation={0}
                            onClick={() =>
                                onChange?.(status.claim_status_id)
                            }
                            sx={{
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: selected ? "#94a3b8" : "#e5e7eb",
                                borderLeft: `3px solid ${color}`,
                                backgroundColor: selected ? "#f8fafc" : "#fff",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    borderColor: "#94a3b8",
                                    backgroundColor: "#f8fafc",
                                },
                            }}
                        >
                            <CardContent
                                sx={{
                                    px: 1.5,
                                    py: 1.25,
                                    "&:last-child": { pb: 1.25 },
                                }}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    gap={1}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 13,
                                            fontWeight: selected ? 700 : 600,
                                            color: "#334155",
                                        }}
                                    >
                                        {status.claim_status_name}
                                    </Typography>

                                    {selected ? (
                                        <CheckCircleRoundedIcon
                                            sx={{
                                                fontSize: 17,
                                                color: "#475569",
                                                flexShrink: 0,
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "50%",
                                                backgroundColor: color,
                                                flexShrink: 0,
                                            }}
                                        />
                                    )}
                                </Box>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: 10,
                                        color: "#94a3b8",
                                    }}
                                >
                                    {Number(status.is_final) === 1
                                        ? "Final status"
                                        : Number(status.is_initial) === 1
                                            ? "Initial status"
                                            : "In progress"}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
        </Box>
    );
};

export default memo(PolicyClaimStatusSelect);
