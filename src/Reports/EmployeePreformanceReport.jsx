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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import { axioslogin } from "../Connection/axios";
import { useThemeMode } from "../Context/ThemeContext";
import { errorNotify, successNotify, warningNotify } from "../constant/Constant";

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

const EmployeePreformanceReport = () => {
    const navigate = useNavigate();
    const { mode } = useThemeMode();
    const isDark = mode === "dark";
    
    const [employeeId, setEmployeeId] = useState("");
    const [startDate, setStartDate] = useState(getFirstDayOfMonth());
    const [endDate, setEndDate] = useState(getTodayDate());
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searched, setSearched] = useState(false);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleBack = () => {
        navigate("/home/reports");
    };

    const handleSearch = async () => {
        if (!employeeId.trim()) {
            warningNotify("Please enter a valid Employee ID");
            return;
        }

        try {
            setLoading(true);
            setSearched(true);
            
            let url = `/reports/employee-performance?employeeId=${encodeURIComponent(employeeId)}`;
            if (startDate && endDate) {
                url += `&fromDate=${startDate}&toDate=${endDate}`;
            }

            const response = await axioslogin.get(url);
            
            if (response.data?.success === 1) {
                setReportData(response.data.data || []);
                setPage(0);
                successNotify(`Retrieved ${response.data.data?.length || 0} performance records.`);
            } else {
                warningNotify(response.data?.message || "Failed to fetch performance data");
                setReportData([]);
            }
        } catch (error) {
            console.error("Fetch report error:", error);
            errorNotify("An error occurred while fetching the employee performance report");
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        if (reportData.length === 0) {
            warningNotify("No data available to export. Please run a search first.");
            return;
        }

        try {
            setExportLoading(true);
            
            let url = `/reports/employee-performance/export?employeeId=${encodeURIComponent(employeeId)}`;
            if (startDate && endDate) {
                url += `&fromDate=${startDate}&toDate=${endDate}`;
            }

            const response = await axioslogin.get(url, { responseType: "blob" });

            // Trigger file download
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", `employee_${employeeId}_performance_report.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
            successNotify("Performance report downloaded successfully!");
        } catch (error) {
            console.error("Export Excel error:", error);
            errorNotify("Failed to download performance report");
        } finally {
            setExportLoading(false);
        }
    };

    const handleReset = () => {
        setEmployeeId("");
        setStartDate(getFirstDayOfMonth());
        setEndDate(getTodayDate());
        setReportData([]);
        setSearchQuery("");
        setSearched(false);
        setPage(0);
    };

    // Filter data in-memory based on search text box query
    const filteredData = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return reportData;

        return reportData.filter((row) => {
            return Object.values(row).some((val) =>
                val !== null && val !== undefined ? String(val).toLowerCase().includes(query) : false
            );
        });
    }, [reportData, searchQuery]);

    // Helpers to render clean badges
    const renderBooleanBadge = (val, trueText, falseText) => {
        const isActive = val === 1 || val === true;
        return (
            <Chip
                size="sm"
                variant="soft"
                color={isActive ? "success" : "neutral"}
                sx={{ fontWeight: 600, fontSize: "11px", borderRadius: "8px" }}
            >
                {isActive ? trueText : falseText}
            </Chip>
        );
    };

    const renderWorkStatusBadge = (status) => {
        const text = (status || "").toUpperCase();
        let color = "neutral";
        if (text === "COMPLETED") color = "success";
        else if (text === "PENDING") color = "warning";
        else if (text === "IN_PROGRESS" || text === "PROCESSING") color = "primary";

        return (
            <Chip
                size="sm"
                variant="solid"
                color={color}
                sx={{ fontWeight: 700, fontSize: "11px", borderRadius: "8px" }}
            >
                {text || "N/A"}
            </Chip>
        );
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
    const inputBorder = isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid #cbd5e1";

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
                                Employee Performance Report
                            </Typography>
                            <Typography level="body-sm" sx={{ color: textSecondaryColor, mt: 0.5, fontWeight: 500 }}>
                                Enter an Employee ID and select optional dates to analyze workflow performance.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3, opacity: isDark ? 0.1 : 1 }} />

                {/* Filter and Action Controls */}
                <Grid container spacing={2.5} sx={{ mb: 4 }} alignItems="flex-end">
                    <Grid xs={12} sm={4} md={3}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography level="body-xs" sx={{ fontWeight: 700, color: textSecondaryColor }}>
                                Employee ID *
                            </Typography>
                            <Input
                                placeholder="Enter Employee ID"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                sx={{
                                    borderRadius: "12px",
                                    height: "40px",
                                    backgroundColor: inputBg,
                                    color: inputTextColor,
                                    border: inputBorder,
                                    px: 2,
                                    "& input::placeholder": {
                                        color: isDark ? "#64748b" : "#94a3b8"
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={4} md={2.5}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography level="body-xs" sx={{ fontWeight: 700, color: textSecondaryColor }}>
                                Start Date (Optional)
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
                    <Grid xs={12} sm={4} md={2.5}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography level="body-xs" sx={{ fontWeight: 700, color: textSecondaryColor }}>
                                End Date (Optional)
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
                    <Grid xs={12} sm={12} md={4}>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1.5,
                                flexWrap: "wrap",
                                justifyContent: { xs: "stretch", sm: "flex-end" },
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
                            {reportData.length > 0 && (
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
                                    Compiling performance records...
                                </Typography>
                            </Box>
                        ) : filteredData.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 8, border: isDark ? "2px dashed rgba(255,255,255,0.15)" : "2px dashed #cbd5e1", borderRadius: "16px" }}>
                                <Typography level="h4" sx={{ fontWeight: 800, color: textPrimaryColor }}>
                                    No Records Found
                                </Typography>
                                <Typography level="body-sm" sx={{ color: textSecondaryColor, mt: 1 }}>
                                    No lead activities found for Employee ID: {employeeId} matching the selected dates.
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                {/* Filter and Record stats bar */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", sm: "row" },
                                        justifyContent: "space-between",
                                        alignItems: { xs: "stretch", sm: "center" },
                                        gap: 2,
                                        mb: 2,
                                    }}
                                >
                                    <Typography level="body-sm" sx={{ fontWeight: 600, color: textSecondaryColor }}>
                                        Showing {filteredData.length} records of {reportData.length} found.
                                    </Typography>
                                    <Input
                                        placeholder="Search records in view..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        startDecorator={<FilterAltIcon sx={{ color: textSecondaryColor }} />}
                                        endDecorator={
                                            searchQuery && (
                                                <Button
                                                    variant="plain"
                                                    color="neutral"
                                                    onClick={() => setSearchQuery("")}
                                                    sx={{ p: 0.5, minWidth: 0, borderRadius: "50%" }}
                                                >
                                                    <ClearIcon sx={{ fontSize: "14px", color: textSecondaryColor }} />
                                                </Button>
                                            )
                                        }
                                        sx={{
                                            width: { xs: "100%", sm: 280 },
                                            borderRadius: "12px",
                                            bgcolor: inputBg,
                                            color: inputTextColor,
                                            border: inputBorder,
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                                        }}
                                    />
                                </Box>

                                {/* Table layout */}
                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        maxHeight: 500,
                                        borderRadius: "16px",
                                        boxShadow: "none",
                                        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
                                        bgcolor: isDark ? "#0f172a" : "#fff",
                                        overflow: "auto",
                                        "&::-webkit-scrollbar": { width: "8px", height: "8px" },
                                        "&::-webkit-scrollbar-track": { background: isDark ? "#0f172a" : "#f1f5f9" },
                                        "&::-webkit-scrollbar-thumb": { background: isDark ? "#334155" : "#cbd5e1", borderRadius: "4px" },
                                        "&::-webkit-scrollbar-thumb:hover": { background: isDark ? "#475569" : "#94a3b8" },
                                    }}
                                >
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Lead ID</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Customer ID</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Vehicle ID</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Policy ID</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Status Name</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Assigned To</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Assigned Date</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Is Assigned</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Work Status</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Created At</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Remarks</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Is Locked</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Status Active</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Requires Follow-up</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Call Required</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Policy Required</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Follow-up Date Required</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Created By</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #e2e8f0" }}>Edited By</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredData
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    const isEven = index % 2 === 0;
                                                    const rowBg = isEven ? tableRowEvenBg : tableRowOddBg;
                                                    return (
                                                        <TableRow
                                                            key={row.lead_id || index}
                                                            hover
                                                            sx={{
                                                                bgcolor: rowBg,
                                                                "& td": { borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid #f1f5f9" },
                                                                "&:hover": {
                                                                    bgcolor: isDark ? "#334155 !important" : "#f1f5f9 !important"
                                                                }
                                                            }}
                                                        >
                                                            <TableCell sx={{ fontWeight: 600, color: textPrimaryColor }}>{row.lead_id}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{row.customer_id}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{row.vehicle_id}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{row.policy_id || "N/A"}</TableCell>
                                                            <TableCell sx={{ fontWeight: 550, color: "#2563eb" }}>{row.status_name || "N/A"}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{row.employee_name ? `${row.employee_name} (${row.employee_id})` : (row.assigned_to || "Unassigned")}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{formatDate(row.assigned_date)}</TableCell>
                                                            <TableCell>{renderBooleanBadge(row.is_assigned, "Assigned", "Unassigned")}</TableCell>
                                                            <TableCell>{renderWorkStatusBadge(row.work_status)}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{formatDateTime(row.created_at)}</TableCell>
                                                            <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: textPrimaryColor }}>
                                                                {row.remarks || "—"}
                                                            </TableCell>
                                                            <TableCell>{renderBooleanBadge(row.is_locked, "Locked", "Unlocked")}</TableCell>
                                                            <TableCell>{renderBooleanBadge(row.status_is_active, "Active", "Inactive")}</TableCell>
                                                            <TableCell>{renderBooleanBadge(row.requires_followup, "Yes", "No")}</TableCell>
                                                            <TableCell>{renderBooleanBadge(row.is_call_required, "Yes", "No")}</TableCell>
                                                            <TableCell>{renderBooleanBadge(row.is_policy_required, "Yes", "No")}</TableCell>
                                                            <TableCell>{renderBooleanBadge(row.is_followup_date_required, "Yes", "No")}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{row.created_by || "—"}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{row.edited_by || "—"}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Pagination controls */}
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    component="div"
                                    count={filteredData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={(e, newPage) => setPage(newPage)}
                                    onRowsPerPageChange={(e) => {
                                        setRowsPerPage(parseInt(e.target.value, 10));
                                        setPage(0);
                                    }}
                                    sx={{
                                        borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
                                        color: textPrimaryColor,
                                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                                            fontSize: "13px",
                                            fontWeight: 500,
                                            color: textSecondaryColor,
                                        },
                                        "& .MuiTablePagination-select": {
                                            fontSize: "13px",
                                        },
                                        "& .MuiTablePagination-actions svg": {
                                            color: textPrimaryColor
                                        }
                                    }}
                                />
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
                            Enter an Employee ID and dates, then search to retrieve individual performance records.
                        </Typography>
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default EmployeePreformanceReport;