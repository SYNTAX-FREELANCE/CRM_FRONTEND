
const createQuotationPayload = ({
    formData = {},
    calculationData = {},
    category = {},
    selectedCustomer = {},
    lead,
    createdBy,
}) => {
    const Customer = selectedCustomer?.customer || selectedCustomer || {};
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
        if (value === null || value === undefined || value === "") {
            return fallback;
        }

        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    };

    const getId = (value) => {
        if (value === null || value === undefined || value === "") {
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

    const getAmount = (item, baseAmount, quantity = 1) => {
        const rateType = getRateType(item);
        const rate = getRate(item);

        if (rateType === "PERCENTAGE") {
            return round((baseAmount * rate) / 100);
        }

        if (rateType === "PER_UNIT") {
            return round(rate * quantity);
        }

        return round(rate);
    };

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

    const odRate = calculationData.od_rate?.[0] || {};
    const tpRate = calculationData.tp_rate?.[0] || {};
    const ncbRule = calculationData.ncb_rule?.[0] || {};
    const discountRule = calculationData.discount_rule?.[0] || {};
    const commissionRule = calculationData.commission?.[0] || {};
    const cashbackRule = calculationData.cashback?.[0] || {};
    const profitRule = calculationData.profit?.[0] || {};

    // --------------------------------------------------
    // STEP 1: BASIC OD
    // --------------------------------------------------

    const odRateType = getRateType(odRate, "PERCENTAGE");
    const odRateValue = getRate(odRate);

    const calculatedBasicOD =
        odRateType === "FIXED"
            ? odRateValue
            : odRateType === "PERCENTAGE"
                ? (idv * odRateValue) / 100
                : 0;

    const basicOD = round(
        getNumber(od.basic_od_premium, calculatedBasicOD)
    );

    // --------------------------------------------------
    // STEP 2: IMT-23
    // Automatically included when the calculation API
    // returns the IMT-23 rule.
    // Calculated on BASIC OD, not IDV.
    // --------------------------------------------------

    const imt23Addon = allAddons.find(
        (item) =>
            String(item.addon_code || "").toUpperCase() === "IMT_23"
    );

    const imt23Selected = Boolean(imt23Addon);
    const imt23Rate = imt23Selected ? getRate(imt23Addon) : 0;

    const imt23Premium = imt23Selected
        ? round((basicOD * imt23Rate) / 100)
        : 0;

    const totalOD = round(basicOD + imt23Premium);

    // --------------------------------------------------
    // STEP 3: DE-TARIFF DISCOUNT
    // Apply the discount to TOTAL OD, including IMT-23.
    // --------------------------------------------------

    const suppliedDiscount =
        formData.de_tariff_discount !== undefined &&
        formData.de_tariff_discount !== null &&
        formData.de_tariff_discount !== ""
            ? formData.de_tariff_discount
            : (
                discountRule.discount_value ??
                discountRule.discount_percentage ??
                discountRule.rate_value
            );

    const deTariffDiscountPercentage = Math.min(
        100,
        Math.max(0, getNumber(suppliedDiscount))
    );

    const deTariffDiscountAmount = round(
        Math.min(
            totalOD,
            (totalOD * deTariffDiscountPercentage) / 100
        )
    );

    const odAfterDiscount = round(
        Math.max(0, totalOD - deTariffDiscountAmount)
    );

    // --------------------------------------------------
    // STEP 4: NCB
    // Apply NCB AFTER the DE tariff discount.
    //
    // When no DE tariff discount is applied, use the
    // backend NCB amount if it is available, matching
    // the preview's existing fallback behavior.
    // --------------------------------------------------

    const ncbPercentage = Math.min(
        100,
        Math.max(
            0,
            getNumber(
                od.ncb_percentage ??
                ncbRule.calculated_ncb_percentage ??
                ncbRule.ncb_percentage
            )
        )
    );

    const calculatedNCB = round(
        Math.min(
            odAfterDiscount,
            (odAfterDiscount * ncbPercentage) / 100
        )
    );

    const backendNCBAmount = getNumber(od.ncb_amount, NaN);

    const ncbAmount =
        deTariffDiscountPercentage === 0 &&
        Number.isFinite(backendNCBAmount)
            ? round(
                Math.min(
                    odAfterDiscount,
                    Math.max(0, backendNCBAmount)
                )
            )
            : calculatedNCB;

    const netOD = round(
        Math.max(0, odAfterDiscount - ncbAmount)
    );

    // --------------------------------------------------
    // STEP 5: OTHER SELECTED ADD-ONS
    // Exclude IMT-23 because it is already included in OD.
    // --------------------------------------------------

    const selectedAddons = allAddons
        .filter(
            (item) =>
                selectedAddonIds.includes(Number(item.addon_id)) &&
                String(item.addon_code || "").toUpperCase() !== "IMT_23"
        )
        .map((item) => {
            const addonCode = String(
                item.addon_code || ""
            ).toUpperCase();

            const isZeroDep = ["ZD", "ZERO_DEP"].includes(addonCode);

            const rateType = getRateType(item, "PERCENTAGE");
            const rate = getRate(item);

            const calculationBasis = String(
                item.calculation_basis ||
                (isZeroDep ? "BASIC_OD" : "IDV")
            ).toUpperCase();

            let baseAmount = idv;

            if (calculationBasis === "BASIC_OD") {
                baseAmount = basicOD;
            } else if (calculationBasis === "TOTAL_OD") {
                baseAmount = totalOD;
            } else if (calculationBasis === "NET_OD") {
                baseAmount = netOD;
            }

            const quantity =
                rateType === "PER_UNIT"
                    ? getNumber(item.quantity ?? item.units ?? 1, 1)
                    : 1;

            let originalAmount = 0;

            if (rateType === "PERCENTAGE") {
                originalAmount = round((baseAmount * rate) / 100);
            } else if (rateType === "PER_UNIT") {
                originalAmount = round(rate * quantity);
            } else {
                originalAmount = round(rate);
            }

            const discountType = String(
                item.discount_type || "NONE"
            ).toUpperCase();

            const discountValue = Math.max(
                0,
                getNumber(item.discount_value)
            );

            const configuredMaxDiscount = getNumber(
                item.max_discount_value
            );

            let discountAmount = 0;

            if (discountType === "PERCENTAGE") {
                discountAmount =
                    (originalAmount * discountValue) / 100;
            } else if (discountType === "FIXED") {
                discountAmount = discountValue;
            }

            if (configuredMaxDiscount > 0) {
                discountAmount = Math.min(
                    discountAmount,
                    configuredMaxDiscount
                );
            }

            discountAmount = round(
                Math.min(
                    originalAmount,
                    Math.max(0, discountAmount)
                )
            );

            return {
                addon_id: Number(item.addon_id),
                rate,
                rate_type: rateType,
                calculation_basis: calculationBasis,
                quantity,
                original_amount: round(originalAmount),
                discount_type: discountType,
                discount_value: discountValue,
                discount_amount: discountAmount,
                amount: round(
                    Math.max(0, originalAmount - discountAmount)
                ),
            };
        });

    // Save IMT-23 in the add-on list for traceability.
    // Its amount is NOT added to addonTotal because it is
    // already included in totalOD and netOD.
    const imt23PayloadAddon = imt23Selected
        ? {
            addon_id: Number(imt23Addon.addon_id),
            rate: imt23Rate,
            rate_type: getRateType(imt23Addon, "PERCENTAGE"),
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
        ...selectedAddons,
    ];

    const addonTotal = round(
        selectedAddons.reduce(
            (sum, item) => sum + getNumber(item.amount),
            0
        )
    );

    // --------------------------------------------------
    // STEP 6: THIRD-PARTY PREMIUM
    // --------------------------------------------------

    const tpRateType = getRateType(tpRate, "FIXED");
    const tpRateValue = getRate(tpRate);

    const calculatedTP =
        tpRateType === "PERCENTAGE"
            ? (idv * tpRateValue) / 100
            : tpRateType === "FIXED"
                ? tpRateValue
                : 0;

    const tpPremium = round(
        getNumber(
            tpCalculation.tp_premium ??
            tpCalculation.premium ??
            tpCalculation.amount ??
            calculation.tp_premium ??
            calculation.third_party_premium,
            calculatedTP
        )
    );

    // --------------------------------------------------
    // STEP 7: ADDITIONAL COVERS
    // --------------------------------------------------

    const seatingCapacity = getNumber(formData.seating_capacity);

    const covers = allCovers
        .filter((cover) =>
            selectedCoverIds.includes(Number(cover.cover_id))
        )
        .map((cover) => {
            const rateType = getRateType(cover, "FIXED");
            const rate = getRate(cover);

            const quantity =
                rateType === "PER_UNIT" ? seatingCapacity : 1;

            const pending =
                rateType === "PER_UNIT" && seatingCapacity <= 0;

            const amount = pending
                ? 0
                : getAmount(
                    { ...cover, rate_value: rate },
                    idv,
                    quantity
                );

            return {
                cover_id: Number(cover.cover_id),
                quantity,
                rate,
                rate_type: rateType,
                amount,
                pending,
            };
        });

    const coverTotal = round(
        covers.reduce((sum, item) => sum + item.amount, 0)
    );

    const findCoverAmount = (type) =>
        round(
            covers.reduce((sum, item) => {
                const master = allCovers.find(
                    (cover) =>
                        Number(cover.cover_id) === Number(item.cover_id)
                );

                const coverType = String(
                    master?.cover_type || ""
                ).toUpperCase();

                const matches =
                    type === "LIABILITY"
                        ? ["LIABILITY", "LEGAL_LIABILITY"].includes(coverType)
                        : coverType === type;

                return matches ? sum + item.amount : sum;
            }, 0)
        );

    const cpaPremium = findCoverAmount("CPA");
    const liabilityPremium = findCoverAmount("LIABILITY");
    const passengerPremium = findCoverAmount("PASSENGER");

    // --------------------------------------------------
    // STEP 8: SUBTOTAL
    // --------------------------------------------------

    const subtotal = round(
        Math.max(
            0,
            netOD + addonTotal + tpPremium + coverTotal
        )
    );

    // --------------------------------------------------
    // STEP 9: TAX
    // --------------------------------------------------

    const taxBreakdown = taxRules.map((tax) => {
        const component = String(
            tax.premium_component || ""
        ).toUpperCase();

        const taxableAmountForComponent =
            {
                OD: netOD,
                TP: tpPremium,
                ADDON: addonTotal,
                COVER: coverTotal,
            }[component] ?? 0;

        const taxType = String(
            tax.tax_type || "PERCENTAGE"
        ).toUpperCase();

        const taxPercentage = getNumber(tax.tax_percentage);

        const amount = round(
            taxType === "FIXED"
                ? getNumber(
                    tax.tax_amount ??
                    tax.fixed_amount ??
                    tax.tax_value
                )
                : taxType === "PERCENTAGE"
                    ? (taxableAmountForComponent * taxPercentage) / 100
                    : 0
        );

        return {
            tax_id: getId(tax.tax_id),
            tax_rule_id: getId(tax.tax_rule_id),
            component,
            taxable_amount: round(taxableAmountForComponent),
            tax_type: taxType,
            tax_percentage: taxPercentage,
            amount,
        };
    });

    const totalTax = round(
        taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0)
    );

    const gstAmount = round(
        taxBreakdown.reduce((sum, tax) => {
            const master = taxRules.find(
                (item) =>
                    Number(item.tax_id) === Number(tax.tax_id) &&
                    String(item.premium_component || "").toUpperCase() ===
                    tax.component
            );

            return String(master?.tax_code || "").startsWith("GST_")
                ? sum + tax.amount
                : sum;
        }, 0)
    );

    const taxableAmount = subtotal;
    const totalPremium = round(subtotal + totalTax);

    // --------------------------------------------------
    // STEP 10: COMMISSION
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
                getNumber(commissionRule.max_commission_amount)
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
        (commissionMinPremium === null ||
            subtotal >= commissionMinPremium) &&
        (commissionMaxPremium === null ||
            subtotal <= commissionMaxPremium);

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

    commissionAmount = round(Math.max(0, commissionAmount));

    // --------------------------------------------------
    // STEP 11: PROFIT
    // --------------------------------------------------

    const profitAmount = round(
        Math.max(0, getNumber(profitRule.profit_amount))
    );

    // --------------------------------------------------
    // STEP 12: CASHBACK
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
        (cashbackMinPremium === null ||
            totalPremium >= cashbackMinPremium) &&
        (cashbackMaxPremium === null ||
            totalPremium <= cashbackMaxPremium);

    const maxCashbackAmount =
        cashbackRule.max_cashback_amount != null &&
        cashbackRule.max_cashback_amount !== ""
            ? Math.max(
                0,
                getNumber(cashbackRule.max_cashback_amount)
            )
            : null;

    let cashbackAmount = 0;

    if (hasManualCashback) {
        cashbackAmount = Math.max(
            0,
            getNumber(manualCashbackValue)
        );
    } else if (cashbackEligible) {
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
        Math.min(totalPremium, Math.max(0, cashbackAmount))
    );

    const effectiveNetPayable = round(
        Math.max(0, totalPremium - cashbackAmount)
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
            registration_date: formData.registration_date || null,
            policy_start_date: formData.policy_start_date || null,
            policy_end_date: formData.policy_end_date || null,

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

            previous_policy_id: getId(formData.previous_policy_id),
            previous_insurance_company_id:
                getId(formData.previous_insurance_company_id),

            previous_ncb_percentage:
                getId(formData.previous_ncb_percentage),

            claim_status: formData.claim_status || "NO_CLAIM",
            claim_count: getNumber(formData.claim_count),

            business_type_id: getId(formData.business_type_id),
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
                basic_od: basicOD,
                total_od: totalOD,

                od_discount: deTariffDiscountAmount,
                ncb_percentage: ncbPercentage,
                ncb_amount: ncbAmount,
                de_tariff_amount: deTariffDiscountAmount,
                net_od: netOD,

                imt23_premium: imt23Premium,
                tp_premium: tpPremium,

                zd_premium: round(
                    selectedAddons.reduce((sum, item) => {
                        const master = allAddons.find(
                            (addon) =>
                                Number(addon.addon_id) ===
                                Number(item.addon_id)
                        );

                        return ["ZD", "ZERO_DEP"].includes(
                            String(master?.addon_code || "").toUpperCase()
                        )
                            ? sum + getNumber(item.amount)
                            : sum;
                    }, 0)
                ),

                addon_premium: addonTotal,

                cpa_premium: cpaPremium,
                liability_premium: liabilityPremium,
                passenger_premium: passengerPremium,

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
                    getId(odRate.od_rate_id),

                tp_rate_id:
                    getId(tpCalculation.tp_rate_id) ??
                    getId(tpRate.tp_rate_id),

                ncb_rule_id: getId(ncbRule.ncb_rule_id),

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
