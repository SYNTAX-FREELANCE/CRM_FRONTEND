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

const PaymentMethodMaster = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const [loading, setLoading] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState({
        paymentMethodName: "",
        paymentType: "",
        description: "",
        isActive: "Active",
    });


    // ==================== SET VALUE ====================

    const set = (field) => (e) => {

        setPaymentMethod((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    };


    // ==================== GET PAYMENT METHOD BY ID ====================

    const getPaymentMethodById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/paymentmethod/getbyid/${id}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {

                errorNotify(message);

                return;

            }

            setPaymentMethod({

                paymentMethodName:
                    data.payment_method_name || "",

                paymentType:
                    data.payment_type || "",

                description:
                    data.description || "",

                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive"

            });

        } catch (error) {

            warningNotify(
                "Failed to load payment method details"
            );

        }

    };


    // ==================== EDIT ====================

    useEffect(() => {

        if (mode === "edit" && id) {

            getPaymentMethodById(id);

        }

    }, [id, mode]);


    // ==================== VALIDATION ====================

    const validatePaymentMethod = () => {

        if (
            !paymentMethod.paymentMethodName ||
            paymentMethod.paymentMethodName.trim() === ""
        ) {

            warningNotify(
                "Payment Method Name is required."
            );

            return false;

        }


        if (paymentMethod.paymentMethodName.trim().length < 2) {

            warningNotify(
                "Payment Method Name must be at least 2 characters."
            );

            return false;

        }


        if (paymentMethod.paymentMethodName.trim().length > 100) {

            warningNotify(
                "Payment Method Name must not exceed 100 characters."
            );

            return false;

        }


        if (
            !paymentMethod.paymentType ||
            paymentMethod.paymentType.trim() === ""
        ) {

            warningNotify(
                "Payment Type is required."
            );

            return false;

        }


        if (
            paymentMethod.description &&
            paymentMethod.description.trim().length > 255
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

        setPaymentMethod({

            paymentMethodName: "",
            paymentType: "",
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

        if (!validatePaymentMethod()) {

            return;

        }

        setLoading(true);

        try {

            const paymentMethodData = {

                payment_method_name:
                    paymentMethod.paymentMethodName.trim(),

                payment_type:
                    paymentMethod.paymentType.trim(),

                description:
                    paymentMethod.description.trim() || null,

                is_active:
                    paymentMethod.isActive === "Active"
                        ? 1
                        : 0

            };


            let response;


            if (mode === "edit") {

                response = await axioslogin.patch(

                    `/paymentmethod/update/${id}`,

                    paymentMethodData

                );

            } else {

                response = await axioslogin.post(

                    "/paymentmethod/create",

                    paymentMethodData

                );

            }


            const {
                success,
                message
            } = response.data;


            if (success === 1) {

                successNotify(

                    mode === "edit"
                        ? "Payment method updated successfully!"
                        : "Payment method created successfully!"

                );

                handleCancel();

            } else {

                warningNotify(

                    message ||

                    (
                        mode === "edit"
                            ? "Failed to update payment method"
                            : "Failed to create payment method"
                    )

                );

            }

        } catch (error) {

            warningNotify(

                error.response?.data?.message ||

                (
                    mode === "edit"
                        ? "Error updating payment method"
                        : "Error creating payment method"
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

                title: "Payment Method Master",

                type: "paymentMethod",

                idField: "payment_method_id",

                editRoute: "paymentmethod",

                columns: [

                    {
                        field: "payment_method_name",
                        headerName: "Payment Method Name"
                    },

                    {
                        field: "payment_type",
                        headerName: "Payment Type"
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

            <Panel title="Payment Method Master">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "70%" }}>


                        {/* PAYMENT METHOD NAME */}

                        <FormRow
                            label="Payment Method Name"
                            required
                        >

                            <InputLg

                                value={
                                    paymentMethod.paymentMethodName
                                }

                                onChange={
                                    set("paymentMethodName")
                                }

                                placeholder="Enter payment method name"

                            />

                        </FormRow>


                        {/* PAYMENT TYPE */}

                        <FormRow
                            label="Payment Type"
                            required
                        >

                            <InputLg

                                value={
                                    paymentMethod.paymentType
                                }

                                onChange={
                                    set("paymentType")
                                }

                                placeholder="Enter payment type"

                            />

                        </FormRow>


                        {/* DESCRIPTION */}

                        <FormRow
                            label="Description"
                        >

                            <InputLg

                                value={
                                    paymentMethod.description
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
                                    paymentMethod.isActive
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

export default memo(PaymentMethodMaster);