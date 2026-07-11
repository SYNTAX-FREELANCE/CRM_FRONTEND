import React, { memo } from "react";
import {
    Box,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography,
    Divider,
    Chip,
    InputAdornment,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

const compactInput = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        fontSize: 13,
    },
    "& .MuiInputLabel-root": {
        fontSize: 13,
    },
};

const PolicyDetailsForm = ({
    policyData,
    setPolicyData,
    insuranceCompanies = [],
}) => {
    const handleChange = (field) => (event) => {
        setPolicyData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    return (
        <Box
            sx={{
                p: 2.5,
                bgcolor: "#fff",
                borderRadius: 3,
            }}>
            <Divider sx={{ mb: 3 }}>
                <Chip
                    icon={<VerifiedIcon />}
                    label="Policy Details"
                    color="success"
                    sx={{ fontWeight: 700 }}
                />
            </Divider>

            <Grid container spacing={2}>
                {/* Insurance Company */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Insurance Company"
                        value={policyData.insurance_company_id || ""}
                        onChange={handleChange("insurance_company_id")}
                        sx={compactInput}
                    >
                        {insuranceCompanies?.map((company) => (
                            <MenuItem
                                key={company.insurance_company_id}
                                value={company.insurance_company_id}
                            >
                                {company.company_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Policy Number */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Policy Number"
                        value={policyData.policy_number || ""}
                        onChange={handleChange("policy_number")}
                        sx={compactInput}
                    />
                </Grid>

                {/* Renewal Cycle */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Renewal Cycle"
                        value={policyData.renewal_cycle || ""}
                        onChange={handleChange("renewal_cycle")}
                        sx={compactInput}
                    >
                        <MenuItem value="Annual">Annual</MenuItem>
                        <MenuItem value="Half Yearly">
                            Half Yearly
                        </MenuItem>
                        <MenuItem value="Quarterly">
                            Quarterly
                        </MenuItem>
                    </TextField>
                </Grid>

                {/* Start Date */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        value={policyData.start_date || ""}
                        onChange={handleChange("start_date")}
                        sx={compactInput}
                    />
                </Grid>

                {/* Expiry Date */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Expiry Date"
                        InputLabelProps={{ shrink: true }}
                        value={policyData.expiry_date || ""}
                        onChange={handleChange("expiry_date")}
                        sx={compactInput}
                    />
                </Grid>

                {/* Premium */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Premium Amount"
                        value={policyData.premium_amount || ""}
                        onChange={handleChange("premium_amount")}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    ₹
                                </InputAdornment>
                            ),
                        }}
                        sx={compactInput}
                    />
                </Grid>

                {/* IDV */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Net Amount"
                        value={policyData.insured_declared_value || ""}
                        onChange={handleChange("insured_declared_value")}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    ₹
                                </InputAdornment>
                            ),
                        }}
                        sx={compactInput}
                    />
                </Grid>

                {/* Reminder */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Reminder"
                        value={policyData.reminder_days || 30}
                        onChange={handleChange("reminder_days")}
                        sx={compactInput}
                    >
                        <MenuItem value={7}>7 Days</MenuItem>
                        <MenuItem value={15}>15 Days</MenuItem>
                        <MenuItem value={30}>30 Days</MenuItem>
                        <MenuItem value={45}>45 Days</MenuItem>
                        <MenuItem value={60}>60 Days</MenuItem>
                    </TextField>
                </Grid>

                {/* Renewal Year */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Renewal Year"
                        value={policyData.renewal_year || ""}
                        onChange={handleChange("renewal_year")}
                        sx={compactInput}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Enter remarks..."
                        value={policyData.remarks || ""}
                        onChange={handleChange("remarks")}
                        sx={compactInput}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default memo(PolicyDetailsForm);