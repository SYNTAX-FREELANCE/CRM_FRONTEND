
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

import { useInsuranceCompanyMaster } from "../../CommonCode/useQuery";
import { BACKEND_IMAGE } from "../../constant/Static";

const DEFAULT_COMPANY_COLOR = "#1976d2";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const InsuranceCompanyCreation = () => {
    const [insurance, setInsurance] = useState({
        companyName: "",
        contactNumber: "",
        email: "",
        display_order: "0",
        isActive: "Active",
    });

    const [companyImage, setCompanyImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [companyColor, setCompanyColor] = useState(
        DEFAULT_COMPANY_COLOR
    );
    const [removeExistingImage, setRemoveExistingImage] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const {
        refetch: FetchInsuranceCompanyMaster,
    } = useInsuranceCompanyMaster();

    const set = (field) => (e) => {
        setInsurance((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    // CONTACT NUMBER
    const handleContactChange = (e) => {
        const value = e.target.value;

        if (/^\d*$/.test(value) && value.length <= 10) {
            setInsurance((prev) => ({
                ...prev,
                contactNumber: value,
            }));
        }
    };

    // IMAGE UPLOAD
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

        e.target.value = "";
    };

    const handleRemoveImage = () => {
        setCompanyImage(null);
        setImagePreview("");
        setRemoveExistingImage(true);
    };

    // RESET FORM
    const handleReset = useCallback(() => {
        setInsurance({
            companyName: "",
            contactNumber: "",
            email: "",
            display_order: "0",
            isActive: "Active",
        });

        setCompanyImage(null);
        setImagePreview("");
        setCompanyColor(DEFAULT_COMPANY_COLOR);
        setRemoveExistingImage(false);
    }, []);

    // VALIDATION
    const validateInsuranceCompany = () => {
        if (!insurance.companyName.trim()) {
            warningNotify("Company Name is required");
            return false;
        }

        if (insurance.companyName.trim().length < 2) {
            warningNotify(
                "Company Name must be at least 2 characters"
            );
            return false;
        }

        if (insurance.companyName.trim().length > 200) {
            warningNotify(
                "Company Name cannot exceed 200 characters"
            );
            return false;
        }

        if (!insurance.contactNumber.trim()) {
            warningNotify("Contact Number is required");
            return false;
        }

        if (!/^\d{10}$/.test(insurance.contactNumber.trim())) {
            warningNotify(
                "Contact Number must be exactly 10 digits"
            );
            return false;
        }

        if (!insurance.email.trim()) {
            warningNotify("Email address is required");
            return false;
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                insurance.email.trim()
            )
        ) {
            warningNotify("Please enter a valid email address");
            return false;
        }

        if (
            insurance.display_order === "" ||
            !Number.isInteger(Number(insurance.display_order)) ||
            Number(insurance.display_order) < 0
        ) {
            warningNotify(
                "Display order must be a non-negative integer"
            );
            return false;
        }

        if (!/^#[0-9A-Fa-f]{6}$/.test(companyColor)) {
            warningNotify("Please select a valid company color");
            return false;
        }

        return true;
    };

    // FETCH COMPANY FOR EDIT
    const getInsuranceCompanyById = async (companyId) => {
        try {
            const result = await axioslogin.get(
                `/insurancecompany/getbyid/${companyId}`
            );

            const { success, data, message } = result.data;

            if (success !== 1 || !data) {
                warningNotify(
                    message || "Failed to load insurance company"
                );
                return;
            }

            setInsurance({
                companyName: data.company_name || "",
                contactNumber: data.contact_number || "",
                email: data.email || "",
                display_order: String(data.display_order ?? 0),
                isActive: Number(data.is_active) === 1
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
            console.error(
                "getInsuranceCompanyById error:",
                error
            );

            warningNotify(
                error?.response?.data?.message ||
                "Failed to load insurance company details"
            );
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getInsuranceCompanyById(id);
        }
    }, [id, mode]);

    // SAVE / UPDATE
    const handleSave = async () => {
        if (loading || !validateInsuranceCompany()) return;

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append(
                "company_name",
                insurance.companyName.trim()
            );

            formData.append(
                "contact_number",
                insurance.contactNumber.trim()
            );

            formData.append(
                "email",
                insurance.email.trim()
            );

            formData.append(
                "display_order",
                String(Number(insurance.display_order))
            );

            formData.append(
                "isActive",
                insurance.isActive === "Active" ? "1" : "0"
            );

            formData.append("company_color", companyColor);

            if (companyImage) {
                formData.append("insurance_compnay", companyImage);
            }

            if (removeExistingImage) {
                formData.append("remove_insurance_compnay", "1");
            }

            let response;

            if (mode === "edit" && id) {
                response = await axioslogin.patch(
                    `/insurancecompany/update/${id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                response = await axioslogin.post(
                    "/insurancecompany/create",
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
                        ? "Insurance Company updated successfully!"
                        : "Insurance Company created successfully!"
                );

                await FetchInsuranceCompanyMaster();

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
                                    headerName: "Company Name",
                                },
                                {
                                    field: "contact_number",
                                    headerName: "Contact Number",
                                },
                                {
                                    field: "email",
                                    headerName: "Email",
                                },
                                {
                                    field: "display_order",
                                    headerName: "Display Order",
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
                } else {
                    handleReset();
                }
            } else {
                warningNotify(
                    message ||
                    "Failed to save insurance company"
                );
            }
        } catch (error) {
            console.error("handleSave error:", error);

            warningNotify(
                error?.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating insurance company"
                        : "Error creating insurance company"
                )
            );
        } finally {
            setLoading(false);
        }
    };

    // CANCEL
    const handleCancel = useCallback(() => {
        handleReset();
        infoNotify("Form cleared");
    }, [handleReset]);

    // VIEW
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
                        headerName: "Company Name",
                    },
                    {
                        field: "contact_number",
                        headerName: "Contact Number",
                    },
                    {
                        field: "email",
                        headerName: "Email",
                    },
                    {
                        field: "display_order",
                        headerName: "Display Order",
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

    return (
        <Wrapper>
            <Panel
                title={
                    mode === "edit"
                        ? "Edit Insurance Company"
                        : "Insurance Company Creation"
                }
                onBack={handleClose}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        gap: "24px",
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
                                value={insurance.companyName}
                                onChange={set("companyName")}
                                placeholder="Enter company name"
                            />
                        </FormRow>

                        <FormRow label="Contact Number" required>
                            <InputLg
                                value={insurance.contactNumber}
                                onChange={handleContactChange}
                                placeholder="Enter 10-digit contact number"
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

                        {/* DISPLAY ORDER */}
                        <FormRow label="Display Order" required>
                            <InputLg
                                value={insurance.display_order}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (/^\d*$/.test(value)) {
                                        setInsurance((prev) => ({
                                            ...prev,
                                            display_order: value,
                                        }));
                                    }
                                }}
                                placeholder="Enter display order"
                                type="number"
                            />
                        </FormRow>

                        {/* COMPANY IMAGE */}
                        <FormRow label="Company Image">
                            <Box
                                sx={{
                                    width: "100%",
                                    border: "1px dashed #b8c0cc",
                                    borderRadius: "10px",
                                    padding: "16px",
                                    backgroundColor: "#fafbfc",
                                    boxSizing: "border-box",
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
                                    Select an image. Maximum size: 5 MB.
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
                                            alt="Insurance company preview"
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

                                        <Button
                                            onClick={handleRemoveImage}
                                        >
                                            Remove Image
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </FormRow>

                        {/* COMPANY COLOR */}
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
                                    value={companyColor}
                                    aria-label="Select company color"
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

                                <Box
                                    sx={{
                                        flex: 1,
                                        minWidth: "120px",
                                    }}
                                >
                                    <InputLg
                                        value={companyColor}
                                        onChange={(e) =>
                                            setCompanyColor(e.target.value)
                                        }
                                        placeholder="#1976d2"
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(
                                            companyColor
                                        )
                                            ? companyColor
                                            : DEFAULT_COMPANY_COLOR,
                                        color: "#ffffff",
                                        borderRadius: "8px",
                                        px: 2,
                                        py: 1,
                                        minHeight: "26px",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Preview
                                </Box>
                            </Box>
                        </FormRow>

                        {/* ACTIVE STATUS */}
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

export default InsuranceCompanyCreation;
