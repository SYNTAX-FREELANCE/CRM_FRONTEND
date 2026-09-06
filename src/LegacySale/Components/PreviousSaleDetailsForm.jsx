import React, { memo } from "react";
import {
    Box,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Divider,
    Chip,
    InputAdornment,
    useTheme,
} from "@mui/material";

import CheckCircle from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useActivePolicySourceMaster } from "../../CommonCode/useQuery";

const compactInput = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        fontSize: 13,
    },

    "& .MuiInputLabel-root": {
        fontSize: 13,
    },
};

const PreviousSaleDetailsForm = ({
    saleData,
    setSaleData,
    InsuranceCompanyMasterDetail = [],
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";


    const { data: sourceType = [] } = useActivePolicySourceMaster()

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setSaleData((prev) => {
            const updatedData = {
                ...prev,
                [field]: value,
            };

            if (field === "premium_amount" || field === "paid_amount") {
                const premiumAmount =
                    field === "premium_amount"
                        ? Number(value) || 0
                        : Number(prev.premium_amount) || 0;

                const paidAmount =
                    field === "paid_amount"
                        ? Number(value) || 0
                        : Number(prev.paid_amount) || 0;

                const discountAmount = premiumAmount - paidAmount;

                updatedData.discount_amount =
                    discountAmount >= 0 ? discountAmount : 0;
            }

            return updatedData;
        });
    };

    return (
        <Box>
            {/* ============================= */}
            {/* SOLD STATUS */}
            {/* ============================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,

                    p: 2,
                    mb: 2.5,

                    borderRadius: "12px",

                    bgcolor: isDark
                        ? "rgba(34,197,94,0.08)"
                        : "#f0fdf4",

                    border: "1px solid",

                    borderColor: isDark
                        ? "rgba(34,197,94,0.20)"
                        : "#bbf7d0",

                    flexWrap: "wrap",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                    }}
                >
                    <CheckCircle
                        sx={{
                            color: "#16a34a",
                            fontSize: 26,
                        }}
                    />

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "text.secondary",
                            }}
                        >
                            SALE STATUS
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: 900,
                                color: "#16a34a",
                            }}
                        >
                            SOLD
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    sx={{
                        fontSize: 11,
                        color: "text.secondary",
                        maxWidth: 400,
                    }}
                >
                    This status is automatically assigned
                    because this page is specifically for
                    previously sold customers.
                </Typography>
            </Box>

            {/* ============================= */}
            {/* POLICY DETAILS */}
            {/* ============================= */}

            <Divider sx={{ my: 3 }}>
                <Chip
                    icon={<VerifiedIcon />}
                    label="Policy Details"
                    color="success"
                    sx={{
                        fontWeight: 700,
                    }}
                />
            </Divider>

            <Grid container spacing={2}>

                {/* INSURANCE COMPANY */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Insurance Company"
                        value={
                            saleData.insurance_company_id ||
                            ""
                        }
                        onChange={handleChange(
                            "insurance_company_id"
                        )}
                        sx={compactInput}
                    >
                        {InsuranceCompanyMasterDetail?.map(
                            (company) => (
                                <MenuItem
                                    key={
                                        company?.insurance_company_id
                                    }
                                    value={
                                        company?.insurance_company_id
                                    }
                                >
                                    {
                                        company?.company_name
                                    }
                                </MenuItem>
                            )
                        )}
                    </TextField>
                </Grid>


                {/* POLICY NUMBER */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Policy Number"
                        value={
                            saleData.policy_number || ""
                        }
                        onChange={handleChange(
                            "policy_number"
                        )}
                        sx={compactInput}
                    />
                </Grid>

                {/* RENEWAL CYCLE */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Renewal Cycle"
                        value={
                            saleData.renewal_cycle || ""
                        }
                        onChange={handleChange(
                            "renewal_cycle"
                        )}
                        sx={compactInput}
                    >
                        <MenuItem value="Annual">
                            Annual
                        </MenuItem>

                        <MenuItem value="Half Yearly">
                            Half Yearly
                        </MenuItem>

                        <MenuItem value="Quarterly">
                            Quarterly
                        </MenuItem>
                    </TextField>
                </Grid>

                {/* SALE DATE */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Captured Date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={
                            saleData.sale_date || ""
                        }
                        onChange={handleChange(
                            "sale_date"
                        )}
                        sx={compactInput}
                    />
                </Grid>

                {/* START DATE */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Start Date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={
                            saleData.start_date || ""
                        }
                        onChange={handleChange(
                            "start_date"
                        )}
                        sx={compactInput}
                    />
                </Grid>

                {/* EXPIRY DATE */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Expiry Date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={
                            saleData.expiry_date || ""
                        }
                        onChange={handleChange(
                            "expiry_date"
                        )}
                        sx={compactInput}
                    />
                </Grid>

                {/* SOURCE TYPE */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Source Type"
                        value={
                            saleData.source_id ||
                            ""
                        }
                        onChange={handleChange(
                            "source_id"
                        )}
                        sx={compactInput}
                    >
                        {sourceType?.map(
                            (company) => (
                                <MenuItem
                                    key={
                                        company?.source_id
                                    }
                                    value={
                                        company?.source_id
                                    }
                                >
                                    {
                                        company?.source_name
                                    }
                                </MenuItem>
                            )
                        )}
                    </TextField>
                </Grid>

                {/* PREMIUM */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Premium Amount"
                        value={
                            saleData.premium_amount || ""
                        }
                        onChange={handleChange(
                            "premium_amount"
                        )}
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

                {/* NET AMOUNT */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Net Amount"
                        value={
                            saleData.insured_declared_value ||
                            ""
                        }
                        onChange={handleChange(
                            "insured_declared_value"
                        )}
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

                {/* PAID AMOUNT */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Paid Amount"
                        value={
                            saleData.paid_amount || ""
                        }
                        onChange={handleChange(
                            "paid_amount"
                        )}
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


                {/* DISCOUNT */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Discount Amount"
                        value={
                            saleData.discount_amount || ""
                        }
                        onChange={handleChange(
                            "discount_amount"
                        )}
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

                {/* REMINDER */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Reminder"
                        value={
                            saleData.reminder_days || 30
                        }
                        onChange={handleChange(
                            "reminder_days"
                        )}
                        sx={compactInput}
                    >
                        <MenuItem value={7}>
                            7 Days
                        </MenuItem>

                        <MenuItem value={15}>
                            15 Days
                        </MenuItem>

                        <MenuItem value={30}>
                            30 Days
                        </MenuItem>

                        <MenuItem value={45}>
                            45 Days
                        </MenuItem>

                        <MenuItem value={60}>
                            60 Days
                        </MenuItem>
                    </TextField>
                </Grid>

                {/* RENEWAL YEAR */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Renewal Year"
                        value={
                            saleData.renewal_year || ""
                        }
                        onChange={handleChange(
                            "renewal_year"
                        )}
                        sx={compactInput}
                    />
                </Grid>

                {/* REMARKS */}
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        label="Remarks"
                        value={
                            saleData.remarks || ""
                        }
                        onChange={handleChange(
                            "remarks"
                        )}
                        sx={compactInput}
                    />
                </Grid>


            </Grid>
        </Box>
    );
};

export default memo(PreviousSaleDetailsForm);

