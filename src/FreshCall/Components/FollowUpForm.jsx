import React, { lazy, Suspense, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import BlockIcon from "@mui/icons-material/Block";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import SellIcon from "@mui/icons-material/Sell";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useInsuranceCompanyMaster } from "../../CommonCode/useQuery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import OutcomeCard from "./OutcomeCard";
import OutcomeCardSkeleton from "../../SkeletonComponent/OutcomeCardSkeleton";
import PolicyDetailsFormSkeleton from "../../SkeletonComponent/PolicyDetailsFormSkeleton";

const glassCard = {
    bgcolor: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 35px rgba(15,23,42,.08)",
    borderRadius: 4,
};


const PolicyDetailsForm = lazy(() => import('./PolicyDetailsForm'))


export const OUTCOMES = [
    {
        key: "ANSWERED",
        label: "Answered",
        icon: <CampaignIcon sx={{ fontSize: 18 }} />,
        color: "#2563eb",
    },
    {
        key: "NO_ANSWER",
        label: "No Answer",
        icon: <HelpOutlineIcon sx={{ fontSize: 18 }} />,
        color: "#f59e0b",
    },
    {
        key: "BUSY",
        label: "Busy",
        icon: <LocalPhoneIcon sx={{ fontSize: 18 }} />,
        color: "#ea580c",
    },
    {
        key: "SWITCHED_OFF",
        label: "Switched Off",
        icon: <PhoneDisabledIcon sx={{ fontSize: 18 }} />,
        color: "#64748b",
    },
    {
        key: "INVALID_NUMBER",
        label: "Invalid Number",
        icon: <BlockIcon sx={{ fontSize: 18 }} />,
        color: "#dc2626",
    },
    {
        key: "WRONG_NUMBER",
        label: "Wrong Number",
        icon: <BlockIcon sx={{ fontSize: 18 }} />,
        color: "#ef4444",
    },
    {
        key: "CALL_BACK_REQUESTED",
        label: "Call Back Requested",
        icon: <PhoneForwardedIcon sx={{ fontSize: 18 }} />,
        color: "#7c3aed",
    },
    {
        key: "INTERESTED",
        label: "Interested",
        icon: <ThumbUpIcon sx={{ fontSize: 18 }} />,
        color: "#16a34a",
    },
    {
        key: "NOT_INTERESTED",
        label: "Not Interested",
        icon: <ThumbDownIcon sx={{ fontSize: 18 }} />,
        color: "#dc2626",
    },
    {
        key: "QUOTE_REQUESTED",
        label: "Quote Requested",
        icon: <SellIcon sx={{ fontSize: 18 }} />,
        color: "#2563eb",
    },
    {
        key: "FOLLOW_UP_REQUIRED",
        label: "Follow Up Required",
        icon: <EventAvailableIcon sx={{ fontSize: 18 }} />,
        color: "#8b5cf6",
    },
    {
        key: "MEETING_SCHEDULED",
        label: "Meeting Scheduled",
        icon: <EventAvailableIcon sx={{ fontSize: 18 }} />,
        color: "#0ea5e9",
    },
    {
        key: "POLICY_RENEWED",
        label: "Policy Renewed",
        icon: <VerifiedIcon sx={{ fontSize: 18 }} />,
        color: "#16a34a",
    },
    {
        key: "POLICY_PURCHASED",
        label: "Policy Purchased",
        icon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
        color: "#15803d",
    },
    {
        key: "ALREADY_INSURED",
        label: "Already Insured",
        icon: <SecurityIcon sx={{ fontSize: 18 }} />,
        color: "#0284c7",
    },
    {
        key: "DO_NOT_CALL",
        label: "Do Not Call",
        icon: <DoNotDisturbAltIcon sx={{ fontSize: 18 }} />,
        color: "#991b1b",
    },
    {
        key: "OTHER",
        label: "Other",
        icon: <MoreHorizIcon sx={{ fontSize: 18 }} />,
        color: "#64748b",
    },
];

const FollowUpForm = ({
    statusName,
    // followUpDate,
    // setFollowUpDate,
    // followUpRemarks,
    // setFollowUpRemarks,
    // outcome,
    // setOutcome,
    // policyData,
    // setPolicyData
      onCancel,
    onSave
}) => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const needsDate = statusName?.requires_followup === 1;
    const { data: InsuranceCompanyMasterDetail } = useInsuranceCompanyMaster();


    const [followUpDate, setFollowUpDate] = useState("");
    const [followUpRemarks, setFollowUpRemarks] = useState("");
    const [followUpOutcome, setFollowUpOutcome] = useState("");

    const [policyData, setPolicyData] = useState({
        insurance_company_id: "",
        policy_number: "",
        renewal_cycle: "Annual",
        start_date: "",
        expiry_date: "",
        premium_amount: "",
        insured_declared_value: "",
        reminder_days: 30,
        renewal_year: new Date().getFullYear(),
        remarks: "",
    });


    const resetForm = () => {
        setFollowUpRemarks("");
        setFollowUpDate("");
        setFollowUpOutcome("");
        setPolicyData({
            insurance_company_id: "",
            policy_number: "",
            renewal_cycle: "Annual",
            start_date: "",
            expiry_date: "",
            premium_amount: "",
            insured_declared_value: "",
            reminder_days: 30,
            renewal_year: new Date().getFullYear(),
            remarks: "",
        });
    };

    const handleSave = async () => {
        const success = await onSave({
            remarks: followUpRemarks,
            followUpDate,
            followUpOutcome,
            policyData,
        });

        if (success) {
            resetForm();
        }
    };

    return (
        <Box sx={{ mt: 3, p: { xs: 2, md: 3 }, borderRadius: 4, ...glassCard }}>

            <Stack spacing={1.5}>
                <Box>
                    <Typography sx={{ mb: 1, fontWeight: 800, color: "#334155" }}>
                        Call Outcome
                    </Typography>
                    {needsDate &&
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(3, 1fr)",
                                    sm: "repeat(4, 1fr)",
                                    md: "repeat(4, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {OUTCOMES?.map((item) => {
                                const active = followUpOutcome === item.key;
                                return (
                                    <Grid item xs={12} sm={6} md={3} key={item.key}>
                                        <Suspense fallback={<OutcomeCardSkeleton />}>
                                            <OutcomeCard
                                                item={item}
                                                active={active}
                                                onClick={() => setFollowUpOutcome(item.key)}
                                            />
                                        </Suspense>
                                    </Grid>
                                );
                            })}
                        </Box>
                    }
                </Box>

                {needsDate && (
                    <Box>
                        <Typography sx={{ mb: 1, fontWeight: 800, color: "#334155" }}>
                            Next Follow-up Date
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                value={followUpDate ? dayjs(followUpDate) : null}
                                onChange={(newValue) => setFollowUpDate(newValue)}
                                minDateTime={dayjs()}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        sx: {
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 3,
                                                bgcolor: "#fff",
                                            },
                                        },
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                )}

                <Box>
                    {
                        statusName?.status_name === "SOLD" && (
                            <Suspense fallback={<PolicyDetailsFormSkeleton />}>
                                <PolicyDetailsForm
                                    policyData={policyData}
                                    setPolicyData={setPolicyData}
                                    insuranceCompanies={InsuranceCompanyMasterDetail}
                                />
                            </Suspense>
                        )
                    }

                    <TextField
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Enter discussion notes..."
                        value={followUpRemarks}
                        onChange={(e) => setFollowUpRemarks(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                bgcolor: "#fff",
                            },
                        }}
                    />
                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    gap={2}
                    sx={{ pt: 1 }}
                >
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "#64748b",
                            fontWeight: 600,
                        }}
                    >
                        This update will be recorded in the lead history.
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSave}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                textTransform: "none",
                                fontWeight: 800,
                                background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                            }}
                        >
                            Save Update
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export default FollowUpForm;