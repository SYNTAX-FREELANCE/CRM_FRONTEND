import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CommonDataGrid from "./CommonDataGrid";
import { useCompanyMaster, useEmployeeMaster, useQualificationMaster, useRoleMaster, useStatusMaster } from "../../CommonCode/useQuery";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CloseIcon from '@mui/icons-material/Close';

const CommonViewPage = () => {

    const location = useLocation();
    const navigate = useNavigate()

    const {
        title = "Master Data",
        columns = [],
        type,
        idField,
        editRoute,
        navigateback
    } = location.state || {};

    const handleEdit = (row) => {
        navigate(`/home/setting/${editRoute}`, {
            state: {
                mode: "edit",
                id: row[idField]
            }
        });
    };
    const { data: RoleMasterDetil } = useRoleMaster();
    const { data: CompnayMasterDetail } = useCompanyMaster();
    const { data: StuatuMaster } = useStatusMaster();
    const { data: QualificationMaster } = useQualificationMaster();
     const { data: Employee_master } = useEmployeeMaster();


    const dataMap = {
        role: RoleMasterDetil,
        company: CompnayMasterDetail,
        status: StuatuMaster,
        qualification: QualificationMaster,
        employee:Employee_master
    };


    const data = dataMap[type] || [];

    const handleGoBack = () => {
        if (navigateback) {
            navigate(navigateback)
        } else navigate(-1)
    }

    return (
        <div
            style={{
                padding: "20px",
                background: "#f5f7fb",
                height: "70vh",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1px solid #e5e7eb",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                        paddingBottom: "15px",
                        borderBottom: "1px solid #eef2f7",
                    }}
                >
                    <div >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            // justifyContent:'center',
                            gap: 4
                        }}>

                            <AccountTreeIcon />
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "24px",
                                    fontWeight: 700,
                                    color: "#1a3b70",
                                }}
                            >

                                {title}
                            </h2>

                        </div>
                        <p
                            style={{
                                margin: "6px 0 0",
                                color: "#64748b",
                                fontSize: "14px",
                                fontWeight: '600'
                            }}
                        >
                            View and manage all available records
                        </p>
                    </div>
                    <div style={{
                        cursor: 'pointer'
                    }} onClick={handleGoBack}>
                        <CloseIcon />
                    </div>
                </div>

                <CommonDataGrid
                    columns={columns}
                    rows={data}
                    onEdit={handleEdit}
                />
            </div>
        </div>

    );
};

export default CommonViewPage;