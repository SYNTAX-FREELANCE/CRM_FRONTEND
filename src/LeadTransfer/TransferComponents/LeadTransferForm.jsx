
import React, { lazy, Suspense, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";

import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import TransferStatusCards from "./TransferStatusCards";

import {
    useInsuranceCompanyMaster,
    useOutcomeByStatusId,
} from "../../CommonCode/useQuery";

import {
    LocalizationProvider,
} from "@mui/x-date-pickers/LocalizationProvider";

import {
    AdapterDayjs,
} from "@mui/x-date-pickers/AdapterDayjs";

import {
    DateTimePicker,
} from "@mui/x-date-pickers/DateTimePicker";

import dayjs from "dayjs";


import OutcomeCardSkeleton from "../../SkeletonComponent/OutcomeCardSkeleton";
import PolicyDetailsFormSkeleton from "../../SkeletonComponent/PolicyDetailsFormSkeleton";
import OutcomeCard from "../../FreshCall/Components/OutcomeCard";
import { errorNotify, getAuthUser, infoNotify, successNotify, warningNotify } from "../../constant/Constant";
import { format } from "date-fns";
import { statusReasonMap } from "../../CommonCode/Reusable";
import { axioslogin } from "../../Connection/axios";


const PolicyDetailsForm = lazy(
    () => import("../../FreshCall/Components/PolicyDetailsForm")
);

const LeadTransferForm = ({
    selectedLead,
    onCancel,
    selectedEmployee,
}) => {

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const authUser = getAuthUser();
    const { id } = authUser ?? {};
    const [transferStatus, setTransferStatus] =
        useState(null);

    const [transferReason, setTransferReason] =
        useState("");
    const [followUpDate, setFollowUpDate] =
        useState("");

    const [followUpOutcome, setFollowUpOutcome] =
        useState("");

    /* -------------------------------------------------- */
    /* POLICY DATA */
    /* -------------------------------------------------- */

    const [policyData, setPolicyData] = useState({
        insurance_company_id: "",
        policy_number: "",
        renewal_cycle: "Annual",
        start_date: "",
        sale_date: "",
        paid_amount: "",
        discount_amount: "",
        source_id: "",
        expiry_date: "",
        premium_amount: "",
        insured_declared_value: "",
        reminder_days: 30,
        renewal_year: new Date().getFullYear(),
        remarks: "",
        customer_pay_type_id: "",
        payment_method_id: "",
        cp_reference_no: "",
        pm_reference_no: "",
    });

    /* -------------------------------------------------- */
    /* MASTER DATA */
    /* -------------------------------------------------- */

    const {
        data: InsuranceCompanyMasterDetail,
    } = useInsuranceCompanyMaster();

    const needsDate =
        transferStatus?.requires_followup === 1;

    const isFollowupDateRequired =
        transferStatus?.is_followup_date_required === 1;

    const {
        data: OUTCOMES,
        isLoading: LoadingOutComes,
    } = useOutcomeByStatusId(
        transferStatus?.status_id,
        needsDate
    );



    /* -------------------------------------------------- */
    /* RESET */
    /* -------------------------------------------------- */

    const resetForm = () => {
        setTransferStatus(null);
        setTransferReason("");

        setFollowUpDate("");
        setFollowUpOutcome("");

        setPolicyData({
            insurance_company_id: "",
            policy_number: "",
            renewal_cycle: "Annual",
            start_date: "",
            sale_date: "",
            paid_amount: "",
            discount_amount: "",
            source_id: "",
            expiry_date: "",
            premium_amount: "",
            insured_declared_value: "",
            reminder_days: 30,
            renewal_year: new Date().getFullYear(),
            remarks: "",
            customer_pay_type_id: "",
            payment_method_id: "",
            cp_reference_no: "",
            pm_reference_no: "",
        });
    };

    /* -------------------------------------------------- */
    /* STATUS CHANGE */
    /* -------------------------------------------------- */

    const handleStatusChange = (status) => {
        setTransferStatus(status);

        /*
         * When status changes, reset the status-specific
         * fields so previous status data is not carried over.
         */

        setFollowUpDate("");
        setFollowUpOutcome("");

        setPolicyData({
            insurance_company_id: "",
            policy_number: "",
            renewal_cycle: "Annual",
            start_date: "",
            sale_date: "",
            paid_amount: "",
            discount_amount: "",
            source_id: "",
            expiry_date: "",
            premium_amount: "",
            insured_declared_value: "",
            reminder_days: 30,
            renewal_year: new Date().getFullYear(),
            remarks: "",
            customer_pay_type_id: "",
            payment_method_id: "",
            cp_reference_no: "",
            pm_reference_no: "",
        });
    };

    const validatePolicy = (policyData) => {
        // Insurance Company
        if (!policyData.insurance_company_id) {
            warningNotify("Please select the insurance company.");
            return false;
        }

        // Policy Number
        if (!policyData.policy_number?.trim()) {
            warningNotify("Please enter the policy number.");
            return false;
        }

        // Renewal Cycle
        if (!policyData.renewal_cycle) {
            warningNotify("Please select the renewal cycle.");
            return false;
        }

        // Start Date
        if (!policyData.start_date) {
            warningNotify("Please select the policy start date.");
            return false;
        }

        // Expiry Date
        if (!policyData.expiry_date) {
            warningNotify("Please select the policy expiry date.");
            return false;
        }

        if (
            new Date(policyData.start_date) >=
            new Date(policyData.expiry_date)
        ) {
            warningNotify("Expiry date must be greater than the start date.");
            return false;
        }

        // Source
        if (
            policyData.source_id === "" ||
            policyData.source_id === null ||
            policyData.source_id === undefined
        ) {
            warningNotify("Source is required");
            return false;
        }

        // Premium
        if (
            policyData.premium_amount === "" ||
            policyData.premium_amount === null ||
            policyData.premium_amount === undefined
        ) {
            warningNotify("Premium Amount is required");
            return false;
        }

        const premiumAmount = Number(policyData.premium_amount);

        if (!Number.isFinite(premiumAmount)) {
            warningNotify("Premium Amount must be a valid number");
            return false;
        }

        if (premiumAmount <= 0) {
            warningNotify("Premium Amount must be greater than 0");
            return false;
        }

        // Net Amount
        if (
            policyData.insured_declared_value === "" ||
            policyData.insured_declared_value === null ||
            policyData.insured_declared_value === undefined
        ) {
            warningNotify("Net Amount is required");
            return false;
        }

        const insuredDeclaredValue = Number(
            policyData.insured_declared_value
        );

        if (!Number.isFinite(insuredDeclaredValue)) {
            warningNotify("Net Amount must be a valid number");
            return false;
        }

        if (insuredDeclaredValue <= 0) {
            warningNotify("Net Amount must be greater than 0");
            return false;
        }

        // Paid Amount
        if (
            policyData.paid_amount === "" ||
            policyData.paid_amount === null ||
            policyData.paid_amount === undefined
        ) {
            warningNotify("Paid Amount is required");
            return false;
        }

        const paidAmount = Number(policyData.paid_amount);

        if (!Number.isFinite(paidAmount)) {
            warningNotify("Paid Amount must be a valid number");
            return false;
        }

        if (paidAmount < 0) {
            warningNotify("Paid Amount cannot be negative");
            return false;
        }

        if (paidAmount > premiumAmount) {
            warningNotify(
                "Paid Amount cannot be greater than Premium Amount"
            );
            return false;
        }

        // Discount Amount
        if (
            policyData.discount_amount === "" ||
            policyData.discount_amount === null ||
            policyData.discount_amount === undefined
        ) {
            warningNotify("Discount Amount is required");
            return false;
        }

        const discountAmount = Number(policyData.discount_amount);

        if (!Number.isFinite(discountAmount)) {
            warningNotify("Discount Amount must be a valid number");
            return false;
        }

        if (discountAmount < 0) {
            warningNotify("Discount Amount cannot be negative");
            return false;
        }

        // Compare using 2 decimal places
        const calculatedDiscount = Number(
            (premiumAmount - paidAmount).toFixed(2)
        );

        if (Number(discountAmount.toFixed(2)) !== calculatedDiscount) {
            warningNotify(
                "Discount Amount is not matching Premium Amount and Paid Amount"
            );
            return false;
        }

        // Reminder Days
        const allowedReminderDays = [7, 15, 30, 45, 60];

        const reminderDays = Number(policyData.reminder_days);

        if (!allowedReminderDays.includes(reminderDays)) {
            warningNotify("Please select a valid Reminder");
            return false;
        }

        // Renewal Year
        if (
            policyData.renewal_year === "" ||
            policyData.renewal_year === null ||
            policyData.renewal_year === undefined
        ) {
            warningNotify("Renewal Year is required");
            return false;
        }

        const renewalYear = Number(policyData.renewal_year);

        if (!Number.isInteger(renewalYear)) {
            warningNotify("Renewal Year must be a valid year");
            return false;
        }

        if (renewalYear < 2000 || renewalYear > 2100) {
            warningNotify("Renewal Year must be between 2000 and 2100");
            return false;
        }

        // Remarks
        if (policyData.remarks?.trim().length > 500) {
            warningNotify("Remarks cannot exceed 500 characters");
            return false;
        }

        return true;
    };
    /* -------------------------------------------------- */
    /* SAVE */
    /* -------------------------------------------------- */

    const handleSave = async () => {
        if (!selectedLead?.lead_id) {
            return infoNotify("Lead id Is Missing!");
        }

        if (!selectedEmployee) {
            return infoNotify("Select Employee Befor Submitting!");
        }

        if (!transferStatus?.status_id) {
            return infoNotify("Select Employee Befor Submitting!");
        }

        if (!transferReason.trim()) {
            return infoNotify("Please Enter Transfer Reason!");;
        }

        if (transferStatus?.is_policy_required === 1) {
            const isValid = validatePolicy(policyData);

            if (!isValid) {
                return false;
            }
        }
        // Follow-up Validation
        if (transferStatus?.requires_followup === 1) {
            if (!followUpDate && transferStatus?.is_followup_date_required === 1) {
                warningNotify("Please select the next follow-up date.");
                return false;
            }

            if (!followUpOutcome) {
                warningNotify("Please select the call outcome.");
                return false;
            }

            if (followUpDate && new Date(followUpDate) <= new Date()) {
                warningNotify(
                    "Follow-up date must be greater than the current date and time."
                );
                return false;
            }
        }


        const payload = {
            lead_id: selectedLead.lead_id,
            customer_id: selectedLead.customer_id,
            vehicle_id: selectedLead.vehicle_id,
            current_status_id: selectedLead.status_id,
            old_status_id: selectedLead.status_id,
            new_status_id: transferStatus.status_id,
            new_user_id: selectedEmployee,
            requires_followup: transferStatus?.requires_followup,
            call_outcome: followUpOutcome,
            remarks: transferReason ? transferReason.trim() : "No Remarks",
            next_followup_date: followUpDate
                ? format(new Date(followUpDate), "yyyy-MM-dd HH:mm:ss")
                : null,
            status_change_reason:
                statusReasonMap[followUpOutcome] || "Status Updated",
            created_by: id,
            policyrequierd: transferStatus?.is_policy_required,

            ...(transferStatus?.is_policy_required === 1 && {
                policy: {
                    insurance_company_id: policyData.insurance_company_id,
                    policy_number: policyData.policy_number.trim(),
                    renewal_year: policyData.renewal_year,
                    renewal_cycle: policyData.renewal_cycle,
                    start_date: policyData.start_date,
                    expiry_date: policyData.expiry_date,
                    premium_amount: policyData.premium_amount,
                    insured_declared_value: policyData.insured_declared_value,
                    reminder_days: policyData.reminder_days,
                    remarks: policyData.remarks,
                    sale_date: policyData.sale_date,
                    paid_amount: policyData.paid_amount,
                    discount_amount: policyData.discount_amount,
                    source_id: policyData.source_id,
                    customer_pay_type_id: policyData.customer_pay_type_id,
                    payment_method_id: policyData.payment_method_id,
                    cp_reference_no: policyData.cp_reference_no,
                    pm_reference_no: policyData.pm_reference_no,
                    created_by: id,
                },
            }),
        };

        try {
            const response = await axioslogin.post(
                "/lead/transfer-status",
                payload
            );
            const { success, message } = response?.data ?? {};
            if (success !== 1) {
                warningNotify(message || "Error in Updating Lead");
                return false;
            }
            successNotify(message);
            resetForm();
        } catch (error) {
            errorNotify("Error in Updating Status");
            return false;
        }
    };

    return (
        <Box
            sx={{
                mt: 1.5,
                borderRadius: 2.5,
                overflow: "hidden",
                border: isDark
                    ? "1px solid rgba(255,255,255,.08)"
                    : "1px solid #e2e8f0",
                bgcolor: isDark
                    ? "rgba(15,23,42,.78)"
                    : "#ffffff",
                boxShadow:
                    "0 5px 22px rgba(15,23,42,.06)",
            }}
        >
            {/* -------------------------------------------------- */}
            {/* HEADER */}
            {/* -------------------------------------------------- */}

            <Box
                sx={{
                    px: 1.8,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: isDark
                        ? "1px solid rgba(255,255,255,.07)"
                        : "1px solid #eef2f7",
                }}
            >
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >
                    <SwapHorizRoundedIcon
                        sx={{
                            fontSize: 19,
                            color: "#2563eb",
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 900,
                            color: isDark
                                ? "#fff"
                                : "#0f172a",
                        }}
                    >
                        Transfer Assignment
                    </Typography>
                </Stack>

                <Typography
                    sx={{
                        fontSize: 9,
                        color: "text.secondary",
                        fontWeight: 700,
                    }}
                >
                    LEAD #{selectedLead?.lead_id}
                </Typography>
            </Box>

            <Box sx={{ p: 1.8 }}>
                <Grid
                    container
                    spacing={1.5}
                    alignItems="center">
                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                    </Grid>

                    {/* -------------------------------------------------- */}
                    {/* STATUS */}
                    {/* -------------------------------------------------- */}

                    <Grid
                        size={{
                            xs: 12,
                        }}
                    >
                        <TransferStatusCards
                            value={
                                transferStatus?.status_id
                            }
                            onChange={
                                handleStatusChange
                            }
                        />
                    </Grid>

                    {/* -------------------------------------------------- */}
                    {/* STATUS-SPECIFIC OUTCOMES */}
                    {/* -------------------------------------------------- */}

                    {transferStatus && (
                        <>
                            {needsDate && (
                                <Grid
                                    size={{
                                        xs: 12,
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                mb: 1,
                                                fontSize: 10,
                                                fontWeight: 900,
                                                color: isDark
                                                    ? "#fff"
                                                    : "#334155",
                                                letterSpacing:
                                                    0.4,
                                            }}
                                        >
                                            CALL OUTCOME
                                        </Typography>

                                        {LoadingOutComes ? (
                                            <Box
                                                sx={{
                                                    display:
                                                        "grid",
                                                    gridTemplateColumns:
                                                    {
                                                        xs: "repeat(2, 1fr)",
                                                        sm: "repeat(5, 1fr)",
                                                        md: "repeat(6, 1fr)",
                                                    },
                                                    gap: 1,
                                                }}
                                            >
                                                {Array
                                                    .from(
                                                        {
                                                            length: 4,
                                                        }
                                                    )
                                                    .map(
                                                        (
                                                            _,
                                                            index
                                                        ) => (
                                                            <OutcomeCardSkeleton
                                                                key={
                                                                    index
                                                                }
                                                            />
                                                        )
                                                    )}
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    display:
                                                        "grid",
                                                    gridTemplateColumns:
                                                    {
                                                        xs: "repeat(2, 1fr)",
                                                        sm: "repeat(5, 1fr)",
                                                        md: "repeat(6, 1fr)",
                                                        lg: "repeat(8, 1fr)",
                                                    },
                                                    gap: 1,
                                                }}
                                            >
                                                {OUTCOMES?.map(
                                                    (
                                                        item
                                                    ) => {
                                                        const active =
                                                            followUpOutcome ===
                                                            item?.outcome_key;

                                                        return (
                                                            <Box
                                                                key={
                                                                    item?.outcome_key
                                                                }
                                                            >
                                                                <OutcomeCard
                                                                    item={
                                                                        item
                                                                    }
                                                                    active={
                                                                        active
                                                                    }
                                                                    onClick={() =>
                                                                        setFollowUpOutcome(
                                                                            item?.outcome_key
                                                                        )
                                                                    }
                                                                />
                                                            </Box>
                                                        );
                                                    }
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            )}

                            {/* -------------------------------------------------- */}
                            {/* FOLLOW-UP DATE */}
                            {/* -------------------------------------------------- */}

                            {isFollowupDateRequired && (
                                <Grid
                                    size={{
                                        xs: 12,
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                mb: 0.8,
                                                fontSize: 10,
                                                fontWeight: 900,
                                                color: isDark
                                                    ? "#fff"
                                                    : "#334155",
                                                letterSpacing:
                                                    0.4,
                                            }}
                                        >
                                            NEXT FOLLOW-UP
                                            DATE
                                        </Typography>

                                        <LocalizationProvider
                                            dateAdapter={
                                                AdapterDayjs
                                            }
                                        >
                                            <DateTimePicker
                                                value={
                                                    followUpDate
                                                        ? dayjs(
                                                            followUpDate
                                                        )
                                                        : null
                                                }
                                                onChange={(
                                                    newValue
                                                ) =>
                                                    setFollowUpDate(
                                                        newValue
                                                    )
                                                }
                                                minDateTime={dayjs()}
                                                format="DD/MM/YYYY hh:mm A"
                                                slotProps={{
                                                    textField:
                                                    {
                                                        fullWidth:
                                                            true,
                                                        size: "small",
                                                        sx: {
                                                            "& .MuiOutlinedInput-root":
                                                            {
                                                                borderRadius: 2,
                                                                bgcolor:
                                                                    isDark
                                                                        ? "rgba(15,23,42,.6)"
                                                                        : "#fff",
                                                                fontSize: 11,
                                                            },
                                                        },
                                                    },
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Grid>
                            )}

                            {/* -------------------------------------------------- */}
                            {/* SOLD → POLICY DETAILS */}
                            {/* -------------------------------------------------- */}

                            {transferStatus?.status_name ===
                                "SOLD" && (
                                    <Grid
                                        size={{
                                            xs: 12,
                                        }}
                                    >
                                        <Suspense
                                            fallback={
                                                <PolicyDetailsFormSkeleton />
                                            }
                                        >
                                            <PolicyDetailsForm
                                                policyData={
                                                    policyData
                                                }
                                                setPolicyData={
                                                    setPolicyData
                                                }
                                                insuranceCompanies={
                                                    InsuranceCompanyMasterDetail
                                                }
                                            />
                                        </Suspense>
                                    </Grid>
                                )}
                        </>
                    )}

                    {/* -------------------------------------------------- */}
                    {/* TRANSFER REASON */}
                    {/* -------------------------------------------------- */}

                    <Grid
                        size={{
                            xs: 12,
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    mb: 0.6,
                                    fontSize: 9,
                                    fontWeight: 900,
                                    color: "#64748b",
                                    letterSpacing: 0.5,
                                }}
                            >
                                TRANSFER REASON
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                maxRows={4}
                                placeholder="Enter reason for transferring this lead..."
                                value={
                                    transferReason
                                }
                                onChange={(e) =>
                                    setTransferReason(
                                        e.target.value
                                    )
                                }
                                sx={{
                                    "& .MuiOutlinedInput-root":
                                    {
                                        borderRadius: 2,
                                        fontSize: 11,
                                        bgcolor: isDark
                                            ? "rgba(15,23,42,.6)"
                                            : "#fff",
                                    },
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>

                {/* -------------------------------------------------- */}
                {/* FOOTER */}
                {/* -------------------------------------------------- */}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "stretch",
                        sm: "center",
                    }}
                    gap={1.5}
                    sx={{
                        mt: 1.5,
                        pt: 1.2,
                        borderTop: isDark
                            ? "1px solid rgba(255,255,255,.07)"
                            : "1px solid #eef2f7",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 9,
                            color: "#64748b",
                            fontWeight: 600,
                        }}
                    >
                        The transfer will be recorded in
                        lead assignment and status history.
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={onCancel}
                            sx={{
                                borderRadius: 2,
                                px: 2,
                                height: 34,
                                textTransform: "none",
                                fontSize: 11,
                                fontWeight: 700,
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleSave}
                            disabled={
                                !selectedEmployee ||
                                !transferStatus
                            }
                            startIcon={
                                <SwapHorizRoundedIcon
                                    sx={{
                                        fontSize:
                                            "16px !important",
                                    }}
                                />
                            }
                            sx={{
                                borderRadius: 2,
                                px: 2.5,
                                height: 34,
                                textTransform: "none",
                                fontSize: 11,
                                fontWeight: 800,
                                boxShadow: "none",
                                background:
                                    "linear-gradient(135deg,#2563eb,#1d4ed8)",
                            }}
                        >
                            Transfer Lead
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default LeadTransferForm;

