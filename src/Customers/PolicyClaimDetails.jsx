import React, { memo } from "react";
import {
    Box,
    Grid,
    Typography,
    Chip,
    Divider,
} from "@mui/material";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const PolicyClaimDetails = ({ claims = [], isDark }) => {

    const formatDate = (value) => {
        if (!value) return "-";

        const date = new Date(value);

        if (isNaN(date.getTime())) return "-";

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatDateTime = (value) => {
        if (!value) return "-";

        const date = new Date(value);

        if (isNaN(date.getTime())) return "-";

        return date.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case "APPROVED":
                return {
                    background: "#DCFCE7",
                    color: "#15803D",
                };

            case "REJECTED":
                return {
                    background: "#FEE2E2",
                    color: "#DC2626",
                };

            case "SETTLED":
                return {
                    background: "#DBEAFE",
                    color: "#1D4ED8",
                };

            case "PROCESSING":
                return {
                    background: "#FEF3C7",
                    color: "#B45309",
                };

            case "DRAFT":
            default:
                return {
                    background: isDark
                        ? "rgba(148,163,184,0.15)"
                        : "#F1F5F9",
                    color: isDark ? "#CBD5E1" : "#475569",
                };
        }
    };

    const DetailItem = ({
        icon,
        label,
        value,
        fullWidth = false,
    }) => (
        <Grid item xs={12} sm={6} md={fullWidth ? 12 : 4}>
            <Box
                sx={{
                    display: "flex",
                    gap: 1.2,
                    minHeight: 48,
                    alignItems: "flex-start",
                }}
            >
                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        minWidth: 30,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isDark
                            ? "rgba(249,115,22,0.12)"
                            : "#FFF7ED",
                        color: "#F57C00",
                    }}
                >
                    {icon}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: isDark ? "#94A3B8" : "#64748B",
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                            mb: 0.3,
                        }}
                    >
                        {label}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: isDark ? "#F8FAFC" : "#1E293B",
                            lineHeight: 1.4,
                            wordBreak: "break-word",
                        }}
                    >
                        {value || "-"}
                    </Typography>
                </Box>
            </Box>
        </Grid>
    );

    if (!claims?.length) {
        return (
            <Box
                sx={{
                    py: 5,
                    textAlign: "center",
                }}
            >
                <ConfirmationNumberOutlinedIcon
                    sx={{
                        fontSize: 40,
                        color: isDark ? "#64748B" : "#94A3B8",
                        mb: 1,
                    }}
                />

                <Typography
                    sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: isDark ? "#CBD5E1" : "#475569",
                    }}
                >
                    No claim details available
                </Typography>

                <Typography
                    sx={{
                        fontSize: 12,
                        color: isDark ? "#64748B" : "#94A3B8",
                        mt: 0.5,
                    }}
                >
                    No claims have been recorded for this policy.
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {claims.map((claim, index) => {

                const statusStyle = getStatusColor(
                    claim.claim_status
                );

                return (
                    <Box
                        key={claim.claim_id || index}
                        sx={{
                            mb: index !== claims.length - 1 ? 2 : 0,
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: isDark
                                ? "1px solid rgba(255,255,255,0.08)"
                                : "1px solid #E2E8F0",
                            background: isDark
                                ? "rgba(15,23,42,0.45)"
                                : "#FFFFFF",
                            boxShadow: isDark
                                ? "none"
                                : "0 2px 8px rgba(15,23,42,0.04)",
                        }}
                    >
                        {/* ================= HEADER ================= */}

                        <Box
                            sx={{
                                px: 2,
                                py: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                background: isDark
                                    ? "rgba(249,115,22,0.06)"
                                    : "#FFF8F2",
                                borderBottom: isDark
                                    ? "1px solid rgba(255,255,255,0.07)"
                                    : "1px solid #F1E5DA",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.2,
                                    minWidth: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        minWidth: 38,
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#FFF3E0",
                                        color: "#F57C00",
                                    }}
                                >
                                    <ConfirmationNumberOutlinedIcon
                                        fontSize="small"
                                    />
                                </Box>

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: isDark
                                                ? "#94A3B8"
                                                : "#64748B",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Claim {index + 1}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 800,
                                            color: isDark
                                                ? "#F8FAFC"
                                                : "#1E293B",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {claim.claim_number || "-"}
                                    </Typography>
                                </Box>
                            </Box>

                            <Chip
                                label={claim.claim_status || "UNKNOWN"}
                                size="small"
                                sx={{
                                    height: 25,
                                    fontSize: 10,
                                    fontWeight: 800,
                                    borderRadius: "6px",
                                    background: statusStyle.background,
                                    color: statusStyle.color,
                                    flexShrink: 0,
                                }}
                            />
                        </Box>

                        {/* ================= CLAIM INFORMATION ================= */}

                        <Box sx={{ p: 2 }}>

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    color: "#F57C00",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    mb: 1.5,
                                }}
                            >
                                Claim Information
                            </Typography>

                            <Grid container spacing={2}>

                                <DetailItem
                                    icon={
                                        <ConfirmationNumberOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Claim Number"
                                    value={claim.claim_number}
                                />

                                <DetailItem
                                    icon={
                                        <AccessTimeOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Claim Date"
                                    value={formatDate(claim.claim_date)}
                                />

                                <DetailItem
                                    icon={
                                        <PolicyOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Policy Number"
                                    value={claim.policy_number}
                                />

                                <DetailItem
                                    icon={
                                        <PolicyOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Insurance Company"
                                    value={claim.insurance_company_name}
                                />

                            </Grid>

                            <Divider
                                sx={{
                                    my: 2,
                                    borderColor: isDark
                                        ? "rgba(255,255,255,0.07)"
                                        : "#E2E8F0",
                                }}
                            />

                            {/* ================= ACCIDENT DETAILS ================= */}

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    color: "#F57C00",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    mb: 1.5,
                                }}
                            >
                                Accident Details
                            </Typography>

                            <Grid container spacing={2}>

                                <DetailItem
                                    icon={
                                        <AccessTimeOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Accident Date"
                                    value={formatDate(
                                        claim.accident_date
                                    )}
                                />

                                <DetailItem
                                    icon={
                                        <AccessTimeOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Accident Time"
                                    value={claim.accident_time}
                                />

                                <DetailItem
                                    icon={
                                        <LocationOnOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Accident Place"
                                    value={claim.accident_place}
                                />

                            </Grid>

                            <Divider
                                sx={{
                                    my: 2,
                                    borderColor: isDark
                                        ? "rgba(255,255,255,0.07)"
                                        : "#E2E8F0",
                                }}
                            />

                            {/* ================= VEHICLE / DRIVER ================= */}

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    color: "#F57C00",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    mb: 1.5,
                                }}
                            >
                                Vehicle & Driver
                            </Typography>

                            <Grid container spacing={2}>

                                <DetailItem
                                    icon={
                                        <PersonOutlineOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Customer Name"
                                    value={claim.customer_name}
                                />

                                <DetailItem
                                    icon={
                                        <DirectionsCarOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Registration Number"
                                    value={claim.registration_number}
                                />

                                <DetailItem
                                    icon={
                                        <PersonOutlineOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Driver Name"
                                    value={claim.driver_name}
                                />

                            </Grid>

                            <Divider
                                sx={{
                                    my: 2,
                                    borderColor: isDark
                                        ? "rgba(255,255,255,0.07)"
                                        : "#E2E8F0",
                                }}
                            />

                            {/* ================= REPAIR / INSPECTION ================= */}

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    color: "#F57C00",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    mb: 1.5,
                                }}
                            >
                                Repair & Inspection
                            </Typography>

                            <Grid container spacing={2}>

                                <DetailItem
                                    icon={
                                        <BuildOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Estimated Repair Cost"
                                    value={
                                        claim.estimated_repair_cost
                                            ? `₹${Number(
                                                claim.estimated_repair_cost
                                            ).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                            })}`
                                            : "-"
                                    }
                                />

                                <DetailItem
                                    icon={
                                        <LocationOnOutlinedIcon
                                            sx={{ fontSize: 17 }}
                                        />
                                    }
                                    label="Inspection Location"
                                    value={claim.inspection_location}
                                    fullWidth
                                />

                            </Grid>

                            <Divider
                                sx={{
                                    my: 2,
                                    borderColor: isDark
                                        ? "rgba(255,255,255,0.07)"
                                        : "#E2E8F0",
                                }}
                            />

                            {/* ================= SYSTEM DETAILS ================= */}

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 3,
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 9,
                                            fontWeight: 700,
                                            color: isDark
                                                ? "#64748B"
                                                : "#94A3B8",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Created
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: isDark
                                                ? "#CBD5E1"
                                                : "#64748B",
                                            mt: 0.3,
                                        }}
                                    >
                                        {formatDateTime(
                                            claim.created_at
                                        )}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 9,
                                            fontWeight: 700,
                                            color: isDark
                                                ? "#64748B"
                                                : "#94A3B8",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Last Updated
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: isDark
                                                ? "#CBD5E1"
                                                : "#64748B",
                                            mt: 0.3,
                                        }}
                                    >
                                        {formatDateTime(
                                            claim.updated_at
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default memo(PolicyClaimDetails);

