
const createQuotationPayload = ({
    formData = {},
    calculationData = {},
    category = {},
    selectedCustomer = {},
    coverInputValues = {},
    lead,
    createdBy,
}) => {
    const Customer =
        selectedCustomer?.customer || selectedCustomer || {};

    const FetchedLead = selectedCustomer?.leads?.[0] || {};

    const Vehicle =
        selectedCustomer?.vehicles?.[0] ||
        selectedCustomer?.vehicle ||
        selectedCustomer ||
        {};

    // --------------------------------------------------
    // HELPERS
    // --------------------------------------------------

    const round = (value) =>
        Number((Number(value) || 0).toFixed(2));

    const getNumber = (value, fallback = 0) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return fallback;
        }

        const number = Number(value);

        return Number.isFinite(number) ? number : fallback;
    };

    const getId = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return null;
        }

        const number = Number(value);

        return Number.isFinite(number) ? number : null;
    };

    const getArray = (value) =>
        Array.isArray(value) ? value : [];

    const getRate = (item) =>
        getNumber(
            item?.slab_rate_value ??
            item?.rate_value ??
            item?.master_rate_value ??
            item?.rate
        );

    const getRateType = (item, fallback = "FIXED") =>
        String(item?.rate_type || fallback).toUpperCase();

    const selectedAddonIds = getArray(formData.addon_ids).map(Number);
    const selectedCoverIds = getArray(formData.cover_ids).map(Number);

    const allAddons = getArray(calculationData.addons);
    const allCovers = getArray(calculationData.covers);
    const taxRules = getArray(calculationData.tax);

    const od = calculationData.od_calculation || {};

    const calculation =
        calculationData.calculation ||
        calculationData.premium_calculation ||
        calculationData.premium ||
        {};

    const tpCalculation = calculationData.tp_calculation || {};

    const idv = getNumber(od.idv ?? formData.idv);

    // --------------------------------------------------
    // MASTER RULES
    // --------------------------------------------------

    const odRule = calculationData.od_rate?.[0] || {};
    const tpRule = calculationData.tp_rate?.[0] || {};
    const ncbRule = calculationData.ncb_rule?.[0] || {};
    const discountRule = calculationData.discount_rule?.[0] || {};
    const commissionRule = calculationData.commission?.[0] || {};
    const cashbackRule = calculationData.cashback?.[0] || {};
    const profitRule = calculationData.profit?.[0] || {};

    // --------------------------------------------------
    // STEP 1: BASIC OD
    // Matches PremiumCalculationSummary
    // --------------------------------------------------

    const odRateType = String(
        odRule.rate_type || "PERCENTAGE"
    ).toUpperCase();

    const odRateValue = getRate(odRule);

    const calculatedBasicOD =
        odRateType === "PERCENTAGE"
            ? (idv * odRateValue) / 100
            : odRateType === "FIXED"
                ? odRateValue
                : 0;

    const basicOD = getNumber(
        od.basic_od_premium,
        calculatedBasicOD
    );

    // --------------------------------------------------
    // STEP 2: IMT-23
    // Always included when returned by the calculation API
    // IMT-23 = Basic OD x IMT-23 percentage
    // --------------------------------------------------

    const imt23Addon = allAddons.find(
        (item) =>
            String(item.addon_code || "").toUpperCase() ===
            "IMT_23"
    );

    const imt23Selected = Boolean(imt23Addon);

    const imt23Rate = imt23Addon
        ? getNumber(imt23Addon.rate_value, 15)
        : 0;

    const imt23Premium = imt23Addon
        ? round((basicOD * imt23Rate) / 100)
        : 0;

    const totalOD = round(basicOD + imt23Premium);

    // --------------------------------------------------
    // STEP 3: SELECTED ADD-ONS AND THEIR DISCOUNTS
    // Matches PremiumCalculationSummary:
    // ZD percentage basis = Basic OD
    // Other percentage add-ons = IDV
    // IMT-23 excluded from the add-on total
    // --------------------------------------------------

    const selectedAddons = allAddons.filter(
        (item) =>
            String(item.addon_code || "").toUpperCase() ===
                "IMT_23" ||
            selectedAddonIds.includes(Number(item.addon_id))
    );

    const addonDetails = selectedAddons.map((item) => {
        const addonCode = String(
            item.addon_code || ""
        ).toUpperCase();

        const isIMT23 = addonCode === "IMT_23";

        const rateType = String(
            item.rate_type || "PERCENTAGE"
        ).toUpperCase();

        const rateValue = getNumber(item.rate_value);

        const calculationBasis = String(
            item.calculation_basis ||
            (
                addonCode === "ZD" || isIMT23
                    ? "BASIC_OD"
                    : "IDV"
            )
        ).toUpperCase();

        let originalAmount = 0;

        if (rateType === "FIXED") {
            originalAmount = rateValue;
        } else if (rateType === "PERCENTAGE") {
            const baseAmount =
                calculationBasis === "BASIC_OD"
                    ? basicOD
                    : idv;

            originalAmount = (baseAmount * rateValue) / 100;
        }

        originalAmount = round(originalAmount);

        const discountType = String(
            item.discount_type || "NONE"
        ).toUpperCase();

        const discountValue = Math.max(
            0,
            getNumber(item.discount_value)
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
                ? getNumber(item.max_discount_value)
                : 0;

        if (maxDiscountValue > 0) {
            discountAmount = Math.min(
                discountAmount,
                maxDiscountValue
            );
        }

        discountAmount = round(
            Math.min(
                Math.max(discountAmount, 0),
                originalAmount
            )
        );

        const calculatedAmount = round(
            Math.max(0, originalAmount - discountAmount)
        );

        return {
            ...item,
            addon_id: Number(item.addon_id),
            rate: rateValue,
            rate_type: rateType,
            calculation_basis: calculationBasis,
            original_amount: originalAmount,
            discount_type: discountType,
            discount_value: discountValue,
            discount_amount: discountAmount,
            calculated_amount: calculatedAmount,
            amount: calculatedAmount,
            is_imt23: isIMT23,
        };
    });

    // IMT-23 is already included in Total OD.
    const otherAddonDetails = addonDetails.filter(
        (item) => !item.is_imt23
    );

    const addonTotal = round(
        otherAddonDetails.reduce(
            (sum, item) =>
                sum + getNumber(item.calculated_amount),
            0
        )
    );

    // Match the summary's ZD selection and discounted amount.
    const zdAddon = addonDetails.find(
        (item) =>
            String(item.addon_code || "").toUpperCase() === "ZD"
    );

    const zdAmount = round(
        getNumber(zdAddon?.calculated_amount)
    );

    // --------------------------------------------------
    // STEP 4: DE-TARIFF DISCOUNT
    // Applied to Total OD (Basic OD + IMT-23)
    // --------------------------------------------------

    const formDiscountValue = formData.de_tariff_discount;

    const deTariffDiscountPercentage = Math.min(
        100,
        Math.max(
            0,
            getNumber(
                formDiscountValue !== undefined &&
                    formDiscountValue !== null &&
                    formDiscountValue !== ""
                    ? formDiscountValue
                    : (
                        discountRule.discount_value ??
                        discountRule.discount_percentage ??
                        discountRule.rate_value ??
                        0
                    )
            )
        )
    );

    const deTariffDiscountAmount = round(
        Math.min(
            totalOD,
            (totalOD * deTariffDiscountPercentage) / 100
        )
    );

    // --------------------------------------------------
    // STEP 5: OD AFTER DE-TARIFF DISCOUNT
    // --------------------------------------------------

    const odAfterDiscount = round(
        Math.max(0, totalOD - deTariffDiscountAmount)
    );

    // --------------------------------------------------
    // STEP 6: NCB
    //
    // NCB base = Total OD + discounted ZD - de-tariff discount
    // NCB amount = NCB base x NCB percentage
    // Do not use backend ncb_amount.
    // --------------------------------------------------

    const ncbPercentage = Math.min(
        100,
        Math.max(
            0,
            getNumber(
                od.ncb_percentage ??
                ncbRule.calculated_ncb_percentage ??
                ncbRule.ncb_percentage ??
                0
            )
        )
    );

    const ncbBaseAmount = round(
        Math.max(
            0,
            totalOD + zdAmount - deTariffDiscountAmount
        )
    );

    const ncbAmount = round(
        Math.min(
            ncbBaseAmount,
            (ncbBaseAmount * ncbPercentage) / 100
        )
    );

    // Final Net OD matches the summary exactly.
    // const netOD = round(
    //     Math.max(0, odAfterDiscount - ncbAmount)
    // );

     const netOD = Number(
            (odAfterDiscount - ncbAmount).toFixed(2)
        );
    // --------------------------------------------------
    // STEP 7: THIRD-PARTY PREMIUM
    // Matches PremiumCalculationSummary's TP rate formula.
    // --------------------------------------------------

    const tpRateType = String(
        tpRule.rate_type || "FIXED"
    ).toUpperCase();

    const tpRateValue = getRate(tpRule);

    const calculatedTP =
        tpRateType === "PERCENTAGE"
            ? (idv * tpRateValue) / 100
            : tpRateType === "FIXED"
                ? tpRateValue
                : 0;

    const tpPremium = round(
        tpRule
            ? calculatedTP
            : getNumber(
                tpCalculation.tp_premium ??
                tpCalculation.premium ??
                tpCalculation.amount ??
                calculation.tp_premium ??
                calculation.third_party_premium
            )
    );

    // --------------------------------------------------
    // STEP 8: ADDITIONAL COVERS
    // Use the entered units for PER_UNIT covers.
    // Fall back to seating capacity only if not entered.
    // --------------------------------------------------

    const seatingCapacity = getNumber(
        formData.seating_capacity
    );

    const covers = allCovers
        .filter((item) =>
            selectedCoverIds.includes(Number(item.cover_id))
        )
        .map((item) => {
            const coverId = Number(item.cover_id);

            const rateType = String(
                item.rate_type || "FIXED"
            ).toUpperCase();

            const rateValue = getNumber(item.rate_value);

            const enteredUnits =
                coverInputValues?.[coverId] ??
                coverInputValues?.[String(coverId)];

            const hasEnteredUnits =
                enteredUnits !== undefined &&
                enteredUnits !== null &&
                enteredUnits !== "";

            const quantity =
                rateType === "PER_UNIT"
                    ? getNumber(
                        hasEnteredUnits
                            ? enteredUnits
                            : seatingCapacity
                    )
                    : 1;

            const pending =
                rateType === "PER_UNIT" && quantity <= 0;

            let amount = 0;

            if (!pending) {
                if (rateType === "FIXED") {
                    amount = rateValue;
                } else if (rateType === "PERCENTAGE") {
                    amount = (idv * rateValue) / 100;
                } else if (rateType === "PER_UNIT") {
                    amount = rateValue * quantity;
                }
            }

            return {
                cover_id: coverId,
                quantity,
                rate: rateValue,
                rate_type: rateType,
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

    const findCoverAmount = (type) =>
        round(
            covers.reduce((sum, item) => {
                const master = allCovers.find(
                    (cover) =>
                        Number(cover.cover_id) ===
                        Number(item.cover_id)
                );

                const coverType = String(
                    master?.cover_type || ""
                ).toUpperCase();

                const matches =
                    type === "LIABILITY"
                        ? [
                            "LIABILITY",
                            "LEGAL_LIABILITY",
                        ].includes(coverType)
                        : coverType === type;

                return matches && !item.pending
                    ? sum + item.amount
                    : sum;
            }, 0)
        );

    const cpaPremium = findCoverAmount("CPA");
    const liabilityPremium = findCoverAmount("LIABILITY");
    const passengerPremium = findCoverAmount("PASSENGER");

    // --------------------------------------------------
    // STEP 9: SUBTOTALS
    // Match the summary's formulas.
    // --------------------------------------------------

    const subtotalBeforeDiscount = round(
        Math.max(
            0,
            totalOD -
                ncbAmount +
                addonTotal +
                tpPremium +
                coverTotal
        )
    );

    const subtotal = round(
        Math.max(
            0,
            netOD +
                addonTotal +
                tpPremium +
                coverTotal
        )
    );

    // --------------------------------------------------
    // STEP 10: COMPONENT-WISE TAX
    // --------------------------------------------------

    const taxBreakdown = taxRules.map((tax) => {
        const component = String(
            tax.premium_component || ""
        ).toUpperCase();

        const taxableAmount =
            {
                OD: netOD,
                TP: tpPremium,
                ADDON: addonTotal,
                COVER: coverTotal,
            }[component] ?? 0;

        const taxType = String(
            tax.tax_type || "PERCENTAGE"
        ).toUpperCase();

        const taxPercentage = getNumber(
            tax.tax_percentage
        );

        const amount = round(
            taxType === "FIXED"
                ? getNumber(
                    tax.tax_amount ??
                    tax.fixed_amount ??
                    tax.tax_value
                )
                : taxType === "PERCENTAGE"
                    ? (taxableAmount * taxPercentage) / 100
                    : 0
        );

        return {
            tax_id: getId(tax.tax_id),
            tax_rule_id: getId(tax.tax_rule_id),
            component,
            taxable_amount: round(taxableAmount),
            tax_type: taxType,
            tax_percentage: taxPercentage,
            amount,
        };
    });

    const totalTax = round(
        taxBreakdown.reduce(
            (sum, tax) => sum + tax.amount,
            0
        )
    );

    const gstAmount = round(
        taxBreakdown.reduce((sum, tax) => {
            const master = taxRules.find(
                (item) =>
                    Number(item.tax_id) === Number(tax.tax_id) &&
                    String(
                        item.premium_component || ""
                    ).toUpperCase() === tax.component
            );

            return String(
                master?.tax_code || ""
            ).startsWith("GST_")
                ? sum + tax.amount
                : sum;
        }, 0)
    );

    const taxableAmount = subtotal;
    const totalPremium = round(subtotal + totalTax);

    // --------------------------------------------------
    // STEP 11: COMMISSION
    // --------------------------------------------------

    const commissionType = String(
        commissionRule.commission_type || ""
    ).toUpperCase();

    const commissionValue = getNumber(
        commissionRule.commission_value
    );

    const maxCommissionAmount =
        commissionRule.max_commission_amount != null &&
            commissionRule.max_commission_amount !== ""
            ? Math.max(
                0,
                getNumber(
                    commissionRule.max_commission_amount
                )
            )
            : null;

    const commissionMinPremium =
        commissionRule.min_premium != null &&
            commissionRule.min_premium !== ""
            ? getNumber(commissionRule.min_premium)
            : null;

    const commissionMaxPremium =
        commissionRule.max_premium != null &&
            commissionRule.max_premium !== ""
            ? getNumber(commissionRule.max_premium)
            : null;

    const commissionEligible =
        (!commissionMinPremium ||
            subtotal >= commissionMinPremium) &&
        (
            commissionMaxPremium === null ||
            subtotal <= commissionMaxPremium
        );

    let commissionAmount = 0;

    if (commissionEligible) {
        if (commissionType === "PERCENTAGE") {
            commissionAmount =
                (subtotal * commissionValue) / 100;
        } else if (commissionType === "FIXED") {
            commissionAmount = commissionValue;
        }
    }

    if (maxCommissionAmount !== null) {
        commissionAmount = Math.min(
            commissionAmount,
            maxCommissionAmount
        );
    }

    commissionAmount = round(
        Math.max(0, commissionAmount)
    );

    // --------------------------------------------------
    // STEP 12: PROFIT
    // --------------------------------------------------

    const profitAmount = round(
        Math.max(
            0,
            getNumber(profitRule.profit_amount)
        )
    );

    // --------------------------------------------------
    // STEP 13: CASHBACK
    // --------------------------------------------------

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
        cashbackRule.min_premium != null &&
            cashbackRule.min_premium !== ""
            ? getNumber(cashbackRule.min_premium)
            : null;

    const cashbackMaxPremium =
        cashbackRule.max_premium != null &&
            cashbackRule.max_premium !== ""
            ? getNumber(cashbackRule.max_premium)
            : null;

    const cashbackEligible =
        (!cashbackMinPremium ||
            totalPremium >= cashbackMinPremium) &&
        (
            cashbackMaxPremium === null ||
            totalPremium <= cashbackMaxPremium
        );

    const maxCashbackAmount =
        cashbackRule.max_cashback_amount != null &&
            cashbackRule.max_cashback_amount !== ""
            ? Math.max(
                0,
                getNumber(
                    cashbackRule.max_cashback_amount
                )
            )
            : null;

    let cashbackAmount = 0;

    if (hasManualCashback) {
        cashbackAmount = Math.max(
            0,
            getNumber(manualCashbackValue)
        );
    } else if (cashbackRule && cashbackEligible) {
        cashbackAmount = Math.max(
            0,
            commissionAmount - profitAmount
        );
    }

    if (maxCashbackAmount !== null) {
        cashbackAmount = Math.min(
            cashbackAmount,
            maxCashbackAmount
        );
    }

    cashbackAmount = round(
        Math.min(
            totalPremium,
            Math.max(0, cashbackAmount)
        )
    );

    const effectiveNetPayable = round(
        Math.max(
            0,
            totalPremium - cashbackAmount
        )
    );

    // --------------------------------------------------
    // IDS
    // --------------------------------------------------

    const customerId =
        getId(Customer.customer_id) ??
        getId(formData.customer_id);

    const vehicleId =
        getId(Vehicle.vehicle_id) ??
        getId(formData.vehicle_id);

    const taxId =
        getId(calculation.tax_id) ??
        getId(calculationData.applied_tax?.tax_id) ??
        getId(taxRules[0]?.tax_id);

    // --------------------------------------------------
    // FINAL PAYLOAD
    // --------------------------------------------------

    const imt23PayloadAddon = imt23Selected
        ? {
            addon_id: Number(imt23Addon.addon_id),
            rate: imt23Rate,
            rate_type: getRateType(
                imt23Addon,
                "PERCENTAGE"
            ),
            calculation_basis: "BASIC_OD",
            quantity: 1,
            original_amount: imt23Premium,
            discount_type: "NONE",
            discount_value: 0,
            discount_amount: 0,
            amount: imt23Premium,
        }
        : null;

    const addons = [
        ...(imt23PayloadAddon ? [imt23PayloadAddon] : []),
        ...otherAddonDetails.map((item) => ({
            addon_id: item.addon_id,
            rate: getNumber(item.rate),
            rate_type: item.rate_type,
            calculation_basis: item.calculation_basis,
            quantity: 1,
            original_amount: round(item.original_amount),
            discount_type: item.discount_type,
            discount_value: getNumber(item.discount_value),
            discount_amount: round(item.discount_amount),
            amount: round(item.calculated_amount),
        })),
    ];

    return {
        quotation: {
            lead_id:
                lead?.lead_id ??
                FetchedLead?.lead_id ??
                null,

            customer_id: customerId,
            vehicle_id: vehicleId,
            status: "CALCULATED",
            created_by: getId(createdBy),
        },

        input: {
            registration_date:
                formData.registration_date || null,

            policy_start_date:
                formData.policy_start_date || null,

            policy_end_date:
                formData.policy_end_date || null,

            vehicle_type_id: getId(category.vehicle_type_id),
            vehicle_category_id: getId(category.vehicle_category_id),
            vehicle_class_id: getId(formData.vehicle_class_id),
            fuel_type_id: getId(formData.fuel_type_id),
            usage_id: getId(formData.usage_id),

            engine_cc: getId(formData.engine_cc),
            gvw: getId(formData.gvw),
            seating_capacity: getId(formData.seating_capacity),

            vehicle_age_months:
                calculationData.vehicle_age_months ??
                od.vehicle_age_months ??
                calculation.vehicle_age_months ??
                null,

            idv,

            previous_policy_id:
                getId(formData.previous_policy_id),

            previous_insurance_company_id:
                getId(formData.previous_insurance_company_id),

            previous_ncb_percentage:
                getId(formData.previous_ncb_percentage),

            claim_status:
                formData.claim_status || "NO_CLAIM",

            claim_count: getNumber(formData.claim_count),

            business_type_id:
                getId(formData.business_type_id),

            product_id: getId(formData.product_id),
            policy_type_id: getId(formData.policy_type_id),
            policy_term_id: getId(formData.policy_term_id),
        },

        options: [
            {
                insurance_company_id:
                    getId(formData.insurance_company_id),

                option_number: 1,
                calculation_status: "CALCULATED",

                idv,
                basic_od: round(basicOD),
                total_od: totalOD,

                od_discount: deTariffDiscountAmount,
                de_tariff_amount: deTariffDiscountAmount,

                ncb_percentage: ncbPercentage,
                ncb_base_amount: ncbBaseAmount,
                ncb_amount: ncbAmount,

                od_after_discount: odAfterDiscount,
                net_od: netOD,

                imt23_premium: imt23Premium,

                tp_premium: tpPremium,

                zd_premium: zdAmount,

                addon_premium: addonTotal,

                cpa_premium: cpaPremium,
                liability_premium: liabilityPremium,
                passenger_premium: passengerPremium,

                subtotal_before_discount: subtotalBeforeDiscount,
                subtotal,

                commission_amount: commissionAmount,
                cashback_amount: cashbackAmount,

                taxable_amount: taxableAmount,
                gst_amount: gstAmount,

                total_premium: totalPremium,
                final_premium: totalPremium,
                effective_net_payable: effectiveNetPayable,

                od_rate_id:
                    getId(od.od_rate_id) ??
                    getId(odRule.od_rate_id),

                tp_rate_id:
                    getId(tpCalculation.tp_rate_id) ??
                    getId(tpRule.tp_rate_id),

                ncb_rule_id:
                    getId(ncbRule.ncb_rule_id),

                discount_rule_id:
                    getId(od.discount_rule_id) ??
                    getId(discountRule.discount_rule_id),

                commission_rule_id:
                    getId(commissionRule.commission_rule_id),

                cashback_rule_id:
                    getId(cashbackRule.cashback_rule_id),

                tax_id: taxId,

                covers,
                addons,
                tax_breakdown: taxBreakdown,
            },
        ],
    };
};

export default createQuotationPayload;