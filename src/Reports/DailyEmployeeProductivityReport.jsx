
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Divider,
    Card,
    IconButton,
    Grid,
} from "@mui/joy";
import { Paper } from "@mui/material";
import {
    DataGrid,
    GridToolbar,
} from "@mui/x-data-grid";

import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import CallMissedOutgoingIcon from "@mui/icons-material/CallMissedOutgoing";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { axioslogin } from "../Connection/axios";
import { useThemeMode } from "../Context/ThemeContext";
import {
    errorNotify,
    successNotify,
    warningNotify,
} from "../constant/Constant";

const getFirstDayOfMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
};

const getTodayDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const DailyEmployeeProductivityReport = () => {
    const navigate = useNavigate();
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const [startDate, setStartDate] = useState(getFirstDayOfMonth());
    const [endDate, setEndDate] = useState(getTodayDate());
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const textPrimaryColor = isDark ? "#f8fafc" : "#0f172a";
    const textSecondaryColor = isDark ? "#94a3b8" : "#475569";

    const borderCol = isDark
        ? "rgba(255,255,255,0.1)"
        : "rgba(226,232,240,0.8)";

    const tableHeaderBg = isDark ? "#1e293b" : "#f8fafc";
    const tableHeaderTextColor = isDark ? "#cbd5e1" : "#334155";
    const inputBg = isDark ? "#0f172a" : "#ffffff";
    const inputTextColor = isDark ? "#f8fafc" : "#0f172a";

    const formatDateTime = (value) => {
        if (!value) return "N/A";

        const date = new Date(String(value).replace(" ", "T"));

        return isNaN(date.getTime())
            ? "N/A"
            : date.toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
    };

    const handleSearch = async () => {
        if (!startDate || !endDate) {
            warningNotify("Please select both dates");
            return;
        }

        if (startDate > endDate) {
            warningNotify("Start date cannot be greater than end date");
            return;
        }

        try {
            setLoading(true);
            setSearched(true);
            setReportData([]);

            const response = await axioslogin.get(
                `/lead-call-logs/daily-productivity?fromDate=${startDate}&toDate=${endDate}`
            );

            if (response.data?.success === 1) {
                setReportData(response.data.data || []);

                successNotify(
                    `Retrieved ${response.data.data?.length || 0} employee records`
                );
            } else {
                setReportData([]);
                warningNotify(response.data?.message || "Failed to fetch report");
            }
        } catch (error) {
            console.error("Daily productivity report error:", error);
            setReportData([]);
            errorNotify("Failed to fetch daily employee productivity report");
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        if (!reportData.length) {
            warningNotify("No data available to export");
            return;
        }

        try {
            setExportLoading(true);

            const response = await axioslogin.get(
                `/lead-call-logs/export-daily-productivity-excel?fromDate=${startDate}&toDate=${endDate}`,
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `employee_productivity_${startDate}_to_${endDate}.xlsx`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            successNotify("Productivity report downloaded successfully");
        } catch (error) {
            console.error("Productivity Excel export error:", error);
            errorNotify("Failed to download productivity report");
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

    const handleBack = () => navigate("/home/reports");

    const totalCalls = reportData.reduce(
        (sum, row) => sum + Number(row.total_calls || 0),
        0
    );

    const totalAnswered = reportData.reduce(
        (sum, row) => sum + Number(row.answered_calls || 0),
        0
    );

    const totalUnanswered = reportData.reduce(
        (sum, row) => sum + Number(row.unanswered_calls || 0),
        0
    );

    const totalTalkingSeconds = reportData.reduce(
        (sum, row) => sum + Number(row.total_talking_seconds || 0),
        0
    );

    const totalTalkingDuration = `${Math.floor(totalTalkingSeconds / 3600)
        .toString().padStart(2, "0")}:${Math.floor((totalTalkingSeconds % 3600) / 60)
            .toString().padStart(2, "0")}:${(totalTalkingSeconds % 60)
                .toString().padStart(2, "0")}`;

    const columns = [
        {
            field: "employee_id",
            headerName: "Employee ID",
            width: 120,
        },
        {
            field: "employee_name",
            headerName: "Employee Name",
            minWidth: 180,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    level="body-sm"
                    fontWeight={700}
                    sx={{ color: textPrimaryColor }}
                >
                    {params.value || "N/A"}
                </Typography>
            ),
        },
        {
            field: "first_login",
            headerName: "First Login",
            minWidth: 175,
            flex: 1,
            valueFormatter: (value) => formatDateTime(value),
        },
        {
            field: "last_logout",
            headerName: "Last Logout",
            minWidth: 175,
            flex: 1,
            valueFormatter: (value) => formatDateTime(value),
        },
        {
            field: "total_login_sessions",
            headerName: "Sessions",
            width: 100,
            type: "number",
            align: "center",
            headerAlign: "center",
        },
        {
            field: "total_working_duration",
            headerName: "Working Duration",
            width: 155,
            valueFormatter: (value) => value || "00:00:00",
        },
        {
            field: "total_calls",
            headerName: "Total Calls",
            width: 110,
            type: "number",
        },
        {
            field: "answered_calls",
            headerName: "Answered",
            width: 110,
            type: "number",
            renderCell: (params) => (
                <Typography
                    level="body-sm"
                    fontWeight={700}
                    sx={{ color: "#059669" }}
                >
                    {params.value || 0}
                </Typography>
            ),
        },
        {
            field: "unanswered_calls",
            headerName: "Unanswered",
            width: 120,
            type: "number",
            renderCell: (params) => (
                <Typography
                    level="body-sm"
                    fontWeight={700}
                    sx={{ color: "#d97706" }}
                >
                    {params.value || 0}
                </Typography>
            ),
        },
        {
            field: "total_talking_duration",
            headerName: "Talking Duration",
            width: 145,
            valueFormatter: (value) => value || "00:00:00",
        },
        {
            field: "talking_hours",
            headerName: "Talking Hours",
            width: 120,
            type: "number",
            valueFormatter: (value) => Number(value || 0).toFixed(2),
        },
    ];

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                minHeight: "95vh",
                background: isDark
                    ? "linear-gradient(135deg,#020617,#0f172a,#1e293b)"
                    : "linear-gradient(135deg,#f8fafc,#eff6ff,#fef3c7)",
            }}
        >
            <Card
                variant="outlined"
                sx={{
                    borderRadius: "24px",
                    border: `1px solid ${borderCol}`,
                    background: isDark
                        ? "rgba(15,23,42,0.95)"
                        : "rgba(255,255,255,0.9)",
                    p: { xs: 2, md: 3 },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <IconButton
                        variant="outlined"
                        color="neutral"
                        onClick={handleBack}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Box>
                        <Typography
                            level="h3"
                            sx={{
                                fontWeight: 900,
                                color: textPrimaryColor,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <AssessmentIcon color="primary" />
                            Daily Employee Productivity Report
                        </Typography>

                        <Typography
                            level="body-sm"
                            sx={{ color: textSecondaryColor, mt: 0.5 }}
                        >
                            View employee attendance and call productivity for the selected period.
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Date Filters */}
                <Grid
                    container
                    spacing={2}
                    alignItems="flex-end"
                    sx={{ mb: 3 }}
                >
                    <Grid xs={12} sm={4} md={3}>
                        <Typography
                            level="body-xs"
                            sx={{ mb: 1, fontWeight: 700 }}
                        >
                            From Date
                        </Typography>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{
                                width: "100%",
                                height: 40,
                                padding: "0 10px",
                                borderRadius: 10,
                                border: `1px solid ${borderCol}`,
                                background: inputBg,
                                color: inputTextColor,
                            }}
                        />
                    </Grid>

                    <Grid xs={12} sm={4} md={3}>
                        <Typography
                            level="body-xs"
                            sx={{ mb: 1, fontWeight: 700 }}
                        >
                            To Date
                        </Typography>

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{
                                width: "100%",
                                height: 40,
                                padding: "0 10px",
                                borderRadius: 10,
                                border: `1px solid ${borderCol}`,
                                background: inputBg,
                                color: inputTextColor,
                            }}
                        />
                    </Grid>

                    <Grid xs={12} md={6}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: {
                                    xs: "flex-start",
                                    md: "flex-end",
                                },
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            <Button
                                variant="outlined"
                                color="neutral"
                                startDecorator={<RefreshIcon />}
                                onClick={handleReset}
                            >
                                Reset
                            </Button>

                            <Button
                                startDecorator={
                                    loading
                                        ? <CircularProgress size="sm" />
                                        : <SearchIcon />
                                }
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                Search Report
                            </Button>

                            {reportData.length > 0 && (
                                <Button
                                    color="success"
                                    startDecorator={
                                        exportLoading
                                            ? <CircularProgress size="sm" />
                                            : <FileDownloadIcon />
                                    }
                                    onClick={handleExportExcel}
                                    disabled={exportLoading}
                                >
                                    Export Excel
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                {/* Report */}
                {searched && (
                    loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                py: 8,
                            }}
                        >
                            <CircularProgress size="lg" />
                        </Box>
                    ) : reportData.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography
                                level="h4"
                                sx={{ color: textPrimaryColor }}
                            >
                                No Records Found
                            </Typography>

                            <Typography
                                level="body-sm"
                                sx={{
                                    color: textSecondaryColor,
                                    mt: 1,
                                }}
                            >
                                No employee productivity records found for the selected dates.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            {/* Summary Cards */}
                            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                                {[
                                    {
                                        label: "Employees",
                                        value: reportData.length,
                                        color: "#2563eb",
                                        bg: isDark ? "rgba(37,99,235,0.12)" : "#eff6ff",
                                        icon: <PeopleAltIcon />,
                                    },
                                    {
                                        label: "Total Calls",
                                        value: totalCalls,
                                        color: "#7c3aed",
                                        bg: isDark ? "rgba(124,58,237,0.12)" : "#f5f3ff",
                                        icon: <PhoneInTalkIcon />,
                                    },
                                    {
                                        label: "Answered Calls",
                                        value: totalAnswered,
                                        color: "#059669",
                                        bg: isDark ? "rgba(5,150,105,0.12)" : "#ecfdf5",
                                        icon: <CallReceivedIcon />,
                                    },
                                    {
                                        label: "Unanswered Calls",
                                        value: totalUnanswered,
                                        color: "#d97706",
                                        bg: isDark ? "rgba(217,119,6,0.12)" : "#fffbeb",
                                        icon: <CallMissedOutgoingIcon />,
                                    },
                                    {
                                        label: "Talking Duration",
                                        value: totalTalkingDuration,
                                        color: "#0891b2",
                                        bg: isDark ? "rgba(8,145,178,0.12)" : "#ecfeff",
                                        icon: <AccessTimeIcon />,
                                    },
                                ].map((item) => (
                                    <Grid xs={12} sm={6} md={2.4} key={item.label}>
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                p: 1.5,
                                                borderRadius: "14px",
                                                borderColor: borderCol,
                                                background: isDark ? "#0f172a" : "#fff",
                                                boxShadow: "none",
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 1.2,
                                                minHeight: 76,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    flexShrink: 0,
                                                    borderRadius: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: item.color,
                                                    background: item.bg,
                                                    fontSize: 18,
                                                }}
                                            >
                                                {item.icon}
                                            </Box>

                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    level="body-xs"
                                                    sx={{
                                                        color: textSecondaryColor,
                                                        fontWeight: 600,
                                                        mb: 0.3,
                                                    }}
                                                >
                                                    {item.label}
                                                </Typography>

                                                <Typography
                                                    level="h4"
                                                    sx={{
                                                        fontWeight: 800,
                                                        color: isDark ? "#f8fafc" : "#172033",
                                                        lineHeight: 1.2,
                                                        whiteSpace: "nowrap",
                                                        fontSize: "clamp(15px, 1.5vw, 20px)",
                                                    }}
                                                >
                                                    {item.value}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* DataGrid */}
                            <Paper
                                elevation={0}
                                sx={{
                                    width: "100%",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: `1px solid ${borderCol}`,
                                    bgcolor: isDark ? "#0f172a" : "#fff",
                                    p: 2,
                                }}
                            >
                                <DataGrid
                                    rows={reportData}
                                    columns={columns}
                                    showToolbar
                                    slots={{
                                        toolbar: GridToolbar,
                                    }}
                                    loading={loading}
                                    disableRowSelectionOnClick
                                    getRowId={(row) => row.user_id}
                                    pageSizeOptions={[5, 10, 25, 50, 100]}
                                    rowHeight={44}
                                    columnHeaderHeight={46}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 10,
                                                page: 0,
                                            },
                                        },
                                    }}
                                    sx={{
                                        height: 550,
                                        width: "100%",
                                        border: "none",
                                        fontSize: "13px",
                                        backgroundColor: "transparent",
                                        color: isDark ? "#f8fafc" : undefined,
                                        fontFamily: "Bahnschrift",

                                        "& .MuiDataGrid-columnHeaders": {
                                            background: tableHeaderBg,
                                            minHeight: "46px !important",
                                            maxHeight: "46px !important",
                                            borderBottom: `1px solid ${borderCol}`,
                                            fontFamily: "Bahnschrift",
                                        },

                                        "& .MuiDataGrid-columnHeaderTitle": {
                                            fontWeight: 800,
                                            color: tableHeaderTextColor,
                                            fontSize: "12px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.4px",
                                            fontFamily: "Bahnschrift",
                                        },


                                        "& .MuiDataGrid-cell": {
                                            borderBottom: `1px solid ${borderCol}`,
                                            color: isDark ? "#cbd5e1" : "#334155",
                                            outline: "none !important",
                                            fontFamily: "Bahnschrift",
                                        },

                                        "& .MuiDataGrid-row:hover": {
                                            backgroundColor: isDark
                                                ? "rgba(37,99,235,0.15)"
                                                : "rgba(37,99,235,0.04)",
                                        },

                                        "& .MuiDataGrid-footerContainer": {
                                            borderTop: `1px solid ${borderCol}`,
                                            color: isDark ? "#f8fafc" : undefined,
                                        },

                                        "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                                            color: isDark ? "#f8fafc" : undefined,
                                        },

                                        "& .MuiDataGrid-toolbar": {
                                            padding: "4px 0 12px",
                                        },

                                        "& .MuiDataGrid-toolbar button": {
                                            color: isDark ? "#cbd5e1" : "#334155",
                                        },
                                        "& .MuiDataGrid-scrollbar": {
                                            display: "none",
                                        },

                                        "& .MuiDataGrid-virtualScroller": {
                                            scrollbarWidth: "none",
                                            "&::-webkit-scrollbar": {
                                                display: "none",
                                            },
                                        },

                                        "& .MuiDataGrid-main": {
                                            scrollbarWidth: "none",
                                        },
                                    }}
                                />
                            </Paper>
                        </>
                    )
                )}

                {/* Initial State */}
                {!searched && (
                    <Box
                        sx={{
                            textAlign: "center",
                            py: 10,
                            border: `2px dashed ${borderCol}`,
                            borderRadius: 3,
                        }}
                    >
                        <SearchIcon
                            sx={{
                                fontSize: 48,
                                color: textSecondaryColor,
                            }}
                        />

                        <Typography
                            level="h4"
                            sx={{
                                mt: 1,
                                color: textPrimaryColor,
                            }}
                        >
                            Run Productivity Report
                        </Typography>

                        <Typography
                            level="body-sm"
                            sx={{
                                color: textSecondaryColor,
                                mt: 1,
                            }}
                        >
                            Select a date range and search to view all employee productivity.
                        </Typography>
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default DailyEmployeeProductivityReport;
