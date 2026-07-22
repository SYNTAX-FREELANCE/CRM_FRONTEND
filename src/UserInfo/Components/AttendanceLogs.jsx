import React from "react";
import { Card, Box, Typography, Grid, CircularProgress } from "@mui/joy";

const AttendanceLogs = ({
    attendanceDate,
    setAttendanceDate,
    loadingAttendance,
    attendanceData
}) => {
    return (
        <Card
            sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: "24px",
                bgcolor: "white",
                border: "1px solid rgba(0,0,0,0.02)",
                boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                height: { xs: "auto", md: "390px" }
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    mb: 2.5,
                    gap: 1.5
                }}
            >
                <Box>
                    <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b" }}>
                        Attendance Session
                    </Typography>
                </Box>
                <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                    <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        style={{
                            border: "1px solid rgba(0,0,0,0.08)",
                            background: "#f8fafc",
                            fontSize: "12px",
                            fontWeight: 800,
                            padding: "6px 12px",
                            borderRadius: "8px",
                            color: "#1e1b4b",
                            fontFamily: "inherit",
                            outline: "none",
                            cursor: "pointer",
                            width: "100%",
                            boxSizing: "border-box"
                        }}
                    />
                </Box>
            </Box>

            {loadingAttendance ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress size="sm" />
                </Box>
            ) : attendanceData ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Check In / Out Cards */}
                    <Grid container spacing={2}>
                        <Grid xs={6}>
                            <Box
                                sx={{
                                    p: { xs: 1.5, sm: 2 },
                                    borderRadius: "16px",
                                    bgcolor: "rgba(16, 185, 129, 0.04)",
                                    border: "1px solid rgba(16, 185, 129, 0.12)",
                                    textAlign: "center"
                                }}
                            >
                                <Typography
                                    level="body-xs"
                                    sx={{
                                        color: "success.700",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                        fontSize: { xs: "9px", sm: "10px" },
                                        letterSpacing: "0.2px"
                                    }}
                                >
                                    First Log In
                                </Typography>
                                <Typography
                                    level="title-md"
                                    sx={{
                                        fontWeight: 900,
                                        color: "#10b981",
                                        fontFamily: "monospace",
                                        mt: 1,
                                        fontSize: { xs: "12px", sm: "14px" }
                                    }}
                                >
                                    {attendanceData.first_login ? new Date(attendanceData.first_login).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid xs={6}>
                            <Box
                                sx={{
                                    p: { xs: 1.5, sm: 2 },
                                    borderRadius: "16px",
                                    bgcolor: "rgba(249, 115, 22, 0.04)",
                                    border: "1px solid rgba(249, 115, 22, 0.12)",
                                    textAlign: "center"
                                }}
                            >
                                <Typography
                                    level="body-xs"
                                    sx={{
                                        color: "orange.700",
                                        fontWeight: 800,
                                        textTransform: "uppercase",
                                        fontSize: { xs: "9px", sm: "10px" },
                                        letterSpacing: "0.2px"
                                    }}
                                >
                                    Last Log Out
                                </Typography>
                                <Typography
                                    level="title-md"
                                    sx={{
                                        fontWeight: 900,
                                        color: "#ea580c",
                                        fontFamily: "monospace",
                                        mt: 1,
                                        fontSize: { xs: "12px", sm: "14px" }
                                    }}
                                >
                                    {attendanceData.last_logout ? new Date(attendanceData.last_logout).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Productivity hours */}
                    <Box
                        sx={{
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: "16px",
                            bgcolor: "rgba(59, 130, 246, 0.04)",
                            border: "1px solid rgba(59, 130, 246, 0.12)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <Box>
                            <Typography
                                level="body-xs"
                                sx={{
                                    color: "primary.700",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    fontSize: { xs: "9px", sm: "10px" },
                                    letterSpacing: "0.2px"
                                }}
                            >
                                Productivity
                            </Typography>
                            <Typography
                                level="title-sm"
                                sx={{
                                    fontWeight: 800,
                                    color: "#1e1b4b",
                                    mt: 0.5,
                                    fontSize: { xs: "11px", sm: "13px" }
                                }}
                            >
                                Total Hours Logged
                            </Typography>
                        </Box>
                        <Typography
                            level="h3"
                            sx={{
                                fontWeight: 900,
                                color: "#2563eb",
                                fontFamily: "monospace",
                                fontSize: { xs: "16px", sm: "18px" }
                            }}
                        >
                            {attendanceData.total_productivity_hours ? `${Number(attendanceData.total_productivity_hours).toFixed(2)} Hrs` : "0.00 Hrs"}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        p: 3,
                        borderRadius: "18px",
                        bgcolor: "rgba(241, 245, 249, 0.5)",
                        border: "1px dashed rgba(0,0,0,0.1)",
                        textAlign: "center"
                    }}
                >
                    <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700 }}>
                        No attendance records found for this date.
                    </Typography>
                </Box>
            )}
        </Card>
    );
};

export default AttendanceLogs;
