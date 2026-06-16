import { Box } from "@mui/joy";
import { useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";

const Submodulecreation = () => {
    const [submodule, setSubmodule] = useState({
        submoduleName: "",
        moduleId: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);

    const [modules, setModules] = useState([
        "-- Select --",
        "MODULE001",
        "MODULE002",
        "MODULE003",
    ]);

    const set = (field) => (e) =>
        setSubmodule((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!submodule.submoduleName.trim()) {
            showToast("Submodule Name is required.");
            return;
        }

        if (!submodule.moduleId || submodule.moduleId === "-- Select --") {
            showToast("Please select a Module.");
            return;
        }

        setSavedData(submodule);
        console.log("Saved Submodule Data:", submodule);
        showToast("Submodule saved successfully.");
    };

    const handleCancel = () => {
        setSubmodule({
            submoduleName: "",
            moduleId: "",
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
        console.log("Viewing Submodule Data:", savedData);
        showToast("Viewing saved data");
    };

    const handlePreview = () => {
        if (!submodule.submoduleName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", submodule);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="Submodule Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Box sx={{ width: '60%' }}>
                        <FormRow label="Module" required>
                            <SelectLg
                                value={submodule.moduleId}
                                onChange={set("moduleId")}
                                options={modules}
                            />
                        </FormRow>

                        <FormRow label="Submodule Name" required>
                            <InputLg
                                value={submodule.submoduleName}
                                onChange={set("submoduleName")}
                                placeholder="Enter submodule name"
                            />
                        </FormRow>
                        <FormRow label="Active Status">
                            <Checkbox
                                value={submodule.isActive}
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

export default Submodulecreation;