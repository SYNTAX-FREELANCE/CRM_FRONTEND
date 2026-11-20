
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Divider,
    Card,
    IconButton,
    Chip,
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
import CallIcon from "@mui/icons-material/Call";
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
import UserSelectDropdown from "../CommonComponents/UserSelectDropdown";

const getFirstDayOfMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
};

const getTodayDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const EmployeeCallDetailsReport = () => {
    const navigate = useNavigate();
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const [userId, setUserId] = useState("");
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

    const inputBg = isDark ? "#0f172a" : "#ffffff";
    const inputTextColor = isDark ? "#f8fafc" : "#0f172a";

    const inputBorder = isDark
        ? "1px solid rgba(255,255,255,0.2)"
        : "1px solid #cbd5e1";

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
                second: "2-digit",
                hour12: true,
            });
    };

    const handleSearch = async () => {
        if (!userId) {
            warningNotify("Please select an employee");
            return;
        }

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
                `/lead-call-logs/employee-call-details?userId=${encodeURIComponent(userId)}&fromDate=${startDate}&toDate=${endDate}`
            );

            if (response.data?.success === 1) {
                setReportData(response.data.data || []);

                successNotify(
                    `Retrieved ${response.data.data?.length || 0} call records`
                );
            } else {
                setReportData([]);

                warningNotify(
                    response.data?.message || "Failed to fetch call details"
                );
            }
        } catch (error) {
            console.error("Employee call details error:", error);
            setReportData([]);
            errorNotify("Failed to fetch employee call details");
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        if (!reportData.length) {
            warningNotify("No call records available to export");
            return;
        }

        try {
            setExportLoading(true);

            const response = await axioslogin.get(
                `/lead-call-logs/export-employee-call-details-excel?userId=${encodeURIComponent(userId)}&fromDate=${startDate}&toDate=${endDate}`,
                { responseType: "blob" }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = `employee_call_details_${userId}_${startDate}_to_${endDate}.xlsx`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            successNotify("Employee call details downloaded successfully");
        } catch (error) {
            console.error("Employee call Excel export error:", error);
            errorNotify("Failed to download employee call details");
        } finally {
            setExportLoading(false);
        }
    };

    const handleReset = () => {
        setUserId("");
        setStartDate(getFirstDayOfMonth());
        setEndDate(getTodayDate());
        setReportData([]);
        setSearched(false);
    };

    const handleBack = () => {
        navigate("/home/reports");
    };

    const answeredCount = reportData.filter(
        (row) => row.call_result === "ANSWERED"
    ).length;

    const unansweredCount = reportData.filter(
        (row) => row.call_result === "UNANSWERED"
    ).length;

    const totalSeconds = reportData.reduce(
        (sum, row) => sum + Number(row.duration_seconds || 0),
        0
    );

    const totalDuration = `${Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, "0")}:${Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, "0")}:${(totalSeconds % 60)
                .toString()
                .padStart(2, "0")}`;

    const columns = [
        // {
        //     field: "call_log_id",
        //     headerName: "Call ID",
        //     width: 90,
        // },
        // {
        //     field: "lead_id",
        //     headerName: "Lead ID",
        //     width: 100,
        // },
        {
            field: "customer_name",
            headerName: "Customer Name",
            minWidth: 180,
            flex: 1,
            renderCell: (params) => (
                <Typography
                    level="body-sm"
                    fontWeight={700}
                    sx={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                >
                    {params.value || "N/A"}
                </Typography>
            ),
        },
        {
            field: "phone_number",
            headerName: "Phone Number",
            minWidth: 130,
            flex: 0.8,
        },
        {
            field: "call_started_at",
            headerName: "Call Started",
            minWidth: 180,
            flex: 1,
            valueFormatter: (value) => formatDateTime(value),
        },
        {
            field: "call_ended_at",
            headerName: "Call Ended",
            minWidth: 180,
            flex: 1,
            valueFormatter: (value) => formatDateTime(value),
        },
        {
            field: "talking_duration",
            headerName: "Duration",
            width: 110,
        },
        {
            field: "call_result",
            headerName: "Call Result",
            width: 130,
            renderCell: (params) => (
                <Chip
                    size="sm"
                    variant="soft"
                    color={
                        params.value === "ANSWERED"
                            ? "success"
                            : "warning"
                    }
                >
                    {params.value || "N/A"}
                </Chip>
            ),
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
                            <CallIcon color="primary" />
                            Employee Call Details Report
                        </Typography>

                        <Typography
                            level="body-sm"
                            sx={{
                                color: textSecondaryColor,
                                mt: 0.5,
                            }}
                        >
                            View individual customer calls made by a selected employee.
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Filters */}
                <Grid
                    container
                    spacing={2}
                    alignItems="flex-end"
                    sx={{ mb: 3 }}
                >
                    <Grid xs={12} sm={6} md={3}>
                        <Typography
                            level="body-xs"
                            sx={{ mb: 1, fontWeight: 700, color: textSecondaryColor }}
                        >
                            Select Employee *
                        </Typography>

                        <UserSelectDropdown
                            value={userId}
                            onChange={(value) => setUserId(value)}
                            placeholder="Select Employee"
                            isDark={isDark}
                            inputBg={inputBg}
                            inputTextColor={inputTextColor}
                            inputBorder={inputBorder}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={2}>
                        <Typography
                            level="body-xs"
                            sx={{ mb: 1, fontWeight: 700, color: textSecondaryColor }}
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
                                border: inputBorder,
                                background: inputBg,
                                color: inputTextColor,
                            }}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={2}>
                        <Typography
                            level="body-xs"
                            sx={{ mb: 1, fontWeight: 700, color: textSecondaryColor }}
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
                                border: inputBorder,
                                background: inputBg,
                                color: inputTextColor,
                            }}
                        />
                    </Grid>

                    <Grid xs={12} md={5}>
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

                {/* Report Results */}
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
                                No calls found for the selected employee and dates.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                                {[
                                    {
                                        label: "Total Calls",
                                        value: reportData.length,
                                        color: "#2563eb",
                                        bg: isDark ? "rgba(37,99,235,0.12)" : "#eff6ff",
                                        icon: <PhoneInTalkIcon />,
                                    },
                                    {
                                        label: "Answered",
                                        value: answeredCount,
                                        color: "#059669",
                                        bg: isDark ? "rgba(5,150,105,0.12)" : "#ecfdf5",
                                        icon: <CallReceivedIcon />,
                                    },
                                    {
                                        label: "Unanswered",
                                        value: unansweredCount,
                                        color: "#d97706",
                                        bg: isDark ? "rgba(217,119,6,0.12)" : "#fffbeb",
                                        icon: <CallMissedOutgoingIcon />,
                                    },
                                    {
                                        label: "Talking Duration",
                                        value: totalDuration,
                                        color: "#0891b2",
                                        bg: isDark ? "rgba(8,145,178,0.12)" : "#ecfeff",
                                        icon: <AccessTimeIcon />,
                                    },
                                ].map((item) => (
                                    <Grid xs={6} sm={3} key={item.label}>
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
                                                        fontSize: "clamp(16px, 2vw, 21px)",
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
                                    flex: 1,
                                    minHeight: 0,
                                    width: "100%",
                                    borderRadius: 4,
                                    overflowX: "hidden",
                                    border: isDark
                                        ? "1px solid rgba(255, 255, 255, 0.1)"
                                        : "1px solid rgba(255, 255, 255, 0.55)",
                                    background: isDark
                                        ? "rgba(30, 41, 59, 0.8)"
                                        : "rgba(255, 255, 255, 0.25)",
                                    backdropFilter: "blur(16px)",
                                    boxShadow: isDark
                                        ? "0 10px 30px rgba(0, 0, 0, 0.3)"
                                        : "0 10px 30px rgba(15, 23, 42, 0.02)",
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
                                    getRowId={(row) => row.call_log_id}
                                    pageSizeOptions={[5, 10, 25, 50, 100]}
                                    rowHeight={42}
                                    columnHeaderHeight={44}
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
                                        height: 550,
                                        width: "100%",
                                        border: "none",
                                        fontSize: "13px",
                                        backgroundColor: "transparent",
                                        color: isDark ? "#f8fafc" : undefined,

                                        "& .MuiDataGrid-columnHeaders": {
                                            background: isDark
                                                ? "rgba(15, 23, 42, 0.8)"
                                                : "rgba(248, 250, 252, 0.55)",
                                            minHeight: "44px !important",
                                            maxHeight: "44px !important",
                                            borderBottom: isDark
                                                ? "1px solid rgba(255,255,255,0.1)"
                                                : "1px solid rgba(226,232,240,0.6)",
                                        },

                                        "& .MuiDataGrid-columnHeader": {
                                            padding: "0 12px",
                                        },

                                        "& .MuiDataGrid-columnHeaderTitle": {
                                            fontWeight: 800,
                                            color: isDark ? "#f8fafc" : "#0d0f0e",
                                            fontSize: "12px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                        },

                                        "& .MuiDataGrid-cell": {
                                            padding: "8px 12px",
                                            borderBottom: isDark
                                                ? "1px solid rgba(255,255,255,0.08)"
                                                : "1px solid rgba(226,232,240,0.4)",
                                            outline: "none !important",
                                            color: isDark ? "#cbd5e1" : undefined,
                                        },

                                        "& .MuiDataGrid-row": {
                                            cursor: "default",
                                            background: isDark
                                                ? "rgba(255,255,255,0.02)"
                                                : "rgba(255,255,255,0.15)",
                                            transition: "background-color 0.15s ease",
                                            "&:hover": {
                                                backgroundColor: isDark
                                                    ? "rgba(37,99,235,0.18)"
                                                    : "rgba(37,99,235,0.04)",
                                            },
                                        },

                                        "& .MuiDataGrid-footerContainer": {
                                            minHeight: "44px",
                                            borderTop: isDark
                                                ? "1px solid rgba(255,255,255,0.1)"
                                                : "1px solid rgba(226,232,240,0.6)",
                                            background: isDark
                                                ? "rgba(15, 23, 42, 0.8)"
                                                : "rgba(248, 250, 252, 0.55)",
                                            color: isDark ? "#f8fafc" : undefined,
                                        },

                                        "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiIconButton-root": {
                                            color: isDark ? "#f8fafc" : undefined,
                                        },

                                        "& .MuiDataGrid-toolbar": {
                                            padding: "4px 0 12px",
                                        },

                                        "& .MuiDataGrid-toolbar button": {
                                            color: isDark ? "#cbd5e1" : "#334155",
                                        },

                                        "& .MuiDataGrid-virtualScroller": {
                                            overflowY: "auto",
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
                            Run Employee Call Report
                        </Typography>

                        <Typography
                            level="body-sm"
                            sx={{
                                color: textSecondaryColor,
                                mt: 1,
                            }}
                        >
                            Select an employee and date range to view individual call records.
                        </Typography>
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default EmployeeCallDetailsReport;
