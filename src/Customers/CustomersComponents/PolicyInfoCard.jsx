import React, { memo, useEffect, useState } from "react";
import {
    Box,
    Grid,
    MenuItem,
    TextField,
    Typography,
    Divider,
    InputAdornment,
    Button,
    Stack,
} from "@mui/material";

import VerifiedIcon from "@mui/icons-material/Verified";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";


import {
    useActivePolicySourceMaster,
    useCustomerPaytype,
    usePaymentMethodMaster,
} from "../../CommonCode/useQuery";

import { axioslogin } from "../../Connection/axios";
import {
    successNotify,
    warningNotify,
} from "../../constant/Constant";
import DetailLine from "./DetailLine";
import { format, parseISO } from "date-fns";

const compactInput = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        fontSize: 13,
    },

    "& .MuiInputLabel-root": {
        fontSize: 13,
    },
};


const formatDate = (date) => {
    if (!date) return "";

    return format(parseISO(date), "yyyy-MM-dd");
};


const PolicyInfoCard = ({
    policy,
    isDark,
    refetch,
    setOpen
}) => {




    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [policyData, setPolicyData] = useState({});


    const { data: sourceType = [] } =
        useActivePolicySourceMaster();

    const { data: CustomerPayType = [] } =
        useCustomerPaytype();

    const { data: PaymentMethod = [] } =
        usePaymentMethodMaster();


    const ActiveCustomerPayType =
        CustomerPayType?.filter(
            item => item?.is_active === 1
        );

    const ActivePaymentMethod =
        PaymentMethod?.filter(
            item => item?.is_active === 1
        );

    const ActiveSourceType =
        sourceType?.filter(
            item => item?.is_active === 1
        );


    // ==================== LOAD POLICY ====================

    useEffect(() => {

        if (!policy) return;

        setPolicyData({

            insurance_company_id:
                policy.insurance_company_id || "",

            policy_number:
                policy.policy_number || "",

            renewal_cycle:
                policy.renewal_cycle || "Annual",

            sale_date:
                formatDate(policy.sale_date),

            start_date:
                formatDate(policy.start_date),

            expiry_date:
                formatDate(policy.expiry_date),

            source_id:
                policy.source_id || "",

            premium_amount:
                policy.premium_amount || "",

            insured_declared_value:
                policy.insured_declared_value || "",

            paid_amount:
                policy.paid_amount || "",

            discount_amount:
                policy.discount_amount || "",

            reminder_days:
                policy.reminder_days || 30,

            customer_pay_type_id:
                policy.customer_pay_type_id || "",

            cp_reference_no:
                policy.cp_reference_no || "",

            payment_method_id:
                policy.payment_method_id || "",

            pm_reference_no:
                policy.pm_reference_no || "",

            renewal_year:
                policy.renewal_year || "",

            remarks:
                policy.remarks || "",

        });

    }, [policy]);


    // ==================== HANDLE CHANGE ====================

    const handleChange = (field) => (event) => {

        const value = event.target.value;

        setPolicyData((prev) => {

            const updatedData = {
                ...prev,
                [field]: value,
            };


            if (
                field === "premium_amount" ||
                field === "paid_amount"
            ) {

                const premiumAmount =
                    field === "premium_amount"
                        ? Number(value) || 0
                        : Number(prev.premium_amount) || 0;

                const paidAmount =
                    field === "paid_amount"
                        ? Number(value) || 0
                        : Number(prev.paid_amount) || 0;

                const discountAmount =
                    premiumAmount - paidAmount;

                updatedData.discount_amount =
                    discountAmount >= 0
                        ? discountAmount
                        : 0;

            }


            return updatedData;

        });

    };


    // ==================== SAVE ====================

    const handleSave = async () => {

        setLoading(true);

        try {

            const data = {

                insurance_company_id:
                    policyData.insurance_company_id,

                policy_number:
                    policyData.policy_number,

                renewal_cycle:
                    policyData.renewal_cycle,

                sale_date:
                    policyData.sale_date || null,

                start_date:
                    policyData.start_date,

                expiry_date:
                    policyData.expiry_date,

                source_id:
                    policyData.source_id || null,

                premium_amount:
                    policyData.premium_amount || 0,

                insured_declared_value:
                    policyData.insured_declared_value || 0,

                paid_amount:
                    policyData.paid_amount || 0,

                discount_amount:
                    policyData.discount_amount || 0,

                reminder_days:
                    policyData.reminder_days || 30,

                customer_pay_type_id:
                    policyData.customer_pay_type_id || null,

                cp_reference_no:
                    policyData.cp_reference_no || null,

                payment_method_id:
                    policyData.payment_method_id || null,

                pm_reference_no:
                    policyData.pm_reference_no || null,

                renewal_year:
                    policyData.renewal_year,

                remarks:
                    policyData.remarks || null,

            };


            const response = await axioslogin.patch(
                `/customer/update-policydetail/${policy.policy_id}`,
                data
            );


            if (response?.data?.success === 1) {
                successNotify("Policy updated successfully");
                setIsEditing(false);
                refetch()
            } else {

                warningNotify(
                    response?.data?.message ||
                    "Failed to update policy"
                );

            }

        } catch (error) {
            console.log({
                error
            });

            warningNotify(
                error?.response?.data?.message ||
                "Failed to update policy"
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================== CANCEL ====================

    const handleCancel = () => {

        setPolicyData({

            insurance_company_id:
                policy.insurance_company_id || "",

            policy_number:
                policy.policy_number || "",

            renewal_cycle:
                policy.renewal_cycle || "Annual",

            sale_date:
                formatDate(policy.sale_date),

            start_date:
                formatDate(policy.start_date),

            expiry_date:
                formatDate(policy.expiry_date),

            source_id:
                policy.source_id || "",

            premium_amount:
                policy.premium_amount || "",

            insured_declared_value:
                policy.insured_declared_value || "",

            paid_amount:
                policy.paid_amount || "",

            discount_amount:
                policy.discount_amount || "",

            reminder_days:
                policy.reminder_days || 30,

            customer_pay_type_id:
                policy.customer_pay_type_id || "",

            cp_reference_no:
                policy.cp_reference_no || "",

            payment_method_id:
                policy.payment_method_id || "",

            pm_reference_no:
                policy.pm_reference_no || "",

            renewal_year:
                policy.renewal_year || "",

            remarks:
                policy.remarks || "",

        });

        setIsEditing(false);

    };


    if (!policy) return null;


    return (

        <Stack spacing={1.5}>


            {/* ================================================= */}
            {/* POLICY DETAILS */}
            {/* ================================================= */}

            <Box
                sx={{
                    border: "1px solid #DCE8F7",
                    borderRadius: 3,
                    p: 1.5,
                }}
            >

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                >
                    {/* LEFT */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >
                        <VerifiedIcon
                            sx={{
                                color: "#16a34a"
                            }}
                        />

                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: {
                                    xs: 16,
                                    sm: 19
                                }
                            }}
                        >
                            Policy Details
                        </Typography>
                    </Stack>


                    {/* RIGHT */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >

                        {/* CLAIM BUTTON */}
                        {
                            !isEditing &&
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={
                                    <AssignmentTurnedInRoundedIcon sx={{
                                        fontSize: { xs: 8, sm: 12 }
                                    }} />
                                }
                                onClick={() => setOpen(true)}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: { xs: 10, sm: 12 },
                                    px: 2,
                                    py: 0.7,

                                    background:
                                        "linear-gradient(135deg, #f7991d 0%, #eeb124 100%)",

                                    boxShadow:
                                        "0 4px 10px rgba(163, 142, 22, 0.25)",

                                    "&:hover": {
                                        background:
                                            "linear-gradient(135deg, #d0a348 0%, #d38c34 100%)",

                                        boxShadow:
                                            "0 6px 14px rgba(163, 97, 22, 0.35)"
                                    }
                                }}
                            >
                                Claim
                            </Button>
                        }

                        {/* EDIT BUTTON */}
                        {!isEditing && (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={
                                    <EditRoundedIcon />
                                }
                                onClick={() =>
                                    setIsEditing(true)
                                }
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                }}
                            >
                                Edit
                            </Button>
                        )}

                    </Stack>

                </Stack>


                <Divider sx={{ mb: 2 }} />


                {/* ================================================= */}
                {/* EDIT FORM */}
                {/* ================================================= */}

                {isEditing ? (

                    <Grid container spacing={2}>


                        {/* INSURANCE COMPANY */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                fullWidth
                                size="small"
                                label="Insurance Company"
                                value={
                                    policy.company_name || ""
                                }
                                disabled
                                sx={compactInput}
                            />

                        </Grid>


                        {/* POLICY NUMBER */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                fullWidth
                                size="small"
                                label="Policy Number"
                                value={
                                    policyData.policy_number
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
                                    policyData.renewal_cycle
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

                                <MenuItem value="Monthly">
                                    Monthly
                                </MenuItem>

                            </TextField>

                        </Grid>


                        {/* SALE DATE */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="Sale Date"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                value={
                                    policyData.sale_date
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
                                    shrink: true
                                }}
                                value={
                                    policyData.start_date
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
                                    shrink: true
                                }}
                                value={
                                    policyData.expiry_date
                                }
                                onChange={handleChange(
                                    "expiry_date"
                                )}
                                sx={compactInput}
                            />

                        </Grid>


                        {/* SOURCE */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Source Type"
                                value={
                                    policyData.source_id
                                }
                                onChange={handleChange(
                                    "source_id"
                                )}
                                sx={compactInput}
                            >

                                {ActiveSourceType?.map(
                                    (item) => (

                                        <MenuItem
                                            key={
                                                item.source_id
                                            }
                                            value={
                                                item.source_id
                                            }
                                        >
                                            {
                                                item.source_name
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
                                    policyData.premium_amount
                                }
                                onChange={handleChange(
                                    "premium_amount"
                                )}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ₹
                                        </InputAdornment>
                                    )
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
                                label="Net Premium"
                                value={
                                    policyData.insured_declared_value
                                }
                                onChange={handleChange(
                                    "insured_declared_value"
                                )}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ₹
                                        </InputAdornment>
                                    )
                                }}
                                sx={compactInput}
                            />

                        </Grid>


                        {/* PAID */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Paid Amount"
                                value={
                                    policyData.paid_amount
                                }
                                onChange={handleChange(
                                    "paid_amount"
                                )}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ₹
                                        </InputAdornment>
                                    )
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
                                    policyData.discount_amount
                                }
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ₹
                                        </InputAdornment>
                                    )
                                }}
                                sx={compactInput}
                            />

                        </Grid>


                        {/* CUSTOMER PAY TYPE */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Customer Pay Type"
                                value={
                                    policyData.customer_pay_type_id
                                }
                                onChange={handleChange(
                                    "customer_pay_type_id"
                                )}
                                sx={compactInput}
                            >

                                {ActiveCustomerPayType?.map(
                                    (item) => (

                                        <MenuItem
                                            key={
                                                item.customer_pay_type_id
                                            }
                                            value={
                                                item.customer_pay_type_id
                                            }
                                        >
                                            {
                                                item.pay_type_name
                                            }
                                        </MenuItem>

                                    )
                                )}

                            </TextField>

                        </Grid>


                        {/* CUSTOMER REFERENCE */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                fullWidth
                                size="small"
                                label="Customer Reference Number"
                                value={
                                    policyData.cp_reference_no
                                }
                                onChange={handleChange(
                                    "cp_reference_no"
                                )}
                                sx={compactInput}
                            />

                        </Grid>


                        {/* PAYMENT METHOD */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Payment Method"
                                value={
                                    policyData.payment_method_id
                                }
                                onChange={handleChange(
                                    "payment_method_id"
                                )}
                                sx={compactInput}
                            >

                                {ActivePaymentMethod?.map(
                                    (item) => (

                                        <MenuItem
                                            key={
                                                item.payment_method_id
                                            }
                                            value={
                                                item.payment_method_id
                                            }
                                        >
                                            {
                                                item.payment_method_name
                                            }
                                        </MenuItem>

                                    )
                                )}

                            </TextField>

                        </Grid>


                        {/* PAYMENT REFERENCE */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                fullWidth
                                size="small"
                                label="Payment Reference Number"
                                value={
                                    policyData.pm_reference_no
                                }
                                onChange={handleChange(
                                    "pm_reference_no"
                                )}
                                sx={compactInput}
                            />

                        </Grid>


                        {/* RENEWAL YEAR */}

                        <Grid size={{ xs: 12, md: 6 }}>

                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Renewal Year"
                                value={
                                    policyData.renewal_year
                                }
                                onChange={handleChange(
                                    "renewal_year"
                                )}
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
                                    policyData.reminder_days
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


                        {/* REMARKS */}

                        <Grid size={{ xs: 12 }}>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                label="Remarks"
                                value={
                                    policyData.remarks
                                }
                                onChange={handleChange(
                                    "remarks"
                                )}
                                sx={compactInput}
                            />

                        </Grid>


                        {/* BUTTONS */}

                        <Grid size={{ xs: 12 }}>

                            <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="flex-end"
                            >

                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : "Save"}
                                </Button>

                            </Stack>

                        </Grid>

                    </Grid>

                ) : (

                    /* ================================================= */
                    /* DISPLAY MODE */
                    /* ================================================= */

                    <Stack spacing={1.1}>

                        <DetailLine
                            isDark={isDark}
                            label="Insurance Company"
                            value={
                                policy.company_name || "-"
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Policy Number"
                            value={
                                policy.policy_number || "-"
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Renewal Cycle"
                            value={
                                policy.renewal_cycle || "-"
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Sale Date"
                            value={
                                formatDate(policy.sale_date)
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Start Date"
                            value={
                                formatDate(policy.start_date)
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Expiry Date"
                            value={
                                formatDate(policy.expiry_date)
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Premium"
                            value={`₹${policy.premium_amount || "0.00"}`}
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Paid Amount"
                            value={`₹${policy.paid_amount || "0.00"}`}
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Discount"
                            value={`₹${policy.discount_amount || "0.00"}`}
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Net Premium"
                            value={`₹${policy.insured_declared_value || "0.00"}`}
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Customer Pay Type"
                            value={
                                policy.pay_type_name || "-"
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Customer Reference"
                            value={
                                policy.cp_reference_no || "-"
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Payment Method"
                            value={
                                policy.payment_method_name || "-"
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Payment Reference"
                            value={
                                policy.pm_reference_no || "-"
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Source"
                            value={
                                policy.source_name || "-"
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Renewal Year"
                            value={
                                policy.renewal_year || "-"
                            }
                        />

                        <DetailLine
                            isDark={isDark}
                            label="Remarks"
                            value={
                                policy.remarks || "-"
                            }
                        />

                    </Stack>

                )}

            </Box>


            {/* ================================================= */}
            {/* VEHICLE DETAILS */}
            {/* ================================================= */}

            <Box
                sx={{
                    border: "1px solid #DCE8F7",
                    borderRadius: 3,
                    p: 1.5,
                }}
            >

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 1 }}
                >

                    <DirectionsCarIcon
                        sx={{
                            color: "#1565C0"
                        }}
                    />

                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: {
                                xs: 16,
                                sm: 19
                            }
                        }}
                    >
                        Vehicle Details
                    </Typography>

                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1.1}>

                    <DetailLine
                        isDark={isDark}
                        label="Registration No"
                        value={
                            policy.registration_number || "-"
                        }
                    />

                    <DetailLine
                        isDark={isDark}
                        label="Vehicle"
                        value={`${policy.vehicle_maker || ""} ${policy.model || ""}`}
                    />

                    <DetailLine
                        isDark={isDark}
                        label="Engine No"
                        value={
                            policy.engine_number || "-"
                        }
                    />

                    <DetailLine
                        isDark={isDark}
                        label="Chassis No"
                        value={
                            policy.chassis_number || "-"
                        }
                    />

                    <DetailLine
                        isDark={isDark}
                        label="RTO"
                        value={
                            policy.rto || "-"
                        }
                    />

                    <DetailLine
                        isDark={isDark}
                        label="Vehicle Class"
                        value={
                            policy.vehicle_class || "-"
                        }
                    />

                    <DetailLine
                        isDark={isDark}
                        label="Category"
                        value={
                            policy.vehicle_category || "-"
                        }
                    />

                    <DetailLine
                        isDark={isDark}
                        label="Fuel Type"
                        value={
                            policy.fuel_type || "-"
                        }
                    />

                </Stack>

            </Box>




        </Stack>

    );

};

export default memo(PolicyInfoCard);