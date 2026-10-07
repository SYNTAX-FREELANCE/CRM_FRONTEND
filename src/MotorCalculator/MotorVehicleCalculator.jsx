import React, { useMemo, useState } from "react";

import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Paper,
    Divider,
    Grid,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Chip,
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


const MotorVehicleCalculator = () => {

    const { categoryId } = useParams();

    const location = useLocation();

    const navigate = useNavigate();

    const category = location.state?.category;


    // =========================================================
    // REQUIRED INPUT FIELDS
    // =========================================================

    const {
        data: ReqiuredInputFields = [],
    } = useVehicleCategoryInputFields(categoryId);


    // =========================================================
    // INSURANCE COMPANY
    // =========================================================

    const {
        data: InsuranceCompanyMasterDetail,
    } = useInsuranceCompanyMaster();


    const ActiveInsuranceCompanies = useMemo(
        () =>
            (InsuranceCompanyMasterDetail || []).filter(
                (item) => Number(item?.is_active) === 1
            ),
        [InsuranceCompanyMasterDetail]
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

    const getMasterArray = (response) => {

        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.result)) {
            return response.result;
        }

        if (Array.isArray(response?.rows)) {
            return response.rows;
        }

        return [];
    };


    // =========================================================
    // MASTER DATA
    // =========================================================

    const vehicleClasses = useMemo(
        () => getMasterArray(vehicleClassResponse),
        [vehicleClassResponse]
    );


    const fuelTypes = useMemo(
        () => getMasterArray(fuelResponse),
        [fuelResponse]
    );


    const usages = useMemo(
        () => getMasterArray(usageResponse),
        [usageResponse]
    );


    const products = useMemo(
        () => getMasterArray(productResponse),
        [productResponse]
    );


    const policyTypes = useMemo(
        () => getMasterArray(policyTypeResponse),
        [policyTypeResponse]
    );


    const businessTypes = useMemo(
        () => getMasterArray(businessTypeResponse),
        [businessTypeResponse]
    );


    const policyTerms = useMemo(
        () => getMasterArray(policyTermResponse),
        [policyTermResponse]
    );


    // =========================================================
    // ACTIVE MASTER
    // =========================================================

    const getActiveMaster = (items) =>
        (items || []).filter(
            (item) => Number(item?.is_active) === 1
        );


    // =========================================================
    // FIELD OPTIONS
    // =========================================================

    const getFieldOptions = (fieldCode) => {

        switch (fieldCode) {

            case "vehicle_class_id":
                return getActiveMaster(vehicleClasses);

            case "fuel_type":
            case "fuel_type_id":
                return getActiveMaster(fuelTypes);

            case "vehicle_usage":
            case "usage_id":
                return getActiveMaster(usages);

            case "product_id":
            case "product":
                return getActiveMaster(products);

            case "policy_type":
            case "policy_type_id":
                return getActiveMaster(policyTypes);

            case "business_type":
            case "business_type_id":
                return getActiveMaster(businessTypes);

            case "policy_term":
            case "policy_term_id":
                return getActiveMaster(policyTerms);

            default:
                return [];
        }
    };


    // =========================================================
    // OPTION ID
    // =========================================================

    const getOptionId = (item, fieldCode) => {

        switch (fieldCode) {

            case "vehicle_class_id":
                return item.vehicle_class_id;

            case "fuel_type":
            case "fuel_type_id":
                return item.fuel_type_id;

            case "vehicle_usage":
            case "usage_id":
                return item.usage_id || item.vehicle_usage_id;

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

    const getOptionName = (item, fieldCode) => {

        switch (fieldCode) {

            case "vehicle_class_id":
                return item.class_name;

            case "fuel_type":
            case "fuel_type_id":
                return item.fuel_name || item.fuel_type_name;

            case "vehicle_usage":
            case "usage_id":
                return item.usage_name || item.vehicle_usage_name;

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
                return item.term_name || item.policy_term_name;

            default:
                return "";
        }
    };


    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] = useState({

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
        de_tariff_discount: "",

        // Selected Addons
        addon_ids: [],

        // Selected Covers
        cover_ids: [],
    });


    // =========================================================
    // FETCHED CALCULATION DATA
    // =========================================================

    const [calculationData, setCalculationData] = useState(null);


    // =========================================================
    // LOADING
    // =========================================================

    const [calculationLoading, setCalculationLoading] =
        useState(false);


    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // =========================================================
    // ADDON SELECT
    // =========================================================

    const handleAddonChange = (addonId) => {

        setFormData((previous) => {

            const exists =
                previous.addon_ids.includes(addonId);

            return {
                ...previous,

                addon_ids: exists
                    ? previous.addon_ids.filter(
                        (id) => id !== addonId
                    )
                    : [
                        ...previous.addon_ids,
                        addonId,
                    ],
            };
        });
    };


    // =========================================================
    // COVER SELECT
    // =========================================================

    const handleCoverChange = (coverId) => {

        setFormData((previous) => {

            const exists =
                previous.cover_ids.includes(coverId);

            return {
                ...previous,

                cover_ids: exists
                    ? previous.cover_ids.filter(
                        (id) => id !== coverId
                    )
                    : [
                        ...previous.cover_ids,
                        coverId,
                    ],
            };
        });
    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleContinue = async () => {

        const registrationDate =
            new Date(formData.registration_date);

        const policyStartDate =
            new Date(formData.policy_start_date);


        let vehicleAgeMonths = 0;


        if (
            !isNaN(registrationDate.getTime()) &&
            !isNaN(policyStartDate.getTime())
        ) {

            vehicleAgeMonths =
                (
                    policyStartDate.getFullYear() -
                    registrationDate.getFullYear()
                ) * 12
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

            de_tariff_discount:
                formData.de_tariff_discount,
        };


        console.log(
            "Vehicle Age:",
            vehicleAgeMonths
        );


        console.log(
            "Motor Calculation Payload:",
            payload
        );


        try {

            setCalculationLoading(true);


            const response =
                await axioslogin.post(
                    "/motor/calculation/get-data",
                    payload
                );


            const {
                data,
                message,
                success,
            } = response?.data ?? {};


            console.log(
                "Motor Calculation Data:",
                data
            );


            setCalculationData(data || null);


        } catch (error) {

            console.error(
                "Motor Calculation Data Error:",
                error
            );

        } finally {

            setCalculationLoading(false);
        }
    };


    // =========================================================
    // DISPLAY HELPERS
    // =========================================================

    const getId = (
        item,
        possibleKeys
    ) => {

        if (!item) {
            return "";
        }

        for (const key of possibleKeys) {

            if (
                item?.[key] !== undefined &&
                item?.[key] !== null
            ) {
                return item[key];
            }
        }

        return "";
    };


    const getName = (
        item,
        possibleKeys
    ) => {

        if (!item) {
            return "";
        }

        for (const key of possibleKeys) {

            if (
                item?.[key] !== undefined &&
                item?.[key] !== null
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
            backgroundColor: "#fff",
        },

        "& .MuiInputLabel-root": {
            fontSize: "14px",
        },

        "& .MuiInputBase-input": {
            fontSize: "14px",
        },
    };


    // =========================================================
    // SECTION STYLE
    // =========================================================

    const sectionPaperSx = {

        p: 2.5,

        borderRadius: 2,

        border: "1px solid #e5e7eb",

        boxShadow:
            "0 2px 8px rgba(0,0,0,0.04)",

        backgroundColor: "#fff",
    };


    // =========================================================
    // FORMAT VALUE
    // =========================================================

    const formatNumber = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return value;
        }

        return number.toLocaleString("en-IN");
    };


    // =========================================================
    // FETCHED DATA
    // =========================================================

    const fetchedAddons =
        calculationData?.addons || [];


    const fetchedCovers =
        calculationData?.covers || [];


    return (

        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",

                backgroundColor: "#f5f7fa",

                p: {
                    xs: 1.5,
                    sm: 2,
                    md: 3,
                },
            }}
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <Box
                sx={{
                    mb: 2.5,
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        color: "#1f2937",
                    }}
                >
                    Motor Insurance Calculator
                </Typography>


                <Typography
                    sx={{
                        mt: 0.5,
                        color: "#6b7280",
                        fontSize: "14px",
                    }}
                >
                    Select vehicle and policy details to
                    prepare the motor insurance quotation.
                </Typography>

            </Box>


            {/* ================================================= */}
            {/* SELECTED CATEGORY */}
            {/* ================================================= */}

            <Paper
                sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #dbeafe",
                    backgroundColor: "#eff6ff",
                    boxShadow: "none",
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >

                    <Box>

                        <Typography
                            sx={{
                                fontSize: "12px",
                                color: "#6b7280",
                                fontWeight: 600,
                                textTransform: "uppercase",
                            }}
                        >
                            Selected Vehicle Category
                        </Typography>


                        <Typography
                            sx={{
                                mt: 0.3,
                                fontSize: "18px",
                                fontWeight: 700,
                                color: "#1d4ed8",
                            }}
                        >
                            {category?.category_name ||
                                `Category ID: ${categoryId}`}
                        </Typography>

                    </Box>


                    <Box
                        sx={{
                            width: "250px",
                        }}
                    >

                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Insurance Company"
                            name="insurance_company_id"
                            value={
                                formData.insurance_company_id
                            }
                            onChange={handleChange}
                            sx={selectSx}
                            required
                        >

                            <MenuItem value="">
                                Select Insurance Company
                            </MenuItem>


                            {ActiveInsuranceCompanies.map(
                                (item) => (

                                    <MenuItem
                                        key={
                                            item.insurance_company_id
                                        }
                                        value={
                                            item.insurance_company_id
                                        }
                                    >
                                        {item.company_name}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Box>

                </Box>

            </Paper>


            {/* ================================================= */}
            {/* VEHICLE DETAILS */}
            {/* ================================================= */}

            <Paper
                sx={{
                    ...sectionPaperSx,
                    mb: 2,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mb: 2,
                    }}
                >
                    1. Vehicle & Policy Details
                </Typography>


                <Grid container spacing={2}>

                    {ReqiuredInputFields
                        ?.filter(
                            (field) =>
                                Number(
                                    field.is_visible
                                ) === 1
                        )
                        ?.sort(
                            (a, b) =>
                                a.display_order -
                                b.display_order
                        )
                        ?.map((field) => {

                            const value =
                                formData[
                                    field.field_code
                                ] ?? "";


                            return (

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={
                                        field.vehicle_input_field_id
                                    }
                                >

                                    <DynamicInputField
                                        field={field}
                                        value={value}
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

                                </Grid>

                            );
                        })}


               
                </Grid>

            </Paper>


            {/* ================================================= */}
            {/* ADDONS */}
            {/* ================================================= */}

            <Paper
                sx={{
                    ...sectionPaperSx,
                    mb: 2,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mb: 0.5,
                    }}
                >
                    2. Add-ons
                </Typography>


                <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize: "13px",
                        mb: 2,
                    }}
                >
                    Applicable add-ons fetched based on the
                    selected vehicle and policy details.
                </Typography>


                <Divider
                    sx={{
                        mb: 2,
                    }}
                />


                {calculationLoading ? (

                    <Typography>
                        Loading applicable add-ons...
                    </Typography>

                ) : fetchedAddons.length === 0 ? (

                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: "14px",
                        }}
                    >
                        No applicable add-ons found.
                    </Typography>

                ) : (

                    <FormGroup>

                        <Grid
                            container
                            spacing={1}
                        >

                            {fetchedAddons.map(
                                (item) => {

                                    const id =
                                        getId(
                                            item,
                                            [
                                                "addon_id",
                                            ]
                                        );


                                    const name =
                                        getName(
                                            item,
                                            [
                                                "addon_name",
                                            ]
                                        );


                                    return (

                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            key={id}
                                        >

                                            <FormControlLabel

                                                control={
                                                    <Checkbox
                                                        checked={
                                                            formData
                                                                .addon_ids
                                                                .includes(
                                                                    id
                                                                )
                                                        }
                                                        onChange={() =>
                                                            handleAddonChange(
                                                                id
                                                            )
                                                        }
                                                    />
                                                }

                                                label={

                                                    <Box>

                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    "14px",
                                                                fontWeight:
                                                                    500,
                                                            }}
                                                        >
                                                            {name}
                                                        </Typography>


                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    "11px",
                                                                color:
                                                                    "text.secondary",
                                                            }}
                                                        >
                                                            {
                                                                item.rate_type
                                                            }
                                                            {" "}
                                                            -
                                                            {" "}
                                                            {item.rate_value}
                                                        </Typography>

                                                    </Box>
                                                }

                                            />

                                        </Grid>

                                    );
                                }
                            )}

                        </Grid>

                    </FormGroup>

                )}

            </Paper>


            {/* ================================================= */}
            {/* COVERS */}
            {/* ================================================= */}

            <Paper
                sx={{
                    ...sectionPaperSx,
                    mb: 2,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mb: 0.5,
                    }}
                >
                    3. Additional Covers
                </Typography>


                <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize: "13px",
                        mb: 2,
                    }}
                >
                    Applicable covers fetched from the
                    calculation configuration.
                </Typography>


                <Divider
                    sx={{
                        mb: 2,
                    }}
                />


                {calculationLoading ? (

                    <Typography>
                        Loading applicable covers...
                    </Typography>

                ) : fetchedCovers.length === 0 ? (

                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: "14px",
                        }}
                    >
                        No applicable covers found.
                    </Typography>

                ) : (

                    <FormGroup>

                        <Grid
                            container
                            spacing={1}
                        >

                            {fetchedCovers.map(
                                (item) => {

                                    const id =
                                        getId(
                                            item,
                                            [
                                                "cover_id",
                                            ]
                                        );


                                    return (

                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            key={id}
                                        >

                                            <FormControlLabel

                                                control={
                                                    <Checkbox
                                                        checked={
                                                            formData
                                                                .cover_ids
                                                                .includes(
                                                                    id
                                                                )
                                                        }
                                                        onChange={() =>
                                                            handleCoverChange(
                                                                id
                                                            )
                                                        }
                                                    />
                                                }

                                                label={

                                                    <Box>

                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    "14px",
                                                                fontWeight:
                                                                    500,
                                                            }}
                                                        >
                                                            {
                                                                item.cover_name
                                                            }
                                                        </Typography>


                                                        <Typography
                                                            sx={{
                                                                fontSize:
                                                                    "11px",
                                                                color:
                                                                    "text.secondary",
                                                            }}
                                                        >
                                                            {
                                                                item.cover_type
                                                            }
                                                            {" "}
                                                            -
                                                            {" "}
                                                            {
                                                                item.rate_type
                                                            }
                                                            {" "}
                                                            -
                                                            {" "}
                                                            ₹
                                                            {
                                                                item.rate_value
                                                            }
                                                        </Typography>

                                                    </Box>
                                                }

                                            />

                                        </Grid>

                                    );
                                }
                            )}

                        </Grid>

                    </FormGroup>

                )}

            </Paper>


            {/* ================================================= */}
            {/* FETCHED CALCULATION CONFIGURATION */}
            {/* ================================================= */}

            {calculationData && (

                <Paper
                    sx={{
                        ...sectionPaperSx,
                        mb: 2,
                    }}
                >

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            mb: 0.5,
                        }}
                    >
                        4. Applicable Calculation Details
                    </Typography>


                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: "13px",
                            mb: 2,
                        }}
                    >
                        These values were fetched from the
                        motor calculation masters.
                    </Typography>


                    <Divider
                        sx={{
                            mb: 2,
                        }}
                    />


                    {/* ================================================= */}
                    {/* OD RATE */}
                    {/* ================================================= */}

                    <Typography
                        fontWeight={700}
                        sx={{
                            mb: 1,
                        }}
                    >
                        Own Damage Rate
                    </Typography>


                    {calculationData.od_rate?.map(
                        (item) => (

                            <Box
                                key={item.od_rate_id}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 1,
                                    border:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <Grid
                                    container
                                    spacing={2}
                                >

                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >
                                        <Typography
                                            variant="caption"
                                        >
                                            Rate Type
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {item.rate_type}
                                        </Typography>
                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >
                                        <Typography
                                            variant="caption"
                                        >
                                            Rate
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {item.rate_value}%
                                        </Typography>
                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >
                                        <Typography
                                            variant="caption"
                                        >
                                            Effective From
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {item.effective_from}
                                        </Typography>
                                    </Grid>

                                </Grid>

                            </Box>

                        )
                    )}


                    {/* ================================================= */}
                    {/* OD AGE SLAB */}
                    {/* ================================================= */}

                    <Typography
                        fontWeight={700}
                        sx={{
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        OD Age Slab
                    </Typography>


                    {calculationData.od_age_slab?.map(
                        (item) => (

                            <Box
                                key={item.od_age_slab_id}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 1,
                                    border:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <Typography
                                    fontWeight={600}
                                >
                                    {item.slab_name}
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize: "13px",
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    {item.min_age_months}
                                    {" - "}
                                    {item.max_age_months}
                                    {" months"}
                                </Typography>

                            </Box>

                        )
                    )}


                    {/* ================================================= */}
                    {/* OD DEPRECIATION */}
                    {/* ================================================= */}

                    <Typography
                        fontWeight={700}
                        sx={{
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        OD Depreciation
                    </Typography>


                    {calculationData.od_depreciation?.map(
                        (item) => (

                            <Box
                                key={item.depreciation_id}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 1,
                                    border:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <Grid
                                    container
                                    spacing={2}
                                >

                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Vehicle Age
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.min_age_months
                                            }
                                            {" - "}
                                            {
                                                item.max_age_months
                                            }
                                            {" months"}
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Depreciation
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.depreciation_percentage
                                            }%
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Description
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.description ||
                                                "-"
                                            }
                                        </Typography>

                                    </Grid>

                                </Grid>

                            </Box>

                        )
                    )}


                    {/* ================================================= */}
                    {/* TP RATE */}
                    {/* ================================================= */}

                    <Typography
                        fontWeight={700}
                        sx={{
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        Third Party Rate
                    </Typography>


                    {calculationData.tp_rate?.map(
                        (item) => (

                            <Box
                                key={
                                    item.tp_rate_slab_id
                                }
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 1,
                                    border:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <Grid
                                    container
                                    spacing={2}
                                >

                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            CC Slab
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.engine_cc_slab_name
                                            }
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            CC Range
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {item.min_cc}
                                            {" - "}
                                            {item.max_cc}
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            TP Rate
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            ₹
                                            {formatNumber(
                                                item.rate_value
                                            )}
                                        </Typography>

                                    </Grid>

                                </Grid>

                            </Box>

                        )
                    )}


                    {/* ================================================= */}
                    {/* NCB */}
                    {/* ================================================= */}

                    <Typography
                        fontWeight={700}
                        sx={{
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        NCB
                    </Typography>


                    {calculationData.ncb_rule?.map(
                        (item) => (

                            <Box
                                key={item.ncb_rule_id}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 1,
                                    border:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <Grid
                                    container
                                    spacing={2}
                                >

                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Policy Years
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.min_policy_years
                                            }
                                            {" - "}
                                            {
                                                item.max_policy_years
                                            }
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            NCB
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.ncb_percentage
                                            }%
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Claim Free
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                Number(
                                                    item.claim_free_required
                                                ) === 1
                                                    ? "Yes"
                                                    : "No"
                                            }
                                        </Typography>

                                    </Grid>

                                </Grid>

                            </Box>

                        )
                    )}


                    {/* ================================================= */}
                    {/* DE-TARIFF / DISCOUNT */}
                    {/* ================================================= */}

                    <Typography
                        fontWeight={700}
                        sx={{
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        De-Tariff / Discount
                    </Typography>


                    {calculationData.discount_rule?.map(
                        (item) => (

                            <Box
                                key={
                                    item.discount_rule_id
                                }
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 1,
                                    border:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <Typography
                                    fontWeight={600}
                                >
                                    {
                                        item.discount_type
                                    }
                                    {" "}
                                    -
                                    {" "}
                                    {
                                        item.discount_value
                                    }%
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize: "13px",
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    {
                                        item.description ||
                                        "Discount configuration"
                                    }
                                </Typography>

                            </Box>

                        )
                    )}


                    {/* ================================================= */}
                    {/* COMMISSION */}
                    {/* ================================================= */}

                    <Typography
                        fontWeight={700}
                        sx={{
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        Commission
                    </Typography>


                    {calculationData.commission?.map(
                        (item) => (

                            <Box
                                key={
                                    item.commission_rule_id
                                }
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 1,
                                    border:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <Typography
                                    fontWeight={600}
                                >
                                    {
                                        item.commission_type
                                    }
                                    {" "}
                                    -
                                    {" "}
                                    {
                                        item.commission_value
                                    }%
                                </Typography>


                                <Typography
                                    sx={{
                                        fontSize: "13px",
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    {
                                        item.description ||
                                        "-"
                                    }
                                </Typography>

                            </Box>

                        )
                    )}


                    {/* ================================================= */}
                    {/* CASHBACK */}
                    {/* ================================================= */}

                    <Typography
                        fontWeight={700}
                        sx={{
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        Cashback
                    </Typography>


                    {calculationData.cashback?.map(
                        (item) => (

                            <Box
                                key={
                                    item.cashback_rule_id
                                }
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 1,
                                    border:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <Grid
                                    container
                                    spacing={2}
                                >

                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Type
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.cashback_type
                                            }
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Cashback
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.cashback_value
                                            }%
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Maximum
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            ₹
                                            {
                                                formatNumber(
                                                    item.max_cashback_amount
                                                )
                                            }
                                        </Typography>

                                    </Grid>

                                </Grid>

                            </Box>

                        )
                    )}


                    {/* ================================================= */}
                    {/* TAX */}
                    {/* ================================================= */}

                    <Typography
                        fontWeight={700}
                        sx={{
                            mt: 2,
                            mb: 1,
                        }}
                    >
                        Tax
                    </Typography>


                    {calculationData.tax?.map(
                        (item) => (

                            <Box
                                key={item.tax_id}
                                sx={{
                                    p: 1.5,
                                    mb: 1,
                                    backgroundColor:
                                        "#f8fafc",
                                    borderRadius: 1,
                                    border:
                                        "1px solid #e5e7eb",
                                }}
                            >

                                <Grid
                                    container
                                    spacing={2}
                                >

                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Tax
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.tax_name
                                            }
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Type
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.tax_type
                                            }
                                        </Typography>

                                    </Grid>


                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                    >

                                        <Typography
                                            variant="caption"
                                        >
                                            Rate
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {
                                                item.tax_type ===
                                                "PERCENTAGE"
                                                    ? `${item.tax_percentage}%`
                                                    : "Fixed"
                                            }
                                        </Typography>

                                    </Grid>

                                </Grid>

                            </Box>

                        )
                    )}

                </Paper>

            )}


            {/* ================================================= */}
            {/* SELECTED SUMMARY */}
            {/* ================================================= */}

            <Paper
                sx={{
                    ...sectionPaperSx,
                    mb: 2,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        mb: 2,
                    }}
                >
                    Selected Details
                </Typography>


                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <Typography
                            sx={{
                                fontSize: "12px",
                                color: "text.secondary",
                            }}
                        >
                            Category
                        </Typography>

                        <Typography fontWeight={600}>
                            {
                                category?.category_name ||
                                "-"
                            }
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <Typography
                            sx={{
                                fontSize: "12px",
                                color: "text.secondary",
                            }}
                        >
                            Engine CC
                        </Typography>

                        <Typography fontWeight={600}>
                            {
                                formData.engine_cc ||
                                "-"
                            }
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <Typography
                            sx={{
                                fontSize: "12px",
                                color: "text.secondary",
                            }}
                        >
                            GVW
                        </Typography>

                        <Typography fontWeight={600}>
                            {
                                formData.gvw ||
                                "-"
                            }
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                    >

                        <Typography
                            sx={{
                                fontSize: "12px",
                                color: "text.secondary",
                            }}
                        >
                            IDV
                        </Typography>

                        <Typography fontWeight={600}>
                            {
                                formData.idv
                                    ? `₹ ${formatNumber(
                                        formData.idv
                                    )}`
                                    : "-"
                            }
                        </Typography>

                    </Grid>


                    <Grid
                        item
                        xs={12}
                    >

                        <Divider
                            sx={{
                                my: 1,
                            }}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            sx={{
                                fontSize: "12px",
                                color: "text.secondary",
                                mb: 0.5,
                            }}
                        >
                            Selected Add-ons
                        </Typography>


                        {formData.addon_ids.length === 0 ? (

                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    color:
                                        "text.secondary",
                                }}
                            >
                                No add-ons selected
                            </Typography>

                        ) : (

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                }}
                            >

                                {formData.addon_ids.map(
                                    (id) => {

                                        const addon =
                                            fetchedAddons.find(
                                                (item) =>
                                                    getId(
                                                        item,
                                                        [
                                                            "addon_id",
                                                        ]
                                                    ) === id
                                            );


                                        return (

                                            <Chip
                                                key={id}
                                                size="small"
                                                label={
                                                    addon?.addon_name ||
                                                    id
                                                }
                                            />

                                        );
                                    }
                                )}

                            </Box>

                        )}

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <Typography
                            sx={{
                                fontSize: "12px",
                                color: "text.secondary",
                                mb: 0.5,
                            }}
                        >
                            Selected Covers
                        </Typography>


                        {formData.cover_ids.length === 0 ? (

                            <Typography
                                sx={{
                                    fontSize: "13px",
                                    color:
                                        "text.secondary",
                                }}
                            >
                                No covers selected
                            </Typography>

                        ) : (

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                }}
                            >

                                {formData.cover_ids.map(
                                    (id) => {

                                        const cover =
                                            fetchedCovers.find(
                                                (item) =>
                                                    getId(
                                                        item,
                                                        [
                                                            "cover_id",
                                                        ]
                                                    ) === id
                                            );


                                        return (

                                            <Chip
                                                key={id}
                                                size="small"
                                                label={
                                                    cover?.cover_name ||
                                                    id
                                                }
                                            />

                                        );
                                    }
                                )}

                            </Box>

                        )}

                    </Grid>

                </Grid>

            </Paper>


            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    pb: 3,
                }}
            >

                <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>


                <Button
                    variant="contained"
                    onClick={handleContinue}
                    disabled={calculationLoading}
                    sx={{
                        px: 4,
                        fontWeight: 600,
                    }}
                >
                    {calculationLoading
                        ? "Loading..."
                        : "Continue"}
                </Button>

            </Box>

        </Box>
    );
};


export default MotorVehicleCalculator;