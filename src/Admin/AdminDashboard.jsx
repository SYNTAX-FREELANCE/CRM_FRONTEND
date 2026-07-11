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
import { useAdminDashBoardCounts, useAllEmployeeRecentActivity } from "../CommonCode/useQuery";
import { getActivityDetails } from "../CommonCode/Reusable";

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

  const authUser = getAuthUser();

  const today = new Date();

  const [dateFilter, setDateFilter] = useState("7days");

  const [fromDate, setFromDate] = useState(
    format(subDays(today, 6), "yyyy-MM-dd")
  );

  const [toDate, setToDate] = useState(
    format(today, "yyyy-MM-dd")
  );

  const { data: DashboardCount } = useAdminDashBoardCounts(fromDate, toDate)
  const { data: RecentActivities } = useAllEmployeeRecentActivity()






  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
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
          // boxShadow: "0 25px 60px rgba(37, 99, 235, 0.3)",
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

      {/* Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(4, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
            lg: "repeat(7, minmax(0, 1fr))",
          },
          gap: 1,
          width: "100%",
        }}
      >
        {stats?.map((item, index) => (
          <Box key={index}>
            <Card
              sx={{
                borderRadius: 5,
                height: "100%",
                transition: "0.3s",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 25px 10px rgba(189, 208, 249, 0.3)",
                width: "100%",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 0.5, fontSize: { xs: 9, sm: 10, md: 12, fontWeight: 900 } }}
                    >
                      {item?.title?.toUpperCase()}
                    </Typography>

                    <Typography
                      fontWeight={900}
                      fontSize={{ xs: 32, sm: 36, md: 42 }}
                      sx={{
                        mb: 0.5,
                        color: "#1e293b",
                        letterSpacing: 1,
                        textShadow: `
      1px 1px 0px #fff,
      2px 2px 0px #d1d5db,
      3px 3px 0px #cbd5e1,
      4px 4px 6px rgba(0,0,0,0.25)
    `,
                      }}
                    >
                      {DashboardCount?.[item.key] ?? 0}
                    </Typography>

                    {item.key !== "totalUploaded" && (
                      <Typography
                        fontSize={12}
                        color="text.secondary"
                        sx={{ mb: 1, fontSize: { xs: 9, sm: 10, md: 12, fontWeight: 900 } }}
                      >
                        of {DashboardCount?.totalUploaded ?? 0}
                      </Typography>
                    )}

                    <Chip
                      label={
                        item.key === "totalUploaded"
                          ? "Overall Leads"
                          : `${(
                            ((Number(DashboardCount?.[item.key] || 0) /
                              Number(DashboardCount?.totalUploaded || 1)) *
                              100) || 0
                          ).toFixed(0)}%`
                      }
                      sx={{
                        bgcolor: item.bgColor,
                        color: item.color,
                        fontWeight: 700,
                        fontSize: 12,
                        height: 28,

                      }}
                    />
                  </Box>

                  <Avatar
                    sx={{
                      bgcolor: item.color,
                      width: 56,
                      height: 56,
                      ml: 2
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Activity Section */}
      <Card
        sx={{
          mt: 3,
          borderRadius: 5,
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          border: "1px solid rgba(255,255,255,0.8)",

        }}
      >
        <CardContent sx={{ p: 3, boxShadow: "0 46px 30px rgba(0,0,0,0.06)", bgcolor: '#fff' }}>
          <Typography fontSize={22} fontWeight={700} sx={{ mb: 3 }}>
            Recent Activities
          </Typography>

          {RecentActivities?.map((activity, index) => {
            const { icon, color, bgcolor } = getActivityDetails(activity);
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  p: 2,
                  borderRadius: 16,
                  bgcolor: "#fff",
                  border: "1px solid rgba(229,231,235,0.5)",
                  cursor: 'pointer',
                  transition: "0.2s",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                    transform: "translateX(4px)",
                    boxShadow: "0 25px 10px rgba(37, 99, 235, 0.3)",
                  },
                }}>
                <Avatar
                  sx={{
                    bgcolor: color,
                    width: 44,
                    height: 44,
                    mr: 2,
                    borderRadius: 12,
                  }}>
                  {icon}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <Typography fontSize={14} fontWeight={600}>
                      {activity.name}
                    </Typography>
                    <Box sx={{
                      color: color,
                      textAlign: 'center',
                      px: 2,
                      borderRadius: 2,
                      alignItems: "center", justifyContent: 'center',
                      bgcolor: bgcolor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }} >
                      <Typography fontSize={8} fontWeight={900}>
                        {activity.status_name}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography fontSize={12} fontWeight={600}>
                    {activity.remarks}
                  </Typography>

                  <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
                    {format(new Date(activity.changed_at), "dd MMM yyyy, hh:mm a")}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </CardContent>
      </Card>
    </Box>
  );
};

export default memo(AdminDashboard);