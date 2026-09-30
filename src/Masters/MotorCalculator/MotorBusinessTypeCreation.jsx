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

const MotorBusinessTypeCreation = () => {

    const [businessType, setBusinessType] = useState({
        businessTypeCode: "",
        businessTypeName: "",
        description: "",
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
        setBusinessType((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    // ---------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------

    const getBusinessTypeById = async (businessTypeId) => {

        try {

            const result = await axioslogin.get(
                `/motor/business-type/getbyid/${businessTypeId}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setBusinessType({
                businessTypeCode:
                    data.business_type_code || "",

                businessTypeName:
                    data.business_type_name || "",

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
                "Failed to load business type details"
            );
        }
    };


    // ---------------------------------------------------------
    // EDIT LOAD
    // ---------------------------------------------------------

    useEffect(() => {

        if (mode === "edit" && id) {
            getBusinessTypeById(id);
        }

    }, [id, mode]);


    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    const validateBusinessType = () => {

        if (
            !businessType.businessTypeCode ||
            businessType.businessTypeCode.trim() === ""
        ) {
            warningNotify("Business Type Code is required.");
            return false;
        }

        if (
            businessType.businessTypeCode.trim().length > 50
        ) {
            warningNotify(
                "Business Type Code must not exceed 50 characters."
            );
            return false;
        }


        if (
            !businessType.businessTypeName ||
            businessType.businessTypeName.trim() === ""
        ) {
            warningNotify("Business Type Name is required.");
            return false;
        }

        if (
            businessType.businessTypeName.trim().length > 150
        ) {
            warningNotify(
                "Business Type Name must not exceed 150 characters."
            );
            return false;
        }


        if (
            businessType.description &&
            businessType.description.trim().length > 500
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

        setBusinessType({
            businessTypeCode: "",
            businessTypeName: "",
            description: "",
            isActive: "Active"
        });
     navigate(".", { replace: true, state: null });

    }, [navigate]);


    // ---------------------------------------------------------
    // SAVE
    // ---------------------------------------------------------

    const handleSave = async () => {

        if (!validateBusinessType()) return;

        setLoading(true);

        try {

            const businessTypeData = {

                business_type_code:
                    businessType.businessTypeCode.trim(),

                business_type_name:
                    businessType.businessTypeName.trim(),

                description:
                    businessType.description?.trim() || null
            };


            let response;


            // EDIT
            if (mode === "edit") {

                response = await axioslogin.put(
                    `/motor/business-type/update/${id}`,
                    businessTypeData
                );

            }

            // CREATE
            else {

                response = await axioslogin.post(
                    "/motor/business-type/create",
                    businessTypeData
                );

            }


            const { success, message } = response.data;


            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Business Type updated successfully!"
                        : "Business Type created successfully!"
                );

                handleReset();


                // After edit go to CommonView
                if (mode === "edit") {

                    navigate(
                        "/home/setting/commonview",
                        {
                            state: {
                                title: "Motor Business Type Master",

                                type: "motorbusinesstype",

                                idField: "business_type_id",

                                editRoute: "motorbusinesstype",

                                navigateback: "/home/settings",

                                columns: [
                                    {
                                        field: "business_type_code",
                                        headerName: "Business Type Code"
                                    },
                                    {
                                        field: "business_type_name",
                                        headerName: "Business Type Name"
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
                            ? "Failed to update business type"
                            : "Failed to create business type"
                    )
                );
            }

        } catch (error) {

            console.error(error);

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating business type"
                        : "Error creating business type"
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
                    title: "Motor Business Type Master",

                    type: "motorbusinesstype",

                    idField: "business_type_id",

                    editRoute: "motorbusinesstype",

                    navigateback: "/home/settings",

                    columns: [
                        {
                            field: "business_type_code",
                            headerName: "Business Type Code"
                        },
                        {
                            field: "business_type_name",
                            headerName: "Business Type Name"
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

            <Panel title="Motor Business Type Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "60%" }}>


                        {/* BUSINESS TYPE CODE */}

                        <FormRow
                            label="Business Type Code"
                            required
                        >

                            <InputLg
                                value={
                                    businessType.businessTypeCode
                                }
                                onChange={
                                    set("businessTypeCode")
                                }
                                placeholder="Enter business type code"
                            />

                        </FormRow>


                        {/* BUSINESS TYPE NAME */}

                        <FormRow
                            label="Business Type Name"
                            required
                        >

                            <InputLg
                                value={
                                    businessType.businessTypeName
                                }
                                onChange={
                                    set("businessTypeName")
                                }
                                placeholder="Enter business type name"
                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow label="Description">

                            <InputLg
                                value={
                                    businessType.description
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
                                    businessType.isActive
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


export default memo(MotorBusinessTypeCreation);