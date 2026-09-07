import React, { useState, useMemo } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Divider,
    Input,
    Grid,
    Card,
    Chip,
    IconButton,
} from "@mui/joy";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import { axioslogin } from "../Connection/axios";
import { useThemeMode } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { errorNotify, getAuthUser, successNotify, warningNotify } from "../constant/Constant";

const getFirstDayOfMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-01`;
};

const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const AllEmployeePerformanceReport = () => {
    const navigate = useNavigate();
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const { user: authContextUser } = useAuth();
    const authUser = getAuthUser();
    const userRole = (authContextUser?.role || authUser?.role || "").trim().toLowerCase();
    const isEmployeeOnly = userRole === "employee" && authContextUser?.is_admin !== 1 && authUser?.is_admin !== 1;

    const [startDate, setStartDate] = useState(getFirstDayOfMonth());
    const [endDate, setEndDate] = useState(getTodayDate());
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [searched, setSearched] = useState(false);

    // Pagination
    const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(10);



    const filteredEmployees = reportData?.filter((employee) =>
    Number(employee.total_calls) > 0 ||
    Number(employee.callback_count) > 0 ||
    Number(employee.quote_count) > 0 ||
    Number(employee.appointment_count) > 0 ||
    Number(employee.captured_count) > 0 ||
    Number(employee.lost_count) > 0
);



    const handleBack = () => {
        navigate("/home/reports");
    };

    const handleSearch = async () => {
        if (!startDate || !endDate) {
            warningNotify("Please select both Start Date and End Date");
            return;
        }

        try {
            setLoading(true);
            setSearched(true);

            let url = `/reports/all-employee-performance?fromDate=${startDate}&toDate=${endDate}`;
            if (isEmployeeOnly) {
                const empCode = authUser?.emp_name || authContextUser?.username || authUser?.id || authContextUser?.id;
                if (empCode) {
                    url += `&employeeId=${encodeURIComponent(empCode)}`;
                }
            }

            const response = await axioslogin.get(url);

            if (response.data?.success === 1) {
                setReportData(response.data.data || []);
                setPage(0);
                const count = response.data.data?.length || 0;
                successNotify(isEmployeeOnly ? `Retrieved ${count} performance records.` : `Retrieved ${count} performance records for all employees.`);
            } else {
                warningNotify(response.data?.message || "Failed to fetch all employee performance data");
                setReportData([]);
            }
        } catch (error) {
            console.error("Fetch all employee report error:", error);
            errorNotify("An error occurred while fetching all employee performance report");
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        if (filteredEmployees.length === 0) {
            warningNotify("No data available to export. Please run a search first.");
            return;
        }

        try {
            setExportLoading(true);

            let url = `/reports/all-employee-performance/export?fromDate=${startDate}&toDate=${endDate}`;
            if (isEmployeeOnly) {
                const empCode = authUser?.emp_name || authContextUser?.username || authUser?.id || authContextUser?.id;
                if (empCode) {
                    url += `&employeeId=${encodeURIComponent(empCode)}`;
                }
            }

            const response = await axioslogin.get(url, { responseType: "blob" });

            // Trigger file download
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", `all_employee_performance_report_${startDate}_to_${endDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
            successNotify("All employee performance report downloaded successfully!");
        } catch (error) {
            console.error("Export Excel error:", error);
            errorNotify("Failed to download all employee performance report");
        } finally {
            setExportLoading(false);
        }
    };

    const handleReset = () => {
        setStartDate(getFirstDayOfMonth());
        setEndDate(getTodayDate());
        setReportData([]);
        setSearched(false);

    };


    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
    };

    // Theme values mapping
    const textPrimaryColor = isDark ? "#f8fafc" : "#0f172a";
    const textSecondaryColor = isDark ? "#94a3b8" : "#475569";
    const borderCol = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(226, 232, 240, 0.8)";
    const tableHeaderBg = isDark ? "#1e293b" : "#f8fafc";
    const tableHeaderTextColor = isDark ? "#cbd5e1" : "#334155";
    const tableRowOddBg = isDark ? "#0f172a" : "#f8fafc";
    const tableRowEvenBg = isDark ? "#1e293b" : "#ffffff";
    const inputBg = isDark ? "#0f172a" : "#ffffff";
    const inputTextColor = isDark ? "#f8fafc" : "#0f172a";

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                minHeight: "95vh",
                transition: "background 0.3s ease",
                background: isDark
                    ? `
                      radial-gradient(circle at 10% 20%, rgba(30, 41, 59, 0.6) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(15, 23, 42, 0.7) 0%, transparent 40%),
                      linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)
                    `
                    : `
                      radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(249, 115, 22, 0.12) 0%, transparent 40%),
                      linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #fef3c7 100%)
                    `,
            }}
        >
            <Card
                variant="outlined"
                sx={{
                    borderRadius: "24px",
                    boxShadow: isDark ? "0 20px 40px rgba(0, 0, 0, 0.6)" : "0 20px 40px rgba(15, 23, 42, 0.05)",
                    border: `1px solid ${borderCol}`,
                    background: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(20px)",
                    p: { xs: 2, md: 3 },
                    transition: "background 0.3s ease, border 0.3s ease",
                }}
            >
                {/* Header Section */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 2,
                        mb: 3.5,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton
                            variant="outlined"
                            color="neutral"
                            onClick={handleBack}
                            sx={{
                                borderRadius: "50%",
                                width: 40,
                                height: 40,
                                border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #cbd5e1",
                                bgcolor: isDark ? "#1e293b" : "#fff",
                                "&:hover": { bgcolor: isDark ? "#334155" : "#f1f5f9" },
                            }}
                        >
                            <ArrowBackIcon sx={{ color: isDark ? "#cbd5e1" : "#475569" }} />
                        </IconButton>
                        <Box>
                            <Typography
                                level="h3"
                                sx={{
                                    fontWeight: 900,
                                    color: textPrimaryColor,
                                    letterSpacing: "-0.5px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                }}
                            >
                                <BadgeOutlinedIcon sx={{ color: "#2563eb", fontSize: "2rem" }} />
                                All Employee Performance Report
                            </Typography>
                            <Typography level="body-sm" sx={{ color: textSecondaryColor, mt: 0.5, fontWeight: 500 }}>
                                {isEmployeeOnly
                                    ? "Select a date range to analyze your performance."
                                    : "Select a date range to analyze performance across all employees."}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3, opacity: isDark ? 0.1 : 1 }} />

                {/* Filter and Action Controls */}
                <Grid container spacing={2.5} sx={{ mb: 4 }} alignItems="flex-end">
                    <Grid xs={12} sm={6} md={3.5}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography level="body-xs" sx={{ fontWeight: 700, color: textSecondaryColor }}>
                                Start Date *
                            </Typography>
                            <TextField
                                type="date"
                                fullWidth
                                size="small"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: inputBg,
                                        height: "40px",
                                        "& fieldset": {
                                            borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "#cbd5e1",
                                        },
                                    },
                                    "& input": {
                                        color: inputTextColor,
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={6} md={3.5}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography level="body-xs" sx={{ fontWeight: 700, color: textSecondaryColor }}>
                                End Date *
                            </Typography>
                            <TextField
                                type="date"
                                fullWidth
                                size="small"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: inputBg,
                                        height: "40px",
                                        "& fieldset": {
                                            borderColor: isDark ? "rgba(255, 255, 255, 0.2)" : "#cbd5e1",
                                        },
                                    },
                                    "& input": {
                                        color: inputTextColor,
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={12} md={5}>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1.5,
                                flexWrap: "wrap",
                                justifyContent: { xs: "stretch", md: "flex-end" },
                            }}
                        >
                            <Button
                                startDecorator={<RefreshIcon />}
                                variant="outlined"
                                color="neutral"
                                onClick={handleReset}
                                sx={{
                                    borderRadius: "12px",
                                    fontWeight: 600,
                                    color: textPrimaryColor,
                                    border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid #cbd5e1"
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                startDecorator={loading ? <CircularProgress size="sm" /> : <SearchIcon />}
                                variant="solid"
                                color="primary"
                                onClick={handleSearch}
                                disabled={loading}
                                sx={{
                                    borderRadius: "12px",
                                    fontWeight: 700,
                                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                    },
                                }}
                            >
                                Search Report
                            </Button>
                            {filteredEmployees?.length > 0 && (
                                <Button
                                    startDecorator={exportLoading ? <CircularProgress size="sm" color="success" /> : <FileDownloadIcon />}
                                    variant="solid"
                                    color="success"
                                    onClick={handleExportExcel}
                                    disabled={exportLoading}
                                    sx={{
                                        borderRadius: "12px",
                                        fontWeight: 700,
                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                        },
                                    }}
                                >
                                    Export Excel
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {/* Table Data View */}
                {searched && (
                    <Box>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 8, flexDirection: "column", alignItems: "center", gap: 2 }}>
                                <CircularProgress size="lg" />
                                <Typography level="body-sm" sx={{ color: textSecondaryColor }}>
                                    Compiling performance records for all employees...
                                </Typography>
                            </Box>
                        ) : reportData.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 8, border: isDark ? "2px dashed rgba(255,255,255,0.15)" : "2px dashed #cbd5e1", borderRadius: "16px" }}>
                                <Typography level="h4" sx={{ fontWeight: 800, color: textPrimaryColor }}>
                                    No Records Found
                                </Typography>
                                <Typography level="body-sm" sx={{ color: textSecondaryColor, mt: 1 }}>
                                    No lead activities found for any employee matching the selected dates ({startDate} to {endDate}).
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                {/* Metric / Stat Summary Table (per Employee Breakdown) */}
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        mb: 3,
                                        borderRadius: "16px",
                                        boxShadow: "none",
                                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
                                        bgcolor: isDark ? "#0f172a" : "#fff",
                                        overflow: "auto",
                                        maxHeight: 500,
                                    }}
                                >
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, py: 1.5 }}>Employee</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, py: 1.5 }}>Total Call Count</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, py: 1.5 }}>Capture Count</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, py: 1.5 }}>Appointment Count</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, py: 1.5 }}>Quote Count</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, py: 1.5 }}>Callback Count</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, py: 1.5 }}>Lost Count</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredEmployees.map((emp, idx) => (
                                                <TableRow key={emp.user_id || idx} hover sx={{ bgcolor: idx % 2 === 0 ? tableRowEvenBg : tableRowOddBg }}>
                                                    <TableCell sx={{ fontWeight: 600, color: textPrimaryColor, py: 1.2 }}>{emp.employee_name}</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700, color: "#2563eb", py: 1.2 }}>{emp.total_calls}</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700, color: "#10b981", py: 1.2 }}>{emp.captured_count}</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700, color: "#8b5cf6", py: 1.2 }}>{emp.appointment_count}</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700, color: "#f59e0b", py: 1.2 }}>{emp.quote_count}</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700, color: "#06b6d4", py: 1.2 }}>{emp.callback_count}</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 700, color: "#06b6d4", py: 1.2 }}>{emp.lost_count}</TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Initial View State (before search) */}
                {!searched && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 10,
                            textAlign: "center",
                            border: isDark ? "2px dashed rgba(255,255,255,0.15)" : "2px dashed #cbd5e1",
                            borderRadius: "16px",
                            backgroundColor: isDark ? "rgba(30, 41, 59, 0.2)" : "rgba(248, 250, 252, 0.4)",
                        }}
                    >
                        <SearchIcon sx={{ color: isDark ? "#475569" : "#94a3b8", fontSize: "3rem", mb: 2 }} />
                        <Typography level="h4" sx={{ fontWeight: 800, color: textPrimaryColor }}>
                            Run Performance Query
                        </Typography>
                        <Typography level="body-sm" sx={{ color: textSecondaryColor, mt: 1, maxWidth: 400 }}>
                            {isEmployeeOnly
                                ? "Select Start Date and End Date, then search to retrieve your performance records."
                                : "Select Start Date and End Date, then search to retrieve performance records for all employees."}
                        </Typography>
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default AllEmployeePerformanceReport;
