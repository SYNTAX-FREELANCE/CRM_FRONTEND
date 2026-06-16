import { Box } from "@mui/joy";
import { useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

const ModuleCreation = () => {
    const [module, setModule] = useState({
        moduleName: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);

    const set = (field) => (e) =>
        setModule((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!module.moduleName.trim()) {
            showToast("Module Name is required.");
            return;
        }

        setSavedData(module);
        console.log("Saved Module Data:", module);
        showToast("Module saved successfully.");
    };

    const handleCancel = () => {
        setModule({
            moduleName: "",
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
        console.log("Viewing Module Data:", savedData);
        showToast("Viewing saved data");
    };

    const handlePreview = () => {
        if (!module.moduleName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", module);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="Module Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Box sx={{ width: '60%' }}>
                        <FormRow label="Module Name" required>
                            <InputLg 
                                value={module.moduleName} 
                                onChange={set("moduleName")} 
                                placeholder="Enter module name" 
                            />
                        </FormRow>
                         <FormRow label="Active Status">
                            <Checkbox 
                                value={module.isActive} 
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

export default ModuleCreation;