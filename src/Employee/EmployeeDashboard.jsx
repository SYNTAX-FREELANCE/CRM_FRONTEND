import React, { Suspense, useMemo, useState } from "react";
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
import { useFetchDashBoardCounts, useFetchDashBoardReminders, useTopEmployess } from "../CommonCode/useQuery";
import StatusCountCard from "../Admin/Components/StatusCountCard";
import DashboardDateFilter from "../Admin/Components/DashboardDateFilter";
import DashboardRemindersCard from "../Admin/Components/DashboardRemindersCard";

import ReminderBarChartCard from "../Admin/Components/ReminderBarChartCard";
import ReminderAreaChartCard from "../Admin/Components/ReminderAreaChartCard";
import TopSalesExecutives from "../Admin/Components/TopSalesExecutives";
import StatusCountCardSkeleton from "../SkeletonComponent/StatusCountCardSkeleton";
import DashboardRemindersCardSkeleton from "../SkeletonComponent/DashboardRemindersCardSkeleton";
import TopSalesExecutivesSkeleton from "../SkeletonComponent/TopSalesExecutivesSkeleton";

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

const EmployeeDashboard = () => {

    const authUser = getAuthUser();

    const theme = useTheme();

    const [dateFilter, setDateFilter] = useState("7days");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const { id } = authUser ?? {}

    const { data: TotalCount = [], isLoading: LoadingTotalCount } = useFetchDashBoardCounts(id);

    const { data: remindersData = [], isLoading: LoadingReminderData } = useFetchDashBoardReminders(id);

    const { data: ToSaleEmployees = [], isLoading: LoadingTopEmployees } = useTopEmployess();

    return (
        <Box
            sx={{
                minHeight: "90vh",
                overflow: "auto",
                p: { xs: 2, md: 3 },
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
                    mb: 1,
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

                <Grid container spacing={2} alignItems="center" justifyContent={'space-between'}>
                    <Grid item xs={12} md={8}>
                        <Typography fontSize={{ xs: 16, sm: 20, md: 26 }} fontWeight={900} color="#fff">
                            WELCOME BACK {authUser?.emp_name?.toUpperCase() || "EMPLOYEE"}.
                        </Typography>
                        <Typography fontSize={{ xs: 10, sm: 11, md: 13 }} color="rgba(255,255,255,0.88)">
                            Track calls, follow-ups, appointments, renewals, and overall performance in one place.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <DashboardDateFilter
                            value={dateFilter}
                            onChange={setDateFilter}
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={setFromDate}
                            onToDateChange={setToDate}
                        />
                    </Grid>
                </Grid>
            </Card>
            <Box sx={{
                mt: 2.5,
                display: "flex",
                gap: 2.5,
                flexDirection: { xs: "column", sm: 'column', lg: "row" },
                alignItems: "stretch",
            }}>
                <Box sx={{
                    flex: 3,
                    minWidth: 0,
                }}>
                    <Box  >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(2, minmax(0, 1fr))",
                                    sm: "repeat(3, minmax(0, 1fr))",
                                    md: "repeat(6, minmax(0, 1fr))",
                                    lg: "repeat(6, minmax(0, 1fr))",
                                },
                                gap: 2,
                                width: '100%',
                            }}
                        >
                            {
                                LoadingTotalCount ? (
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <StatusCountCardSkeleton key={index} />
                                    ))
                                ) : (
                                    TotalCount?.map((item) => (
                                        <Suspense fallback={<StatusCountCardSkeleton />}>
                                            <StatusCountCard
                                                key={item.status_id}
                                                statusId={item.status_id}
                                                title={item.status_name}
                                                count={item.total_count}
                                                color={item.color}
                                            />
                                        </Suspense>
                                    ))
                                )
                            }

                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: 2.5,
                            display: "flex",
                            gap: 2.5,
                            flexDirection: { xs: "column", lg: "row" },
                            alignItems: "stretch",
                        }} >
                        {/* <Box
                            sx={{
                                flex: 1,
                                minWidth: 0
                            }}>
                            <ReminderAreaChartCard reminders={remindersData} />
                        </Box> */}
                        <Box
                            sx={{
                                flex: 2, // ~33%
                                minWidth: 0,
                            }}>

                            {LoadingReminderData ? (
                                <DashboardRemindersCardSkeleton />
                            ) : (
                                <DashboardRemindersCard remindersData={remindersData} />
                            )}

                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    flex: 1,
                    minWidth: 0,
                }}>
                    {/* <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            height: '100%'
                        }}> */}
                         <Box
                                  sx={{
                                    flex: 1,
                                    height:{xs:450,md:'45%',lg:'63%',xl:"63%"}
                                  }}
                                >
                        {LoadingTopEmployees ? (
                            <TopSalesExecutivesSkeleton />
                        ) : (
                            <TopSalesExecutives data={ToSaleEmployees} />
                        )}
                    </Box>
                </Box>
            </Box>


        </Box>
    );
};

export default EmployeeDashboard;