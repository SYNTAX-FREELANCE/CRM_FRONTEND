import { Box } from "@mui/joy";
import { useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";

const UserModuleRightCreation = () => {
    const [userModuleRight, setUserModuleRight] = useState({
        userId: "",
        moduleId: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);

    const [users, setUsers] = useState([
        "-- Select --",
        "USER001",
        "USER002",
        "USER003",
    ]);

    const [modules, setModules] = useState([
        "-- Select --",
        "MODULE001",
        "MODULE002",
        "MODULE003",
    ]);

    const set = (field) => (e) =>
        setUserModuleRight((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!userModuleRight.userId || userModuleRight.userId === "-- Select --") {
            showToast("Please select a User.");
            return;
        }

        if (!userModuleRight.moduleId || userModuleRight.moduleId === "-- Select --") {
            showToast("Please select a Module.");
            return;
        }

        setSavedData(userModuleRight);
        console.log("Saved User Module Right Data:", userModuleRight);
        showToast("User Module Right saved successfully.");
    };

    const handleCancel = () => {
        setUserModuleRight({
            userId: "",
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
        console.log("Viewing User Module Right Data:", savedData);
        showToast("Viewing saved data");
    };

    const handlePreview = () => {
        if (!userModuleRight.userId) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", userModuleRight);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="User Module Right Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Box sx={{ width: '70%' }}>
                        <FormRow label="User" required>
                            <SelectLg
                                value={userModuleRight.userId}
                                onChange={set("userId")}
                                options={users}
                            />
                        </FormRow>

                        <FormRow label="Module" required>
                            <SelectLg
                                value={userModuleRight.moduleId}
                                onChange={set("moduleId")}
                                options={modules}
                            />
                        </FormRow>

                        <FormRow label="Active Status">
                            <Checkbox
                                value={userModuleRight.isActive}
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

export default UserModuleRightCreation;