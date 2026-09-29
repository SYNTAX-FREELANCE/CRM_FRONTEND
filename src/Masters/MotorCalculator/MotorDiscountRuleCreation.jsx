import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
} from "../../constant/Constant";

import {
    useInsuranceCompanyMaster,
    useMotorProductMaster,
    useMotorPolicyTypeMaster,
    useMotorVehicleCategoryMaster,
    useMotorVehicleClassMaster,
    useMotorVehicleUsageMaster,
} from "../../CommonCode/useQuery";


const MotorDiscountRuleCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);



    // FORM STATE


    const [discountRule, setDiscountRule] = useState({
        insuranceCompanyId: "",
        productId: "",
        policyTypeId: "",
        vehicleCategoryId: "",
        vehicleClassId: "",
        usageId: "",

        discountType: "",
        discountValue: "",

        minVehicleAgeMonths: "",
        maxVehicleAgeMonths: "",

        claimFreeRequired: "No",

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

    const {
        data: MotorVehicleUsageMaster = [],
    } = useMotorVehicleUsageMaster();



    // MASTER OPTIONS


    const InsuranceCompanyOptions =
        InsuranceCompanyMaster
            ?.filter(
                item => Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.insurance_company_id,
                label: item.company_name,
            })) || [];


    const ProductOptions =
        MotorProductMaster
            ?.filter(
                item => Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.product_id,
                label: item.product_name,
            })) || [];


    const PolicyTypeOptions =
        MotorPolicyTypeMaster
            ?.filter(
                item => Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.policy_type_id,
                label: item.policy_type_name,
            })) || [];


    const VehicleCategoryOptions =
        MotorVehicleCategoryMaster
            ?.filter(
                item => Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.vehicle_category_id,
                label: item.category_name,
            })) || [];


    const VehicleClassOptions =
        MotorVehicleClassMaster
            ?.filter(
                item => Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.vehicle_class_id,
                label: item.class_name,
            })) || [];


    const VehicleUsageOptions =
        MotorVehicleUsageMaster
            ?.filter(
                item => Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.usage_id,
                label: item.usage_name,
            })) || [];


    const DiscountTypeOptions = [
        {
            id: "PERCENTAGE",
            label: "Percentage",
        },
        {
            id: "FIXED",
            label: "Fixed",
        },
    ];


    const ClaimFreeOptions = [
        {
            id: "Yes",
            label: "Yes",
        },
        {
            id: "No",
            label: "No",
        },
    ];



    // SET FIELD


    const set = field => event => {

        setDiscountRule(prev => ({
            ...prev,
            [field]:
                event?.target?.value !== undefined
                    ? event.target.value
                    : event,
        }));

    };



    // EDIT FETCH


    useEffect(() => {

        if (editId) {

            setMode("edit");

            fetchDiscountRule(editId);

        }

    }, [editId]);


    const fetchDiscountRule = async id => {

        try {

            setLoading(true);

            const response = await axioslogin.get(
                `/motor/discount-rule/getbyid/${id}`
            );


            if (response?.data?.success === 1) {

                const data =
                    response.data.data;


                setDiscountRule({

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

                    usageId:
                        data?.usage_id || "",


                    discountType:
                        data?.discount_type || "",

                    discountValue:
                        data?.discount_value ?? "",


                    minVehicleAgeMonths:
                        data?.min_vehicle_age_months ?? "",

                    maxVehicleAgeMonths:
                        data?.max_vehicle_age_months ?? "",


                    claimFreeRequired:
                        Number(data?.claim_free_required) === 1
                            ? "Yes"
                            : "No",


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
                    "Failed to fetch discount rule"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch discount rule"
            );

        } finally {

            setLoading(false);

        }

    };



    // VALIDATION


    const validate = () => {


        // Product
        if (!discountRule.productId) {

            errorNotify(
                "Product is required"
            );

            return false;

        }


        if (
            isNaN(discountRule.productId) ||
            Number(discountRule.productId) <= 0
        ) {

            errorNotify(
                "Product must be a valid value"
            );

            return false;

        }


        // Optional references

        const optionalReferences = [

            {
                value: discountRule.insuranceCompanyId,
                message: "Insurance company must be a valid value",
            },

            {
                value: discountRule.policyTypeId,
                message: "Policy type must be a valid value",
            },

            {
                value: discountRule.vehicleCategoryId,
                message: "Vehicle category must be a valid value",
            },

            {
                value: discountRule.vehicleClassId,
                message: "Vehicle class must be a valid value",
            },

            {
                value: discountRule.usageId,
                message: "Vehicle usage must be a valid value",
            },

        ];


        for (const item of optionalReferences) {

            if (
                item.value !== undefined &&
                item.value !== null &&
                item.value !== ""
            ) {

                if (
                    isNaN(item.value) ||
                    Number(item.value) <= 0
                ) {

                    errorNotify(item.message);

                    return false;

                }

            }

        }


        // Discount Type

        if (
            !discountRule.discountType ||
            !["PERCENTAGE", "FIXED"].includes(
                discountRule.discountType
            )
        ) {

            errorNotify(
                "Discount type must be selected"
            );

            return false;

        }


        // Discount Value

        if (
            discountRule.discountValue === undefined ||
            discountRule.discountValue === null ||
            discountRule.discountValue === "" ||
            isNaN(discountRule.discountValue) ||
            Number(discountRule.discountValue) < 0
        ) {

            errorNotify(
                "Valid discount value is required"
            );

            return false;

        }


        // Percentage

        if (
            discountRule.discountType === "PERCENTAGE" &&
            Number(discountRule.discountValue) > 100
        ) {

            errorNotify(
                "Percentage discount cannot exceed 100"
            );

            return false;

        }


        // Minimum vehicle age

        if (
            discountRule.minVehicleAgeMonths !== undefined &&
            discountRule.minVehicleAgeMonths !== null &&
            discountRule.minVehicleAgeMonths !== ""
        ) {

            if (
                isNaN(discountRule.minVehicleAgeMonths) ||
                Number(discountRule.minVehicleAgeMonths) < 0
            ) {

                errorNotify(
                    "Invalid minimum vehicle age"
                );

                return false;

            }

        }


        // Maximum vehicle age

        if (
            discountRule.maxVehicleAgeMonths !== undefined &&
            discountRule.maxVehicleAgeMonths !== null &&
            discountRule.maxVehicleAgeMonths !== ""
        ) {

            if (
                isNaN(discountRule.maxVehicleAgeMonths) ||
                Number(discountRule.maxVehicleAgeMonths) < 0
            ) {

                errorNotify(
                    "Invalid maximum vehicle age"
                );

                return false;

            }

        }


        // Age comparison

        if (
            discountRule.minVehicleAgeMonths !== "" &&
            discountRule.maxVehicleAgeMonths !== "" &&
            discountRule.minVehicleAgeMonths !== null &&
            discountRule.maxVehicleAgeMonths !== null &&
            Number(discountRule.maxVehicleAgeMonths) <
            Number(discountRule.minVehicleAgeMonths)
        ) {

            errorNotify(
                "Maximum vehicle age cannot be less than minimum vehicle age"
            );

            return false;

        }


        // Effective From

        if (!discountRule.effectiveFrom) {

            errorNotify(
                "Effective from is required"
            );

            return false;

        }


        // Effective To

        if (
            discountRule.effectiveTo &&
            new Date(discountRule.effectiveTo) <
            new Date(discountRule.effectiveFrom)
        ) {

            errorNotify(
                "Effective to cannot be before effective from"
            );

            return false;

        }


        // Description

        if (
            discountRule.description &&
            discountRule.description.length > 500
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

        setDiscountRule({

            insuranceCompanyId: "",
            productId: "",
            policyTypeId: "",
            vehicleCategoryId: "",
            vehicleClassId: "",
            usageId: "",

            discountType: "",
            discountValue: "",

            minVehicleAgeMonths: "",
            maxVehicleAgeMonths: "",

            claimFreeRequired: "No",

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
                        "Motor Discount Rule Master",

                    type:
                        "motordiscountrule",

                    idField:
                        "discount_rule_id",

                    editRoute:
                        "motordiscountrule",

                    columns: [

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
                                "usage_name",

                            headerName:
                                "Usage",
                        },

                        {
                            field:
                                "discount_type",

                            headerName:
                                "Discount Type",
                        },

                        {
                            field:
                                "discount_value",

                            headerName:
                                "Discount Value",
                        },

                        {
                            field:
                                "min_vehicle_age_months",

                            headerName:
                                "Min Vehicle Age",
                        },

                        {
                            field:
                                "max_vehicle_age_months",

                            headerName:
                                "Max Vehicle Age",
                        },

                        {
                            field:
                                "claim_free_required",

                            headerName:
                                "Claim Free Required",
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
                            field: "is_active",
                            headerName: "Status",
                            type: "status"
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

            insurance_company_id:
                discountRule.insuranceCompanyId
                    ? Number(discountRule.insuranceCompanyId)
                    : null,

            product_id:
                Number(discountRule.productId),

            policy_type_id:
                discountRule.policyTypeId
                    ? Number(discountRule.policyTypeId)
                    : null,

            vehicle_category_id:
                discountRule.vehicleCategoryId
                    ? Number(discountRule.vehicleCategoryId)
                    : null,

            vehicle_class_id:
                discountRule.vehicleClassId
                    ? Number(discountRule.vehicleClassId)
                    : null,

            usage_id:
                discountRule.usageId
                    ? Number(discountRule.usageId)
                    : null,

            discount_type:
                discountRule.discountType,

            discount_value:
                Number(discountRule.discountValue),

            min_vehicle_age_months:
                discountRule.minVehicleAgeMonths !== ""
                    ? Number(
                        discountRule.minVehicleAgeMonths
                    )
                    : null,

            max_vehicle_age_months:
                discountRule.maxVehicleAgeMonths !== ""
                    ? Number(
                        discountRule.maxVehicleAgeMonths
                    )
                    : null,

            claim_free_required:
                discountRule.claimFreeRequired === "Yes"
                    ? 1
                    : 0,

            effective_from:
                discountRule.effectiveFrom,

            effective_to:
                discountRule.effectiveTo || null,

            description:
                discountRule.description || null,

            isActive:
                String(discountRule?.isActive) === "Active"
                    ? 1
                    : 0

        };


        try {

            setLoading(true);

            let response;


            if (mode === "edit") {

                response =
                    await axioslogin.put(
                        `/motor/discount-rule/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/discount-rule/create`,
                        payload
                    );

            }


            if (response?.data?.success === 1) {

                successNotify(
                    response?.data?.message ||
                    `Discount rule ${mode === "edit"
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
                    "Failed to save discount rule"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save discount rule"
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
                        ? "Edit Motor Discount Rule"
                        : "Motor Discount Rule Creation"
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


                        {/* INSURANCE COMPANY */}

                        <FormRow
                            label="Insurance Company"
                        >

                            <SelectLg
                                options={
                                    InsuranceCompanyOptions
                                }

                                value={
                                    discountRule.insuranceCompanyId
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
                                    ProductOptions
                                }

                                value={
                                    discountRule.productId
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
                                    PolicyTypeOptions
                                }

                                value={
                                    discountRule.policyTypeId
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
                                    VehicleCategoryOptions
                                }

                                value={
                                    discountRule.vehicleCategoryId
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
                                    VehicleClassOptions
                                }

                                value={
                                    discountRule.vehicleClassId
                                }

                                onChange={set(
                                    "vehicleClassId"
                                )}
                            />

                        </FormRow>


                        {/* USAGE */}

                        <FormRow
                            label="Usage"
                        >

                            <SelectLg
                                options={
                                    VehicleUsageOptions
                                }

                                value={
                                    discountRule.usageId
                                }

                                onChange={set(
                                    "usageId"
                                )}
                            />

                        </FormRow>


                        {/* DISCOUNT TYPE */}

                        <FormRow
                            label="Discount Type"
                            required
                        >

                            <SelectLg
                                options={
                                    DiscountTypeOptions
                                }

                                value={
                                    discountRule.discountType
                                }

                                onChange={set(
                                    "discountType"
                                )}
                            />

                        </FormRow>


                        {/* DISCOUNT VALUE */}

                        <FormRow
                            label="Discount Value"
                            required
                        >

                            <InputLg
                                type="number"

                                value={
                                    discountRule.discountValue
                                }

                                onChange={set(
                                    "discountValue"
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
                                    discountRule.minVehicleAgeMonths
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
                                    discountRule.maxVehicleAgeMonths
                                }

                                onChange={set(
                                    "maxVehicleAgeMonths"
                                )}
                            />

                        </FormRow>


                        {/* CLAIM FREE */}

                        <FormRow
                            label="Claim Free Required"
                        >

                            <SelectLg
                                options={
                                    ClaimFreeOptions
                                }

                                value={
                                    discountRule.claimFreeRequired
                                }

                                onChange={set(
                                    "claimFreeRequired"
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
                                    discountRule.effectiveFrom
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
                                    discountRule.effectiveTo
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
                                    discountRule.description
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
                                    discountRule.isActive
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


export default MotorDiscountRuleCreation;