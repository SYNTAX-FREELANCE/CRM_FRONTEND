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

  const od = calculationData?.od_calculation || {};

  const calculation =
    calculationData?.calculation ||
    calculationData?.premium_calculation ||
    calculationData?.premium ||
    {};

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

  const findById = (items, id, field) =>
    (Array.isArray(items) ? items : []).find(
      (item) => Number(item?.[field]) === Number(id),
    );

  const getRate = (item) =>
    getNumber(
      item?.rate_value ??
        item?.slab_rate_value ??
        item?.master_rate_value ??
        item?.rate,
    );

  const getAmount = (item, idv, quantity = 1) => {
    const type = String(item?.rate_type || "FIXED").toUpperCase();
    const rate = getRate(item);

    if (type === "PERCENTAGE") {
      return (idv * rate) / 100;
    }

    if (type === "PER_UNIT") {
      return rate * quantity;
    }

    return rate;
  };

  const idv = getNumber(od.idv ?? formData.idv);

  // --------------------------------------------------
  // MASTER RULES
  // --------------------------------------------------

  const odRate = calculationData?.od_rate?.[0] || {};
  const tpRate = calculationData?.tp_rate?.[0] || {};
  const ncbRule = calculationData?.ncb_rule?.[0] || {};
  const discountRule = calculationData?.discount_rule?.[0] || {};
  const zdRule = calculationData?.zd?.[0] || {};
  const commissionRule = calculationData?.commission?.[0] || {};
  const cashbackRule = calculationData?.cashback?.[0] || {};
  const profitRule = calculationData?.profit?.[0] || {};

  const taxRules = Array.isArray(calculationData?.tax)
    ? calculationData.tax
    : [];

  // --------------------------------------------------
  // OD PREMIUM
  // --------------------------------------------------

  const basicOD = getNumber(od.basic_od_premium, getAmount(odRate, idv));

  const ncbPercentage = getNumber(
    od.ncb_percentage ??
      ncbRule.calculated_ncb_percentage ??
      ncbRule.ncb_percentage,
  );

  const ncbAmount = getNumber(od.ncb_amount, (basicOD * ncbPercentage) / 100);

  const odDiscount = getNumber(
    od.discount_amount,
    ((basicOD - ncbAmount) *
      getNumber(od.discount_percentage ?? discountRule.discount_value)) /
      100,
  );

  const netOD = getNumber(
    od.final_od_premium,
    Math.max(0, basicOD - ncbAmount - odDiscount),
  );

  const deTariffAmount = getNumber(
    calculation.de_tariff_amount ?? calculation.de_tariff,
  );

  // --------------------------------------------------
  // THIRD-PARTY PREMIUM
  // FIX: use rate_value, which is 16049 in your data.
  // Prefer the actual calculated TP amount if available.
  // --------------------------------------------------

  const tpCalculation = calculationData?.tp_calculation || {};

  const tpPremium = getNumber(
    tpCalculation.tp_premium ??
      tpCalculation.premium ??
      tpCalculation.amount ??
      calculation.tp_premium ??
      calculation.third_party_premium,
    getAmount(tpRate, idv),
  );

  // --------------------------------------------------
  // ADD-ONS
  // --------------------------------------------------

  const selectedAddonIds = (
    Array.isArray(formData.addon_ids) ? formData.addon_ids : []
  ).map(Number);

  const addons = (
    Array.isArray(calculationData?.addons) ? calculationData.addons : []
  )
    .filter((addon) => selectedAddonIds.includes(Number(addon.addon_id)))
    .map((addon) => {
      const calculated = findById(
        calculationData?.addon_calculations,
        addon.addon_id,
        "addon_id",
      );

      const rate = getRate(calculated || addon);

      const amount = getNumber(
        calculated?.amount ??
          calculated?.premium ??
          calculated?.addon_premium ??
          addon?.amount,
        getAmount(addon, idv),
      );

      return {
        addon_id: Number(addon.addon_id),
        rate,
        amount,
      };
    });

  const addonTotal = addons.reduce((sum, item) => sum + item.amount, 0);

  // --------------------------------------------------
  // COVERS
  // --------------------------------------------------

  const selectedCoverIds = (
    Array.isArray(formData.cover_ids) ? formData.cover_ids : []
  ).map(Number);

  const covers = (
    Array.isArray(calculationData?.covers) ? calculationData.covers : []
  )
    .filter((cover) => selectedCoverIds.includes(Number(cover.cover_id)))
    .map((cover) => {
      const calculated = findById(
        calculationData?.cover_calculations,
        cover.cover_id,
        "cover_id",
      );

      const source = calculated || cover;
      const rate = getRate(source);
      const type = String(
        source.rate_type || cover.rate_type || "FIXED",
      ).toUpperCase();

      const quantity = getNumber(
        calculated?.quantity ??
          cover?.quantity ??
          (type === "PER_UNIT" &&
          String(cover.cover_type).toUpperCase() === "PASSENGER"
            ? formData.seating_capacity
            : 1),
        1,
      );

      const amount = getNumber(
        calculated?.amount ??
          calculated?.premium ??
          calculated?.cover_premium ??
          cover?.amount,
        getAmount(source, idv, quantity),
      );

      return {
        cover_id: Number(cover.cover_id),
        quantity,
        rate,
        amount,
      };
    });

  const coverTotal = covers.reduce((sum, item) => sum + item.amount, 0);

  const findCoverAmount = (type) =>
    covers.reduce((sum, item) => {
      const master = findById(
        calculationData?.covers,
        item.cover_id,
        "cover_id",
      );

      const coverType = String(master?.cover_type || "").toUpperCase();

      const matches =
        type === "LIABILITY"
          ? ["LIABILITY", "LEGAL_LIABILITY"].includes(coverType)
          : coverType === type;

      return matches ? sum + item.amount : sum;
    }, 0);

  const cpaPremium = findCoverAmount("CPA");
  const liabilityPremium = findCoverAmount("LIABILITY");
  const passengerPremium = findCoverAmount("PASSENGER");

  // --------------------------------------------------
  // ZD PREMIUM
  // --------------------------------------------------

  const zdPremium = getNumber(
    calculation.zd_premium ??
      calculationData?.zd_calculation?.zd_premium ??
      calculationData?.zd_calculation?.premium,
  );

  // --------------------------------------------------
  // SUBTOTAL
  // --------------------------------------------------

  const subtotal = getNumber(
    calculation.subtotal,
    Math.max(
      0,
      netOD - deTariffAmount + tpPremium + addonTotal + coverTotal + zdPremium,
    ),
  );

  // --------------------------------------------------
  // TAX: calculate each configured tax against its
  // respective premium component.
  // --------------------------------------------------

  const taxBreakdown = taxRules.map((tax) => {
    const component = String(tax.premium_component || "").toUpperCase();

    const taxable =
      {
        OD: Math.max(0, netOD - deTariffAmount),
        TP: tpPremium,
        ADDON: addonTotal,
        COVER: coverTotal,
        ZD: zdPremium,
      }[component] ?? 0;

    const type = String(tax.tax_type || "PERCENTAGE").toUpperCase();

    const amount =
      type === "FIXED"
        ? getNumber(tax.tax_amount ?? tax.fixed_amount ?? tax.tax_value)
        : (taxable * getNumber(tax.tax_percentage)) / 100;

    return {
      tax_id: getId(tax.tax_id),
      tax_rule_id: getId(tax.tax_rule_id),
      component,
      amount,
    };
  });

  const gstAmount = getNumber(
    calculation.gst_amount,
    taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0),
  );

  const taxableAmount = getNumber(calculation.taxable_amount, subtotal);

  const totalPremium = getNumber(
    calculation.total_premium ?? calculation.final_premium,
    subtotal + gstAmount,
  );

  // --------------------------------------------------
  // COMMISSION
  // Commission is calculated on subtotal (before GST).
  // --------------------------------------------------

  const commissionType = String(
    commissionRule.commission_type || "",
  ).toUpperCase();

  const commissionValue = getNumber(commissionRule.commission_value);

  const maxCommissionAmount =
    commissionRule.max_commission_amount != null &&
    commissionRule.max_commission_amount !== ""
      ? Math.max(0, getNumber(commissionRule.max_commission_amount))
      : null;

  const commissionMinPremium =
    commissionRule.min_premium != null && commissionRule.min_premium !== ""
      ? getNumber(commissionRule.min_premium)
      : null;

  const commissionMaxPremium =
    commissionRule.max_premium != null && commissionRule.max_premium !== ""
      ? getNumber(commissionRule.max_premium)
      : null;

  const commissionEligible =
    (commissionMinPremium === null || subtotal >= commissionMinPremium) &&
    (commissionMaxPremium === null || subtotal <= commissionMaxPremium);

  let commissionAmount = 0;

  if (commissionEligible) {
    if (commissionType === "PERCENTAGE") {
      commissionAmount = (subtotal * commissionValue) / 100;
    } else if (commissionType === "FIXED") {
      commissionAmount = commissionValue;
    }
  }

  if (maxCommissionAmount !== null) {
    commissionAmount = Math.min(commissionAmount, maxCommissionAmount);
  }

  commissionAmount = Math.max(0, Number(commissionAmount.toFixed(2)));

  // --------------------------------------------------
  // FIXED PROFIT
  // --------------------------------------------------

  const profitAmount = Math.max(0, getNumber(profitRule.profit_amount));

  // --------------------------------------------------
  // CASHBACK
  //
  // Formula:
  // Cashback = Commission - Fixed Profit
  //
  // A manually entered cashback takes precedence.
  // Cashback percentage is NOT used in the formula.
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
    cashbackRule.min_premium != null && cashbackRule.min_premium !== ""
      ? getNumber(cashbackRule.min_premium)
      : null;

  const cashbackMaxPremium =
    cashbackRule.max_premium != null && cashbackRule.max_premium !== ""
      ? getNumber(cashbackRule.max_premium)
      : null;

  const cashbackEligible =
    (cashbackMinPremium === null || totalPremium >= cashbackMinPremium) &&
    (cashbackMaxPremium === null || totalPremium <= cashbackMaxPremium);

  const maxCashbackAmount =
    cashbackRule.max_cashback_amount != null &&
    cashbackRule.max_cashback_amount !== ""
      ? Math.max(0, getNumber(cashbackRule.max_cashback_amount))
      : null;

  let cashbackAmount = 0;

  if (hasManualCashback) {
    // Use manually entered cashback instead of the formula.
    cashbackAmount = Math.max(0, getNumber(manualCashbackValue));
  } else if (cashbackEligible) {
    // Calculate cashback from commission minus fixed profit.
    cashbackAmount = Math.max(0, commissionAmount - profitAmount);
  }

  // Apply cashback master cap, when configured.
  if (maxCashbackAmount !== null) {
    cashbackAmount = Math.min(cashbackAmount, maxCashbackAmount);
  }

  // Cashback cannot exceed the total premium.
  cashbackAmount = Math.min(
    totalPremium,
    Math.max(0, Number(cashbackAmount.toFixed(2))),
  );

  // --------------------------------------------------
  // FINAL NET PAYABLE
  // --------------------------------------------------

  const effectiveNetPayable = Number(
    Math.max(0, totalPremium - cashbackAmount).toFixed(2),
  );

  // --------------------------------------------------
  // IDs
  // --------------------------------------------------

  const customerId =
    getId(Customer?.customer_id) ?? getId(formData.customer_id);

  const vehicleId = getId(Vehicle?.vehicle_id) ?? getId(formData.vehicle_id);

  const taxId =
    getId(calculation.tax_id) ??
    getId(calculationData?.applied_tax?.tax_id) ??
    getId(taxRules[0]?.tax_id);

  // --------------------------------------------------
  // FINAL PAYLOAD
  // --------------------------------------------------

  return {
    quotation: {
      lead_id: lead?.lead_id ?? FetchedLead?.lead_id ?? null,
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
      previous_insurance_company_id: getId(
        formData.previous_insurance_company_id,
      ),
      previous_ncb_percentage: getId(formData.previous_ncb_percentage),

      claim_status: formData.claim_status || "NO_CLAIM",
      claim_count: getNumber(formData.claim_count),

      business_type_id: getId(formData.business_type_id),
      product_id: getId(formData.product_id),
      policy_type_id: getId(formData.policy_type_id),
      policy_term_id: getId(formData.policy_term_id),
    },

    options: [
      {
        insurance_company_id: getId(formData.insurance_company_id),

        option_number: 1,
        calculation_status: "CALCULATED",

        idv,
        basic_od: basicOD,
        od_discount: odDiscount,
        ncb_percentage: ncbPercentage,
        ncb_amount: ncbAmount,
        de_tariff_amount: deTariffAmount,
        net_od: netOD,

        // Use the resolved TP premium, not a missing
        // or incorrectly selected calculation property.
        tp_premium: tpPremium,

        zd_premium: zdPremium,
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

        final_premium: getNumber(calculation.final_premium, totalPremium),

        effective_net_payable: effectiveNetPayable,

        od_rate_id: getId(od.od_rate_id) ?? getId(odRate.od_rate_id),

        tp_rate_id: getId(tpCalculation.tp_rate_id) ?? getId(tpRate.tp_rate_id),

        ncb_rule_id: getId(ncbRule.ncb_rule_id),

        discount_rule_id:
          getId(od.discount_rule_id) ?? getId(discountRule.discount_rule_id),

        zd_rate_id:
          getId(calculation.zd_rate_id) ??
          getId(calculationData?.zd_calculation?.zd_rate_id) ??
          getId(zdRule.zd_rate_id),

        commission_rule_id:
          getId(calculation.commission_rule_id) ??
          getId(commissionRule.commission_rule_id),

        cashback_rule_id:
          getId(calculation.cashback_rule_id) ??
          getId(cashbackRule.cashback_rule_id),

        tax_id: taxId,

        covers,
        addons,
      },
    ],
  };
};

export default createQuotationPayload;
