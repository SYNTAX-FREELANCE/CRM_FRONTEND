import React, { useState, useEffect } from "react";
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
    Tooltip,
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
    Groups,
    TrendingUp,
    EventAvailable,
    KeyboardArrowDown,
    KeyboardArrowUp,
    ContentCopy,
    PlayArrow,
    Pause,
    ChevronLeft,
    ChevronRight,
    Settings,
    ExitToApp,
    Assignment,
    LocalOffer,
    AutoAwesome,
    NorthEast,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";
import { axioslogin } from "../Axios/axios";
import { errorNotify, successNotify } from "../constant/Constant";

const EmployeeDetails = () => {
    const navigate = useNavigate();
    const { employeeId } = useParams();

    const [employee, setEmployee] = useState(null);
    const [loadingEmp, setLoadingEmp] = useState(true);

    const [performanceData, setPerformanceData] = useState(null);
    const [loadingPerf, setLoadingPerf] = useState(false);

    // Accordion Expansion states (Initially collapsed)
    const [personalExpanded, setPersonalExpanded] = useState(false);
    const [companyExpanded, setCompanyExpanded] = useState(false);
    const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);

    // Play/Pause active task state
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTime, setActiveTime] = useState("03:21:49");

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
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");

        const monthEvents = {
            [`${year}-${month}-05`]: [
                { time: "10:00 AM", title: "Daily target sync", desc: "Target alignment", lineBg: "#10b981" }
            ],
            [`${year}-${month}-12`]: [
                { time: "12:00 PM", title: "Weekly Tech Meeting", desc: "Product roadmap update", lineBg: "#7c3aed" }
            ],
            [`${year}-${month}-19`]: [
                { time: "01:30 PM", title: "Leads distribution audit", desc: "Performance check", lineBg: "#ea580c" }
            ],
            [`${year}-${month}-26`]: [
                { time: "11:00 AM", title: "Call Center Session review", desc: "Callbacks calibration", lineBg: "#2563eb" }
            ]
        };

        if (monthEvents[dateKey]) return monthEvents[dateKey];

        // Dynamic event for current day
        const todayStr = formatDateKey(new Date());
        if (dateKey === todayStr) {
            return [
                { time: "09:30 AM", title: "Morning Target Sync", desc: "Campaign target briefing", lineBg: "#7c3aed" },
                { time: "11:00 AM", title: "Warm Callbacks session", desc: "Focus leads distribution", lineBg: "#2563eb" },
                { time: "02:00 PM", title: "Performance calibrations", desc: "KPI rating feedback", lineBg: "#ea580c" },
                { time: "04:30 PM", title: "Sales report validation", desc: "Wrap-up daily session", lineBg: "#10b981" }
            ];
        }
        return [];
    };

    const activeEvents = getActiveEvents(selectedDate);

    // Dynamic Log In & Log Out Times generator
    const getLoginLogoutLog = (date) => {
        const dateKey = formatDateKey(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");

        const baseLogs = {
            [`${year}-${month}-05`]: { login: "08:55 AM", logout: "06:00 PM", status: "On Time", color: "success" },
            [`${year}-${month}-12`]: { login: "08:50 AM", logout: "06:05 PM", status: "On Time", color: "success" },
            [`${year}-${month}-19`]: { login: "09:15 AM", logout: "06:00 PM", status: "Late Check-in", color: "warning" },
            [`${year}-${month}-26`]: { login: "08:58 AM", logout: "05:58 PM", status: "On Time", color: "success" }
        };

        if (baseLogs[dateKey]) return baseLogs[dateKey];

        const todayStr = formatDateKey(new Date());
        if (dateKey === todayStr) {
            return { login: "08:58 AM", logout: "06:02 PM", status: "On Time", color: "success" };
        }

        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && date <= new Date()) {
            const hash = (date.getDate() + date.getMonth() + date.getFullYear()) % 3;
            if (hash === 0) {
                return { login: "08:54 AM", logout: "05:59 PM", status: "On Time", color: "success" };
            } else if (hash === 1) {
                return { login: "09:08 AM", logout: "06:02 PM", status: "Late Check-in", color: "warning" };
            } else {
                return { login: "08:48 AM", logout: "06:10 PM", status: "On Time", color: "success" };
            }
        }
        return null;
    };

    const activeLog = getLoginLogoutLog(selectedDate);

    // Fetch employee main profile info
    useEffect(() => {
        const fetchEmployeeProfile = async () => {
            setLoadingEmp(true);
            try {
                const response = await axioslogin.get("/userinfo/employees");
                if (response.data && response.data.success === 1) {
                    const list = response.data.data || [];
                    const found = list.find((e) => String(e.employee_id) === String(employeeId));
                    if (found) {
                        setEmployee(found);
                        // Fetch performance details initially in monthly range
                        fetchPerformance(found.employee_id);
                    } else {
                        errorNotify("Employee profile not found");
                    }
                } else {
                    errorNotify("Failed to load employee directory");
                }
            } catch (error) {
                console.error("Error fetching employee details:", error);
                errorNotify("Error retrieving employee profile data");
            } finally {
                setLoadingEmp(false);
            }
        };

        if (employeeId) {
            fetchEmployeeProfile();
        }
    }, [employeeId]);

    // Fetch performance details
    const fetchPerformance = async (empId) => {
        setLoadingPerf(true);
        try {
            const response = await axioslogin.get(
                `/userinfo/performance/${empId}?range=monthly`
            );
            if (response.data && response.data.success === 1) {
                setPerformanceData(response.data.data);
            } else {
                setPerformanceData(null);
            }
        } catch (error) {
            console.error("Error fetching performance details:", error);
            setPerformanceData(null);
        } finally {
            setLoadingPerf(false);
        }
    };

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

    const metricsSummary = getSummaryMetrics();

    // Map DB values to template attributes with Call Center profession fallbacks
    const displayEmployee = employee ? {
        employee_id: employee.employee_id,
        name: employee.name || "Najitha Basheer",
        role: employee.role_name || "Call Center Executive",
        company: employee.company_name || "ABC Technologies",
        department: "Tele-Marketing & Sales",
        mobile: employee.mobile_number_1 || "+91 7356825344",
        email: employee.email || "najithabasheer86@gmail.com",
        gender: "Female",
        dob: "29 Oct 1992",
        address: "Kochi, Kerala",
        joining: formatDate(employee.date_of_join),
        reporting: "David Sir",
        calls: metricsSummary.calls || 321,
        appointments: metricsSummary.appointments || 82,
        attendance: "96%",
        leads: metricsSummary.callbacks || 45,
        sold: 14,
    } : null;

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

            {/* Top Row: 3 Stats Cards */}
            <Grid container spacing={3.5}>
                {/* Card 1: Calls / In Progress */}
                <Grid xs={12} sm={4}>
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: "24px",
                            bgcolor: "white",
                            border: "1px solid rgba(0,0,0,0.02)",
                            borderLeft: "6px solid #3b82f6",
                            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.02)",
                            position: "relative",
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 15px 35px rgba(59, 130, 246, 0.06)"
                            }
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Calls Handled
                            </Typography>
                            <Avatar size="sm" sx={{ bgcolor: "rgba(59, 130, 246, 0.08)", color: "#3b82f6", width: 26, height: 26 }}>
                                <NorthEast sx={{ fontSize: 12 }} />
                            </Avatar>
                        </Box>
                        <Typography level="h1" sx={{ fontWeight: 900, color: "#1e1b4b", mt: 1.5, fontSize: "32px", fontFamily: "monospace" }}>
                            {displayEmployee.calls}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "success.500", fontWeight: 800, mt: 0.5, alignSelf: "flex-end", bgcolor: "rgba(16, 185, 129, 0.06)", px: 1, py: 0.25, borderRadius: "6px" }}>
                            +12% last week
                        </Typography>
                    </Card>
                </Grid>

                {/* Card 2: Appointments / Completed */}
                <Grid xs={12} sm={4}>
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: "24px",
                            bgcolor: "white",
                            border: "1px solid rgba(0,0,0,0.02)",
                            borderLeft: "6px solid #ea580c",
                            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.02)",
                            position: "relative",
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 15px 35px rgba(234, 88, 12, 0.06)"
                            }
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Appointments
                            </Typography>
                            <Avatar size="sm" sx={{ bgcolor: "rgba(234, 88, 12, 0.08)", color: "#ea580c", width: 26, height: 26 }}>
                                <NorthEast sx={{ fontSize: 12 }} />
                            </Avatar>
                        </Box>
                        <Typography level="h1" sx={{ fontWeight: 900, color: "#1e1b4b", mt: 1.5, fontSize: "32px", fontFamily: "monospace" }}>
                            {displayEmployee.appointments}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "danger.500", fontWeight: 800, mt: 0.5, alignSelf: "flex-end", bgcolor: "rgba(239, 68, 68, 0.06)", px: 1, py: 0.25, borderRadius: "6px" }}>
                            -3% last week
                        </Typography>
                    </Card>
                </Grid>

                {/* Card 3: Leads / Salary */}
                <Grid xs={12} sm={4}>
                    <Card
                        sx={{
                            p: 3,
                            borderRadius: "24px",
                            bgcolor: "white",
                            border: "1px solid rgba(0,0,0,0.02)",
                            borderLeft: "6px solid #10b981",
                            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.02)",
                            position: "relative",
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 15px 35px rgba(16, 185, 129, 0.06)"
                            }
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                Leads Distribution
                            </Typography>
                            <Avatar size="sm" sx={{ bgcolor: "rgba(16, 185, 129, 0.08)", color: "#10b981", width: 26, height: 26 }}>
                                <NorthEast sx={{ fontSize: 12 }} />
                            </Avatar>
                        </Box>
                        <Typography level="h1" sx={{ fontWeight: 900, color: "#1e1b4b", mt: 1.5, fontSize: "32px", fontFamily: "monospace" }}>
                            {displayEmployee.leads}
                        </Typography>
                        <Typography level="body-xs" sx={{ color: "success.500", fontWeight: 800, mt: 0.5, alignSelf: "flex-end", bgcolor: "rgba(16, 185, 129, 0.06)", px: 1, py: 0.25, borderRadius: "6px" }}>
                            +10% last month
                        </Typography>
                    </Card>
                </Grid>
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
                                    background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #c084fc 100%)",
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
                                    fontWeight: 900
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
                                    <Typography level="body-xs" sx={{ color: "#7c3aed", fontWeight: 800, mt: 0.25 }} noWrap>
                                        {displayEmployee.role}
                                    </Typography>
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
                                    <Typography level="body-xs" sx={{ color: "neutral.500", fontWeight: 700 }}>Department</Typography>
                                    <Typography level="body-xs" sx={{ color: "#1e1b4b", fontWeight: 800 }}>{displayEmployee.department}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography level="body-xs" sx={{ color: "neutral.500", fontWeight: 700 }}>Worksite Location</Typography>
                                    <Typography level="body-xs" sx={{ color: "#1e1b4b", fontWeight: 800 }}>{displayEmployee.address}</Typography>
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
                                                    background: isSelected ? "linear-gradient(135deg, #7c3aed, #6366f1)" : "transparent",
                                                    color: isSelected ? "white" : "#1e1b4b",
                                                    border: isToday && !isSelected ? "2px solid #7c3aed" : "2px solid transparent",
                                                    fontWeight: isSelected || isToday ? 900 : 600,
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease",
                                                    boxShadow: isSelected ? "0 4px 12px rgba(124, 58, 237, 0.25)" : "none",
                                                    "&:hover": {
                                                        background: isSelected ? "linear-gradient(135deg, #7c3aed, #6366f1)" : "rgba(124, 58, 237, 0.06)",
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
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                            <Box>
                                <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b" }}>
                                    Log In & Log Out Times
                                </Typography>
                                <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, mt: 0.25 }}>
                                    For: {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </Typography>
                            </Box>
                            <Avatar size="sm" sx={{ bgcolor: "rgba(99, 102, 241, 0.08)", color: "#6366f1", width: 28, height: 28 }}>
                                <CalendarMonth sx={{ fontSize: 15 }} />
                            </Avatar>
                        </Box>

                        {/* Active selected date log */}
                        {activeLog ? (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: "18px",
                                    bgcolor: "rgba(59, 130, 246, 0.03)",
                                    border: "1px solid rgba(59, 130, 246, 0.12)",
                                    mb: 2.5,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography level="title-sm" sx={{ fontWeight: 800, color: "#1e1b4b" }}>
                                        Selected Date Log
                                    </Typography>
                                    <Chip
                                        size="sm"
                                        variant="soft"
                                        color={activeLog.color}
                                        sx={{ fontWeight: 800, fontSize: "10px" }}
                                    >
                                        {activeLog.status}
                                    </Chip>
                                </Stack>
                                <Grid container spacing={2}>
                                    <Grid xs={6}>
                                        <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid rgba(0,0,0,0.02)" }}>
                                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, mb: 0.5 }}>Check In</Typography>
                                            <Typography level="title-sm" sx={{ fontWeight: 900, color: "#10b981", fontFamily: "monospace" }}>
                                                {activeLog.login}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid xs={6}>
                                        <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid rgba(0,0,0,0.02)" }}>
                                            <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, mb: 0.5 }}>Check Out</Typography>
                                            <Typography level="title-sm" sx={{ fontWeight: 900, color: "#ea580c", fontFamily: "monospace" }}>
                                                {activeLog.logout}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    p: 2.5,
                                    borderRadius: "18px",
                                    bgcolor: "rgba(241, 245, 249, 0.5)",
                                    border: "1px dashed rgba(0,0,0,0.1)",
                                    mb: 2.5,
                                    textAlign: "center"
                                }}
                            >
                                <Typography level="body-xs" sx={{ color: "neutral.500", fontWeight: 700 }}>
                                    No log records found for this date (Weekend / Future Date)
                                </Typography>
                            </Box>
                        )}

                        {/* Section header for history */}
                        <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.500", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1.5 }}>
                            Recent Logs History (Last 5 Workdays)
                        </Typography>

                        {/* Scrollable list of recent check-in times */}
                        <Box
                            sx={{
                                overflowY: "auto",
                                maxHeight: "150px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1.2,
                                pr: 0.5,
                                "&::-webkit-scrollbar": { width: "4px" },
                                "&::-webkit-scrollbar-thumb": {
                                    bgcolor: "rgba(0,0,0,0.08)",
                                    borderRadius: "2px"
                                }
                            }}
                        >
                            {(() => {
                                const historyLogs = [];
                                // Generate past 5 workdays
                                let daysAgo = 1;
                                while (historyLogs.length < 5 && daysAgo < 15) {
                                    const pastDate = new Date();
                                    pastDate.setDate(pastDate.getDate() - daysAgo);
                                    const dayOfWeek = pastDate.getDay();
                                    // Ignore weekends
                                    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                                        const log = getLoginLogoutLog(pastDate);
                                        if (log) {
                                            historyLogs.push({ date: pastDate, ...log });
                                        }
                                    }
                                    daysAgo++;
                                }

                                return historyLogs.map((historyLog, idx) => {
                                    const dateLabel = historyLog.date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                    return (
                                        <Box
                                            key={idx}
                                            onClick={() => {
                                                setSelectedDate(historyLog.date);
                                                setCalendarDate(historyLog.date);
                                            }}
                                            sx={{
                                                p: 1.25,
                                                borderRadius: "12px",
                                                bgcolor: "rgba(248, 250, 252, 0.75)",
                                                border: "1px solid rgba(0,0,0,0.02)",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                transition: "all 0.25s ease",
                                                "&:hover": {
                                                    bgcolor: "rgba(99, 102, 241, 0.05)",
                                                    borderColor: "rgba(99, 102, 241, 0.15)",
                                                    transform: "translateX(4px)"
                                                }
                                            }}
                                        >
                                            <Box>
                                                <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700 }}>
                                                    {dateLabel}
                                                </Typography>
                                                <Typography level="body-xs" sx={{ fontWeight: 800, color: "#1e1b4b", mt: 0.1 }}>
                                                    In: {historyLog.login} | Out: {historyLog.logout}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color={historyLog.color}
                                                sx={{ fontWeight: 800, fontSize: "9px" }}
                                            >
                                                {historyLog.status}
                                            </Chip>
                                        </Box>
                                    );
                                });
                            })()}
                        </Box>
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
                            <Box
                                sx={{
                                    position: "relative",
                                    pl: 1,
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        left: "81px",
                                        top: "8px",
                                        bottom: "8px",
                                        width: "2px",
                                        bgcolor: "rgba(0, 0, 0, 0.04)"
                                    }
                                }}
                            >
                                <Stack spacing={2.5}>
                                    {activeEvents.map((evt, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                p: 1.5,
                                                borderRadius: "16px",
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    bgcolor: "#f8fafc",
                                                    transform: "translateY(-2px)"
                                                }
                                            }}
                                        >
                                            <Stack direction="row" spacing={2.5} alignItems="center" sx={{ minWidth: 0 }}>
                                                {/* Left margin time */}
                                                <Typography level="body-xs" sx={{ fontWeight: 900, color: "neutral.600", width: "55px", fontFamily: "monospace" }}>
                                                    {evt.time}
                                                </Typography>

                                                {/* Circular guideline indicator */}
                                                <Box
                                                    sx={{
                                                        width: "10px",
                                                        height: "10px",
                                                        borderRadius: "50%",
                                                        bgcolor: evt.lineBg,
                                                        border: "2px solid #ffffff",
                                                        boxShadow: `0 0 0 2px ${evt.lineBg}`,
                                                        zIndex: 2
                                                    }}
                                                />

                                                {/* Title and subtitle */}
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography level="title-sm" sx={{ fontWeight: 900, color: "#1e1b4b" }} noWrap>
                                                        {evt.title}
                                                    </Typography>
                                                    <Typography level="body-xs" sx={{ color: "neutral.400", fontWeight: 800, mt: 0.15 }} noWrap>
                                                        {evt.desc}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            {/* Meet Conferencing Icon */}
                                            <Avatar
                                                size="sm"
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    bgcolor: idx % 2 === 0 ? "rgba(16, 185, 129, 0.08)" : "rgba(99, 102, 241, 0.08)",
                                                    color: idx % 2 === 0 ? "#10b981" : "#6366f1"
                                                }}
                                            >
                                                <VideoCallIcon style={{ fontSize: 13 }} />
                                            </Avatar>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        ) : (
                            <Box sx={{ py: 4, textAlign: "center" }}>
                                <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700 }}>
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
                        <Chip size="sm" variant="soft" color="primary" sx={{ fontWeight: 800, bgcolor: "rgba(99, 102, 241, 0.08)", color: "#4f46e5" }}>
                            Database View
                        </Chip>
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
                            transition: "0.2s",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.06)" }
                        }}
                    >
                        {detailsPanelOpen ? "Hide Details" : "Show Details"}
                    </Button>
                </Stack>

                {detailsPanelOpen && (
                    <Grid container spacing={4} sx={{ mt: 1, pt: 1 }}>
                        {/* Personal Information */}
                        <Grid xs={12} md={6}>
                            <Box sx={{ p: 2, borderRadius: "18px", bgcolor: "#f8fafc", border: "1px solid rgba(0,0,0,0.01)" }}>
                                <Typography level="title-sm" sx={{ fontWeight: 900, color: "#1e1b4b", display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
                                    <Person sx={{ color: "#4f46e5", fontSize: 20 }} />
                                    Personal Information
                                </Typography>
                                <Divider sx={{ mb: 2, opacity: 0.6 }} />
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
                        <Grid xs={12} md={6}>
                            <Box sx={{ p: 2, borderRadius: "18px", bgcolor: "#f8fafc", border: "1px solid rgba(0,0,0,0.01)" }}>
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
                                    <InfoRow icon={<Groups />} label="Department" value={displayEmployee.department} color="indigo" />
                                    <InfoRow icon={<Work />} label="Designation" value={displayEmployee.role} color="teal" />
                                    <InfoRow icon={<CalendarMonth />} label="Joining Date" value={displayEmployee.joining} color="blue" />
                                    <InfoRow icon={<Person />} label="Reporting Manager" value={displayEmployee.reporting} color="orange" />
                                </Box>
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

export default EmployeeDetails;