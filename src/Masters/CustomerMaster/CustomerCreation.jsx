import { Box } from "@mui/joy";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import { styles } from "../../Style/formStyles";

import { axioslogin } from "../../Connection/axios";
import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { useCustomerMaster } from "../../CommonCode/useQuery";

const CustomerCreation = () => {
    const [customer, setCustomer] = useState({
        customerName: "",
        mobileNumber1: "",
        mobileNumber2: "",
        email: "",
        address: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const {
        refetch: FetchCustomerMaster
    } = useCustomerMaster();

    const set = (field) => (e) => {
        let val = e.target.value;
        if (field === "mobileNumber1" || field === "mobileNumber2") {
            // Keep only numbers and max length of 10 digits
            val = val.replace(/\D/g, "").slice(0, 10);
        }
        if (field === "pincode") {
            // Keep only numbers and max length of 6 digits
            val = val.replace(/\D/g, "").slice(0, 6);
        }
        setCustomer((prev) => ({
            ...prev,
            [field]: val
        }));
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleReset = () => {
        setCustomer({
            customerName: "",
            mobileNumber1: "",
            mobileNumber2: "",
            email: "",
            address: "",
            city: "",
            district: "",
            state: "",
            pincode: "",
            isActive: "Active",
        });
    };

    const validateCustomer = () => {
        if (!customer.customerName.trim()) {
            warningNotify("Customer Name is required");
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(customer.customerName.trim())) {
            warningNotify("Customer Name must contain only letters and spaces");
            return false;
        }

        if (customer.customerName.trim().length < 2) {
            warningNotify("Customer Name must be at least 2 characters");
            return false;
        }

        if (customer.customerName.trim().length > 100) {
            warningNotify("Customer Name must not exceed 100 characters");
            return false;
        }

        if (!customer.mobileNumber1.trim()) {
            warningNotify("Mobile Number 1 is required");
            return false;
        }

        if (customer.mobileNumber1.trim().length !== 10) {
            warningNotify("Mobile Number 1 must be exactly 10 digits");
            return false;
        }

        if (customer.mobileNumber2.trim() && customer.mobileNumber2.trim().length !== 10) {
            warningNotify("Mobile Number 2 must be exactly 10 digits");
            return false;
        }

        if (!customer.email.trim()) {
            warningNotify("Email Address is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer.email.trim())) {
            warningNotify("Invalid email address format");
            return false;
        }

        if (!customer.address.trim()) {
            warningNotify("Address is required");
            return false;
        }

        if (!customer.city.trim()) {
            warningNotify("City is required");
            return false;
        }

        if (!customer.district.trim()) {
            warningNotify("District is required");
            return false;
        }

        if (!customer.state.trim()) {
            warningNotify("State is required");
            return false;
        }

        if (!customer.pincode.trim()) {
            warningNotify("Pincode is required");
            return false;
        }

        if (!/^\d{6}$/.test(customer.pincode.trim())) {
            warningNotify("Pincode must be exactly 6 digits");
            return false;
        }

        return true;
    };

    const getCustomerById = async (id) => {
        try {
            const result = await axioslogin.get(`/customer/getbyid/${id}`);
            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message || "Failed to load customer details");
            }

            if (data) {
                setCustomer({
                    customerName: data.customer_name || "",
                    mobileNumber1: data.mobile_number_1 || "",
                    mobileNumber2: data.mobile_number_2 || "",
                    email: data.email || "",
                    address: data.address || "",
                    city: data.city || "",
                    district: data.district || "",
                    state: data.state || "",
                    pincode: data.pincode || "",
                    isActive: data.is_active === 1 ? "Active" : "Inactive",
                });
            }
        } catch (error) {
            console.log(error);
            warningNotify("Failed to load customer details");
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getCustomerById(id);
        }
    }, [id, mode]);

    const handleSave = async () => {
        if (!validateCustomer()) return;

        setLoading(true);

        try {
            const customerData = {
                customer_name: customer.customerName.trim(),
                mobile_number_1: customer.mobileNumber1.trim(),
                mobile_number_2: customer.mobileNumber2.trim() || null,
                email: customer.email.trim() || null,
                address: customer.address.trim() || null,
                city: customer.city.trim() || null,
                district: customer.district.trim() || null,
                state: customer.state.trim() || null,
                pincode: customer.pincode.trim() || null,
                is_active: customer.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(
                    `/customer/update/${id}`,
                    customerData
                );
            } else {
                response = await axioslogin.post(
                    "/customer/create",
                    customerData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Customer updated successfully!"
                        : "Customer created successfully!"
                );
                FetchCustomerMaster();
                handleReset();
                if (mode === "edit") {
                    navigate(-1);
                }
            } else {
                warningNotify(
                    message ||
                    (mode === "edit"
                        ? "Failed to update customer"
                        : "Failed to create customer")
                );
            }
        } catch (error) {
            warningNotify(
                error?.response?.data?.message ||
                (mode === "edit"
                    ? "Error updating customer"
                    : "Error creating customer")
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        handleReset();
        showToast("Form cleared");
    };

    const handleView = () => {
        navigate("/home/setting/commonview", {
            state: {
                title: "Customer Master",
                type: "customer",
                idField: "customer_id",
                editRoute: "customermaster",
                columns: [
                    { field: "customer_name", headerName: "Customer Name" },
                    { field: "mobile_number_1", headerName: "Mobile Number 1" },
                    { field: "mobile_number_2", headerName: "Mobile Number 2" },
                    { field: "email", headerName: "Email Address" },
                    { field: "city", headerName: "City" },
                    { field: "state", headerName: "State" },
                    { field: "is_active", headerName: "Status", type: "status" }
                ]
            }
        });
    };

    const handlePreview = () => {
        if (!customer.customerName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Customer Data:", customer);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <Wrapper>
            <Toast
                message={toast}
                onClose={() => setToast("")}
            />

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Customer"
                        : "Customer Creation"
                }
                onHelp={() =>
                    showToast(
                        "Help: Fill all required fields marked with *"
                    )
                }
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                        padding: "10px",
                    }}
                >
                    <Box sx={{ width: "90%" }}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                            gap: "24px"
                        }}>
                            <div>
                                <FormRow label="Customer Name" required>
                                    <InputLg
                                        value={customer.customerName}
                                        onChange={set("customerName")}
                                        placeholder="Enter customer name"
                                    />
                                </FormRow>

                                <FormRow label="Mobile Number 1" required>
                                    <InputLg
                                        value={customer.mobileNumber1}
                                        onChange={set("mobileNumber1")}
                                        placeholder="Enter primary mobile number"
                                    />
                                </FormRow>

                                <FormRow label="Mobile Number 2">
                                    <InputLg
                                        value={customer.mobileNumber2}
                                        onChange={set("mobileNumber2")}
                                        placeholder="Enter alternate mobile number"
                                    />
                                </FormRow>

                                <FormRow label="Email Address" required>
                                    <InputLg
                                        value={customer.email}
                                        onChange={set("email")}
                                        placeholder="Enter email address"
                                    />
                                </FormRow>

                                <FormRow label="Address" required>
                                    <textarea
                                        style={{
                                            ...styles.inputLg,
                                            height: "auto",
                                            padding: "6px 8px",
                                            resize: "vertical"
                                        }}
                                        rows={3}
                                        value={customer.address}
                                        onChange={set("address")}
                                        placeholder="Enter physical address"
                                    />
                                </FormRow>
                            </div>

                            <div>
                                <FormRow label="City" required>
                                    <InputLg
                                        value={customer.city}
                                        onChange={set("city")}
                                        placeholder="Enter city"
                                    />
                                </FormRow>

                                <FormRow label="District" required>
                                    <InputLg
                                        value={customer.district}
                                        onChange={set("district")}
                                        placeholder="Enter district"
                                    />
                                </FormRow>

                                <FormRow label="State" required>
                                    <InputLg
                                        value={customer.state}
                                        onChange={set("state")}
                                        placeholder="Enter state"
                                    />
                                </FormRow>

                                <FormRow label="Pincode" required>
                                    <InputLg
                                        value={customer.pincode}
                                        onChange={set("pincode")}
                                        placeholder="Enter postal pincode"
                                    />
                                </FormRow>

                                <FormRow label="Active Status">
                                    <Checkbox
                                        value={customer.isActive}
                                        onChange={set("isActive")}
                                    />
                                </FormRow>
                            </div>
                        </div>
                    </Box>
                </Box>

                <div
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        margin: "20px 0",
                    }}
                />

                <ButtonWrapper>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>

                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>

                    <Button onClick={handleView}>
                        View
                    </Button>

                    <Button onClick={handlePreview}>
                        Preview
                    </Button>

                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </ButtonWrapper>
            </Panel>
        </Wrapper>
    );
};

export default CustomerCreation;
