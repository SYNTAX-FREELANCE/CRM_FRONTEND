import React, { useMemo } from "react";

import {
    Box,
    Divider,
    Paper,
    Typography,
    useTheme,
} from "@mui/material";

import {
    CalculationInfoLine,
    CalculationLine,
    CalculationStep,
} from "./PremiumCalculationComponents";

const PremiumCalculationSummary = ({
    calculationData,
    formData,
    formatNumber,
    coverInputValues = {},
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const money = (value) => {
        const number = Number(value || 0);

        return `₹${typeof formatNumber === "function"
            ? formatNumber(number.toFixed(2))
            : Number(number.toFixed(2)).toLocaleString("en-IN")
            }`;
    };

    const calculation = useMemo(() => {
        const idv = Number(formData?.idv || 0);

        /*
         * STEP 01: IDV
         */

        /*
         * STEP 02: BASIC OWN DAMAGE PREMIUM
         */

        const odRule = calculationData?.od_rate?.[0];

        const odRateType = String(
            odRule?.rate_type || "PERCENTAGE"
        ).toUpperCase();

        const odRateValue = Number(
            odRule?.slab_rate_value ??
            odRule?.rate_value ??
            odRule?.master_rate_value ??
            0
        );

        const backendOD = calculationData?.od_calculation;

        let calculatedBasicOD = 0;
        let odFormula = "";

        if (odRateType === "PERCENTAGE") {
            calculatedBasicOD = (idv * odRateValue) / 100;
            odFormula = `${money(idv)} × ${odRateValue}%`;
        } else if (odRateType === "FIXED") {
            calculatedBasicOD = odRateValue;
            odFormula = "Fixed OD amount";
        }

        const odPremium = Number(
            backendOD?.basic_od_premium ?? calculatedBasicOD
        );

        /*
         * DISCOUNT MASTER
         */

        const discountRule = calculationData?.discount_rule?.[0];

        const formDiscountValue = formData?.de_tariff_discount;

        const deTariffDiscountPercentage = Math.min(
            Math.max(
                Number(
                    formDiscountValue !== undefined &&
                        formDiscountValue !== null &&
                        formDiscountValue !== ""
                        ? formDiscountValue
                        : discountRule?.discount_value ??
                        discountRule?.discount_percentage ??
                        discountRule?.rate_value ??
                        0
                ) || 0,
                0
            ),
            100
        );

        /*
         * STEP 03: ADD-ONS AND IMT-23
         */

        const selectedAddonIds = Array.isArray(formData?.addon_ids)
            ? formData.addon_ids.map(Number)
            : [];

        const selectedAddons = (
            calculationData?.addons || []
        ).filter(
            (item) =>
                String(item.addon_code || "").toUpperCase() ===
                "IMT_23" ||
                selectedAddonIds.includes(Number(item.addon_id))
        );

        const imt23Addon = selectedAddons.find(
            (item) =>
                String(item.addon_code || "").toUpperCase() ===
                "IMT_23"
        );

        const imt23Rate = imt23Addon
            ? Number(imt23Addon.rate_value || 15)
            : 0;

        // IMT-23 is calculated from Basic OD.

        const imt23Premium = imt23Addon
            ? Number(
                ((odPremium * imt23Rate) / 100).toFixed(2)
            )
            : 0;

        // Total OD = Basic OD + IMT-23.

        const totalOD = Number(
            (odPremium + imt23Premium).toFixed(2)
        );



        const addonDetails = selectedAddons.map((item) => {
            const addonCode = String(
                item.addon_code || ""
            ).toUpperCase();

            const isIMT23 = addonCode === "IMT_23";

            const rateType = String(
                item.rate_type || "PERCENTAGE"
            ).toUpperCase();

            const rateValue = Number(item.rate_value || 0);

            // Prefer the basis configured in the database.
            // Fallbacks support existing rules during migration.
            const calculationBasis = String(
                item.calculation_basis ||
                (addonCode === "ZD" || isIMT23
                    ? "BASIC_OD"
                    : "IDV")
            ).toUpperCase();

            let originalAmount = 0;
            let formula = "";

            if (rateType === "FIXED") {
                originalAmount = rateValue;
                formula = "Fixed amount";
            } else if (rateType === "PERCENTAGE") {
                let baseAmount = 0;
                let baseLabel = "";

                switch (calculationBasis) {
                    case "BASIC_OD":
                        baseAmount = odPremium;
                        baseLabel = "Basic OD";
                        break;

                    case "IDV":
                    default:
                        baseAmount = idv;
                        baseLabel = "IDV";
                        break;
                }

                originalAmount =
                    (baseAmount * rateValue) / 100;

                formula =
                    `${money(baseAmount)} × ${rateValue}% (${baseLabel})`;
            }

            // Keep your existing discount calculation here:
            // discount_type, discount_value, max_discount_value,
            // discount_amount and calculated_amount.

            const discountType = String(
                item.discount_type || "NONE"
            ).toUpperCase();

            const discountValue = Math.max(
                0,
                Number(item.discount_value || 0)
            );

            let discountAmount = 0;

            if (discountType === "PERCENTAGE") {
                discountAmount =
                    (originalAmount * discountValue) / 100;
            } else if (discountType === "FIXED") {
                discountAmount = discountValue;
            }

            const maxDiscountValue =
                item.max_discount_value != null
                    ? Number(item.max_discount_value)
                    : 0;

            if (maxDiscountValue > 0) {
                discountAmount = Math.min(
                    discountAmount,
                    maxDiscountValue
                );
            }

            discountAmount = Number(
                Math.min(
                    Math.max(discountAmount, 0),
                    originalAmount
                ).toFixed(2)
            );

            const calculatedAmount = Number(
                (originalAmount - discountAmount).toFixed(2)
            );

            return {
                ...item,
                calculation_basis: calculationBasis,
                original_amount: originalAmount,
                discount_type: discountType,
                discount_value: discountValue,
                discount_amount: discountAmount,
                calculated_amount: calculatedAmount,
                formula,
                is_imt23: isIMT23,
            };
        });


        // IMT-23 is already included in Total OD.
        // Exclude it here to prevent double-counting.

        const otherAddonDetails = addonDetails.filter(
            (item) => !item.is_imt23
        );

        const addonTotal = otherAddonDetails.reduce(
            (total, item) =>
                total + Number(item?.calculated_amount || 0),
            0
        );


        const zdAddon = addonDetails.find(
            (item) =>
                String(item.addon_code || "").toUpperCase() === "ZD"
        );

        const zdAmount = Number(
            zdAddon?.calculated_amount || 0
        );

        /*
         * STEP 04: DE-TARIFF DISCOUNT
         *
         * Apply the discount to Total OD.
         */

        const deTariffDiscountAmount = Math.min(
            totalOD,
            Number(
                (
                    (totalOD * deTariffDiscountPercentage) /
                    100
                ).toFixed(2)
            )
        );

        /*
         * STEP 05: OD AFTER DE-TARIFF DISCOUNT
         */

        const odAfterDiscount = Math.max(
            0,
            Number(
                (totalOD - deTariffDiscountAmount).toFixed(2)
            )
        );

        /*
         * STEP 06: NCB
         *
         * NCB must be calculated on OD AFTER
         * DE-TARIFF DISCOUNT.
         *
         * Do not use backendOD.ncb_amount here because
         * that amount may have been calculated on Basic OD.
         */

        const ncbRule = calculationData?.ncb_rule?.[0];

        const ncbPercentage = Math.min(
            Math.max(
                Number(
                    backendOD?.ncb_percentage ??
                    ncbRule?.calculated_ncb_percentage ??
                    ncbRule?.ncb_percentage ??
                    0
                ),
                0
            ),
            100
        );

        const ncbBaseAmount = Math.max(
            0,
            Number(
                (
                    totalOD +
                    zdAmount -
                    deTariffDiscountAmount
                ).toFixed(2)
            )
        );

        const calculatedNCBAmount = Number(
            (
                (ncbBaseAmount * ncbPercentage) /
                100
            ).toFixed(2)
        );

        const ncbAmount = Math.min(
            ncbBaseAmount,
            Math.max(0, calculatedNCBAmount)
        );

        /*
         * STEP 07: FINAL NET OD
         *
         * Total OD
         * - DE-TARIFF DISCOUNT
         * = OD AFTER DISCOUNT
         *
         * OD AFTER DISCOUNT
         * - NCB
         * = FINAL NET OD
         */

        const netOD = Math.max(
            0,
            Number(
                (odAfterDiscount - ncbAmount).toFixed(2)
            )
        );

        /*
         * STEP 08: THIRD-PARTY PREMIUM
         */

        const tpRule = calculationData?.tp_rate?.[0];

        const tpRateType = String(
            tpRule?.rate_type || "FIXED"
        ).toUpperCase();

        const tpRateValue = Number(
            tpRule?.slab_rate_value ??
            tpRule?.rate_value ??
            tpRule?.master_rate_value ??
            0
        );

        let tpPremium = 0;
        let tpFormula = "";

        if (tpRule) {
            if (tpRateType === "PERCENTAGE") {
                tpPremium = (idv * tpRateValue) / 100;
                tpFormula = `${money(idv)} × ${tpRateValue}%`;
            } else if (tpRateType === "FIXED") {
                tpPremium = tpRateValue;
                tpFormula = "Fixed TP rate";
            }
        }

        /*
         * STEP 09: ADDITIONAL COVERS
         */

        // const selectedCoverIds = Array.isArray(formData?.cover_ids)
        //     ? formData.cover_ids.map(Number)
        //     : [];

        // const selectedCovers = (
        //     calculationData?.covers || []
        // ).filter((item) =>
        //     selectedCoverIds.includes(Number(item.cover_id))
        // );

        // const seatingCapacity = Number(
        //     formData?.seating_capacity || 0
        // );

        // const coverDetails = selectedCovers.map((item) => {
        //     const rateType = String(
        //         item.rate_type || "FIXED"
        //     ).toUpperCase();

        //     const rateValue = Number(item.rate_value || 0);

        //     let amount = 0;
        //     let calculable = true;
        //     let formula = "";

        //     if (rateType === "FIXED") {
        //         amount = rateValue;
        //         formula = "Fixed amount";
        //     } else if (rateType === "PERCENTAGE") {
        //         amount = (idv * rateValue) / 100;
        //         formula = `${money(idv)} × ${rateValue}%`;
        //     } else if (rateType === "PER_UNIT") {
        //         if (seatingCapacity > 0) {
        //             amount = rateValue * seatingCapacity;
        //             formula =
        //                 `${money(rateValue)} × ${seatingCapacity} units`;
        //         } else {
        //             calculable = false;
        //             formula =
        //                 `${money(rateValue)} × seating capacity`;
        //         }
        //     }

        //     return {
        //         ...item,
        //         calculated_amount: amount,
        //         calculable,
        //         formula,
        //     };
        // });

        // const coverTotal = coverDetails.reduce(
        //     (total, item) =>
        //         total +
        //         Number(
        //             item.calculable ? item.calculated_amount : 0
        //         ),
        //     0
        // );

        /*
 * STEP 09: ADDITIONAL COVERS
 */

        const selectedCoverIds = Array.isArray(formData?.cover_ids)
            ? formData.cover_ids.map(Number)
            : [];

        const selectedCovers = (
            calculationData?.covers || []
        ).filter((item) =>
            selectedCoverIds.includes(Number(item.cover_id))
        );

        const coverDetails = selectedCovers.map((item) => {
            const rateType = String(
                item.rate_type || "FIXED"
            ).toUpperCase();

            const rateValue = Number(item.rate_value || 0);

            // Use the manually entered value for this cover.
            // Fall back to vehicle seating capacity if no value was entered.
            const enteredUnits = coverInputValues[item.cover_id];

            const units = Number(
                enteredUnits !== undefined && enteredUnits !== ""
                    ? enteredUnits
                    : formData?.seating_capacity || 0
            );

            let amount = 0;
            let calculable = true;
            let formula = "";

            if (rateType === "FIXED") {
                amount = rateValue;
                formula = "Fixed amount";
            } else if (rateType === "PERCENTAGE") {
                amount = (idv * rateValue) / 100;
                formula = `${money(idv)} × ${rateValue}%`;
            } else if (rateType === "PER_UNIT") {
                if (units > 0) {
                    amount = rateValue * units;

                    formula = `${money(rateValue)} × ${units} units`;
                } else {
                    calculable = false;
                    formula = `${money(rateValue)} × Enter units`;
                }
            }

            return {
                ...item,
                input_units: units,
                calculated_amount: Number(amount.toFixed(2)),
                calculable,
                formula,
            };
        });

        const coverTotal = coverDetails.reduce(
            (total, item) =>
                total +
                Number(
                    item.calculable ? item.calculated_amount : 0
                ),
            0
        );

        /*
         * STEP 10: PREMIUM BEFORE DE-TARIFF DISCOUNT
         *
         * Retains the existing subtotal definition.
         */

        const subtotalBeforeDiscount = Math.max(
            0,
            Number(
                (
                    totalOD -
                    ncbAmount +
                    addonTotal +
                    tpPremium +
                    coverTotal
                ).toFixed(2)
            )
        );

        /*
         * STEP 11: PREMIUM BEFORE TAX
         */

        const subtotal = Math.max(
            0,
            Number(
                (
                    netOD +
                    addonTotal +
                    tpPremium +
                    coverTotal
                ).toFixed(2)
            )
        );

        /*
         * STEP 12: COMPONENT-WISE TAX
         */

        const applicableTaxes = Array.isArray(calculationData?.tax)
            ? calculationData.tax
            : [];

        const taxDetails = applicableTaxes.map((tax) => {
            const taxType = String(
                tax.tax_type || "PERCENTAGE"
            ).toUpperCase();

            const component = String(
                tax.premium_component || ""
            ).toUpperCase();

            const taxPercentage = Number(
                tax.tax_percentage || 0
            );

            let taxableAmount = 0;

            switch (component) {
                case "OD":
                    taxableAmount = netOD;
                    break;

                case "TP":
                    taxableAmount = tpPremium;
                    break;

                case "ADDON":
                    taxableAmount = addonTotal;
                    break;

                case "COVER":
                    taxableAmount = coverTotal;
                    break;

                default:
                    taxableAmount = 0;
                    break;
            }

            let amount = 0;
            let formula = "";

            if (taxType === "PERCENTAGE") {
                amount =
                    (taxableAmount * taxPercentage) / 100;

                formula =
                    `${money(taxableAmount)} × ${taxPercentage}%`;
            } else if (taxType === "FIXED") {
                amount = Number(
                    tax.tax_amount ??
                    tax.fixed_amount ??
                    tax.tax_value ??
                    0
                );

                formula = "Fixed tax amount";
            }

            return {
                ...tax,
                premium_component: component,
                taxable_amount: taxableAmount,
                calculated_amount: amount,
                formula,
            };
        });

        const totalTax = taxDetails.reduce(
            (total, tax) =>
                total + Number(tax.calculated_amount || 0),
            0
        );

        /*
         * COMPATIBILITY VALUES
         */

        const gstTaxes = taxDetails.filter((tax) =>
            String(tax.tax_code || "").startsWith("GST_")
        );

        const gstPercentage = gstTaxes.reduce(
            (total, tax) =>
                total +
                (
                    String(tax.tax_type).toUpperCase() ===
                        "PERCENTAGE"
                        ? Number(tax.tax_percentage || 0)
                        : 0
                ),
            0
        );

        const gstAmount = gstTaxes.reduce(
            (total, tax) =>
                total + Number(tax.calculated_amount || 0),
            0
        );

        /*
         * STEP 13: TOTAL PREMIUM
         */

        const totalPremium = subtotal + totalTax;

        /*
         * STEP 14: COMMISSION, PROFIT AND CASHBACK
         */

        const commissionRule = calculationData?.commission?.[0];
        const cashbackRule = calculationData?.cashback?.[0];
        const profitRule = calculationData?.profit?.[0];

        const commissionType = String(
            commissionRule?.commission_type || ""
        ).toUpperCase();

        const commissionValue = Number(
            commissionRule?.commission_value || 0
        );

        const maxCommissionAmount =
            commissionRule?.max_commission_amount !== null &&
                commissionRule?.max_commission_amount !== undefined &&
                commissionRule?.max_commission_amount !== ""
                ? Number(commissionRule.max_commission_amount)
                : null;

        const commissionMinPremium =
            commissionRule?.min_premium != null
                ? Number(commissionRule.min_premium)
                : null;

        const commissionMaxPremium =
            commissionRule?.max_premium != null
                ? Number(commissionRule.max_premium)
                : null;

        const commissionEligible =
            (!commissionMinPremium ||
                subtotal >= commissionMinPremium) &&
            (commissionMaxPremium === null ||
                subtotal <= commissionMaxPremium);

        let commissionAmount = 0;
        let commissionFormula = "";

        if (commissionRule && commissionEligible) {
            if (commissionType === "PERCENTAGE") {
                commissionAmount =
                    (subtotal * commissionValue) / 100;

                commissionFormula =
                    `${money(subtotal)} × ${commissionValue}%`;
            } else if (commissionType === "FIXED") {
                commissionAmount = commissionValue;
                commissionFormula = "Fixed commission";
            }

            if (maxCommissionAmount !== null) {
                commissionAmount = Math.min(
                    commissionAmount,
                    Math.max(0, maxCommissionAmount)
                );
            }
        }

        commissionAmount = Math.max(
            0,
            Number(commissionAmount.toFixed(2))
        );

        const profitAmount = Math.max(
            0,
            Number(profitRule?.profit_amount || 0)
        );

        const maxCashbackAmount =
            cashbackRule?.max_cashback_amount != null &&
                cashbackRule?.max_cashback_amount !== ""
                ? Math.max(
                    0,
                    Number(cashbackRule.max_cashback_amount)
                )
                : null;

        const cashbackMinPremium =
            cashbackRule?.min_premium != null
                ? Number(cashbackRule.min_premium)
                : null;

        const cashbackMaxPremium =
            cashbackRule?.max_premium != null
                ? Number(cashbackRule.max_premium)
                : null;

        const cashbackEligible =
            (!cashbackMinPremium ||
                totalPremium >= cashbackMinPremium) &&
            (cashbackMaxPremium === null ||
                totalPremium <= cashbackMaxPremium);

        const manualCashbackValue =
            formData?.cash_back !== undefined &&
                formData?.cash_back !== null &&
                formData?.cash_back !== ""
                ? formData.cash_back
                : formData?.cashback_amount;

        const hasManualCashback =
            manualCashbackValue !== undefined &&
            manualCashbackValue !== null &&
            manualCashbackValue !== "";

        let cashbackAmount = 0;
        let cashbackFormula = "";
        let cashbackSource = "";
        let cashbackApplicable = false;

        if (hasManualCashback) {
            cashbackAmount = Math.max(
                0,
                Number(manualCashbackValue) || 0
            );

            cashbackSource = "FORM";
            cashbackFormula = "Manually entered cashback";
        } else if (cashbackRule && cashbackEligible) {
            cashbackAmount = Math.max(
                0,
                commissionAmount - profitAmount
            );

            cashbackSource = "COMMISSION";
            cashbackFormula =
                `${money(commissionAmount)} - ${money(profitAmount)}`;
        }

        if (maxCashbackAmount !== null) {
            cashbackAmount = Math.min(
                cashbackAmount,
                maxCashbackAmount
            );
        }

        cashbackAmount = Math.min(
            totalPremium,
            Math.max(0, Number(cashbackAmount.toFixed(2)))
        );

        cashbackApplicable = cashbackAmount > 0;

        if (cashbackApplicable) {
            cashbackFormula +=
                ` = ${money(cashbackAmount)}`;
        }

        /*
         * STEP 15: NET PAYABLE
         */

        const netPayable = Math.max(
            0,
            totalPremium - cashbackAmount
        );

        return {
            idv,

            odRate: odRateValue,
            odRateType,
            odFormula,
            odPremium,

            imt23Rate,
            imt23Premium,

            totalOD,

            deTariffDiscountPercentage,
            deTariffDiscountAmount,
            odAfterDiscount,

            ncbPercentage,
            ncbAmount,
            netOD,

            addonDetails,
            addonTotal,

            tpRate: tpRateValue,
            tpRateType,
            tpFormula,
            tpPremium,

            coverDetails,
            coverTotal,

            subtotalBeforeDiscount,
            subtotal,

            applicableTaxes,
            taxDetails,
            totalTax,
            gstPercentage,
            gstAmount,

            ncbBaseAmount,
            zdAmount,

            totalPremium,

            commissionRule,
            commissionAmount,
            commissionFormula,
            maxCommissionAmount,

            profitRule,
            profitAmount,

            cashbackRule,
            cashbackSource,
            cashbackApplicable,
            cashbackFormula,
            maxCashbackAmount,
            cashbackAmount,

            netPayable,
        };
    }, [calculationData, formData, formatNumber,coverInputValues]);

    if (!calculationData) {
        return (
            <Paper
                sx={{
                    borderRadius: 2.5,
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"
                        }`,
                    backgroundColor: isDark ? "#1e293b" : "#ffffff",
                    overflow: "hidden",
                    boxShadow: isDark
                        ? "0 2px 8px rgba(0,0,0,0.20)"
                        : "0 2px 8px rgba(15,23,42,0.04)",
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        borderBottom: `1px solid ${isDark ? "#334155" : "#eef2f7"
                            }`,
                        backgroundColor: isDark ? "#172033" : "#fafbfc",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: isDark ? "#f8fafc" : "#1e293b",
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        Premium Calculation
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: "11px",
                            color: "#94a3b8",
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        Calculation summary
                    </Typography>
                </Box>

                <Box
                    sx={{
                        minHeight: 260,
                        px: 2,
                        py: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            mb: 1.5,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isDark ? "#1e3a5f" : "#eff6ff",
                            color: isDark ? "#93c5fd" : "#2563eb",
                            fontSize: "22px",
                        }}
                    >
                        ?
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: isDark ? "#f1f5f9" : "#334155",
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        Premium calculation not available
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.7,
                            maxWidth: 300,
                            fontSize: "11px",
                            lineHeight: 1.6,
                            color: isDark ? "#94a3b8" : "#64748b",
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        Enter the required vehicle and policy details, then
                        continue to view the premium calculation.
                    </Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper
            sx={{
                mb: 2,
                borderRadius: 2.5,
                border: isDark
                    ? "1px solid #334155"
                    : "1px solid #e2e8f0",
                backgroundColor: isDark ? "#0f172a" : "#fff",
                overflow: "hidden",
                boxShadow: isDark
                    ? "0 2px 8px rgba(0,0,0,0.20)"
                    : "0 2px 8px rgba(15,23,42,0.04)",
                pb: 5,
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: isDark
                        ? "1px solid #334155"
                        : "1px solid #eef2f7",
                    backgroundColor: isDark ? "#1e293b" : "#fafbfc",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                    }}
                >
                    <Box
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f0fdf4",
                            color: "#16a34a",
                            fontSize: "13px",
                            fontWeight: 800,
                        }}
                    >
                        04
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: isDark ? "#f8fafc" : "#1e293b",
                                lineHeight: 1.2,
                            }}
                        >
                            Premium Calculation
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: "11px",
                                color: "#94a3b8",
                            }}
                        >
                            Step-by-step calculation
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        px: 1.2,
                        py: 0.5,
                        borderRadius: 5,
                        backgroundColor: "#eff6ff",
                        color: "#2563eb",
                        fontSize: "11px",
                        fontWeight: 700,
                    }}
                >
                    Final Premium
                </Box>
            </Box>

            {/* CONTENT */}

            <Box sx={{ p: 2 }}>
                {/* 01 - IDV */}

                <CalculationStep
                    number="01"
                    title="Insured Declared Value"
                    description="Vehicle IDV"
                    amount={money(calculation.idv)}
                />

                {/* 02 - BASIC OD */}

                <CalculationStep
                    number="02"
                    title="Basic Own Damage Premium"
                    formula={calculation.odFormula}
                    formulaResult={`= ${money(calculation.odPremium)}`}
                    amount={money(calculation.odPremium)}
                >
                    {calculation.imt23Premium > 0 && (
                        <CalculationLine
                            label="IMT-23 GCV Cover"
                            formula={`${money(calculation.odPremium)} × ${calculation.imt23Rate}% (Basic OD)`}
                            amount={money(calculation.imt23Premium)}
                        />
                    )}
                </CalculationStep>

                {/* TOTAL OD */}

                <Box
                    sx={{
                        mt: -0.4,
                        mb: 1.2,
                        px: 1.5,
                        py: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 1.5,
                        backgroundColor: isDark ? "#172554" : "#eff6ff",
                        border: `1px solid ${isDark ? "#1e3a8a" : "#dbeafe"
                            }`,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: isDark ? "#bfdbfe" : "#1d4ed8",
                        }}
                    >
                        Total OD (Basic OD + IMT-23)
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: isDark ? "#dbeafe" : "#1d4ed8",
                        }}
                    >
                        {money(calculation.totalOD)}
                    </Typography>
                </Box>

                {/* 03 - DE TARIFF DISCOUNT */}

                {calculation.deTariffDiscountPercentage > 0 && (
                    <Box
                        sx={{
                            mb: 1,
                            px: 1.5,
                            py: 1.1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            borderRadius: 1.5,
                            backgroundColor: isDark ? "#2b2115" : "#fffbeb",
                            border: `1px solid ${isDark ? "#4b3a20" : "#fde68a"
                                }`,
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    color: isDark ? "#fbbf24" : "#92400e",
                                }}
                            >
                                DE Tariff Discount (
                                {calculation.deTariffDiscountPercentage}%)
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "10px",
                                    color: isDark ? "#fcd34d" : "#92400e",
                                }}
                            >
                                {money(calculation.totalOD)} ×{" "}
                                {calculation.deTariffDiscountPercentage}% ={" "}
                                {money(calculation.deTariffDiscountAmount)}
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: "13px",
                                fontWeight: 800,
                                color: "#dc2626",
                                whiteSpace: "nowrap",
                            }}
                        >
                            − {money(calculation.deTariffDiscountAmount)}
                        </Typography>
                    </Box>
                )}

                {/* OD AFTER DE TARIFF DISCOUNT */}

                <Box
                    sx={{
                        mt: -0.2,
                        mb: 1.2,
                        px: 1.5,
                        py: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: isDark ? "#172033" : "#f8fafc",
                        borderRadius: 1.5,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: isDark ? "#cbd5e1" : "#475569",
                            }}
                        >
                            OD After DE Tariff Discount
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.2,
                                fontSize: "10px",
                                color: "#94a3b8",
                            }}
                        >
                            Total OD − DE Tariff Discount
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: isDark ? "#f1f5f9" : "#334155",
                        }}
                    >
                        {money(calculation.odAfterDiscount)}
                    </Typography>
                </Box>

                {/* 04 - NCB ON DISCOUNTED OD */}

                <CalculationStep
                    number="04"
                    title={`NCB ${calculation.ncbPercentage}%`}
                    formula={`${money(calculation.totalOD)} + ${money(calculation.zdAmount)} - ${money(calculation.deTariffDiscountAmount)}`}
                    formulaResult={`NCB Base: ${money(calculation.ncbBaseAmount)} × ${calculation.ncbPercentage}% = ${money(calculation.ncbAmount)}`}
                    amount={`-${money(calculation.ncbAmount)}`}
                    amountColor="#dc2626"
                />

                {/* FINAL NET OD */}

                <Box
                    sx={{
                        mt: -0.2,
                        mb: 1.2,
                        px: 1.5,
                        py: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                        borderRadius: 1.5,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: isDark ? "#cbd5e1" : "#475569",
                            }}
                        >
                            Final Net OD
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.2,
                                fontSize: "10px",
                                color: "#94a3b8",
                            }}
                        >
                            OD After Discount − NCB
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: isDark ? "#f1f5f9" : "#334155",
                        }}
                    >
                        {money(calculation.netOD)}
                    </Typography>
                </Box>

                {/* 05 - ADD-ONS */}

                <CalculationStep
                    number="05"
                    title="Add-ons"
                    amount={money(calculation.addonTotal)}
                >
                    {calculation.addonDetails.map((item) => (
                        <CalculationLine
                            key={item.addon_id}
                            label={item.addon_name}
                            formula={item.formula}
                            amount={money(item.calculated_amount)}
                        />
                    ))}
                </CalculationStep>

                {/* 06 - TP */}

                <CalculationStep
                    number="06"
                    title="Third Party Premium"
                    amount={money(calculation.tpPremium)}
                >
                    <CalculationInfoLine
                        label="Engine CC"
                        value={
                            formData?.engine_cc
                                ? `${formData.engine_cc} CC`
                                : "Not required for this slab"
                        }
                    />

                    <CalculationInfoLine
                        label="Applicable slab"
                        value={
                            calculationData?.tp_rate?.[0]
                                ?.engine_cc_slab_name ||
                            calculationData?.tp_rate?.[0]
                                ?.gvw_slab_name ||
                            calculationData?.tp_rate?.[0]?.description ||
                            "No matching TP slab"
                        }
                    />

                    <CalculationInfoLine
                        label="TP calculation"
                        value={
                            calculation.tpRateType === "FIXED"
                                ? "Fixed TP rate"
                                : calculation.tpFormula
                        }
                    />

                    <CalculationInfoLine
                        label="TP premium"
                        value={money(calculation.tpPremium)}
                    />
                </CalculationStep>

                {/* 07 - COVERS */}

                <CalculationStep
                    number="07"
                    title="Additional Covers"
                    amount={money(calculation.coverTotal)}
                >
                    {calculation.coverDetails.map((item) => (
                        <CalculationLine
                            key={item.cover_id}
                            label={item.cover_name}
                            formula={item.formula}
                            amount={
                                item.calculable
                                    ? money(item.calculated_amount)
                                    : "Pending"
                            }
                            pending={!item.calculable}
                        />
                    ))}
                </CalculationStep>

                {/* PREMIUM BEFORE DE TARIFF DISCOUNT */}

                <Box
                    sx={{
                        mt: 1.5,
                        px: 1.5,
                        py: 1.2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: isDark
                            ? "1px solid #334155"
                            : "1px solid #e2e8f0",
                        backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: isDark ? "#cbd5e1" : "#475569",
                            }}
                        >
                            Premium Before DE Tariff Discount
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.2,
                                fontSize: "10px",
                                color: "#94a3b8",
                            }}
                        >
                            (Total OD − NCB) + Add-ons + TP + Covers
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: isDark ? "#f1f5f9" : "#334155",
                        }}
                    >
                        {money(calculation.subtotalBeforeDiscount)}
                    </Typography>
                </Box>

                {/* PREMIUM BEFORE TAX */}

                <Box
                    sx={{
                        px: 1.5,
                        py: 1.4,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: isDark
                            ? "1px solid #334155"
                            : "1px solid #e2e8f0",
                        borderBottom: isDark
                            ? "1px solid #334155"
                            : "1px solid #e2e8f0",
                        backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: isDark ? "#e2e8f0" : "#334155",
                            }}
                        >
                            Premium Before Tax
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.2,
                                fontSize: "10px",
                                color: "#94a3b8",
                            }}
                        >
                            After DE Tariff Discount and NCB
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: isDark ? "#f8fafc" : "#334155",
                        }}
                    >
                        {money(calculation.subtotal)}
                    </Typography>
                </Box>

                {/* APPLICABLE TAXES */}

                {calculation.taxDetails.map((tax, index) => (
                    <Box
                        key={
                            tax.tax_rule_id ??
                            `${tax.tax_id ?? tax.tax_code}-${tax.premium_component}-${index}`
                        }
                        sx={{
                            px: 1.5,
                            py: 1.2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: isDark ? "#cbd5e1" : "#475569",
                                }}
                            >
                                {tax.tax_name || tax.tax_code || "Tax"}
                                {String(tax.tax_type).toUpperCase() ===
                                    "PERCENTAGE"
                                    ? ` (${Number(tax.tax_percentage || 0)}%)`
                                    : ""}
                                {tax.premium_component
                                    ? ` - ${tax.premium_component}`
                                    : ""}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "10px",
                                    color: "#94a3b8",
                                }}
                            >
                                {tax.formula}
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: "13px",
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                color: isDark ? "#e2e8f0" : "#475569",
                            }}
                        >
                            {money(tax.calculated_amount)}
                        </Typography>
                    </Box>
                ))}

                {/* TOTAL TAX */}

                <Box
                    sx={{
                        px: 1.5,
                        py: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: isDark ? "#e2e8f0" : "#334155",
                        }}
                    >
                        Total Tax
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: isDark ? "#f1f5f9" : "#334155",
                        }}
                    >
                        {money(calculation.totalTax)}
                    </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* TOTAL PREMIUM */}

                <Box
                    sx={{
                        mt: 1,
                        px: 1.8,
                        py: 1.6,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 2,
                        backgroundColor: isDark ? "#172554" : "#eff6ff",
                        border: isDark
                            ? "1px solid #1e3a8a"
                            : "1px solid #bfdbfe",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "11px",
                                fontWeight: 800,
                                color: "#2563eb",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Total Premium
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: "10px",
                                color: isDark ? "#94a3b8" : "#64748b",
                            }}
                        >
                            Including applicable taxes
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "21px",
                            fontWeight: 800,
                            color: "#1d4ed8",
                        }}
                    >
                        {money(calculation?.totalPremium)}
                    </Typography>
                </Box>

                {/* CASHBACK */}

                {calculation?.cashbackApplicable && (
                    <Box
                        sx={{
                            mt: 1.5,
                            p: 1.5,
                            border: "1px solid #bbf7d0",
                            borderRadius: 2,
                            backgroundColor: "#f0fdf4",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 0.8,
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        fontWeight: 800,
                                        color: "#15803d",
                                    }}
                                >
                                    Cashback
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.2,
                                        fontSize: "10px",
                                        color: "#65a30d",
                                    }}
                                >
                                    Customer cashback benefit
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 800,
                                    color: "#15803d",
                                }}
                            >
                                {money(calculation.cashbackAmount)}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                pt: 0.8,
                                borderTop: "1px dashed #bbf7d0",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "10px",
                                    color: "#65a30d",
                                }}
                            >
                                {"Formula Hided"}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "10px",
                                    color: "#65a30d",
                                }}
                            >
                                = {money(calculation.cashbackAmount)}
                            </Typography>
                        </Box>

                        {calculation.maxCashbackAmount !== null && (
                            <CalculationInfoLine
                                label="Maximum cashback"
                                value={money(calculation.maxCashbackAmount)}
                            />
                        )}
                    </Box>
                )}

                {/* NET PAYABLE */}

                {calculation.cashbackApplicable && (
                    <Box
                        sx={{
                            mt: 1.2,
                            px: 1.5,
                            py: 1.3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTop: isDark
                                ? "1px solid #334155"
                                : "1px solid #e2e8f0",
                            borderBottom: isDark
                                ? "1px solid #334155"
                                : "1px solid #e2e8f0",
                            backgroundColor: isDark ? "#1e293b" : "#fafafa",
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    color: isDark ? "#e2e8f0" : "#334155",
                                }}
                            >
                                Net Payable
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "10px",
                                    color: "#94a3b8",
                                }}
                            >
                                Total Premium - Cashback
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: "16px",
                                fontWeight: 800,
                                color: "#15803d",
                            }}
                        >
                            {money(calculation.netPayable)}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default PremiumCalculationSummary;
