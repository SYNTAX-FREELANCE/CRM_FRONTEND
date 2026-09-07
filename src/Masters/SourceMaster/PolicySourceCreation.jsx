
import { Box } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

import {
    warningNotify,
    successNotify,
    errorNotify
} from "../../constant/Constant";

import { axioslogin } from "../../Connection/axios";
import { useLocation, useNavigate } from "react-router-dom";

const PolicySourceCreation = () => {

    const [source, setSource] = useState({
        sourceName: "",
        isActive: "Active",
    });

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const [loading, setLoading] = useState(false);

    // ==================== SET VALUE ====================

    const set = (field) => (e) => {
        setSource((prev) => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    // ==================== GET SOURCE BY ID ====================

    const getSourceById = async (id) => {
        try {

            const result = await axioslogin.get(
                `/policysource/getbyid/${id}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {
                errorNotify(message);
                return;
            }

            setSource({
                sourceName: data.source_name || "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive"
            });

        } catch (error) {

            warningNotify("Failed to load source details");

        }
    };

    // ==================== EDIT ====================

    useEffect(() => {
        if (mode === "edit" && id) {
            getSourceById(id);
        }
    }, [id, mode]);

    // ==================== VALIDATION ====================

    const validateSource = () => {

        if (!source.sourceName || source.sourceName.trim() === "") {
            warningNotify("Source Name is required.");
            return false;
        }

        if (source.sourceName.trim().length < 2) {
            warningNotify("Source Name must be at least 2 characters.");
            return false;
        }

        if (source.sourceName.trim().length > 100) {
            warningNotify("Source Name must not exceed 100 characters.");
            return false;
        }

        return true;
    };

    // ==================== RESET ====================

    const handleReset = () => {
        setSource({
            sourceName: "",
            isActive: "Active",
        });

    };

    // ==================== CANCEL ====================

    const handleCancel = () => {
        setSource({
            sourceName: "",
            isActive: "Active",
        });
        navigate(location.pathname, { replace: true, state: null });
    };

    // ==================== SAVE ====================

    const handleSave = async () => {

        if (!validateSource()) {
            return;
        }

        setLoading(true);

        try {

            const sourceData = {
                source_name: source.sourceName.trim(),
                isActive: source.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/policysource/update/${id}`,
                    sourceData
                );

            } else {

                response = await axioslogin.post(
                    "/policysource/create",
                    sourceData
                );

            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Policy source updated successfully!"
                        : "Policy source created successfully!"
                );

                handleReset();

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update policy source"
                            : "Failed to create policy source"
                    )
                );

            }

        } catch (error) {

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating policy source"
                        : "Error creating policy source"
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
                title: "Policy Source Master",
                type: "policySource",
                idField: "source_id",
                editRoute: "policysource",
                columns: [

                    {
                        field: "source_name",
                        headerName: "Source Name"
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

            <Panel title="Policy Source Creation">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "70%" }}>

                        <FormRow label="Source Name" required>

                            <InputLg
                                value={source.sourceName}
                                onChange={set("sourceName")}
                                placeholder="Enter source name"
                            />

                        </FormRow>

                        <FormRow label="Active Status">

                            <Checkbox
                                value={source.isActive}
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
                                : "Save"
                        }
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

export default PolicySourceCreation;

