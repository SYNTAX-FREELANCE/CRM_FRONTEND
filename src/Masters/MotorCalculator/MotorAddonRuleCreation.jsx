import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
} from "../../constant/Constant";

import {
    useInsuranceCompanyMaster,
    useMotorPolicyTypeMaster,
    useMotorProductMaster,
    useMotorVehicleCategoryMaster,
    useMotorVehicleClassMaster,
} from "../../CommonCode/useQuery";


const MotorAddonRuleCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);



    // FORM STATE

    const [addonRule, setAddonRule] = useState({

        addonId: "",

        insuranceCompanyId: "",
        productId: "",
        policyTypeId: "",
        vehicleCategoryId: "",
        vehicleClassId: "",

        minVehicleAgeMonths: "",
        maxVehicleAgeMonths: "",

        minIdv: "",
        maxIdv: "",

        rateType: "",
        rateValue: "",

        effectiveFrom: "",
        effectiveTo: "",

        description: "",

        isActive: "Active",

    });



    // MASTER DATA

    const {
        data: InsuranceCompanyMaster = [],
    } = useInsuranceCompanyMaster();


    const {
        data: MotorProductMaster = [],
    } = useMotorProductMaster();


    const {
        data: MotorPolicyTypeMaster = [],
    } = useMotorPolicyTypeMaster();


    const {
        data: MotorVehicleCategoryMaster = [],
    } = useMotorVehicleCategoryMaster();


    const {
        data: MotorVehicleClassMaster = [],
    } = useMotorVehicleClassMaster();



    // ADDON MASTER

    const [AddonMaster, setAddonMaster] = useState([]);


    const fetchAddonMaster = useCallback(async () => {

        try {

            const response =
                await axioslogin.get(
                    `/motor/addon/getactive`
                );


            if (response?.data?.success === 1) {

                setAddonMaster(
                    response?.data?.data || []
                );

            } else {

                errorNotify(
                    response?.data?.message ||
                    "Failed to fetch addons"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch addons"
            );

        }

    }, []);


    useEffect(() => {

        fetchAddonMaster();

    }, [fetchAddonMaster]);



    // ACTIVE MASTER DATA

    const ActiveAddonMaster =
        AddonMaster
            ?.filter(
                item =>
                    Number(item?.is_active ?? 1) === 1
            )
            ?.map(item => ({
                id: item.addon_id,
                label:
                    `${item?.addon_code || ""} - ` +
                    `${item?.addon_name || ""}`,
            })) || [];


    const ActiveInsuranceCompanyMaster =
        InsuranceCompanyMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.insurance_company_id,
                label: item.company_name,
            })) || [];


    const ActiveProductMaster =
        MotorProductMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.product_id,
                label: item.product_name,
            })) || [];


    const ActivePolicyTypeMaster =
        MotorPolicyTypeMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.policy_type_id,
                label: item.policy_type_name,
            })) || [];


    const ActiveVehicleCategoryMaster =
        MotorVehicleCategoryMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.vehicle_category_id,
                label: item.category_name,
            })) || [];


    const ActiveVehicleClassMaster =
        MotorVehicleClassMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.vehicle_class_id,
                label: item.class_name,
            })) || [];



    // RATE TYPE OPTIONS

    const RateTypeOptions = [

        {
            id: "PERCENTAGE",
            label: "Percentage",
        },

        {
            id: "FIXED",
            label: "Fixed",
        },

    ];



    // SET FIELD

    const set = field => event => {

        setAddonRule(prev => ({

            ...prev,

            [field]:
                event?.target?.value !== undefined
                    ? event.target.value
                    : event,

        }));

    };



    // EDIT FETCH

    const fetchAddonRule = async id => {

        try {

            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/addon-rule/getbyid/${id}`
                );


            if (response?.data?.success === 1) {

                const data =
                    response.data.data;


                setAddonRule({

                    addonId:
                        data?.addon_id || "",

                    insuranceCompanyId:
                        data?.insurance_company_id || "",

                    productId:
                        data?.product_id || "",

                    policyTypeId:
                        data?.policy_type_id || "",

                    vehicleCategoryId:
                        data?.vehicle_category_id || "",

                    vehicleClassId:
                        data?.vehicle_class_id || "",

                    minVehicleAgeMonths:
                        data?.min_vehicle_age_months ?? "",

                    maxVehicleAgeMonths:
                        data?.max_vehicle_age_months ?? "",

                    minIdv:
                        data?.min_idv ?? "",

                    maxIdv:
                        data?.max_idv ?? "",

                    rateType:
                        data?.rate_type || "",

                    rateValue:
                        data?.rate_value ?? "",

                    effectiveFrom:
                        data?.effective_from
                            ? data.effective_from.substring(0, 10)
                            : "",

                    effectiveTo:
                        data?.effective_to
                            ? data.effective_to.substring(0, 10)
                            : "",

                    description:
                        data?.description || "",

                    isActive:
                        Number(data?.is_active) === 1
                            ? "Active"
                            : "Inactive",

                });


            } else {

                errorNotify(
                    response?.data?.message ||
                    "Failed to fetch addon rule"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch addon rule"
            );

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        if (editId) {

            setMode("edit");

            fetchAddonRule(editId);

        }

    }, [editId]);



    // VALIDATION

    const validate = () => {


        // ADDON

        if (!addonRule.addonId) {

            errorNotify(
                "Addon is required"
            );

            return false;

        }


        if (
            isNaN(addonRule.addonId) ||
            Number(addonRule.addonId) <= 0
        ) {

            errorNotify(
                "Addon must be a valid value"
            );

            return false;

        }



        // PRODUCT

        if (!addonRule.productId) {

            errorNotify(
                "Product is required"
            );

            return false;

        }


        if (
            isNaN(addonRule.productId) ||
            Number(addonRule.productId) <= 0
        ) {

            errorNotify(
                "Product must be a valid value"
            );

            return false;

        }



        // RATE TYPE

        if (!addonRule.rateType) {

            errorNotify(
                "Rate type is required"
            );

            return false;

        }


        if (
            !["PERCENTAGE", "FIXED"]
                .includes(addonRule.rateType)
        ) {

            errorNotify(
                "Rate type must be Percentage or Fixed"
            );

            return false;

        }



        // RATE VALUE

        if (
            addonRule.rateValue === undefined ||
            addonRule.rateValue === null ||
            addonRule.rateValue === "" ||
            isNaN(addonRule.rateValue) ||
            Number(addonRule.rateValue) < 0
        ) {

            errorNotify(
                "Valid rate value is required"
            );

            return false;

        }


        if (
            addonRule.rateType === "PERCENTAGE" &&
            Number(addonRule.rateValue) > 100
        ) {

            errorNotify(
                "Percentage rate value cannot exceed 100"
            );

            return false;

        }



        // MIN VEHICLE AGE

        if (
            addonRule.minVehicleAgeMonths !== "" &&
            addonRule.minVehicleAgeMonths !== null &&
            (
                isNaN(
                    addonRule.minVehicleAgeMonths
                ) ||
                Number(
                    addonRule.minVehicleAgeMonths
                ) < 0
            )
        ) {

            errorNotify(
                "Invalid minimum vehicle age"
            );

            return false;

        }



        // MAX VEHICLE AGE

        if (
            addonRule.maxVehicleAgeMonths !== "" &&
            addonRule.maxVehicleAgeMonths !== null &&
            (
                isNaN(
                    addonRule.maxVehicleAgeMonths
                ) ||
                Number(
                    addonRule.maxVehicleAgeMonths
                ) < 0
            )
        ) {

            errorNotify(
                "Invalid maximum vehicle age"
            );

            return false;

        }



        // AGE RANGE

        if (
            addonRule.minVehicleAgeMonths !== "" &&
            addonRule.maxVehicleAgeMonths !== "" &&
            Number(
                addonRule.maxVehicleAgeMonths
            ) <
            Number(
                addonRule.minVehicleAgeMonths
            )
        ) {

            errorNotify(
                "Max vehicle age must be greater than or equal to Min age"
            );

            return false;

        }



        // MIN IDV

        if (
            addonRule.minIdv !== "" &&
            addonRule.minIdv !== null &&
            (
                isNaN(addonRule.minIdv) ||
                Number(addonRule.minIdv) < 0
            )
        ) {

            errorNotify(
                "Invalid minimum IDV"
            );

            return false;

        }



        // MAX IDV

        if (
            addonRule.maxIdv !== "" &&
            addonRule.maxIdv !== null &&
            (
                isNaN(addonRule.maxIdv) ||
                Number(addonRule.maxIdv) < 0
            )
        ) {

            errorNotify(
                "Invalid maximum IDV"
            );

            return false;

        }



        // IDV RANGE

        if (
            addonRule.minIdv !== "" &&
            addonRule.maxIdv !== "" &&
            Number(addonRule.maxIdv) <
            Number(addonRule.minIdv)
        ) {

            errorNotify(
                "Max IDV must be greater than or equal to Min IDV"
            );

            return false;

        }



        // EFFECTIVE FROM

        if (!addonRule.effectiveFrom) {

            errorNotify(
                "Effective from is required"
            );

            return false;

        }



        // EFFECTIVE TO

        if (
            addonRule.effectiveTo &&
            new Date(addonRule.effectiveTo) <
            new Date(addonRule.effectiveFrom)
        ) {

            errorNotify(
                "Effective to cannot be earlier than Effective from"
            );

            return false;

        }



        // DESCRIPTION

        if (
            addonRule.description &&
            addonRule.description.length > 500
        ) {

            errorNotify(
                "Description cannot exceed 500 characters"
            );

            return false;

        }


        return true;

    };



    // CANCEL

    const handleCancel = useCallback(() => {

        setAddonRule({

            addonId: "",

            insuranceCompanyId: "",
            productId: "",
            policyTypeId: "",
            vehicleCategoryId: "",
            vehicleClassId: "",

            minVehicleAgeMonths: "",
            maxVehicleAgeMonths: "",

            minIdv: "",
            maxIdv: "",

            rateType: "",
            rateValue: "",

            effectiveFrom: "",
            effectiveTo: "",

            description: "",

            isActive: "Active",

        });


        navigate(".", {

            replace: true,

            state: null,

        });

    }, [navigate]);



    // CLOSE

    const handleClose = () => {

        navigate("/home/settings");

    };



    // VIEW

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {

                state: {

                    title:
                        "Motor Addon Rule Master",

                    type:
                        "motoraddonrule",

                    idField:
                        "addon_rule_id",

                    editRoute:
                        "motoraddonrule",

                    columns: [

                        {
                            field:
                                "addon_code",

                            headerName:
                                "Addon Code",
                        },

                        {
                            field:
                                "addon_name",

                            headerName:
                                "Addon Name",
                        },

                        {
                            field:
                                "insurance_company_name",

                            headerName:
                                "Insurance Company",
                        },

                        {
                            field:
                                "product_name",

                            headerName:
                                "Product",
                        },

                        {
                            field:
                                "policy_type_name",

                            headerName:
                                "Policy Type",
                        },

                        {
                            field:
                                "category_name",

                            headerName:
                                "Vehicle Category",
                        },

                        {
                            field:
                                "class_name",

                            headerName:
                                "Vehicle Class",
                        },

                        {
                            field:
                                "min_vehicle_age_months",

                            headerName:
                                "Min Age (Months)",
                        },

                        {
                            field:
                                "max_vehicle_age_months",

                            headerName:
                                "Max Age (Months)",
                        },

                        {
                            field:
                                "min_idv",

                            headerName:
                                "Min IDV",
                        },

                        {
                            field:
                                "max_idv",

                            headerName:
                                "Max IDV",
                        },

                        {
                            field:
                                "rate_type",

                            headerName:
                                "Rate Type",
                        },

                        {
                            field:
                                "rate_value",

                            headerName:
                                "Rate Value",
                        },

                        {
                            field:
                                "effective_from",

                            headerName:
                                "Effective From",
                            type: "date"
                        },

                        {
                            field:
                                "effective_to",

                            headerName:
                                "Effective To",
                            type: "date"
                        },

                        {
                            field:
                                "description",

                            headerName:
                                "Description",
                        },

                        {
                            field:
                                "is_active",

                            headerName:
                                "Status",

                            type:
                                "status",
                        },

                    ],

                },

            }
        );

    };



    // SAVE

    const handleSave = async () => {

        if (!validate()) return;


        const payload = {

            addon_id:
                Number(
                    addonRule.addonId
                ),


            insurance_company_id:
                addonRule.insuranceCompanyId
                    ? Number(
                        addonRule.insuranceCompanyId
                    )
                    : null,


            product_id:
                Number(
                    addonRule.productId
                ),


            policy_type_id:
                addonRule.policyTypeId
                    ? Number(
                        addonRule.policyTypeId
                    )
                    : null,


            vehicle_category_id:
                addonRule.vehicleCategoryId
                    ? Number(
                        addonRule.vehicleCategoryId
                    )
                    : null,


            vehicle_class_id:
                addonRule.vehicleClassId
                    ? Number(
                        addonRule.vehicleClassId
                    )
                    : null,


            min_vehicle_age_months:
                addonRule.minVehicleAgeMonths !== ""
                    ? Number(
                        addonRule.minVehicleAgeMonths
                    )
                    : null,


            max_vehicle_age_months:
                addonRule.maxVehicleAgeMonths !== ""
                    ? Number(
                        addonRule.maxVehicleAgeMonths
                    )
                    : null,


            min_idv:
                addonRule.minIdv !== ""
                    ? Number(
                        addonRule.minIdv
                    )
                    : null,


            max_idv:
                addonRule.maxIdv !== ""
                    ? Number(
                        addonRule.maxIdv
                    )
                    : null,


            rate_type:
                addonRule.rateType,


            rate_value:
                Number(
                    addonRule.rateValue
                ),


            effective_from:
                addonRule.effectiveFrom,


            effective_to:
                addonRule.effectiveTo || null,


            description:
                addonRule.description
                    ? addonRule.description.trim()
                    : null,


            is_active:
                String(
                    addonRule?.isActive
                ) === "Active"
                    ? 1
                    : 0,

        };


        try {

            setLoading(true);

            let response;


            if (mode === "edit") {

                response =
                    await axioslogin.put(
                        `/motor/addon-rule/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/addon-rule/create`,
                        payload
                    );

            }


            if (response?.data?.success === 1) {

                successNotify(
                    response?.data?.message ||
                    `Addon rule ${mode === "edit"
                        ? "updated"
                        : "created"
                    } successfully`
                );


                handleCancel();


                if (mode === "edit") {

                    handleView();

                }

            } else {

                errorNotify(
                    response?.data?.message ||
                    "Failed to save addon rule"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save addon rule"
            );

        } finally {

            setLoading(false);

        }

    };



    // UI

    return (

        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Motor Addon Rule"
                        : "Motor Addon Rule Creation"
                }
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                    }}
                >

                    <Box sx={{ width: "70%" }}>


                        {/* ADDON */}

                        <FormRow
                            label="Addon"
                            required
                        >

                            <SelectLg
                                options={
                                    ActiveAddonMaster
                                }

                                value={
                                    addonRule.addonId
                                }

                                onChange={set(
                                    "addonId"
                                )}
                            />

                        </FormRow>



                        {/* INSURANCE COMPANY */}

                        <FormRow
                            label="Insurance Company"
                        >

                            <SelectLg
                                options={
                                    ActiveInsuranceCompanyMaster
                                }

                                value={
                                    addonRule.insuranceCompanyId
                                }

                                onChange={set(
                                    "insuranceCompanyId"
                                )}
                            />

                        </FormRow>



                        {/* PRODUCT */}

                        <FormRow
                            label="Product"
                            required
                        >

                            <SelectLg
                                options={
                                    ActiveProductMaster
                                }

                                value={
                                    addonRule.productId
                                }

                                onChange={set(
                                    "productId"
                                )}
                            />

                        </FormRow>



                        {/* POLICY TYPE */}

                        <FormRow
                            label="Policy Type"
                        >

                            <SelectLg
                                options={
                                    ActivePolicyTypeMaster
                                }

                                value={
                                    addonRule.policyTypeId
                                }

                                onChange={set(
                                    "policyTypeId"
                                )}
                            />

                        </FormRow>



                        {/* VEHICLE CATEGORY */}

                        <FormRow
                            label="Vehicle Category"
                        >

                            <SelectLg
                                options={
                                    ActiveVehicleCategoryMaster
                                }

                                value={
                                    addonRule.vehicleCategoryId
                                }

                                onChange={set(
                                    "vehicleCategoryId"
                                )}
                            />

                        </FormRow>



                        {/* VEHICLE CLASS */}

                        <FormRow
                            label="Vehicle Class"
                        >

                            <SelectLg
                                options={
                                    ActiveVehicleClassMaster
                                }

                                value={
                                    addonRule.vehicleClassId
                                }

                                onChange={set(
                                    "vehicleClassId"
                                )}
                            />

                        </FormRow>



                        {/* MIN VEHICLE AGE */}

                        <FormRow
                            label="Min Vehicle Age (Months)"
                        >

                            <InputLg
                                type="number"

                                value={
                                    addonRule.minVehicleAgeMonths
                                }

                                onChange={set(
                                    "minVehicleAgeMonths"
                                )}
                            />

                        </FormRow>



                        {/* MAX VEHICLE AGE */}

                        <FormRow
                            label="Max Vehicle Age (Months)"
                        >

                            <InputLg
                                type="number"

                                value={
                                    addonRule.maxVehicleAgeMonths
                                }

                                onChange={set(
                                    "maxVehicleAgeMonths"
                                )}
                            />

                        </FormRow>



                        {/* MIN IDV */}

                        <FormRow
                            label="Min IDV"
                        >

                            <InputLg
                                type="number"

                                value={
                                    addonRule.minIdv
                                }

                                onChange={set(
                                    "minIdv"
                                )}
                            />

                        </FormRow>



                        {/* MAX IDV */}

                        <FormRow
                            label="Max IDV"
                        >

                            <InputLg
                                type="number"

                                value={
                                    addonRule.maxIdv
                                }

                                onChange={set(
                                    "maxIdv"
                                )}
                            />

                        </FormRow>



                        {/* RATE TYPE */}

                        <FormRow
                            label="Rate Type"
                            required
                        >

                            <SelectLg
                                options={
                                    RateTypeOptions
                                }

                                value={
                                    addonRule.rateType
                                }

                                onChange={set(
                                    "rateType"
                                )}
                            />

                        </FormRow>



                        {/* RATE VALUE */}

                        <FormRow
                            label="Rate Value"
                            required
                        >

                            <InputLg
                                type="number"

                                value={
                                    addonRule.rateValue
                                }

                                onChange={set(
                                    "rateValue"
                                )}
                            />

                        </FormRow>



                        {/* EFFECTIVE FROM */}

                        <FormRow
                            label="Effective From"
                            required
                        >

                            <InputLg
                                type="date"

                                value={
                                    addonRule.effectiveFrom
                                }

                                onChange={set(
                                    "effectiveFrom"
                                )}
                            />

                        </FormRow>



                        {/* EFFECTIVE TO */}

                        <FormRow
                            label="Effective To"
                        >

                            <InputLg
                                type="date"

                                value={
                                    addonRule.effectiveTo
                                }

                                onChange={set(
                                    "effectiveTo"
                                )}
                            />

                        </FormRow>



                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg
                                value={
                                    addonRule.description
                                }

                                onChange={set(
                                    "description"
                                )}
                            />

                        </FormRow>



                        {/* STATUS */}

                        <FormRow
                            label="Status"
                        >

                            <Checkbox
                                value={
                                    addonRule.isActive
                                }

                                onChange={set(
                                    "isActive"
                                )}
                            />

                        </FormRow>


                    </Box>

                </Box>


                <div
                    style={{
                        borderTop:
                            "1px solid #e5e7eb",

                        margin:
                            "20px 0",
                    }}
                />


                <ButtonWrapper>

                    <Button
                        onClick={handleSave}
                        disabled={loading}
                    >

                        {loading
                            ? "Saving..."
                            : "Save"}

                    </Button>


                    <Button
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>


                    <Button
                        onClick={handleView}
                    >
                        View
                    </Button>


                    <Button
                        onClick={handleClose}
                    >
                        Close
                    </Button>

                </ButtonWrapper>

            </Panel>

        </Wrapper>

    );

};


export default MotorAddonRuleCreation;