import { Box } from "@mui/joy";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/joy/Typography";
import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import { successNotify, warningNotify } from "../../constant/Constant";
import { axioslogin } from "../../Connection/axios";
import {
    useGetExistingUserRights,
    useGetUserRightMenus,
    useModuleMaster,
    useRoleMaster
} from "../../CommonCode/useQuery";

const UserRightCreation = () => {


    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [userEdits, setUserEdits] = useState({});
    const [loading, setLoading] = useState(false);
    const { data: RoleMasterDetil = [] } = useRoleMaster();
    const { data: ModuleMasterDetail = [] } = useModuleMaster();

    // React Query hooks for fetching menus and existing rights
    const { data: menus = [] } = useGetUserRightMenus(selectedModule);
    const { data: existingRights = [], refetch: refetchExistingRights } = useGetExistingUserRights(selectedRole, selectedModule);

    const ActiveRoles = Array.isArray(RoleMasterDetil) ? RoleMasterDetil
        ?.filter(item => item.is_active === 1)
        ?.map(item => ({
            id: item.role_id,
            label: item.role_name?.toUpperCase()
        })) : [];

    const ActiveModules = Array.isArray(ModuleMasterDetail) ? ModuleMasterDetail
        ?.filter(item => item.is_active === 1)
        ?.map(item => ({
            id: item.module_id,
            label: item.module_name?.toUpperCase()
        })) : [];


    const hasExisting = Array.isArray(existingRights) && existingRights.length > 0;


    // Helper to determine if a menu checkbox is checked (local override vs backend existing right)
    const isMenuChecked = (menuId) => {
        if (userEdits[menuId] !== undefined) {
            return userEdits[menuId];
        }
        return Array.isArray(existingRights) && existingRights.some(r => r.menu_slno === menuId && r.Active_status === 1);
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
        setUserEdits({});
    };

    const handleModuleChange = (e) => {
        setSelectedModule(e.target.value);
        setUserEdits({});
    };

    const handleCheckboxChange = (menuId, checked) => {
        setUserEdits(prev => ({
            ...prev,
            [menuId]: checked
        }));
    };

    const handleSave = async () => {
        if (!selectedRole) {
            warningNotify("Please select a Role.");
            return;
        }
        if (!selectedModule) {
            warningNotify("Please select a Module.");
            return;
        }
        if (!Array.isArray(menus) || menus.length === 0) {
            warningNotify("No menus found for this module.");
            return;
        }

        setLoading(true);

        const rights = menus
            .filter(m => isMenuChecked(m.menu_id))
            .map(m => ({
                menu_slno: m.menu_id,
                Active_status: 1
            }));

        try {


            const payload = {
                role_slno: Number(selectedRole),
                module_slno: Number(selectedModule),
                rights
            };

            const response = await axioslogin.post("/userrights/save", payload);
            if (response.data.success === 1) {
                successNotify(hasExisting ? "Rights updated successfully!" : "Rights added successfully!");
                setUserEdits({});
                refetchExistingRights();
            } else {
                warningNotify(response.data.message || "Failed to save rights");
            }
        } catch (error) {
            console.error("handleSave error:", error);
            warningNotify("Error saving rights");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedRole("");
        setSelectedModule("");
        setUserEdits({});
    };

    const handleClose = useCallback(() => {
        navigate('/home/settings');
    }, [navigate]);

    return (
        <Wrapper>
            <Panel title="User Right Creation">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
                    <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                        <FormRow label="Role" required>
                            <SelectLg
                                value={selectedRole}
                                onChange={handleRoleChange}
                                options={ActiveRoles}
                            />
                        </FormRow>

                        <FormRow label="Module" required>
                            <SelectLg
                                value={selectedModule}
                                onChange={handleModuleChange}
                                options={ActiveModules}
                            />
                        </FormRow>
                    </Box>

                    {Array.isArray(menus) && menus.length > 0 && (
                        <Box sx={{ width: { xs: '100%', md: '70%' }, mt: 2 }}>
                            <Typography level="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                                Configure Menus
                            </Typography>

                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid #e5e7eb'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#374151', color: '#ffffff', textAlign: 'left' }}>
                                        <th style={{ padding: '12px 16px', fontWeight: 600, width: '80px' }}>Sl No</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 600 }}>Menu Name</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 600, width: '100px', textAlign: 'center' }}>Select</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menus.map((item, index) => (
                                        <tr key={item.menu_id} style={{
                                            borderBottom: '1px solid #e5e7eb',
                                            backgroundColor: index % 2 === 0 ? '#fbfcff' : '#ffffff',
                                        }}>
                                            <td style={{ padding: '12px 16px', color: '#4b5563' }}>{index + 1}</td>
                                            <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 500 }}>{item.menu_name}</td>
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isMenuChecked(item.menu_id)}
                                                    onChange={(e) => handleCheckboxChange(item.menu_id, e.target.checked)}
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        cursor: 'pointer',
                                                        accentColor: '#374151'
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    )}
                </Box>

                <div style={{
                    borderTop: "1px solid #e5e7eb",
                    margin: "20px 0",
                }} />

                <ButtonWrapper>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : (hasExisting ? "Update Rights" : "Save Rights")}
                    </Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleClose}>Close</Button>
                </ButtonWrapper>
            </Panel>
        </Wrapper>
    );
};

export default UserRightCreation;
