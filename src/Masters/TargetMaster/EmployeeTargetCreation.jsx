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


import { useAllEmployeeDetails } from "../../CommonCode/useQuery";

import { axioslogin } from "../../Connection/axios";

import {
    errorNotify,
    successNotify,
    warningNotify
} from "../../constant/Constant";
import EmployeeSelect from "../../CommonComponents/EmployeeSelect";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const EmployeeTargetCreation = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const { data: Employee_master = [] } = useAllEmployeeDetails();

    const [loading, setLoading] = useState(false);

    const [target, setTarget] = useState({
        targetDate: dayjs(),
        normalTarget: "",
        renewalTarget: "",
        remarks: "",
        isActive: "Active"
    });

    const [selectedEmployee, setSelectedEmployee] = useState(null);



    const set = (field) => (e) => {
        setTarget(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleEmployeeChange = useCallback((value) => {
        setSelectedEmployee(value);
    }, []);

    const handleReset = useCallback(() => {

        setSelectedEmployee(null);

        setTarget({
            targetDate: dayjs(),
            normalTarget: "",
            renewalTarget: "",
            remarks: "",
            isActive: "Active"
        });

        navigate(location.pathname, {
            replace: true,
            state: null
        });

    }, []);

    const validate = () => {

        if (!selectedEmployee) {
            warningNotify("Please select employee");
            return false;
        }

        if (!target.targetDate || !target.targetDate.isValid()) {
            warningNotify("Please select target month");
            return false;
        }

        if (target.normalTarget === "") {
            warningNotify("Enter normal target");
            return false;
        }

        if (target.renewalTarget === "") {
            warningNotify("Enter renewal target");
            return false;
        }

        if (Number(target.normalTarget) < 0) {
            warningNotify("Normal target cannot be negative");
            return false;
        }

        if (Number(target.renewalTarget) < 0) {
            warningNotify("Renewal target cannot be negative");
            return false;
        }

        return true;

    };

    const getTargetById = async (targetId) => {

        try {

            const result = await axioslogin.get(
                `/target/getbyid/${targetId}`
            );

            const { success, data, message } = result.data;

            if (success !== 1) {
                return errorNotify(message);
            }

            setSelectedEmployee(data?.employee_id || null);

            setTarget({
                targetDate: dayjs(data.target_date),
                normalTarget: data.normal_target,
                renewalTarget: data.renewal_target,
                remarks: data.remarks || "",
                isActive:
                    data.is_active === 1
                        ? "Active"
                        : "Inactive"
            });

        } catch {

            warningNotify("Failed to load target details");

        }

    };

    useEffect(() => {
        if (
            mode === "edit" &&
            id &&
            Employee_master.length > 0
        ) {
            getTargetById(id);
        }
    }, [mode, id, Employee_master]);

    const handleSave = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const postData = {
                employee_id: selectedEmployee,
                target_date: target.targetDate.format("YYYY-MM-01"),
                normal_target: Number(target.normalTarget),
                renewal_target: Number(target.renewalTarget),
                remarks: target.remarks,
                is_active:
                    target.isActive === "Active"
                        ? 1
                        : 0
            };;

            let result;

            if (mode === "edit") {

                result = await axioslogin.patch(
                    `/target/update/${id}`,
                    postData
                );

            } else {

                result = await axioslogin.post(
                    "/target/create",
                    postData
                );

            }

            const { success, message } = result.data;
            if (success === 1) {

                successNotify(
                    mode === "edit"
                        ? "Employee Target updated successfully!"
                        : "Employee Target created successfully!"
                );

                handleReset();

            } else {

                warningNotify(
                    message ||
                    (
                        mode === "edit"
                            ? "Failed to update target"
                            : "Failed to create target"
                    )
                );

            }

        } catch (error) {

            warningNotify(
                error?.response?.data?.message ||
                (
                    mode === "edit"
                        ? "Error updating target"
                        : "Error creating target"
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
                title: "Employee Target Master",
                type: "employeeTarget",
                idField: "target_id",
                editRoute: "targetmaster",

                columns: [
                    {
                        field: "employee_name",
                        headerName: "Employee"
                    },
                    {
                        field: "target_date",
                        headerName: "Target Month"
                    },
                    {
                        field: "normal_target",
                        headerName: "Normal Target"
                    },
                    {
                        field: "renewal_target",
                        headerName: "Renewal Target"
                    },
                    {
                        field: "remarks",
                        headerName: "Remarks"
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
                        ? "Edit Employee Target"
                        : "Employee Target Creation"
                }
            >

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 3
                    }}
                >

                    <Box sx={{ width: "70%" }}>

                        <FormRow
                            label="Employee"
                            required
                        >

                            <Box sx={{ width: "100%" }}>

                                <EmployeeSelect
                                    value={selectedEmployee}
                                    onChange={handleEmployeeChange}
                                    employees={Employee_master}
                                />

                            </Box>

                        </FormRow>

                        <FormRow
                            label="Target Month"
                            required
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    views={["year", "month"]}
                                    openTo="month"
                                    value={target.targetDate}
                                    onChange={(newValue) =>
                                        setTarget(prev => ({
                                            ...prev,
                                            targetDate: newValue
                                        }))
                                    }
                                    format="MMM YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: "small"
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </FormRow>
                        <FormRow
                            label="Normal Target"
                            required
                        >

                            <InputLg
                                type="number"
                                min={1}
                                onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "e") {
                                        e.preventDefault();
                                    }
                                }}
                                value={target.normalTarget}
                                onChange={set("normalTarget")}
                                placeholder="Enter Normal Target"
                            />

                        </FormRow>

                        <FormRow
                            label="Renewal Target"
                            required
                        >
                            <InputLg
                                type="number"
                                min={1}
                                onKeyDown={(e) => {
                                    if (e.key === "-" || e.key === "e") {
                                        e.preventDefault();
                                    }
                                }}
                                value={target.renewalTarget}
                                onChange={set("renewalTarget")}
                                placeholder="Enter Renewal Target"
                            />

                        </FormRow>

                        <FormRow
                            label="Remarks"
                        >

                            <InputLg
                                value={target.remarks}
                                onChange={set("remarks")}
                                placeholder="Enter Remarks"
                            />

                        </FormRow>

                        <FormRow
                            label="Active Status"
                        >

                            <Checkbox
                                value={target.isActive}
                                onChange={set("isActive")}
                            />

                        </FormRow>

                    </Box>

                </Box>

                <div
                    style={{
                        borderTop: "1px solid #e5e7eb",
                        margin: "20px 0"
                    }}
                />

                <ButtonWrapper>

                    <Button
                        onClick={handleSave}
                        disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>

                    <Button onClick={handleCancel}>
                        Reset
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

export default EmployeeTargetCreation;