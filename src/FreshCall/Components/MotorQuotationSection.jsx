
import React, { memo, Suspense, useState } from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import BadgeIcon from '@mui/icons-material/Badge';
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThejaswiQuotationPreviewModal from "./ThejaswiQuotationPreviewModal";
import GlobalLoader from "../../CommonComponents/GlobalLoader";


const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
};

const getStatusColor = (status) => {
    switch (String(status || "").toUpperCase()) {
        case "CALCULATED":
        case "ACTIVE":
        case "APPROVED":
            return "success";
        case "FAILED":
        case "REJECTED":
        case "CANCELLED":
            return "error";
        case "PENDING":
        case "PROCESSING":
            return "warning";
        default:
            return "default";
    }
};

const SectionTitle = ({ icon, title, count }) => (
    <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
    >
        <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ display: "flex", color: "primary.main" }}>
                {icon}
            </Box>

            <Typography fontWeight={700} variant="subtitle1">
                {title}
            </Typography>
        </Stack>

        {count !== undefined && (
            <Chip
                size="small"
                label={count}
                variant="outlined"
                sx={{ height: 23, fontSize: 11 }}
            />
        )}
    </Stack>
);

const PremiumRow = ({ label, value, bold = false, negative = false }) => (
    <TableRow>
        <TableCell
            sx={{
                px: 1.5,
                py: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
                color: bold ? "text.primary" : "text.secondary",
                fontWeight: bold ? 700 : 400,
                fontSize: 13,
            }}
        >
            {label}
        </TableCell>

        <TableCell
            align="right"
            sx={{
                px: 1.5,
                py: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
                fontWeight: bold ? 800 : 600,
                fontSize: 13,
                color: negative ? "success.main" : "text.primary",
                whiteSpace: "nowrap",
            }}
        >
            {formatCurrency(value)}
        </TableCell>
    </TableRow>
);

const MotorQuotationSection = ({ quotations = [] }) => {
    const [expandedQuotation, setExpandedQuotation] = useState(null);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);

    const handleViewDetails = (item) => {
        setSelectedQuotation(item);
        setPreviewOpen(true);
    };
    const validQuotations = Array.isArray(quotations)
        ? quotations.filter((item) => item?.quotation)
        : [];

    if (!validQuotations.length) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 5,
                    textAlign: "center",
                    borderRadius: 2,
                    borderStyle: "dashed",
                }}
            >
                <DescriptionOutlinedIcon
                    sx={{ fontSize: 38, color: "text.secondary", mb: 1 }}
                />

                <Typography fontWeight={700}>
                    No Motor Quotations
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    No quotations have been created for this lead yet.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            {/* PAGE HEADER */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1.5}
                sx={{ mb: 2.5 }}
            >
                <Box>
                    <Typography variant="h6" fontWeight={800}>
                        Motor Quotations
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Review quotations and compare insurer premiums
                    </Typography>
                </Box>

                <Chip
                    label={`${validQuotations.length} quotation${validQuotations.length !== 1 ? "s" : ""
                        }`}
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                />
            </Stack>

            {/* QUOTATIONS */}
            <Stack spacing={1.5}>
                {validQuotations?.map((item) => {
                    const quotation = item.quotation;
                    const options = Array.isArray(item.options)
                        ? item.options
                        : [];

                    const calculatedOptions = options.filter(
                        (option) =>
                            String(option.calculation_status).toUpperCase() ===
                            "CALCULATED"
                    );

                    const lowestOption = calculatedOptions.reduce(
                        (lowest, option) => {
                            const premium = Number(
                                option.final_premium ??
                                option.effective_net_payable ??
                                option.total_premium ??
                                0
                            );

                            return !lowest || premium < lowest.premium
                                ? { option, premium }
                                : lowest;
                        },
                        null
                    );

                    const isExpanded =
                        expandedQuotation === quotation.motor_quotation_id;

                    return (
                        <Accordion
                            key={quotation.motor_quotation_id}
                            expanded={isExpanded}
                            onChange={() =>
                                setExpandedQuotation(
                                    isExpanded
                                        ? null
                                        : quotation.motor_quotation_id
                                )
                            }
                            disableGutters
                            elevation={0}
                            sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: "8px !important",
                                overflow: "hidden",
                                "&::before": { display: "none" },
                                "&.Mui-expanded": {
                                    borderColor: "primary.light",
                                    mb: 0,
                                },
                            }}
                        >
                            {/* QUOTATION SUMMARY */}
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    px: { xs: 1.5, sm: 2.5 },
                                    py: 1,
                                    "& .MuiAccordionSummary-content": {
                                        my: 1,
                                    },
                                }}
                            >

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "minmax(0, 1fr)",
                                            sm: "minmax(0, 1fr) minmax(0, 1fr)",
                                            md: "minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 0.7fr)",
                                        },
                                        alignItems: "center",
                                        gap: { xs: 2, md: 3 },
                                        width: "100%",
                                        minWidth: 0,
                                        boxSizing: "border-box",
                                        pr: 1,
                                    }}
                                >
                                    {/* QUOTATION DETAILS */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor: "action.hover",
                                                color: "primary.main",
                                                borderRadius: 1.5,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <DescriptionOutlinedIcon />
                                        </Box>

                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={700}
                                                sx={{ overflowWrap: "anywhere" }}
                                            >
                                                {quotation.quotation_number}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(quotation.quotation_date)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* FINAL PREMIUM */}
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            sx={{ mb: 0.5 }}
                                        >
                                            Final Premium
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            fontWeight={800}
                                            color="success.dark"
                                            sx={{ lineHeight: 1.3, overflowWrap: "anywhere" }}
                                        >
                                            {lowestOption
                                                ? formatCurrency(lowestOption.premium)
                                                : "-"}
                                        </Typography>
                                    </Box>



                                    {/* NEW: INSURANCE COMPANIES */}
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            sx={{ mb: 0.5 }}
                                        >
                                            Taken By
                                        </Typography>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                            <Box
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    bgcolor: "primary.50",
                                                    color: "primary.main",
                                                    borderRadius: 1.5,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <BadgeIcon fontSize="small" />
                                            </Box>

                                            <Typography variant="body2" fontWeight={700}>
                                                {quotation?.quotation_taken_employee || "Employee Name"}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* PREVIEW */}
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            sx={{ mb: 0.5 }}
                                        >
                                            Preview
                                        </Typography>

                                        {/* PREVIEW */}
                                        <Box sx={{ minWidth: 0 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<VisibilityIcon sx={{ fontSize: 17 }} />}
                                                onClick={() => handleViewDetails(item)}
                                                sx={{
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                    fontSize: "0.8rem",
                                                    px: 2,
                                                    py: 0.8,
                                                    borderRadius: 2,
                                                    borderColor: "primary.main",
                                                    color: "primary.main",
                                                    whiteSpace: "nowrap",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        bgcolor: "primary.main",
                                                        color: "#fff",
                                                        borderColor: "primary.main",
                                                        boxShadow: "0 3px 10px rgba(25, 118, 210, 0.18)",
                                                    },
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>

                            </AccordionSummary>

                            <AccordionDetails
                                sx={{
                                    p: { xs: 1.5, sm: 2.5 },
                                    borderTop: "1px solid",
                                    borderColor: "divider",
                                }}
                            >

                                {/* INSURER COMPARISON */}
                                <SectionTitle
                                    icon={<BusinessOutlinedIcon />}
                                    title="Insurer Comparison"
                                    count={options.length}
                                />

                                {options.length === 0 ? (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        No insurer options available.
                                    </Typography>
                                ) : (
                                    <TableContainer
                                        sx={{
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 1.5,
                                            mb: 3,
                                        }}
                                    >
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow
                                                    sx={{
                                                        bgcolor: "action.hover",
                                                        "& th": {
                                                            fontWeight: 700,
                                                            fontSize: 12,
                                                            color: "text.secondary",
                                                            whiteSpace: "nowrap",
                                                            py: 1.5,
                                                        },
                                                    }}
                                                >
                                                    <TableCell>Insurance Company</TableCell>

                                                    <TableCell align="right">
                                                        OD Premium
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        TP Premium
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        GST
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        Final Premium
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        After Cashback
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {options.map((option) => {
                                                    const isLowest =
                                                        lowestOption?.option
                                                            ?.quotation_option_id ===
                                                        option.quotation_option_id;

                                                    return (
                                                        <TableRow
                                                            key={
                                                                option.quotation_option_id
                                                            }
                                                            sx={{
                                                                "&:hover": {
                                                                    bgcolor: "action.hover",
                                                                },
                                                                "& td": {
                                                                    py: 1.5,
                                                                    fontSize: 12,
                                                                },
                                                            }}
                                                        >
                                                            <TableCell
                                                                sx={{ minWidth: 180 }}
                                                            >
                                                                <Stack
                                                                    spacing={0.5}
                                                                    alignItems="flex-start"
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        fontWeight={700}
                                                                    >
                                                                        {option.insurance_company_name ||
                                                                            `Company #${option.insurance_company_id}`}
                                                                    </Typography>

                                                                    <Chip
                                                                        size="small"
                                                                        label={
                                                                            option.calculation_status ||
                                                                            "UNKNOWN"
                                                                        }
                                                                        color={getStatusColor(
                                                                            option.calculation_status
                                                                        )}
                                                                        sx={{
                                                                            height: 19,
                                                                            fontSize: 10,
                                                                        }}
                                                                    />
                                                                </Stack>
                                                            </TableCell>



                                                            <TableCell align="right">
                                                                {formatCurrency(
                                                                    option.net_od
                                                                )}
                                                            </TableCell>

                                                            <TableCell align="right">
                                                                {formatCurrency(
                                                                    option.tp_premium
                                                                )}
                                                            </TableCell>

                                                            <TableCell align="right">
                                                                {formatCurrency(
                                                                    option.gst_amount
                                                                )}
                                                            </TableCell>

                                                            <TableCell
                                                                align="right"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {formatCurrency(
                                                                    option.final_premium ??
                                                                    option.total_premium
                                                                )}

                                                                {isLowest && (
                                                                    <Typography
                                                                        variant="caption"
                                                                        display="block"
                                                                        color="success.main"
                                                                        fontWeight={700}
                                                                    >
                                                                        Lowest
                                                                    </Typography>
                                                                )}
                                                            </TableCell>

                                                            <TableCell
                                                                align="right"
                                                                sx={{
                                                                    fontWeight: 800,
                                                                    color: "success.dark",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {formatCurrency(
                                                                    option.effective_net_payable ??
                                                                    option.final_premium
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}

                                {/* OPTION DETAILS */}
                                <Stack spacing={2.5}>
                                    {options?.map((option) => (
                                        <Box
                                            key={option.quotation_option_id}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "divider",
                                                borderRadius: 2,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    px: 2,
                                                    py: 1.5,
                                                    bgcolor: "action.hover",
                                                }}
                                            >
                                                <Stack
                                                    direction={{
                                                        xs: "column",
                                                        sm: "row",
                                                    }}
                                                    justifyContent="space-between"
                                                    alignItems={{
                                                        xs: "flex-start",
                                                        sm: "center",
                                                    }}
                                                    spacing={1}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        fontWeight={800}
                                                    >
                                                        {option.insurance_company_name ||
                                                            `Company #${option.insurance_company_id}`}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={800}
                                                        color="primary.main"
                                                    >
                                                        Final:{" "}
                                                        {formatCurrency(
                                                            option.final_premium ??
                                                            option.total_premium
                                                        )}
                                                    </Typography>
                                                </Stack>
                                            </Box>


                                            <Box
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: {
                                                        xs: "minmax(0, 1fr)",
                                                        md: "minmax(0, 1fr) minmax(0, 1fr)",
                                                    },
                                                    gap: 2,
                                                    width: "100%",
                                                    minWidth: 0,
                                                    boxSizing: "border-box",
                                                    p: 2
                                                }}
                                            >
                                                {/* PREMIUM BREAKDOWN */}
                                                <Box sx={{ width: "100%", minWidth: 0 }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        fontWeight={700}
                                                        sx={{ mb: 1 }}
                                                    >
                                                        Premium Breakdown
                                                    </Typography>

                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableBody>
                                                                <PremiumRow
                                                                    label="Basic OD"
                                                                    value={option.basic_od}
                                                                />

                                                                <PremiumRow
                                                                    label="OD Discount"
                                                                    value={
                                                                        -Number(
                                                                            option.od_discount ||
                                                                            0
                                                                        )
                                                                    }
                                                                    negative
                                                                />

                                                                <PremiumRow
                                                                    label={`NCB (${option.ncb_percentage || 0}%)`}
                                                                    value={
                                                                        -Number(
                                                                            option.ncb_amount ||
                                                                            0
                                                                        )
                                                                    }
                                                                    negative
                                                                />

                                                                <PremiumRow
                                                                    label="De-tariff"
                                                                    value={
                                                                        option.de_tariff_amount
                                                                    }
                                                                />

                                                                <PremiumRow
                                                                    label="Net OD"
                                                                    value={option.net_od}
                                                                    bold
                                                                />

                                                                <PremiumRow
                                                                    label="TP Premium"
                                                                    value={option.tp_premium}
                                                                />

                                                                <PremiumRow
                                                                    label="Zero Depreciation"
                                                                    value={option.zd_premium}
                                                                />

                                                                <PremiumRow
                                                                    label="Addons"
                                                                    value={option.addon_premium}
                                                                />

                                                                <PremiumRow
                                                                    label="CPA"
                                                                    value={option.cpa_premium}
                                                                />

                                                                <PremiumRow
                                                                    label="Liability"
                                                                    value={
                                                                        option.liability_premium
                                                                    }
                                                                />

                                                                <PremiumRow
                                                                    label="Passenger Cover"
                                                                    value={
                                                                        option.passenger_premium
                                                                    }
                                                                />

                                                                <PremiumRow
                                                                    label="Subtotal"
                                                                    value={option.subtotal}
                                                                    bold
                                                                />

                                                                <PremiumRow
                                                                    label="GST"
                                                                    value={option.gst_amount}
                                                                />

                                                                <PremiumRow
                                                                    label="Final Premium"
                                                                    value={
                                                                        option.final_premium ??
                                                                        option.total_premium
                                                                    }
                                                                    bold
                                                                />

                                                                <PremiumRow
                                                                    label="After Cashback"
                                                                    value={
                                                                        option.effective_net_payable ??
                                                                        option.final_premium
                                                                    }
                                                                    bold
                                                                />
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Box>

                                                {/* COVERS AND ADDONS */}
                                                <Box sx={{ width: "100%", minWidth: 0 }}>
                                                    <SectionTitle
                                                        icon={<ShieldOutlinedIcon />}
                                                        title="Covers"
                                                        count={
                                                            option.covers?.length || 0
                                                        }
                                                    />

                                                    {option.covers?.length ? (
                                                        <TableContainer>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow
                                                                        sx={{
                                                                            bgcolor:
                                                                                "action.hover",
                                                                            "& th": {
                                                                                fontWeight: 700,
                                                                                fontSize: 12,
                                                                            },
                                                                        }}
                                                                    >
                                                                        <TableCell>
                                                                            Cover
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            Type
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            Amount
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>

                                                                <TableBody>
                                                                    {option.covers.map(
                                                                        (cover) => (
                                                                            <TableRow
                                                                                key={
                                                                                    cover.quotation_option_cover_id
                                                                                }
                                                                            >
                                                                                <TableCell>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        fontWeight={600}
                                                                                    >
                                                                                        {cover.cover_name ||
                                                                                            `Cover #${cover.cover_id}`}
                                                                                    </Typography>

                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        color="text.secondary"
                                                                                    >
                                                                                        Qty:{" "}
                                                                                        {cover.quantity}
                                                                                    </Typography>
                                                                                </TableCell>

                                                                                <TableCell>
                                                                                    <Typography
                                                                                        variant="caption"
                                                                                        color="text.secondary"
                                                                                    >
                                                                                        {(
                                                                                            cover.cover_type ||
                                                                                            "-"
                                                                                        ).replace(
                                                                                            /_/g,
                                                                                            " "
                                                                                        )}
                                                                                    </Typography>
                                                                                </TableCell>

                                                                                <TableCell
                                                                                    align="right"
                                                                                    sx={{
                                                                                        whiteSpace:
                                                                                            "nowrap",
                                                                                        fontWeight: 600,
                                                                                    }}
                                                                                >
                                                                                    {formatCurrency(
                                                                                        cover.amount
                                                                                    )}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    ) : (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            No covers selected.
                                                        </Typography>
                                                    )}

                                                    <Divider sx={{ my: 2.5 }} />

                                                    <SectionTitle
                                                        icon={
                                                            <BusinessOutlinedIcon />
                                                        }
                                                        title="Addons"
                                                        count={
                                                            option.addons?.length || 0
                                                        }
                                                    />

                                                    {option.addons?.length ? (
                                                        <TableContainer>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow
                                                                        sx={{
                                                                            bgcolor:
                                                                                "action.hover",
                                                                            "& th": {
                                                                                fontWeight: 700,
                                                                                fontSize: 12,
                                                                            },
                                                                        }}
                                                                    >
                                                                        <TableCell>
                                                                            Addon
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            Amount
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>

                                                                <TableBody>
                                                                    {option.addons.map(
                                                                        (addon) => (
                                                                            <TableRow
                                                                                key={
                                                                                    addon.quotation_option_addon_id
                                                                                }
                                                                            >
                                                                                <TableCell>
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        fontWeight={600}
                                                                                    >
                                                                                        {addon.addon_name ||
                                                                                            `Addon #${addon.addon_id}`}
                                                                                    </Typography>

                                                                                    {addon.addon_code && (
                                                                                        <Typography
                                                                                            variant="caption"
                                                                                            color="text.secondary"
                                                                                        >
                                                                                            {
                                                                                                addon.addon_code
                                                                                            }
                                                                                        </Typography>
                                                                                    )}
                                                                                </TableCell>

                                                                                <TableCell
                                                                                    align="right"
                                                                                    sx={{
                                                                                        whiteSpace:
                                                                                            "nowrap",
                                                                                        fontWeight: 600,
                                                                                    }}
                                                                                >
                                                                                    {formatCurrency(
                                                                                        addon.amount
                                                                                    )}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    ) : (
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            No addons selected.
                                                        </Typography>
                                                    )}


                                                </Box>
                                            </Box>

                                        </Box>
                                    ))}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Stack>
            <Suspense fallback={<GlobalLoader />}>

                <ThejaswiQuotationPreviewModal
                    open={previewOpen}
                    onClose={() => setPreviewOpen(false)}
                    quotationItem={selectedQuotation}
                />
            </Suspense>
        </Box>
    );
};

export default memo(MotorQuotationSection);
