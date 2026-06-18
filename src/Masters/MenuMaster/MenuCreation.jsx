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

const MenuCreation = () => {
    const [menu, setMenu] = useState({
        menuName: "",
        moduleId: "",
        submoduleId: "",
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

    const [submodules, setSubmodules] = useState([
        "-- Select --",
        "SUB001",
        "SUB002",
        "SUB003",
    ]);

    const set = (field) => (e) =>
        setMenu((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const handleSave = () => {
        if (!menu.menuName.trim()) {
            showToast("Menu Name is required.");
            return;
        }

        if (!menu.moduleId || menu.moduleId === "-- Select --") {
            showToast("Please select a Module.");
            return;
        }

        setSavedData(menu);
        console.log("Saved Menu Data:", menu);
        showToast("Menu saved successfully.");
    };

    const handleCancel = () => {
        setMenu({
            menuName: "",
            moduleId: "",
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
        console.log("Viewing Menu Data:", savedData);
        showToast("Viewing saved data");
    };

    const handlePreview = () => {
        if (!menu.menuName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", menu);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        showToast("Closing...");
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="Menu Creation" onHelp={() => showToast("Help: Fill all required fields marked with *")}>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    <Box sx={{ width: '60%' }}>
                        <FormRow label="Menu Name" required>
                            <InputLg
                                value={menu.menuName}
                                onChange={set("menuName")}
                                placeholder="Enter menu name"
                            />
                        </FormRow>

                        <FormRow label="Module" required>
                            <SelectLg
                                value={menu.moduleId}
                                onChange={set("moduleId")}
                                options={modules}
                            />
                        </FormRow>

                        <FormRow label="Submodule">
                            <SelectLg
                                value={menu.submoduleId}
                                onChange={set("submoduleId")}
                                options={submodules}
                            />
                        </FormRow>
                        <FormRow label="Active Status">
                            <Checkbox
                                value={menu.isActive}
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

export default MenuCreation;