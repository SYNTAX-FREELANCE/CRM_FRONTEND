import { Box } from "@mui/joy";
import { useEffect, useState } from "react";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import InputMd from "../../Settings/CommonMasterComponent/InputMd";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import { errorNotify, successNotify, warningNotify } from "../../constant/Constant";
import { axioslogin } from "../../Connection/axios";
import { useRoleMaster } from "../../CommonCode/useQuery";
import { useLocation, useNavigate } from "react-router-dom";

const RoleCreation = () => {
    const [role, setRole] = useState({
        roleName: "",
        alias: "",
        description: "",
        isActive: "Active",
    });

    const navigate = useNavigate();
    const location = useLocation();

    const { id, mode } = location.state || {};

    const [toast, setToast] = useState("");
    const [savedData, setSavedData] = useState(null);
    const [loading, setLoading] = useState(false);

    const set = (field) => (e) =>
        setRole((prev) => ({ ...prev, [field]: e.target.value }));

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    const { refetch: FetchRoleMaster } = useRoleMaster()

    const getRoleById = async (id) => {
        try {
            const result = await axioslogin.get(`/rolemast/getbyid/${id}`);
            const { data, success, message } = result?.data;
            if (success !== 1) return errorNotify(message)
            setRole({
                roleName: data.role_name || "",
                alias: data.alias || "",
                description: data.description || "",
                isActive: data.is_active === 1 ? "Active" : "Inactive"
            });

        } catch (error) {
            console.log(error);
            warningNotify("Failed to load role details");
        }
    };


    useEffect(() => {
        if (mode === "edit" && id) {
            getRoleById(id);
        }
    }, [id, mode]);
    // ==================== VALIDATION ====================
    const validateRole = () => {
        if (!role.roleName || role.roleName.trim() === "") {
            warningNotify("Role Name is required.");
            return false;
        }

        if (role.roleName.trim().length < 3) {
            warningNotify("Role Name must be at least 3 characters.");
            return false;
        }

        if (role.roleName.trim().length > 100) {
            warningNotify("Role Name must not exceed 100 characters.");
            return false;
        }

        if (role.alias && role.alias.trim().length > 50) {
            warningNotify("Alias must not exceed 50 characters.");
            return false;
        }

        if (role.description && role.description.trim().length > 255) {
            warningNotify("Description must not exceed 255 characters.");
            return false;
        }

        return true;
    };



    const handleReset = () => {
        setRole({
            roleName: "",
            alias: "",
            description: "",
            isActive: "Active",
        });
    }


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


    const handleSave = async () => {
        if (!validateRole()) {
            return;
        }

        setLoading(true);

        try {
            const roleData = {
                role_name: role.roleName.trim(),
                role_description: role.description.trim() || null,
                alias: role.alias.trim() || null,
                isActive: role.isActive === "Active" ? 1 : 0
            };

            let response;

            if (mode === "edit") {

                response = await axioslogin.patch(
                    `/rolemast/update/${id}`,
                    roleData
                );

            } else {

                response = await axioslogin.post(
                    "/rolemast/create",
                    roleData
                );
            }

            const { success, message } = response.data;

            if (success === 1) {
                successNotify(
                    mode === "edit"
                        ? "Role updated successfully!"
                        : "Role created successfully!"
                );
                FetchRoleMaster();
                handleReset();
            } else {
                warningNotify(
                    message ||
                    (mode === "edit"
                        ? "Failed to update role"
                        : "Failed to create role")
                );
            }

        } catch (error) {            
            warningNotify(
                error.response?.data?.message ||
                (mode === "edit"
                    ? "Error updating role"
                    : "Error creating role")
            );
        } finally {
            setLoading(false);
        }
    };



    const handleView = () => {
        navigate("/home/setting/commonview", {
            state: {
                title: "Role Master",
                type: 'role',
                idField: 'role_id',
                editRoute: "/rolemaster",
                columns: [
                    {
                        field: "role_name",
                        headerName: "Role Name"
                    },
                    {
                        field: "alias",
                        headerName: "Alias"
                    },
                    {
                        field: "description",
                        headerName: "Description"
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