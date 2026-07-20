import { Box } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";

import { axioslogin } from "../../Connection/axios";
import {
    errorNotify,
    infoNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { useCompanyMaster } from "../../CommonCode/useQuery";

const CompanyCreation = () => {

    const [company, setCompany] = useState({
        companyName: "",
        location: "",
        email: "",
        address: "",
        employee_prefix: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const { refetch: FetchCompanyMaster } = useCompanyMaster();

    const set = (field) => (e) =>
        setCompany((prev) => ({
            ...prev,
            [field]: e.target.value
        }));


    const handleReset = useCallback(() => {
        setCompany({
            companyName: "",
            location: "",
            email: "",
            address: "",
            employee_prefix: "",
            isActive: "Active",
        });
    }, []);

    const validateCompany = () => {

        if (!company.companyName.trim()) {
            warningNotify("Company Name is required");
            return false;
        }

        if (company.companyName.trim().length > 150) {
            warningNotify("Company Name must not exceed 150 characters");
            return false;
        }

        if (!company.email.trim()) {
            warningNotify("Email is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(company.email)) {
            warningNotify("Enter a valid email address");
            return false;
        }

        if (
            company.location &&
            company.location.trim().length > 100
        ) {
            warningNotify("Location must not exceed 100 characters");
            return false;
        }

        if (!/^[A-Za-z]{5}$/.test(company.employee_prefix.trim())) {
            warningNotify("Prefix should contain exactly 5 letters (A-Z only)");
            return false;
        }

        if (
            company.address &&
            company.address.trim().length > 255
        ) {
            warningNotify("Address must not exceed 255 characters");
            return false;
        }

        return true;
    };

    const getCompanyById = async (id) => {
        try {

            const result = await axioslogin.get(
                `/companimast/getbyid/${id}`
            );

            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setCompany({
                companyName: data.company_name || "",
                location: data.location || "",
                email: data.email || "",
                address: data.address || "",
                employee_prefix: data.employee_prefix || "",
                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive",
            });

        } catch (error) {
            console.log(error);
            warningNotify("Failed to load company details");

        }
    };

    useEffect(() => {

        if (mode === "edit" && id) {
            getCompanyById(id);
        }

    }, [id, mode]);

    const handleSave = async () => {
        if (!validateCompany()) return;

        setLoading(true);

        try {

            const companyData = {
                company_name: company.companyName.trim(),
                company_location: company.location.trim() || null,
                company_email: company.email.trim(),
                company_address: company.address.trim() || null,
                employee_prefix: company.employee_prefix.trim(),
                isActive:
                    company.isActive === "Active"
                        ? 1
                        : 0,
            };

            let response;

            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/companimast/update/${id}`,
                    companyData
                );

            } else {

                response = await axioslogin.post(
                    "/companimast/create",
                    companyData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Company updated successfully!"
                        : "Company created successfully!"
                );

                FetchCompanyMaster();
                handleReset();

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update company"
                            : "Failed to create company"
                    )
                );
            }

        } catch (error) {

            warningNotify(
                error?.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating company"
                        : "Error creating company"
                )
            );

        } finally {

            setLoading(false);

        }
    };

    const handleCancel = useCallback(() => {
        handleReset();
        infoNotify("Cancelled")
    }, []);

    const handleView = () => {

        navigate("/home/setting/commonview", {
            state: {
                title: "Company Master",
                type: "company",
                idField: "company_id",
                editRoute: "companymaster",

                columns: [
                    {
                        field: "company_name",
                        headerName: "Company Name"
                    },
                    {
                        field: "location",
                        headerName: "Location"
                    },
                    {
                        field: "email",
                        headerName: "Email"
                    },
                    {
                        field: "address",
                        headerName: "Address"
                    },
                    {
                        field: "employee_prefix",
                        headerName: "Employee Prefix"
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


    const handleClose = useCallback(() => {
        navigate('/home/settings');
    }, [navigate]);

    return (
        <Wrapper>
            <Panel
                title={
                    mode === "edit"
                        ? "Edit Company"
                        : "Company Creation"
                }
                onBack={handleClose}
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
                                value={company.companyName}
                                onChange={set("companyName")}
                                placeholder="Enter company name"
                            />
                        </FormRow>

                        <FormRow label="Location">
                            <InputLg
                                value={company.location}
                                onChange={set("location")}
                                placeholder="City / Location"
                            />
                        </FormRow>

                        <FormRow
                            label="Email"
                            required
                        >
                            <InputLg
                                value={company.email}
                                onChange={set("email")}
                                placeholder="company@email.com"
                            />
                        </FormRow>

                        <FormRow label="Address">
                            <InputLg
                                value={company.address}
                                onChange={set("address")}
                                placeholder="Full Address"
                            />
                        </FormRow>
                        <FormRow required label="Prefix">
                            <InputLg
                                value={company.employee_prefix?.toUpperCase()}
                                onChange={set("employee_prefix")}
                                placeholder="eg: TJKOL - TJPLK"
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={company.isActive}
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
                        {loading
                            ? "Saving..."
                            : "Save"}
                    </Button>

                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>

                    <Button onClick={handleView}>
                        View
                    </Button>

                    <Button onClick={handleClose}>
                        Close
                    </Button>
                </ButtonWrapper>

            </Panel>
        </Wrapper>
    );
};

export default CompanyCreation;