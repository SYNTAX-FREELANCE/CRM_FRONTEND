import React from "react";
import { Grid, Box, Typography, Divider, Avatar, IconButton } from "@mui/joy";
import {
    Badge,
    Person,
    PhoneAndroid,
    Email,
    CalendarMonth,
    LocationOn,
    Business,
    Work,
    ContentCopy
} from "@mui/icons-material";

const getColorStyles = (color) => {
    const schemas = {
        blue: { bg: "rgba(59, 130, 246, 0.04)", iconBg: "rgba(59, 130, 246, 0.12)", iconColor: "#2563eb", border: "rgba(59, 130, 246, 0.12)", shadow: "rgba(37, 99, 235, 0.08)" },
        indigo: { bg: "rgba(99, 102, 241, 0.04)", iconBg: "rgba(99, 102, 241, 0.12)", iconColor: "#4f46e5", border: "rgba(99, 102, 241, 0.12)", shadow: "rgba(79, 70, 229, 0.08)" },
        teal: { bg: "rgba(20, 184, 166, 0.04)", iconBg: "rgba(20, 184, 166, 0.12)", iconColor: "#0d9488", border: "rgba(20, 184, 166, 0.12)", shadow: "rgba(13, 148, 136, 0.08)" },
        orange: { bg: "rgba(249, 115, 22, 0.04)", iconBg: "rgba(249, 115, 22, 0.12)", iconColor: "#ea580c", border: "rgba(249, 115, 22, 0.12)", shadow: "rgba(234, 88, 12, 0.08)" },
        amber: { bg: "rgba(245, 158, 11, 0.04)", iconBg: "rgba(245, 158, 11, 0.12)", iconColor: "#d97706", border: "rgba(245, 158, 11, 0.12)", shadow: "rgba(217, 119, 6, 0.08)" },
    };
    return schemas[color] || schemas.blue;
};

const InfoTile = ({ icon, label, value, color = "blue", copyable = false, handleCopyToClipboard, fullWidth = false }) => {
    const theme = getColorStyles(color);
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 1.75,
                borderRadius: "14px",
                bgcolor: theme.bg,
                border: `1px solid ${theme.border}`,
                gridColumn: fullWidth ? { xs: "1", sm: "1 / -1" } : "span 1",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: theme.iconColor,
                    boxShadow: `0 6px 16px ${theme.shadow}`
                }
            }}
        >
            <Avatar
                variant="soft"
                sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    bgcolor: theme.iconBg,
                    color: theme.iconColor,
                    flexShrink: 0,
                    mt: 0.25
                }}
            >
                {icon}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography level="body-xs" sx={{ color: "#64748b", fontWeight: 700, fontSize: "11px", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                    {label}
                </Typography>
                <Typography
                    level="body-sm"
                    sx={{
                        color: "#0f172a",
                        fontWeight: 750,
                        mt: 0.25,
                        fontSize: "13.5px",
                        lineHeight: 1.45,
                        wordBreak: "break-word",
                        whiteSpace: "normal"
                    }}
                >
                    {value || "-"}
                </Typography>
            </Box>
            {copyable && value && value !== "-" && (
                <IconButton
                    size="sm"
                    variant="soft"
                    color="neutral"
                    onClick={() => handleCopyToClipboard(value, label)}
                    sx={{
                        borderRadius: "8px",
                        flexShrink: 0,
                        opacity: 0.8,
                        "&:hover": { opacity: 1, bgcolor: "rgba(0,0,0,0.06)" }
                    }}
                >
                    <ContentCopy sx={{ fontSize: 13 }} />
                </IconButton>
            )}
        </Box>
    );
};

const PersonalCompanyInfo = ({
    displayEmployee,
    handleCopyToClipboard
}) => {
    return (
        <>
            {/* Personal Information */}
            <Grid xs={12} md={6}>
                <Box
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: "20px",
                        bgcolor: "#ffffff",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
                        height: "100%",
                        boxSizing: "border-box"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar variant="soft" sx={{ bgcolor: "rgba(79, 70, 229, 0.1)", color: "#4f46e5", borderRadius: "12px", width: 40, height: 40 }}>
                                <Person sx={{ fontSize: 22 }} />
                            </Avatar>
                            <Box>
                                <Typography level="title-md" sx={{ fontWeight: 850, color: "#0f172a" }}>
                                    Personal Information
                                </Typography>
                                <Typography level="body-xs" sx={{ color: "#64748b", fontWeight: 600 }}>
                                    Primary identity & contact details
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2.5, opacity: 0.6 }} />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                            gap: 2
                        }}
                    >
                        <InfoTile icon={<Badge />} label="Employee ID" value={displayEmployee?.employee_id} color="blue" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoTile icon={<Person />} label="Gender" value={displayEmployee?.gender} color="indigo" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoTile icon={<PhoneAndroid />} label="Mobile" value={displayEmployee?.mobile} color="teal" copyable={true} handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoTile icon={<CalendarMonth />} label="Date of Birth" value={displayEmployee?.dob} color="orange" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoTile icon={<Email />} label="Email Address" value={displayEmployee?.email} color="blue" copyable={true} fullWidth={true} handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoTile icon={<LocationOn />} label="Residential Address" value={displayEmployee?.address} color="amber" fullWidth={true} handleCopyToClipboard={handleCopyToClipboard} />
                    </Box>
                </Box>
            </Grid>

            {/* Company Information */}
            <Grid xs={12} md={6}>
                <Box
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: "20px",
                        bgcolor: "#ffffff",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
                        height: "100%",
                        boxSizing: "border-box"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar variant="soft" sx={{ bgcolor: "rgba(234, 88, 12, 0.1)", color: "#ea580c", borderRadius: "12px", width: 40, height: 40 }}>
                                <Business sx={{ fontSize: 22 }} />
                            </Avatar>
                            <Box>
                                <Typography level="title-md" sx={{ fontWeight: 850, color: "#0f172a" }}>
                                    Company Information
                                </Typography>
                                <Typography level="body-xs" sx={{ color: "#64748b", fontWeight: 600 }}>
                                    Corporate role & employment history
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2.5, opacity: 0.6 }} />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                            gap: 2
                        }}
                    >
                        <InfoTile icon={<Business />} label="Company Name" value={displayEmployee?.company} color="blue" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoTile icon={<Work />} label="Designation / Role" value={displayEmployee?.role} color="teal" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoTile icon={<CalendarMonth />} label="Joining Date" value={displayEmployee?.joining} color="indigo" fullWidth={true} handleCopyToClipboard={handleCopyToClipboard} />
                    </Box>
                </Box>
            </Grid>
        </>
    );
};

export default PersonalCompanyInfo;
