
import React, { memo, useRef, useState } from "react";

import {
    Box,
    Button,
    Divider,
    Paper,
    Typography,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";

import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { toJpeg } from "html-to-image";

import companyLogo from "../../assets/loginimages/companylogo.png";

const formatNumber = (value) =>
    Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const num = (value) => Number(value ?? 0) || 0;

const money = (value) => `₹${formatNumber(value)}`;

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN");
};

const ThejaswiQuotationPreviewModal = ({
    open,
    onClose,
    quotationItem,
}) => {
    const quotationRef = useRef(null);

    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState("");

    /*
     * DIRECT API DATA
     *
     * quotationItem = {
     *   quotation: {},
     *   input: {},
     *   options: []
     * }
     */

    const quotation = quotationItem?.quotation ?? {};
    const formData = quotationItem?.input ?? {};
    const options = quotationItem?.options ?? [];

    /*
     * The original design displays one insurer quotation.
     * Use the first saved option.
     */

    const option = options[0] ?? {};

    const quote = {
        quoteNo: quotation.quotation_number ?? "—",
        quoteDate: formatDate(quotation.quotation_date),
        customer:
            quotation.customer_name ??
            quotation.insured_name ??
            (quotation.customer_id
                ? `Customer ID: ${quotation.customer_id}`
                : "Customer"),
        insurer: option.insurance_company_name ?? "Insurance Company",
        product: option.product_name ?? "Motor Insurance Policy",
        agent: quotation.quotation_taken_employee ?? "Thejaswi",
        phone: quotation.mobile_number_1 ?? "",
        email: quotation.email ?? "",
        address: quotation.customer_address ?? "",
    };

    /*
     * VEHICLE AND POLICY DETAILS
     *
     * The provided API response has IDs for vehicle category,
     * class, product, policy type, and term, but not their names.
     */

    const vehicleRows = [
        [
            "Vehicle Category",
            formData.category_name ??
            formData.vehicle_category_name ??
                formData.vehicle_category_id ??
                "—",
        ],
        [
            "Vehicle Class",
            formData.class_name ??
            formData.vehicle_class_name ??
                formData.vehicle_class_id ??
                "—",
        ],
        [
            "Registration Number",
            formData.registration_number ??
                quotation.registration_number ??
                "—",
        ],
        [
            "Registration Date",
            formatDate(formData.registration_date),
        ],
        [
            "Policy Start Date",
            formatDate(formData.policy_start_date),
        ],
        [
            "Policy End Date",
            formatDate(formData.policy_end_date),
        ],
        [
            "Engine Capacity",
            formData.engine_cc != null
                ? `${formData.engine_cc} CC`
                : "—",
        ],
        [
            "Gross Vehicle Weight",
            formData.gvw != null
                ? `${formatNumber(formData.gvw)} KG`
                : "—",
        ],
        [
            "Seating Capacity",
            formData.seating_capacity ?? "—",
        ],
        [
            "Insured Declared Value (IDV)",
            money(option.idv ?? formData.idv),
        ],
    ];

    /*
     * SAVED PREMIUM VALUES
     *
     * Do not calculate premiums again from master rates.
     * Use the amounts already returned by the API.
     */

    const basicOD = num(option.basic_od);
    const ncbPct = num(option.ncb_percentage);
    const ncb = num(option.ncb_amount);
    const odDiscount = num(option.od_discount);
    const deAmount = num(option.de_tariff_amount);
    const netOD = num(option.net_od);

    const addons = (option.addons ?? []).map((addon) => ({
        label: addon.addon_name ?? addon.addon_code ?? "Add-on",
        amount: num(addon.amount),
    }));

    const addonTotal =
        option.addon_premium != null
            ? num(option.addon_premium)
            : addons.reduce((sum, addon) => sum + addon.amount, 0);

    const tp = num(option.tp_premium);

    const covers = (option.covers ?? []).map((cover) => ({
        label: cover.cover_name ?? cover.cover_code ?? "Additional cover",
        amount: num(cover.amount),
        quantity: num(cover.quantity),
    }));

    const coverTotal =
        num(option.cpa_premium) +
        num(option.liability_premium) +
        num(option.passenger_premium);

    const savedCoverTotal = covers.reduce(
        (sum, cover) => sum + cover.amount,
        0
    );

    const finalCoverTotal =
        option.cpa_premium != null ||
        option.liability_premium != null ||
        option.passenger_premium != null
            ? coverTotal
            : savedCoverTotal;

    const subtotal = num(option.subtotal);

    const gstAmount = num(option.gst_amount);

    const total = num(
        option.final_premium ?? option.total_premium
    );

    const commission = num(option.commission_amount);
    const cashback = num(option.cashback_amount);
    const profit = num(option.profit_amount);
    const netProfit = num(option.net_profit_amount);

    const netPayable =
        option.effective_net_payable != null
            ? num(option.effective_net_payable)
            : Math.max(0, total - cashback);

    /*
     * DOWNLOAD THE COMPLETE QUOTATION AS JPG
     */

    const handleDownloadJpg = async () => {
        const element = quotationRef.current;

        if (!element || isExporting) return;

        setIsExporting(true);
        setExportError("");

        try {
            if (document.fonts?.ready) {
                await document.fonts.ready;
            }

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
                "Unable to generate the complete JPG. Please try again."
            );
        } finally {
            setIsExporting(false);
        }
    };

    /*
     * ORIGINAL DESIGN COMPONENTS
     */

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
        nomoney = false,
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
                        fontWeight: bold ? 900 : 600,
                    }}
                >
                    {label}
                </Typography>

                {note && (
                    <Typography
                        sx={{
                            mt: 0.2,
                            fontSize: 10,
                            color: "#8792a5",
                        }}
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
                {nomoney ? value ?? "—" : money(value)}
            </Typography>
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            fullScreen
            PaperProps={{
                sx: {
                    bgcolor: "#eef2f7",
                },
            }}
        >
            {/* MODAL HEADER */}

            <DialogTitle
                className="quotation-modal-toolbar"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    position:'absolute',
                    right:0
                }}
            >
                <IconButton
                    onClick={onClose}
                    aria-label="Close quotation preview"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: { xs: 0.5, sm: 2 },
                    overflowY: "auto",
                }}
            >
                <Box
                    sx={{
                        bgcolor: "#eef2f7",
                        p: { xs: 0.5, sm: 2 },
                        minHeight: "100%",
                    }}
                >
                    {/* ORIGINAL TOOLBAR */}

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
                            boxShadow:
                                "0 3px 12px rgba(23, 47, 101, 0.06)",
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
                                    <CircularProgress
                                        size={17}
                                        color="inherit"
                                    />
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
                                "&:hover": {
                                    borderColor: "#60a5fa",
                                    bgcolor: "#dbeafe",
                                },
                            }}
                        >
                            {isExporting
                                ? "Preparing JPG..."
                                : "Download JPG"}
                        </Button>

                    </Box>

                    {exportError && (
                        <Alert
                            severity="error"
                            onClose={() => setExportError("")}
                            sx={{ maxWidth: 900, mx: "auto", mb: 2 }}
                        >
                            {exportError}
                        </Alert>
                    )}

                    {/* ORIGINAL QUOTATION DESIGN */}

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
                        {/* PREMIUM BRAND MASTHEAD */}

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
                                        {companyLogo ? (
                                            <Box
                                                component="img"
                                                src={companyLogo}
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
                                                    fontFamily:
                                                        "Georgia,serif",
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
                                        textAlign: {
                                            xs: "left",
                                            sm: "right",
                                        },
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

                            <Divider
                                sx={{
                                    my: 2,
                                    borderColor: "#dce3ed",
                                }}
                            />

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
                                        textAlign: {
                                            xs: "left",
                                            sm: "right",
                                        },
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

                        {/* VEHICLE AND POLICY DETAILS */}

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
                                {vehicleRows.map(([label, value]) => (
                                    <Box key={label}>
                                        <Row
                                            label={label}
                                            value={value}
                                            nomoney
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* SIDE-BY-SIDE PREMIUM BREAKDOWN */}

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
                                        value={basicOD}
                                    />

                                    <Row
                                        label={`No Claim Bonus (${formatNumber(
                                            ncbPct
                                        )}%)`}
                                        value={ncb}
                                        negative
                                    />

                                    <Row
                                        label="OD Discount"
                                        value={odDiscount}
                                        negative
                                    />

                                    {deAmount > 0 && (
                                        <Row
                                            label="De-tariff Discount"
                                            value={deAmount}
                                            negative
                                        />
                                    )}

                                    <Row
                                        label="Selected Add-ons"
                                        value={addonTotal}
                                    />

                                    {addons.map((addon, index) => (
                                        <Row
                                            key={`${addon.label}-${index}`}
                                            label={`↳ ${addon.label}`}
                                            value={addon.amount}
                                        />
                                    ))}

                                    <Row
                                        label="Net OD + Add-ons"
                                        value={netOD + addonTotal}
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
                                        value={tp}
                                    />

                                    <Row
                                        label="Additional Covers"
                                        value={finalCoverTotal}
                                    />

                                    {covers.map((cover, index) => (
                                        <Row
                                            key={`${cover.label}-${index}`}
                                            label={`↳ ${cover.label}`}
                                            value={cover.amount}
                                            note={
                                                cover.quantity > 1
                                                    ? `Quantity: ${cover.quantity}`
                                                    : undefined
                                            }
                                        />
                                    ))}

                                    <Row
                                        label="Total TP + Covers"
                                        value={tp + finalCoverTotal}
                                        bold
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* PREMIUM SUMMARY */}

                        <Box sx={{ px: { xs: 1.5, sm: 4 }, pb: 2 }}>
                            <Section title="04 / PREMIUM SUMMARY" />

                            <Box
                                sx={{
                                    border: "1px solid #e1e7f0",
                                    borderTop: 0,
                                }}
                            >
                                <Row
                                    label="Net Own Damage Premium"
                                    value={netOD}
                                />

                                <Row
                                    label="Add-ons Premium"
                                    value={addonTotal}
                                />

                                <Row
                                    label="Third-Party Premium"
                                    value={tp}
                                />

                                <Row
                                    label="Additional Covers Premium"
                                    value={finalCoverTotal}
                                />

                                <Row
                                    label="Premium Before Tax"
                                    value={subtotal}
                                    bold
                                />

                                <Row
                                    label="GST"
                                    value={gstAmount}
                                />

                                <Row
                                    label="Total Tax"
                                    value={gstAmount}
                                    bold
                                />
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
                                        TOTAL PREMIUM
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
                                    {money(total)}
                                </Typography>
                            </Box>

                         
                        </Box>

                        {/* DISCLAIMER AND SIGNATURE */}

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
                                    This quotation is indicative and provided
                                    for reference. Final premium, coverage,
                                    terms, taxes and acceptance are subject to
                                    the insurer&apos;s underwriting and issued
                                    policy. Please verify all vehicle and
                                    policy details before proceeding.
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
                </Box>
            </DialogContent>

            <style>
                {`
                    @page {
                        size: A4;
                        margin: 10mm;
                    }

                    @media print {
                        html,
                        body {
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
                            min-height: 0 !important;
                            border: 0 !important;
                            box-shadow: none !important;
                            overflow: visible !important;
                        }

                        .quotation-toolbar,
                        .quotation-modal-toolbar {
                            display: none !important;
                        }

                        .MuiDialog-root,
                        .MuiDialog-container,
                        .MuiDialog-paper,
                        .MuiDialogContent-root {
                            position: static !important;
                            display: block !important;
                            overflow: visible !important;
                            height: auto !important;
                            max-height: none !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            box-shadow: none !important;
                            transform: none !important;
                        }
                    }
                `}
            </style>
        </Dialog>
    );
};

export default memo(ThejaswiQuotationPreviewModal);
