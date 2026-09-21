import React from "react";
import {
    Box,
    Chip,
    Grid,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import FiberNewRoundedIcon from "@mui/icons-material/FiberNewRounded";

const InfoItem = ({
    icon,
    label,
    value,
    color = "#2563eb",
    isDark,
}) => {
    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
                minWidth: 0,
            }}
        >
            <Box
                sx={{
                    width: 30,
                    height: 30,
                    flexShrink: 0,
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: isDark
                        ? `${color}18`
                        : `${color}0d`,
                    color,
                    border: `1px solid ${color}20`,
                    "& svg": {
                        fontSize: 17,
                    },
                }}
            >
                {icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: 8,
                        fontWeight: 900,
                        letterSpacing: 0.7,
                        color: "#94a3b8",
                        lineHeight: 1,
                        mb: 0.45,
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    title={value}
                    sx={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: isDark ? "#f8fafc" : "#0f172a",
                        lineHeight: 1.15,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {value || "-"}
                </Typography>
            </Box>
        </Stack>
    );
};

const LeadInfoCard = ({
    selectedLead,
    selectedCustomer,
    selectedVehicle,
    currentEmployee,
    currentStatus,
    statusColor,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                px: 1.5,
                py: 1.35,
                borderRadius: 3,
                border: isDark
                    ? "1px solid rgba(255,255,255,.08)"
                    : "1px solid #e2e8f0",
                bgcolor: isDark
                    ? "rgba(15,23,42,.72)"
                    : "#fff",
                boxShadow: isDark
                    ? "0 8px 25px rgba(0,0,0,.18)"
                    : "0 6px 22px rgba(15,23,42,.055)",
            }}
        >
            {/* Decorative glow */}
            <Box
                sx={{
                    position: "absolute",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    right: -45,
                    top: -55,
                    bgcolor: isDark
                        ? "rgba(37,99,235,.08)"
                        : "rgba(37,99,235,.045)",
                    pointerEvents: "none",
                }}
            />

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.25 }}
            >
                <Stack
                    direction="row"
                    spacing={0.8}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: 25,
                            height: 25,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#2563eb12",
                            color: "#2563eb",
                        }}
                    >
                        <FiberNewRoundedIcon
                            sx={{ fontSize: 16 }}
                        />
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 0.7,
                            color: isDark
                                ? "#e2e8f0"
                                : "#334155",
                        }}
                    >
                        LEAD DETAILS
                    </Typography>
                </Stack>

                <Chip
                    label={currentStatus || "-"}
                    size="small"
                    sx={{
                        height: 24,
                        px: 0.5,
                        borderRadius: 1.5,
                        fontSize: 9,
                        fontWeight: 900,
                        color: statusColor,
                        bgcolor: `${statusColor}10`,
                        border: `1px solid ${statusColor}30`,
                    }}
                />
            </Stack>

            <Grid
                container
                alignItems="center"
                spacing={1.5}
            >
                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                    <InfoItem
                        icon={<TagOutlinedIcon />}
                        label="LEAD"
                        value={`#${selectedLead?.lead_id || "-"}`}
                        color="#2563eb"
                        isDark={isDark}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <InfoItem
                        icon={<PersonOutlineRoundedIcon />}
                        label="CUSTOMER"
                        value={
                            selectedCustomer?.customer
                                ?.customer_name || "-"
                        }
                        color="#7c3aed"
                        isDark={isDark}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                    <InfoItem
                        icon={<PhoneOutlinedIcon />}
                        label="MOBILE"
                        value={
                            selectedCustomer?.customer
                                ?.mobile_number_1 || "-"
                        }
                        color="#16a34a"
                        isDark={isDark}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                    <InfoItem
                        icon={<BadgeOutlinedIcon />}
                        label="CURRENT EMPLOYEE"
                        value={currentEmployee}
                        color="#f97316"
                        isDark={isDark}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default LeadInfoCard;
