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
import { useMotorAddonRuleMaster } from "../../CommonCode/useQuery";


const MotorAddonConditionCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const editId = location?.state?.id || null;

    const [mode, setMode] = useState(
        editId ? "edit" : "create"
    );

    const [loading, setLoading] = useState(false);



    // FORM STATE


    const [addonCondition, setAddonCondition] = useState({

        addonRuleId: "",

        conditionType: "",

        conditionOperator: "",

        conditionValue: "",

        description: "",

        isActive: "Active",

    });


    const { data: AddonRuleMaster = [] } = useMotorAddonRuleMaster()

    // ACTIVE ADDON RULE MASTER

    const ActiveAddonRuleMaster =
        AddonRuleMaster
            ?.filter(
                item =>
                    Number(item?.is_active ?? 1) === 1
            )
            ?.map(item => ({
                id: item.addon_rule_id,

                label:
                    `${item?.addon_code || ""} - ` +
                    `${item?.addon_name || ""} - ` +
                    `${item?.product_name || ""}`,
            })) || [];



    // CONDITION TYPE OPTIONS


    const ConditionTypeOptions = [

        {
            id: "VEHICLE_AGE",
            label: "Vehicle Age",
        },

        {
            id: "IDV",
            label: "IDV",
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
            id: "OTHER",
            label: "Other",
        },

    ];



    // CONDITION OPERATOR OPTIONS


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
            id: "NOT_IN",
            label: "Not In",
        },

    ];



    // SET FIELD


    const set = field => event => {

        setAddonCondition(prev => ({

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

            fetchAddonCondition(editId);

        }

    }, [editId]);


    const fetchAddonCondition = async id => {

        try {

            setLoading(true);


            const response =
                await axioslogin.get(
                    `/motor/addon-condition/getbyid/${id}`
                );


            if (response?.data?.success === 1) {

                const data =
                    response.data.data;


                setAddonCondition({

                    addonRuleId:
                        data?.addon_rule_id || "",

                    conditionType:
                        data?.condition_type || "",

                    conditionOperator:
                        data?.condition_operator || "",

                    conditionValue:
                        data?.condition_value || "",

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
                    "Failed to fetch addon condition"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                "Failed to fetch addon condition"
            );

        } finally {

            setLoading(false);

        }

    };



    // VALIDATION


    const validate = () => {


        // ADDON RULE


        if (!addonCondition.addonRuleId) {

            errorNotify(
                "Addon rule is required"
            );

            return false;

        }


        if (
            isNaN(addonCondition.addonRuleId) ||
            Number(addonCondition.addonRuleId) <= 0
        ) {

            errorNotify(
                "Addon rule must be a valid value"
            );

            return false;

        }



        // CONDITION TYPE


        if (!addonCondition.conditionType) {

            errorNotify(
                "Condition type is required"
            );

            return false;

        }


        if (
            addonCondition.conditionType.length > 50
        ) {

            errorNotify(
                "Condition type must not exceed 50 characters"
            );

            return false;

        }



        // CONDITION OPERATOR


        if (!addonCondition.conditionOperator) {

            errorNotify(
                "Condition operator is required"
            );

            return false;

        }


        if (
            addonCondition.conditionOperator.length > 20
        ) {

            errorNotify(
                "Condition operator must not exceed 20 characters"
            );

            return false;

        }



        // CONDITION VALUE


        if (
            addonCondition.conditionValue === undefined ||
            addonCondition.conditionValue === null ||
            String(addonCondition.conditionValue).trim() === ""
        ) {

            errorNotify(
                "Condition value is required"
            );

            return false;

        }


        if (
            String(addonCondition.conditionValue).length > 100
        ) {

            errorNotify(
                "Condition value must not exceed 100 characters"
            );

            return false;

        }



        // DESCRIPTION


        if (
            addonCondition.description &&
            addonCondition.description.length > 500
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

        setAddonCondition({

            addonRuleId: "",

            conditionType: "",

            conditionOperator: "",

            conditionValue: "",

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
                        "Motor Addon Condition Master",

                    type:
                        "motoraddoncondition",

                    idField:
                        "addon_condition_id",

                    editRoute:
                        "motoraddoncondition",

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
                                "product_name",

                            headerName:
                                "Product",
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

            addon_rule_id:
                Number(
                    addonCondition.addonRuleId
                ),


            condition_type:
                addonCondition.conditionType.trim(),


            condition_operator:
                addonCondition.conditionOperator.trim(),


            condition_value:
                String(
                    addonCondition.conditionValue
                ).trim(),


            description:
                addonCondition.description
                    ? addonCondition.description.trim()
                    : null,


            is_active:
                String(
                    addonCondition?.isActive
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
                        `/motor/addon-condition/update/${editId}`,
                        payload
                    );

            } else {

                response =
                    await axioslogin.post(
                        `/motor/addon-condition/create`,
                        payload
                    );

            }


            if (response?.data?.success === 1) {

                successNotify(
                    response?.data?.message ||
                    `Addon condition ${mode === "edit"
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
                    "Failed to save addon condition"
                );

            }

        } catch (error) {

            console.error(error);

            errorNotify(
                error?.response?.data?.message ||
                "Failed to save addon condition"
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
                        ? "Edit Motor Addon Condition"
                        : "Motor Addon Condition Creation"
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


                        {/* ADDON RULE */}

                        <FormRow
                            label="Addon Rule"
                            required
                        >

                            <SelectLg
                                options={
                                    ActiveAddonRuleMaster
                                }

                                value={
                                    addonCondition.addonRuleId
                                }

                                onChange={set(
                                    "addonRuleId"
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
                                    addonCondition.conditionType
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
                                    addonCondition.conditionOperator
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
                                    addonCondition.conditionValue
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
                                    addonCondition.description
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
                                    addonCondition.isActive
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


export default MotorAddonConditionCreation;
