
import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Panel from "../../Settings/CommonMasterComponent/Panel";

import { axioslogin } from "../../Connection/axios";
import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";

// Update this import if you create a separate query hook
import { usePolicyClaimStatusMaster } from "../../CommonCode/useQuery";

const PolicyClaimStatusCreation = () => {

    const [claimStatus, setClaimStatus] = useState({
        claimStatusName: "",
        claimStatusCode: "",
        claimStatusDescription: "",
        claimStatusColor: "#64748b",
        sequenceNo: "",
        isInitial: "Inactive",
        isFinal: "Inactive",
        isActive: "Active",
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const { refetch: FetchClaimStatusMaster } = usePolicyClaimStatusMaster();

    const set = (field) => (e) =>
        setClaimStatus((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    const handleReset = () => {
        setClaimStatus({
            claimStatusName: "",
            claimStatusCode: "",
            claimStatusDescription: "",
            claimStatusColor: "#64748b",
            sequenceNo: "",
            isInitial: "Inactive",
            isFinal: "Inactive",
            isActive: "Active",
        });
    };

    const validateClaimStatus = () => {

        if (!claimStatus.claimStatusName.trim()) {
            warningNotify("Claim Status Name is required");
            return false;
        }

        if (claimStatus.claimStatusName.trim().length < 2) {
            warningNotify("Claim Status Name must be at least 2 characters");
            return false;
        }

        if (claimStatus.claimStatusName.trim().length > 100) {
            warningNotify("Claim Status Name must not exceed 100 characters");
            return false;
        }

        if (!claimStatus.claimStatusCode.trim()) {
            warningNotify("Claim Status Code is required");
            return false;
        }

        if (!/^[A-Za-z0-9_]+$/.test(claimStatus.claimStatusCode.trim())) {
            warningNotify("Claim Status Code can contain only letters, numbers and underscores");
            return false;
        }

        if (
            claimStatus.sequenceNo === "" ||
            !Number.isInteger(Number(claimStatus.sequenceNo))
        ) {
            warningNotify("Sequence Number is required and must be an integer");
            return false;
        }

        if (Number(claimStatus.sequenceNo) < 0) {
            warningNotify("Sequence Number cannot be negative");
            return false;
        }

        return true;
    };

    const getClaimStatusById = async (id) => {
        try {
            const result = await axioslogin.get(
                `/policyclaimstatus/getbyid/${id}`
            );

            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setClaimStatus({
                claimStatusName: data.claim_status_name || "",
                claimStatusCode: data.claim_status_code || "",
                claimStatusDescription: data.claim_status_description || "",
                claimStatusColor: data.claim_status_color || "#64748b",
                sequenceNo: data.sequence_no !== undefined
                    ? String(data.sequence_no)
                    : "",
                isInitial: data.is_initial === 1 ? "Active" : "Inactive",
                isFinal: data.is_final === 1 ? "Active" : "Inactive",
                isActive: data.is_active === 1 ? "Active" : "Inactive",
            });

        } catch (error) {
            console.error(error);
            warningNotify("Failed to load claim status details");
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getClaimStatusById(id);
        }
    }, [id, mode]);

    const handleSave = async () => {

        if (!validateClaimStatus()) return;

        setLoading(true);

        try {

            const statusData = {
                claim_status_name: claimStatus.claimStatusName.trim(),
                claim_status_code: claimStatus.claimStatusCode.trim().toUpperCase(),
                claim_status_description: claimStatus.claimStatusDescription.trim() || null,
                claim_status_color: claimStatus.claimStatusColor || null,
                sequence_no: parseInt(claimStatus.sequenceNo, 10),
                is_initial: claimStatus.isInitial === "Active" ? 1 : 0,
                is_final: claimStatus.isFinal === "Active" ? 1 : 0,
                is_active: claimStatus.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(
                    `/policyclaimstatus/update/${id}`,
                    statusData
                );
            } else {
                response = await axioslogin.post(
                    "/policyclaimstatus/create",
                    statusData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Claim Status updated successfully!"
                        : "Claim Status created successfully!"
                );

                FetchClaimStatusMaster();
                handleReset();

                if (mode === "edit") {
                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Policy Claim Status Master",
                            type: "policyclaimstatus",
                            idField: "claim_status_id",
                            editRoute: "policyclaimstatus",
                            columns: [
                                {
                                    field: "claim_status_name",
                                    headerName: "Claim Status"
                                },
                                {
                                    field: "claim_status_code",
                                    headerName: "Status Code"
                                },
                                {
                                    field: "sequence_no",
                                    headerName: "Sequence"
                                },
                                {
                                    field: "is_initial",
                                    headerName: "Initial",
                                    type: "status"
                                },
                                {
                                    field: "is_final",
                                    headerName: "Final",
                                    type: "status"
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
                        ? "Failed to update claim status"
                        : "Failed to create claim status")
                );
            }

        } catch (error) {
            warningNotify(
                error?.response?.data?.message ||
                (mode === "edit"
                    ? "Error updating claim status"
                    : "Error creating claim status")
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = useCallback(() => {
        handleReset();
    }, []);

    const handleView = () => {
        navigate("/home/setting/commonview", {
            state: {
                title: "Policy Claim Status Master",
                type: "policyclaimstatus",
                idField: "claim_status_id",
                editRoute: "policyclaimstatus",
                columns: [
                    {
                        field: "claim_status_name",
                        headerName: "Claim Status"
                    },
                    {
                        field: "claim_status_code",
                        headerName: "Status Code"
                    },
                    {
                        field: "sequence_no",
                        headerName: "Sequence"
                    },
                    {
                        field: "is_initial",
                        headerName: "Initial",
                        type: "status"
                    },
                    {
                        field: "is_final",
                        headerName: "Final",
                        type: "status"
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
        navigate("/home/settings");
    }, [navigate]);

    return (
        <Wrapper>

            <Panel
                title={
                    mode === "edit"
                        ? "Edit Policy Claim Status"
                        : "Policy Claim Status Creation"
                }
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px",
                    }}
                >
                    <Box sx={{ width: "70%" }}>

                        <FormRow label="Claim Status Name" required>
                            <InputLg
                                value={claimStatus.claimStatusName}
                                onChange={set("claimStatusName")}
                                placeholder="Enter claim status name"
                            />
                        </FormRow>

                        <FormRow label="Claim Status Code" required>
                            <InputLg
                                value={claimStatus.claimStatusCode}
                                onChange={set("claimStatusCode")}
                                placeholder="Eg: UNDER_REVIEW"
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputLg
                                value={claimStatus.claimStatusDescription}
                                onChange={set("claimStatusDescription")}
                                placeholder="Enter status description"
                            />
                        </FormRow>

                        <FormRow label="Status Color">
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2
                            }}>
                                <input
                                    type="color"
                                    value={claimStatus.claimStatusColor}
                                    onChange={(e) =>
                                        setClaimStatus((prev) => ({
                                            ...prev,
                                            claimStatusColor: e.target.value
                                        }))
                                    }
                                    style={{
                                        width: "45px",
                                        height: "35px",
                                        border: "none",
                                        cursor: "pointer",
                                        background: "transparent"
                                    }}
                                />
                                <InputLg
                                    value={claimStatus.claimStatusColor}
                                    onChange={set("claimStatusColor")}
                                    placeholder="#64748b"
                                />
                            </Box>
                        </FormRow>

                        <FormRow label="Sequence Number" required>
                            <InputLg
                                value={claimStatus.sequenceNo}
                                onChange={set("sequenceNo")}
                                placeholder="Enter sequence number"
                                type="number"
                            />
                        </FormRow>

                        <FormRow label="Initial Status">
                            <Checkbox
                                value={claimStatus.isInitial}
                                onChange={set("isInitial")}
                            />
                        </FormRow>

                        <FormRow label="Final Status">
                            <Checkbox
                                value={claimStatus.isFinal}
                                onChange={set("isFinal")}
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={claimStatus.isActive}
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

                    <Button onClick={handleClose}>
                        Close
                    </Button>

                </ButtonWrapper>

            </Panel>

        </Wrapper>
    );
};

export default memo(PolicyClaimStatusCreation);
