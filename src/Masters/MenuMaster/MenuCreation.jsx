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
import { axioslogin } from "../../Axios/axios";
import { useMenuMaster } from "../../CommonCode/useQuery";

const MenuCreation = () => {
    const [menu, setMenu] = useState({
        menuName: "",
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
        setMenu((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const { refetch: FetchMenuMaster } = useMenuMaster();

    // Fetch active modules
    const getDropdownData = async () => {
        try {
            // Fetch modules
            const modResult = await axioslogin.get("/modulemast/get-active");
            if (modResult.data.success === 1 && Array.isArray(modResult.data.data)) {
                setModules(modResult.data.data.map(m => ({ id: m.module_id, label: m.module_name })));
            }
        } catch (error) {
            console.error("getDropdownData error:", error);
            warningNotify("Failed to fetch dropdown options");
        }
    };

    const getMenuById = async (menuId) => {
        try {
            const result = await axioslogin.get(`/menumaster/getbyid/${menuId}`);
            const { data, success, message } = result.data;
            if (success !== 1) return errorNotify(message);
            setMenu({
                menuName: data.menu_name || "",
                moduleId: data.module_id || "",
                isActive: data.is_active === 1 ? "Active" : "Inactive"
            });
        } catch (error) {
            console.error("getMenuById error:", error);
            warningNotify("Failed to load menu details");
        }
    };

    useEffect(() => {
        getDropdownData();
        if (mode === "edit" && id) {
            getMenuById(id);
        }
    }, [id, mode]);

    const handleModuleChange = (e) => {
        const val = e.target.value;
        setMenu(prev => ({
            ...prev,
            moduleId: val
        }));
    };

    const validateMenu = () => {
        if (!menu.menuName || menu.menuName.trim() === "") {
            warningNotify("Menu Name is required.");
            return false;
        }

        if (!menu.moduleId) {
            warningNotify("Please select a Module.");
            return false;
        }

        return true;
    };

    const handleReset = () => {
        setMenu({
            menuName: "",
            moduleId: "",
            isActive: "Active",
        });
    };

    const handleSave = async () => {
        if (!validateMenu()) {
            return;
        }

        setLoading(true);

        try {
            const menuData = {
                menu_name: menu.menuName.trim(),
                module_id: menu.moduleId,
                isActive: menu.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {
                response = await axioslogin.patch(
                    `/menumaster/update/${id}`,
                    menuData
                );
            } else {
                response = await axioslogin.post(
                    "/menumaster/create",
                    menuData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Menu updated successfully!"
                        : "Menu created successfully!"
                );
                FetchMenuMaster();
                handleReset();
                if (mode === "edit") {
                    navigate("/home/setting/commonview", {
                        state: {
                            title: "Menu Master",
                            type: 'menu',
                            idField: 'menu_id',
                            editRoute: "menumaster",
                            columns: [
                                { field: "module_name", headerName: "Module Name" },
                                { field: "menu_name", headerName: "Menu Name" },
                                { field: "is_active", headerName: "Status", type: "status" }
                            ]
                        }
                    });
                }
            } else {
                warningNotify(
                    message ||
                    (mode === "edit" ? "Failed to update menu" : "Failed to create menu")
                );
            }
        } catch (error) {
            warningNotify(
                error.response?.data?.message ||
                (mode === "edit" ? "Error updating menu" : "Error creating menu")
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
                title: "Menu Master",
                type: 'menu',
                idField: 'menu_id',
                editRoute: "menumaster",
                columns: [
                    {
                        field: "module_name",
                        headerName: "Module Name"
                    },
                    {
                        field: "menu_name",
                        headerName: "Menu Name"
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
        if (!menu.menuName) {
            showToast("Fill the form first to preview.");
            return;
        }
        console.log("Previewing Current Data:", menu);
        showToast("Previewing current form data");
    };

    const handleClose = () => {
        navigate(-1);
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
                                onChange={handleModuleChange}
                                options={modules}
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

export default MenuCreation;