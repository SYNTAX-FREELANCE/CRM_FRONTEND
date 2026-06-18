import { Box } from "@mui/joy";
import { useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import InputMd from "../../Settings/CommonMasterComponent/InputMd";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";

const CompanyCreation = () => {
    const [company, setCompany] = useState({
        companyName: "",
        location: "",
        email: "",
        address: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);

    const set = (field) => (e) =>
        setCompany((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!company.companyName.trim()) {
            showToast("Company Name is required.");
            return;
        }

        if (!company.email.trim()) {
            showToast("Email is required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
            showToast("Please enter a valid email address.");
            return;
        }

        setSavedData(company);
        console.log("Saved Company Data:", company);
        showToast("Company saved successfully.");
    };

    const handleCancel = () => {
        setCompany({
            companyName: "",
            location: "",
            email: "",
            address: "",
            isActive: "Active",
        });
        setSavedData(null);
        showToast("Form cleared");
    };

    const handleView = () => {
        if (!savedData) {
            showToast("No data to view. Please save first.");
            return;
        }
        console.log("Viewing Company Data:", savedData);
        showToast("Viewing saved data");
    };

    const handlePreview = () => {
        if (!company.companyName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", company);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="Company Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Box sx={{ width: '70%' }}>
                        <FormRow label="Company Name" required>
                            <InputLg
                                value={company.companyName}
                                onChange={set("companyName")}
                                placeholder="Enter company name"
                            />
                        </FormRow>

                        <FormRow label="Location">
                            <InputMd
                                value={company.location}
                                onChange={set("location")}
                                placeholder="City/Location"
                            />
                        </FormRow>

                        <FormRow label="Email" required>
                            <InputMd
                                value={company.email}
                                onChange={set("email")}
                                placeholder="company@email.com"
                            />
                        </FormRow>

                        <FormRow label="Address">
                            <InputMd
                                value={company.address}
                                onChange={set("address")}
                                placeholder="Full address"
                            />
                        </FormRow>
                        <FormRow label="Active Status">
                            <Checkbox
                                value={company.isActive}
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

                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleView}>View</Button>
                    <Button onClick={handlePreview}>Preview</Button>
                    <Button onClick={handleClose}>Close</Button>
                </ButtonWrapper>

            </Panel>
        </Wrapper>
    );
};

export default CompanyCreation;