import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { axioslogin } from "../../Connection/axios";

const MotorPolicyTermCreation = () => {

    const [policyTerm, setPolicyTerm] = useState({
        termCode: "",
        termName: "",
        termValue: "",
        termUnit: "",
        description: "",
        isActive: "Active"
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};


    // ---------------------------------------------------------
    // TERM UNIT OPTIONS
    // ---------------------------------------------------------

    const TermUnitOptions = [
        {
            id: "DAY",
            label: "Day"
        },
        {
            id: "MONTH",
            label: "Month"
        },
        {
            id: "YEAR",
            label: "Year"
        }
    ];


    // ---------------------------------------------------------
    // SET FIELD
    // ---------------------------------------------------------

    const set = (field) => (e) =>
        setPolicyTerm((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    // ---------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------

    const getPolicyTermById = async (policyTermId) => {

        try {

            const result = await axioslogin.get(
                `/motor/policy-term/getbyid/${policyTermId}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setPolicyTerm({
                termCode:
                    data.term_code || "",

                termName:
                    data.term_name || "",

                termValue:
                    data.term_value ?? "",

                termUnit:
                    data.term_unit || "",

                description:
                    data.description || "",

                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive"
            });

        } catch (error) {

            console.error(error);

            warningNotify(
                "Failed to load policy term details"
            );
        }
    };


    // ---------------------------------------------------------
    // EDIT LOAD
    // ---------------------------------------------------------

    useEffect(() => {

        if (mode === "edit" && id) {
            getPolicyTermById(id);
        }

    }, [id, mode]);


    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    const validatePolicyTerm = () => {

        if (
            !policyTerm.termCode ||
            policyTerm.termCode.trim() === ""
        ) {
            warningNotify("Term Code is required.");
            return false;
        }

        if (
            policyTerm.termCode.trim().length > 50
        ) {
            warningNotify(
                "Term Code must not exceed 50 characters."
            );
            return false;
        }


        if (
            !policyTerm.termName ||
            policyTerm.termName.trim() === ""
        ) {
            warningNotify("Term Name is required.");
            return false;
        }

        if (
            policyTerm.termName.trim().length > 150
        ) {
            warningNotify(
                "Term Name must not exceed 150 characters."
            );
            return false;
        }


        if (
            policyTerm.termValue === "" ||
            policyTerm.termValue === null ||
            policyTerm.termValue === undefined
        ) {
            warningNotify(
                "Term Value is required."
            );
            return false;
        }


        const numericValue = Number(
            policyTerm.termValue
        );


        if (
            !Number.isInteger(numericValue) ||
            numericValue <= 0
        ) {
            warningNotify(
                "Term Value must be a positive integer."
            );
            return false;
        }


        if (!policyTerm.termUnit) {
            warningNotify(
                "Term Unit is required."
            );
            return false;
        }


        if (
            !["DAY", "MONTH", "YEAR"].includes(
                policyTerm.termUnit
            )
        ) {
            warningNotify(
                "Term Unit must be Day, Month or Year."
            );
            return false;
        }


        if (
            policyTerm.description &&
            policyTerm.description.trim().length > 500
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

        setPolicyTerm({
            termCode: "",
            termName: "",
            termValue: "",
            termUnit: "",
            description: "",
            isActive: "Active"
        });

    }, []);


    // ---------------------------------------------------------
    // SAVE
    // ---------------------------------------------------------

    const handleSave = async () => {

        if (!validatePolicyTerm()) return;

        setLoading(true);

        try {

            const policyTermData = {

                term_code:
                    policyTerm.termCode.trim(),

                term_name:
                    policyTerm.termName.trim(),

                term_value:
                    Number(policyTerm.termValue),

                term_unit:
                    policyTerm.termUnit,

                description:
                    policyTerm.description?.trim() || null
            };


            let response;


            // EDIT
            if (mode === "edit") {

                response = await axioslogin.put(
                    `/motor/policy-term/update/${id}`,
                    policyTermData
                );

            }

            // CREATE
            else {

                response = await axioslogin.post(
                    "/motor/policy-term/create",
                    policyTermData
                );

            }


            const {
                success,
                message
            } = response.data;


            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Policy Term updated successfully!"
                        : "Policy Term created successfully!"
                );

                handleReset();


                // After edit go to CommonView
                if (mode === "edit") {

                    navigate(
                        "/home/setting/commonview",
                        {
                            state: {
                                title: "Motor Policy Term Master",

                                type: "motorpolicyterm",

                                idField: "policy_term_id",

                                editRoute: "motorpolicyterm",

                                navigateback: "/home/settings",

                                columns: [
                                    {
                                        field: "term_code",
                                        headerName: "Term Code"
                                    },
                                    {
                                        field: "term_name",
                                        headerName: "Term Name"
                                    },
                                    {
                                        field: "term_value",
                                        headerName: "Term Value"
                                    },
                                    {
                                        field: "term_unit",
                                        headerName: "Term Unit"
                                    },
                                    {
                                        field: "description",
                                        headerName: "Description"
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
                            ? "Failed to update policy term"
                            : "Failed to create policy term"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating policy term"
                        : "Error creating policy term"
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
                    title: "Motor Policy Term Master",

                    type: "motorpolicyterm",

                    idField: "policy_term_id",

                    editRoute: "motorpolicyterm",

                    navigateback: "/home/settings",

                    columns: [
                        {
                            field: "term_code",
                            headerName: "Term Code"
                        },
                        {
                            field: "term_name",
                            headerName: "Term Name"
                        },
                        {
                            field: "term_value",
                            headerName: "Term Value"
                        },
                        {
                            field: "term_unit",
                            headerName: "Term Unit"
                        },
                        {
                            field: "description",
                            headerName: "Description"
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

            <Panel title="Motor Policy Term Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "60%" }}>


                        {/* TERM CODE */}

                        <FormRow
                            label="Term Code"
                            required
                        >

                            <InputLg
                                value={
                                    policyTerm.termCode
                                }
                                onChange={
                                    set("termCode")
                                }
                                placeholder="Enter term code"
                            />

                        </FormRow>


                        {/* TERM NAME */}

                        <FormRow
                            label="Term Name"
                            required
                        >

                            <InputLg
                                value={
                                    policyTerm.termName
                                }
                                onChange={
                                    set("termName")
                                }
                                placeholder="Enter term name"
                            />

                        </FormRow>


                        {/* TERM VALUE */}

                        <FormRow
                            label="Term Value"
                            required
                        >

                            <InputLg
                                type="number"
                                value={
                                    policyTerm.termValue
                                }
                                onChange={
                                    set("termValue")
                                }
                                placeholder="Enter term value"
                            />

                        </FormRow>


                        {/* TERM UNIT */}

                        <FormRow
                            label="Term Unit"
                            required
                        >

                            <SelectLg
                                value={
                                    policyTerm.termUnit
                                }
                                onChange={
                                    set("termUnit")
                                }
                                options={
                                    TermUnitOptions
                                }
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow label="Description">

                            <InputLg
                                value={
                                    policyTerm.description
                                }
                                onChange={
                                    set("description")
                                }
                                placeholder="Enter description"
                            />

                        </FormRow>


                        {/* ACTIVE STATUS */}

                        <FormRow label="Active Status">

                            <Checkbox
                                value={
                                    policyTerm.isActive
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
                        borderTop: "1px solid #e5e7eb",
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


export default memo(MotorPolicyTermCreation);