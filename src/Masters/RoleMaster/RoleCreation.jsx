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

const RoleCreation = () => {
    const [role, setRole] = useState({
        roleName: "",
        alias: "",
        description: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);

    const set = (field) => (e) =>
        setRole((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!role.roleName.trim()) {
            showToast("Role Name is required.");
            return;
        }

        setSavedData(role);
        console.log("Saved Role Data:", role);
        showToast("Role saved successfully.");
    };

    const handleCancel = () => {
        setRole({
            roleName: "",
            alias: "",
            description: "",
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
        console.log("Viewing Role Data:", savedData);
        showToast("Viewing saved data");
    };

    const handlePreview = () => {
        if (!role.roleName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", role);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="Role Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Box sx={{ width: '70%' }}>
                        <FormRow label="Role Name" required>
                            <InputLg
                                value={role.roleName}
                                onChange={set("roleName")}
                                placeholder="Enter role name"
                            />
                        </FormRow>

                        <FormRow label="Alias">
                            <InputLg
                                value={role.alias}
                                onChange={set("alias")}
                                placeholder="Alias (optional)"
                            />
                        </FormRow>

                        <FormRow label="Description">
                            <InputMd
                                value={role.description}
                                onChange={set("description")}
                                placeholder="Role description (optional)"
                            />
                        </FormRow>
                        <FormRow label="Active Status">
                            <Checkbox
                                value={role.isActive}
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

export default RoleCreation;