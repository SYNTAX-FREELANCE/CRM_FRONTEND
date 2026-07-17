import React from "react";
import { Card, Box, Typography, Avatar, Stack } from "@mui/joy";
import { StarIcon, StarHalfIcon, StarOutlineIcon } from "./Icons";

const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.3 && score % 1 <= 0.7;
    const halfStarCount = hasHalfStar ? 1 : 0;
    const emptyStars = Math.max(0, 5 - fullStars - halfStarCount);

    for (let i = 0; i < fullStars; i++) {
        stars.push(<StarIcon key={`full-${i}`} style={{ color: "#eab308", fontSize: 15 }} />);
    }
    if (hasHalfStar) {
        stars.push(<StarHalfIcon key="half" style={{ color: "#eab308", fontSize: 15 }} />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<StarOutlineIcon key={`empty-${i}`} style={{ color: "#cbd5e1", fontSize: 15 }} />);
    }
    return stars;
};

const OverallPerformance = ({
    overallScore = 0,
    conversionRate = 0,
    appointmentRate = 0,
    callbackQuoteRate = 0,
    lostRate = 0,
    overallStats = { soldCount: 0, total: 0, appointmentCount: 0, callbackCount: 0, quoteCount: 0, lostCount: 0 }
}) => {
    return (
        <Card
            sx={{
                p: 3,
                borderRadius: "24px",
                bgcolor: "white",
                border: "1px solid rgba(0,0,0,0.02)",
                boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}
        >
            <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b" }}>
                        Overall Performance
                    </Typography>
                    <Avatar size="sm" sx={{ bgcolor: "rgba(124, 58, 237, 0.08)", color: "#7c3aed", width: 28, height: 28 }}>
                        <StarIcon style={{ fontSize: 15 }} />
                    </Avatar>
                </Box>

                <Stack spacing={1.5}>
                    {/* Rating Star Panel */}
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", fontSize: "9px" }}>
                                Overall Rating Score
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "#7c3aed", fontWeight: 900 }}>
                                {overallScore > 0 ? `${overallScore} / 5.0` : "0.0 / 5.0"}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: "3px" }}>
                            {renderStars(overallScore)}
                        </Box>
                    </Box>

                    {/* Conversion Rate progress */}
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", fontSize: "9px" }}>
                                Lead Conversion Rate (SOLD)
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "#10b981", fontWeight: 900 }}>
                                {conversionRate.toFixed(1)}% ({overallStats.soldCount} / {overallStats.total})
                            </Typography>
                        </Box>
                        <Box sx={{ width: "100%", height: "6px", bgcolor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                            <Box sx={{ width: `${Math.min(conversionRate, 100)}%`, height: "100%", bgcolor: "#10b981", borderRadius: "3px" }} />
                        </Box>
                    </Box>

                    {/* Appointment Booking Rate */}
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", fontSize: "9px" }}>
                                Appointment Booking Rate
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "#3b82f6", fontWeight: 900 }}>
                                {appointmentRate.toFixed(1)}% ({overallStats.appointmentCount} / {overallStats.total})
                            </Typography>
                        </Box>
                        <Box sx={{ width: "100%", height: "6px", bgcolor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                            <Box sx={{ width: `${Math.min(appointmentRate, 100)}%`, height: "100%", bgcolor: "#3b82f6", borderRadius: "3px" }} />
                        </Box>
                    </Box>

                    {/* Callback & Quote Rate */}
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", fontSize: "9px" }}>
                                Interest & Follow-up Rate
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "#7c3aed", fontWeight: 900 }}>
                                {callbackQuoteRate.toFixed(1)}% ({overallStats.callbackCount + overallStats.quoteCount} / {overallStats.total})
                            </Typography>
                        </Box>
                        <Box sx={{ width: "100%", height: "6px", bgcolor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                            <Box sx={{ width: `${Math.min(callbackQuoteRate, 100)}%`, height: "100%", bgcolor: "#7c3aed", borderRadius: "3px" }} />
                        </Box>
                    </Box>

                    {/* Lost Rate progress */}
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", fontSize: "9px" }}>
                                Lost Lead Rate
                            </Typography>
                            <Typography level="body-xs" sx={{ color: "#ef4444", fontWeight: 900 }}>
                                {lostRate.toFixed(1)}% ({overallStats.lostCount} / {overallStats.total})
                            </Typography>
                        </Box>
                        <Box sx={{ width: "100%", height: "6px", bgcolor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                            <Box sx={{ width: `${Math.min(lostRate, 100)}%`, height: "100%", bgcolor: "#ef4444", borderRadius: "3px" }} />
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Card>
    );
};

export default OverallPerformance;
