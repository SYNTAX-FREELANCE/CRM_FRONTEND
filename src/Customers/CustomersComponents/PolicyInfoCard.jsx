// src/components/PolicyInfoCard.jsx
import React, { memo } from "react";
import { Box, Typography, Paper, Chip, Stack } from "@mui/material";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import TextsmsIcon from "@mui/icons-material/Textsms";
import DetailLine from "./DetailLine";

const themeColors = {
    orange: "#F57C00",
    orangeLight: "#FFF3E0",
    blue: "#1565C0",
    blueLight: "#E3F2FD",
    border: "#DCE8F7",
    textDark: "#1E293B",
    textLight: "#64748B",
};

const formatDate = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};



const PolicyInfoCard = ({ policy }) => {
    if (!policy) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1,
                borderRadius: 4,
                border: `1px solid ${themeColors.border}`,
                my: 1,
                width: { xs: "100%", lg: "50%" },
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                sx={{ mb: 2, borderBottom: "2px solid #c1b8b856", py: 1 }}
            >
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                        }}
                    >
                        <LocationCityIcon sx={{ color: "#ef410c" }} />
                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: "#111827",
                                lineHeight: 1,
                                fontSize: { xs: 15, sm: 20 },
                            }}
                        >
                            {policy?.company_name?.toUpperCase() || "Insurer"}
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            color: themeColors.textLight,
                            fontSize: { xs: 8, sm: 10 },
                            fontWeight: 800,
                        }}
                    >
                        POLICY NO : {policy?.policy_number}
                    </Typography>
                </Box>
                <Chip
                    label={policy?.policy_status || "UNKNOWN"}
                    sx={{
                        bgcolor:
                            policy?.policy_status === "ACTIVE"
                                ? "rgba(21, 101, 192, 0.1)"
                                : "rgba(245, 124, 0, 0.12)",
                        color:
                            policy?.policy_status === "ACTIVE"
                                ? themeColors.blue
                                : themeColors.orange,
                        fontWeight: 800,
                        fontSize: 10,
                    }}
                />
            </Stack>

            <Stack spacing={1.25}>
                <DetailLine
                    label="Vehicle"
                    value={`${policy.vehicle_maker} ${policy.model}`}
                />
                <DetailLine label="Reg No" value={policy.registration_number} />
                <DetailLine label="Engine No" value={policy.engine_number || "-"} />
                <DetailLine label="Chassis No" value={policy.chassis_number || "-"} />
                <DetailLine label="Start Date" value={formatDate(policy.start_date)} />
                <DetailLine label="Expiry Date" value={formatDate(policy.expiry_date)} />
                <DetailLine label="Premium" value={`₹${policy.premium_amount}`} />
                <DetailLine
                    label="IDV"
                    value={`₹${policy.insured_declared_value}`}
                />
                <DetailLine label="Sold By" value={policy.sold_by || "-"} />
            </Stack>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                }}
            >
                <TextsmsIcon fontSize="10" />
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: themeColors.textLight,
                        mb: 1,
                        fontSize: { xs: 12, sm: 14 },
                    }}
                >
                    Remarks
                </Typography>
            </Box>

            <Typography
                variant="body2"
                sx={{
                    color: themeColors.textDark,
                    fontSize: { xs: 10, sm: 14 },
                    fontWeight: 800,
                }}
            >
                {policy.remarks || "-"}
            </Typography>
        </Paper>
    );
};

export default memo(PolicyInfoCard);