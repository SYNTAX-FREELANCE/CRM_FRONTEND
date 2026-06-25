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

import { useLeadMaster } from "../../CommonCode/useQuery";

const LeadCreation = () => {
    const [lead, setLead] = useState({
        statusName: "",
        displayOrder: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const { refetch: FetchLeadMaster } = useLeadMaster();

    const set = (field) => (e) =>
        setLead((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleReset = () => {
        setLead({
            statusName: "",
            displayOrder: "",
            isActive: "Active",
        });
    };

    const validateLead = () => {
        if (!lead.statusName.trim()) {
            warningNotify("Status Name is required");
            return false;
        }

        if (lead.statusName.trim().length < 2) {
            warningNotify("Status Name must be at least 2 characters");
            return false;
        }

        if (lead.statusName.trim().length > 100) {
            warningNotify("Status Name must not exceed 100 characters");
            return false;
        }

        if (lead.displayOrder === "" || isNaN(parseInt(lead.displayOrder, 10))) {
            warningNotify("Display Order is required and must be an integer");
            return false;
        }

        return true;
    };

    const getLeadById = async (id) => {
        try {
            const result = await axioslogin.get(`/leadmast/getbyid/${id}`);
            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setLead({
                statusName: data.status_name || "",
                displayOrder: data.display_order !== undefined ? String(data.display_order) : "",
                isActive: data.is_active === 1 ? "Active" : "Inactive",
            });
        } catch (error) {
            console.error(error);
            warningNotify("Failed to load lead status details");
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getLeadById(id);
        }
    }, [id, mode]);

    const handleSave = async () => {
        if (!validateLead()) return;

        setLoading(true);

        try {
            const leadData = {
                status_name: lead.statusName.trim(),
                display_order: parseInt(lead.displayOrder, 10),
                is_active: lead.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(
                    `/leadmast/update/${id}`,
                    leadData
                );
            } else {
                response = await axioslogin.post(
                    "/leadmast/create",
                    leadData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Lead Status updated successfully!"
                        : "Lead Status created successfully!"
                );

                FetchLeadMaster();
                handleReset();
                if (mode === "edit") {
                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Lead Status Master",
                            type: "lead",
                            idField: "status_id",
                            editRoute: "leadmaster",
                            columns: [
                                {
                                    field: "status_name",
                                    headerName: "Status Name"
                                },
                                {
                                    field: "display_order",
                                    headerName: "Display Order"
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
                        ? "Failed to update lead status"
                        : "Failed to create lead status")
                );
            }
        } catch (error) {
            warningNotify(
                error?.response?.data?.message ||
                (mode === "edit"
                    ? "Error updating lead status"
                    : "Error creating lead status")
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
                title: "Lead Status Master",
                type: "lead",
                idField: "status_id",
                editRoute: "leadmaster",
                columns: [
                    {
                        field: "status_name",
                        headerName: "Status Name"
                    },
                    {
                        field: "display_order",
                        headerName: "Display Order"
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
        if (!lead.statusName) {
            showToast("Fill the form first to preview.");
            return;
        }

        console.log("Preview:", lead);
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
                title={mode === "edit" ? "Edit Lead Status" : "Lead Status Creation"}
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
                            label="Status Name"
                            required
                        >
                            <InputLg
                                value={lead.statusName}
                                onChange={set("statusName")}
                                placeholder="Enter status name"
                            />
                        </FormRow>

                        <FormRow
                            label="Display Order"
                            required
                        >
                            <InputLg
                                value={lead.displayOrder}
                                onChange={set("displayOrder")}
                                placeholder="Enter display order (integer)"
                                type="number"
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={lead.isActive}
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

export default LeadCreation;
