import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

import { useLocation, useNavigate } from "react-router-dom";
import { axioslogin } from "../../Connection/axios";
import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

const CustomerPayTypeMaster = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const [loading, setLoading] = useState(false);

    const [payType, setPayType] = useState({
        payTypeName: "",
        description: "",
        isActive: "Active",
    });


    // ==================== SET VALUE ====================

    const set = (field) => (e) => {

        setPayType((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    };


    // ==================== GET CUSTOMER PAY TYPE BY ID ====================

    const getCustomerPayTypeById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/customerpaytype/getbyid/${id}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {

                errorNotify(message);

                return;

            }

            setPayType({

                payTypeName:
                    data.pay_type_name || "",

                description:
                    data.description || "",

                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive"

            });

        } catch (error) {

            warningNotify(
                "Failed to load customer pay type details"
            );

        }

    };


    // ==================== EDIT ====================

    useEffect(() => {

        if (mode === "edit" && id) {

            getCustomerPayTypeById(id);

        }

    }, [id, mode]);


    // ==================== VALIDATION ====================

    const validatePayType = () => {

        if (
            !payType.payTypeName ||
            payType.payTypeName.trim() === ""
        ) {

            warningNotify(
                "Pay Type Name is required."
            );

            return false;

        }


        if (payType.payTypeName.trim().length < 2) {

            warningNotify(
                "Pay Type Name must be at least 2 characters."
            );

            return false;

        }


        if (payType.payTypeName.trim().length > 100) {

            warningNotify(
                "Pay Type Name must not exceed 100 characters."
            );

            return false;

        }


        if (
            payType.description &&
            payType.description.trim().length > 255
        ) {

            warningNotify(
                "Description must not exceed 255 characters."
            );

            return false;

        }


        return true;

    };


    // ==================== CANCEL ====================

    const handleCancel = () => {

        setPayType({

            payTypeName: "",
            description: "",
            isActive: "Active",

        });

        navigate(".", {
            replace: true,
            state: null
        });

    };


    // ==================== SAVE ====================

    const handleSave = async () => {

        if (!validatePayType()) {

            return;

        }

        setLoading(true);

        try {

            const customerPayTypeData = {

                pay_type_name:
                    payType.payTypeName.trim(),

                description:
                    payType.description.trim() || null,

                isActive:
                    payType.isActive === "Active"
                        ? 1
                        : 0

            };


            let response;


            if (mode === "edit") {

                response = await axioslogin.patch(

                    `/customerpaytype/update/${id}`,

                    customerPayTypeData

                );

            } else {

                response = await axioslogin.post(

                    "/customerpaytype/create",

                    customerPayTypeData

                );

            }


            const {
                success,
                message
            } = response.data;


            if (success === 1) {

                successNotify(

                    mode === "edit"
                        ? "Customer pay type updated successfully!"
                        : "Customer pay type created successfully!"

                );

                handleCancel();

            } else {

                warningNotify(

                    message ||

                    (
                        mode === "edit"
                            ? "Failed to update customer pay type"
                            : "Failed to create customer pay type"
                    )

                );

            }

        } catch (error) {

            warningNotify(

                error.response?.data?.message ||

                (
                    mode === "edit"
                        ? "Error updating customer pay type"
                        : "Error creating customer pay type"
                )

            );

        } finally {

            setLoading(false);

        }

    };


    // ==================== VIEW ====================

    const handleView = () => {

        navigate("/home/setting/commonview", {

            state: {

                title: "Customer Pay Type Master",

                type: "customerPayType",

                idField: "customer_pay_type_id",

                editRoute: "customerpaytype",

                columns: [

                    {
                        field: "pay_type_name",
                        headerName: "Pay Type Name"
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

        });

    };


    // ==================== CLOSE ====================

    const handleClose = useCallback(() => {

        navigate("/home/settings");

    }, [navigate]);


    // ==================== UI ====================

    return (

        <Wrapper>

            <Panel title="Customer Pay Type Master">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "70%" }}>


                        {/* PAY TYPE NAME */}

                        <FormRow
                            label="Pay Type Name"
                            required
                        >

                            <InputLg

                                value={
                                    payType.payTypeName
                                }

                                onChange={
                                    set("payTypeName")
                                }

                                placeholder="Enter pay type name"

                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg

                                value={
                                    payType.description
                                }

                                onChange={
                                    set("description")
                                }

                                placeholder="Enter description"

                            />

                        </FormRow>


                        {/* ACTIVE STATUS */}

                        <FormRow
                            label="Active Status"
                        >

                            <Checkbox

                                value={
                                    payType.isActive
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
                        margin: "20px 0",
                    }}
                />


                {/* BUTTONS */}

                <ButtonWrapper>

                    <Button
                        disabled={loading}
                        onClick={handleSave}
                    >

                        {loading

                            ? "Saving..."

                            : mode === "edit"
                                ? "Update"
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

                </ButtonWrapper>

            </Panel>

        </Wrapper>

    );

};

export default memo(CustomerPayTypeMaster);