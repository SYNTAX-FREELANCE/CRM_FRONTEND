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


const MotorZdRateCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);



    // FORM STATE


    const [zdRate, setZdRate] = useState({

        insuranceCompanyId: "",
        productId: "",
        policyTypeId: "",
        vehicleCategoryId: "",
        vehicleClassId: "",

        minAgeMonths: "",
        maxAgeMonths: "",

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



    // ACTIVE MASTER DATA


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

        setZdRate(prev => ({

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

            fetchZdRate(editId);

        }

    }, [editId]);


    const fetchZdRate = async id => {

        try {

            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/zd-rate/getbyid/${id}`
                );


            if (response?.data?.success === 1) {

                const data =
                    response.data.data;


                setZdRate({

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

                    minAgeMonths:
                        data?.min_age_months ?? "",

                    maxAgeMonths:
                        data?.max_age_months ?? "",

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
                    "Failed to fetch ZD rate"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch ZD rate"
            );

        } finally {

            setLoading(false);

        }

    };



    // VALIDATION


    const validate = () => {


        // Product


        if (!zdRate.productId) {

            errorNotify(
                "Product is required"
            );

            return false;

        }


        if (
            isNaN(zdRate.productId) ||
            Number(zdRate.productId) <= 0
        ) {

            errorNotify(
                "Product must be a valid value"
            );

            return false;

        }



        // Rate Type


        if (!zdRate.rateType) {

            errorNotify(
                "Rate type is required"
            );

            return false;

        }


        if (
            !["PERCENTAGE", "FIXED"]
                .includes(zdRate.rateType)
        ) {

            errorNotify(
                "Rate type must be Percentage or Fixed"
            );

            return false;

        }



        // Rate Value


        if (
            zdRate.rateValue === undefined ||
            zdRate.rateValue === null ||
            zdRate.rateValue === "" ||
            isNaN(zdRate.rateValue) ||
            Number(zdRate.rateValue) < 0
        ) {

            errorNotify(
                "Valid rate value is required"
            );

            return false;

        }


        if (
            zdRate.rateType === "PERCENTAGE" &&
            Number(zdRate.rateValue) > 100
        ) {

            errorNotify(
                "Percentage rate value cannot exceed 100"
            );

            return false;

        }



        // MIN AGE


        if (
            zdRate.minAgeMonths !== "" &&
            zdRate.minAgeMonths !== null &&
            (
                isNaN(zdRate.minAgeMonths) ||
                Number(zdRate.minAgeMonths) < 0
            )
        ) {

            errorNotify(
                "Invalid minimum age"
            );

            return false;

        }



        // MAX AGE


        if (
            zdRate.maxAgeMonths !== "" &&
            zdRate.maxAgeMonths !== null &&
            (
                isNaN(zdRate.maxAgeMonths) ||
                Number(zdRate.maxAgeMonths) < 0
            )
        ) {

            errorNotify(
                "Invalid maximum age"
            );

            return false;

        }



        // AGE RANGE


        if (
            zdRate.minAgeMonths !== "" &&
            zdRate.maxAgeMonths !== "" &&
            Number(zdRate.maxAgeMonths) <
            Number(zdRate.minAgeMonths)
        ) {

            errorNotify(
                "Max age must be greater than or equal to Min age"
            );

            return false;

        }



        // EFFECTIVE FROM


        if (!zdRate.effectiveFrom) {

            errorNotify(
                "Effective from is required"
            );

            return false;

        }



        // EFFECTIVE TO


        if (
            zdRate.effectiveTo &&
            new Date(zdRate.effectiveTo) <
            new Date(zdRate.effectiveFrom)
        ) {

            errorNotify(
                "Effective to cannot be earlier than Effective from"
            );

            return false;

        }



        // DESCRIPTION


        if (
            zdRate.description &&
            zdRate.description.length > 500
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

        setZdRate({

            insuranceCompanyId: "",
            productId: "",
            policyTypeId: "",
            vehicleCategoryId: "",
            vehicleClassId: "",

            minAgeMonths: "",
            maxAgeMonths: "",

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
                        "Motor ZD Rate Master",

                    type:
                        "motorzdrate",

                    idField:
                        "zd_rate_id",

                    editRoute:
                        "motorzdrate",

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
                                "min_age_months",

                            headerName:
                                "Min Age (Months)",
                        },

                        {
                            field:
                                "max_age_months",

                            headerName:
                                "Max Age (Months)",
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
                            field: "is_active",

                            headerName: "Status",

                            type: "status",
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
                zdRate.insuranceCompanyId
                    ? Number(
                        zdRate.insuranceCompanyId
                    )
                    : null,


            product_id:
                Number(
                    zdRate.productId
                ),


            policy_type_id:
                zdRate.policyTypeId
                    ? Number(
                        zdRate.policyTypeId
                    )
                    : null,


            vehicle_category_id:
                zdRate.vehicleCategoryId
                    ? Number(
                        zdRate.vehicleCategoryId
                    )
                    : null,


            vehicle_class_id:
                zdRate.vehicleClassId
                    ? Number(
                        zdRate.vehicleClassId
                    )
                    : null,


            min_age_months:
                zdRate.minAgeMonths !== ""
                    ? Number(
                        zdRate.minAgeMonths
                    )
                    : null,


            max_age_months:
                zdRate.maxAgeMonths !== ""
                    ? Number(
                        zdRate.maxAgeMonths
                    )
                    : null,


            rate_type:
                zdRate.rateType,


            rate_value:
                Number(
                    zdRate.rateValue
                ),


            effective_from:
                zdRate.effectiveFrom,


            effective_to:
                zdRate.effectiveTo || null,


            description:
                zdRate.description
                    ? zdRate.description.trim()
                    : null,


            is_active:
                String(
                    zdRate?.isActive
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
                        `/motor/zd-rate/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/zd-rate/create`,
                        payload
                    );

            }


            if (response?.data?.success === 1) {

                successNotify(
                    response?.data?.message ||
                    `ZD rate ${mode === "edit"
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
                    "Failed to save ZD rate"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save ZD rate"
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
                        ? "Edit Motor ZD Rate"
                        : "Motor ZD Rate Creation"
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
                                    ActiveInsuranceCompanyMaster
                                }

                                value={
                                    zdRate.insuranceCompanyId
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
                                    zdRate.productId
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
                                    zdRate.policyTypeId
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
                                    zdRate.vehicleCategoryId
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
                                    zdRate.vehicleClassId
                                }

                                onChange={set(
                                    "vehicleClassId"
                                )}
                            />

                        </FormRow>



                        {/* MIN AGE */}

                        <FormRow
                            label="Min Age (Months)"
                        >

                            <InputLg
                                type="number"

                                value={
                                    zdRate.minAgeMonths
                                }

                                onChange={set(
                                    "minAgeMonths"
                                )}
                            />

                        </FormRow>



                        {/* MAX AGE */}

                        <FormRow
                            label="Max Age (Months)"
                        >

                            <InputLg
                                type="number"

                                value={
                                    zdRate.maxAgeMonths
                                }

                                onChange={set(
                                    "maxAgeMonths"
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
                                    zdRate.rateType
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
                                    zdRate.rateValue
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
                                    zdRate.effectiveFrom
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
                                    zdRate.effectiveTo
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
                                    zdRate.description
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
                                    zdRate.isActive
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


export default MotorZdRateCreation;