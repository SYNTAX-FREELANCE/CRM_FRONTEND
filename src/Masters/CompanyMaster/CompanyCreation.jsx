
import { Box } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";

import { axioslogin } from "../../Connection/axios";
import {
    infoNotify,
    successNotify,
    warningNotify,
} from "../../constant/Constant";

import { useCompanyMaster } from "../../CommonCode/useQuery";
import { BACKEND_IMAGE } from "../../constant/Static";

const DEFAULT_COMPANY_COLOR = "#1976d2";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const CompanyCreation = () => {
    const [company, setCompany] = useState({
        companyName: "",
        location: "",
        email: "",
        address: "",
        employee_prefix: "",
        display_order: "",
        isActive: "Active",
    });

    const [companyImage, setCompanyImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [companyColor, setCompanyColor] = useState(
        DEFAULT_COMPANY_COLOR
    );

    console.log({
        imagePreview
    });


    const [removeExistingImage, setRemoveExistingImage] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const { refetch: FetchCompanyMaster } = useCompanyMaster();

    const set = (field) => (e) => {
        setCompany((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    // --------------------------------------------------
    // IMAGE UPLOAD
    // --------------------------------------------------

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            warningNotify("Please select a valid image");
            e.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            warningNotify("Image size must not exceed 5 MB");
            e.target.value = "";
            return;
        }

        setCompanyImage(file);
        setImagePreview(URL.createObjectURL(file));
        setRemoveExistingImage(false);

        // Allow selecting the same file again.
        e.target.value = "";
    };

    const handleRemoveImage = () => {
        setCompanyImage(null);
        setImagePreview("");
        setRemoveExistingImage(true);
    };

    // --------------------------------------------------
    // RESET FORM
    // --------------------------------------------------

    const handleReset = useCallback(() => {
        setCompany({
            companyName: "",
            location: "",
            email: "",
            address: "",
            employee_prefix: "",
            display_order: "",
            isActive: "Active",
        });

        setCompanyImage(null);
        setImagePreview("");
        setCompanyColor(DEFAULT_COMPANY_COLOR);
        setRemoveExistingImage(false);
    }, []);

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    const validateCompany = () => {
        if (!company.companyName.trim()) {
            warningNotify("Company Name is required");
            return false;
        }

        if (company.companyName.trim().length > 150) {
            warningNotify(
                "Company Name must not exceed 150 characters"
            );
            return false;
        }

        if (!company.email.trim()) {
            warningNotify("Email is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(company.email.trim())) {
            warningNotify("Enter a valid email address");
            return false;
        }

        if (company.location.trim().length > 100) {
            warningNotify(
                "Location must not exceed 100 characters"
            );
            return false;
        }

        if (
            !/^[A-Za-z]{5}$/.test(
                company.employee_prefix.trim()
            )
        ) {
            warningNotify(
                "Prefix should contain exactly 5 letters (A-Z only)"
            );
            return false;
        }

        if (company.address.trim().length > 255) {
            warningNotify(
                "Address must not exceed 255 characters"
            );
            return false;
        }

        if (!/^#[0-9A-Fa-f]{6}$/.test(companyColor)) {
            warningNotify(
                "Please select a valid hexadecimal color"
            );
            return false;
        }

        return true;
    };

    // --------------------------------------------------
    // FETCH COMPANY FOR EDIT
    // --------------------------------------------------

    const getCompanyById = async (companyId) => {
        try {
            const result = await axioslogin.get(
                `/companimast/getbyid/${companyId}`
            );

            const { success, data, message } = result.data;

            if (success !== 1 || !data) {
                warningNotify(
                    message || "Failed to load company details"
                );
                return;
            }

            setCompany({
                companyName: data.company_name || "",
                location:
                    data.company_location ??
                    data.location ??
                    "",
                email: data.company_email ?? data.email ?? "",
                address:
                    data.company_address ??
                    data.address ??
                    "",
                employee_prefix: data.employee_prefix || "",
                display_order: data.display_order || "",
                isActive:
                    Number(data.is_active) === 1
                        ? "Active"
                        : "Inactive",
            });

            setCompanyImage(null);
            setImagePreview(data.company_image || "");
            setCompanyColor(
                /^#[0-9A-Fa-f]{6}$/.test(data.company_color || "")
                    ? data.company_color
                    : DEFAULT_COMPANY_COLOR
            );

            setRemoveExistingImage(false);
        } catch (error) {
            warningNotify(
                error?.response?.data?.message ||
                "Failed to load company details"
            );
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getCompanyById(id);
        }
    }, [id, mode]);

    // --------------------------------------------------
    // SAVE / UPDATE COMPANY
    // --------------------------------------------------

    const handleSave = async () => {
        if (loading) return;
        if (!validateCompany()) return;

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append(
                "company_name",
                company.companyName.trim()
            );

            // Keep the field names consistent with the API.
            formData.append(
                "company_location",
                company.location.trim()
            );

            formData.append(
                "company_email",
                company.email.trim()
            );

            formData.append(
                "company_address",
                company.address.trim()
            );

            formData.append(
                "employee_prefix",
                company.employee_prefix.trim().toUpperCase()
            );
            formData.append(
                "display_order",
                company.display_order || 0,
            );


            formData.append(
                "isActive",
                company.isActive === "Active" ? "1" : "0"
            );

            formData.append("company_color", companyColor);

            if (companyImage) {
                formData.append(
                    "company_image",
                    companyImage
                );
            }

            if (removeExistingImage) {
                formData.append("remove_company_image", "1");
            }

            let response;

            if (mode === "edit" && id) {
                response = await axioslogin.patch(
                    `/companimast/update/${id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                response = await axioslogin.post(
                    "/companimast/create",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Company updated successfully!"
                        : "Company created successfully!"
                );

                await FetchCompanyMaster();
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

    // --------------------------------------------------
    // CANCEL
    // --------------------------------------------------

    const handleCancel = useCallback(() => {
        handleReset();
        infoNotify("Cancelled");
    }, [handleReset]);

    // --------------------------------------------------
    // VIEW COMPANY MASTER
    // --------------------------------------------------

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
                        headerName: "Company Name",
                    },
                    {
                        field: "location",
                        headerName: "Location",
                    },
                    {
                        field: "email",
                        headerName: "Email",
                    },
                    {
                        field: "address",
                        headerName: "Address",
                    },
                    {
                        field: "employee_prefix",
                        headerName: "Employee Prefix",
                    },
                    {
                        field: "company_color",
                        headerName: "Company Color",
                    },
                    {
                        field: "is_active",
                        headerName: "Status",
                        type: "status",
                    },
                ],
            },
        });
    };

    const handleClose = useCallback(() => {
        navigate("/home/settings");
    }, [navigate]);

    // --------------------------------------------------
    // FORM UI
    // --------------------------------------------------

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
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            width: "70%",
                            maxWidth: "900px",
                            minWidth: 0,
                            "@media (max-width: 768px)": {
                                width: "100%",
                            },
                        }}
                    >
                        <FormRow label="Company Name" required>
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

                        <FormRow label="Email" required>
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

                        <FormRow label="Prefix" required>
                            <InputLg
                                value={company.employee_prefix}
                                onChange={(e) => {
                                    setCompany((prev) => ({
                                        ...prev,
                                        employee_prefix:
                                            e.target.value.toUpperCase(),
                                    }));
                                }}
                                placeholder="Eg: TJKOL"
                            />
                        </FormRow>


                        <FormRow label="Display Order" required>
                            <InputLg
                                value={company.display_order}
                                onChange={(e) => {
                                    setCompany((prev) => ({
                                        ...prev,
                                        display_order:
                                            e.target.value.toUpperCase(),
                                    }));
                                }}
                                placeholder="Eg: 0"
                            />
                        </FormRow>

                        {/* COMPANY IMAGE UPLOAD */}

                        <FormRow label="Company Image">
                            <Box sx={{ width: "100%" }}>
                                <Box
                                    sx={{
                                        border: "1px dashed #b8c0cc",
                                        borderRadius: "10px",
                                        padding: "16px",
                                        backgroundColor: "#fafbfc",
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{
                                            width: "100%",
                                            boxSizing: "border-box",
                                            padding: "8px",
                                            cursor: "pointer",
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            mt: 1,
                                            color: "#64748b",
                                            fontSize: "12px",
                                        }}
                                    >
                                        Supported image formats depend on
                                        your browser. Maximum size: 5 MB.
                                    </Box>

                                    {imagePreview && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                                gap: 2,
                                                mt: 2,
                                                p: 2,
                                                backgroundColor: "#ffffff",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <img
                                                src={
                                                    imagePreview.startsWith("blob:")
                                                        ? imagePreview
                                                        : `${BACKEND_IMAGE}${imagePreview}`
                                                }
                                                alt="Company logo preview"
                                                style={{
                                                    width: "120px",
                                                    height: "100px",
                                                    objectFit: "contain",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "8px",
                                                    padding: "6px",
                                                    backgroundColor: "#ffffff",
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        fontSize: "13px",
                                                        color: "#475569",
                                                    }}
                                                >
                                                    Company image selected
                                                </Box>

                                                <Button
                                                    onClick={
                                                        handleRemoveImage
                                                    }
                                                >
                                                    Remove Image
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </FormRow>

                        {/* COMPANY COLOR PICKER */}

                        <FormRow label="Company Color" required>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    width: "100%",
                                    flexWrap: "wrap",
                                }}
                            >
                                <input
                                    type="color"
                                    aria-label="Select company color"
                                    value={companyColor}
                                    onChange={(e) =>
                                        setCompanyColor(e.target.value)
                                    }
                                    style={{
                                        width: "60px",
                                        height: "42px",
                                        padding: "3px",
                                        cursor: "pointer",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        background: "#ffffff",
                                    }}
                                />

                                <Box sx={{ flex: 1, minWidth: "120px" }}>
                                    <InputLg
                                        value={companyColor}
                                        onChange={(e) =>
                                            setCompanyColor(
                                                e.target.value
                                            )
                                        }
                                        placeholder="#1976d2"
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        backgroundColor: companyColor,
                                        color: "#ffffff",
                                        borderRadius: "8px",
                                        px: 2,
                                        py: 1,
                                        minHeight: "26px",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        border: "1px solid #e5e7eb",
                                    }}
                                >
                                    Preview
                                </Box>
                            </Box>
                        </FormRow>

                        {/* ACTIVE STATUS */}

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
                            : mode === "edit"
                                ? "Update"
                                : "Save"}
                    </Button>

                    <Button
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleView}
                        disabled={loading}
                    >
                        View
                    </Button>

                    <Button
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Close
                    </Button>
                </ButtonWrapper>
            </Panel>
        </Wrapper>
    );
};

export default CompanyCreation;
