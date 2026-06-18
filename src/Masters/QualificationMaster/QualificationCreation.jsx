import { Box } from "@mui/joy";
import { useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

import { QUALIFICATION_OPTIONS } from '../../CommonCode/Reusable';

const QualificationCreation = () => {
    const [qualification, setQualification] = useState({
        qualificationName: "",
        alias: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);

    const set = (field) => (e) =>
        setQualification((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!qualification.qualificationName.trim()) {
            showToast("Qualification Name is required.");
            return;
        }

        setSavedData(qualification);
        console.log("Saved Qualification Data:", qualification);
        showToast("Qualification saved successfully.");
    };

    const handleCancel = () => {
        setQualification({
            qualificationName: "",
            alias: "",
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
        console.log("Viewing Qualification Data:", savedData);
        showToast("Viewing saved data");
    };

    const handlePreview = () => {
        if (!qualification.qualificationName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", qualification);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="Qualification Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Box sx={{ width: '70%' }}>
                        <FormRow label="Qualification Name" required>
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

                <div style={{
                    borderTop: "1px solid #e5e7eb",
                    margin: "20px 0",
                }} />

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    paddingTop: "8px",
                }}>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleView}>View</Button>
                    <Button onClick={handlePreview}>Preview</Button>
                    <Button onClick={handleClose}>Close</Button>
                </div>

            </Panel>
        </Wrapper>
    );
};

export default QualificationCreation;