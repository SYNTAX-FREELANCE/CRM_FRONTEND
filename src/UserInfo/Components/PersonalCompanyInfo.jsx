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
        blue: { bg: "rgba(59, 130, 246, 0.04)", iconBg: "rgba(59, 130, 246, 0.12)", iconColor: "#2563eb", border: "rgba(59, 130, 246, 0.15)" },
        indigo: { bg: "rgba(99, 102, 241, 0.04)", iconBg: "rgba(99, 102, 241, 0.12)", iconColor: "#4f46e5", border: "rgba(99, 102, 241, 0.15)" },
        teal: { bg: "rgba(20, 184, 166, 0.04)", iconBg: "rgba(20, 184, 166, 0.12)", iconColor: "#0d9488", border: "rgba(20, 184, 166, 0.15)" },
        orange: { bg: "rgba(249, 115, 22, 0.04)", iconBg: "rgba(249, 115, 22, 0.12)", iconColor: "#ea580c", border: "rgba(249, 115, 22, 0.15)" },
        amber: { bg: "rgba(245, 158, 11, 0.04)", iconBg: "rgba(245, 158, 11, 0.12)", iconColor: "#d97706", border: "rgba(245, 158, 11, 0.15)" },
        warning: { bg: "rgba(234, 179, 8, 0.04)", iconBg: "rgba(234, 179, 8, 0.12)", iconColor: "#ca8a04", border: "rgba(234, 179, 8, 0.15)" },
    };
    return schemas[color] || schemas.blue;
};

const InfoRow = ({ icon, label, value, color = "blue", copyable = false, handleCopyToClipboard }) => {
    const theme = getColorStyles(color);
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: "12px",
                bgcolor: theme.bg,
                border: `1px solid ${theme.border}`,
                minWidth: 0,
                transition: "0.2s",
                "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.015)"
                }
            }}
        >
            <Avatar
                variant="soft"
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: theme.iconBg,
                    color: theme.iconColor
                }}
            >
                {icon}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, fontSize: "10.5px" }}>
                    {label}
                </Typography>
                <Typography level="body-sm" sx={{ color: "#1e1b4b", fontWeight: 800, mt: 0.25 }} noWrap>
                    {value}
                </Typography>
            </Box>
            {copyable && value && value !== "-" && (
                <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleCopyToClipboard(value, label)}
                    sx={{
                        borderRadius: "50%",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.04)" }
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
            <Grid xs={12} sm={6} md={4}>
                <Box sx={{ p: 1, borderRadius: "18px", bgcolor: "#f8fafc", border: "1px solid rgba(0,0,0,0.01)" }}>
                    <Typography level="title-sm" sx={{ fontWeight: 900, color: "#1e1b4b", display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
                        <Person sx={{ color: "#4f46e5", fontSize: 20 }} />
                        Personal Information
                    </Typography>
                    <Divider sx={{ mb: 1, opacity: 0.6 }} />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: 2
                        }}
                    >
                        <InfoRow icon={<Badge />} label="Employee ID" value={displayEmployee.employee_id} color="blue" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoRow icon={<Person />} label="Gender" value={displayEmployee.gender} color="indigo" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoRow icon={<PhoneAndroid />} label="Mobile" value={displayEmployee.mobile} color="teal" copyable={true} handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoRow icon={<Email />} label="Email" value={displayEmployee.email} color="blue" copyable={true} handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoRow icon={<CalendarMonth />} label="DOB" value={displayEmployee.dob} color="orange" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoRow icon={<LocationOn />} label="Address" value={displayEmployee.address} color="amber" handleCopyToClipboard={handleCopyToClipboard} />
                    </Box>
                </Box>
            </Grid>

            {/* Company Information */}
            <Grid xs={12} sm={6} md={4}>
                <Box sx={{ p: 1, borderRadius: "18px", bgcolor: "#f8fafc", border: "1px solid rgba(0,0,0,0.01)" }}>
                    <Typography level="title-sm" sx={{ fontWeight: 900, color: "#1e1b4b", display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
                        <Business sx={{ color: "#ea580c", fontSize: 20 }} />
                        Company Information
                    </Typography>
                    <Divider sx={{ mb: 2, opacity: 0.6 }} />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: 2
                        }}
                    >
                        <InfoRow icon={<Business />} label="Company" value={displayEmployee.company} color="blue" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoRow icon={<Work />} label="Designation" value={displayEmployee.role} color="teal" handleCopyToClipboard={handleCopyToClipboard} />
                        <InfoRow icon={<CalendarMonth />} label="Joining Date" value={displayEmployee.joining} color="blue" handleCopyToClipboard={handleCopyToClipboard} />
                    </Box>
                </Box>
            </Grid>
        </>
    );
};

export default PersonalCompanyInfo;
