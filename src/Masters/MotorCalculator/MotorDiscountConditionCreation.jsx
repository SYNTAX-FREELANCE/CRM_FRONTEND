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

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
} from "../../constant/Constant";

import {
    useMotorDiscountRuleMaster,
} from "../../CommonCode/useQuery";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";


const MotorDiscountConditionCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);



    // FORM STATE


    const [discountCondition, setDiscountCondition] = useState({
        discountRuleId: "",
        conditionType: "",
        conditionOperator: "",
        conditionValue: "",
        description: "",
        isActive: "Active"
    });



    // DISCOUNT RULE MASTER


    const {
        data: DiscountRuleMaster = [],
    } = useMotorDiscountRuleMaster();


    const ActiveDiscountRuleMaster =
        DiscountRuleMaster
            ?.filter(
                item =>
                    Number(item?.is_active) === 1
            )
            ?.map(item => ({
                id: item.discount_rule_id,

                label:
                    `${item.discount_rule_id} - ` +
                    `${item?.product_name || "Product"} - ` +
                    `${item?.policy_type_name || "Policy Type"} - ` +
                    `${item?.discount_type || ""} ` +
                    `${item?.discount_value ?? ""}`,
            })) || [];



    // CONDITION TYPE OPTIONS


    const ConditionTypeOptions = [
        {
            id: "VEHICLE_AGE",
            label: "Vehicle Age",
        },
        {
            id: "CLAIM_COUNT",
            label: "Claim Count",
        },
        {
            id: "POLICY_TYPE",
            label: "Policy Type",
        },
        {
            id: "VEHICLE_CATEGORY",
            label: "Vehicle Category",
        },
        {
            id: "VEHICLE_CLASS",
            label: "Vehicle Class",
        },
        {
            id: "USAGE",
            label: "Usage",
        },
        {
            id: "CUSTOMER_TYPE",
            label: "Customer Type",
        },
    ];



    // OPERATOR OPTIONS


    const ConditionOperatorOptions = [
        {
            id: "=",
            label: "Equals (=)",
        },
        {
            id: "!=",
            label: "Not Equals (!=)",
        },
        {
            id: ">",
            label: "Greater Than (>)",
        },
        {
            id: ">=",
            label: "Greater Than or Equal (>=)",
        },
        {
            id: "<",
            label: "Less Than (<)",
        },
        {
            id: "<=",
            label: "Less Than or Equal (<=)",
        },
        {
            id: "IN",
            label: "In",
        },
        {
            id: "NOT IN",
            label: "Not In",
        },
    ];



    // SET FIELD


    const set = field => event => {

        setDiscountCondition(prev => ({
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

            fetchDiscountCondition(editId);

        }

    }, [editId]);


    const fetchDiscountCondition = async id => {

        try {

            setLoading(true);

            const response =
                await axioslogin.get(
                    `/motor/discount-condition/getbyid/${id}`
                );


            if (response?.data?.success === 1) {

                const data =
                    response.data.data;


                setDiscountCondition({

                    discountRuleId:
                        data?.discount_rule_id || "",

                    conditionType:
                        data?.condition_type || "",

                    conditionOperator:
                        data?.condition_operator || "",

                    conditionValue:
                        data?.condition_value || "",

                    description:
                        data?.description || "",

                    isActive: Number(data?.is_active) === 1 ? "Active" : "Inactive"

                });


            } else {

                errorNotify(
                    response?.data?.message ||
                    "Failed to fetch discount condition"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch discount condition"
            );

        } finally {

            setLoading(false);

        }

    };



    // VALIDATION


    const validate = () => {


        // Discount Rule

        if (!discountCondition.discountRuleId) {

            errorNotify(
                "Discount rule is required"
            );

            return false;

        }


        if (
            isNaN(discountCondition.discountRuleId) ||
            Number(discountCondition.discountRuleId) <= 0
        ) {

            errorNotify(
                "Discount rule must be a valid value"
            );

            return false;

        }


        // Condition Type

        if (
            !discountCondition.conditionType ||
            typeof discountCondition.conditionType !==
            "string"
        ) {

            errorNotify(
                "Condition type is required"
            );

            return false;

        }


        if (
            discountCondition.conditionType.length > 50
        ) {

            errorNotify(
                "Condition type cannot exceed 50 characters"
            );

            return false;

        }


        // Condition Operator

        if (
            !discountCondition.conditionOperator ||
            typeof discountCondition.conditionOperator !==
            "string"
        ) {

            errorNotify(
                "Condition operator is required"
            );

            return false;

        }


        if (
            discountCondition.conditionOperator.length > 20
        ) {

            errorNotify(
                "Condition operator cannot exceed 20 characters"
            );

            return false;

        }


        // Condition Value

        if (
            discountCondition.conditionValue ===
            undefined ||
            discountCondition.conditionValue ===
            null ||
            discountCondition.conditionValue === ""
        ) {

            errorNotify(
                "Condition value is required"
            );

            return false;

        }


        if (
            String(
                discountCondition.conditionValue
            ).length > 100
        ) {

            errorNotify(
                "Condition value cannot exceed 100 characters"
            );

            return false;

        }


        // Description

        if (
            discountCondition.description &&
            discountCondition.description.length > 500
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

        setDiscountCondition({

            discountRuleId: "",
            conditionType: "",
            conditionOperator: "",
            conditionValue: "",
            description: "",

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
                        "Motor Discount Condition Master",

                    type:
                        "motordiscountcondition",

                    idField:
                        "discount_condition_id",

                    editRoute:
                        "motordiscountcondition",

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
                                "condition_type",

                            headerName:
                                "Condition Type",
                        },

                        {
                            field:
                                "condition_operator",

                            headerName:
                                "Operator",
                        },

                        {
                            field:
                                "condition_value",

                            headerName:
                                "Condition Value",
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

            discount_rule_id:
                Number(
                    discountCondition.discountRuleId
                ),

            condition_type:
                discountCondition.conditionType.trim(),

            condition_operator:
                discountCondition.conditionOperator.trim(),

            condition_value:
                String(
                    discountCondition.conditionValue
                ).trim(),

            description:
                discountCondition.description
                    ? discountCondition.description.trim()
                    : null,


            is_active: String(discountCondition?.isActive) === "Active" ? 1 : 0


        };


        try {

            setLoading(true);

            let response;


            if (mode === "edit") {

                response =
                    await axioslogin.put(
                        `/motor/discount-condition/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/discount-condition/create`,
                        payload
                    );

            }


            if (response?.data?.success === 1) {

                successNotify(
                    response?.data?.message ||
                    `Discount condition ${mode === "edit"
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
                    "Failed to save discount condition"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save discount condition"
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
                        ? "Edit Motor Discount Condition"
                        : "Motor Discount Condition Creation"
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


                        {/* DISCOUNT RULE */}

                        <FormRow
                            label="Discount Rule"
                            required
                        >

                            <SelectLg
                                options={
                                    ActiveDiscountRuleMaster
                                }

                                value={
                                    discountCondition.discountRuleId
                                }

                                onChange={set(
                                    "discountRuleId"
                                )}
                            />

                        </FormRow>


                        {/* CONDITION TYPE */}

                        <FormRow
                            label="Condition Type"
                            required
                        >

                            <SelectLg
                                options={
                                    ConditionTypeOptions
                                }

                                value={
                                    discountCondition.conditionType
                                }

                                onChange={set(
                                    "conditionType"
                                )}
                            />

                        </FormRow>


                        {/* CONDITION OPERATOR */}

                        <FormRow
                            label="Condition Operator"
                            required
                        >

                            <SelectLg
                                options={
                                    ConditionOperatorOptions
                                }

                                value={
                                    discountCondition.conditionOperator
                                }

                                onChange={set(
                                    "conditionOperator"
                                )}
                            />

                        </FormRow>


                        {/* CONDITION VALUE */}

                        <FormRow
                            label="Condition Value"
                            required
                        >

                            <InputLg
                                value={
                                    discountCondition.conditionValue
                                }

                                onChange={set(
                                    "conditionValue"
                                )}
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg
                                value={
                                    discountCondition.description
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
                                    discountCondition.isActive
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


export default MotorDiscountConditionCreation;