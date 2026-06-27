import React from "react";
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

const stats = [
  {
    title: "Total Employees",
    value: 128,
    change: "+12%",
    icon: <People />,
    color: "#2563eb",
    bgColor: "rgba(37, 99, 235, 0.1)",
  },
  {
    title: "Calls Today",
    value: 864,
    change: "+23%",
    icon: <Phone />,
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.1)",
  },
  {
    title: "Appointments",
    value: 43,
    change: "+8%",
    icon: <EventAvailable />,
    color: "#2563eb",
    bgColor: "rgba(37, 99, 235, 0.1)",
  },
  {
    title: "Conversion Rate",
    value: "78%",
    change: "+5%",
    icon: <TrendingUp />,
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.1)",
  },
];

const activities = [
  { text: "Rohith Krishna uploaded new lead data", time: "2 min ago", icon: <UploadFile />, color: "#2563eb" },
  { text: "12 appointments booked today", time: "15 min ago", icon: <EventAvailable />, color: "#f97316" },
  { text: "TL assigned 50 fresh leads", time: "1 hour ago", icon: <People />, color: "#2563eb" },
  { text: "Customer quotation generated", time: "2 hours ago", icon: <Email />, color: "#f97316" },
  { text: "New employee added", time: "3 hours ago", icon: <People />, color: "#2563eb" },
];

const AdminDashboard = () => {
  const authUser = getAuthUser();

 
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

        <Grid container spacing={12} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography
              fontSize={{ xs: 24, md: 24 }}
              fontWeight={800}
              color="#fff"
            >
              WELCOME BACK {authUser?.emp_name}.
            </Typography>
            <Typography fontSize={{ xs: 10, md: 13 }} color="rgba(255,255,255,0.85)">
              Monitor team performance, leads, appointments and CRM activities
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "flex-start", md: "flex-end" },
                flexWrap: "wrap",
              }}
            >
              <Chip
                label="128 Employees"
                icon={<People sx={{ fontSize: 16 }} />}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  fontWeight: 600,
                  height: 42,
                }}
              />
              <Chip
                label="864 Calls"
                icon={<Phone sx={{ fontSize: 16 }} />}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  fontWeight: 600,
                  height: 42,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Stat Cards */}
      <Grid container spacing={3}>
        {stats?.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 5,
                height: "100%",
                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
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
                    <Typography color="text.secondary" fontSize={13} sx={{ mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography fontWeight={800} fontSize={{ xs: 28, sm: 32, md: 36 }} sx={{ mb: 1 }}>
                      {item.value}
                    </Typography>
                    <Chip
                      label={item.change}
                      icon={<ArrowUpward sx={{ fontSize: 14 }} />}
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
                      ml: 2,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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

          {activities.map((activity, index) => (
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
              }}
            >
              <Avatar
                sx={{
                  bgcolor: activity.color,
                  width: 44,
                  height: 44,
                  mr: 2,
                  borderRadius: 12,
                }}
              >
                {activity.icon}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography fontSize={14} fontWeight={600}>
                  {activity.text}
                </Typography>
                <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
                  {activity.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;