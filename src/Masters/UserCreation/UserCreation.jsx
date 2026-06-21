import { Box } from "@mui/joy";
import { useEffect, useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputSm from "../../Settings/CommonMasterComponent/InputSm";
import InputMd from "../../Settings/CommonMasterComponent/InputMd";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import InputDate from "../../Settings/CommonMasterComponent/InputDate";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import { errorNotify, successNotify, warningNotify } from "../../constant/Constant";
import { axioslogin } from "../../Axios/axios";
import {
    GENDER_OTPION
} from '../../CommonCode/Reusable';
import {
    useRoleMaster,
    useCompanyMaster,
    useStatusMaster,
    useQualificationMaster,
    useEmployeeMaster
} from "../../CommonCode/useQuery";
import { useLocation, useNavigate } from "react-router-dom";


const UserCreation = () => {
    const [employee, setEmployee] = useState({
        name: "",
        age: "",
        gender: "",
        qualification: "",
        dateOfJoin: "",
        experience: "",
        mobileNumber1: "",
        mobileNumber2: "",
        aadharNumber: "",
        company: "",
        role: "",
        userStatus: "",
        isActive: 'Active'
    });

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const set = (field) => (e) =>
        setEmployee((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    // ==================== MASTER DATA ====================
    const { data: RoleMasterDetail } = useRoleMaster();
    const { data: CompanyMasterDetail } = useCompanyMaster();
    const { data: StatusMaster } = useStatusMaster();
    const { data: QualificationMaster } = useQualificationMaster();

    const { refetch: FetchEmployeeMaster } = useEmployeeMaster();

    // ==================== OPTION MAPPING ====================
    const roleOptions = Array.isArray(RoleMasterDetail) ? RoleMasterDetail
        ?.filter(item => item.is_active === 1)
        ?.map(item => ({
            id: item.role_id,
            label: item.role_name
        })) : [];

    const companyOption = Array.isArray(CompanyMasterDetail) ? CompanyMasterDetail
        ?.filter(item => item.is_active === 1)
        ?.map(item => ({
            id: item.company_id,
            label: item.company_name
        })) : [];

    const qualificationOption = Array.isArray(QualificationMaster) ? QualificationMaster
        ?.filter(item => item.is_active === 1)
        ?.map(item => ({
            id: item.qualification_id,
            label: item.qualification_name
        })) : [];

    const statusOption = Array.isArray(StatusMaster) ? StatusMaster
        ?.filter(item => item.is_active === 1)
        ?.map(item => ({
            id: item.status_id,
            label: item.status_name
        })) : [];

    // ==================== FETCH BY ID ====================
    const getEmployeeById = async (id) => {
        try {
            const result = await axioslogin.get(`/employee/getbyid/${id}`);
            const { success, data } = result?.data;

            if (success !== 1) return errorNotify("Failed to load employee details");

            setEmployee({
                name: data.name || "",
                age: String(data.age) || "",
                gender: data.gender || "",
                qualification: data.qualification_id || "",
                dateOfJoin: data.date_of_join ? data.date_of_join.split("T")[0] : "",
                experience: data.experience || "",
                mobileNumber1: data.mobile_number_1 || "",
                mobileNumber2: data.mobile_number_2 || "",
                aadharNumber: data.aadhar_number || "",
                company: data.company_id || "",
                role: data.role_id || "",
                userStatus: data.user_status,
                isActive:data.is_active === 1 ? "Active" : "Inactive"
            });
        } catch (error) {
            console.log(error);
            warningNotify("Failed to load employee details");
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getEmployeeById(id);
        }
    }, [id, mode]);

    // ==================== VALIDATION ====================
    const validateEmployee = () => {
        // Name validation (REQUIRED)
        if (!employee.name || employee.name.trim() === "") {
            warningNotify("Name is required.");
            return false;
        }

        if (employee.name.trim().length < 2) {
            warningNotify("Name must be at least 2 characters.");
            return false;
        }

        if (employee.name.trim().length > 100) {
            warningNotify("Name must not exceed 100 characters.");
            return false;
        }

        // Mobile Number 1 validation (REQUIRED)
        if (!employee.mobileNumber1 || employee.mobileNumber1.trim() === "") {
            warningNotify("Mobile Number is required.");
            return false;
        }

        if (!/^\d{10}$/.test(employee.mobileNumber1.trim())) {
            warningNotify("Please enter a valid 10-digit mobile number.");
            return false;
        }

        // Mobile Number 2 validation (OPTIONAL - only validate format if provided)
        if (employee.mobileNumber2 && employee.mobileNumber2.trim() !== "" && !/^\d{10}$/.test(employee.mobileNumber2.trim())) {
            warningNotify("Please enter a valid 10-digit alternate mobile number.");
            return false;
        }

        // Aadhaar validation (REQUIRED per your FormRow)
        if (!employee.aadharNumber || employee.aadharNumber.trim() === "") {
            warningNotify("Aadhaar Number is required.");
            return false;
        }

        if (!/^\d{12}$/.test(employee.aadharNumber.trim())) {
            warningNotify("Please enter a valid 12-digit Aadhaar number.");
            return false;
        }

        // Gender validation (REQUIRED)
        if (!employee.gender || employee.gender === "") {
            warningNotify("Gender is required.");
            return false;
        }

        // Age validation (REQUIRED per your FormRow)
        if (!employee.age || employee.age.trim() === "") {
            warningNotify("Age is required.");
            return false;
        }

        if (!Number.isInteger(Number(employee.age)) || Number(employee.age) < 18 || Number(employee.age) > 80) {
            warningNotify("Age must be between 18 and 80.");
            return false;
        }

        // Qualification validation (REQUIRED per your FormRow)
        if (!employee.qualification || employee.qualification === "") {
            warningNotify("Qualification is required.");
            return false;
        }

        if (!Number.isInteger(Number(employee.qualification))) {
            warningNotify("Please select a valid qualification.");
            return false;
        }

        // Date of Join validation (REQUIRED per your FormRow)
        if (!employee.dateOfJoin || employee.dateOfJoin === "") {
            warningNotify("Date of Join is required.");
            return false;
        }

        // Company validation (REQUIRED per your FormRow)
        if (!employee.company || employee.company === "") {
            warningNotify("Company is required.");
            return false;
        }

        if (!Number.isInteger(Number(employee.company))) {
            warningNotify("Please select a valid company.");
            return false;
        }

        // Role validation (REQUIRED per your FormRow)
        if (!employee.role || employee.role === "") {
            warningNotify("Role is required.");
            return false;
        }

        if (!Number.isInteger(Number(employee.role))) {
            warningNotify("Please select a valid role.");
            return false;
        }

        // Status validation (REQUIRED per your FormRow)
        if (!employee.userStatus || employee.userStatus === "") {
            warningNotify("Status is required.");
            return false;
        }

        if (!Number.isInteger(Number(employee.userStatus))) {
            warningNotify("Please select a valid status.");
            return false;
        }

        // Experience validation (OPTIONAL)
        if (employee.experience && employee.experience.trim().length > 100) {
            warningNotify("Experience must not exceed 100 characters.");
            return false;
        }

        return true;
    };
    // ==================== HANDLERS ====================
    const handleReset = () => {
        setEmployee({
            name: "",
            age: "",
            gender: "",
            qualification: "",
            dateOfJoin: "",
            experience: "",
            mobileNumber1: "",
            mobileNumber2: "",
            aadharNumber: "",
            company: "",
            role: "",
            userStatus: "Active",
        });
    };

    const handleCancel = () => {
        setEmployee({
            name: "",
            age: "",
            gender: "",
            qualification: "",
            dateOfJoin: "",
            experience: "",
            mobileNumber1: "",
            mobileNumber2: "",
            aadharNumber: "",
            company: "",
            role: "",
            userStatus: "",
            isActive:'Active'
        });
        setSavedData(null);
        showToast("Form cleared");
    };

    const handleSave = async () => {
        if (!validateEmployee()) {
            return;
        }

        setLoading(true);

        try {
            const postData = {
                name: employee.name.trim(),
                age: employee.age ? Number(employee.age) : null,
                gender: employee.gender || null,
                qualification_id: employee.qualification || null,
                date_of_join: employee.dateOfJoin || null,
                experience: employee.experience.trim() || null,
                mobile_number_1: employee.mobileNumber1.trim(),
                mobile_number_2: employee.mobileNumber2 ? employee.mobileNumber2.trim() : null,
                aadhar_number: employee.aadharNumber ? employee.aadharNumber.trim() : null,
                company_id: employee.company || null,
                role_id: employee.role || null,
                user_status: employee.userStatus ,
                is_active: employee.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(`/employee/update/${id}`, postData);
            } else {
                response = await axioslogin.post("/employee/create", postData);
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Employee updated successfully!"
                        : "Employee created successfully!"
                );
                FetchEmployeeMaster();
                handleReset();
            } else {
                warningNotify(
                    message ||
                    (mode === "edit"
                        ? "Failed to update employee"
                        : "Failed to create employee")
                );
            }
        } catch (error) {
            console.log(error);
            warningNotify(
                error.response?.data?.message ||
                (mode === "edit"
                    ? "Error updating employee"
                    : "Error creating employee")
            );
        } finally {
            setLoading(false);
        }
    };

    const handleView = () => {
        navigate("/home/setting/commonview", {
            state: {
                title: "Employee Master",
                type: 'employee',
                idField: 'user_id',
                editRoute: "/employeemaster",  // Update to your actual route
                columns: [
                    {
                        field: "employee_id",
                        headerName: "Employee ID",
                        width: 120,
                        flex: 0.5
                    },
                    {
                        field: "name",
                        headerName: "Name",
                        width: 200,
                        flex: 1
                    },
                    {
                        field: "age",
                        headerName: "Age",
                        width: 40,
                        flex: 0.1
                    },
                    {
                        field: "gender",
                        headerName: "Gender",
                        width: 60,
                        flex: 0.1
                    },
                    {
                        field: "qualification_name",
                        headerName: "Qualification",
                        width: 150,
                        flex: 0.7
                    },
                    {
                        field: "date_of_join",
                        headerName: "Date of Join",
                        width: 140,
                        flex: 0.6,
                        type: "string"
                    },
                    {
                        field: "experience",
                        headerName: "Experience",
                        width: 180,
                        flex: 0.8
                    },
                    {
                        field: "mobile_number_1",
                        headerName: "Mobile Number 1",
                        width: 150,
                        flex: 0.8
                    },
                    {
                        field: "mobile_number_2",
                        headerName: "Mobile Number 2",
                        width: 150,
                        flex: 0.7
                    },
                    {
                        field: "aadhar_number",
                        headerName: "Aadhaar Number",
                        width: 180,
                        flex: 0.9
                    },
                    {
                        field: "company_name",
                        headerName: "Company",
                        width: 180,
                        flex: 1
                    },
                    {
                        field: "role_name",
                        headerName: "Role",
                        width: 180,
                        flex: 1
                    },
                    {
                        field: "status_name",
                        headerName: "Status",
                        width: 120,
                        flex: 0.6,
                    },
                    {
                        field: "is_active",
                        headerName: "Active",
                        width: 100,
                        flex: 0.4,
                        type: 'status'
                    },
                ]
            }
        });
    };
    const handlePreview = () => {
        if (!employee.name) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", employee);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    // ==================== RENDER ====================
    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="User Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                    <Box sx={{ width: '48%' }}>

                        <FormRow label="Name" required>
                            <InputLg
                                value={employee.name}
                                onChange={set("name")}
                                placeholder="Enter full name"
                            />
                        </FormRow>

                        <FormRow label="Age" required>
                            <InputSm
                                value={employee.age}
                                onChange={set("age")}
                                placeholder="Age (18-80)"
                                min="18"
                                max="80"
                            />
                        </FormRow>

                        <FormRow label="Gender" required>
                            <SelectLg
                                value={employee.gender}
                                onChange={set("gender")}
                                options={GENDER_OTPION}
                            />
                        </FormRow>

                        <FormRow label="Mobile Number" required>
                            <InputMd
                                value={employee.mobileNumber1}
                                onChange={set("mobileNumber1")}
                                placeholder="Primary mobile number (10 digits)"
                                maxLength={10}
                            />
                        </FormRow>

                        <FormRow label="Mobile Number 2">
                            <InputMd
                                value={employee.mobileNumber2}
                                onChange={set("mobileNumber2")}
                                placeholder="Alternate mobile number (10 digits)"
                                maxLength={10}
                            />
                        </FormRow>

                        <FormRow label="Aadhar Number" required>
                            <InputMd
                                value={employee.aadharNumber}
                                onChange={set("aadharNumber")}
                                placeholder="12-digit Aadhaar number"
                                maxLength={12}
                            />
                        </FormRow>
                    </Box>

                    <Box sx={{ width: '48%' }}>
                        <FormRow label="Qualification" required>
                            <SelectLg
                                value={employee.qualification}
                                onChange={set("qualification")}
                                options={qualificationOption}
                            />
                        </FormRow>

                        <FormRow label="Date of Join" required>
                            <InputDate
                                value={employee.dateOfJoin}
                                onChange={set("dateOfJoin")}
                            />
                        </FormRow>

                        <FormRow label="Experience">
                            <InputMd
                                value={employee.experience}
                                onChange={set("experience")}
                                placeholder="e.g. 2 Years 3 Months"
                            />
                        </FormRow>

                        <FormRow label="Company" required>
                            <SelectLg
                                value={employee.company}
                                onChange={set("company")}
                                options={companyOption}
                            />
                        </FormRow>

                        <FormRow label="Role" required>
                            <SelectLg
                                value={employee.role}
                                onChange={set("role")}
                                options={roleOptions}
                            />
                        </FormRow>

                        <FormRow label="Status" required>
                            <SelectLg
                                value={employee.userStatus}
                                onChange={set("userStatus")}
                                options={statusOption}
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={employee.isActive}
                                onChange={set("isActive")}
                            />
                        </FormRow>
                    </Box>
                </Box>

                <div style={{
                    borderTop: "1px solid #e5e7eb",
                    margin: "20px 0",
                }} />

                <ButtonWrapper>
                    <Button onClick={handleSave} disabled={loading}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleView}>View</Button>
                    <Button onClick={handlePreview}>Preview</Button>
                    <Button onClick={handleClose}>Close</Button>
                </ButtonWrapper>

            </Panel>
        </Wrapper>
    );
};

export default UserCreation;