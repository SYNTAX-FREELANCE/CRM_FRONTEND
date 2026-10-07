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
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const money = (value) => {
        const number = Number(value || 0);

        return `?${formatNumber(
            number.toFixed(2)
        )}`;
    };

    const calculation = useMemo(() => {
        const idv = Number(formData?.idv || 0);

        /*
         * =========================================================
         * 1. OWN DAMAGE
         * =========================================================
         */

        const odRate = Number(
            calculationData?.od_rate?.[0]?.rate_value || 0
        );

        const odPremium =
            (idv * odRate) / 100;

        /*
         * =========================================================
         * 2. NCB
         * =========================================================
         */

        const ncbRule =
            calculationData?.ncb_rule?.[0];

        const ncbPercentage = Number(
            ncbRule?.calculated_ncb_percentage ??
            ncbRule?.ncb_percentage ??
            0
        );

        const ncbAmount =
            (odPremium * ncbPercentage) / 100;

        const netOD =
            odPremium - ncbAmount;

        /*
         * =========================================================
         * 3. ADD-ONS
         * =========================================================
         */

        const selectedAddonIds =
            formData?.addon_ids || [];

        const selectedAddons =
            (calculationData?.addons || []).filter(
                (item) =>
                    selectedAddonIds.includes(
                        Number(item.addon_id)
                    )
            );

        const addonDetails =
            selectedAddons.map((item) => {
                let amount = 0;
                let formula = "";

                const rateValue = Number(
                    item.rate_value || 0
                );

                if (
                    item.rate_type ===
                    "PERCENTAGE"
                ) {
                    amount =
                        (idv * rateValue) / 100;

                    formula =
                        `${money(idv)} × ${rateValue}%`;
                }

                if (
                    item.rate_type ===
                    "FIXED"
                ) {
                    amount = rateValue;

                    formula =
                        "Fixed amount";
                }

                return {
                    ...item,
                    calculated_amount: amount,
                    formula,
                };
            });

        const addonTotal =
            addonDetails.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.calculated_amount || 0
                    ),
                0
            );

        /*
         * =========================================================
         * 4. THIRD PARTY
         * =========================================================
         */

        const tpRate =
            calculationData?.tp_rate?.[0];

        const tpPremium = tpRate
            ? Number(
                tpRate.rate_value || 0
            )
            : 0;

        /*
         * =========================================================
         * 5. ADDITIONAL COVERS
         * =========================================================
         */

        const selectedCoverIds =
            formData?.cover_ids || [];

        const selectedCovers =
            (calculationData?.covers || []).filter(
                (item) =>
                    selectedCoverIds.includes(
                        Number(item.cover_id)
                    )
            );

        const seatingCapacity = Number(
            formData?.seating_capacity || 0
        );

        const coverDetails =
            selectedCovers.map((item) => {
                const rateValue = Number(
                    item.rate_value || 0
                );

                let amount = 0;
                let calculable = true;
                let formula = "";

                if (
                    item.rate_type ===
                    "FIXED"
                ) {
                    amount = rateValue;

                    formula =
                        "Fixed amount";
                }

                else if (
                    item.rate_type ===
                    "PERCENTAGE"
                ) {
                    amount =
                        (idv * rateValue) / 100;

                    formula =
                        `${money(idv)} × ${rateValue}%`;
                }

                else if (
                    item.rate_type ===
                    "PER_UNIT"
                ) {
                    if (
                        seatingCapacity > 0
                    ) {
                        amount =
                            rateValue *
                            seatingCapacity;

                        formula =
                            `${money(rateValue)} × ${seatingCapacity} units`;
                    } else {
                        calculable = false;

                        formula =
                            `${money(rateValue)} × seating capacity`;
                    }
                }

                return {
                    ...item,
                    calculated_amount: amount,
                    calculable,
                    formula,
                };
            });

        const coverTotal =
            coverDetails.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.calculable
                            ? item.calculated_amount
                            : 0
                    ),
                0
            );

        /*
         * =========================================================
         * 6. PREMIUM BEFORE DE-TARIFF DISCOUNT
         * =========================================================
         */

        const subtotalBeforeDiscount =
            netOD +
            addonTotal +
            tpPremium +
            coverTotal;

        /*
         * =========================================================
         * 7. DE-TARIFF DISCOUNT
         *
         * formData.de_tariff_discount = percentage
         *
         * Example:
         * 20 = 20%
         *
         * Discount = Premium × 20 / 100
         * =========================================================
         */

        const deTariffDiscountPercentage =
            Number(
                formData?.de_tariff_discount || 0
            );

        const validDeTariffDiscountPercentage =
            Math.min(
                Math.max(
                    deTariffDiscountPercentage,
                    0
                ),
                100
            );

        const deTariffDiscountAmount =
            (
                subtotalBeforeDiscount *
                validDeTariffDiscountPercentage
            ) / 100;

        const subtotal =
            Math.max(
                0,
                subtotalBeforeDiscount -
                deTariffDiscountAmount
            );

        /*
         * =========================================================
         * 8. TAX
         *
         * GST is calculated AFTER DE-TARIFF DISCOUNT
         * =========================================================
         */

        const percentageTaxes =
            (calculationData?.tax || []).filter(
                (item) =>
                    item.tax_type ===
                    "PERCENTAGE"
            );

        const gstPercentage =
            percentageTaxes.length > 0
                ? Number(
                    percentageTaxes[0]
                        ?.tax_percentage || 0
                )
                : 0;

        const gstAmount =
            (subtotal * gstPercentage) / 100;

        /*
         * =========================================================
         * 9. TOTAL PREMIUM
         * =========================================================
         */

        const totalPremium =
            subtotal + gstAmount;

        /*
         * =========================================================
         * 10. CASHBACK
         * =========================================================
         */

        const cashbackRule =
            calculationData?.cashback?.[0];

        /*
         * Priority:
         *
         * 1. User entered cashback
         * 2. API cashback rule
         * 3. No cashback
         */

        const hasDirectCashback =
            formData?.cashback !== undefined &&
            formData?.cashback !== null &&
            formData?.cashback !== "";

        let cashbackAmount = 0;

        let cashbackPercentage = 0;
        let cashbackFixedAmount = 0;
        let maxCashbackAmount = null;

        let cashbackFormula = "";
        let cashbackApplicable = false;

        let cashbackSource = "";

        /*
         * ---------------------------------------------------------
         * DIRECT CASHBACK FROM FORM
         * ---------------------------------------------------------
         */

        if (hasDirectCashback) {
            cashbackAmount =
                Number(
                    formData.cashback || 0
                );

            cashbackApplicable =
                cashbackAmount > 0;

            cashbackSource =
                "FORM";

            cashbackFormula =
                cashbackApplicable
                    ? "Direct cashback entered"
                    : "";
        }

        /*
         * ---------------------------------------------------------
         * API CASHBACK FALLBACK
         * ---------------------------------------------------------
         */

        else if (cashbackRule) {
            cashbackSource =
                "API";

            cashbackPercentage =
                Number(
                    cashbackRule.cashback_value || 0
                );

            maxCashbackAmount =
                cashbackRule.max_cashback_amount !==
                    null &&
                    cashbackRule.max_cashback_amount !==
                    undefined
                    ? Number(
                        cashbackRule.max_cashback_amount
                    )
                    : null;

            /*
             * PERCENTAGE CASHBACK
             */

            if (
                cashbackRule.cashback_type ===
                "PERCENTAGE"
            ) {
                cashbackAmount =
                    (
                        totalPremium *
                        cashbackPercentage
                    ) / 100;

                cashbackFormula =
                    `${money(totalPremium)} × ${cashbackPercentage}%`;
            }

            /*
             * FIXED CASHBACK
             */

            else if (
                cashbackRule.cashback_type ===
                "FIXED"
            ) {
                cashbackFixedAmount =
                    Number(
                        cashbackRule.cashback_value ||
                        0
                    );

                cashbackAmount =
                    cashbackFixedAmount;

                cashbackFormula =
                    "Fixed cashback amount";
            }

            /*
             * PREMIUM ELIGIBILITY
             */

            const minPremium =
                cashbackRule.min_premium !==
                    null &&
                    cashbackRule.min_premium !==
                    undefined
                    ? Number(
                        cashbackRule.min_premium
                    )
                    : null;

            const maxPremium =
                cashbackRule.max_premium !==
                    null &&
                    cashbackRule.max_premium !==
                    undefined
                    ? Number(
                        cashbackRule.max_premium
                    )
                    : null;

            if (
                minPremium !== null &&
                totalPremium < minPremium
            ) {
                cashbackAmount = 0;
            }

            if (
                maxPremium !== null &&
                totalPremium > maxPremium
            ) {
                cashbackAmount = 0;
            }

            /*
             * MAXIMUM CASHBACK LIMIT
             */

            if (
                cashbackAmount > 0 &&
                maxCashbackAmount !== null &&
                cashbackAmount >
                maxCashbackAmount
            ) {
                cashbackAmount =
                    maxCashbackAmount;

                cashbackFormula =
                    `${cashbackFormula} (capped at maximum cashback)`;
            }

            cashbackApplicable =
                cashbackAmount > 0;
        }

        /*
         * =========================================================
         * 11. NET PAYABLE
         * =========================================================
         */

        const netPayable =
            Math.max(
                0,
                totalPremium -
                cashbackAmount
            );

        return {
            idv,

            odRate,
            odPremium,

            ncbPercentage,
            ncbAmount,
            netOD,

            addonDetails,
            addonTotal,

            tpPremium,

            coverDetails,
            coverTotal,

            /*
             * DE TARIFF DISCOUNT
             */

            subtotalBeforeDiscount,

            deTariffDiscountPercentage,
            deTariffDiscountAmount,

            subtotal,

            gstPercentage,
            gstAmount,

            totalPremium,

            /*
             * CASHBACK
             */

            cashbackRule,
            cashbackSource,
            cashbackApplicable,
            cashbackPercentage,
            cashbackFixedAmount,
            cashbackFormula,
            maxCashbackAmount,
            cashbackAmount,

            netPayable,
        };
    }, [
        calculationData,
        formData,
        formatNumber,
    ]);

    if (!calculationData) {
        return (
            <Paper
                sx={{
                    borderRadius: 2.5,
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"
                        }`,
                    backgroundColor: isDark
                        ? "#1e293b"
                        : "#ffffff",
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
                        backgroundColor: isDark
                            ? "#172033"
                            : "#fafbfc",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: isDark
                                ? "#f8fafc"
                                : "#1e293b",
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        Premium Calculation
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.25,
                            fontSize: "11px",
                            color: isDark
                                ? "#94a3b8"
                                : "#94a3b8",
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
                            backgroundColor: isDark
                                ? "#1e3a5f"
                                : "#eff6ff",
                            color: isDark
                                ? "#93c5fd"
                                : "#2563eb",
                            fontSize: "22px",
                        }}
                    >
                        ?
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: isDark
                                ? "#f1f5f9"
                                : "#334155",
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
                            color: isDark
                                ? "#94a3b8"
                                : "#64748b",
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        Enter the required vehicle and policy details,
                        then continue to view the premium calculation.
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
                backgroundColor: isDark
                    ? "#0f172a"
                    : "#fff",
                overflow: "hidden",
                boxShadow: isDark
                    ? "0 2px 8px rgba(0,0,0,0.20)"
                    : "0 2px 8px rgba(15, 23, 42, 0.04)",
            }}
        >
            {/* =====================================================
                HEADER
            ===================================================== */}

            <Box
                sx={{
                    px: 2,
                    py: 1.5,

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",

                    borderBottom: isDark
                        ? "1px solid #334155"
                        : "1px solid #eef2f7",

                    backgroundColor: isDark
                        ? "#1e293b"
                        : "#fafbfc",
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
                            justifyContent:
                                "center",

                            backgroundColor:
                                "#f0fdf4",

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
                                color: isDark
                                    ? "#f8fafc"
                                    : "#1e293b",
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

                        backgroundColor:
                            "#eff6ff",

                        color: "#2563eb",

                        fontSize: "11px",
                        fontWeight: 700,
                    }}
                >
                    Final Premium
                </Box>
            </Box>

            {/* =====================================================
                CONTENT
            ===================================================== */}

            <Box sx={{ p: 2 }}>

                {/* =================================================
                    01 - IDV
                ================================================= */}

                <CalculationStep
                    number="01"
                    title="Insured Declared Value"
                    description="Vehicle IDV"
                    amount={money(
                        calculation.idv
                    )}
                />

                {/* =================================================
                    02 - OD
                ================================================= */}

                <CalculationStep
                    number="02"
                    title="Own Damage Premium"
                    formula={`${money(
                        calculation.idv
                    )} × ${calculation.odRate}%`}
                    formulaResult={`= ${money(
                        calculation.odPremium
                    )}`}
                    amount={money(
                        calculation.odPremium
                    )}
                />

                {/* =================================================
                    03 - NCB
                ================================================= */}

                <CalculationStep
                    number="03"
                    title={`NCB ${calculation.ncbPercentage}%`}
                    formula={`${money(
                        calculation.odPremium
                    )} × ${calculation.ncbPercentage}%`}
                    formulaResult={`= ${money(
                        calculation.ncbAmount
                    )}`}
                    amount={`-${money(
                        calculation.ncbAmount
                    )}`}
                    amountColor="#dc2626"
                />

                {/* =================================================
                    NET OD
                ================================================= */}

                <Box
                    sx={{
                        mt: -0.4,
                        mb: 1.2,
                        px: 1.5,
                        py: 1,

                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",

                        backgroundColor: isDark
                            ? "#1e293b"
                            : "#f8fafc",

                        borderRadius: 1.5,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: isDark
                                ? "#cbd5e1"
                                : "#475569",
                        }}
                    >
                        Net OD
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: isDark
                                ? "#f1f5f9"
                                : "#334155",
                        }}
                    >
                        {money(
                            calculation.netOD
                        )}
                    </Typography>
                </Box>

                {/* =================================================
                    04 - ADDONS
                ================================================= */}

                <CalculationStep
                    number="04"
                    title="Add-ons"
                    amount={money(
                        calculation.addonTotal
                    )}
                >
                    {calculation.addonDetails.map(
                        (item) => (
                            <CalculationLine
                                key={
                                    item.addon_id
                                }
                                label={
                                    item.addon_name
                                }
                                formula={
                                    item.formula
                                }
                                amount={money(
                                    item.calculated_amount
                                )}
                            />
                        )
                    )}
                </CalculationStep>

                {/* =================================================
                    05 - TP
                ================================================= */}

                <CalculationStep
                    number="05"
                    title="Third Party Premium"
                    amount={money(
                        calculation.tpPremium
                    )}
                >
                    <CalculationInfoLine
                        label="Engine CC"
                        value={
                            formData?.engine_cc
                                ? `${formData.engine_cc} CC`
                                : "Not provided"
                        }
                    />

                    <CalculationInfoLine
                        label="Applicable slab"
                        value={
                            calculationData
                                ?.tp_rate?.[0]
                                ?.engine_cc_slab_name ||
                            "Applicable TP slab"
                        }
                    />

                    <CalculationInfoLine
                        label="Fixed TP rate"
                        value={money(
                            calculation.tpPremium
                        )}
                    />
                </CalculationStep>

                {/* =================================================
                    06 - COVERS
                ================================================= */}

                <CalculationStep
                    number="06"
                    title="Additional Covers"
                    amount={money(
                        calculation.coverTotal
                    )}
                >
                    {calculation.coverDetails.map(
                        (item) => (
                            <CalculationLine
                                key={
                                    item.cover_id
                                }
                                label={
                                    item.cover_name
                                }
                                formula={
                                    item.formula
                                }
                                amount={
                                    item.calculable
                                        ? money(
                                            item.calculated_amount
                                        )
                                        : "Pending"
                                }
                                pending={
                                    !item.calculable
                                }
                            />
                        )
                    )}
                </CalculationStep>

                {/* =================================================
                    PREMIUM BEFORE DISCOUNT
                ================================================= */}

                <Box
                    sx={{
                        mt: 1.5,
                        px: 1.5,
                        py: 1.2,

                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",

                        borderTop: isDark
                            ? "1px solid #334155"
                            : "1px solid #e2e8f0",

                        backgroundColor: isDark
                            ? "#1e293b"
                            : "#f8fafc",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: isDark
                                    ? "#cbd5e1"
                                    : "#475569",
                            }}
                        >
                            Premium Before Discount
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.2,
                                fontSize: "10px",
                                color: "#94a3b8",
                            }}
                        >
                            Net OD + Add-ons + TP + Covers
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                            color: isDark
                                ? "#f1f5f9"
                                : "#334155",
                        }}
                    >
                        {money(
                            calculation.subtotalBeforeDiscount
                        )}
                    </Typography>
                </Box>

                {/* =================================================
                    DE-TARIFF DISCOUNT
                ================================================= */}

                {calculation.deTariffDiscountPercentage >
                    0 && (
                        <Box
                            sx={{
                                px: 1.5,
                                py: 1.2,

                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems: "center",

                                backgroundColor: isDark
                                    ? "#2b2115"
                                    : "#fffbeb",

                                borderBottom: isDark
                                    ? "1px solid #4b3a20"
                                    : "1px solid #fde68a",
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: "#b45309",
                                    }}
                                >
                                    DE Tariff Discount
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.2,
                                        fontSize: "10px",
                                        color: isDark
                                            ? "#fbbf24"
                                            : "#92400e",
                                    }}
                                >
                                    {money(
                                        calculation.subtotalBeforeDiscount
                                    )}{" "}
                                    ×{" "}
                                    {
                                        calculation.deTariffDiscountPercentage
                                    }%
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.1,
                                        fontSize: "10px",
                                        color: isDark
                                            ? "#fbbf24"
                                            : "#92400e",
                                    }}
                                >
                                    ={" "}
                                    {money(
                                        calculation.deTariffDiscountAmount
                                    )}
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 800,
                                    color: "#dc2626",
                                }}
                            >
                                -{" "}
                                {money(
                                    calculation.deTariffDiscountAmount
                                )}
                            </Typography>
                        </Box>
                    )}

                {/* =================================================
                    PREMIUM BEFORE TAX
                ================================================= */}

                <Box
                    sx={{
                        mt: 0,
                        px: 1.5,
                        py: 1.4,

                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",

                        borderTop: isDark
                            ? "1px solid #334155"
                            : "1px solid #e2e8f0",

                        borderBottom: isDark
                            ? "1px solid #334155"
                            : "1px solid #e2e8f0",

                        backgroundColor: isDark
                            ? "#1e293b"
                            : "#f8fafc",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: isDark
                                    ? "#e2e8f0"
                                    : "#334155",
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
                            After DE Tariff Discount
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "15px",
                            fontWeight: 800,
                            color: isDark
                                ? "#f8fafc"
                                : "#334155",
                        }}
                    >
                        {money(
                            calculation.subtotal
                        )}
                    </Typography>
                </Box>

                {/* =================================================
                    GST
                ================================================= */}

                <Box
                    sx={{
                        px: 1.5,
                        py: 1.2,

                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: isDark
                                    ? "#cbd5e1"
                                    : "#475569",
                            }}
                        >
                            GST{" "}
                            {calculation.gstPercentage}%
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.2,
                                fontSize: "10px",
                                color: "#94a3b8",
                            }}
                        >
                            {money(
                                calculation.subtotal
                            )}{" "}
                            ×{" "}
                            {
                                calculation.gstPercentage
                            }%
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "10px",
                                color: "#64748b",
                            }}
                        >
                            ={" "}
                            {money(
                                calculation.gstAmount
                            )}
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: isDark
                                ? "#e2e8f0"
                                : "#475569",
                        }}
                    >
                        {money(
                            calculation.gstAmount
                        )}
                    </Typography>
                </Box>

                <Divider
                    sx={{
                        my: 1,
                    }}
                />

                {/* =================================================
                    TOTAL PREMIUM
                ================================================= */}

                <Box
                    sx={{
                        mt: 1,

                        px: 1.8,
                        py: 1.6,

                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",

                        borderRadius: 2,

                        backgroundColor: isDark
                            ? "#172554"
                            : "#eff6ff",

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
                                textTransform:
                                    "uppercase",
                                letterSpacing:
                                    "0.04em",
                            }}
                        >
                            Total Premium
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.25,
                                fontSize: "10px",
                                color: isDark
                                    ? "#94a3b8"
                                    : "#64748b",
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
                        {money(
                            calculation.totalPremium
                        )}
                    </Typography>
                </Box>

                {/* =================================================
                    07 - CASHBACK
                ================================================= */}

                {calculation.cashbackApplicable && (
                    <Box
                        sx={{
                            mt: 1.5,
                            p: 1.5,

                            border:
                                "1px solid #bbf7d0",

                            borderRadius: 2,

                            backgroundColor:
                                "#f0fdf4",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",

                                mb: 0.8,
                            }}
                        >
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            800,
                                        color:
                                            "#15803d",
                                    }}
                                >
                                    Cashback
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.2,
                                        fontSize:
                                            "10px",
                                        color:
                                            "#65a30d",
                                    }}
                                >
                                    Customer cashback benefit
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontSize:
                                        "14px",
                                    fontWeight:
                                        800,
                                    color:
                                        "#15803d",
                                }}
                            >
                                {money(
                                    calculation.cashbackAmount
                                )}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                pt: 0.8,
                                borderTop:
                                    "1px dashed #bbf7d0",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize:
                                        "10px",
                                    color:
                                        "#65a30d",
                                }}
                            >
                                {calculation.cashbackFormula}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize:
                                        "10px",
                                    color:
                                        "#65a30d",
                                }}
                            >
                                ={" "}
                                {money(
                                    calculation.cashbackAmount
                                )}
                            </Typography>
                        </Box>

                        {calculation.maxCashbackAmount !==
                            null && (
                                <CalculationInfoLine
                                    label="Maximum cashback"
                                    value={money(
                                        calculation.maxCashbackAmount
                                    )}
                                />
                            )}
                    </Box>
                )}

                {/* =================================================
                    NET PAYABLE
                ================================================= */}

                {calculation.cashbackApplicable && (
                    <Box
                        sx={{
                            mt: 1.2,
                            px: 1.5,
                            py: 1.3,

                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",

                            borderTop: isDark
                                ? "1px solid #334155"
                                : "1px solid #e2e8f0",

                            borderBottom: isDark
                                ? "1px solid #334155"
                                : "1px solid #e2e8f0",

                            backgroundColor:
                                isDark
                                    ? "#1e293b"
                                    : "#fafafa",
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize:
                                        "12px",
                                    fontWeight:
                                        700,
                                    color:
                                        isDark
                                            ? "#e2e8f0"
                                            : "#334155",
                                }}
                            >
                                Net Payable
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize:
                                        "10px",
                                    color:
                                        "#94a3b8",
                                }}
                            >
                                Total Premium - Cashback
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize:
                                    "16px",
                                fontWeight:
                                    800,
                                color:
                                    "#15803d",
                            }}
                        >
                            {money(
                                calculation.netPayable
                            )}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default PremiumCalculationSummary;