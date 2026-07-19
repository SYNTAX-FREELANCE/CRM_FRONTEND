import { Box } from "@mui/joy";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import { errorNotify, successNotify, warningNotify } from "../../constant/Constant";
import { axioslogin } from "../../Connection/axios";
import { useSubmoduleMaster } from "../../CommonCode/useQuery";

const Submodulecreation = () => {
    const [submodule, setSubmodule] = useState({
        submoduleName: "",
        moduleId: "",
        isActive: "Active",
    });

    const [toast, setToast] = useState("");
    const [loading, setLoading] = useState(false);
    const [modules, setModules] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { id, mode } = location.state || {};

    const set = (field) => (e) =>
        setSubmodule((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const { refetch: FetchSubmoduleMaster } = useSubmoduleMaster();

    // Fetch active modules for dropdown selection
    const getActiveModules = async () => {
        try {
            const result = await axioslogin.get("/modulemast/get-active");
            const { data, success } = result.data;
            if (success === 1 && Array.isArray(data)) {
                const options = data.map((mod) => ({
                    id: mod.module_id,
                    label: mod.module_name
                }));
                setModules(options);
            }
        } catch (error) {
            console.error("getActiveModules error:", error);
            // warningNotify("Failed to fetch modules list");
        }
    };

    const getSubmoduleById = async (subId) => {
        try {
            const result = await axioslogin.get(`/submodulemast/getbyid/${subId}`);
            const { data, success, message } = result.data;
            if (success !== 1) return errorNotify(message);
            setSubmodule({
                submoduleName: data.submodule_name || "",
                moduleId: data.module_id || "",
                isActive: data.is_active === 1 ? "Active" : "Inactive"
            });
        } catch (error) {
            console.error("getSubmoduleById error:", error);
            warningNotify("Failed to load submodule details");
        }
    };


    useEffect(() => {
        getActiveModules();
        if (mode === "edit" && id) {
            getSubmoduleById(id);
        }
    }, [id, mode]);

    const validateSubmodule = () => {
        if (!submodule.submoduleName || submodule.submoduleName.trim() === "") {
            warningNotify("Submodule Name is required.");
            return false;
        }

        if (!submodule.moduleId) {
            warningNotify("Please select a Module.");
            return false;
        }

        return true;
    };

    const handleReset = () => {
        setSubmodule({
            submoduleName: "",
            moduleId: "",
            isActive: "Active",
        });
    };

    const handleSave = async () => {
        if (!validateSubmodule()) {
            return;
        }

        setLoading(true);

        try {
            const submoduleData = {
                submodule_name: submodule.submoduleName.trim(),
                module_id: submodule.moduleId,
                isActive: submodule.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(
                    `/submodulemast/update/${id}`,
                    submoduleData
                );
            } else {
                response = await axioslogin.post(
                    "/submodulemast/create",
                    submoduleData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Submodule updated successfully!"
                        : "Submodule created successfully!"
                );
                FetchSubmoduleMaster();
                handleReset();
                if (mode === "edit") {
                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Submodule Master",
                            type: 'submodule',
                            idField: 'submodule_id',
                            editRoute: "submodulemaster",
                            columns: [
                                { field: "module_name", headerName: "Module Name" },
                                { field: "submodule_name", headerName: "Submodule Name" },
                                { field: "is_active", headerName: "Status", type: "status" }
                            ]
                        }
                    });
                }
            } else {
                warningNotify(
                    message ||
                    (mode === "edit" ? "Failed to update submodule" : "Failed to create submodule")
                );
            }
        } catch (error) {
            warningNotify(
                error.response?.data?.message ||
                (mode === "edit" ? "Error updating submodule" : "Error creating submodule")
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
                title: "Submodule Master",
                type: 'submodule',
                idField: 'submodule_id',
                editRoute: "submodulemaster",
                columns: [
                    {
                        field: "module_name",
                        headerName: "Module Name"
                    },
                    {
                        field: "submodule_name",
                        headerName: "Submodule Name"
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
        if (!submodule.submoduleName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", submodule);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        navigate(-1);
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
                    <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
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