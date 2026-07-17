import React, { lazy, memo, Suspense, useCallback, useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/joy";
import { Paper, Button, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
    useEmployeeAssignDetails,
    useEmployeeMaster,
} from "../CommonCode/useQuery";
import { AllocationColumns } from "./Components/AllocationColumns";
import EmployeeAssignedDrawer from "./Components/EmployeeAssignedDrawer";
import EmployeeSelect from "../CommonComponents/EmployeeSelect";

import { errorNotify, getAuthUser, successNotify, warningNofity } from "../constant/Constant";
import { axioslogin } from "../Connection/axios";
import GlobalLoader from "../CommonComponents/GlobalLoader";



const AllocationPreviewModal = lazy(() => import("./Components/AllocationPreviewModal"));

const ViewAllocation = () => {
    const [isReallocateMode, setIsReallocateMode] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowfullselect, setRowFullSelect] = useState([])
    const [open, setOpen] = useState(false);
    const [selectedAssignedLead, setSelectedAssignedLead] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);

    const authUser = getAuthUser();
    const { id } = authUser ?? {}



    const { data: Employee_master = [] } = useEmployeeMaster();
    const { data: AssignDetails = [], isLoading: LoadingTableData, refetch: FechtAllocationDetail } =
        useEmployeeAssignDetails();

    const isMobile = useMediaQuery("(max-width:600px)");

    const employees = Array.isArray(Employee_master)
        ? Employee_master.filter((emp) => emp.is_active === 1)
        : [];

    const selectedRowDetails = useMemo(() => {
        return AssignDetails.filter((row) => selectedRows.includes(row.lead_id));
    }, [AssignDetails, selectedRows]);

    const selectedEmployeeName = useMemo(() => {
        const emp = employees.find(
            (item) => String(item.user_id) === String(selectedEmployee)
        );
        return emp?.name || emp?.employee_name || "";
    }, [employees, selectedEmployee]);


    const handleSelect = useCallback((row, checked) => {

        if (!selectedEmployee || selectedEmployee?.trim() === "") return warningNofity("Select Employee First");

        if (String(row.user_id) === String(selectedEmployee)) {
            warningNofity("New employee and previous employee cannot be same.");
            return;
        }

        if (checked) {
            setSelectedRows((prev) => [...prev, row.lead_id]);
            setRowFullSelect((prev) => [...prev, row]);

        } else {
            setSelectedRows((prev) => prev.filter((id) => id !== row.lead_id));
            setRowFullSelect((prev) => prev.filter((val) => val.lead_id !== row.lead_id));
        }
    }, [selectedEmployee]);

    const openLead = (row) => {
        setSelectedAssignedLead(row);
        setOpen(true);
    };

    const resetDetail = useCallback(() => {
        setSelectedRows([])
        setRowFullSelect([])
        setSelectedEmployee("")
        setIsReallocateMode(false)
    }, [])

    const handleClose = () => {
        setOpen(false);
        setSelectedAssignedLead(null);
    };

    const handlePreviewOpen = () => {
        setPreviewOpen(true);
    };

    const handleAllocate = useCallback(async (work_status, is_locked, remarks) => {
        if (!remarks || remarks?.trim() === "") return warningNofity("Please Enter Remarks Details");
        if (!selectedEmployee || selectedEmployee?.trim() === "") return warningNofity("Select Employee First");
        const payload = {
            selectedLead: selectedRows,
            selectedEmployee: Number(selectedEmployee),
            remarks: remarks,
            is_locked: is_locked,
            work_status: work_status,
            assigned_by: id,
            leads: rowfullselect
        }
        try {
            const respose = await axioslogin.post('/lead/update-reallocation', payload);
            const { success, message } = respose?.data ?? {};
            if (success !== 1) return errorNotify("Api Error While Updating Leads");
            successNotify(message || "Reallocated SuccessFully");
            setPreviewOpen(false);
            FechtAllocationDetail()
            resetDetail()
        } catch (error) {
            errorNotify("Error in Handling Allocation")
            console.error("Error in Handling Allocation")
        }
    }, [
        selectedEmployee,
        selectedRows,
        rowfullselect,
        id,
        FechtAllocationDetail,
        resetDetail
    ]);


    const columns = AllocationColumns(
        openLead,
        isMobile,
        isReallocateMode,
        selectedRows,
        handleSelect
    );

    const isInvalidSelection = selectedRows?.some((leadId) => {
        const row = AssignDetails.find((item) => item.lead_id === leadId);
        return row && String(row.user_id) === String(selectedEmployee);
    });

    const handleEmployeeChange = (value) => {
        const selectedRowsData = AssignDetails.filter((row) =>
            selectedRows.includes(row.lead_id)
        );

        const conflict = selectedRowsData.some(
            (row) => String(row.user_id) === String(value)
        );

        if (conflict) {
            warningNofity("New employee and previous employee cannot be same.");
            return;
        }

        setSelectedEmployee(value);
    };

    return (
        <Box
            sx={{
                minHeight: "95vh",
                width: "100%",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                background: `
          radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
          radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
          linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
        `,
            }}
        >
            <Box
                sx={{
                    px: { xs: 2, md: 3 },
                    py: 2.5,
                    borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
                    background: "rgba(255, 255, 255, 0.35)",
                    flex: "0 0 auto",
                }}
            >
                <Stack
                    direction={{ xs: isReallocateMode ? "column" : "row", sm: isReallocateMode ? "column" : "row", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    gap={2}
                >
                    <Box>
                        <Typography
                            fontWeight={900}
                            color="#0f172a"
                            sx={{
                                letterSpacing: "-0.5px",
                                fontSize: { xs: 18, md: 32 },
                            }}
                        >
                            Allocation Details
                        </Typography>
                        <Typography
                            variant="body2"
                            color="#475569"
                            sx={{ mt: 0.5, fontWeight: 500, fontSize: { xs: 12, sm: 16 } }}
                        >
                            Process allocation and reallocation.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        {isReallocateMode && (
                            <Box sx={{ width: { xs: 150, sm: 220 }, flexShrink: 0 }}>
                                <EmployeeSelect
                                    value={selectedEmployee}
                                    onChange={handleEmployeeChange}
                                    employees={Employee_master}
                                />
                            </Box>
                        )}

                        {isReallocateMode && (
                            <Button
                                size="small"
                                variant="contained"
                                color="success"
                                disabled={selectedRows.length === 0 || !selectedEmployee || isInvalidSelection}
                                onClick={handlePreviewOpen}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 700,
                                    fontSize: { xs: 10, sm: 16 },
                                    width: "auto",
                                    flexShrink: 0,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Reallocate ({selectedRows.length})
                            </Button>
                        )}

                        <Button
                            size="small"
                            variant={isReallocateMode ? "outlined" : "contained"}
                            onClick={() => {
                                setIsReallocateMode((prev) => !prev);
                                setSelectedRows([]);
                                setSelectedEmployee("");
                            }}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: { xs: 10, sm: 16 },
                                width: "auto",
                                flexShrink: 0,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {isReallocateMode ? "Cancel" : "Reallocate"}
                        </Button>
                    </Stack>
                </Stack>
            </Box>

            <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        height: { xs: "calc(100vh - 170px)", md: "calc(100vh - 180px)" },
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,.55)",
                        background: "rgba(255,255,255,.25)",
                        backdropFilter: "blur(16px)",
                        boxShadow: "0 10px 30px rgba(15,23,42,.05)",
                    }}
                >
                    <DataGrid
                        rows={AssignDetails}
                        columns={columns}
                        getRowId={(row) => row.lead_id}
                        loading={LoadingTableData}
                        disableRowSelectionOnClick
                        pageSizeOptions={[5, 10, 25, 50]}
                        rowHeight={isMobile ? 60 : 46}
                        columnHeaderHeight={46}
                        onRowClick={(params) => {
                            if (!isReallocateMode) {
                                openLead(params.row);
                            }
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                    page: 0,
                                },
                            },
                        }}
                        slotProps={{
                            loadingOverlay: {
                                variant: "skeleton",
                                noRowsVariant: "skeleton",
                            },
                        }}
                        sx={{
                            height: "100%",
                            width: "100%",
                            border: "none",
                            backgroundColor: "transparent",
                            fontSize: 13,
                            "& .MuiDataGrid-columnHeaders": {
                                background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
                                borderBottom: "1px solid #e2e8f0",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: 700,
                                color: "#334155",
                                fontSize: 12,
                                textTransform: "uppercase",
                                letterSpacing: ".6px",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: "1px solid #f1f5f9",
                                display: "flex",
                                alignItems: "center",
                                outline: "none",
                            },
                            "& .MuiDataGrid-row": {
                                transition: ".2s",
                                "&:nth-of-type(even)": {
                                    backgroundColor: "rgba(248,250,252,.35)",
                                },
                                "&:hover": {
                                    backgroundColor: "rgba(37,99,235,.06)",
                                },
                                "&.Mui-selected": {
                                    backgroundColor: "rgba(37,99,235,.08)",
                                },
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "1px solid #e2e8f0",
                                background: "#f8fafc",
                            },
                            "& .MuiDataGrid-columnSeparator": {
                                display: "none",
                            },
                            "& .MuiCheckbox-root": {
                                color: "#2563eb",
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                overflowY: "auto",
                            },
                            "& .MuiDataGrid-overlay": {
                                background: "transparent",
                            },
                        }}
                    />
                </Paper>
            </Box>

            <EmployeeAssignedDrawer
                open={open}
                onClose={handleClose}
                assigned={selectedAssignedLead}
            />

            <Suspense fallback={<GlobalLoader />}>
                <AllocationPreviewModal
                    open={previewOpen}
                    onClose={() => setPreviewOpen(false)}
                    selectedRows={selectedRows}
                    selectedRowDetails={selectedRowDetails}
                    selectedEmployeeName={selectedEmployeeName}
                    onAllocate={handleAllocate}
                    onAllocateAndAssign={handleAllocate}
                />
            </Suspense>

        </Box>
    );
};

export default memo(ViewAllocation);