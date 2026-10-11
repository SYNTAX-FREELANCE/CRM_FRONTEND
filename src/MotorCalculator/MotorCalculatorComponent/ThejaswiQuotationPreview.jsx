
import React, { useMemo, useRef, useState } from "react";
import {
    Box,
    Button,
    Divider,
    Paper,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { toJpeg } from "html-to-image";
import companylogo from '../../assets/loginimages/companylogo.png'

/**
 * Independent Thejaswi quotation preview page.
 * Props: calculationData, formData, formatNumber, quoteData (optional).
 */
export default function ThejaswiQuotationPreview({
    calculationData,
    formData = {},
    VehicleDetails,
    createQuotation,
    formatNumber = (v) =>
        Number(v || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
    quoteData = {},
}) {
    const quotationRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState("");





    const money = (v) => `₹${formatNumber(Number(v || 0))}`;
    const num = (v) => Number(v ?? 0) || 0;

    const quote = {
        quoteNo: quoteData?.quoteNo,
        quoteDate:
            quoteData.quoteDate || new Date().toLocaleDateString("en-IN"),
        customer:
            quoteData.customerName ||
            formData.customer_name ||
            formData.customerName ||
            formData.insured_name ||
            "Customer",
        insurer:
            quoteData.insurerName ||
            formData.insurance_company_name ||
            formData.insurer_name ||
            "Insurance Company",
        product:
            quoteData.productName ||
            formData.product_name ||
            formData.policy_name ||
            "Motor Insurance Policy",
        agent: quoteData.agentName || "Thejaswi",
        phone: quoteData.contactNo || "",
        email: quoteData.email || "",
        address: quoteData.address || "",
    };

    const vehicleRows = [
        [
            "Vehicle Category",
            VehicleDetails?.vehicle_category ||
            "—",
        ],
        [
            "Vehicle Class",
            VehicleDetails?.vehicle_class || "—",
        ],
        [
            "Registration Number",
            VehicleDetails?.registration_number ||
            "—",
        ],
        [
            "Registration Date",
            VehicleDetails?.registration_date || "—",
        ],
        [
            "Policy Start Date",
            formData.policy_start_date || formData.policy_start_date || "—",
        ],
        [
            "Engine Capacity",
            formData.engine_cc ? `${formData.engine_cc} CC` : "—",
        ],
        ["Gross Vehicle Weight", formData.gvw ? `${formData.gvw} KG` : "—"],
        ["Seating Capacity", formData.seating_capacity || "—"],
        ["Insured Declared Value (IDV)", money(formData?.idv)],
    ];

    const p = useMemo(() => {
        const idv = num(formData.idv);
        const od = calculationData?.od_calculation || {};
        const odRule = calculationData?.od_rate?.[0] || {};
        const odType = String(
            odRule.rate_type || "PERCENTAGE"
        ).toUpperCase();
        const odRate = num(
            odRule.slab_rate_value ??
            odRule.rate_value ??
            odRule.master_rate_value
        );

        const basicOD = num(
            od.basic_od_premium ??
            (odType === "FIXED" ? odRate : (idv * odRate) / 100)
        );

        const ncbRule = calculationData?.ncb_rule?.[0] || {};
        const ncbPct = Math.min(
            100,
            Math.max(
                0,
                num(
                    od.ncb_percentage ??
                    ncbRule.calculated_ncb_percentage ??
                    ncbRule.ncb_percentage
                )
            )
        );

        const ncb = Math.min(
            basicOD,
            Math.max(0, num(od.ncb_amount ?? (basicOD * ncbPct) / 100))
        );

        const discountRule = calculationData?.discount_rule?.[0] || {};
        const discountPct = Math.max(
            0,
            num(
                od.discount_percentage ??
                discountRule.discount_percentage ??
                discountRule.rate_value ??
                discountRule.discount_rate
            )
        );

        const configuredDiscount = Math.max(
            0,
            num(
                od.discount_amount ??
                ((basicOD - ncb) * discountPct) / 100
            )
        );

        const netOD = Math.max(
            0,
            num(od.final_od_premium ?? basicOD - ncb - configuredDiscount)
        );

        const addonIds = Array.isArray(formData.addon_ids)
            ? formData.addon_ids.map(Number)
            : [];

        const addons = (calculationData?.addons || [])
            .filter((x) => addonIds.includes(Number(x.addon_id)))
            .map((x) => {
                const type = String(
                    x.rate_type || "PERCENTAGE"
                ).toUpperCase();
                const rate = num(x.rate_value);

                return {
                    label: x.addon_name || x.name || "Add-on",
                    amount:
                        type === "FIXED"
                            ? rate
                            : type === "PERCENTAGE"
                                ? (idv * rate) / 100
                                : 0,
                };
            });

        const addonTotal = addons.reduce((s, x) => s + x.amount, 0);

        const tpRule = calculationData?.tp_rate?.[0] || {};
        const tpType = String(tpRule.rate_type || "FIXED").toUpperCase();
        const tpRate = num(
            tpRule.slab_rate_value ??
            tpRule.rate_value ??
            tpRule.master_rate_value
        );

        const tp = tpType === "PERCENTAGE" ? (idv * tpRate) / 100 : tpRate;

        const coverIds = Array.isArray(formData.cover_ids)
            ? formData.cover_ids.map(Number)
            : [];

        const covers = (calculationData?.covers || [])
            .filter((x) => coverIds.includes(Number(x.cover_id)))
            .map((x) => {
                const type = String(x.rate_type || "FIXED").toUpperCase();
                const rate = num(x.rate_value);
                const seats = num(formData.seating_capacity);
                const pending = type === "PER_UNIT" && seats <= 0;

                return {
                    label: x.cover_name || x.name || "Additional cover",
                    amount:
                        type === "PERCENTAGE"
                            ? (idv * rate) / 100
                            : type === "PER_UNIT"
                                ? rate * seats
                                : rate,
                    pending,
                };
            });

        const coverTotal = covers.reduce(
            (s, x) => s + (x.pending ? 0 : x.amount),
            0
        );

        const dePct = Math.min(
            100,
            Math.max(0, num(formData.de_tariff_discount))
        );

        const deAmount = Math.min(netOD, (netOD * dePct) / 100);
        const discountedOD = Math.max(0, netOD - deAmount);
        const subtotal = Math.max(
            0,
            discountedOD + addonTotal + tp + coverTotal
        );

        const taxes = (
            Array.isArray(calculationData?.tax) ? calculationData.tax : []
        ).map((t) => {
            const component = String(
                t.premium_component || ""
            ).toUpperCase();

            const taxable =
                component === "OD"
                    ? discountedOD
                    : component === "TP"
                        ? tp
                        : component === "ADDON"
                            ? addonTotal
                            : component === "COVER"
                                ? coverTotal
                                : 0;

            const type = String(
                t.tax_type || "PERCENTAGE"
            ).toUpperCase();

            const amount =
                type === "FIXED"
                    ? num(t.tax_amount ?? t.fixed_amount ?? t.tax_value)
                    : (taxable * num(t.tax_percentage)) / 100;

            return {
                label: `${t.tax_name || t.tax_code || "Tax"}${type === "PERCENTAGE"
                    ? ` (${num(t.tax_percentage)}%)`
                    : ""
                    }`,
                component,
                amount,
            };
        });

        const taxTotal = taxes.reduce((s, x) => s + x.amount, 0);

        const total = subtotal + taxTotal;

        /*
         * COMMISSION
         * Commission = Premium Before Tax * Commission %
         * Apply max_commission_amount.
         */

        const commissionRule = calculationData?.commission?.[0];
        const cashbackRule = calculationData?.cashback?.[0];
        const profitRule = calculationData?.profit?.[0];

        const commissionType = String(
            commissionRule?.commission_type || ""
        ).toUpperCase();

        const commissionValue = num(
            commissionRule?.commission_value
        );

        const maxCommissionAmount =
            commissionRule?.max_commission_amount != null &&
                commissionRule?.max_commission_amount !== ""
                ? num(commissionRule.max_commission_amount)
                : null;

        const commissionMinPremium =
            commissionRule?.min_premium != null
                ? num(commissionRule.min_premium)
                : null;

        const commissionMaxPremium =
            commissionRule?.max_premium != null
                ? num(commissionRule.max_premium)
                : null;

        const commissionEligible =
            (commissionMinPremium === null ||
                subtotal >= commissionMinPremium) &&
            (commissionMaxPremium === null ||
                subtotal <= commissionMaxPremium);

        let commission = 0;

        if (commissionRule && commissionEligible) {
            if (commissionType === "PERCENTAGE") {
                commission =
                    (subtotal * commissionValue) / 100;
            } else if (commissionType === "FIXED") {
                commission = commissionValue;
            }

            if (maxCommissionAmount !== null) {
                commission = Math.min(
                    commission,
                    Math.max(0, maxCommissionAmount)
                );
            }
        }

        commission = Math.max(
            0,
            Number(commission.toFixed(2))
        );

        /*
         * FIXED PROFIT FROM PROFIT MASTER
         */

        const profit = Math.max(
            0,
            num(profitRule?.profit_amount)
        );

        /*
         * CASHBACK
         * Calculated cashback = Commission - Profit.
         * Manual formData.cash_back or cashback_amount
         * takes precedence.
         */

        const manualCashbackValue =
            formData.cash_back !== undefined &&
                formData.cash_back !== null &&
                formData.cash_back !== ""
                ? formData.cash_back
                : formData.cashback_amount;

        const hasManualCashback =
            manualCashbackValue !== undefined &&
            manualCashbackValue !== null &&
            manualCashbackValue !== "";

        const cashbackMinPremium =
            cashbackRule?.min_premium != null
                ? num(cashbackRule.min_premium)
                : null;

        const cashbackMaxPremium =
            cashbackRule?.max_premium != null
                ? num(cashbackRule.max_premium)
                : null;

        const cashbackEligible =
            (cashbackMinPremium === null ||
                total >= cashbackMinPremium) &&
            (cashbackMaxPremium === null ||
                total <= cashbackMaxPremium);

        const maxCashbackAmount =
            cashbackRule?.max_cashback_amount != null &&
                cashbackRule.max_cashback_amount !== ""
                ? Math.max(
                    0,
                    num(cashbackRule.max_cashback_amount)
                )
                : null;

        let cashback = 0;
        let cashbackSource = "";

        if (hasManualCashback) {
            cashback = Math.max(
                0,
                num(manualCashbackValue)
            );

            cashbackSource = "FORM";
        } else if (cashbackRule && cashbackEligible) {
            cashback = Math.max(0, commission - profit);
            cashbackSource = "COMMISSION";
        }

        // Apply cashback cap to calculated and manual cashback.
        if (maxCashbackAmount !== null) {
            cashback = Math.min(
                cashback,
                maxCashbackAmount
            );
        }

        // Cashback cannot exceed the total premium.
        cashback = Math.min(
            total,
            Math.max(0, Number(cashback.toFixed(2)))
        );

        const netPayable = Math.max(
            0,
            total - cashback
        );

        return {
            basicOD,
            ncbPct,
            ncb,
            netOD,
            addons,
            addonTotal,
            tp,
            covers,
            coverTotal,
            dePct,
            deAmount,
            discountedOD,
            subtotal,
            taxes,
            taxTotal,
            total,

            commission,
            maxCommissionAmount,
            profit,

            cashback,
            cashbackSource,
            maxCashbackAmount,
            netPayable,
        };

    }, [calculationData, formData]);

    const handleDownloadJpg = async () => {
        const element = quotationRef.current;

        if (!element || isExporting) return;

        setIsExporting(true);
        setExportError("");

        try {
            if (document.fonts?.ready) {
                await document.fonts.ready;
            }

            // Wait for all quotation images to load.
            const images = Array.from(element.querySelectorAll("img"));

            await Promise.all(
                images.map(async (img) => {
                    if (img.complete && img.naturalWidth > 0) return;

                    try {
                        if (typeof img.decode === "function") {
                            await img.decode();
                            return;
                        }
                    } catch {
                        // Continue if the image cannot be decoded.
                    }

                    await new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );

            // Capture the complete quotation, not just the visible viewport.
            const exportWidth = Math.max(
                element.scrollWidth,
                element.offsetWidth,
                900
            );

            const exportHeight = Math.max(
                element.scrollHeight,
                element.offsetHeight
            );

            const dataUrl = await toJpeg(element, {
                quality: 0.98,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
                cacheBust: true,
                width: exportWidth,
                height: exportHeight,
                canvasWidth: exportWidth * 2,
                canvasHeight: exportHeight * 2,
                style: {
                    width: `${exportWidth}px`,
                    minWidth: `${exportWidth}px`,
                    maxWidth: "none",
                    height: `${exportHeight}px`,
                    minHeight: `${exportHeight}px`,
                    maxHeight: "none",
                    overflow: "visible",
                    margin: "0",
                    transform: "none",
                },
            });

            const link = document.createElement("a");

            const safeQuoteNo = String(
                quote.quoteNo || "quotation"
            ).replace(/[^a-zA-Z0-9_-]/g, "-");

            link.download = `Thejaswi-Quotation-${safeQuoteNo}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Failed to export quotation as JPG:", error);

            setExportError(
                "Unable to generate the complete JPG. Please check the quotation images and try again."
            );
        } finally {
            setIsExporting(false);
        }
    };

    const Section = ({ title, meta }) => (
        <Box
            sx={{
                px: 1.4,
                py: 0.9,
                bgcolor: "#172f65",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
            }}
        >
            <Typography
                sx={{
                    fontSize: 12.5,
                    fontWeight: 800,
                    letterSpacing: ".04em",
                }}
            >
                {title}
            </Typography>

            {meta && (
                <Typography sx={{ fontSize: 11, color: "#dbeafe" }}>
                    {meta}
                </Typography>
            )}
        </Box>
    );

    const Row = ({
        label,
        value,
        bold = false,
        negative = false,
        note,
        nomoney = false
    }) => (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
                px: 1.25,
                py: 0.7,
                borderBottom: "1px solid #e9edf4",
            }}
        >
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: 12.5,
                        color: "#344054",
                        fontWeight: bold ? 900 : 900,
                    }}
                >
                    {label}
                </Typography>

                {note && (
                    <Typography
                        sx={{ mt: 0.2, fontSize: 10, color: "#8792a5", fontWeight: 900 }}
                    >
                        {note}
                    </Typography>
                )}
            </Box>

            <Typography
                sx={{
                    whiteSpace: "nowrap",
                    fontSize: 10.5,
                    fontWeight: bold ? 800 : 600,
                    color: negative ? "#b42332" : "#172033",
                }}
            >
                {negative ? "− " : ""}
                {nomoney ? value : money(value)}
            </Typography>
        </Box>
    );

    return (
        <Box
            sx={{
                bgcolor: "#eef2f7",
                p: { xs: 0.5, sm: 2 },
                minHeight: "100%",
            }}
        >

            <Box
                className="quotation-toolbar"
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                    mb: 2,
                    p: 1.25,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.25,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 3,
                    boxShadow: "0 3px 12px rgba(23, 47, 101, 0.06)",
                    "@media print": {
                        display: "none",
                    },
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<PrintOutlinedIcon />}
                    onClick={() => window.print()}
                    sx={{
                        minHeight: 42,
                        px: 2,
                        borderRadius: 2,
                        borderColor: "#cbd5e1",
                        color: "#334155",
                        bgcolor: "#ffffff",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 13,
                        transition: "all 0.2s ease",
                        "&:hover": {
                            borderColor: "#172f65",
                            bgcolor: "#f1f5f9",
                        },
                    }}
                >
                    Print / Save PDF
                </Button>

                <Button
                    variant="outlined"
                    startIcon={
                        isExporting ? (
                            <CircularProgress size={17} color="inherit" />
                        ) : (
                            <DownloadOutlinedIcon />
                        )
                    }
                    onClick={handleDownloadJpg}
                    disabled={isExporting}
                    sx={{
                        minHeight: 42,
                        px: 2,
                        borderRadius: 2,
                        borderColor: "#bfdbfe",
                        color: "#1d4ed8",
                        bgcolor: "#eff6ff",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 13,
                        transition: "all 0.2s ease",
                        "&:hover": {
                            borderColor: "#60a5fa",
                            bgcolor: "#dbeafe",
                        },
                        "&.Mui-disabled": {
                            opacity: 0.7,
                        },
                    }}
                >
                    {isExporting ? "Preparing JPG..." : "Download JPG"}
                </Button>

                <Button
                    variant="contained"
                    startIcon={<PrintOutlinedIcon />}
                    onClick={createQuotation}
                    sx={{
                        minHeight: 42,
                        px: 2.5,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #172f65 0%, #2854a1 100%)",
                        color: "#ffffff",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: 13,
                        boxShadow: "0 4px 10px rgba(23, 47, 101, 0.2)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            background: "linear-gradient(135deg, #101d40 0%, #1d4385 100%)",
                            boxShadow: "0 6px 14px rgba(23, 47, 101, 0.28)",
                            transform: "translateY(-1px)",
                        },
                    }}
                >
                    Generate Quote
                </Button>
            </Box>


            {/* button */}

            {exportError && (
                <Alert
                    severity="error"
                    onClose={() => setExportError("")}
                    sx={{ maxWidth: 900, mx: "auto", mb: 2 }}
                >
                    {exportError}
                </Alert>
            )}

            <Paper
                ref={quotationRef}
                className="thejaswi-quotation-page"
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    minWidth: 0,
                    minHeight: 1120,
                    mx: "auto",
                    bgcolor: "#fff",
                    color: "#172033",
                    border: "1px solid #dce3ed",
                    overflow: "visible",
                    "& *": {
                        boxSizing: "border-box",
                    },
                    "@media print": {
                        width: "100%",
                        maxWidth: "none",
                        minHeight: 0,
                        border: 0,
                        boxShadow: "none",
                        overflow: "visible",
                    },
                }}
            >
                {/* Premium brand masthead */}
                <Box
                    sx={{
                        px: { xs: 2, sm: 4 },
                        pt: 3,
                        pb: 2.5,
                        borderTop: "6px solid #d3ad63",
                        background:
                            "linear-gradient(115deg,#fff 0%,#f8faff 100%)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                            }}
                        >
                            {/* Logged-in company logo */}
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    flexShrink: 0,
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "#fff",
                                }}
                            >
                                {companylogo ? (
                                    <Box
                                        component="img"
                                        src={companylogo}
                                        alt="Thejaswi company logo"
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        sx={{
                                            fontSize: 30,
                                            fontWeight: 900,
                                            fontFamily: "Georgia,serif",
                                            color: "#172f65",
                                        }}
                                    >
                                        T
                                    </Typography>
                                )}
                            </Box>

                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: 25,
                                        fontWeight: 900,
                                        letterSpacing: 2,
                                        color: "#172f65",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    THEJASWI
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.5,
                                        fontSize: 9,
                                        letterSpacing: 2.2,
                                        fontWeight: 700,
                                        color: "#9a773b",
                                    }}
                                >
                                    INSURANCE SERVICES
                                </Typography>

                                {(quote.phone || quote.email) && (
                                    <Typography
                                        sx={{
                                            mt: 0.8,
                                            fontSize: 9,
                                            color: "#667085",
                                        }}
                                    >
                                        {[quote.phone, quote.email]
                                            .filter(Boolean)
                                            .join("  •  ")}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                textAlign: { xs: "left", sm: "right" },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "inline-block",
                                    px: 1.2,
                                    py: 0.55,
                                    border: "1px solid #d7b56d",
                                    borderRadius: 20,
                                    color: "#8a682e",
                                    bgcolor: "#fffaf0",
                                    fontSize: 9,
                                    fontWeight: 800,
                                    letterSpacing: 1,
                                }}
                            >
                                INSURANCE QUOTATION
                            </Box>

                            <Typography
                                sx={{
                                    mt: 1,
                                    fontSize: 10,
                                    color: "#667085",
                                }}
                            >
                                Quote No.{" "}
                                <b style={{ color: "#172033" }}>
                                    {quote.quoteNo}
                                </b>
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,
                                    fontSize: 10,
                                    color: "#667085",
                                }}
                            >
                                Date:{" "}
                                <b style={{ color: "#172033" }}>
                                    {quote.quoteDate}
                                </b>
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: "#dce3ed" }} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 9,
                                    color: "#8792a5",
                                    fontWeight: 700,
                                    letterSpacing: 1,
                                }}
                            >
                                PREPARED FOR
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,
                                    fontSize: 15,
                                    fontWeight: 800,
                                    color: "#172f65",
                                }}
                            >
                                {quote.customer}
                            </Typography>

                            {quote.address && (
                                <Typography
                                    sx={{
                                        mt: 0.3,
                                        fontSize: 10,
                                        color: "#667085",
                                    }}
                                >
                                    {quote.address}
                                </Typography>
                            )}
                        </Box>

                        <Box
                            sx={{
                                textAlign: { xs: "left", sm: "right" },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 9,
                                    color: "#8792a5",
                                    fontWeight: 700,
                                    letterSpacing: 1,
                                }}
                            >
                                INSURANCE PROVIDER
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "#172033",
                                }}
                            >
                                {quote.insurer}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.3,
                                    fontSize: 10,
                                    color: "#667085",
                                }}
                            >
                                {quote.product}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Vehicle and policy details */}
                <Box sx={{ px: { xs: 1.5, sm: 4 }, pb: 2 }}>
                    <Section title="01 / VEHICLE & POLICY DETAILS" />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                            },
                            border: "1px solid #e9edf4",
                            borderTop: 0,
                        }}
                    >
                        {vehicleRows.map(([label, value]) => {
                            return (
                                <Box key={label}>
                                    <Row label={label} nomoney value={value} />
                                </Box>
                            )
                        })}
                    </Box>
                </Box>

                {/* Side-by-side premium breakdown */}
                <Box sx={{ px: { xs: 1.5, sm: 4 }, pb: 2 }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                            },
                            gap: 1.5,
                        }}
                    >
                        <Box
                            sx={{
                                border: "1px solid #e1e7f0",
                                borderRadius: 1,
                                overflow: "hidden",
                            }}
                        >
                            <Section
                                title="02 / OWN DAMAGE PREMIUM"
                                meta="OD"
                            />

                            <Row
                                label="Basic Own Damage Premium"
                                value={p.basicOD}
                            />
                            <Row
                                label={`No Claim Bonus (${p.ncbPct}%)`}
                                value={p.ncb}
                                negative
                            />

                            {p.dePct > 0 && (
                                <Row
                                    label={`DE Tariff Discount (${p.dePct}%)`}
                                    value={p.deAmount}
                                    negative
                                />
                            )}

                            <Row
                                label="Selected Add-ons"
                                value={p.addonTotal}
                            />

                            {p.addons.map((x, i) => (
                                <Row
                                    key={`${x.label}-${i}`}
                                    label={`↳ ${x.label}`}
                                    value={x.amount}
                                />
                            ))}

                            <Row
                                label="Net OD + Add-ons"
                                value={p.discountedOD + p.addonTotal}
                                bold
                            />
                        </Box>

                        <Box
                            sx={{
                                border: "1px solid #e1e7f0",
                                borderRadius: 1,
                                overflow: "hidden",
                            }}
                        >
                            <Section
                                title="03 / LIABILITY PREMIUM"
                                meta="TP"
                            />

                            <Row
                                label="Basic Third-Party Premium"
                                value={p.tp}
                            />
                            <Row
                                label="Additional Covers"
                                value={p.coverTotal}
                            />

                            {p.covers.map((x, i) => (
                                <Row
                                    key={`${x.label}-${i}`}
                                    label={`↳ ${x.label}`}
                                    value={x.amount}
                                    note={
                                        x.pending
                                            ? "Requires seating capacity"
                                            : undefined
                                    }
                                />
                            ))}

                            <Row
                                label="Total TP + Covers"
                                value={p.tp + p.coverTotal}
                                bold
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Premium summary */}
                <Box sx={{ px: { xs: 1.5, sm: 4 }, pb: 2 }}>
                    <Section title="04 / PREMIUM SUMMARY" />

                    <Box
                        sx={{
                            border: "1px solid #e1e7f0",
                            borderTop: 0,
                        }}
                    >
                        <Row
                            label="Net Own Damage Premium (after discounts)"
                            value={p.discountedOD}
                        />
                        <Row label="Add-ons Premium" value={p.addonTotal} />
                        <Row label="Third-Party Premium" value={p.tp} />
                        <Row
                            label="Additional Covers Premium"
                            value={p.coverTotal}
                        />
                        <Row
                            label="Premium Before Tax"
                            value={p.subtotal}
                            bold
                        />

                        {p.taxes.length ? (
                            p.taxes.map((x, i) => (
                                <Row
                                    key={`${x.label}-${x.component}-${i}`}
                                    label={
                                        x.component
                                            ? `${x.label} · ${x.component}`
                                            : x.label
                                    }
                                    value={x.amount}
                                />
                            ))
                        ) : (
                            <Row label="Applicable Taxes" value={0} />
                        )}

                        <Row label="Total Tax" value={p.taxTotal} bold />
                    </Box>

                    <Box
                        sx={{
                            mt: 1.5,
                            p: { xs: 1.8, sm: 2.2 },
                            borderRadius: 1.5,
                            background:
                                "linear-gradient(110deg,#142958 0%,#214983 100%)",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    color: "#dbeafe",
                                    fontWeight: 800,
                                    letterSpacing: 1,
                                }}
                            >
                                TOTAL PREMIUM PAYABLE
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: 9,
                                    color: "#c2d3ed",
                                }}
                            >
                                Inclusive of applicable taxes
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: { xs: 22, sm: 28 },
                                fontWeight: 900,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {money(p.total)}
                        </Typography>
                    </Box>

                    {/* {p.cashback > 0 && (
                        <>
                            <Box
                                sx={{
                                    mt: 1,
                                    border: "1px solid #b7e4c7",
                                    borderRadius: 1,
                                    overflow: "hidden",
                                }}
                            >
                                <Row
                                    label="Cashback Benefit"
                                    value={p.cashback}
                                    negative
                                />
                            </Box>

                            <Box
                                sx={{
                                    mt: 1,
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 1.5,
                                    bgcolor: "#edf9f1",
                                    border: "1px solid #b7e4c7",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 800,
                                            color: "#167344",
                                            letterSpacing: 0.7,
                                        }}
                                    >
                                        EFFECTIVE NET PAYABLE
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.3,
                                            fontSize: 9,
                                            color: "#438261",
                                        }}
                                    >
                                        After cashback benefit
                                    </Typography>
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: 23,
                                        fontWeight: 900,
                                        color: "#167344",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {money(p.netPayable)}
                                </Typography>
                            </Box>
                        </>
                    )} */}
                </Box>

                {/* Disclaimer and signature */}
                <Box
                    sx={{
                        mx: { xs: 1.5, sm: 4 },
                        mt: 0.5,
                        mb: 2.5,
                        pt: 1.5,
                        borderTop: "1px solid #dce3ed",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Box sx={{ maxWidth: 490 }}>
                        <Typography
                            sx={{
                                fontSize: 9,
                                fontWeight: 800,
                                color: "#344054",
                            }}
                        >
                            IMPORTANT NOTE
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: 9,
                                lineHeight: 1.6,
                                color: "#7a8598",
                            }}
                        >
                            This quotation is indicative and provided for
                            reference. Final premium, coverage, terms, taxes
                            and acceptance are subject to the insurer&apos;s
                            underwriting and issued policy. Please verify all
                            vehicle and policy details before proceeding.
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            minWidth: 130,
                            textAlign: "center",
                            pb: 0.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 18,
                                fontFamily: "Georgia,serif",
                                fontStyle: "italic",
                                fontWeight: 700,
                                color: "#172f65",
                            }}
                        >
                            {quote.agent}
                        </Typography>

                        <Divider
                            sx={{
                                mt: 0.5,
                                mb: 0.5,
                                borderColor: "#9aa6b8",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 9,
                                fontWeight: 700,
                                color: "#667085",
                            }}
                        >
                            AUTHORISED REPRESENTATIVE
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <style>
                {`
                    @page {
                        size: A4;
                        margin: 10mm;
                    }

                    @media print {
                        html, body {
                            background: #fff !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }

                        body * {
                            visibility: hidden;
                        }

                        .thejaswi-quotation-page,
                        .thejaswi-quotation-page * {
                            visibility: visible;
                        }

                        .thejaswi-quotation-page {
                            position: absolute !important;
                            left: 0 !important;
                            top: 0 !important;
                            width: 100% !important;
                            max-width: none !important;
                            margin: 0 !important;
                        }

                        .quotation-toolbar {
                            display: none !important;
                        }
                    }
                `}
            </style>
        </Box>
    );
}

