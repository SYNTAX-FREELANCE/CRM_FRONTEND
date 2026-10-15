import React, { useMemo, useRef, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Typography,
} from "@mui/material";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { toJpeg } from "html-to-image";
import companylogo from "../../assets/loginimages/companylogo.png";

/**
 * Thejaswi quotation preview.
 * Props: calculationData, formData, VehicleDetails, createQuotation,
 * formatNumber, quoteData.
 */

export default function ThejaswiQuotationPreview({
    calculationData,
    formData = {},
    VehicleDetails = {},
    createQuotation,
    formatNumber = (value) =>
        Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
    quoteData = {},
}) {
    const quotationRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState("");

    const num = (value) => {
        const result = Number(value ?? 0);
        return Number.isFinite(result) ? result : 0;
    };
    const round = (value) => Number(num(value).toFixed(2));
    const money = (value) => `₹${formatNumber(round(value))}`;

    const quote = {
        quoteNo:
            quoteData?.quoteNo ||
            formData.quote_no ||
            formData.quotation_no ||
            "QUOTE —",
        quoteDate: quoteData?.quoteDate || new Date().toLocaleDateString("en-IN"),
        customer:
            quoteData?.customerName ||
            formData.customer_name ||
            formData.customerName ||
            formData.insured_name ||
            "Customer",
        insurer:
            quoteData?.insurerName ||
            formData.insurance_company_name ||
            formData.insurer_name ||
            "Insurance Company",
        product:
            quoteData?.productName ||
            formData.product_name ||
            formData.policy_name ||
            "Motor Insurance Policy",
        agent: quoteData?.agentName || "Thejaswi",
        phone: quoteData?.contactNo || "",
        email: quoteData?.email || "",
        address: quoteData?.address || "",
    };

    const vehicleRows = [
        ["Vehicle Category", VehicleDetails?.vehicle_category || formData.vehicle_category_name || formData.category_name || formData.vehicle_category || "—"],
        ["Vehicle Class", VehicleDetails?.vehicle_class || formData.vehicle_class_name || formData.class_name || "—"],
        ["Registration Number", VehicleDetails?.registration_number || formData.registration_number || formData.registration_no || formData.vehicle_number || "—"],
        ["Registration Date", VehicleDetails?.registration_date || formData.registration_date || formData.date_of_purchase || "—"],
        ["Policy Start Date", formData.policy_start_date || "—"],
        ["Engine Capacity", formData.engine_cc ? `${formData.engine_cc} CC` : "—"],
        ["Gross Vehicle Weight", formData.gvw ? `${formData.gvw} KG` : "—"],
        ["Seating Capacity", formData.seating_capacity || "—"],
        ["Insured Declared Value (IDV)", money(formData.idv)],
    ];


    const p = useMemo(() => {
        const idv = num(formData?.idv);
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

        // STEP 1: Basic OD
        const basicOD = round(
            od.basic_od_premium ??
            (
                odType === "FIXED"
                    ? odRate
                    : (idv * odRate) / 100
            )
        );

        // STEP 2: IMT-23
        // IMT-23 is included in Total OD only once.
        const addonIds = Array.isArray(formData?.addon_ids)
            ? formData.addon_ids.map(Number)
            : [];

        const allAddons = Array.isArray(calculationData?.addons)
            ? calculationData.addons
            : [];

        const imt23Rule = allAddons.find(
            (item) =>
                String(item.addon_code || "").toUpperCase() === "IMT_23"
        );

        // Keep IMT-23 automatic when its rule is returned,
        // matching the existing PremiumCalculationSummary behavior.
        const imt23Selected = Boolean(imt23Rule);

        const imt23Rate = imt23Selected
            ? num(
                imt23Rule.rate_value ??
                imt23Rule.slab_rate_value ??
                15
            )
            : 0;

        const imt23Premium = imt23Selected
            ? round((basicOD * imt23Rate) / 100)
            : 0;

        const totalOD = round(
            basicOD + imt23Premium
        );

        // STEP 3: DE Tariff Discount
        const discountRule =
            calculationData?.discount_rule?.[0] || {};

        const formDeValue = formData?.de_tariff_discount;

        const dePct = Math.min(
            100,
            Math.max(
                0,
                num(
                    formDeValue !== undefined &&
                        formDeValue !== null &&
                        formDeValue !== ""
                        ? formDeValue
                        : discountRule.discount_value ?? 0
                )
            )
        );

        const deAmount = round(
            Math.min(
                totalOD,
                (totalOD * dePct) / 100
            )
        );

        const odAfterDiscount = round(
            Math.max(0, totalOD - deAmount)
        );

        // STEP 4: NCB on OD after DE Tariff Discount
        const ncbRule =
            calculationData?.ncb_rule?.[0] || {};

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

        const ncb = round(
            Math.min(
                odAfterDiscount,
                Math.max(
                    0,
                    od.ncb_amount != null &&
                        dePct === 0
                        ? num(od.ncb_amount)
                        : (odAfterDiscount * ncbPct) / 100
                )
            )
        );

        // STEP 5: Final Net OD
        const netOD = round(
            Math.max(0, odAfterDiscount - ncb)
        );

        // Use backend final OD only when no IMT-23 or
        // DE Tariff Discount adjustment is applied.
        const finalOD = round(
            imt23Premium === 0 &&
                dePct === 0 &&
                od.final_od_premium != null
                ? num(od.final_od_premium)
                : netOD
        );

        const premiumOD = finalOD;

        // STEP 6: Third-Party Premium
        const tpRule = calculationData?.tp_rate?.[0] || {};

        const tpType = String(
            tpRule.rate_type || "FIXED"
        ).toUpperCase();

        const tpRate = num(
            tpRule.slab_rate_value ??
            tpRule.rate_value ??
            tpRule.master_rate_value
        );

        const tp = round(
            tpType === "PERCENTAGE"
                ? (idv * tpRate) / 100
                : tpRate
        );

        // STEP 7: Other selected add-ons
        // IMT-23 is excluded here because it is already in Total OD.
        const addons = allAddons
            .filter(
                (item) =>
                    addonIds.includes(Number(item.addon_id)) &&
                    String(item.addon_code || "").toUpperCase() !== "IMT_23"
            )
            .map((item) => {
                const type = String(
                    item.rate_type || "PERCENTAGE"
                ).toUpperCase();

                const rate = num(
                    item.rate_value ?? item.slab_rate_value
                );

                const originalAmount =
                    type === "FIXED"
                        ? rate
                        : type === "PERCENTAGE"
                            ? (idv * rate) / 100
                            : 0;

                const discountType = String(
                    item.discount_type || "NONE"
                ).toUpperCase();

                const discountValue = num(item.discount_value);

                const maxDiscountValue =
                    item.max_discount_value == null ||
                        num(item.max_discount_value) <= 0
                        ? null
                        : num(item.max_discount_value);

                let discountAmount = 0;

                if (discountType === "PERCENTAGE") {
                    discountAmount =
                        (originalAmount * discountValue) / 100;
                } else if (discountType === "FIXED") {
                    discountAmount = discountValue;
                }

                if (maxDiscountValue !== null) {
                    discountAmount = Math.min(
                        discountAmount,
                        maxDiscountValue
                    );
                }

                discountAmount = round(
                    Math.max(
                        0,
                        Math.min(discountAmount, originalAmount)
                    )
                );

                const amount = round(
                    Math.max(0, originalAmount - discountAmount)
                );

                return {
                    id: item.addon_id,
                    label:
                        item.addon_name ||
                        item.name ||
                        "Add-on",
                    rate,
                    originalAmount: round(originalAmount),
                    discountType,
                    discountValue,
                    discountAmount,
                    amount,
                    formula:
                        type === "FIXED"
                            ? `Fixed amount: ${money(rate)}`
                            : `${money(idv)} × ${rate}%`,
                    discountFormula:
                        discountType === "PERCENTAGE"
                            ? `${money(originalAmount)} × ${discountValue}%`
                            : discountType === "FIXED"
                                ? `Fixed discount: ${money(discountValue)}`
                                : "No discount",
                };
            });

        const addonTotal = round(
            addons.reduce(
                (sum, item) => sum + item.amount,
                0
            )
        );

        // STEP 8: Additional Covers
        const coverIds = Array.isArray(formData?.cover_ids)
            ? formData.cover_ids.map(Number)
            : [];

        const covers = (
            Array.isArray(calculationData?.covers)
                ? calculationData.covers
                : []
        )
            .filter(
                (item) =>
                    coverIds.includes(Number(item.cover_id))
            )
            .map((item) => {
                const type = String(
                    item.rate_type || "FIXED"
                ).toUpperCase();

                const rate = num(
                    item.rate_value ?? item.slab_rate_value
                );

                const seats = num(formData?.seating_capacity);

                const pending =
                    type === "PER_UNIT" && seats <= 0;

                const amount =
                    type === "PERCENTAGE"
                        ? (idv * rate) / 100
                        : type === "PER_UNIT"
                            ? rate * seats
                            : rate;

                return {
                    id: item.cover_id,
                    label:
                        item.cover_name ||
                        item.name ||
                        "Additional cover",
                    amount: round(amount),
                    pending,
                };
            });

        const coverTotal = round(
            covers.reduce(
                (sum, item) =>
                    sum + (item.pending ? 0 : item.amount),
                0
            )
        );

        // STEP 9: Premium before tax
        const subtotal = round(
            Math.max(
                0,
                premiumOD + addonTotal + tp + coverTotal
            )
        );

        // STEP 10: Component-wise taxes
        const taxes = (
            Array.isArray(calculationData?.tax)
                ? calculationData.tax
                : []
        ).map((tax) => {
            const component = String(
                tax.premium_component || ""
            ).toUpperCase();

            const taxable =
                component === "OD"
                    ? premiumOD
                    : component === "TP"
                        ? tp
                        : component === "ADDON"
                            ? addonTotal
                            : component === "COVER"
                                ? coverTotal
                                : 0;

            const type = String(
                tax.tax_type || "PERCENTAGE"
            ).toUpperCase();

            const amount =
                type === "FIXED"
                    ? num(
                        tax.tax_amount ??
                        tax.fixed_amount ??
                        tax.tax_value
                    )
                    : (
                        taxable * num(tax.tax_percentage)
                    ) / 100;

            return {
                label:
                    `${tax.tax_name || tax.tax_code || "Tax"}` +
                    (
                        type === "PERCENTAGE"
                            ? ` (${num(tax.tax_percentage)}%)`
                            : ""
                    ),
                component,
                amount: round(amount),
            };
        });

        const taxTotal = round(
            taxes.reduce(
                (sum, tax) => sum + tax.amount,
                0
            )
        );

        const total = round(
            subtotal + taxTotal
        );

        // STEP 11: Commission
        const commissionRule =
            calculationData?.commission?.[0];

        const cashbackRule =
            calculationData?.cashback?.[0];

        const profitRule =
            calculationData?.profit?.[0];

        const commissionType = String(
            commissionRule?.commission_type || ""
        ).toUpperCase();

        const commissionValue = num(
            commissionRule?.commission_value
        );

        const commissionMin =
            commissionRule?.min_premium == null
                ? null
                : num(commissionRule.min_premium);

        const commissionMax =
            commissionRule?.max_premium == null
                ? null
                : num(commissionRule.max_premium);

        const commissionEligible =
            (commissionMin === null || subtotal >= commissionMin) &&
            (commissionMax === null || subtotal <= commissionMax);

        let commission = 0;

        if (commissionRule && commissionEligible) {
            commission =
                commissionType === "PERCENTAGE"
                    ? (subtotal * commissionValue) / 100
                    : commissionType === "FIXED"
                        ? commissionValue
                        : 0;

            if (
                commissionRule.max_commission_amount != null &&
                commissionRule.max_commission_amount !== ""
            ) {
                commission = Math.min(
                    commission,
                    Math.max(
                        0,
                        num(commissionRule.max_commission_amount)
                    )
                );
            }
        }

        commission = round(
            Math.max(0, commission)
        );

        const profit = round(
            Math.max(
                0,
                num(profitRule?.profit_amount)
            )
        );

        // STEP 12: Cashback
        const manualCashback =
            formData?.cash_back !== undefined &&
                formData?.cash_back !== null &&
                formData?.cash_back !== ""
                ? formData.cash_back
                : formData?.cashback_amount;

        const hasManualCashback =
            manualCashback !== undefined &&
            manualCashback !== null &&
            manualCashback !== "";

        const cashbackMin =
            cashbackRule?.min_premium == null
                ? null
                : num(cashbackRule.min_premium);

        const cashbackMax =
            cashbackRule?.max_premium == null
                ? null
                : num(cashbackRule.max_premium);

        const cashbackEligible =
            (cashbackMin === null || total >= cashbackMin) &&
            (cashbackMax === null || total <= cashbackMax);

        const maxCashback =
            cashbackRule?.max_cashback_amount == null ||
                cashbackRule.max_cashback_amount === ""
                ? null
                : Math.max(
                    0,
                    num(cashbackRule.max_cashback_amount)
                );

        let cashback = 0;
        let cashbackSource = "";

        if (hasManualCashback) {
            cashback = Math.max(
                0,
                num(manualCashback)
            );
            cashbackSource = "FORM";
        } else if (cashbackRule && cashbackEligible) {
            cashback = Math.max(
                0,
                commission - profit
            );
            cashbackSource = "COMMISSION";
        }

        if (maxCashback !== null) {
            cashback = Math.min(
                cashback,
                maxCashback
            );
        }

        cashback = round(
            Math.min(
                total,
                Math.max(0, cashback)
            )
        );

        const netPayable = round(
            Math.max(0, total - cashback)
        );

        return {
            idv,
            basicOD,
            ncbPct,
            ncb,
            imt23Selected,
            imt23Rate,
            imt23Premium,
            totalOD,
            odAfterDiscount,
            netOD,
            addons,
            addonTotal,
            tp,
            covers,
            coverTotal,
            dePct,
            deAmount,
            discountedOD: premiumOD,
            subtotal,
            taxes,
            taxTotal,
            total,
            commission,
            profit,
            cashback,
            cashbackSource,
            maxCashback,
            netPayable,
        };
    }, [calculationData, formData, formatNumber]);


    const handleDownloadJpg = async () => {
        const element = quotationRef.current;
        if (!element || isExporting) return;
        setIsExporting(true);
        setExportError("");
        try {
            if (document.fonts?.ready) await document.fonts.ready;
            const images = Array.from(element.querySelectorAll("img"));
            await Promise.all(images.map(async (img) => {
                if (img.complete && img.naturalWidth > 0) return;
                try {
                    if (typeof img.decode === "function") {
                        await img.decode();
                        return;
                    }
                } catch {
                    // Continue; html-to-image will report if an image blocks export.
                }
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));
            const width = Math.max(element.scrollWidth, element.offsetWidth, 900);
            const height = Math.max(element.scrollHeight, element.offsetHeight);
            const dataUrl = await toJpeg(element, {
                quality: 0.98,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
                cacheBust: true,
                width,
                height,
                canvasWidth: width * 2,
                canvasHeight: height * 2,
                style: {
                    width: `${width}px`,
                    minWidth: `${width}px`,
                    maxWidth: "none",
                    height: `${height}px`,
                    minHeight: `${height}px`,
                    maxHeight: "none",
                    overflow: "visible",
                    margin: "0",
                    transform: "none",
                },
            });
            const link = document.createElement("a");
            const safeQuoteNo = String(quote.quoteNo || "quotation").replace(/[^a-zA-Z0-9_-]/g, "-");
            link.download = `Thejaswi-Quotation-${safeQuoteNo}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Failed to export quotation as JPG:", error);
            setExportError("Unable to generate the complete JPG. Please check the quotation images and try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const Section = ({ title, meta }) => (
        <Box sx={{ px: 1.4, py: 0.9, bgcolor: "#172f65", color: "#fff", display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 800, letterSpacing: ".04em" }}>{title}</Typography>
            {meta && <Typography sx={{ fontSize: 9, color: "#dbeafe" }}>{meta}</Typography>}
        </Box>
    );

    const Row = ({ label, value, bold = false, negative = false, note, plain = false }) => (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, px: 1.25, py: 0.7, borderBottom: "1px solid #e9edf4" }}>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12.5, color: "#344054", fontWeight: bold ? 800 : 500 }}>{label}</Typography>
                {note && <Typography sx={{ mt: 0.2, fontSize: 9, color: "#8792a5" }}>{note}</Typography>}
            </Box>
            <Typography sx={{ whiteSpace: "nowrap", fontSize: 12.5, fontWeight: bold ? 800 : 600, color: negative ? "#b42332" : "#172033" }}>
                {negative ? "− " : ""}{plain ? value : money(value)}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: "#eef2f7", p: { xs: 0.5, sm: 2 }, minHeight: "100%" }}>
            <Box className="quotation-toolbar" sx={{ maxWidth: 900, mx: "auto", mb: 1.5, p: 1.25, display: "flex", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", gap: 1, bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Button variant="outlined" startIcon={<PrintOutlinedIcon />} onClick={() => window.print()} sx={{ textTransform: "none" }}>Print / Save PDF</Button>
                <Button variant="outlined" startIcon={isExporting ? <CircularProgress size={16} color="inherit" /> : <DownloadOutlinedIcon />} onClick={handleDownloadJpg} disabled={isExporting} sx={{ textTransform: "none" }}>
                    {isExporting ? "Preparing JPG..." : "Download JPG"}
                </Button>
                {typeof createQuotation === "function" && (
                    <Button variant="contained" startIcon={<PrintOutlinedIcon />} onClick={createQuotation} sx={{ bgcolor: "#172f65", textTransform: "none", "&:hover": { bgcolor: "#101d40" } }}>Generate Quote</Button>
                )}
            </Box>
            {exportError && <Alert severity="error" onClose={() => setExportError("")} sx={{ maxWidth: 900, mx: "auto", mb: 2 }}>{exportError}</Alert>}

            <Paper ref={quotationRef} className="thejaswi-quotation-page" elevation={0} sx={{ width: "100%", maxWidth: 900, minWidth: 0, minHeight: 1120, mx: "auto", bgcolor: "#fff", color: "#172033", border: "1px solid #dce3ed", overflow: "visible", "& *": { boxSizing: "border-box" }, "@media print": { width: "100%", maxWidth: "none", minHeight: 0, border: 0, boxShadow: "none", overflow: "visible" } }}>
                <Box sx={{ px: { xs: 2, sm: 4 }, pt: 3, pb: 2.5, borderTop: "6px solid #d3ad63", background: "linear-gradient(115deg,#fff 0%,#f8faff 100%)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box sx={{ width: 64, height: 64, flexShrink: 0, borderRadius: 1.5, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#fff" }}>
                                {companylogo ? <Box component="img" src={companylogo} alt="Thejaswi company logo" sx={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <Typography sx={{ fontSize: 30, fontWeight: 900, color: "#172f65" }}>T</Typography>}
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: 25, fontWeight: 900, letterSpacing: 2, color: "#172f65", lineHeight: 1.1 }}>THEJASWI</Typography>
                                <Typography sx={{ mt: 0.5, fontSize: 9, letterSpacing: 2.2, fontWeight: 700, color: "#9a773b" }}>INSURANCE SERVICES</Typography>
                                {(quote.phone || quote.email) && <Typography sx={{ mt: 0.8, fontSize: 9, color: "#667085" }}>{[quote.phone, quote.email].filter(Boolean).join("  •  ")}</Typography>}
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                            <Box sx={{ display: "inline-block", px: 1.2, py: 0.55, border: "1px solid #d7b56d", borderRadius: 20, color: "#8a682e", bgcolor: "#fffaf0", fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>INSURANCE QUOTATION</Box>
                            <Typography sx={{ mt: 1, fontSize: 10, color: "#667085" }}>Quote No. <b style={{ color: "#172033" }}>{quote.quoteNo}</b></Typography>
                            <Typography sx={{ mt: 0.4, fontSize: 10, color: "#667085" }}>Date: <b style={{ color: "#172033" }}>{quote.quoteDate}</b></Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 2, borderColor: "#dce3ed" }} />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        <Box>
                            <Typography sx={{ fontSize: 9, color: "#8792a5", fontWeight: 700, letterSpacing: 1 }}>PREPARED FOR</Typography>
                            <Typography sx={{ mt: 0.4, fontSize: 15, fontWeight: 800, color: "#172f65" }}>{quote.customer}</Typography>
                            {quote.address && <Typography sx={{ mt: 0.3, fontSize: 10, color: "#667085" }}>{quote.address}</Typography>}
                        </Box>
                        <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                            <Typography sx={{ fontSize: 9, color: "#8792a5", fontWeight: 700, letterSpacing: 1 }}>INSURANCE PROVIDER</Typography>
                            <Typography sx={{ mt: 0.4, fontSize: 16, fontWeight: 800, color: "#172033", textTransform: 'uppercase' }}>{quote.insurer}</Typography>
                            <Typography sx={{ mt: 0.3, fontSize: 10, color: "#667085" }}>{quote.product}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ px: { xs: 1.5, sm: 4 }, pb: 2 }}>
                    <Section title="01 / VEHICLE & POLICY DETAILS" />
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, border: "1px solid #e9edf4", borderTop: 0 }}>
                        {vehicleRows.map(([label, value]) => <Box key={label}><Row label={label} value={value} plain /></Box>)}
                    </Box>
                </Box>

                <Box sx={{ px: { xs: 1.5, sm: 4 }, pb: 2 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                        <Box sx={{ border: "1px solid #e1e7f0", borderRadius: 1, overflow: "hidden" }}>
                            <Section title="02 / OWN DAMAGE PREMIUM" meta="OD" />
                            <Row label="Basic Own Damage Premium" value={p.basicOD} />
                            {p.imt23Selected && <Row label={`IMT-23 `} value={p.imt23Premium} />}
                            {/* <Row label="Total OD before NCB / discount" value={p.totalOD} bold /> */}
                            <Row label={`No Claim Bonus (${p.ncbPct}%)`} value={p.ncb} negative />
                            {p.dePct > 0 && <Row label={`DE Tariff Discount (${p.dePct}%)`} value={p.deAmount} negative />}
                            {/* <Row label="Net Own Damage Premium" value={p.discountedOD} bold /> */}
                            <Divider />
                            {/* <Row label="Selected Add-ons" value={p.addonTotal} /> */}
                            {p.addons.map((item, index) => <Row key={`${item.id}-${index}`} label={`↳ ${item.label}`} value={item.amount} />)}
                            <Row label="OD + Add-ons" value={p.discountedOD + p.addonTotal} bold />
                        </Box>
                        <Box sx={{ border: "1px solid #e1e7f0", borderRadius: 1, overflow: "hidden" }}>
                            <Section title="03 / LIABILITY PREMIUM" meta="TP" />
                            <Row label="Basic Third-Party Premium" value={p.tp} />
                            {/* <Row label="Additional Covers" value={p.coverTotal} /> */}
                            {p.covers.map((item, index) => <Row key={`${item.id}-${index}`} label={`↳ ${item.label}`} value={item.amount} note={item.pending ? "Requires seating capacity; not included in total" : undefined} />)}
                            <Row label="Total TP + Covers" value={p.tp + p.coverTotal} bold />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ px: { xs: 1.5, sm: 4 }, pb: 2 }}>
                    <Section title="04 / PREMIUM SUMMARY" />
                    <Box sx={{ border: "1px solid #e1e7f0", borderTop: 0 }}>
                        {/* <Row label="Net Own Damage Premium" value={p.discountedOD} />
                        <Row label="Other Add-ons Premium" value={p.addonTotal} />
                        <Row label="Third-Party Premium" value={p.tp} />
                        <Row label="Additional Covers Premium" value={p.coverTotal} /> */}
                        <Row label="Premium Before Tax" value={p.subtotal} bold note={"OD + TP"} />
                        {/* {p.taxes.length ? p.taxes.map((item, index) => <Row key={`${item.label}-${item.component}-${index}`} label={item.component ? `${item.label} · ${item.component}` : item.label} value={item.amount} />) : <Row label="Applicable Taxes" value={0} />} */}
                        <Row label="Total Tax" value={p.taxTotal} bold />
                    </Box>
                    <Box sx={{ mt: 1.5, p: { xs: 1.8, sm: 2.2 }, borderRadius: 1.5, background: "linear-gradient(110deg,#142958 0%,#214983 100%)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                        <Box>
                            <Typography sx={{ fontSize: 10, color: "#dbeafe", fontWeight: 800, letterSpacing: 1 }}>TOTAL PREMIUM PAYABLE</Typography>
                            <Typography sx={{ mt: 0.5, fontSize: 9, color: "#c2d3ed" }}>Inclusive of applicable taxes</Typography>
                        </Box>
                        <Typography sx={{ fontSize: { xs: 22, sm: 28 }, fontWeight: 900, whiteSpace: "nowrap" }}>{money(p.total)}</Typography>
                    </Box>
                    {/* {p.cashback > 0 && <>
                        <Box sx={{ mt: 1, border: "1px solid #b7e4c7", borderRadius: 1, overflow: "hidden" }}>
                            <Row label="Cashback Benefit" value={p.cashback} negative />
                        </Box>
                        <Box sx={{ mt: 1, px: 2, py: 1.5, borderRadius: 1.5, bgcolor: "#edf9f1", border: "1px solid #b7e4c7", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                            <Box>
                                <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#167344", letterSpacing: 0.7 }}>EFFECTIVE NET PAYABLE</Typography>
                                <Typography sx={{ mt: 0.3, fontSize: 9, color: "#438261" }}>After cashback benefit</Typography>
                            </Box>
                            <Typography sx={{ fontSize: 23, fontWeight: 900, color: "#167344", whiteSpace: "nowrap" }}>{money(p.netPayable)}</Typography>
                        </Box>
                    </>} */}
                </Box>

                <Box sx={{ mx: { xs: 1.5, sm: 4 }, mt: 0.5, mb: 2.5, pt: 1.5, borderTop: "1px solid #dce3ed", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2, flexWrap: "wrap" }}>
                    <Box sx={{ maxWidth: 490 }}>
                        <Typography sx={{ fontSize: 9, fontWeight: 800, color: "#344054" }}>IMPORTANT NOTE</Typography>
                        <Typography sx={{ mt: 0.5, fontSize: 9, lineHeight: 1.6, color: "#7a8598" }}>
                            This quotation is indicative and provided for reference. Final premium, coverage, terms, taxes and acceptance are subject to the insurer&apos;s underwriting and issued policy. Please verify all vehicle and policy details before proceeding.
                        </Typography>
                    </Box>
                    <Box sx={{ minWidth: 130, textAlign: "center", pb: 0.5 }}>
                        <Typography sx={{ fontSize: 18, fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 700, color: "#172f65" }}>{quote.agent}</Typography>
                        <Divider sx={{ mt: 0.5, mb: 0.5, borderColor: "#9aa6b8" }} />
                        <Typography sx={{ fontSize: 9, fontWeight: 700, color: "#667085" }}>AUTHORISED REPRESENTATIVE</Typography>
                    </Box>
                </Box>
            </Paper>

            <style>{`
                @page { size: A4; margin: 10mm; }
                @media print {
                    html, body { background: #fff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    body * { visibility: hidden; }
                    .thejaswi-quotation-page, .thejaswi-quotation-page * { visibility: visible; }
                    .thejaswi-quotation-page { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; max-width: none !important; margin: 0 !important; }
                    .quotation-toolbar { display: none !important; }
                }
            `}</style>
        </Box>
    );
}
