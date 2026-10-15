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

  const getRate = (item) =>
    getNumber(
      item?.slab_rate_value ??
        item?.rate_value ??
        item?.master_rate_value ??
        item?.rate
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
  const commissionRule = calculationData?.commission?.[0] || {};
  const cashbackRule = calculationData?.cashback?.[0] || {};
  const profitRule = calculationData?.profit?.[0] || {};

  const taxRules = Array.isArray(calculationData?.tax)
    ? calculationData.tax
    : [];

  // --------------------------------------------------
  // STEP 01: BASIC OD
  // --------------------------------------------------

  const odRateType = String(
    odRate.rate_type || "PERCENTAGE"
  ).toUpperCase();

  const odRateValue = getRate(odRate);

  const calculatedBasicOD =
    odRateType === "FIXED"
      ? odRateValue
      : (idv * odRateValue) / 100;

  const basicOD = round(
    getNumber(od.basic_od_premium, calculatedBasicOD)
  );

  // --------------------------------------------------
  // STEP 02: SELECTED ADD-ONS
  // --------------------------------------------------

  const selectedAddonIds = (
    Array.isArray(formData.addon_ids)
      ? formData.addon_ids
      : []
  ).map(Number);

  const allAddons = Array.isArray(calculationData?.addons)
    ? calculationData.addons
    : [];

  // --------------------------------------------------
  // STEP 03: IMT-23
  // IMT-23 is included in Total OD only once.
  // --------------------------------------------------

  const imt23Addon = allAddons.find(
    (item) =>
      String(item.addon_code || "").toUpperCase() === "IMT_23"
  );

  const imt23Selected = Boolean(
    imt23Addon &&
      selectedAddonIds.includes(Number(imt23Addon.addon_id))
  );

  const imt23Rate = imt23Selected
    ? getRate(imt23Addon)
    : 0;

  const imt23Premium = imt23Selected
    ? round((basicOD * imt23Rate) / 100)
    : 0;

  const totalOD = round(
    basicOD + imt23Premium
  );

  // --------------------------------------------------
  // STEP 04: DE TARIFF DISCOUNT
  // Calculated on Total OD.
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
              discountRule.rate_value
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

  const odAfterDiscount = round(
    Math.max(0, totalOD - deTariffDiscountAmount)
  );

  // --------------------------------------------------
  // STEP 05: NCB
  // Calculated on OD after DE Tariff Discount.
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

  const ncbAmount = round(
    Math.min(
      odAfterDiscount,
      Math.max(
        0,
        od.ncb_amount != null &&
          deTariffDiscountPercentage === 0
          ? getNumber(od.ncb_amount)
          : (odAfterDiscount * ncbPercentage) / 100
      )
    )
  );

  // --------------------------------------------------
  // STEP 06: FINAL NET OD
  // --------------------------------------------------

  const calculatedNetOD = round(
    Math.max(
      0,
      odAfterDiscount - ncbAmount
    )
  );

  const netOD = round(
    imt23Premium === 0 &&
      deTariffDiscountPercentage === 0 &&
      od.final_od_premium != null
      ? getNumber(od.final_od_premium)
      : calculatedNetOD
  );

  // --------------------------------------------------
  // STEP 07: OTHER SELECTED ADD-ONS
  // IMT-23 is excluded to prevent double-counting.
  // --------------------------------------------------

  const addons = allAddons
    .filter(
      (item) =>
        selectedAddonIds.includes(Number(item.addon_id)) &&
        String(item.addon_code || "").toUpperCase() !== "IMT_23"
    )
    .map((item) => {
      const rate = getRate(item);

      const originalAmount = Math.max(
        0,
        getAmount(
          { ...item, rate_value: rate },
          idv
        )
      );

      const discountType = String(
        item.discount_type || "NONE"
      ).toUpperCase();

      const discountValue = Math.max(
        0,
        getNumber(item.discount_value)
      );

      const maxDiscountValue =
        item.max_discount_value == null ||
        getNumber(item.max_discount_value) <= 0
          ? null
          : getNumber(item.max_discount_value);

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
        Math.min(
          Math.max(0, discountAmount),
          originalAmount
        )
      );

      const amount = round(
        Math.max(0, originalAmount - discountAmount)
      );

      return {
        addon_id: Number(item.addon_id),
        rate,
        original_amount: round(originalAmount),
        discount_type: discountType,
        discount_value: discountValue,
        discount_amount: discountAmount,
        amount,
      };
    });

  const addonTotal = round(
    addons.reduce(
      (sum, item) => sum + item.amount,
      0
    )
  );

  // --------------------------------------------------
  // STEP 08: THIRD-PARTY PREMIUM
  // --------------------------------------------------

  const tpCalculation = calculationData?.tp_calculation || {};

  const tpRateType = String(
    tpRate.rate_type || "FIXED"
  ).toUpperCase();

  const tpRateValue = getRate(tpRate);

  const calculatedTP =
    tpRateType === "PERCENTAGE"
      ? (idv * tpRateValue) / 100
      : tpRateValue;

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
  // STEP 09: ADDITIONAL COVERS
  // --------------------------------------------------

  const selectedCoverIds = (
    Array.isArray(formData.cover_ids)
      ? formData.cover_ids
      : []
  ).map(Number);

  const allCovers = Array.isArray(calculationData?.covers)
    ? calculationData.covers
    : [];

  const seatingCapacity = getNumber(
    formData.seating_capacity
  );

  const covers = allCovers
    .filter((cover) =>
      selectedCoverIds.includes(Number(cover.cover_id))
    )
    .map((cover) => {
      const rateType = String(
        cover.rate_type || "FIXED"
      ).toUpperCase();

      const rate = getRate(cover);

      const quantity =
        rateType === "PER_UNIT"
          ? seatingCapacity
          : 1;

      const pending =
        rateType === "PER_UNIT" &&
        seatingCapacity <= 0;

      const amount = round(
        pending
          ? 0
          : getAmount(
              { ...cover, rate_value: rate },
              idv,
              quantity
            )
      );

      return {
        cover_id: Number(cover.cover_id),
        quantity,
        rate,
        amount,
        pending,
      };
    });

  const coverTotal = round(
    covers.reduce(
      (sum, item) => sum + item.amount,
      0
    )
  );

  const findCoverAmount = (type) =>
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
    }, 0);

  const cpaPremium = round(
    findCoverAmount("CPA")
  );

  const liabilityPremium = round(
    findCoverAmount("LIABILITY")
  );

  const passengerPremium = round(
    findCoverAmount("PASSENGER")
  );

  // --------------------------------------------------
  // STEP 10: SUBTOTAL BEFORE TAX
  // --------------------------------------------------

  const subtotal = round(
    Math.max(
      0,
      netOD + addonTotal + tpPremium + coverTotal
    )
  );

  // --------------------------------------------------
  // STEP 11: COMPONENT-WISE TAX
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
        : (taxableAmount * taxPercentage) / 100
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

  const gstTaxes = taxBreakdown.filter((tax) => {
    const master = taxRules.find(
      (item) =>
        Number(item.tax_id) === Number(tax.tax_id) &&
        String(item.premium_component || "").toUpperCase() ===
          tax.component
    );

    return String(
      master?.tax_code || ""
    ).startsWith("GST_");
  });

  const gstAmount = round(
    gstTaxes.reduce(
      (sum, tax) => sum + tax.amount,
      0
    )
  );

  const taxableAmount = subtotal;
  const totalPremium = round(
    subtotal + totalTax
  );

  // --------------------------------------------------
  // STEP 12: COMMISSION
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

  commissionAmount = round(
    Math.max(0, commissionAmount)
  );

  // --------------------------------------------------
  // STEP 13: PROFIT
  // --------------------------------------------------

  const profitAmount = round(
    Math.max(
      0,
      getNumber(profitRule.profit_amount)
    )
  );

  // --------------------------------------------------
  // STEP 14: CASHBACK
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
    getId(calculationData?.applied_tax?.tax_id) ??
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
      registration_date:
        formData.registration_date || null,

      policy_start_date:
        formData.policy_start_date || null,

      policy_end_date:
        formData.policy_end_date || null,

      vehicle_type_id:
        getId(category.vehicle_type_id),

      vehicle_category_id:
        getId(category.vehicle_category_id),

      vehicle_class_id:
        getId(formData.vehicle_class_id),

      fuel_type_id:
        getId(formData.fuel_type_id),

      usage_id:
        getId(formData.usage_id),

      engine_cc:
        getId(formData.engine_cc),

      gvw:
        getId(formData.gvw),

      seating_capacity:
        getId(formData.seating_capacity),

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

      claim_count:
        getNumber(formData.claim_count),

      business_type_id:
        getId(formData.business_type_id),

      product_id:
        getId(formData.product_id),

      policy_type_id:
        getId(formData.policy_type_id),

      policy_term_id:
        getId(formData.policy_term_id),
    },

    options: [
      {
        insurance_company_id:
          getId(formData.insurance_company_id),

        option_number: 1,
        calculation_status: "CALCULATED",

        idv,
        basic_od: basicOD,

        // DE Tariff Discount and NCB are separate values.
        od_discount: deTariffDiscountAmount,
        ncb_percentage: ncbPercentage,
        ncb_amount: ncbAmount,
        de_tariff_amount: deTariffDiscountAmount,
        net_od: netOD,

        imt23_premium: imt23Premium,
        tp_premium: tpPremium,

        zd_premium: 0,
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
