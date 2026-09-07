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
    useTheme,
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
import { useInsuranceCompanyMaster, useOutcomeByStatusId } from "../../CommonCode/useQuery";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import OutcomeCard from "./OutcomeCard";
import OutcomeCardSkeleton from "../../SkeletonComponent/OutcomeCardSkeleton";
import PolicyDetailsFormSkeleton from "../../SkeletonComponent/PolicyDetailsFormSkeleton";




const PolicyDetailsForm = lazy(() => import('./PolicyDetailsForm'))



const FollowUpForm = ({
    statusName,
    onCancel,
    onSave
}) => {

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery("(max-width:600px)");
    const needsDate = statusName?.requires_followup === 1;
    const isFollowupDateRequired = statusName?.is_followup_date_required === 1;


    const { data: InsuranceCompanyMasterDetail } = useInsuranceCompanyMaster();
    const { data: OUTCOMES, isLoading: LoadingOutComes } = useOutcomeByStatusId(statusName?.status_id, needsDate);

    const glassCard = {
        bgcolor: isDark ? "rgba(15,23,42,0.6)" : "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 35px rgba(15,23,42,.08)",
        borderRadius: 4,
    };

    const [followUpDate, setFollowUpDate] = useState("");
    const [followUpRemarks, setFollowUpRemarks] = useState("");
    const [followUpOutcome, setFollowUpOutcome] = useState("");

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
                    <Typography sx={{ mb: 1, fontWeight: 800, color: isDark ? "#ffffff" : "#1e293b", }}>
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
                                const active = followUpOutcome === item?.outcome_key;
                                return (
                                    <Grid item xs={12} sm={6} md={3} key={item?.outcome_key}>
                                        <Suspense fallback={<OutcomeCardSkeleton />}>
                                            <OutcomeCard
                                                item={item}
                                                active={active}
                                                onClick={() => setFollowUpOutcome(item?.outcome_key)}
                                            />
                                        </Suspense>
                                    </Grid>
                                );
                            })}
                        </Box>
                    }
                </Box>

                {isFollowupDateRequired && (
                    <Box>
                        <Typography sx={{ mb: 1, fontWeight: 800, color: "#334155" }}>
                            Next Follow-up Date
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                value={followUpDate ? dayjs(followUpDate) : null}
                                onChange={(newValue) => setFollowUpDate(newValue)}
                                minDateTime={dayjs()}
                                format="DD/MM/YYYY hh:mm A"
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
                                bgcolor: isDark ? "rgba(15,23,42,0.6)" : "#fff",

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