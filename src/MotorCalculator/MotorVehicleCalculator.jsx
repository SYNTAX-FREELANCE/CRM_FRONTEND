import React, { useMemo, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    useTheme,
} from "@mui/material";

import {
    useLocation,
    useParams,
    useNavigate,
} from "react-router-dom";

// MOTOR CALCULATOR MASTERS

import {
    useMotorVehicleClassMaster,
    useMotorFuelTypeMaster,
    useMotorVehicleUsageMaster,
    useMotorProductMaster,
    useMotorPolicyTypeMaster,
    useMotorBusinessTypeMaster,
    useMotorPolicyTermMaster,
    useVehicleCategoryInputFields,
    useInsuranceCompanyMaster,
} from "../CommonCode/useQuery";

import DynamicInputField from "./MotorCalculatorComponent/DynamicInputField";
import { axioslogin } from "../Connection/axios";
import VehicleCategoryHeader from "./MotorCalculatorComponent/VehicleCategoryHeader";
import AddonsSection from "./MotorCalculatorComponent/AddonsSection";
import AdditionalCoversSection from "./MotorCalculatorComponent/AdditionalCoversSection";
import PremiumCalculationSummary from "./MotorCalculatorComponent/PremiumCalculationSummary";
import { warningNofity } from "../constant/Constant";
import MotorPremiumSidePanel from "./MotorCalculatorComponent/MotorPremiumSidePanel";


const MotorVehicleCalculator = () => {

    const theme = useTheme();

    const isDark =
        theme.palette.mode === "dark";


    const { categoryId } = useParams();

    const location = useLocation();

    const navigate = useNavigate();

    const category =
        location.state?.category;


    // =========================================================
    // REQUIRED INPUT FIELDS
    // =========================================================

    const {
        data: ReqiuredInputFields = [],
    } = useVehicleCategoryInputFields(
        categoryId
    );


    // =========================================================
    // INSURANCE COMPANY
    // =========================================================

    const {
        data: InsuranceCompanyMasterDetail,
    } = useInsuranceCompanyMaster();


    const ActiveInsuranceCompanies =
        useMemo(
            () =>
                (
                    InsuranceCompanyMasterDetail ||
                    []
                ).filter(
                    (item) =>
                        Number(
                            item?.is_active
                        ) === 1
                ),
            [
                InsuranceCompanyMasterDetail,
            ]
        );


    // =========================================================
    // INPUT FIELD MASTERS
    // =========================================================

    const {
        data: vehicleClassResponse,
    } = useMotorVehicleClassMaster();


    const {
        data: fuelResponse,
    } = useMotorFuelTypeMaster();


    const {
        data: usageResponse,
    } = useMotorVehicleUsageMaster();


    const {
        data: productResponse,
    } = useMotorProductMaster();


    const {
        data: policyTypeResponse,
    } = useMotorPolicyTypeMaster();


    const {
        data: businessTypeResponse,
    } = useMotorBusinessTypeMaster();


    const {
        data: policyTermResponse,
    } = useMotorPolicyTermMaster();


    // =========================================================
    // MASTER RESPONSE HANDLER
    // =========================================================

    const getMasterArray = (
        response
    ) => {

        if (Array.isArray(response)) {
            return response;
        }

        if (
            Array.isArray(
                response?.data
            )
        ) {
            return response.data;
        }

        if (
            Array.isArray(
                response?.result
            )
        ) {
            return response.result;
        }

        if (
            Array.isArray(
                response?.rows
            )
        ) {
            return response.rows;
        }

        return [];
    };


    // =========================================================
    // MASTER DATA
    // =========================================================

    const vehicleClasses = useMemo(
        () =>
            getMasterArray(vehicleClassResponse).filter(
                item =>
                    Number(item.is_active) === 1 &&
                    Number(item.vehicle_category_id) === Number(categoryId)
            ),
        [vehicleClassResponse, categoryId]
    );
    const fuelTypes = useMemo(
        () =>
            getMasterArray(fuelResponse).filter(
                item => Number(item.is_active) === 1
            ),
        [fuelResponse]
    );

    const usages = useMemo(
        () =>
            getMasterArray(usageResponse).filter(
                item => Number(item.is_active) === 1
            ),
        [usageResponse]
    );

    const products = useMemo(
        () =>
            getMasterArray(productResponse).filter(
                item => Number(item.is_active) === 1
            ),
        [productResponse]
    );

    const policyTypes = useMemo(
        () =>
            getMasterArray(policyTypeResponse).filter(
                item => Number(item.is_active) === 1
            ),
        [policyTypeResponse]
    );

    const businessTypes = useMemo(
        () =>
            getMasterArray(businessTypeResponse).filter(
                item => Number(item.is_active) === 1
            ),
        [businessTypeResponse]
    );

    const policyTerms = useMemo(
        () =>
            getMasterArray(policyTermResponse).filter(
                item => Number(item.is_active) === 1
            ),
        [policyTermResponse]
    );


    // =========================================================
    // ACTIVE MASTER
    // =========================================================

    const getActiveMaster =
        (items) =>
            (items || []).filter(
                (item) =>
                    Number(
                        item?.is_active
                    ) === 1
            );


    // =========================================================
    // FIELD OPTIONS
    // =========================================================

    const getFieldOptions =
        (fieldCode) => {

            switch (fieldCode) {

                case "vehicle_class_id":
                    return getActiveMaster(
                        vehicleClasses
                    );

                case "fuel_type":
                case "fuel_type_id":
                    return getActiveMaster(
                        fuelTypes
                    );

                case "vehicle_usage":
                case "usage_id":
                    return getActiveMaster(
                        usages
                    );

                case "product_id":
                case "product":
                    return getActiveMaster(
                        products
                    );

                case "policy_type":
                case "policy_type_id":
                    return getActiveMaster(
                        policyTypes
                    );

                case "business_type":
                case "business_type_id":
                    return getActiveMaster(
                        businessTypes
                    );

                case "policy_term":
                case "policy_term_id":
                    return getActiveMaster(
                        policyTerms
                    );

                default:
                    return [];
            }
        };


    // =========================================================
    // OPTION ID
    // =========================================================

    const getOptionId =
        (
            item,
            fieldCode
        ) => {

            switch (fieldCode) {

                case "vehicle_class_id":
                    return item.vehicle_class_id;

                case "fuel_type":
                case "fuel_type_id":
                    return item.fuel_type_id;

                case "vehicle_usage":
                case "usage_id":
                    return (
                        item.usage_id ||
                        item.vehicle_usage_id
                    );

                case "product_id":
                case "product":
                    return item.product_id;

                case "policy_type":
                case "policy_type_id":
                    return item.policy_type_id;

                case "business_type":
                case "business_type_id":
                    return item.business_type_id;

                case "policy_term":
                case "policy_term_id":
                    return item.policy_term_id;

                default:
                    return "";
            }
        };


    // =========================================================
    // OPTION NAME
    // =========================================================

    const getOptionName =
        (
            item,
            fieldCode
        ) => {

            switch (fieldCode) {

                case "vehicle_class_id":
                    return item.class_name;

                case "fuel_type":
                case "fuel_type_id":
                    return (
                        item.fuel_name ||
                        item.fuel_type_name
                    );

                case "vehicle_usage":
                case "usage_id":
                    return (
                        item.usage_name ||
                        item.vehicle_usage_name
                    );

                case "product_id":
                case "product":
                    return item.product_name;

                case "policy_type":
                case "policy_type_id":
                    return item.policy_type_name;

                case "business_type":
                case "business_type_id":
                    return item.business_type_name;

                case "policy_term":
                case "policy_term_id":
                    return (
                        item.term_name ||
                        item.policy_term_name
                    );

                default:
                    return "";
            }
        };


    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] =
        useState({

            // Insurance Company
            insurance_company_id: "",

            // Vehicle
            vehicle_class_id: "",
            fuel_type_id: "",
            usage_id: "",

            registration_date: "",
            policy_start_date: "",

            engine_cc: "",
            gvw: "",
            seating_capacity: "",

            idv: "",

            // Policy
            business_type_id: "",
            product_id: "",
            policy_type_id: "",
            policy_term_id: "",

            // Previous Policy / NCB
            previous_policy_number: "",
            previous_insurance_company: "",
            previous_ncb_percentage: "",
            claim_status: "",
            claim_count: "",

            // Direct De-tariff Input
            // This value is percentage
            de_tariff_discount: "",

            // Direct / API Cashback
            cashback: "",

            // Selected Addons
            addon_ids: [],

            // Selected Covers
            cover_ids: [],
        });


    // =========================================================
    // FETCHED CALCULATION DATA
    // =========================================================

    const [
        calculationData,
        setCalculationData,
    ] = useState(null);


    // =========================================================
    // LOADING
    // =========================================================

    const [
        calculationLoading,
        setCalculationLoading,
    ] = useState(false);


    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange =
        (event) => {

            const {
                name,
                value,
            } = event.target;

            setFormData(
                (previous) => ({
                    ...previous,
                    [name]: value,
                })
            );
        };


    // =========================================================
    // ADDON SELECT
    // =========================================================

    const handleAddonChange =
        (addonId) => {

            setFormData(
                (previous) => {

                    const exists =
                        previous.addon_ids.includes(
                            addonId
                        );

                    return {
                        ...previous,

                        addon_ids:
                            exists
                                ? previous.addon_ids.filter(
                                    (id) =>
                                        id !==
                                        addonId
                                )
                                : [
                                    ...previous.addon_ids,
                                    addonId,
                                ],
                    };
                }
            );
        };


    // =========================================================
    // COVER SELECT
    // =========================================================

    const handleCoverChange =
        (coverId) => {

            setFormData(
                (previous) => {

                    const exists =
                        previous.cover_ids.includes(
                            coverId
                        );

                    return {
                        ...previous,

                        cover_ids:
                            exists
                                ? previous.cover_ids.filter(
                                    (id) =>
                                        id !==
                                        coverId
                                )
                                : [
                                    ...previous.cover_ids,
                                    coverId,
                                ],
                    };
                }
            );
        };


    // =========================================================
    // SUBMIT / CALCULATE
    // =========================================================

    const handleContinue =
        async () => {

            const registrationDate =
                new Date(
                    formData.registration_date
                );

            const policyStartDate =
                new Date(
                    formData.policy_start_date
                );


            let vehicleAgeMonths = 0;


            if (
                !isNaN(
                    registrationDate.getTime()
                ) &&
                !isNaN(
                    policyStartDate.getTime()
                )
            ) {

                vehicleAgeMonths =
                    (
                        policyStartDate.getFullYear() -
                        registrationDate.getFullYear()
                    ) *
                    12
                    +
                    (
                        policyStartDate.getMonth() -
                        registrationDate.getMonth()
                    )
                    -
                    (
                        policyStartDate.getDate() <
                            registrationDate.getDate()
                            ? 1
                            : 0
                    );
            }


            const payload = {

                insurance_company_id:
                    formData.insurance_company_id,

                vehicle_category_id:
                    categoryId,

                vehicle_class_id:
                    formData.vehicle_class_id,

                fuel_type_id:
                    formData.fuel_type_id,

                usage_id:
                    formData.usage_id,

                registration_date:
                    formData.registration_date,

                policy_start_date:
                    formData.policy_start_date,

                vehicle_age_months:
                    vehicleAgeMonths,

                engine_cc:
                    formData.engine_cc,

                gvw:
                    formData.gvw,

                seating_capacity:
                    formData.seating_capacity,

                idv:
                    formData.idv,

                business_type_id:
                    formData.business_type_id,

                product_id:
                    formData.product_id,

                policy_type_id:
                    formData.policy_type_id,

                policy_term_id:
                    formData.policy_term_id,

                previous_policy_number:
                    formData.previous_policy_number,

                previous_insurance_company:
                    formData.previous_insurance_company,

                previous_ncb_percentage:
                    formData.previous_ncb_percentage,

                previous_year_claim:
                    formData.claim_status,

                claim_count:
                    formData.claim_count,

                // Percentage
                de_tariff_discount:
                    formData.de_tariff_discount,
            };



            try {

                setCalculationLoading(
                    true
                );


                const response =
                    await axioslogin.post(
                        "/motor/calculation/get-data",
                        payload
                    );


                const {
                    data,
                    message,
                    success,
                } =
                    response?.data ?? {};


                console.log(
                    "Motor Calculation Data:",
                    data
                );

                if (success === 0) return warningNofity(message)

                setCalculationData(
                    data || null
                );

            } catch (error) {

                console.error(
                    "Motor Calculation Data Error:",
                    error
                );

            } finally {

                setCalculationLoading(
                    false
                );
            }
        };


    // =========================================================
    // DISPLAY HELPERS
    // =========================================================

    const getId =
        (
            item,
            possibleKeys
        ) => {

            if (!item) {
                return "";
            }

            for (
                const key of possibleKeys
            ) {

                if (
                    item?.[key] !==
                    undefined &&
                    item?.[key] !==
                    null
                ) {
                    return item[key];
                }
            }

            return "";
        };


    const getName =
        (
            item,
            possibleKeys
        ) => {

            if (!item) {
                return "";
            }

            for (
                const key of possibleKeys
            ) {

                if (
                    item?.[key] !==
                    undefined &&
                    item?.[key] !==
                    null
                ) {
                    return item[key];
                }
            }

            return "";
        };


    // =========================================================
    // COMMON SELECT STYLE
    // =========================================================

    const selectSx = {

        "& .MuiInputBase-root": {
            backgroundColor:
                isDark
                    ? "#1e293b"
                    : "#ffffff",

            color:
                isDark
                    ? "#f1f5f9"
                    : "#334155",

            borderRadius: "8px",
        },

        "& .MuiOutlinedInput-root": {

            "& fieldset": {
                borderColor:
                    isDark
                        ? "#475569"
                        : "#dbe2ea",
            },

            "&:hover fieldset": {
                borderColor:
                    isDark
                        ? "#64748b"
                        : "#94a3b8",
            },

            "&.Mui-focused fieldset": {
                borderColor:
                    "#3b82f6",

                borderWidth: "1px",
            },
        },

        "& .MuiInputLabel-root": {
            fontSize: "13px",

            color:
                isDark
                    ? "#94a3b8"
                    : "#64748b",
        },

        "& .MuiInputLabel-root.Mui-focused": {
            color: "#3b82f6",
        },

        "& .MuiInputBase-input": {

            fontSize: "13px",

            color:
                isDark
                    ? "#f1f5f9"
                    : "#334155",

            "&::placeholder": {
                color:
                    isDark
                        ? "#64748b"
                        : "#94a3b8",

                opacity: 1,
            },
        },

        "& .MuiSelect-icon": {
            color:
                isDark
                    ? "#94a3b8"
                    : "#64748b",
        },
    };


    // =========================================================
    // SECTION STYLE
    // =========================================================

    const sectionPaperSx = {

        p: 2.5,

        borderRadius: 2,

        border:
            `1px solid ${isDark
                ? "#334155"
                : "#e5e7eb"
            }`,

        boxShadow:
            isDark
                ? "0 2px 8px rgba(0,0,0,0.20)"
                : "0 2px 8px rgba(0,0,0,0.04)",

        backgroundColor:
            isDark
                ? "#1e293b"
                : "#ffffff",
    };


    // =========================================================
    // FORMAT VALUE
    // =========================================================

    const formatNumber =
        (value) => {

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {
                return "-";
            }

            const number =
                Number(value);

            if (
                Number.isNaN(number)
            ) {
                return value;
            }

            return number.toLocaleString(
                "en-IN"
            );
        };


    // =========================================================
    // FETCHED DATA
    // =========================================================

    const fetchedAddons =
        calculationData?.addons ||
        [];


    const fetchedCovers =
        calculationData?.covers ||
        [];



    const handleClear = () => {
        setFormData({
            insurance_company_id: "",

            vehicle_class_id: "",
            fuel_type_id: "",
            usage_id: "",

            registration_date: "",
            policy_start_date: "",

            engine_cc: "",
            gvw: "",
            seating_capacity: "",
            idv: "",

            business_type_id: "",
            product_id: "",
            policy_type_id: "",
            policy_term_id: "",

            previous_policy_number: "",
            previous_insurance_company: "",
            previous_ncb_percentage: "",
            claim_status: "",
            claim_count: "",

            de_tariff_discount: "",
            cashback: "",

            addon_ids: [],
            cover_ids: [],
        });

        setCalculationData(null);
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Box
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 1200,

                // Important: opaque background hides scrolling content
                backgroundColor: isDark
                    ? "#0f172a"
                    : "#f5f7fa",

                py: 1,
                px: 0,

                // Keep the header above the scrolling content
                isolation: "isolate",

                // Do not use overflow: clip here
                overflow: "visible",
            }}
        >

            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    backgroundColor:
                        isDark
                            ? "#0f172a"
                            : "#f5f7fa",
                    py: 1,
                    overflow: 'clip'
                }}>
                <VehicleCategoryHeader
                    category={category}
                    categoryId={categoryId}
                    formData={formData}
                    handleChange={
                        handleChange
                    }
                    ActiveInsuranceCompanies={
                        ActiveInsuranceCompanies
                    }
                    selectSx={selectSx}
                    handleContinue={handleContinue}
                    calculationLoading={calculationLoading}
                />
            </Box>
            {/*  MAIN CONTENT */}

            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    gap: 2,

                    flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "row",
                    },

                    alignItems: "flex-start",

                    height: "calc(100vh - 100px)",
                    overflowY: "auto",
                    overflowX: "hidden",

                    // Hide scrollbar but allow scrolling
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE and Edge

                    "&::-webkit-scrollbar": {
                        display: "none", // Chrome, Safari
                    },
                }}
            >

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "100%",
                            md: "60%",
                        },

                        minWidth: 0,
                    }}
                >

                    {/* =============================================
                        VEHICLE DETAILS
                    ============================================= */}

                    <Paper
                        sx={{
                            mb: 2,

                            borderRadius: 2.5,

                            border:
                                `1px solid ${isDark
                                    ? "#334155"
                                    : "#e2e8f0"
                                }`,

                            backgroundColor:
                                isDark
                                    ? "#1e293b"
                                    : "#fff",

                            overflow:
                                "hidden",

                            boxShadow:
                                isDark
                                    ? "0 2px 8px rgba(0,0,0,0.20)"
                                    : "0 2px 8px rgba(15, 23, 42, 0.04)",
                        }}
                    >

                        {/* HEADER */}

                        <Box
                            sx={{
                                px: 2,
                                py: 1.4,

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap: 1.2,

                                borderBottom:
                                    `1px solid ${isDark
                                        ? "#334155"
                                        : "#eef2f7"
                                    }`,

                                backgroundColor:
                                    isDark
                                        ? "#172033"
                                        : "#fafbfc",
                            }}
                        >

                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,

                                    borderRadius:
                                        1.5,

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    backgroundColor:
                                        isDark
                                            ? "#172554"
                                            : "#eff6ff",

                                    color:
                                        "#2563eb",

                                    fontSize:
                                        "13px",

                                    fontWeight:
                                        800,
                                }}
                            >
                                01
                            </Box>


                            <Box>

                                <Typography
                                    sx={{
                                        fontSize:
                                            "14px",

                                        fontWeight:
                                            700,

                                        color:
                                            isDark
                                                ? "#f8fafc"
                                                : "#1e293b",

                                        lineHeight:
                                            1.2,

                                        fontFamily:
                                            "Bahnschrift",
                                    }}
                                >
                                    Vehicle & Policy Details
                                </Typography>


                                <Typography
                                    sx={{
                                        mt: 0.2,

                                        fontSize:
                                            "11px",

                                        color:
                                            isDark
                                                ? "#94a3b8"
                                                : "#94a3b8",

                                        fontFamily:
                                            "Bahnschrift",
                                    }}
                                >
                                    Enter the required vehicle information
                                </Typography>

                            </Box>

                        </Box>


                        {/* CONTENT */}

                        <Box
                            sx={{
                                p: 2,

                                backgroundColor:
                                    isDark
                                        ? "#1e293b"
                                        : "#ffffff",
                            }}
                        >

                            <Box
                                sx={{
                                    display:
                                        "grid",

                                    gridTemplateColumns:
                                    {
                                        xs: "1fr",
                                        sm: "repeat(2, 1fr)",
                                        md: "repeat(3, 1fr)",
                                    },

                                    gap: 1.5,
                                }}
                            >

                                {[
                                    ...(ReqiuredInputFields ||
                                        []),
                                ]

                                    .filter(
                                        (
                                            field
                                        ) =>
                                            Number(
                                                field.is_visible
                                            ) === 1
                                    )

                                    .sort(
                                        (
                                            a,
                                            b
                                        ) =>
                                            a.display_order -
                                            b.display_order
                                    )

                                    .map(
                                        (
                                            field
                                        ) => (

                                            <Box
                                                key={
                                                    field.vehicle_input_field_id
                                                }
                                            >

                                                <DynamicInputField
                                                    field={
                                                        field
                                                    }

                                                    value={
                                                        formData[
                                                        field.field_code
                                                        ] ??
                                                        ""
                                                    }

                                                    onChange={
                                                        handleChange
                                                    }

                                                    getFieldOptions={
                                                        getFieldOptions
                                                    }

                                                    getOptionId={
                                                        getOptionId
                                                    }

                                                    getOptionName={
                                                        getOptionName
                                                    }

                                                    selectSx={
                                                        selectSx
                                                    }
                                                />

                                            </Box>
                                        )
                                    )}

                            </Box>

                        </Box>

                    </Paper>


                    {/* =============================================
                        ADDONS
                    ============================================= */}

                    <AddonsSection
                        calculationLoading={
                            calculationLoading
                        }

                        fetchedAddons={
                            fetchedAddons
                        }

                        formData={
                            formData
                        }

                        getId={
                            getId
                        }

                        getName={
                            getName
                        }

                        handleAddonChange={
                            handleAddonChange
                        }
                    />


                    {/* =============================================
                        ADDITIONAL COVERS
                    ============================================= */}

                    <AdditionalCoversSection
                        calculationLoading={
                            calculationLoading
                        }

                        fetchedCovers={
                            fetchedCovers
                        }

                        formData={
                            formData
                        }

                        getId={
                            getId
                        }

                        handleCoverChange={
                            handleCoverChange
                        }
                    />

                </Box>


                {/* =================================================
                    RIGHT SIDE - PREMIUM CALCULATION
                ================================================= */}
                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "100%",
                            md: "40%",
                        },

                        minWidth: 0,

                        position: {
                            xs: "static",
                            md: "sticky",
                        },

                        top: 16,

                        alignSelf: "flex-start",

                        // Only this section scrolls
                        maxHeight: {
                            xs: "none",
                            md: "calc(100vh - 32px)",
                        },

                        overflowY: {
                            xs: "visible",
                            md: "auto",
                        },

                        // Optional: cleaner scrollbar
                        "&::-webkit-scrollbar": {
                            width: "6px",
                        },

                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#94a3b8",
                            borderRadius: "10px",
                        },
                    }}
                >

                    <PremiumCalculationSummary
                        calculationData={
                            calculationData
                        }

                        formData={
                            formData
                        }

                        formatNumber={
                            formatNumber
                        }
                    />

                </Box>

            </Box>


            {/* =====================================================
                FOOTER BUTTONS
            ===================================================== */}

            <Box
                sx={{
                    display: "flex",

                    justifyContent:
                        "flex-end",

                    gap: 1.5,

                    pb: 3,

                    pt: 1,
                }}
            >
                <MotorPremiumSidePanel
                    onBack={() => navigate("/home/calculator")}
                    onClear={handleClear}
                    onViewPolicy={() =>
                        navigate("/home/motor-calculator/category/preview", {
                            state: {
                                calculationData,
                                formData,
                            },
                        })
                    }
                />
            </Box>

        </Box>
    );
};


export default MotorVehicleCalculator;