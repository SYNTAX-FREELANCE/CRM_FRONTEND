import { Box } from "@mui/joy";
import { memo, useCallback, useEffect, useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

import { useLocation, useNavigate } from "react-router-dom";
import { useEmployeeLevelMaster } from "../../CommonCode/useQuery";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import { axioslogin } from "../../Connection/axios";
import { errorNotify, successNotify, warningNotify } from "../../constant/Constant";

const IncentiveSchemeMaster = () => {



    const { data: employeelevelmaster = [] } = useEmployeeLevelMaster();
    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [scheme, setScheme] = useState({
        schemeName: "",
        employeeLevelId: "",
        description: "",
        isActive: "Active",
    });

    // ==================== SET VALUE ====================

    const set = (field) => (e) => {
        setScheme((prev) => ({
            ...prev,
            [field]: e.target.value
        }));
    };




    // ==================== GET INCENTIVE SCHEME BY ID ====================

    const getIncentiveSchemeById = async (id) => {

        try {

            const result = await axioslogin.get(
                `/incentivescheme/getbyid/${id}`
            );
            const { data, success, message } = result?.data;

            if (success !== 1) {
                errorNotify(message);
                return;
            }

            setScheme({

                schemeName: data.scheme_name || "",

                employeeLevelId:
                    data.employee_level_id || "",

                description:
                    data.description || "",

                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive"

            });

        } catch (error) {

            warningNotify(
                "Failed to load incentive scheme details"
            );

        }

    };


    // ==================== EDIT ====================

    useEffect(() => {
        if (mode === "edit" && id) {
            getIncentiveSchemeById(id);
        }
    }, [id, mode]);
    // ==================== VALIDATION ====================

    const validateScheme = () => {

        if (!scheme.schemeName || scheme.schemeName.trim() === "") {
            warningNotify("Scheme Name is required.");
            return false;
        }

        if (scheme.schemeName.trim().length < 2) {
            warningNotify("Scheme Name must be at least 2 characters.");
            return false;
        }

        if (scheme.schemeName.trim().length > 150) {
            warningNotify("Scheme Name must not exceed 150 characters.");
            return false;
        }

        if (!scheme.employeeLevelId) {
            warningNotify("Employee Level is required.");
            return false;
        }

        if (scheme.description.trim().length > 255) {
            warningNotify("Description must not exceed 255 characters.");
            return false;
        }

        return true;
    };

    // ==================== RESET ====================



    const employeelevelOption = Array.isArray(employeelevelmaster) ? employeelevelmaster
        ?.filter(item => item.is_active === 1)
        ?.map(item => ({
            id: item.employee_level_id,
            label: item.level_name
        })) : [];



    // ==================== CANCEL ====================

    const handleCancel = () => {

        setScheme({
            schemeName: "",
            employeeLevelId: "",
            description: "",
            isActive: "Active",
        });

        navigate('.', {
            replace: true,
            state: null
        });

    };

    // ==================== SAVE ====================

    // ==================== SAVE ====================

    const handleSave = async () => {

        if (!validateScheme()) {
            return;
        }

        setLoading(true);

        try {

            const incentiveSchemeData = {
                scheme_name: scheme.schemeName.trim(),
                employee_level_id: scheme.employeeLevelId,
                description: scheme.description.trim() || null,
                isActive: scheme.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/incentivescheme/update/${id}`,
                    incentiveSchemeData
                );

            } else {

                response = await axioslogin.post(
                    "/incentivescheme/create",
                    incentiveSchemeData
                );

            }

            const { success, message } = response.data;

            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Incentive scheme updated successfully!"
                        : "Incentive scheme created successfully!"
                );

                handleCancel();

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update incentive scheme"
                            : "Failed to create incentive scheme"
                    )
                );

            }

        } catch (error) {

            warningNotify(
                error.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating incentive scheme"
                        : "Error creating incentive scheme"
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
                title: "Incentive Scheme Master",
                type: "incentiveScheme",
                idField: "incentive_scheme_id",
                editRoute: "incentiveschema",

                columns: [

                    {
                        field: "scheme_name",
                        headerName: "Scheme Name"
                    },

                    {
                        field: "employee_level_name",
                        headerName: "Employee Level"
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

            <Panel title="Incentive Scheme Master">

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "24px"
                    }}
                >

                    <Box sx={{ width: "70%" }}>

                        <FormRow label="Scheme Name" required>

                            <InputLg
                                value={scheme.schemeName}
                                onChange={set("schemeName")}
                                placeholder="Enter scheme name"
                            />

                        </FormRow>


                        <FormRow label="Employee Level" required>
                            <SelectLg
                                value={scheme.employeeLevelId}
                                onChange={set("employeeLevelId")}
                                options={employeelevelOption}
                            />
                        </FormRow>


                        <FormRow label="Description">

                            <InputLg
                                value={scheme.description}
                                onChange={set("description")}
                                placeholder="Enter description"
                            />

                        </FormRow>

                        <FormRow label="Active Status">

                            <Checkbox
                                value={scheme.isActive}
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
                        disabled={loading}
                        onClick={handleSave}>
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

export default memo(IncentiveSchemeMaster);