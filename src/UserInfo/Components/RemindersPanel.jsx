import React from "react";
import { Card, Typography, Stack, Box, Avatar, Chip } from "@mui/joy";
import { AccessTimeIcon } from "./Icons";

const RemindersPanel = ({
    selectedDate = new Date(),
    activeEvents = []
}) => {
    return (
        <Card
            sx={{
                p: 3,
                borderRadius: "24px",
                bgcolor: "white",
                border: "1px solid rgba(0,0,0,0.02)",
                boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                height: "100%"
            }}
        >
            <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b", mb: 2.5 }}>
                Tasks & Events ({selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
            </Typography>

            {activeEvents.length > 0 ? (
                <Stack spacing={2}>
                    {activeEvents.map((evt, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                                justifyContent: "space-between",
                                p: { xs: 2, sm: 2.5 },
                                borderRadius: "20px",
                                bgcolor: "#ffffff",
                                border: "1px solid rgba(0,0,0,0.05)",
                                borderLeft: `6px solid ${evt.lineBg}`,
                                boxShadow: "0 4px 15px rgba(15, 23, 42, 0.01)",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                gap: 2,
                                position: "relative",
                                "&:hover": {
                                    transform: "translateY(-3px)",
                                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
                                    borderColor: "rgba(0,0,0,0.08)",
                                    background: `linear-gradient(90deg, #ffffff 0%, ${evt.lineBg}04 100%)`
                                }
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0, pr: { xs: 10, sm: 0 } }}>
                                <Avatar
                                    variant="soft"
                                    sx={{
                                        width: { xs: 40, sm: 48 },
                                        height: { xs: 40, sm: 48 },
                                        bgcolor: `${evt.lineBg}1a`,
                                        color: evt.lineBg,
                                        fontWeight: 800,
                                        fontSize: { xs: "15px", sm: "18px" },
                                        borderRadius: "14px"
                                    }}
                                >
                                    {evt.title.charAt(0)}
                                </Avatar>

                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                        <Typography level="title-sm" sx={{ fontWeight: 800, color: "#1e1b4b", fontSize: { xs: "13px", sm: "14px" } }}>
                                            {evt.title}
                                        </Typography>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            sx={{
                                                bgcolor: `${evt.lineBg}1f`,
                                                color: evt.lineBg,
                                                fontWeight: 800,
                                                fontSize: { xs: "9px", sm: "11px" },
                                                borderRadius: "8px"
                                            }}
                                        >
                                            {evt.label}
                                        </Chip>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, flexWrap: "wrap" }}>
                                        <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, fontSize: { xs: "11px", sm: "12px" } }}>
                                            <strong>Model:</strong> {evt.model || "N/A"}
                                        </Typography>
                                        <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, fontSize: { xs: "11px", sm: "12px" } }}>
                                            <strong>Reg:</strong> {evt.registration_number || "N/A"}
                                        </Typography>
                                    </Box>

                                    {evt.remarks && (
                                        <Box
                                            sx={{
                                                mt: 1.5,
                                                p: 1.25,
                                                bgcolor: "#f8fafc",
                                                borderRadius: "10px",
                                                borderLeft: `3px solid ${evt.lineBg}`,
                                                maxWidth: "100%"
                                            }}
                                        >
                                            <Typography level="body-xs" sx={{ color: "neutral.600", fontStyle: "italic", fontWeight: 650, fontSize: { xs: "11px", sm: "12px" } }}>
                                                "{evt.remarks}"
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    position: { xs: "absolute", sm: "static" },
                                    top: { xs: 16, sm: "auto" },
                                    right: { xs: 16, sm: "auto" },
                                    display: "flex",
                                    alignItems: "center"
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, bgcolor: "#f1f5f9", px: { xs: 1, sm: 1.5 }, py: 0.5, borderRadius: "8px" }}>
                                    <AccessTimeIcon style={{ fontSize: 13, color: "#64748b" }} />
                                    <Typography level="body-xs" sx={{ fontWeight: 800, color: "#475569", fontFamily: "monospace", fontSize: { xs: "10px", sm: "12px" } }}>
                                        {evt.time}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            ) : (
                <Box sx={{ py: 6, textAlign: "center", bgcolor: "#f8fafc", borderRadius: "20px", border: "1px dashed rgba(0,0,0,0.08)" }}>
                    <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700 }}>
                        No tasks or events scheduled for this day
                    </Typography>
                </Box>
            )}
        </Card>
    );
};

export default RemindersPanel;
