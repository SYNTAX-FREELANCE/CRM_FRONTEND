import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { axioslogin } from "../../Connection/axios";

const MotorPolicyTypeCreation = () => {

    const [policyType, setPolicyType] = useState({
        policyTypeCode: "",
        policyTypeName: "",
        description: "",
        isOdApplicable: "Inactive",
        isTpApplicable: "Inactive",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};


    // ---------------------------------------------------------
    // SET FIELD
    // ---------------------------------------------------------

    const set = (field) => (e) =>
        setPolicyType((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    // ---------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------

    const getPolicyTypeById = async (policyTypeId) => {

        try {

            const result = await axioslogin.get(
                `/motor/policy-type/getbyid/${policyTypeId}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setPolicyType({
                policyTypeCode: data.policy_type_code || "",
                policyTypeName: data.policy_type_name || "",
                description: data.description || "",

                isOdApplicable:
                    data.is_od_applicable === 1
                        ? "Active"
                        : "Inactive",

                isTpApplicable:
                    data.is_tp_applicable === 1
                        ? "Active"
                        : "Inactive",

                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive"
            });

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load policy type details"
            );
        }
    };


    // ---------------------------------------------------------
    // EDIT LOAD
    // ---------------------------------------------------------

    useEffect(() => {

        if (mode === "edit" && id) {
            getPolicyTypeById(id);
        }

    }, [id, mode]);


    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    const validatePolicyType = () => {

        if (
            !policyType.policyTypeCode ||
            policyType.policyTypeCode.trim() === ""
        ) {
            warningNotify("Policy Type Code is required.");
            return false;
        }

        if (
            policyType.policyTypeCode.trim().length > 50
        ) {
            warningNotify(
                "Policy Type Code must not exceed 50 characters."
            );
            return false;
        }


        if (
            !policyType.policyTypeName ||
            policyType.policyTypeName.trim() === ""
        ) {
            warningNotify("Policy Type Name is required.");
            return false;
        }

        if (
            policyType.policyTypeName.trim().length > 150
        ) {
            warningNotify(
                "Policy Type Name must not exceed 150 characters."
            );
            return false;
        }


        if (
            policyType.description &&
            policyType.description.trim().length > 500
        ) {
            warningNotify(
                "Description must not exceed 500 characters."
            );
            return false;
        }

        return true;
    };


    // ---------------------------------------------------------
    // RESET
    // ---------------------------------------------------------

    const handleReset = useCallback(() => {

        setPolicyType({
            policyTypeCode: "",
            policyTypeName: "",
            description: "",
            isOdApplicable: "Inactive",
            isTpApplicable: "Inactive",
            isActive: "Active"
        });
     navigate(".", { replace: true, state: null });

    }, [navigate]);


    // ---------------------------------------------------------
    // SAVE
    // ---------------------------------------------------------

    const handleSave = async () => {

        if (!validatePolicyType()) return;

        setLoading(true);

        try {

            const policyTypeData = {

                policy_type_code:
                    policyType.policyTypeCode.trim(),

                policy_type_name:
                    policyType.policyTypeName.trim(),

                description:
                    policyType.description?.trim() || null,

                is_od_applicable:
                    policyType.isOdApplicable === "Active"
                        ? 1
                        : 0,

                is_tp_applicable:
                    policyType.isTpApplicable === "Active"
                        ? 1
                        : 0
            };


            let response;


            // EDIT
            if (mode === "edit") {

                response = await axioslogin.put(
                    `/motor/policy-type/update/${id}`,
                    policyTypeData
                );

            }

            // CREATE
            else {

                response = await axioslogin.post(
                    "/motor/policy-type/create",
                    policyTypeData
                );

            }


            const { success, message } = response.data;


            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Policy Type updated successfully!"
                        : "Policy Type created successfully!"
                );

                handleReset();


                // After EDIT go back to CommonView
                if (mode === "edit") {

                    navigate(
                        "/home/setting/commonview",
                        {
                            state: {
                                title: "Motor Policy Type Master",

                                type: "motorpolicytype",

                                idField: "policy_type_id",

                                editRoute: "motorpolicytype",

                                navigateback: "/home/settings",

                                columns: [
                                    {
                                        field: "policy_type_code",
                                        headerName: "Policy Type Code"
                                    },
                                    {
                                        field: "policy_type_name",
                                        headerName: "Policy Type Name"
                                    },
                                    {
                                        field: "description",
                                        headerName: "Description"
                                    },
                                    {
                                        field: "is_od_applicable",
                                        headerName: "OD Applicable",
                                        type: "status"
                                    },
                                    {
                                        field: "is_tp_applicable",
                                        headerName: "TP Applicable",
                                        type: "status"
                                    },
                                    {
                                        field: "is_active",
                                        headerName: "Status",
                                        type: "status"
                                    }
                                ]
                            }
                        }
                    );
                }

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update policy type"
                            : "Failed to create policy type"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating policy type"
                        : "Error creating policy type"
                )
            );

        } finally {

            setLoading(false);

        }
    };


    // ---------------------------------------------------------
    // CANCEL
    // ---------------------------------------------------------

    const handleCancel = useCallback(() => {

        handleReset();

    }, [handleReset]);


    // ---------------------------------------------------------
    // VIEW
    // ---------------------------------------------------------

    const handleView = () => {

        navigate(
            "/home/setting/commonview",
            {
                state: {
                    title: "Motor Policy Type Master",

                    type: "motorpolicytype",

                    idField: "policy_type_id",

                    editRoute: "motorpolicytype",

                    navigateback: "/home/settings",

                    columns: [
                        {
                            field: "policy_type_code",
                            headerName: "Policy Type Code"
                        },
                        {
                            field: "policy_type_name",
                            headerName: "Policy Type Name"
                        },
                        {
                            field: "description",
                            headerName: "Description"
                        },
                        {
                            field: "is_od_applicable",
                            headerName: "OD Applicable",
                            type: "status"
                        },
                        {
                            field: "is_tp_applicable",
                            headerName: "TP Applicable",
                            type: "status"
                        },
                        {
                            field: "is_active",
                            headerName: "Status",
                            type: "status"
                        }
                    ]
                }
            }
        );
    };


    // ---------------------------------------------------------
    // CLOSE
    // ---------------------------------------------------------

    const handleClose = () => {

        navigate("/home/settings");

    };


    // ---------------------------------------------------------
    // UI
    // ---------------------------------------------------------

    return (

        <Wrapper>

            <Panel title="Motor Policy Type Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "60%" }}>


                        {/* POLICY TYPE CODE */}

                        <FormRow
                            label="Policy Type Code"
                            required
                        >

                            <InputLg
                                value={
                                    policyType.policyTypeCode
                                }
                                onChange={
                                    set("policyTypeCode")
                                }
                                placeholder="Enter policy type code"
                            />

                        </FormRow>


                        {/* POLICY TYPE NAME */}

                        <FormRow
                            label="Policy Type Name"
                            required
                        >

                            <InputLg
                                value={
                                    policyType.policyTypeName
                                }
                                onChange={
                                    set("policyTypeName")
                                }
                                placeholder="Enter policy type name"
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow label="Description">

                            <InputLg
                                value={
                                    policyType.description
                                }
                                onChange={
                                    set("description")
                                }
                                placeholder="Enter description"
                            />

                        </FormRow>


                        {/* OD APPLICABLE */}

                        <FormRow label="OD Applicable">

                            <Checkbox
                                value={
                                    policyType.isOdApplicable
                                }
                                onChange={
                                    set("isOdApplicable")
                                }
                            />

                        </FormRow>


                        {/* TP APPLICABLE */}

                        <FormRow label="TP Applicable">

                            <Checkbox
                                value={
                                    policyType.isTpApplicable
                                }
                                onChange={
                                    set("isTpApplicable")
                                }
                            />

                        </FormRow>


                        {/* ACTIVE STATUS */}

                        <FormRow label="Active Status">

                            <Checkbox
                                value={
                                    policyType.isActive
                                }
                                onChange={
                                    set("isActive")
                                }
                            />

                        </FormRow>

                    </Box>

                </Box>


                {/* DIVIDER */}

                <div
                    style={{
                        borderTop:
                            "1px solid #e5e7eb",
                        margin: "20px 0"
                    }}
                />


                {/* ACTION BUTTONS */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        paddingTop: "8px"
                    }}
                >

                    <Button
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Saving..."
                                : "Save"
                        }
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

                </div>

            </Panel>

        </Wrapper>
    );
};


export default memo(MotorPolicyTypeCreation);