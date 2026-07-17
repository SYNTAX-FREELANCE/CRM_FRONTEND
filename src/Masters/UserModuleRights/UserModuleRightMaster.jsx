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
import { errorNotify, getAuthUser, infoNotify, successNotify, warningNotify } from "../../constant/Constant";
import { axioslogin } from "../../Axios/axios";
import { useGetModuleRightDetail, useModuleMaster, useRoleMaster } from "../../CommonCode/useQuery";

const UserModuleRightMaster = () => {

    const authUser = getAuthUser();
    const { id } = authUser ?? {}

    const { data: RoleMasterDetil } = useRoleMaster();
    const { data: ModuleMasterDetail } = useModuleMaster();






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


    const [selectedRole, setSelectedRole] = useState("");
    const [moduleSelection, setModuleSelection] = useState({});


    const { data: RoleRights, refetch } = useGetModuleRightDetail(selectedRole)



    const [loading, setLoading] = useState(false);
    const [hasExisting, setHasExisting] = useState(false);
    const [toast, setToast] = useState("");

    const navigate = useNavigate();

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    };



    // Load menus and existing rights when selections change
    const handleCheckboxChange = async (moduleId, checked) => {
        if (!selectedRole) {
            return infoNotify("Please Select Role First");
        }
        // Update UI immediately
        setModuleSelection(prev => ({
            ...prev,
            [moduleId]: checked
        }));

        try {
            const payload = {
                role_id: Number(selectedRole),
                module_id: moduleId,
                status: checked ? 1 : 0,
                created_user: id
            };
            const Responses = await axioslogin.post("/moduleright/save", payload);

            const { success, message } = Responses?.data ?? {};

            if (success === 1) {
                successNotify(message || "Successfully Created Rights");
                refetch()
            } else {
                warningNotify(message || "Unable to update");
                // rollback checkbox
                setModuleSelection(prev => ({
                    ...prev,
                    [moduleId]: !checked
                }));
            }
        } catch (error) {
            errorNotify("Error updating module");
            // rollback checkbox
            setModuleSelection(prev => ({
                ...prev,
                [moduleId]: !checked
            }));
        }
    };


    useEffect(() => {
        if (!Array.isArray(RoleRights)) {
            setModuleSelection({});
            return;
        }
        const selected = {};
        RoleRights?.forEach(({ module_id, active_status }) => {
            selected[module_id] = active_status === 1;
        });

        setModuleSelection(selected);

    }, [RoleRights]);


    const handleClose = () => {
        navigate(-1);
    };

    return (
        <Wrapper>
            <Toast message={toast} onClose={() => setToast("")} />

            <Panel title="Module Right Master" onHelp={() => showToast("Help: Select Role , configure checkboxes")}>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
                    <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                        <FormRow label="Role" required>
                            <SelectLg
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                options={ActiveRoles}
                            />
                        </FormRow>
                    </Box>

                    {selectedRole.length > 0 && (
                        <Box sx={{ width: { xs: '100%', md: '70%' }, mt: 2 }}>
                            <Typography level="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
                                Configure Module
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
                                    {ActiveModules?.map((item, index) => (
                                        <tr key={item.id} style={{
                                            borderBottom: '1px solid #e5e7eb',
                                            backgroundColor: index % 2 === 0 ? '#fbfcff' : '#ffffff',
                                        }}>
                                            <td style={{ padding: '12px 16px', color: '#4b5563' }}>{index + 1}</td>
                                            <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 500 }}>{item?.label}</td>
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!moduleSelection[item.id]}
                                                    onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
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

                            <ButtonWrapper>
                                <Button
                                    onClick={handleClose}>
                                    Close
                                </Button>
                            </ButtonWrapper>
                        </Box>
                    )}
                </Box>

            </Panel>
        </Wrapper>
    );
};

export default UserModuleRightMaster;
