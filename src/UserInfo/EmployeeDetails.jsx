import React, { useState, useMemo } from "react";
import {
    Box,
    Button,
    Card,
    Grid,
    Stack,
    Typography,
    CircularProgress,
} from "@mui/joy";
import {
    ArrowBack,
    KeyboardArrowDown,
    KeyboardArrowUp
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { errorNotify, getAuthUser, infoNotify, successNotify } from "../constant/Constant";
import {
    useEmployeeProfile,
    useFetchDashBoardCounts,
    useFetchDashBoardReminders,
    useGetAttendanceByDate,
    useProfilePhoto,
    // useCallCenterPerformance,
} from "../CommonCode/useQuery";

// Modular Subcomponents
import StatsCards from "./Components/StatsCards";
import ProfileWidget from "./Components/ProfileWidget";
import OverallPerformance from "./Components/OverallPerformance";
import CalendarWidget from "./Components/CalendarWidget";
import AttendanceLogs from "./Components/AttendanceLogs";
import RemindersPanel from "./Components/RemindersPanel";
import PersonalCompanyInfo from "./Components/PersonalCompanyInfo";
import DocumentUploads from "./Components/DocumentUploads";
// import PerformanceChart from "./Components/PerformanceChart";
import { axioslogin } from "../Connection/axios";

const EmployeeDetails = () => {
    const navigate = useNavigate();
    const { employeeId } = useParams();

    const authUser = getAuthUser();

    const { role } = authUser ?? {}

    const isAdmin = role?.toLowerCase() === "admin";
    // const { user } = useAuth();

    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
    // Mixed Chart Date selectors state
    // const [startDate, setStartDate] = useState(new Date());
    // const [endDate, setEndDate] = useState(new Date());

    const { data: employee, isLoading: loadingEmp } = useEmployeeProfile(employeeId);
    // const { data: performanceData } = useCallCenterPerformance(employee?.user_id, startDate, endDate);
    const { data: TotalCount = [] } = useFetchDashBoardCounts(employee?.user_id);
    const { data: remindersData = [] } = useFetchDashBoardReminders(employee?.user_id);
    const { data: attendanceData, isLoading: loadingAttendance } = useGetAttendanceByDate(employee?.user_id, attendanceDate);


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

    // const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
    const [isProfilePhotoUploading, setIsProfilePhotoUploading] = useState(false);

    const { data: profilePhotoUrl = "", refetch: refetchProfilePhoto } = useProfilePhoto(employee?.user_id);

    const handleProfilePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Allowed extensions check (jpg, jpeg, jpj)
        const allowedExtensions = ["jpg", "jpeg", "jpj"];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            infoNotify("Only JPG and JPEG images are allowed.");
            e.target.value = null;
            return;
        }

        // Maximum size check (5 MB)
        if (file.size > 5 * 1024 * 1024) {
            infoNotify("Profile photo exceeds the maximum size limit of 5 MB.");
            e.target.value = null;
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);
        formData.append("userId", employee.user_id);

        setIsProfilePhotoUploading(true);

        try {
            const response = await axioslogin.post("/employee/upload-profile-photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data && response.data.success === 1) {
                successNotify("Profile photo uploaded successfully!");
                refetchProfilePhoto();
            } else {
                errorNotify(response.data.message || "Failed to upload profile photo");
            }
        } catch (error) {
            console.error("Upload photo error:", error);
            errorNotify(error.response?.data?.message || "Failed to upload profile photo");
        } finally {
            setIsProfilePhotoUploading(false);
            e.target.value = null;
        }
    };

    // Dynamic Interactive Calendar state (Defaulting to current local date)
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

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
    // const getSummaryMetrics = () => {
    //     if (!Array.isArray(performanceData)) {
    //         return { leads: 0, appointments: 0, callbacks: 0, sold: 0 };
    //     }
    //     return performanceData.reduce(
    //         (acc, item) => ({
    //             leads: acc.leads + (item.leads || 0),
    //             appointments: acc.appointments + (item.appointments || 0),
    //             callbacks: acc.callbacks + (item.callbacks || 0),
    //             sold: acc.sold + (item.sold || 0)
    //         }),
    //         { leads: 0, appointments: 0, callbacks: 0, sold: 0 }
    //     );
    // };

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

    // const metricsSummary = getSummaryMetrics();

    // Calculate dynamic overall stats from TotalCount status totals
    const getOverallStats = () => {
        let newCount = 0;
        let callbackCount = 0;
        let quoteCount = 0;
        let appointmentCount = 0;
        let soldCount = 0;
        let lostCount = 0;
        let total = 0;

        if (Array.isArray(TotalCount)) {
            TotalCount.forEach(item => {
                const name = (item.status_name || "").toUpperCase();
                const count = Number(item.total_count || 0);
                if (name.includes("NEW")) newCount += count;
                else if (name.includes("CALLBACK")) callbackCount += count;
                else if (name.includes("QUOTE")) quoteCount += count;
                else if (name.includes("APPOINMENT") || name.includes("APPOINTMENT")) appointmentCount += count;
                else if (name.includes("SOLD")) soldCount += count;
                else if (name.includes("LOST")) lostCount += count;
            });
        }

        total = newCount + callbackCount + quoteCount + appointmentCount + soldCount + lostCount;
        return {
            newCount,
            callbackCount,
            quoteCount,
            appointmentCount,
            soldCount,
            lostCount,
            total
        };
    };

    const overallStats = getOverallStats();

    // Calculate dynamic overall performance score based on actual totals
    const calculateOverallScore = () => {
        const { total, appointmentCount, callbackCount, quoteCount, soldCount } = overallStats;
        if (total === 0) return 0.0;
        const conversionRatio = soldCount / total;
        const appointmentRatio = appointmentCount / total;
        const interestRatio = (callbackCount + quoteCount) / total;

        // Normalise performance indicators compared to high performer benchmarks:
        // Conversion target = 15%, Appointment target = 25%, Callback/Quote target = 30%
        const scoreConversion = Math.min((conversionRatio / 0.15) * 5, 5);
        const scoreAppointment = Math.min((appointmentRatio / 0.25) * 5, 5);
        const scoreInterest = Math.min((interestRatio / 0.30) * 5, 5);

        // Weighted score: 50% Conversion, 30% Appointment booking, 20% Callback/Quote interest
        const finalScore = (scoreConversion * 0.5) + (scoreAppointment * 0.3) + (scoreInterest * 0.2);
        return Number(finalScore.toFixed(1));
    };


    const overallScore = calculateOverallScore();

    const conversionRate = overallStats.total > 0 ? (overallStats.soldCount / overallStats.total) * 100 : 0;
    const appointmentRate = overallStats.total > 0 ? (overallStats.appointmentCount / overallStats.total) * 100 : 0;
    const lostRate = overallStats.total > 0 ? (overallStats.lostCount / overallStats.total) * 100 : 0;
    const callbackQuoteRate = overallStats.total > 0 ? ((overallStats.callbackCount + overallStats.quoteCount) / overallStats.total) * 100 : 0;

    // Map DB values to template attributes with Call Center profession fallbacks
    const displayEmployee = employee ? {
        employee_id: employee.employee_id,
        name: employee.name || "-",
        role: employee.role_name || "-",
        company: employee.company_name || "-",
        mobile: employee.mobile_number_1 || "-",
        email: employee.email || "-",
        gender: employee.gender || "-",
        dob: employee?.dob,
        address: employee?.address,
        joining: formatDate(employee.date_of_join),
        // leads: metricsSummary.leads || 0,
        // appointments: metricsSummary.appointments || 0,
        // callbacks: metricsSummary.callbacks || 0,
        // sold: metricsSummary.sold || 0,
        attendance: "-"
    } : null;

    const handleCopyToClipboard = (text, fieldName) => {
        if (!text) return;
        navigator.clipboard.writeText(text)
            .then(() => successNotify(`${fieldName} copied to clipboard!`))
            .catch(() => errorNotify(`Failed to copy ${fieldName}`));
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
                p: { xs: 1.5, sm: 2.5, md: 4 },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, md: 4 },
                bgcolor: "#f8fafc",
                fontFamily: "'Outfit', 'Inter', sans-serif",
                overflowX: "hidden"
            }}
        >
            {/* Header Back Button */}
            {/* {user?.role?.toLowerCase() === "admin" && ( */}
            {
                isAdmin &&

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
            }


            {/* Top Row: Dynamic Stats Cards */}
            <StatsCards TotalCount={TotalCount} />

            {/* Row 2: Profile Widget (Left) + Overall Performance (Middle) + Calendar Widget (Right) */}
            <Grid container spacing={3.5} sx={{ mb: 3.5 }}>
                {/* Profile Widget Card with overlay banner */}
                <Grid xs={12} sm={6} md={3.5}>
                    <ProfileWidget
                        displayEmployee={displayEmployee}
                        profilePhotoUrl={profilePhotoUrl}
                        isProfilePhotoUploading={isProfilePhotoUploading}
                        handleProfilePhotoChange={handleProfilePhotoChange}
                        isAdmin={isAdmin}
                    />
                </Grid>

                {/* Overall Performance Card Widget */}
                <Grid xs={12} sm={6} md={4.5}>
                    <OverallPerformance
                        overallScore={overallScore}
                        conversionRate={conversionRate}
                        appointmentRate={appointmentRate}
                        callbackQuoteRate={callbackQuoteRate}
                        lostRate={lostRate}
                        overallStats={overallStats}
                    />
                </Grid>

                {/* Calendar Widget Card */}
                <Grid xs={12} sm={12} md={4}>
                    <CalendarWidget
                        calendarDate={calendarDate}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        handlePrevMonth={handlePrevMonth}
                        handleNextMonth={handleNextMonth}
                        allReminders={allReminders}
                    />
                </Grid>
            </Grid>

            {/* Row 3: Log In/Out Times (Left) + Tasks & Events Timeline (Right) */}
            <Grid container spacing={3.5} sx={{ mb: 3.5 }}>
                {/* Scrollable Log In & Log Out Times Card */}
                <Grid xs={12} md={4}>
                    <AttendanceLogs
                        attendanceDate={attendanceDate}
                        setAttendanceDate={setAttendanceDate}
                        loadingAttendance={loadingAttendance}
                        attendanceData={attendanceData}
                    />
                </Grid>

                {/* Tasks & Events Timeline list */}
                <Grid xs={12} md={8}>
                    <RemindersPanel
                        selectedDate={selectedDate}
                        activeEvents={activeEvents}
                    />
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
                    {/* <Button
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
                    </Button> */}
                </Stack>

                {/* {detailsPanelOpen && ( */}
                <Grid container spacing={{ xs: 2.5, sm: 3, md: 4 }} sx={{ mt: 0, pt: 1 }}>
                    <PersonalCompanyInfo
                        displayEmployee={displayEmployee}
                        handleCopyToClipboard={handleCopyToClipboard}
                    />

                    {/* Document Uploads */}
                    <DocumentUploads
                        userId={employee?.user_id}
                        employeeId={employee?.employee_id}
                        successNotify={successNotify}
                    />
                </Grid>
                {/* )} */}
            </Card>

            {/* Call Center Performance mixed chart at the very bottom */}
            {/* <PerformanceChart
                performanceData={performanceData}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            /> */}
        </Box>
    );
};

export default EmployeeDetails;