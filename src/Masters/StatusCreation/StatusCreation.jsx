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
    successNotify,
    warningNotify
} from "../../constant/Constant";

import { useStatusMaster } from "../../CommonCode/useQuery";

const StatusCreation = () => {

    const [status, setStatus] = useState({
        statusName: "",
        alias: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const { refetch: FetchStatusMaster } = useStatusMaster();

    const set = (field) => (e) =>
        setStatus((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    const handleReset = useCallback(() => {
        setStatus({
            statusName: "",
            alias: "",
            isActive: "Active",
        });
    }, []);

    const validateStatus = () => {

        if (!status.statusName.trim()) {
            warningNotify("Status Name is required");
            return false;
        }

        if (status.statusName.trim().length < 2) {
            warningNotify("Status Name must be at least 2 characters");
            return false;
        }

        if (status.statusName.trim().length > 100) {
            warningNotify("Status Name must not exceed 100 characters");
            return false;
        }

        if (
            status.alias &&
            status.alias.trim().length > 50
        ) {
            warningNotify("Alias must not exceed 50 characters");
            return false;
        }

        return true;
    };

    const getStatusById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/statusmast/getbyid/${id}`
            );

            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setStatus({
                statusName: data.status_name || "",
                alias: data.alias || "",
                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive",
            });

        } catch (error) {

            warningNotify("Failed to load status details");

        }
    };

    useEffect(() => {

        if (mode === "edit" && id) {
            getStatusById(id);
        }

    }, [id, mode]);

    const handleSave = async () => {

        if (!validateStatus()) return;

        setLoading(true);

        try {

            const statusData = {
                status_name: status.statusName.trim(),
                alias: status.alias.trim() || null,
                isActive:
                    status.isActive === "Active"
                        ? 1
                        : 0
            };

            let response;

            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/statusmast/update/${id}`,
                    statusData
                );

            } else {

                response = await axioslogin.post(
                    "/statusmast/create",
                    statusData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Status updated successfully!"
                        : "Status created successfully!"
                );

                FetchStatusMaster();
                handleReset();

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update status"
                            : "Failed to create status"
                    )
                );
            }

        } catch (error) {

            warningNotify(
                error?.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating status"
                        : "Error creating status"
                )
            );

        } finally {

            setLoading(false);

        }
    };

    const handleCancel = () => {
        handleReset();
    };

    const handleView = () => {

        navigate("/home/setting/commonview", {
            state: {
                title: "Status Master",
                type: "status",
                idField: "status_id",
                editRoute: "statusmaster",

                columns: [
                    {
                        field: "status_name",
                        headerName: "Status Name"
                    },
                    {
                        field: "alias",
                        headerName: "Alias"
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
                        ? "Edit Status"
                        : "Status Creation"
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

                        <FormRow
                            label="Status Name"
                            required
                        >
                            <InputLg
                                value={status.statusName}
                                onChange={set("statusName")}
                                placeholder="Enter status name"
                            />
                        </FormRow>

                        <FormRow label="Alias">
                            <InputLg
                                value={status.alias}
                                onChange={set("alias")}
                                placeholder="Alias (optional)"
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={status.isActive}
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

export default StatusCreation;