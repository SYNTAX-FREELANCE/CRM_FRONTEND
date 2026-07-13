import React, { useState, useMemo } from "react";
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
    CircularProgress,
} from "@mui/joy";

import {
    ArrowBack,
    Business,
    Call,
    Email,
    Badge,
    Person,
    CalendarMonth,
    LocationOn,
    PhoneAndroid,
    Work,
    KeyboardArrowDown,
    KeyboardArrowUp,
    ContentCopy,
    ChevronLeft,
    ChevronRight,
    NorthEast,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";
import { errorNotify, successNotify } from "../constant/Constant";
import { useEmployeeProfile, useEmployeePerformance, useFetchDashBoardCounts, useFetchDashBoardReminders, useGetAttendanceByDate } from "../CommonCode/useQuery";

const EmployeeDetails = () => {
    const navigate = useNavigate();
    const { employeeId } = useParams();

    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);

    const { data: employee, isLoading: loadingEmp } = useEmployeeProfile(employeeId);
    const { data: performanceData, } = useEmployeePerformance(employee ? employeeId : null);
    const { data: TotalCount = [] } = useFetchDashBoardCounts(employee?.user_id);
    const { data: remindersData = [] } = useFetchDashBoardReminders(employee?.user_id);
    const { data: attendanceData, isLoading: loadingAttendance } = useGetAttendanceByDate(employee?.user_id, attendanceDate);

    // console.log("employee:", employee);

    // console.log("performanceData", performanceData);

    // console.log("TotalCount:", TotalCount);



    // ******************************

    // const summary = remindersData?.summary || {};
    // const overdueList = remindersData?.overdue || [];
    // const todayList = remindersData?.today || [];
    // const tomorrowList = remindersData?.tomorrow || [];
    // const upcomingList = remindersData?.upcoming || [];

    // const [activeStatus, setActiveStatus] = useState("overdue");
    // const [statusMeta, setStatusMeta] = useState([]);

    // const summaryItems = [
    //     {
    //         key: "overdue",
    //         title: "Overdue",
    //         count: Number(summary.overdue || overdueList.length || 0),
    //         ...statusMeta.overdue,
    //     },
    //     {
    //         key: "today",
    //         title: "Today",
    //         count: Number(summary.today || todayList.length || 0),
    //         ...statusMeta.today,
    //     },
    //     {
    //         key: "tomorrow",
    //         title: "Tomorrow",
    //         count: Number(summary.tomorrow || tomorrowList.length || 0),
    //         ...statusMeta.tomorrow,
    //     },
    //     {
    //         key: "upcoming",
    //         title: "Upcoming",
    //         count: Number(summary.next7days || upcomingList.length || 0),
    //         ...statusMeta.upcoming,
    //     },
    // ];

    // const listMap = {
    //     overdue: overdueList.map((item) => ({ ...item, status: "overdue" })),
    //     today: todayList.map((item) => ({ ...item, status: "today" })),
    //     tomorrow: tomorrowList.map((item) => ({ ...item, status: "tomorrow" })),
    //     upcoming: upcomingList.map((item) => ({ ...item, status: "upcoming" })),
    // };

    // const activeItems = listMap[activeStatus] || [];
    // const total = summaryItems.reduce((sum, item) => sum + item.count, 0);


    console.log("remindersData::", remindersData);

    const allReminders = useMemo(() => {
        const overdue = remindersData?.overdue || [];
        const today = remindersData?.today || [];
        const tomorrow = remindersData?.tomorrow || [];
        const upcoming = remindersData?.upcoming || [];

        const mappedOverdue = overdue.map(item => ({ ...item, status: "overdue", label: "Overdue", lineBg: "#dc2626" }));
        const mappedToday = today.map(item => ({ ...item, status: "today", label: "Today", lineBg: "#2563eb" }));
        const mappedTomorrow = tomorrow.map(item => ({ ...item, status: "tomorrow", label: "Tomorrow", lineBg: "#7c3aed" }));
        const mappedUpcoming = upcoming.map(item => ({ ...item, status: "upcoming", label: "Upcoming", lineBg: "#059669" }));

        const combined = [...mappedOverdue, ...mappedToday, ...mappedTomorrow, ...mappedUpcoming];

        const seen = new Set();
        return combined.filter(item => {
            if (!item.followup_id) return true;
            if (seen.has(item.followup_id)) return false;
            seen.add(item.followup_id);
            return true;
        });
    }, [remindersData]);






    // console.log("summaryItems:", summaryItems);


    const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);

    const [documents, setDocuments] = useState({
        bankDetails: null,
        resume: null,
        aadhar: null,
        otherUploads: null,
    });

    const handleFileUpload = (docType, e) => {
        const file = e.target.files[0];
        if (!file) return;
        setDocuments(prev => ({
            ...prev,
            [docType]: {
                name: file.name,
                size: (file.size / 1024).toFixed(1) + " KB",
                url: URL.createObjectURL(file)
            }
        }));
        successNotify(`${docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} uploaded successfully!`);
    };

    const handleFileDelete = (docType) => {
        setDocuments(prev => ({
            ...prev,
            [docType]: null
        }));
        successNotify(`${docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} removed.`);
    };

    // Dynamic Interactive Calendar state (Defaulting to current local date)
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Mixed Chart Date selectors state
    const [startDate, setStartDate] = useState("2026-06-01");
    const [endDate, setEndDate] = useState("2026-06-30");

    // Month Names mapping
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Calendar Helper Utilities
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Map Sunday to index 6, Monday to index 0 for ISO grid starting Monday
    };

    const handlePrevMonth = () => {
        setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    };

    const formatDateKey = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    // Calendar & Tasks Database dynamically relative to the calendar date's month
    const getActiveEvents = (date) => {
        const dateKey = formatDateKey(date);

        return allReminders.filter(item => {
            if (!item.next_followup_date) return false;
            const followupDate = new Date(item.next_followup_date);
            return formatDateKey(followupDate) === dateKey;
        }).map(item => {
            const timeStr = item.next_followup_date
                ? new Date(item.next_followup_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                : "N/A";

            return {
                time: timeStr,
                title: item.customer_name || "Unknown Customer",
                desc: `Model: ${item.model || "N/A"} • Reg: ${item.registration_number || "N/A"}${item.remarks ? ` • ${item.remarks}` : ""}`,
                lineBg: item.lineBg || "#7c3aed",
                customer_name: item.customer_name,
                model: item.model,
                registration_number: item.registration_number,
                remarks: item.remarks,
                mobile_number_1: item.mobile_number_1,
                mobile_number_2: item.mobile_number_2,
                status: item.status,
                label: item.label
            };
        });
    };

    const activeEvents = getActiveEvents(selectedDate);


    // Calculate sum of metrics
    const getSummaryMetrics = () => {
        if (!performanceData || !performanceData.chartData) {
            return { calls: 0, appointments: 0, callbacks: 0 };
        }
        return performanceData.chartData.reduce(
            (acc, item) => ({
                calls: acc.calls + (item.calls || 0),
                appointments: acc.appointments + (item.appointments || 0),
                callbacks: acc.callbacks + (item.callbacks || 0),
            }),
            { calls: 0, appointments: 0, callbacks: 0 }
        );
    };

    // Format join date
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (e) {
            return dateStr;
        }
    };

    const getStatusStyle = (statusName) => {
        const name = statusName.toUpperCase();
        if (name.includes("NEW")) return { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.08)" };
        if (name.includes("CALLBACK")) return { color: "#ea580c", bg: "rgba(234, 88, 12, 0.08)" };
        if (name.includes("QUOTE")) return { color: "#6366f1", bg: "rgba(99, 102, 241, 0.08)" };
        if (name.includes("APPOINMENT") || name.includes("APPOINTMENT")) return { color: "#a855f7", bg: "rgba(168, 85, 247, 0.08)" };
        if (name.includes("SOLD")) return { color: "#10b981", bg: "rgba(16, 185, 129, 0.08)" };
        return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.08)" };
    };

    const metricsSummary = getSummaryMetrics();

    const perfRecord = performanceData && performanceData.length > 0 ? performanceData[0] : null;

    // Map DB values to template attributes with Call Center profession fallbacks
    const displayEmployee = employee ? {
        employee_id: employee.employee_id,
        name: employee.name || "-",
        role: employee.role_name || "-",
        company: employee.company_name || "-",
        mobile: employee.mobile_number_1 || "-",
        email: employee.email || "-",
        gender: (perfRecord && perfRecord.gender) || "-",
        dob: (perfRecord && perfRecord.age ? `${perfRecord.age} years old` : null) || "-",
        address: "-",
        joining: formatDate(employee.date_of_join),
        calls: metricsSummary.calls || 0,
        appointments: metricsSummary.appointments || 0,
        attendance: "-",
        leads: metricsSummary.callbacks || 0,
        sold: 0,
    } : null

    // role_name,company_name
    // Helper color schemas for visual capsules
    const getColorStyles = (color) => {
        const schemas = {
            blue: { bg: "rgba(59, 130, 246, 0.04)", iconBg: "rgba(59, 130, 246, 0.12)", iconColor: "#2563eb", border: "rgba(59, 130, 246, 0.15)" },
            indigo: { bg: "rgba(99, 102, 241, 0.04)", iconBg: "rgba(99, 102, 241, 0.12)", iconColor: "#4f46e5", border: "rgba(99, 102, 241, 0.15)" },
            teal: { bg: "rgba(20, 184, 166, 0.04)", iconBg: "rgba(20, 184, 166, 0.12)", iconColor: "#0d9488", border: "rgba(20, 184, 166, 0.15)" },
            orange: { bg: "rgba(249, 115, 22, 0.04)", iconBg: "rgba(249, 115, 22, 0.12)", iconColor: "#ea580c", border: "rgba(249, 115, 22, 0.15)" },
            amber: { bg: "rgba(245, 158, 11, 0.04)", iconBg: "rgba(245, 158, 11, 0.12)", iconColor: "#d97706", border: "rgba(245, 158, 11, 0.15)" },
            warning: { bg: "rgba(234, 179, 8, 0.04)", iconBg: "rgba(234, 179, 8, 0.12)", iconColor: "#ca8a04", border: "rgba(234, 179, 8, 0.15)" },
        };
        return schemas[color] || schemas.blue;
    };

    const handleCopyToClipboard = (text, fieldName) => {
        if (!text) return;
        navigator.clipboard.writeText(text)
            .then(() => successNotify(`${fieldName} copied to clipboard!`))
            .catch(() => errorNotify(`Failed to copy ${fieldName}`));
    };

    const InfoRow = ({ icon, label, value, color = "blue", copyable = false }) => {
        const theme = getColorStyles(color);
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: "16px",
                    bgcolor: "rgba(248, 250, 252, 0.6)",
                    border: "1px solid rgba(0, 0, 0, 0.03)",
                    gap: 1.5,
                    transition: "all 0.25s ease",
                    "&:hover": {
                        transform: "translateY(-2px)",
                        borderColor: theme.iconColor,
                        bgcolor: "#ffffff",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.02)"
                    }
                }}
            >
                <Avatar variant="soft" sx={{ width: 36, height: 36, bgcolor: theme.iconBg, color: theme.iconColor, borderRadius: "10px" }}>
                    {icon}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography level="body-xs" sx={{ color: "neutral.500", fontWeight: 800, fontSize: "9.5px", textTransform: "uppercase", letterSpacing: "0.2px" }}>{label}</Typography>
                    <Typography fontWeight={700} noWrap sx={{ color: "#1e1b4b", fontSize: "12.5px" }}>{value}</Typography>
                </Box>
                {copyable && (
                    <IconButton
                        size="sm"
                        variant="plain"
                        onClick={() => handleCopyToClipboard(value, label)}
                        sx={{
                            color: "neutral.400",
                            "&:hover": { color: theme.iconColor, bgcolor: "rgba(0,0,0,0.02)" },
                            borderRadius: "50%"
                        }}
                    >
                        <ContentCopy sx={{ fontSize: 13 }} />
                    </IconButton>
                )}
            </Box>
        );
    };

    if (loadingEmp) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flexDirection: "column", gap: 2 }}>
                <CircularProgress size="lg" />
                <Typography level="body-sm" color="neutral">Loading staff profile dashboard...</Typography>
            </Box>
        );
    }

    if (!displayEmployee) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", flexDirection: "column", gap: 2, p: 3 }}>
                <Typography level="h4" color="danger">Staff Profile Not Found</Typography>
                <Button variant="outlined" startDecorator={<ArrowBack />} onClick={() => navigate(-1)}>Back</Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                p: { xs: 2.5, md: 4.5 },
                display: "flex",
                flexDirection: "column",
                gap: 4,
                bgcolor: "#f8fafc",
                fontFamily: "'Outfit', 'Inter', sans-serif",
                overflowX: "hidden"
            }}
        >
            {/* Header Back Button */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                    startDecorator={<ArrowBack />}
                    variant="plain"
                    color="neutral"
                    sx={{
                        borderRadius: "12px",
                        fontWeight: 700,
                        bgcolor: "#ffffff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                        border: "1px solid rgba(0,0,0,0.04)",
                        "&:hover": { bgcolor: "neutral.50" }
                    }}
                    onClick={() => navigate(-1)}
                >
                    Back to Directory
                </Button>
            </Box>

            {/* Top Row: Dynamic Stats Cards */}
            <Grid container spacing={2.5}>
                {TotalCount.map((item, idx) => {
                    const style = getStatusStyle(item.status_name);
                    return (
                        <Grid key={idx} xs={12} sm={4} md={2}>
                            <Card
                                sx={{
                                    p: 2.5,
                                    borderRadius: "20px",
                                    bgcolor: "white",
                                    border: "1px solid rgba(0,0,0,0.02)",
                                    borderLeft: `6px solid ${style.color}`,
                                    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.015)",
                                    position: "relative",
                                    overflow: "hidden",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: `0 10px 25px rgba(15, 23, 42, 0.06)`
                                    }
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                        {item.status_name}
                                    </Typography>
                                    <Avatar size="sm" sx={{ bgcolor: style.bg, color: style.color, width: 24, height: 24 }}>
                                        <NorthEast sx={{ fontSize: 11 }} />
                                    </Avatar>
                                </Box>
                                <Typography level="h2" sx={{ fontWeight: 950, color: "#1e1b4b", mt: 1.5, fontSize: "26px", fontFamily: "monospace" }}>
                                    {item.total_count}
                                </Typography>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Row 2: Profile Widget (Left) + Overall Performance (Middle) + Calendar Widget (Right) */}
            <Grid container spacing={3.5} sx={{ mb: 3.5 }}>
                {/* Profile Widget Card with overlay banner */}
                <Grid xs={12} md={3.5}>
                    <Card
                        sx={{
                            p: 0,
                            borderRadius: "24px",
                            overflow: "hidden",
                            border: "1px solid rgba(0,0,0,0.02)",
                            boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                            height: "100%"
                        }}
                    >
                        <Box sx={{ position: "relative", width: "100%" }}>
                            {/* Creative visual gradient header banner */}
                            <Box
                                sx={{
                                    height: "170px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
                                    position: "relative"
                                }}
                            >
                                {/* Low opacity abstract sphere watermark */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        width: 140,
                                        height: 140,
                                        borderRadius: "50%",
                                        background: "rgba(255, 255, 255, 0.08)",
                                        top: -20,
                                        right: -20
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        background: "rgba(255, 255, 255, 0.04)",
                                        bottom: 10,
                                        left: 20
                                    }}
                                />
                            </Box>

                            {/* Overlapping Avatar with white frame ring */}
                            <Avatar
                                sx={{
                                    width: 90,
                                    height: 90,
                                    border: "4px solid #ffffff",
                                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.1)",
                                    position: "absolute",
                                    bottom: "-45px",
                                    left: "24px",
                                    zIndex: 2,
                                    bgcolor: "#e0e7ff",
                                    color: "#4f46e5",
                                    fontSize: "32px",
                                    fontWeight: 800
                                }}
                            >
                                {displayEmployee.name.charAt(0)}
                            </Avatar>
                        </Box>

                        {/* Info Section with padding-top layout offset for Avatar overlap */}
                        <Box sx={{ pt: 7.5, px: 3, pb: 3.5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                <Box sx={{ minWidth: 0, pr: 2 }}>
                                    <Typography level="title-lg" sx={{ fontWeight: 900, color: "#1e1b4b" }} noWrap>
                                        {displayEmployee.name}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                        {/* <Typography level="body-xs" sx={{ color: "#7c3aed", fontWeight: 800 }} noWrap>
                                            {displayEmployee.role}
                                        </Typography> */}
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            sx={{
                                                fontSize: "10px",
                                                fontWeight: 800,
                                                bgcolor: "rgba(124, 58, 237, 0.08)",
                                                color: "#7c3aed",
                                                px: 1,
                                                py: 0.25,
                                                borderRadius: "6px"
                                            }}
                                        >
                                            #{displayEmployee.employee_id}
                                        </Chip>
                                    </Box>
                                </Box>

                                {/* Action Buttons Capsule */}
                                <Stack direction="row" spacing={1.2}>
                                    <IconButton
                                        size="sm"
                                        variant="outlined"
                                        onClick={() => {
                                            window.open(`mailto:${displayEmployee.email}`);
                                            successNotify("Opening email client...");
                                        }}
                                        sx={{
                                            borderRadius: "50%",
                                            width: "36px",
                                            height: "36px",
                                            borderColor: "rgba(99, 102, 241, 0.15)",
                                            color: "#4f46e5",
                                            bgcolor: "rgba(99, 102, 241, 0.02)",
                                            transition: "0.2s",
                                            "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)", transform: "scale(1.08)" }
                                        }}
                                    >
                                        <Email sx={{ fontSize: 15 }} />
                                    </IconButton>
                                    <IconButton
                                        size="sm"
                                        variant="outlined"
                                        onClick={() => {
                                            window.open(`tel:${displayEmployee.mobile}`);
                                            successNotify("Calling mobile number...");
                                        }}
                                        sx={{
                                            borderRadius: "50%",
                                            width: "36px",
                                            height: "36px",
                                            borderColor: "rgba(99, 102, 241, 0.15)",
                                            color: "#4f46e5",
                                            bgcolor: "rgba(99, 102, 241, 0.02)",
                                            transition: "0.2s",
                                            "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)", transform: "scale(1.08)" }
                                        }}
                                    >
                                        <Call sx={{ fontSize: 15 }} />
                                    </IconButton>
                                </Stack>
                            </Box>
                            <Divider sx={{ mb: 2, opacity: 0.6 }} />
                            <Stack spacing={1.5}>

                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography level="body-xs" sx={{ color: "neutral.500", fontWeight: 700 }}>Worksite Location</Typography>
                                    <Typography level="body-xs" sx={{ color: "#1e1b4b", fontWeight: 800 }}>{displayEmployee.company}</Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                {/* Overall Performance Card Widget */}
                <Grid xs={12} md={4.5}>
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: "24px",
                            bgcolor: "white",
                            border: "1px solid rgba(0,0,0,0.02)",
                            boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}
                    >
                        <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b" }}>
                                    Overall Performance
                                </Typography>
                                <Avatar size="sm" sx={{ bgcolor: "rgba(124, 58, 237, 0.08)", color: "#7c3aed", width: 28, height: 28 }}>
                                    <StarIcon style={{ fontSize: 15 }} />
                                </Avatar>
                            </Box>

                            <Stack spacing={2}>
                                {/* Rating Star Panel */}
                                <Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                        <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", fontSize: "9px" }}>
                                            Call Quality Score
                                        </Typography>
                                        <Typography level="body-xs" sx={{ color: "#7c3aed", fontWeight: 900 }}>
                                            4.8 / 5.0
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", gap: "3px" }}>
                                        {[1, 2, 3, 4].map((i) => (
                                            <StarIcon key={i} style={{ color: "#eab308", fontSize: 15 }} />
                                        ))}
                                        <StarHalfIcon style={{ color: "#eab308", fontSize: 15 }} />
                                    </Box>
                                </Box>

                                {/* Conversion Rate progress */}
                                <Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", fontSize: "9px" }}>
                                            Lead Conversion Rate
                                        </Typography>
                                        <Typography level="body-xs" sx={{ color: "#10b981", fontWeight: 900 }}>
                                            17.5%
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: "100%", height: "6px", bgcolor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                                        <Box sx={{ width: "85%", height: "100%", bgcolor: "#10b981", borderRadius: "3px" }} />
                                    </Box>
                                </Box>

                                {/* Sales Target Achieved */}
                                <Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", fontSize: "9px" }}>
                                            Monthly Sales Target
                                        </Typography>
                                        <Typography level="body-xs" sx={{ color: "#3b82f6", fontWeight: 900 }}>
                                            92.5% (37 / 40)
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: "100%", height: "6px", bgcolor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                                        <Box sx={{ width: "92.5%", height: "100%", bgcolor: "#3b82f6", borderRadius: "3px" }} />
                                    </Box>
                                </Box>

                                {/* Attendance Rate */}
                                <Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", fontSize: "9px" }}>
                                            Attendance Consistency
                                        </Typography>
                                        <Typography level="body-xs" sx={{ color: "#ea580c", fontWeight: 900 }}>
                                            {displayEmployee.attendance}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ width: "100%", height: "6px", bgcolor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                                        <Box sx={{ width: "96%", height: "100%", bgcolor: "#ea580c", borderRadius: "3px" }} />
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                {/* Calendar Widget Card */}
                <Grid xs={12} md={4}>
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: "24px",
                            bgcolor: "white",
                            border: "1px solid rgba(0,0,0,0.02)",
                            boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                            height: "100%"
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <IconButton size="sm" variant="plain" onClick={handlePrevMonth} sx={{ borderRadius: "50%", "&:hover": { bgcolor: "neutral.50" } }}>
                                <ChevronLeft sx={{ fontSize: 18 }} />
                            </IconButton>
                            <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b", fontSize: "16px" }}>
                                {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                            </Typography>
                            <IconButton size="sm" variant="plain" onClick={handleNextMonth} sx={{ borderRadius: "50%", "&:hover": { bgcolor: "neutral.50" } }}>
                                <ChevronRight sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Stack>

                        {/* Weekday titles */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", mb: 1.5, pb: 1, borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                                <Typography key={i} level="body-xs" sx={{ color: "neutral.400", fontWeight: 800, fontSize: "11px" }}>
                                    {d}
                                </Typography>
                            ))}
                        </Box>

                        {/* Dynamic Grid */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: "10px", textAlign: "center" }}>
                            {(() => {
                                const year = calendarDate.getFullYear();
                                const month = calendarDate.getMonth();
                                const daysInMonth = getDaysInMonth(year, month);
                                const firstDayIndex = getFirstDayOfMonth(year, month);
                                const cells = [];

                                // Offset empty cells
                                for (let i = 0; i < firstDayIndex; i++) {
                                    cells.push(<Box key={`empty-${i}`} sx={{ height: "30px" }} />);
                                }

                                // Actual day cells
                                for (let day = 1; day <= daysInMonth; day++) {
                                    const currentDayDate = new Date(year, month, day);
                                    const dateKey = formatDateKey(currentDayDate);
                                    const isSelected = formatDateKey(selectedDate) === dateKey;
                                    const dayEvents = getActiveEvents(currentDayDate);
                                    const hasEvents = dayEvents.length > 0;

                                    // Highlight today with outline border
                                    const isToday = formatDateKey(new Date()) === dateKey;

                                    cells.push(
                                        <Box
                                            key={`day-${day}`}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                position: "relative",
                                                height: "30px"
                                            }}
                                        >
                                            <Box
                                                onClick={() => setSelectedDate(currentDayDate)}
                                                sx={{
                                                    width: "30px",
                                                    height: "30px",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: isSelected
                                                        ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                                                        : hasEvents
                                                            ? (dayEvents[0].lineBg ? `${dayEvents[0].lineBg}1f` : "rgba(124, 58, 237, 0.12)")
                                                            : "transparent",
                                                    color: isSelected
                                                        ? "white"
                                                        : hasEvents
                                                            ? (dayEvents[0].lineBg || "#7c3aed")
                                                            : "#1e1b4b",
                                                    border: isToday && !isSelected ? "2px solid #7c3aed" : "2px solid transparent",
                                                    fontWeight: isSelected || isToday || hasEvents ? 900 : 600,
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease",
                                                    boxShadow: isSelected ? "0 4px 12px rgba(124, 58, 237, 0.25)" : "none",
                                                    "&:hover": {
                                                        background: isSelected
                                                            ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                                                            : hasEvents
                                                                ? `${dayEvents[0].lineBg || "#7c3aed"}33`
                                                                : "rgba(124, 58, 237, 0.06)",
                                                        transform: "scale(1.05)"
                                                    }
                                                }}
                                            >
                                                {day}
                                            </Box>
                                            {hasEvents && !isSelected && (
                                                <Box sx={{ display: "flex", gap: "2px", position: "absolute", bottom: "-1px" }}>
                                                    {dayEvents.slice(0, 3).map((e, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                width: 4,
                                                                height: 4,
                                                                borderRadius: "50%",
                                                                bgcolor: e.lineBg || "#7c3aed"
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                }
                                return cells;
                            })()}
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Row 3: Log In/Out Times (Left) + Tasks & Events Timeline (Right) */}
            <Grid container spacing={3.5} sx={{ mb: 3.5 }}>
                {/* Scrollable Log In & Log Out Times Card */}
                <Grid xs={12} md={4}>
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: "24px",
                            bgcolor: "white",
                            border: "1px solid rgba(0,0,0,0.02)",
                            boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                            height: "100%"
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
                            <Box>
                                <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b" }}>
                                    Attendance Session
                                </Typography>
                            </Box>
                            <input
                                type="date"
                                value={attendanceDate}
                                onChange={(e) => setAttendanceDate(e.target.value)}
                                style={{
                                    border: "1px solid rgba(0,0,0,0.08)",
                                    background: "#f8fafc",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    color: "#1e1b4b",
                                    fontFamily: "inherit",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            />
                        </Box>

                        {loadingAttendance ? (
                            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                                <CircularProgress size="sm" />
                            </Box>
                        ) : attendanceData ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {/* Check In / Out Cards */}
                                <Grid container spacing={2}>
                                    <Grid xs={6}>
                                        <Box sx={{ p: 2, borderRadius: "16px", bgcolor: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.12)", textAlign: "center" }}>
                                            <Typography level="body-xs" sx={{ color: "success.700", fontWeight: 800, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.2px" }}>First Log In</Typography>
                                            <Typography level="title-md" sx={{ fontWeight: 900, color: "#10b981", fontFamily: "monospace", mt: 1, fontSize: "14px" }}>
                                                {attendanceData.first_login ? new Date(attendanceData.first_login).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid xs={6}>
                                        <Box sx={{ p: 2, borderRadius: "16px", bgcolor: "rgba(249, 115, 22, 0.04)", border: "1px solid rgba(249, 115, 22, 0.12)", textAlign: "center" }}>
                                            <Typography level="body-xs" sx={{ color: "orange.700", fontWeight: 800, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.2px" }}>Last Log Out</Typography>
                                            <Typography level="title-md" sx={{ fontWeight: 900, color: "#ea580c", fontFamily: "monospace", mt: 1, fontSize: "14px" }}>
                                                {attendanceData.last_logout ? new Date(attendanceData.last_logout).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Productivity hours */}
                                <Box sx={{ p: 2, borderRadius: "16px", bgcolor: "rgba(59, 130, 246, 0.04)", border: "1px solid rgba(59, 130, 246, 0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Box>
                                        <Typography level="body-xs" sx={{ color: "primary.700", fontWeight: 800, textTransform: "uppercase", fontSize: "10px", letterSpacing: "0.2px" }}>Productivity</Typography>
                                        <Typography level="title-sm" sx={{ fontWeight: 800, color: "#1e1b4b", mt: 0.5 }}>Total Hours Logged</Typography>
                                    </Box>
                                    <Typography level="h3" sx={{ fontWeight: 900, color: "#2563eb", fontFamily: "monospace", fontSize: "18px" }}>
                                        {attendanceData.total_productivity_hours ? `${Number(attendanceData.total_productivity_hours).toFixed(2)} Hrs` : "0.00 Hrs"}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: "18px",
                                    bgcolor: "rgba(241, 245, 249, 0.5)",
                                    border: "1px dashed rgba(0,0,0,0.1)",
                                    textAlign: "center"
                                }}
                            >
                                <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700 }}>
                                    No attendance records found for this date.
                                </Typography>
                            </Box>
                        )}
                    </Card>
                </Grid>

                {/* Tasks & Events Timeline list */}
                <Grid xs={12} md={8}>
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: "24px",
                            bgcolor: "white",
                            border: "1px solid rgba(0,0,0,0.02)",
                            boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                            height: "100%"
                        }}
                    >
                        <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b", mb: 2.5 }}>
                            Tasks & Events ({selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                        </Typography>

                        {activeEvents.length > 0 ? (
                            <Stack spacing={2}>
                                {activeEvents.map((evt, idx) => (
                                    <Box
                                        key={idx}
                                        sx={{
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            alignItems: { xs: "flex-start", sm: "center" },
                                            justifyContent: "space-between",
                                            p: { xs: 2, sm: 2.5 },
                                            borderRadius: "20px",
                                            bgcolor: "#ffffff",
                                            border: "1px solid rgba(0,0,0,0.05)",
                                            borderLeft: `6px solid ${evt.lineBg}`,
                                            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.01)",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            gap: 2,
                                            position: "relative",
                                            "&:hover": {
                                                transform: "translateY(-3px)",
                                                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
                                                borderColor: "rgba(0,0,0,0.08)",
                                                background: `linear-gradient(90deg, #ffffff 0%, ${evt.lineBg}04 100%)`
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0, pr: { xs: 10, sm: 0 } }}>
                                            <Avatar
                                                variant="soft"
                                                sx={{
                                                    width: { xs: 40, sm: 48 },
                                                    height: { xs: 40, sm: 48 },
                                                    bgcolor: `${evt.lineBg}1a`,
                                                    color: evt.lineBg,
                                                    fontWeight: 800,
                                                    fontSize: { xs: "15px", sm: "18px" },
                                                    borderRadius: "14px"
                                                }}
                                            >
                                                {evt.title.charAt(0)}
                                            </Avatar>

                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                                    <Typography level="title-sm" sx={{ fontWeight: 800, color: "#1e1b4b", fontSize: { xs: "13px", sm: "14px" } }}>
                                                        {evt.title}
                                                    </Typography>
                                                    <Chip
                                                        size="sm"
                                                        variant="soft"
                                                        sx={{
                                                            bgcolor: `${evt.lineBg}1f`,
                                                            color: evt.lineBg,
                                                            fontWeight: 800,
                                                            fontSize: { xs: "9px", sm: "11px" },
                                                            borderRadius: "8px"
                                                        }}
                                                    >
                                                        {evt.label}
                                                    </Chip>
                                                </Box>

                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1, flexWrap: "wrap" }}>
                                                    <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, fontSize: { xs: "11px", sm: "12px" } }}>
                                                        <strong>Model:</strong> {evt.model || "N/A"}
                                                    </Typography>
                                                    <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, fontSize: { xs: "11px", sm: "12px" } }}>
                                                        <strong>Reg:</strong> {evt.registration_number || "N/A"}
                                                    </Typography>
                                                </Box>

                                                {evt.remarks && (
                                                    <Box
                                                        sx={{
                                                            mt: 1.5,
                                                            p: 1.25,
                                                            bgcolor: "#f8fafc",
                                                            borderRadius: "10px",
                                                            borderLeft: `3px solid ${evt.lineBg}`,
                                                            maxWidth: "100%"
                                                        }}
                                                    >
                                                        <Typography level="body-xs" sx={{ color: "neutral.600", fontStyle: "italic", fontWeight: 650, fontSize: { xs: "11px", sm: "12px" } }}>
                                                            "{evt.remarks}"
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{
                                                position: { xs: "absolute", sm: "static" },
                                                top: { xs: 16, sm: "auto" },
                                                right: { xs: 16, sm: "auto" },
                                                display: "flex",
                                                alignItems: "center"
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, bgcolor: "#f1f5f9", px: { xs: 1, sm: 1.5 }, py: 0.5, borderRadius: "8px" }}>
                                                <AccessTimeIcon style={{ fontSize: 13, color: "#64748b" }} />
                                                <Typography level="body-xs" sx={{ fontWeight: 800, color: "#475569", fontFamily: "monospace", fontSize: { xs: "10px", sm: "12px" } }}>
                                                    {evt.time}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Box sx={{ py: 6, textAlign: "center", bgcolor: "#f8fafc", borderRadius: "20px", border: "1px dashed rgba(0,0,0,0.08)" }}>
                                <Typography level="body-xs" sx={{ color: "neutral.500", fontWeight: 700 }}>
                                    No tasks or events scheduled for this day
                                </Typography>
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>

            {/* Collapsible Details Drawer at the bottom for CRM data completeness */}
            <Card
                sx={{
                    p: 3,
                    borderRadius: "24px",
                    bgcolor: "white",
                    border: "1px solid rgba(0,0,0,0.02)",
                    boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                    mt: 3.5
                }}
            >
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b" }}>
                            Personal & Company Information Details
                        </Typography>

                    </Box>
                    <Button
                        variant="soft"
                        color="neutral"
                        onClick={() => setDetailsPanelOpen(!detailsPanelOpen)}
                        endDecorator={detailsPanelOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        sx={{
                            borderRadius: "12px",
                            fontWeight: 800,
                            bgcolor: "rgba(0,0,0,0.03)",
                            color: "neutral.700",
                            px: 2.2,
                            py: 1,
                            width: { xs: "100%", sm: "auto" },
                            transition: "0.2s",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.06)" }
                        }}
                    >
                        {detailsPanelOpen ? "Hide Details" : "Show Details"}
                    </Button>
                </Stack>

                {detailsPanelOpen && (
                    <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }} sx={{ mt: 0, pt: 1 }}>
                        {/* Personal Information */}
                        <Grid xs={12} sm={6} md={4}>
                            <Box sx={{ p: 1, borderRadius: "18px", bgcolor: "#f8fafc", border: "1px solid rgba(0,0,0,0.01)" }}>
                                <Typography level="title-sm" sx={{ fontWeight: 900, color: "#1e1b4b", display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
                                    <Person sx={{ color: "#4f46e5", fontSize: 20 }} />
                                    Personal Information
                                </Typography>
                                <Divider sx={{ mb: 1, opacity: 0.6 }} />
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                        gap: 2
                                    }}
                                >
                                    <InfoRow icon={<Badge />} label="Employee ID" value={displayEmployee.employee_id} color="blue" />
                                    <InfoRow icon={<Person />} label="Gender" value={displayEmployee.gender} color="indigo" />
                                    <InfoRow icon={<PhoneAndroid />} label="Mobile" value={displayEmployee.mobile} color="teal" copyable={true} />
                                    <InfoRow icon={<Email />} label="Email" value={displayEmployee.email} color="blue" copyable={true} />
                                    <InfoRow icon={<CalendarMonth />} label="Date of Birth" value={displayEmployee.dob} color="orange" />
                                    <InfoRow icon={<LocationOn />} label="Address" value={displayEmployee.address} color="amber" />
                                </Box>
                            </Box>
                        </Grid>

                        {/* Company Information */}
                        <Grid xs={12} sm={6} md={4}>
                            <Box sx={{ p: 1, borderRadius: "18px", bgcolor: "#f8fafc", border: "1px solid rgba(0,0,0,0.01)" }}>
                                <Typography level="title-sm" sx={{ fontWeight: 900, color: "#1e1b4b", display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
                                    <Business sx={{ color: "#ea580c", fontSize: 20 }} />
                                    Company Information
                                </Typography>
                                <Divider sx={{ mb: 2, opacity: 0.6 }} />
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                        gap: 2
                                    }}
                                >
                                    <InfoRow icon={<Business />} label="Company" value={displayEmployee.company} color="blue" />
                                    <InfoRow icon={<Work />} label="Designation" value={displayEmployee.role} color="teal" />
                                    <InfoRow icon={<CalendarMonth />} label="Joining Date" value={displayEmployee.joining} color="blue" />
                                </Box>
                            </Box>
                        </Grid>

                        {/* Document Uploads */}
                        <Grid xs={12} sm={12} md={4}>
                            <Box sx={{ p: 1, borderRadius: "18px", bgcolor: "#f8fafc", border: "1px solid rgba(0,0,0,0.01)", height: "100%", display: "flex", flexDirection: "column" }}>
                                <Typography level="title-sm" sx={{ fontWeight: 900, color: "#1e1b4b", display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
                                    <CloudUploadIcon sx={{ color: "#2563eb", fontSize: 20 }} />
                                    Document Uploads
                                </Typography>
                                <Divider sx={{ mb: 2, opacity: 0.6 }} />

                                <Stack spacing={2} sx={{ flex: 1 }}>
                                    {["bankDetails", "resume", "aadhar", "otherUploads"].map((docType) => {
                                        const doc = documents[docType];
                                        const labelMap = {
                                            bankDetails: { label: "Bank Details", icon: <AccountBalanceIcon sx={{ color: "#3b82f6" }} /> },
                                            resume: { label: "Resume", icon: <ResumeIcon sx={{ color: "#a855f7" }} /> },
                                            aadhar: { label: "Aadhar Card", icon: <AadharIcon sx={{ color: "#10b981" }} /> },
                                            otherUploads: { label: "Other Uploads", icon: <CloudUploadIcon sx={{ color: "#f97316" }} /> }
                                        };
                                        const { label, icon } = labelMap[docType];

                                        return (
                                            <Box
                                                key={docType}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: "14px",
                                                    bgcolor: doc ? "rgba(16, 185, 129, 0.03)" : "rgba(248, 250, 252, 0.8)",
                                                    border: doc ? "1px solid rgba(16, 185, 129, 0.2)" : "1px dashed rgba(0, 0, 0, 0.08)",
                                                    transition: "all 0.25s ease",
                                                    "&:hover": {
                                                        borderColor: doc ? "rgba(16, 185, 129, 0.4)" : "#3b82f6",
                                                        bgcolor: doc ? "rgba(16, 185, 129, 0.05)" : "#ffffff",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                                                    }
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center", justifyItems: "space-between", gap: 1.5 }}>
                                                    <Avatar variant="soft" sx={{ width: 32, height: 32, bgcolor: "rgba(0,0,0,0.03)", borderRadius: "8px" }}>
                                                        {icon}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography level="body-xs" sx={{ fontWeight: 800, color: "#1e1b4b", fontSize: "11.5px" }}>
                                                            {label}
                                                        </Typography>
                                                        {doc ? (
                                                            <Typography level="body-xs" noWrap sx={{ color: "success.700", fontWeight: 700, mt: 0.25, fontSize: "10.5px" }}>
                                                                ✓ {doc.name} ({doc.size})
                                                            </Typography>
                                                        ) : (
                                                            <Typography level="body-xs" sx={{ color: "neutral.400", fontWeight: 650, mt: 0.25, fontSize: "10.5px" }}>
                                                                No document uploaded
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    {doc ? (
                                                        <Stack direction="row" spacing={0.5}>
                                                            <Button
                                                                size="sm"
                                                                variant="plain"
                                                                color="primary"
                                                                onClick={() => window.open(doc.url, "_blank")}
                                                                sx={{ minWidth: 0, px: 1, height: 28, borderRadius: "6px", fontSize: "11px", fontWeight: 800 }}
                                                            >
                                                                View
                                                            </Button>
                                                            <IconButton
                                                                size="sm"
                                                                variant="plain"
                                                                color="danger"
                                                                onClick={() => handleFileDelete(docType)}
                                                                sx={{ width: 28, height: 28, borderRadius: "6px" }}
                                                            >
                                                                <DeleteOutlineIcon style={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Stack>
                                                    ) : (
                                                        <Button
                                                            component="label"
                                                            size="sm"
                                                            variant="soft"
                                                            color="primary"
                                                            startDecorator={<CloudUploadIcon style={{ fontSize: 13 }} />}
                                                            sx={{
                                                                borderRadius: "8px",
                                                                fontWeight: 800,
                                                                fontSize: "11px",
                                                                px: 1.5,
                                                                height: 28
                                                            }}
                                                        >
                                                            Upload
                                                            <input
                                                                type="file"
                                                                hidden
                                                                onChange={(e) => handleFileUpload(docType, e)}
                                                            />
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Card>

            {/* Call Center Performance mixed chart at the very bottom */}
            <Card
                sx={{
                    p: 3.5,
                    borderRadius: "24px",
                    bgcolor: "white",
                    border: "1px solid rgba(0,0,0,0.02)",
                    boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                    mt: 3.5
                }}
            >
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2.5} mb={3.5}>
                    <Box>
                        <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b" }}>
                            Call Center Performance Analytics
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, mt: 0.25 }}>
                            Mixed Chart: Leads, Appointments, Callbacks (Bar) & Sales Sold (Line)
                        </Typography>
                    </Box>

                    {/* Date Picker inputs */}
                    <Stack direction="row" spacing={2} alignItems="center" useFlexGap flexWrap="wrap">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#f8fafc", px: 1.5, py: 0.75, borderRadius: "10px", border: "1px solid rgba(0,0,0,0.03)" }}>
                            <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>From:</Typography>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    color: "#1e1b4b",
                                    fontFamily: "inherit",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#f8fafc", px: 1.5, py: 0.75, borderRadius: "10px", border: "1px solid rgba(0,0,0,0.03)" }}>
                            <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>To:</Typography>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    color: "#1e1b4b",
                                    fontFamily: "inherit",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            />
                        </Box>
                    </Stack>
                </Stack>

                {/* Legends */}
                <Stack direction="row" spacing={3} sx={{ mb: 3 }} justifyContent="center" useFlexGap flexWrap="wrap">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 12, height: 12, bgcolor: "#3b82f6", borderRadius: "3px" }} />
                        <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>Leads</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 12, height: 12, bgcolor: "#f97316", borderRadius: "3px" }} />
                        <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>Appointments</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 12, height: 12, bgcolor: "#0d9488", borderRadius: "3px" }} />
                        <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>Callbacks</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 16, height: 4, bgcolor: "#6366f1", position: "relative", "&::after": { content: '""', position: "absolute", left: 6, top: -2, width: 4, height: 4, borderRadius: "50%", bgcolor: "#6366f1" } }} />
                        <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>Sold (Sales)</Typography>
                    </Stack>
                </Stack>

                {/* Responsive SVG Container */}
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                    <Box sx={{ minWidth: "600px", height: "300px", position: "relative" }}>
                        {(() => {
                            // Generate deterministic date-range chart details dynamically
                            const callCenterPerformance = [];
                            const start = new Date(startDate);
                            const end = new Date(endDate);

                            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
                                const diffTime = Math.abs(end - start);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                // Adjust tick spacing dynamically to prevent text collision
                                let step = 1;
                                if (diffDays > 45) step = 7; // Show weekly data points
                                else if (diffDays > 25) step = 4;
                                else if (diffDays > 14) step = 2;
                                else step = 1;

                                let currentDate = new Date(start);
                                while (currentDate <= end) {
                                    const dateStr = currentDate.toISOString().split('T')[0];
                                    const dayVal = currentDate.getDate();

                                    // Deterministic values seeded by the date + employeeId
                                    const seed = dayVal + currentDate.getMonth() + currentDate.getFullYear();
                                    const hash = (seed + Number(displayEmployee.employee_id || 1)) % 10;

                                    const leads = Math.round(14 + hash * 1.8);
                                    const appointments = Math.round(4 + (hash % 4) * 2.2);
                                    const callbacks = Math.round(6 + (hash % 5) * 1.6);
                                    const sold = Math.round(1 + (hash % 3) * 1.4);

                                    callCenterPerformance.push({
                                        date: dateStr,
                                        leads,
                                        appointments,
                                        callbacks,
                                        sold
                                    });

                                    currentDate.setDate(currentDate.getDate() + step);
                                }
                            }

                            const filteredData = callCenterPerformance;

                            if (filteredData.length === 0) {
                                return (
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                                        <Typography level="body-sm" color="neutral">
                                            No data available for the selected date range.
                                        </Typography>
                                    </Box>
                                );
                            }

                            // Chart scaling calculations
                            const padding = { top: 20, right: 30, bottom: 40, left: 40 };
                            const chartWidth = 700;
                            const chartHeight = 280;
                            const graphWidth = chartWidth - padding.left - padding.right;
                            const graphHeight = chartHeight - padding.top - padding.bottom;

                            // Max value logic to adjust Y axis
                            const maxVal = Math.max(
                                ...filteredData.map(d => Math.max(d.leads, d.appointments, d.callbacks, d.sold)),
                                10
                            ) * 1.15;

                            const getX = (index) => padding.left + (index / (filteredData.length - 1 || 1)) * graphWidth;
                            const getY = (val) => chartHeight - padding.bottom - (val / maxVal) * graphHeight;

                            // Generate Line Path points for Sold
                            const linePoints = filteredData.map((d, i) => `${getX(i)},${getY(d.sold)}`).join(" ");

                            return (
                                <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: "visible" }}>
                                    <defs>
                                        <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.15" />
                                        </linearGradient>
                                        <linearGradient id="apptsGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f97316" />
                                            <stop offset="100%" stopColor="#fdba74" stopOpacity="0.15" />
                                        </linearGradient>
                                        <linearGradient id="callbacksGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#0d9488" />
                                            <stop offset="100%" stopColor="#5eead4" stopOpacity="0.15" />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid Lines */}
                                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                        const yVal = maxVal * ratio;
                                        const y = getY(yVal);
                                        return (
                                            <g key={index}>
                                                <line
                                                    x1={padding.left}
                                                    y1={y}
                                                    x2={chartWidth - padding.right}
                                                    y2={y}
                                                    stroke="rgba(0,0,0,0.05)"
                                                    strokeWidth="1"
                                                    strokeDasharray="4 4"
                                                />
                                                <text
                                                    x={padding.left - 8}
                                                    y={y + 4}
                                                    textAnchor="end"
                                                    style={{ fontSize: "10px", fontWeight: 800, fill: "#94a3b8" }}
                                                >
                                                    {Math.round(yVal)}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* Bars (Leads, Appointments, Callbacks) */}
                                    {filteredData.map((d, index) => {
                                        const xCenter = getX(index);
                                        const barWidth = 10;
                                        const gap = 3;
                                        const leadsHeight = (d.leads / maxVal) * graphHeight;
                                        const apptsHeight = (d.appointments / maxVal) * graphHeight;
                                        const callbackHeight = (d.callbacks / maxVal) * graphHeight;

                                        return (
                                            <g key={index}>
                                                {/* Leads Bar */}
                                                <rect
                                                    x={xCenter - barWidth * 1.5 - gap}
                                                    y={getY(d.leads)}
                                                    width={barWidth}
                                                    height={leadsHeight}
                                                    fill="url(#leadsGrad)"
                                                    stroke="#3b82f6"
                                                    strokeWidth="1"
                                                    rx="2"
                                                />
                                                {/* Appointments Bar */}
                                                <rect
                                                    x={xCenter - barWidth * 0.5}
                                                    y={getY(d.appointments)}
                                                    width={barWidth}
                                                    height={apptsHeight}
                                                    fill="url(#apptsGrad)"
                                                    stroke="#f97316"
                                                    strokeWidth="1"
                                                    rx="2"
                                                />
                                                {/* Callbacks Bar */}
                                                <rect
                                                    x={xCenter + barWidth * 0.5 + gap}
                                                    y={getY(d.callbacks)}
                                                    width={barWidth}
                                                    height={callbackHeight}
                                                    fill="url(#callbacksGrad)"
                                                    stroke="#0d9488"
                                                    strokeWidth="1"
                                                    rx="2"
                                                />
                                                {/* X Axis Label */}
                                                <text
                                                    x={xCenter}
                                                    y={chartHeight - padding.bottom + 20}
                                                    textAnchor="middle"
                                                    style={{ fontSize: "10px", fontWeight: 800, fill: "#64748b" }}
                                                >
                                                    {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                </text>
                                            </g>
                                        );
                                    })}

                                    {/* Line Connection for Sold */}
                                    {filteredData.length > 1 && (
                                        <polyline
                                            fill="none"
                                            stroke="#6366f1"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            points={linePoints}
                                            style={{ filter: "drop-shadow(0px 4px 8px rgba(99, 102, 241, 0.35))" }}
                                        />
                                    )}

                                    {/* Line Points Dots */}
                                    {filteredData.map((d, index) => {
                                        const cx = getX(index);
                                        const cy = getY(d.sold);
                                        return (
                                            <g key={index}>
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r="5"
                                                    fill="#6366f1"
                                                    stroke="#ffffff"
                                                    strokeWidth="2"
                                                    style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }}
                                                />
                                                <text
                                                    x={cx}
                                                    y={cy - 10}
                                                    textAnchor="middle"
                                                    style={{ fontSize: "10px", fontWeight: 900, fill: "#4338ca" }}
                                                >
                                                    {d.sold}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            );
                        })()}
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};

// Simple mock video call icon to avoid extra import error
const VideoCallIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" />
    </svg>
);

const StarIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const StarHalfIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88.99 4.28L12 15.4z" />
    </svg>
);

const AccessTimeIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
);

const CloudUploadIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
    </svg>
);

const FilePresentIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
);

const DeleteOutlineIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
    </svg>
);

const AccountBalanceIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm18-9h3v7h-3zM12 2L2 7v2h20V7z" />
    </svg>
);

const ResumeIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2zm2-5H5c-1.11 0-2 .09-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
    </svg>
);

const AadharIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
);

export default EmployeeDetails;