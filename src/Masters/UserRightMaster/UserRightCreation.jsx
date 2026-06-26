import { Box } from "@mui/joy";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Typography from "@mui/joy/Typography";

import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import SelectLg from "../../Settings/CommonMasterComponent/SelectLg";
import Button from "../../Settings/CommonMasterComponent/Button";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import { errorNotify, successNotify, warningNotify } from "../../constant/Constant";
import { axioslogin } from "../../Axios/axios";

const UserRightCreation = () => {
    const [roles, setRoles] = useState([]);
    const [modules, setModules] = useState([]);
    const [menus, setMenus] = useState([]);

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [menuSelections, setMenuSelections] = useState({});

    const [loading, setLoading] = useState(false);
    const [hasExisting, setHasExisting] = useState(false);
    const [toast, setToast] = useState("");

    const navigate = useNavigate();

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };

    // Load initial dropdowns
    const getDropdownData = async () => {
        try {
            // Fetch roles
            const roleResult = await axioslogin.get("/rolemast/getall");
            if (roleResult.data.success === 1 && Array.isArray(roleResult.data.data)) {
                setRoles(roleResult.data.data.map(r => ({ id: r.role_id, label: r.role_name })));
            }

            // Fetch active modules
            const modResult = await axioslogin.get("/modulemast/get-active");
            if (modResult.data.success === 1 && Array.isArray(modResult.data.data)) {
                setModules(modResult.data.data.map(m => ({ id: m.module_id, label: m.module_name })));
            }
        } catch (error) {
            console.error("getDropdownData error:", error);
            warningNotify("Failed to fetch dropdown options");
        }
    };

    useEffect(() => {
        getDropdownData();
    }, []);

    // Load menus and existing rights when selections change
    const fetchRightsData = async (roleId, moduleId) => {
        setLoading(true);
        try {
            const menuRes = await axioslogin.get(`/userrights/menus/${moduleId}`);
            const rightsRes = await axioslogin.get(`/userrights/existing/${roleId}/${moduleId}`);

            if (menuRes.data.success === 1 && rightsRes.data.success === 1) {
                const fetchedMenus = menuRes.data.data || [];
                const existingRights = rightsRes.data.data || [];

                setMenus(fetchedMenus);

                const selections = {};
                fetchedMenus.forEach(m => {
                    const right = existingRights.find(r => r.menu_slno === m.menu_id);
                    selections[m.menu_id] = right ? (right.Active_status === 1) : false;
                });
                setMenuSelections(selections);
                setHasExisting(existingRights.length > 0);
            } else {
                warningNotify("Failed to retrieve menu rights details");
            }
        } catch (error) {
            console.error("fetchRightsData error:", error);
            warningNotify("Error fetching user rights");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedRole && selectedModule) {
            fetchRightsData(selectedRole, selectedModule);
        } else {
            setMenus([]);
            setMenuSelections({});
            setHasExisting(false);
        }
    }, [selectedRole, selectedModule]);

    const handleCheckboxChange = (menuId, checked) => {
        setMenuSelections(prev => ({
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
        if (menus.length === 0) {
            warningNotify("No menus found for this module.");
            return;
        }

        setLoading(true);

        try {
            const rights = menus
                .filter(m => menuSelections[m.menu_id] === true)
                .map(m => ({
                    menu_slno: m.menu_id,
                    Active_status: 1
                }));

            const payload = {
                role_slno: Number(selectedRole),
                module_slno: Number(selectedModule),
                rights
            };

            const response = await axioslogin.post("/userrights/save", payload);
            if (response.data.success === 1) {
                successNotify(hasExisting ? "Rights updated successfully!" : "Rights added successfully!");
                fetchRightsData(selectedRole, selectedModule);
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
        setMenus([]);
        setMenuSelections({});
        setHasExisting(false);
        showToast("Form cleared");
    };

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="User Right Creation" onHelp={() => showToast("Help: Select Role and Module, configure checkboxes, and Save")}>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
                    <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                        <FormRow label="Role" required>
                            <SelectLg
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                options={roles}
                            />
                        </FormRow>

                        <FormRow label="Module" required>
                            <SelectLg
                                value={selectedModule}
                                onChange={(e) => setSelectedModule(e.target.value)}
                                options={modules}
                            />
                        </FormRow>
                    </Box>

                    {menus.length > 0 && (
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
                                                    checked={!!menuSelections[item.menu_id]}
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
