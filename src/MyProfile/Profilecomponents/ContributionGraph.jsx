

import React from "react";
import { Card, CardContent, Box, Stack, Typography } from "@mui/material";

const dummyApiData = [
    { date: "2025-07-01", count: 0 },
    { date: "2025-07-02", count: 1 },
    { date: "2025-07-03", count: 3 },
    { date: "2025-07-04", count: 2 },
    { date: "2025-07-05", count: 0 },
    { date: "2025-07-06", count: 4 },
    { date: "2025-07-07", count: 1 },
    { date: "2025-07-08", count: 0 },
    { date: "2025-07-09", count: 2 },
    { date: "2025-07-10", count: 1 },
    { date: "2025-07-11", count: 3 },
    { date: "2025-07-12", count: 0 },
    { date: "2025-07-13", count: 2 },
    { date: "2025-07-14", count: 4 },
    { date: "2025-07-15", count: 1 },
    { date: "2025-07-16", count: 5 },
];

const ContributionGraph = () => {
    const weeks = 22;
    const days = 7;

    const colorMap = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e"];

    const cells = Array.from({ length: weeks * days }, (_, i) => {
        const item = dummyApiData[i % dummyApiData.length];
        return {
            date: item.date,
            count: item.count,
        };
    });
    return (
        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: "none" }}>
            <CardContent sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" fontWeight={600}>
                        16 contributions in the last year
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Contribution settings
                    </Typography>
                </Stack>

                <Box sx={{ mt: 2, overflowX: "auto" }}>
                    <Box sx={{ minWidth: 760 }}>
                        <Stack direction="row" spacing={0.5} sx={{ mb: 1, pl: 4 }}>
                            {["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
                                (m) => (
                                    <Typography key={m} variant="caption" color="text.secondary" sx={{ width: 42 }}>
                                        {m}
                                    </Typography>
                                )
                            )}
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <Stack spacing={1} sx={{ pt: 0.5, width: 28 }}>
                                {["Mon", "", "Wed", "", "Fri", "", ""].map((d, idx) => (
                                    <Typography key={idx} variant="caption" color="text.secondary" sx={{ height: 12 }}>
                                        {d}
                                    </Typography>
                                ))}
                            </Stack>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: `repeat(${weeks}, 12px)`,
                                    gap: 0.5,
                                }}
                            >
                                {cells.map((cell, idx) => {
                                    const level = Math.min(cell.count, 3);
                                    return (
                                        <Box
                                            key={idx}
                                            title={`${cell.date}: ${cell.count} contributions`}
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: "2px",
                                                bgcolor: colorMap[level],
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        </Stack>

                        <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Less
                            </Typography>
                            <Box sx={{ width: 12, height: 12, bgcolor: "#ebedf0", borderRadius: "2px" }} />
                            <Box sx={{ width: 12, height: 12, bgcolor: "#9be9a8", borderRadius: "2px" }} />
                            <Box sx={{ width: 12, height: 12, bgcolor: "#40c463", borderRadius: "2px" }} />
                            <Box sx={{ width: 12, height: 12, bgcolor: "#30a14e", borderRadius: "2px" }} />
                            <Typography variant="caption" color="text.secondary">
                                More
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default ContributionGraph

