import { Box } from "@mui/joy";
import { useState } from "react";

// Import each component from its own file
import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import SectionHeader from "../../Settings/CommonMasterComponent/SectionHeader";
import InputSm from "../../Settings/CommonMasterComponent/InputSm";
import InputMd from "../../Settings/CommonMasterComponent/InputMd";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import InputDate from "../../Settings/CommonMasterComponent/InputDate";
import Select from "../../Settings/CommonMasterComponent/Select";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";

// Import options from your reusable constants
import {
    QUALIFICATION_OPTIONS,
    COMPANY_OPTIONS,
    ROLE_OPTIONS,
    STATUS_OPTIONS
} from '../../CommonCode/Reusable';
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

export default function UserCreation() {
    const [employee, setEmployee] = useState({
        employeeId: "",
        name: "",
        age: "",
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

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);

    const set = (field) => (e) =>
        setEmployee((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!employee.name.trim()) {
            showToast("Name is required.");
            return;
        }
        if (!employee.mobileNumber1.trim()) {
            showToast("Mobile Number is required.");
            return;
        }

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(employee.mobileNumber1)) {
            showToast("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (employee.aadharNumber && !/^\d{12}$/.test(employee.aadharNumber)) {
            showToast("Please enter a valid 12-digit Aadhar number.");
            return;
        }

        setSavedData(employee);
        console.log("Saved Employee Data:", employee);
        showToast("User saved successfully.");
    };

    const handleCancel = () => {
        setEmployee({
            employeeId: "", name: "", age: "", qualification: "",
            dateOfJoin: "", experience: "", mobileNumber1: "",
            mobileNumber2: "", aadharNumber: "", company: "",
            role: "", userStatus: "",
        });
        setSavedData(null);
        showToast("Form cleared");
    };

    const handleView = () => {
        if (!savedData) {
            showToast("No data to view. Please save first.");
            return;
        }
        console.log("Viewing Employee Data:", savedData);
        showToast("Viewing saved data");
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

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="User Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                {/* <SectionHeader title="PERSONAL DETAILS" /> */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                    <Box sx={{ width: '48%' }}>
                        <FormRow label="Employee ID">
                            <InputSm value={employee.employeeId} onChange={set("employeeId")} placeholder="Emp ID" />
                        </FormRow>

                        <FormRow label="Name" required>
                            <InputLg value={employee.name} onChange={set("name")} placeholder="Enter full name" />
                        </FormRow>

                        <FormRow label="Age">
                            <InputSm value={employee.age} onChange={set("age")} placeholder="Age" min="18" max="80" />
                        </FormRow>

                        <FormRow label="Mobile Number" required>
                            <InputMd value={employee.mobileNumber1} onChange={set("mobileNumber1")} placeholder="Primary mobile number" maxLength={15} />
                        </FormRow>

                        <FormRow label="Mobile Number 2">
                            <InputMd value={employee.mobileNumber2} onChange={set("mobileNumber2")} placeholder="Alternate mobile number" maxLength={15} />
                        </FormRow>

                        <FormRow label="Aadhar Number">
                            <InputMd value={employee.aadharNumber} onChange={set("aadharNumber")} placeholder="12-digit Aadhar number" maxLength={14} />
                        </FormRow>
                    </Box>

                    <Box sx={{ width: '48%' }}>
                        <FormRow label="Qualification">
                            <Select value={employee.qualification} onChange={set("qualification")} options={QUALIFICATION_OPTIONS} />
                        </FormRow>

                        <FormRow label="Date of Join">
                            <InputDate value={employee.dateOfJoin} onChange={set("dateOfJoin")} />
                        </FormRow>

                        <FormRow label="Experience">
                            <InputMd value={employee.experience} onChange={set("experience")} placeholder="e.g. 2 Years 3 Months" />
                        </FormRow>

                        <FormRow label="Company">
                            <SelectLg value={employee.company} onChange={set("company")} options={COMPANY_OPTIONS} />
                        </FormRow>

                        <FormRow label="Role">
                            <Select value={employee.role} onChange={set("role")} options={ROLE_OPTIONS} />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={employee.userStatus}
                                onChange={set("userStatus")}
                            />
                        </FormRow>
                    </Box>
                </Box>

                <div style={{
                    borderTop: "1px solid #e5e7eb",
                    margin: "20px 0",
                }} />
                <ButtonWrapper>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleView}>View</Button>
                    <Button onClick={handlePreview}>Preview</Button>
                    <Button onClick={handleClose}>Close</Button>
                </ButtonWrapper>

            </Panel>
        </Wrapper>
    );
}