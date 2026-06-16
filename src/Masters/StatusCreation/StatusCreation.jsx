import { Box } from "@mui/joy";
import { useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";

const StatusCreation = () => {
    const [status, setStatus] = useState({
        statusName: "",
        alias: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);

    const set = (field) => (e) =>
        setStatus((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!status.statusName.trim()) {
            showToast("Status Name is required.");
            return;
        }

        setSavedData(status);
        console.log("Saved Status Data:", status);
        showToast("Status saved successfully.");
    };

    const handleCancel = () => {
        setStatus({
            statusName: "",
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
        console.log("Viewing Status Data:", savedData);
        showToast("Viewing saved data");
    };

    const handlePreview = () => {
        if (!status.statusName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", status);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="Status Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Box sx={{ width: '70%' }}>
                        <FormRow label="Status Name" required>
                            <InputLg
                                value={status.statusName}
                                onChange={set("statusName")}
                                placeholder="Enter status name"
                            />
                        </FormRow>

                        <FormRow label="Alias">
                            <InputLg
                                value={status.alias}
                                onChange={set("alias")}
                                placeholder="Alias (optional)"
                            />
                        </FormRow>
                        <FormRow label="Active Status">
                            <Checkbox
                                value={status.isActive}
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

export default StatusCreation;