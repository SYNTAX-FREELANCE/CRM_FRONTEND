import { Box } from "@mui/joy";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import { errorNotify, successNotify, warningNotify } from "../../constant/Constant";
import { axioslogin } from "../../Axios/axios";
import { useModuleMaster } from "../../CommonCode/useQuery";

const ModuleCreation = () => {
    const [module, setModule] = useState({
        moduleName: "",
        isActive: "Active",
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { id, mode } = location.state || {};

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);

    const set = (field) => (e) =>
        setModule((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const { refetch: FetchModuleMaster } = useModuleMaster();

    const getModuleById = async (id) => {
        try {
            const result = await axioslogin.get(`/modulemast/getbyid/${id}`);
            const { data, success, message } = result?.data;
            if (success !== 1) return errorNotify(message);
            setModule({
                moduleName: data.module_name || "",
                isActive: data.is_active === 1 ? "Active" : "Inactive"
            });
        } catch (error) {
            console.error(error);
            warningNotify("Failed to load module details");
        }
    };

    useEffect(() => {
        if (mode === "edit" && id) {
            getModuleById(id);
        }
    }, [id, mode]);

    const validateModule = () => {
        if (!module.moduleName || module.moduleName.trim() === "") {
            warningNotify("Module Name is required.");
            return false;
        }

        if (module.moduleName.trim().length < 3) {
            warningNotify("Module Name must be at least 3 characters.");
            return false;
        }

        if (module.moduleName.trim().length > 100) {
            warningNotify("Module Name must not exceed 100 characters.");
            return false;
        }

        return true;
    };

    const handleReset = () => {
        setModule({
            moduleName: "",
            isActive: "Active",
        });
    };

    const handleSave = async () => {
        if (!validateModule()) {
            return;
        }

        setLoading(true);

        try {
            const moduleData = {
                module_name: module.moduleName.trim(),
                isActive: module.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(
                    `/modulemast/update/${id}`,
                    moduleData
                );
            } else {
                response = await axioslogin.post(
                    "/modulemast/create",
                    moduleData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Module updated successfully!"
                        : "Module created successfully!"
                );
                FetchModuleMaster();
                handleReset();
                if (mode === "edit") {
                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Module Master",
                            type: 'module',
                            idField: 'module_id',
                            editRoute: "modulemaster",
                            columns: [
                                {
                                    field: "module_name",
                                    headerName: "Module Name"
                                },
                                {
                                    field: "is_active",
                                    headerName: "Status",
                                    type: "status"
                                }
                            ]
                        }
                    });
                }
            } else {
                warningNotify(
                    message ||
                    (mode === "edit"
                        ? "Failed to update module"
                        : "Failed to create module")
                );
            }

        } catch (error) {
            warningNotify(
                error.response?.data?.message ||
                (mode === "edit"
                    ? "Error updating module"
                    : "Error creating module")
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        handleReset();
        showToast("Form cleared");
    };

    const handleView = () => {
        navigate("/home/setting/commonview", {
            state: {
                title: "Module Master",
                type: 'module',
                idField: 'module_id',
                editRoute: "modulemaster",
                columns: [
                    {
                        field: "module_name",
                        headerName: "Module Name"
                    },
                    {
                        field: "is_active",
                        headerName: "Status",
                        type: "status"
                    }
                ]
            }
        });
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
        navigate(-1);
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
                    <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
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