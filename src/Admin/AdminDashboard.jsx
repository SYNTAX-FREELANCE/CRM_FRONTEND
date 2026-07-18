import React, { memo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  LinearProgress,
  Chip,
  useTheme,
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
} from "@mui/icons-material";
import { getAuthUser } from "../constant/Constant";
import DashboardDateFilter from "./Components/DashboardDateFilter";
import { format, subDays } from "date-fns";
import { useAdminDashBoardCounts, useAllEmployeeRecentActivity, useTopEmployess } from "../CommonCode/useQuery";
import { getActivityDetails } from "../CommonCode/Reusable";
import TopSalesExecutivesSkeleton from "../SkeletonComponent/TopSalesExecutivesSkeleton";
import TopSalesExecutives from "./Components/TopSalesExecutives";
import DashboardStatCard from "./Components/DashboardStatCard";
import DashboardStatCardSkeleton from "../SkeletonComponent/DashboardStatCardSkeleton";
import ActivityCard from "./Components/ActivityCard";
import ActivityCardSkeleton from "../SkeletonComponent/ActivityCardSkeleton";

const stats = [
  {
    title: "Completed",
    key: "totalCompleted",
    icon: <TrendingUp />,
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.1)",
  },
  {
    title: "New",
    key: "totalNew",
    icon: <People />,
    color: "#2563eb",
    bgColor: "rgba(37,99,235,0.1)",
  },
  {
    title: "Callback",
    key: "totalCallback",
    icon: <Phone />,
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.1)",
  },
  {
    title: "Quote",
    key: "totalQuote",
    icon: <Email />,
    color: "#06b6d4",
    bgColor: "rgba(6,182,212,0.1)",
  },
  {
    title: "Appointment",
    key: "totalAppointment",
    icon: <EventAvailable />,
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.1)",
  },
  {
    title: "Sold",
    key: "totalSold",
    icon: <TrendingUp />,
    color: "#16a34a",
    bgColor: "rgba(22,163,74,0.1)",
  },
  {
    title: "Lost",
    key: "totalLost",
    icon: <TrendingUp />,
    color: "#dc2626",
    bgColor: "rgba(220,38,38,0.1)",
  },
];



const AdminDashboard = () => {

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const authUser = getAuthUser();
  const today = new Date();
  const [dateFilter, setDateFilter] = useState("7days");

  const [fromDate, setFromDate] = useState(
    format(subDays(today, 6), "yyyy-MM-dd")
  );

  const [toDate, setToDate] = useState(
    format(today, "yyyy-MM-dd")
  );

  const { data: DashboardCount, isLoading: LoadingDashboardCount } = useAdminDashBoardCounts(fromDate, toDate)
  const { data: RecentActivities, isLoading: LoadingRecentActivities } = useAllEmployeeRecentActivity()
  const { data: ToSaleEmployees = [], isLoading: LoadingTopEmployees } = useTopEmployess();




  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        pb: 2
      }}
    >
      {/* Header Section */}
      <Card
        sx={{
          borderRadius: 5,
          px: 2,
          py: 2,
          mb: 4,
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #f97316 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Circles */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: "rgba(255, 255, 255, 0.1)",
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
            bgcolor: "rgba(255, 255, 255, 0.08)",
          }}
        />

        <Grid container spacing={2} alignItems="center" justifyContent={'space-between'}>
          <Grid item xs={12} md={8}>
            <Typography fontSize={{ xs: 16, sm: 20, md: 26 }} fontWeight={900} color="#fff">
              WELCOME BACK {authUser?.emp_name || "EMPLOYEE"}.
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(4, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
            xl: "repeat(7, minmax(0, 1fr))",
          },
          gap: 1,
          width: "100%",
        }}
      >
        {
          LoadingDashboardCount
            ? Array.from({ length: stats.length }).map((_, index) => (
              <DashboardStatCardSkeleton key={index} />
            ))
            : stats?.map((item, index) => (
              <Box key={index}>
                <DashboardStatCard
                  item={item}
                  DashboardCount={DashboardCount}
                />
              </Box>
            ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 2,
          mt: 2,
          height: {
            xs: "auto",
            lg: "60vh",
          },
        }}>
        <Box
          sx={{
            flex: 3,
            minWidth: 0,
            minHeight: {
              xs: 450,
              lg: 0,
            },
            height: {
              lg: "100%",
            },
          }}
        >
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 5,
              boxShadow: isDark ? "0 8px 30px rgba(0,0,0,0.5)" : "0 8px 30px rgba(0,0,0,0.06)",
              border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.8)",
              bgcolor: isDark ? "rgba(30,41,59,0.7)" : "#fff",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 3,
                borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #E5E7EB",
                bgcolor: isDark ? "rgba(15,23,42,0.6)" : "#fff",
                flexShrink: 0,
              }}
            >
              <Typography fontSize={22} fontWeight={700} color={isDark ? "#f8fafc" : "inherit"}>
                Recent Activities
              </Typography>
            </Box>

            {/* Scroll only on Desktop */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                overflowY: {
                  xs: "visible",
                  lg: "auto",
                },
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {
                LoadingRecentActivities
                  ? Array.from({ length: 5 }).map((_, index) => (
                    <ActivityCardSkeleton key={index} />
                  ))
                  : RecentActivities?.map((activity, index) => {
                    const { icon, color, bgcolor } = getActivityDetails(activity);
                    return (
                      <ActivityCard
                        key={activity.activity_id || activity.changed_at}
                        activity={activity}
                        icon={icon}
                        color={color}
                        bgcolor={bgcolor}
                      />
                    );
                  })}
            </Box>
          </Card>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: {
              xs: 320,
              sm: 320,
              md: 350,
              lg: 0,
            },
            height: {
              lg: "100%",
            },
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
  );
};

export default memo(AdminDashboard);