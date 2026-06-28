import React, { useMemo } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Stack,
    Divider,
    useTheme,
    LinearProgress,
} from "@mui/material";
import {
    People,
    Phone,
    EventAvailable,
    TrendingUp,
    UploadFile,
    Settings,
    ArrowUpward,
    CalendarToday,
    Email,
    AssignmentTurnedIn,
    AccessTime,
    NotificationsActive,
    Refresh,
    CheckCircle,
    History,
    BarChart,
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";
import { getAuthUser } from "../constant/Constant";

const summaryData = [
    { label: "New Calls", value: 24, color: "#2563eb" },
    { label: "Today's Follow-ups", value: 12, color: "#f59e0b" },
    { label: "Pending Quotes", value: 8, color: "#2563eb" },
    { label: "Appointments", value: 5, color: "#10b981" },
    { label: "Converted Leads", value: 18, color: "#7c3aed" },
    { label: "Renewals", value: 14, color: "#ef4444" },
];

const reminders = [
    {
        title: "Callback",
        count: 7,
        note: "Due today",
        icon: <Phone />,
        color: "#2563eb",
        bgColor: "rgba(37, 99, 235, 0.1)",
    },
    {
        title: "Appointment",
        count: 5,
        note: "Scheduled today",
        icon: <CalendarToday />,
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
        title: "Quote Follow-up",
        count: 9,
        note: "Needs action",
        icon: <AssignmentTurnedIn />,
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
    },
];

const activities = [
    { text: "Rohith Krishna uploaded new lead data", time: "2 min ago", icon: <UploadFile />, color: "#2563eb" },
    { text: "12 appointments booked today", time: "15 min ago", icon: <EventAvailable />, color: "#f97316" },
    { text: "TL assigned 50 fresh leads", time: "1 hour ago", icon: <People />, color: "#2563eb" },
    { text: "Customer quotation generated", time: "2 hours ago", icon: <Email />, color: "#f97316" },
    { text: "New employee added", time: "3 hours ago", icon: <People />, color: "#2563eb" },
];

const performanceData = [
    { month: "Jan", calls: 120, followups: 45, appointments: 22, conversions: 18 },
    { month: "Feb", calls: 132, followups: 52, appointments: 26, conversions: 20 },
    { month: "Mar", calls: 145, followups: 58, appointments: 31, conversions: 24 },
    { month: "Apr", calls: 160, followups: 60, appointments: 33, conversions: 28 },
    { month: "May", calls: 155, followups: 63, appointments: 35, conversions: 30 },
    { month: "Jun", calls: 172, followups: 70, appointments: 38, conversions: 34 },
    { month: "Jul", calls: 180, followups: 72, appointments: 42, conversions: 36 },
    { month: "Aug", calls: 188, followups: 76, appointments: 44, conversions: 39 },
    { month: "Sep", calls: 176, followups: 74, appointments: 41, conversions: 37 },
    { month: "Oct", calls: 192, followups: 81, appointments: 46, conversions: 41 },
    { month: "Nov", calls: 205, followups: 88, appointments: 50, conversions: 45 },
    { month: "Dec", calls: 214, followups: 92, appointments: 54, conversions: 49 },
];

const EmployeeDashboard = () => {
    const authUser = getAuthUser();
    const theme = useTheme();

    const totalCalls = useMemo(
        () => performanceData.reduce((sum, item) => sum + item.calls, 0),
        []
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                overflow: "auto",
                p: { xs: 2, md: 3 },
                background: `
          radial-gradient(circle at 15% 20%, rgba(37,99,235,0.14) 0%, transparent 30%),
          radial-gradient(circle at 85% 15%, rgba(249,115,22,0.12) 0%, transparent 28%),
          linear-gradient(180deg, #f8fbff 0%, #ffffff 45%, #f8fafc 100%)
        `,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
            }}
        >
            <Card
                sx={{
                    borderRadius: 5,
                    px: 2,
                    py: 2,
                    mb: 3,
                    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #f97316 100%)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(37, 99, 235, 0.22)",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: -60,
                        right: -60,
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.08)",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: -80,
                        left: -40,
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.06)",
                    }}
                />

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography fontSize={{ xs: 22, md: 26 }} fontWeight={900} color="#fff">
                            WELCOME BACK {authUser?.emp_name || "EMPLOYEE"}.
                        </Typography>
                        <Typography fontSize={{ xs: 11, md: 13 }} color="rgba(255,255,255,0.88)">
                            Track calls, follow-ups, appointments, renewals, and overall performance in one place.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 1.5,
                                justifyContent: { xs: "flex-start", md: "flex-end" },
                                flexWrap: "wrap",
                            }}
                        >
                            <Chip
                                label={`${summaryData[0].value} Calls`}
                                icon={<Phone sx={{ fontSize: 16 }} />}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.18)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    height: 40,
                                }}
                            />
                            <Chip
                                label={`${summaryData[3].value} Appointments`}
                                icon={<CalendarToday sx={{ fontSize: 16 }} />}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.18)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    height: 40,
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Card>

            <Grid container spacing={2.5}>
                {summaryData.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={item.label}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                height: "100%",
                                border: "1px solid rgba(255,255,255,0.85)",
                                boxShadow: "0 18px 40px rgba(189, 208, 249, 0.22)",
                                transition: "0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-6px)",
                                    boxShadow: "0 18px 45px rgba(15,23,42,0.10)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 2.5 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="start" gap={2}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography color="text.secondary" fontSize={13} sx={{ mb: 0.5, fontWeight: 700 }}>
                                            {item.label}
                                        </Typography>
                                        <Typography fontWeight={900} fontSize={{ xs: 26, md: 32 }} sx={{ mb: 1, color: "#0f172a" }}>
                                            {item.value}
                                        </Typography>
                                        <Chip
                                            label="+12%"
                                            icon={<ArrowUpward sx={{ fontSize: 14 }} />}
                                            sx={{
                                                bgcolor: "rgba(16,185,129,0.10)",
                                                color: "#059669",
                                                fontWeight: 700,
                                                fontSize: 12,
                                                height: 28,
                                            }}
                                        />
                                    </Box>

                                    <Avatar
                                        sx={{
                                            bgcolor: item.color,
                                            width: 52,
                                            height: 52,
                                            boxShadow: `0 10px 25px ${item.color}33`,
                                        }}
                                    >
                                        {item.color === "#2563eb" ? <TrendingUp /> : <People />}
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid item xs={12} lg={8}>
                    <Card
                        sx={{
                            borderRadius: 5,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                            border: "1px solid rgba(255,255,255,0.85)",
                            overflow: "hidden",
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Box>
                                    <Typography fontSize={22} fontWeight={900} sx={{ color: "#0f172a" }}>
                                        Yearly Performance
                                    </Typography>
                                    <Typography fontSize={13} color="text.secondary">
                                        Calls, follow-ups, appointments, and conversions across the year
                                    </Typography>
                                </Box>
                                <Chip
                                    label={`Total Calls: ${totalCalls}`}
                                    icon={<BarChart sx={{ fontSize: 16 }} />}
                                    sx={{
                                        bgcolor: "rgba(37,99,235,0.08)",
                                        color: "#2563eb",
                                        fontWeight: 800,
                                    }}
                                />
                            </Stack>

                            <Box sx={{ width: "100%", height: { xs: 320, md: 420 } }}>
                                <LineChart
                                    dataset={performanceData}
                                    xAxis={[
                                        {
                                            scaleType: "band",
                                            dataKey: "month",
                                            tickLabelStyle: { fill: "#64748b", fontSize: 12 },
                                        },
                                    ]}
                                    series={[
                                        {
                                            dataKey: "calls",
                                            label: "Calls",
                                            color: "#2563eb",
                                        },
                                        {
                                            dataKey: "followups",
                                            label: "Follow-ups",
                                            color: "#f97316",
                                        },
                                        {
                                            dataKey: "appointments",
                                            label: "Appointments",
                                            color: "#10b981",
                                        },
                                        {
                                            dataKey: "conversions",
                                            label: "Conversions",
                                            color: "#7c3aed",
                                        },
                                    ]}
                                    height={400}
                                    margin={{ top: 20, right: 20, bottom: 40, left: 45 }}
                                    grid={{ horizontal: true, vertical: false }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Card
                        sx={{
                            borderRadius: 5,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                            border: "1px solid rgba(255,255,255,0.85)",
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography fontSize={22} fontWeight={900} sx={{ mb: 2 }}>
                                Today’s Reminders
                            </Typography>

                            <Stack spacing={1.5}>
                                {reminders.map((item) => (
                                    <Box
                                        key={item.title}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 3,
                                            bgcolor: "#fff",
                                            border: "1px solid rgba(226,232,240,0.8)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: item.color,
                                                width: 44,
                                                height: 44,
                                                boxShadow: `0 8px 20px ${item.color}26`,
                                            }}
                                        >
                                            {item.icon}
                                        </Avatar>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography fontWeight={800} sx={{ color: "#0f172a" }}>
                                                {item.title}
                                            </Typography>
                                            <Typography fontSize={12} color="text.secondary">
                                                {item.note}
                                            </Typography>
                                        </Box>

                                        <Chip
                                            label={item.count}
                                            sx={{
                                                bgcolor: item.bgColor,
                                                color: item.color,
                                                fontWeight: 900,
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 5, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.85)" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography fontSize={22} fontWeight={900} sx={{ mb: 2 }}>
                                Recent Activities
                            </Typography>

                            {activities.map((activity, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1.5,
                                        p: 1.5,
                                        borderRadius: 3,
                                        bgcolor: "#fff",
                                        border: "1px solid rgba(229,231,235,0.7)",
                                        transition: "0.2s",
                                        "&:hover": {
                                            bgcolor: "#f8fafc",
                                            transform: "translateX(4px)",
                                            boxShadow: "0 12px 25px rgba(37, 99, 235, 0.10)",
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: activity.color,
                                            width: 42,
                                            height: 42,
                                            mr: 1.5,
                                            borderRadius: 2,
                                        }}
                                    >
                                        {activity.icon}
                                    </Avatar>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography fontSize={14} fontWeight={700}>
                                            {activity.text}
                                        </Typography>
                                        <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.4 }}>
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 5, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.85)" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography fontSize={22} fontWeight={900} sx={{ mb: 2 }}>
                                Quick Summary
                            </Typography>

                            <Stack spacing={2}>
                                <Box>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography fontWeight={700}>Appointments Completion</Typography>
                                        <Typography color="#10b981" fontWeight={800}>78%</Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={78}
                                        sx={{ height: 10, borderRadius: 999, bgcolor: "rgba(16,185,129,0.12)" }}
                                    />
                                </Box>

                                <Box>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography fontWeight={700}>Follow-up Coverage</Typography>
                                        <Typography color="#2563eb" fontWeight={800}>64%</Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={64}
                                        sx={{ height: 10, borderRadius: 999, bgcolor: "rgba(37,99,235,0.12)" }}
                                    />
                                </Box>

                                <Box>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography fontWeight={700}>Renewal Progress</Typography>
                                        <Typography color="#f97316" fontWeight={800}>52%</Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={52}
                                        sx={{ height: 10, borderRadius: 999, bgcolor: "rgba(249,115,22,0.12)" }}
                                    />
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    <Chip label="Fast Processing" sx={{ bgcolor: "rgba(37,99,235,0.08)", color: "#2563eb" }} />
                                    <Chip label="Renewals" sx={{ bgcolor: "rgba(239,68,68,0.08)", color: "#ef4444" }} />
                                    <Chip label="Appointments" sx={{ bgcolor: "rgba(16,185,129,0.08)", color: "#10b981" }} />
                                    <Chip label="Callbacks" sx={{ bgcolor: "rgba(245,158,11,0.08)", color: "#f59e0b" }} />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EmployeeDashboard;