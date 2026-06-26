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

import { axioslogin } from "../../Axios/axios";
import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { useInsuranceCompanyMaster } from "../../CommonCode/useQuery";

const InsuranceCompanyCreation = () => {
    const [insurance, setInsurance] = useState({
        companyName: "",
        contactNumber: "",
        email: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const { refetch: FetchInsuranceCompanyMaster } = useInsuranceCompanyMaster();

    const set = (field) => (e) =>
        setInsurance((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    const handleContactChange = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val) && val.length <= 10) {
            setInsurance((prev) => ({
                ...prev,
                contactNumber: val
            }));
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleReset = () => {
        setInsurance({
            companyName: "",
            contactNumber: "",
            email: "",
            isActive: "Active",
        });
    };

    const validateInsuranceCompany = () => {
        if (!insurance.companyName.trim()) {
            warningNotify("Company Name is required");
            return false;
        }

        if (insurance.companyName.trim().length < 2) {
            warningNotify("Company Name must be at least 2 characters");
            return false;
        }

        if (insurance.companyName.trim().length > 150) {
            warningNotify("Company Name must not exceed 150 characters");
            return false;
        }

        if (!insurance.contactNumber.trim()) {
            warningNotify("Contact Number is required");
            return false;
        }

        if (insurance.contactNumber.trim().length !== 10) {
            warningNotify("Contact Number must be exactly 10 digits");
            return false;
        }

        if (!insurance.email.trim()) {
            warningNotify("Email address is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(insurance.email.trim())) {
            warningNotify("Please enter a valid email address");
            return false;
        }

        return true;
    };

    const getInsuranceCompanyById = async (id) => {
        try {
            const result = await axioslogin.get(`/insurancecompany/getbyid/${id}`);
            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setInsurance({
                companyName: data.company_name || "",
                contactNumber: data.contact_number || "",
                email: data.email || "",
                isActive: data.is_active === 1 ? "Active" : "Inactive",
            });
        } catch (error) {
            console.error(error);
            warningNotify("Failed to load insurance company details");
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getInsuranceCompanyById(id);
        }
    }, [id, mode]);

    const handleSave = async () => {
        if (!validateInsuranceCompany()) return;

        setLoading(true);

        try {
            const companyData = {
                company_name: insurance.companyName.trim(),
                contact_number: insurance.contactNumber.trim() || null,
                email: insurance.email.trim() || null,
                is_active: insurance.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(
                    `/insurancecompany/update/${id}`,
                    companyData
                );
            } else {
                response = await axioslogin.post(
                    "/insurancecompany/create",
                    companyData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Insurance Company updated successfully!"
                        : "Insurance Company created successfully!"
                );

                FetchInsuranceCompanyMaster();
                handleReset();
                if (mode === "edit") {
                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Insurance Company Master",
                            type: "insurancecompany",
                            idField: "insurance_company_id",
                            editRoute: "insurancecompany",
                            columns: [
                                {
                                    field: "company_name",
                                    headerName: "Company Name"
                                },
                                {
                                    field: "contact_number",
                                    headerName: "Contact Number"
                                },
                                {
                                    field: "email",
                                    headerName: "Email"
                                },
                                {
                                    field: "is_active",
                                    headerName: "Status",
                                    type: "status"
                                }
                            ]
                        }
                    });
                }
            } else {
                warningNotify(
                    message ||
                    (mode === "edit"
                        ? "Failed to update insurance company"
                        : "Failed to create insurance company")
                );
            }
        } catch (error) {
            warningNotify(
                error?.response?.data?.message ||
                (mode === "edit"
                    ? "Error updating insurance company"
                    : "Error creating insurance company")
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
                title: "Insurance Company Master",
                type: "insurancecompany",
                idField: "insurance_company_id",
                editRoute: "insurancecompany",
                columns: [
                    {
                        field: "company_name",
                        headerName: "Company Name"
                    },
                    {
                        field: "contact_number",
                        headerName: "Contact Number"
                    },
                    {
                        field: "email",
                        headerName: "Email"
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

    const handlePreview = () => {
        if (!insurance.companyName) {
            showToast("Fill the form first to preview.");
            return;
        }

        console.log("Preview:", insurance);
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
                title={mode === "edit" ? "Edit Insurance Company" : "Insurance Company Creation"}
                onHelp={() => showToast("Help: Fill all required fields marked with *")}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                    }}
                >
                    <Box sx={{ width: "70%" }}>
                        <FormRow
                            label="Company Name"
                            required
                        >
                            <InputLg
                                value={insurance.companyName}
                                onChange={set("companyName")}
                                placeholder="Enter company name"
                            />
                        </FormRow>

                        <FormRow label="Contact Number" required>
                            <InputLg
                                value={insurance.contactNumber}
                                onChange={handleContactChange}
                                placeholder="Enter contact number"
                            />
                        </FormRow>

                        <FormRow label="Email" required>
                            <InputLg
                                value={insurance.email}
                                onChange={set("email")}
                                placeholder="Enter email address"
                                type="email"
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={insurance.isActive}
                                onChange={set("isActive")}
                            />
                        </FormRow>
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

export default InsuranceCompanyCreation;
