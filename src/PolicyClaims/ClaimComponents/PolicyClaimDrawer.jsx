
import React, { memo, useCallback, useEffect, useState } from "react";
import {
    Box,
    Drawer,
    Typography,
    IconButton,
    Divider,
    Chip,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Stack,
    CircularProgress,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { format, parseISO, isValid } from "date-fns";
import { usePolicyClaimStatusMaster } from "../../CommonCode/useQuery";
import { axioslogin } from "../../Connection/axios";
import { errorNotify, successNotify } from "../../constant/Constant";

const FONT = "Bahnschrift";

const PolicyClaimDrawer = ({ open, onClose, claim, refetch }) => {
    const { data: statuses = [] } = usePolicyClaimStatusMaster();

    const [selectedStatusId, setSelectedStatusId] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (claim) {
            setSelectedStatusId(Number(claim.claim_status_id));
        }
    }, [claim]);



    const handleUpdateClaimStatus = useCallback(async () => {
        if (!claim?.claim_id || !selectedStatusId) return;

        try {
            setSaving(true);

            const response = await axioslogin.patch(
                `/policyclaim/update-status/${claim.claim_id}/${selectedStatusId}`
            );

            const { success, message } = response.data ?? {};

            if (success === 1) {
                successNotify(message || "Claim status updated successfully");
                onClose();
                refetch()
            } else {
                errorNotify(message || "Failed to update claim status");
            }
        } catch (error) {
            errorNotify(
                error.response?.data?.message || "Error updating claim status"
            );
        } finally {
            setSaving(false);
        }
    }, [claim?.claim_id, selectedStatusId, onClose]);


    const formatDate = (value) => {
        if (!value) return "-";

        const date =
            typeof value === "string" ? parseISO(value) : new Date(value);

        return isValid(date) ? format(date, "dd/MM/yyyy") : "-";
    };

    const formatAmount = (value) => {
        if (value === null || value === undefined || value === "") {
            return "-";
        }

        return `₹ ${Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const DetailItem = ({ label, value }) => (
        <Box sx={{ minWidth: 0 }}>
            <Typography
                sx={{
                    fontFamily: FONT,
                    fontSize: 10,
                    fontWeight: 700,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    mb: 0.4,
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontFamily: FONT,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "text.primary",
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap",
                }}
            >
                {value || "-"}
            </Typography>
        </Box>
    );

    const SectionTitle = ({ children }) => (
        <Typography
            sx={{
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 800,
                color: "text.primary",
                mb: 1.5,
            }}
        >
            {children}
        </Typography>
    );

    if (!claim) return null;

    const selectedStatus = statuses?.find(
        (item) =>
            Number(item.claim_status_id) === Number(selectedStatusId)
    );

    const activeStatuses = statuses?.filter(
        (item) => Number(item.is_active) === 1
    );

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 480, md: 520 },
                    maxWidth: "100%",
                    fontFamily: FONT,
                },
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: FONT,
                    "& .MuiTypography-root": {
                        fontFamily: FONT,
                    },
                    "& .MuiButton-root": {
                        fontFamily: FONT,
                    },
                    "& .MuiInputBase-root": {
                        fontFamily: FONT,
                    },
                    "& .MuiMenuItem-root": {
                        fontFamily: FONT,
                    },
                }}
            >
                {/* Header */}
                <Box sx={{ px: 2.5, py: 2 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 17,
                                    fontWeight: 900,
                                }}
                            >
                                Claim Details
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: "text.secondary",
                                    mt: 0.3,
                                }}
                            >
                                {claim.claim_number}
                            </Typography>
                        </Box>

                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Box>

                <Divider />

                {/* Content */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        px: 2.5,
                        py: 2,

                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE / Edge

                        "&::-webkit-scrollbar": {
                            display: "none", // Chrome / Safari
                        },
                    }}
                >
                    {/* Status */}
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            mb: 2.5,
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1.5}
                        >
                            <Typography fontSize={13} fontWeight={800}>
                                Claim Status
                            </Typography>

                            <Chip
                                size="small"
                                label={
                                    selectedStatus?.claim_status_name ||
                                    claim.claim_status ||
                                    "Unknown"
                                }
                                sx={{
                                    fontFamily: FONT,
                                    fontWeight: 700,
                                    fontSize: 11,
                                    color:
                                        selectedStatus?.claim_status_color ||
                                        "#64748b",
                                    backgroundColor: `${selectedStatus?.claim_status_color ||
                                        "#64748b"
                                        }18`,
                                }}
                            />
                        </Stack>

                        <FormControl fullWidth size="small">
                            <InputLabel sx={{ fontFamily: FONT }}>
                                Change Status
                            </InputLabel>

                            <Select
                                value={selectedStatusId}
                                label="Change Status"
                                onChange={(e) =>
                                    setSelectedStatusId(e.target.value)
                                }
                                sx={{ fontFamily: FONT }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            fontFamily: FONT,
                                            "& .MuiMenuItem-root": {
                                                fontFamily: FONT,
                                            },
                                        },
                                    },
                                }}
                            >
                                {activeStatuses.map((item) => (
                                    <MenuItem
                                        key={item.claim_status_id}
                                        value={Number(item.claim_status_id)}
                                    >
                                        {item.claim_status_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Claim Information */}
                    <Box mb={2.5}>
                        <SectionTitle>Claim Information</SectionTitle>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <DetailItem
                                    label="Claim Number"
                                    value={claim.claim_number}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <DetailItem
                                    label="Claim Date"
                                    value={formatDate(claim.claim_date)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DetailItem
                                    label="Policy Number"
                                    value={claim.policy_number}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DetailItem
                                    label="Insurance Company"
                                    value={claim.insurance_company_name}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Customer and Vehicle */}
                    <Box mb={2.5}>
                        <SectionTitle>Customer & Vehicle</SectionTitle>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <DetailItem
                                    label="Customer Name"
                                    value={claim.customer_name}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <DetailItem
                                    label="Registration Number"
                                    value={claim.registration_number}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <DetailItem
                                    label="Customer ID"
                                    value={claim.customer_id}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Accident Information */}
                    <Box mb={2.5}>
                        <SectionTitle>Accident Information</SectionTitle>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <DetailItem
                                    label="Accident Date"
                                    value={formatDate(claim.accident_date)}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <DetailItem
                                    label="Accident Time"
                                    value={claim.accident_time}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DetailItem
                                    label="Accident Place"
                                    value={claim.accident_place}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DetailItem
                                    label="Accident Description"
                                    value={claim.accident_description}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Driver Information */}
                    <Box mb={2.5}>
                        <SectionTitle>Driver Information</SectionTitle>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <DetailItem
                                    label="Driver Name"
                                    value={claim.driver_name}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DetailItem
                                    label="Driver Address"
                                    value={claim.driver_address}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <DetailItem
                                    label="Driver Age"
                                    value={claim.driver_age}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <DetailItem
                                    label="Relationship"
                                    value={claim.driver_relationship}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DetailItem
                                    label="Driving License"
                                    value={claim.driver_license}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Other Information */}
                    <Box mb={2}>
                        <SectionTitle>Other Information</SectionTitle>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <DetailItem
                                    label="Estimated Repair Cost"
                                    value={formatAmount(
                                        claim.estimated_repair_cost
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DetailItem
                                    label="Inspection Location"
                                    value={claim.inspection_location}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DetailItem
                                    label="Other Insurance Policy"
                                    value={claim.other_insurance_policy_no}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DetailItem
                                    label="Remarks"
                                    value={claim.remarks}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                {/* Footer */}
                <Divider />

                <Box sx={{ p: 2, display: "flex", gap: 1.5 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        onClick={onClose}
                        disabled={saving}
                        sx={{ textTransform: "none", fontWeight: 700 }}
                    >
                        Close
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={
                            saving ? (
                                <CircularProgress
                                    size={16}
                                    color="inherit"
                                />
                            ) : (
                                <SaveOutlinedIcon />
                            )
                        }
                        onClick={handleUpdateClaimStatus}
                        disabled={
                            saving ||
                            !selectedStatusId ||
                            Number(selectedStatusId) ===
                            Number(claim.claim_status_id)
                        }
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            boxShadow: "none",
                        }}
                    >
                        {saving ? "Saving..." : "Update Status"}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default memo(PolicyClaimDrawer);
