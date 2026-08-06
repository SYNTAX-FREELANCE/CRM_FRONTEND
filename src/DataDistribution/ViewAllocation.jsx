import React, { lazy, memo, Suspense, useCallback, useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/joy";
import { Paper, Button, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
    useAllEmployeeDetails,
    useEmployeeAssignDetails,
    useEmployeeMaster,
} from "../CommonCode/useQuery";
import { AllocationColumns } from "./Components/AllocationColumns";
import EmployeeAssignedDrawer from "./Components/EmployeeAssignedDrawer";
import EmployeeSelect from "../CommonComponents/EmployeeSelect";

import { errorNotify, getAuthUser, successNotify, warningNofity } from "../constant/Constant";
import { axioslogin } from "../Connection/axios";
import GlobalLoader from "../CommonComponents/GlobalLoader";
import EmployeeMultiSelect from "../CommonComponents/EmployeeMultiSelect";

const AllocationPreviewModal = lazy(() => import("./Components/AllocationPreviewModal"));

const ViewAllocation = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [isReallocateMode, setIsReallocateMode] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowfullselect, setRowFullSelect] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedAssignedLead, setSelectedAssignedLead] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [allocatedempid, setAllocateEmployeeId] = useState('');
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const authUser = getAuthUser();
    const { id } = authUser ?? {};

    const { data: Employee_master = [] } = useAllEmployeeDetails();




    const { data: AssignDetails = [], isLoading: LoadingTableData, refetch: FechtAllocationDetail } =
        useEmployeeAssignDetails(allocatedempid);




    const isMobile = useMediaQuery("(max-width:600px)");
    const employees = Array.isArray(Employee_master) ? Employee_master : [];

    const selectedRowDetails = useMemo(() => {
        return AssignDetails.filter((row) => selectedRows.includes(row.lead_id));
    }, [AssignDetails, selectedRows]);

    const selectedEmployeeName = useMemo(() => {
        const emp = employees?.find(
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
        setSelectedRows([]);
        setRowFullSelect([]);
        setSelectedEmployee("");
        setIsReallocateMode(false);
    }, []);

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
        };

        try {
            const respose = await axioslogin.post('/lead/update-reallocation', payload);
            const { success, message } = respose?.data ?? {};
            if (success !== 1) return errorNotify("Api Error While Updating Leads");
            successNotify(message || "Reallocated SuccessFully");
            setPreviewOpen(false);
            FechtAllocationDetail();
            resetDetail();
        } catch (error) {
            errorNotify("Error in Handling Allocation");
            console.error("Error in Handling Allocation");
        }
    }, [
        selectedEmployee,
        selectedRows,
        rowfullselect,
        id,
        FechtAllocationDetail,
        resetDetail
    ]);

    const handleSelectAll = useCallback(
        (checked) => {
            if (checked) {
                if (!selectedEmployee?.trim() && !availableEmployees?.length) {
                    return warningNofity("Select Employee First");
                }

                const invalidRows = AssignDetails.filter(
                    (row) => String(row.user_id) === String(selectedEmployee)
                );

                if (invalidRows.length > 0) {
                    return warningNofity(
                        "New employee and previous employee cannot be same."
                    );
                }

                setSelectedRows(AssignDetails?.map((row) => row.lead_id));
                setRowFullSelect(AssignDetails);
            } else {
                setSelectedRows([]);
                setRowFullSelect([]);
            }
        },
        [AssignDetails, selectedEmployee, availableEmployees]
    );

    const columns = AllocationColumns(
        openLead,
        isMobile,
        isReallocateMode,
        selectedRows,
        handleSelect,
        AssignDetails,
        handleSelectAll,
        isDark
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

    const FinalMultipleReallocatedEmployee = employees ?
        employees?.filter(item => Number(item.user_id) != Number(allocatedempid)) : [];


    const handleMultiAllocate = useCallback(async (work_status, is_locked, remarks) => {

        if (!availableEmployees || availableEmployees?.length === 0) {
            return warningNofity("Select At Least One Employee");
        }

        if (!rowfullselect || rowfullselect.length === 0) {
            return warningNofity("Please Select At Least One Lead");
        }

        const payload = {
            selectedEmployees: availableEmployees,
            remarks,
            is_locked,
            work_status,
            assigned_by: id,
            leads: rowfullselect,
        };

        try {
            setLoading(true)
            const response = await axioslogin.post(
                "/lead/multi-reallocation",
                payload
            );

            const { success, data, message } = response?.data ?? {};

            if (success !== 1) {
                return errorNotify(message || "API Error While Updating Leads");
            }

            successNotify(
                data?.message || message || "Leads Allocated Successfully"
            );

            setPreviewOpen(false);
            FechtAllocationDetail();
            resetDetail();
        } catch (error) {
            console.error(error);
            errorNotify("Error While Allocating Leads");
        } finally {
            setLoading(false)
        }
    }, [
        availableEmployees,
        rowfullselect,
        id,
        FechtAllocationDetail,
        resetDetail,
    ]);

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
                background: isDark
                    ? `
          radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.18) 0%, transparent 45%),
          radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.15) 0%, transparent 45%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
        `
                    : `
          radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
          radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
          linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
        `,
            }}
        >
            {loading && <GlobalLoader />}
            <Box
                sx={{
                    px: { xs: 2, md: 3 },
                    py: 2.5,
                    borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(226, 232, 240, 0.6)",
                    background: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.35)",
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
                            color={isDark ? "#f8fafc" : "#0f172a"}
                            sx={{
                                letterSpacing: "-0.5px",
                                fontSize: { xs: 18, md: 32 },
                            }}
                        >
                            Allocation Details
                        </Typography>
                        <Typography
                            variant="body2"
                            color={isDark ? "#94a3b8" : "#475569"}
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
                        <Box sx={{
                            display: 'flex',
                            flexDirection: "column",
                            gap: 1
                        }}>
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

                            {
                                !isReallocateMode &&
                                <Box sx={{ width: { xs: 150, sm: 220 }, flexShrink: 0 }}>
                                    <EmployeeSelect
                                        value={allocatedempid}
                                        onChange={setAllocateEmployeeId}
                                        employees={Employee_master}
                                    />
                                </Box>
                            }
                        </Box>
                    </Stack>
                </Stack>
            </Box>

            <Box sx={{
                p: { xs: 1.5, md: 2.5 },
                display: 'flex',
                gap: 1,
                flexDirection: { xs: 'column', md: 'row' }
            }}>
                <Paper
                    elevation={0}
                    sx={{
                        width: isReallocateMode ? {xs:'100%',md:"70%"} : '100%',
                        height: { xs: "calc(100vh - 170px)", md: "calc(100vh - 180px)" },
                        borderRadius: 4,
                        overflow: "hidden",
                        border: isDark ? "1px solid rgba(255,255,255,.1)" : "1px solid rgba(255,255,255,.55)",
                        background: isDark ? "rgba(15,23,42,.85)" : "rgba(255,255,255,.25)",
                        backdropFilter: "blur(16px)",
                        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,.4)" : "0 10px 30px rgba(15,23,42,.05)",
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
                            color: isDark ? "#f8fafc" : undefined,
                            "& .MuiDataGrid-columnHeaders": {
                                background: isDark ? "linear-gradient(180deg,#1e293b,#0f172a)" : "linear-gradient(180deg,#f8fafc,#eef2ff)",
                                borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: 700,
                                color: isDark ? "#cbd5e1" : "#334155",
                                fontSize: 12,
                                textTransform: "uppercase",
                                letterSpacing: ".6px",
                            },
                            "& .MuiDataGrid-cell": {
                                borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #f1f5f9",
                                display: "flex",
                                alignItems: "center",
                                outline: "none",
                                color: isDark ? "#f8fafc" : undefined,
                            },
                            "& .MuiDataGrid-row": {
                                transition: ".2s",
                                "&:nth-of-type(even)": {
                                    backgroundColor: isDark ? "rgba(255,255,255,.02)" : "rgba(248,250,252,.35)",
                                },
                                "&:hover": {
                                    backgroundColor: isDark ? "rgba(37,99,235,.18)" : "rgba(37,99,235,.06)",
                                },
                                "&.Mui-selected": {
                                    backgroundColor: isDark ? "rgba(37,99,235,.25)" : "rgba(37,99,235,.08)",
                                },
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
                                background: isDark ? "#1e293b" : "#f8fafc",
                                color: isDark ? "#f8fafc" : undefined,
                                "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiIconButton-root": {
                                    color: isDark ? "#f8fafc" : undefined,
                                },
                            },
                            "& .MuiDataGrid-columnSeparator": {
                                display: "none",
                            },
                            "& .MuiCheckbox-root": {
                                color: isDark ? "#60a5fa" : "#2563eb",
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
                {
                    isReallocateMode &&

                    <Paper
                        elevation={0}
                        sx={{
                            width: isReallocateMode ? {xs:'100%',md:'30%'} : '0%',
                            height: { xs: "calc(100vh - 170px)", md: "calc(100vh - 180px)" },
                            borderRadius: 4,
                            overflow: "hidden",
                            border: isDark ? "1px solid rgba(255,255,255,.1)" : "1px solid rgba(255,255,255,.55)",
                            background: isDark ? "rgba(15,23,42,.85)" : "rgba(255,255,255,.25)",
                            backdropFilter: "blur(16px)",
                            boxShadow: isDark ? "0 10px 30px rgba(0,0,0,.4)" : "0 10px 30px rgba(15,23,42,.05)",
                        }}
                    > <EmployeeMultiSelect
                            employees={FinalMultipleReallocatedEmployee}
                            value={availableEmployees}
                            onChange={setAvailableEmployees}
                            onMulitpleAllocate={handleMultiAllocate}
                        /></Paper>
                }
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
