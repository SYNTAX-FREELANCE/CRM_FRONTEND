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

import { useQualificationMaster } from "../../CommonCode/useQuery";

const QualificationCreation = () => {

    const [qualification, setQualification] = useState({
        qualificationName: "",
        alias: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const {
        refetch: FetchQualificationMaster
    } = useQualificationMaster();

    const set = (field) => (e) =>
        setQualification((prev) => ({
            ...prev,
            [field]: e.target.value
        }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleReset = () => {
        setQualification({
            qualificationName: "",
            alias: "",
            isActive: "Active",
        });
    };

    const validateQualification = () => {

        if (!qualification.qualificationName.trim()) {
            warningNotify("Qualification Name is required");
            return false;
        }

        if (qualification.qualificationName.trim().length < 2) {
            warningNotify("Qualification Name must be at least 2 characters");
            return false;
        }

        if (qualification.qualificationName.trim().length > 100) {
            warningNotify("Qualification Name must not exceed 100 characters");
            return false;
        }

        if (
            qualification.alias &&
            qualification.alias.trim().length > 50
        ) {
            warningNotify("Alias must not exceed 50 characters");
            return false;
        }

        return true;
    };

    const getQualificationById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/qualimast/getbyid/${id}`
            );

            const {
                success,
                data,
                message
            } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setQualification({
                qualificationName:
                    data.qualification_name || "",
                alias: data.alias || "",
                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive",
            });

        } catch (error) {

            console.log(error);
            warningNotify(
                "Failed to load qualification details"
            );

        }
    };

    useEffect(() => {

        if (mode === "edit" && id) {
            getQualificationById(id);
        }

    }, [id, mode]);

    const handleSave = async () => {

        if (!validateQualification()) return;

        setLoading(true);

        try {

            const qualificationData = {
                qualification_name:
                    qualification.qualificationName.trim(),

                alias:
                    qualification.alias.trim() || null,

                isActive:
                    qualification.isActive === "Active"
                        ? 1
                        : 0
            };

            let response;

            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/qualimast/update/${id}`,
                    qualificationData
                );

            } else {

                response = await axioslogin.post(
                    "/qualimast/create",
                    qualificationData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Qualification updated successfully!"
                        : "Qualification created successfully!"
                );

                FetchQualificationMaster();
                handleReset();

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update qualification"
                            : "Failed to create qualification"
                    )
                );
            }

        } catch (error) {

            warningNotify(
                error?.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating qualification"
                        : "Error creating qualification"
                )
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
                title: "Qualification Master",
                type: "qualification",
                idField: "qualification_id",
                editRoute: "qualificationmaster",

                columns: [
                    {
                        field: "qualification_name",
                        headerName: "Qualification Name"
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

    const handlePreview = () => {

        if (!qualification.qualificationName) {
            showToast("Fill the form first to preview.");
            return;
        }

        console.log(
            "Previewing Current Data:",
            qualification
        );

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
                        ? "Edit Qualification"
                        : "Qualification Creation"
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
                    }}
                >
                    <Box sx={{ width: "70%" }}>

                        <FormRow
                            label="Qualification Name"
                            required
                        >
                            <InputLg
                                value={qualification.qualificationName}
                                onChange={set("qualificationName")}
                                placeholder="Enter qualification name"
                            />
                        </FormRow>

                        <FormRow label="Alias">
                            <InputLg
                                value={qualification.alias}
                                onChange={set("alias")}
                                placeholder="Alias (optional)"
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={qualification.isActive}
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

export default QualificationCreation;