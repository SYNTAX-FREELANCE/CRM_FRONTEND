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

const EmployeeLevelMaster = () => {

    const [employeeLevel, setEmployeeLevel] = useState({
        levelName: "",
        description: "",
        isActive: "Active",
    });

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const [loading, setLoading] = useState(false);

    // ==================== SET VALUE ====================

    const set = (field) => (e) => {
        setEmployeeLevel((prev) => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    // ==================== GET EMPLOYEE LEVEL BY ID ====================

    const getEmployeeLevelById = async (id) => {
        try {

            const result = await axioslogin.get(
                `/employeelevel/getbyid/${id}`
            );

            const { data, success, message } = result?.data;

            if (success !== 1) {
                errorNotify(message);
                return;
            }

            setEmployeeLevel({
                levelName: data.level_name || "",
                description: data.description || "",
                isActive: data.is_active === 1
                    ? "Active"
                    : "Inactive"
            });

        } catch (error) {

            warningNotify("Failed to load employee level details");

        }
    };

    // ==================== EDIT ====================

    useEffect(() => {
        if (mode === "edit" && id) {
            getEmployeeLevelById(id);
        }

    }, [id, mode]);

    // ==================== VALIDATION ====================

    const validateEmployeeLevel = () => {

        if (
            !employeeLevel.levelName ||
            employeeLevel.levelName.trim() === ""
        ) {
            warningNotify("Level Name is required.");
            return false;
        }

        if (employeeLevel.levelName.trim().length < 2) {
            warningNotify("Level Name must be at least 2 characters.");
            return false;
        }

        if (employeeLevel.levelName.trim().length > 100) {
            warningNotify("Level Name must not exceed 100 characters.");
            return false;
        }

        if (employeeLevel.description.trim().length > 255) {
            warningNotify("Description must not exceed 255 characters.");
            return false;
        }

        return true;
    };

    // ==================== RESET ====================

    const handleReset = () => {

        setEmployeeLevel({
            levelName: "",
            description: "",
            isActive: "Active",
        });
        navigate(".", {
            state: null,
            replace: true,
        });
    };

    // ==================== CANCEL ====================

    const handleCancel = () => {

        setEmployeeLevel({
            levelName: "",
            description: "",
            isActive: "Active",
        });

        navigate(location.pathname, {
            replace: true,
            state: null
        });

    };

    // ==================== SAVE ====================

    const handleSave = async () => {

        if (!validateEmployeeLevel()) {
            return;
        }

        setLoading(true);

        try {

            const employeeLevelData = {
                level_name: employeeLevel.levelName.trim(),
                description: employeeLevel.description.trim() || null,
                isActive: employeeLevel.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/employeelevel/update/${id}`,
                    employeeLevelData
                );

            } else {

                response = await axioslogin.post(
                    "/employeelevel/create",
                    employeeLevelData
                );

            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Employee level updated successfully!"
                        : "Employee level created successfully!"
                );

                handleReset();

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update employee level"
                            : "Failed to create employee level"
                    )
                );

            }

        } catch (error) {

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating employee level"
                        : "Error creating employee level"
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
                title: "Employee Level Master",
                type: "employeeLevel",
                idField: "employee_level_id",
                editRoute: "employeelevel",

                columns: [

                    {
                        field: "level_name",
                        headerName: "Level Name"
                    },

                    {
                        field: "description",
                        headerName: "Description"
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

            <Panel title="Employee Level Master">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "70%" }}>

                        <FormRow label="Level Name" required>

                            <InputLg
                                value={employeeLevel.levelName}
                                onChange={set("levelName")}
                                placeholder="Enter employee level name"
                            />

                        </FormRow>

                        <FormRow label="Description">

                            <InputLg
                                value={employeeLevel.description}
                                onChange={set("description")}
                                placeholder="Enter description"
                            />

                        </FormRow>

                        <FormRow label="Active Status">

                            <Checkbox
                                value={employeeLevel.isActive}
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

export default EmployeeLevelMaster;