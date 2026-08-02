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
import SecurityIcon from "@mui/icons-material/Security";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
import { axioslogin } from "../Connection/axios";
import { useThemeMode } from "../Context/ThemeContext";
import { errorNotify, successNotify, warningNotify } from "../constant/Constant";
import UserSelectDropdown from "../CommonComponents/UserSelectDropdown";

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

const DetailedUserLogReports = () => {
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
            warningNotify("Please select an Employee");
            return;
        }
        if (!startDate || !endDate) {
            warningNotify("Please select both start and end dates");
            return;
        }

        try {
            setLoading(true);
            setSearched(true);
            const response = await axioslogin.get(
                `/reports/employee-attendance-detailed?employeeId=${encodeURIComponent(employeeId)}&fromDate=${startDate}&toDate=${endDate}`
            );
            
            if (response.data?.success === 1) {
                setReportData(response.data.data || []);
                setPage(0);
                successNotify(`Retrieved ${response.data.data?.length || 0} detailed attendance records.`);
            } else {
                warningNotify(response.data?.message || "Failed to fetch detailed attendance data");
                setReportData([]);
            }
        } catch (error) {
            console.error("Fetch detailed attendance error:", error);
            errorNotify("An error occurred while fetching detailed attendance logs");
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
            const response = await axioslogin.get(
                `/reports/employee-attendance-detailed/export?employeeId=${encodeURIComponent(employeeId)}&fromDate=${startDate}&toDate=${endDate}`,
                { responseType: "blob" }
            );

            // Trigger file download
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", `detailed_attendance_report_${employeeId}_${startDate}_to_${endDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
            successNotify("Detailed attendance spreadsheet downloaded successfully!");
        } catch (error) {
            console.error("Export Excel error:", error);
            errorNotify("Failed to download detailed attendance spreadsheet");
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

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "N/A";
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
    };

    const formatProductivityHours = (val) => {
        if (!val || isNaN(val)) return "0 hrs 0 mins";
        const totalMinutes = Math.round(parseFloat(val) * 60);
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return `${hrs} hrs ${mins} mins`;
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
                minHeight: "95vh",
                width: "100%",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
                p: { xs: 1.5, sm: 2, md: 3 },
                background: isDark
                    ? `
                      radial-gradient(circle at 10% 20%, rgba(30, 41, 59, 0.5) 0%, transparent 40%),
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
                                <SecurityIcon sx={{ color: "#3b82f6", fontSize: "2rem" }} />
                                Detailed Employee Login Report
                            </Typography>
                            <Typography level="body-sm" sx={{ color: textSecondaryColor, mt: 0.5, fontWeight: 500 }}>
                                View all individual session log-ins, log-outs, and shift productivity details per employee.
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
                                Select Employee *
                            </Typography>
                            <UserSelectDropdown
                                value={employeeId}
                                onChange={(val) => setEmployeeId(val)}
                                placeholder="Select Employee"
                                isDark={isDark}
                                inputBg={inputBg}
                                inputTextColor={inputTextColor}
                                inputBorder={inputBorder}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={4} md={2.5}>
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
                                        color: inputTextColor,
                                        height: "40px",
                                        "& fieldset": {
                                            border: inputBorder,
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#3b82f6",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#3b82f6",
                                        },
                                    },
                                    "& input": {
                                        color: inputTextColor,
                                        fontSize: "14px",
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={4} md={2.5}>
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
                                        color: inputTextColor,
                                        height: "40px",
                                        "& fieldset": {
                                            border: inputBorder,
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#3b82f6",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#3b82f6",
                                        },
                                    },
                                    "& input": {
                                        color: inputTextColor,
                                        fontSize: "14px",
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={12} md={4}>
                        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                            <Button
                                variant="solid"
                                color="primary"
                                startDecorator={loading ? <CircularProgress size="sm" /> : <SearchIcon />}
                                onClick={handleSearch}
                                disabled={loading}
                                sx={{
                                    borderRadius: "12px",
                                    height: "40px",
                                    px: 2.5,
                                    fontWeight: 700,
                                    bgcolor: "#3b82f6",
                                    "&:hover": { bgcolor: "#2563eb" },
                                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                                }}
                            >
                                Search Logs
                            </Button>
                            <Button
                                variant="outlined"
                                color="neutral"
                                startDecorator={<RefreshIcon />}
                                onClick={handleReset}
                                disabled={loading}
                                sx={{
                                    borderRadius: "12px",
                                    height: "40px",
                                    px: 2,
                                    borderColor: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1",
                                    color: textPrimaryColor,
                                    "&:hover": {
                                        bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                                    },
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="solid"
                                color="success"
                                startDecorator={exportLoading ? <CircularProgress size="sm" /> : <FileDownloadIcon />}
                                onClick={handleExportExcel}
                                disabled={exportLoading || reportData.length === 0}
                                sx={{
                                    borderRadius: "12px",
                                    height: "40px",
                                    px: 2.5,
                                    fontWeight: 700,
                                    bgcolor: "#10b981",
                                    "&:hover": { bgcolor: "#059669" },
                                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                                }}
                            >
                                Export Excel
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Results Section */}
                {searched && (
                    <Box sx={{ mt: 2 }}>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
                                <CircularProgress size="lg" color="primary" />
                            </Box>
                        ) : filteredData.length === 0 ? (
                            <Box
                                sx={{
                                    textAlign: "center",
                                    py: 8,
                                    px: 2,
                                    bgcolor: isDark ? "rgba(30, 41, 59, 0.3)" : "rgba(248, 250, 252, 0.8)",
                                    borderRadius: "16px",
                                    border: isDark ? "1px dashed rgba(255, 255, 255, 0.15)" : "1px dashed #cbd5e1",
                                }}
                            >
                                <Typography level="title-md" sx={{ color: textPrimaryColor, fontWeight: 700 }}>
                                    No detailed attendance logs found
                                </Typography>
                                <Typography level="body-sm" sx={{ color: textSecondaryColor, mt: 0.5 }}>
                                    Try selecting a different employee or expanding the date range.
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                {/* Filter Bar above table */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 2,
                                    }}
                                >
                                    <Typography level="body-sm" sx={{ fontWeight: 700, color: textSecondaryColor }}>
                                        Showing {filteredData.length} records
                                    </Typography>

                                    <Input
                                        placeholder="Search in table..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        startDecorator={<FilterAltIcon sx={{ color: textSecondaryColor }} />}
                                        endDecorator={
                                            searchQuery && (
                                                <IconButton
                                                    variant="plain"
                                                    color="neutral"
                                                    onClick={() => setSearchQuery("")}
                                                    sx={{ p: 0.5, minWidth: 0, borderRadius: "50%" }}
                                                >
                                                    <ClearIcon sx={{ fontSize: "14px", color: textSecondaryColor }} />
                                                </IconButton>
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
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255,255,255,0.08)" : "2px solid #e2e8f0" }}>Employee ID</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255,255,255,0.08)" : "2px solid #e2e8f0" }}>Employee Name</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255,255,255,0.08)" : "2px solid #e2e8f0" }}>Login Time</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255,255,255,0.08)" : "2px solid #e2e8f0" }}>Logout Time</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255,255,255,0.08)" : "2px solid #e2e8f0" }}>Productivity Hours</TableCell>
                                                <TableCell sx={{ fontWeight: 800, bgcolor: tableHeaderBg, color: tableHeaderTextColor, borderBottom: isDark ? "2px solid rgba(255,255,255,0.08)" : "2px solid #e2e8f0" }}>System IP</TableCell>
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
                                                            key={row.id || index}
                                                            hover
                                                            sx={{
                                                                bgcolor: rowBg,
                                                                "& td": { borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid #f1f5f9" },
                                                                "&:hover": {
                                                                    bgcolor: isDark ? "#334155 !important" : "#f1f5f9 !important"
                                                                }
                                                            }}
                                                        >
                                                            <TableCell sx={{ color: textPrimaryColor }}>{row.username}</TableCell>
                                                            <TableCell sx={{ fontWeight: 550, color: "#2563eb" }}>{row.employee_name || "N/A"}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{formatDateTime(row.login_time)}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{formatDateTime(row.logout_time)}</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, color: "#10b981" }}>{formatProductivityHours(row.productivity_hours)}</TableCell>
                                                            <TableCell sx={{ color: textPrimaryColor }}>{row.system_ip || "—"}</TableCell>
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
                                        color: textSecondaryColor,
                                        borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                                        ".MuiTablePagination-selectIcon": {
                                            color: textSecondaryColor,
                                        },
                                        ".MuiTablePagination-actions button": {
                                            color: textSecondaryColor,
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default DetailedUserLogReports;
