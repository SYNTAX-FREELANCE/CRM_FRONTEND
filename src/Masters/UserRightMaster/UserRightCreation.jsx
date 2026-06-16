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

const UserRightCreation = () => {
    const [userRight, setUserRight] = useState({
        userId: "",
        menuId: "",
        submoduleId: "",
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

    const [menus, setMenus] = useState([
        "-- Select --",
        "MENU001",
        "MENU002",
        "MENU003",
    ]);

    const [submodules, setSubmodules] = useState([
        "-- Select --",
        "SUB001",
        "SUB002",
        "SUB003",
    ]);

    const set = (field) => (e) =>
        setUserRight((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!userRight.userId || userRight.userId === "-- Select --") {
            showToast("Please select a User.");
            return;
        }

        if (!userRight.menuId && !userRight.submoduleId) {
            showToast("Please select Menu or Submodule.");
            return;
        }

        setSavedData(userRight);
        console.log("Saved User Right Data:", userRight);
        showToast("User Right saved successfully.");
    };

    const handleCancel = () => {
        setUserRight({
            userId: "",
            menuId: "",
            submoduleId: "",
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
        console.log("Viewing User Right Data:", savedData);
        showToast("Viewing saved data");
    };

    const handlePreview = () => {
        if (!userRight.userId) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", userRight);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="User Right Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Box sx={{ width: '70%' }}>
                        <FormRow label="User" required>
                            <SelectLg
                                value={userRight.userId}
                                onChange={set("userId")}
                                options={users}
                            />
                        </FormRow>

                        <FormRow label="Menu">
                            <SelectLg
                                value={userRight.menuId}
                                onChange={set("menuId")}
                                options={menus}
                            />
                        </FormRow>

                        <FormRow label="Submodule">
                            <SelectLg
                                value={userRight.submoduleId}
                                onChange={set("submoduleId")}
                                options={submodules}
                            />
                        </FormRow>
                        <FormRow label="Active Status">
                            <Checkbox
                                value={userRight.isActive}
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

export default UserRightCreation;