import React, { useRef } from "react";
import { Box, Divider, Stack, Typography, Paper, Chip, Grid, Card, IconButton } from "@mui/material";
import { motion } from "framer-motion";

import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import WcIcon from "@mui/icons-material/Wc";
import CakeIcon from "@mui/icons-material/Cake";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ScheduleIcon from "@mui/icons-material/Schedule";
import logo from "../../src/assets/loginimages/companylogo.png";
import { SparkLineChart } from "@mui/x-charts";
import ActivityCard from "../Admin/Components/ActivityCard";
import { getActivityDetails } from "../CommonCode/Reusable";
import DetailItem from "./Profilecomponents/DetailItem";
import StatCard from "./Profilecomponents/StatCard";
import AnalyticsCard from "./Profilecomponents/AnalyticsCard";
import InfoCard from "./Profilecomponents/InfoCard";
import { getAuthUser } from "../constant/Constant";
import { useEmployeeProfile, useEmployeeRecentActivity, useGetAttendanceByDate, useProfilePhoto } from "../CommonCode/useQuery";
import { format } from "date-fns";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { handleProfilePhotoChange } from "../CommonCode/CommonFun";
import { useQueryClient } from "@tanstack/react-query";
import ActivityCardSkeleton from "../SkeletonComponent/ActivityCardSkeleton";
import FloatingBackButton from "../CommonComponents/FloatingBackButton";

const MyProfilePage = () => {


    const authUser = getAuthUser();
    const queryClient = useQueryClient();

    const { id, role } = authUser ?? {}

    const TodayDate = format(new Date(), "yyyy-MM-dd");

    const { data: employee, isLoading: loadingEmp } = useEmployeeProfile(id);

    const { data: attendanceData, isLoading: loadingAttendance } = useGetAttendanceByDate(id, TodayDate);
    const { data: RecentActivities, isLoading: LoadingRecentActivities } = useEmployeeRecentActivity(id)
    const { data: profilePhotoUrl = "" } = useProfilePhoto(id);


    const fileInputRef = useRef(null);
    const formatHours = (hours) => {
        if (!hours) return "--";

        const totalMinutes = Math.round(Number(hours) * 60);
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        return `${hrs}h ${mins}m`;
    };


    const pronounce = employee?.gender === "M" ? "He / Him" : "She / Her"
    const TotalCalls = employee?.total_assigned || 0;
    const TotalSold = employee?.total_sold || 0;
    const TotalLost = employee?.total_lost || 0;

    const stats = [
        {
            title: "Calls", value: TotalCalls, color: "#fa9d07", icon: <CallIcon sx={{
                fontSize: { xs: 14, sm: 18 }
            }} />
        },
        {
            title: "Sold", value: TotalSold, color: "#fa9d07", icon: <ShoppingCartIcon sx={{
                fontSize: { xs: 14, sm: 18 }
            }} />
        },
        {
            title: "Lost", value: TotalLost, color: "#fa9d07", icon: <ScheduleIcon sx={{
                fontSize: { xs: 14, sm: 18 }
            }} />
        },
    ];

    return (
        <Box
            sx={{
                height: "95vh",
                width: "100%",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },

            }}
        >
            <Box
                sx={{
                    width: "100%",
                    minHeight: "100%",
                    display: "flex",
                    gap: 2,
                    backdropFilter: "blur(12px)",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.6)",
                    flexDirection: { xs: "column", lg: "row" },
                    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
                    // px: 1,
                }}
            >
                <Box
                    sx={{
                        width: { xs: "100%", lg: "27%" },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        bgcolor: "rgba(255,255,255,0.75)",
                        // p: 2.5,
                        // borderRight: { xs: "none", md: "1px solid rgba(0,0,0,0.06)" },

                    }}
                >
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 2 }}>
                        <Box
                            sx={{
                                width: { xs: 180, sm: 220, md: 240 },
                                height: { xs: 180, sm: 220, md: 240 },
                                borderRadius: "50%",
                                p: "6px",
                                background: "linear-gradient(135deg, #2563eb, #f97316)",
                                boxShadow: "0 12px 30px rgba(37, 99, 235, 0.22)",
                                position: "relative",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    bgcolor: "#e8e8e8",
                                }}
                            >
                                <img
                                    src={profilePhotoUrl ? profilePhotoUrl : logo}
                                    alt="profile-picture"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>

                            <IconButton
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    bottom: 8,
                                    bgcolor: "#2563eb",
                                    color: "#fff",
                                    width: 42,
                                    height: 42,
                                    "&:hover": {
                                        bgcolor: "#1d4ed8",
                                    },
                                }}
                            >
                                <CameraAltIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleProfilePhotoChange(e, id, queryClient)}
                        />
                    </Box>

                    <Typography
                        sx={{
                            fontSize: { xs: 18, sm: 22, md: 22, lg: 28 },
                            fontWeight: 800,
                            lineHeight: 1.2,
                            textAlign: "center",
                        }}
                    >
                        Rohith Krishna R
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", justifyContent: "center" }}>
                        <Chip label={pronounce} size="small" sx={{ fontWeight: 700 }} />
                        <Chip label={role} size="small" sx={{ fontWeight: 700 }} />
                    </Stack>

                    <Typography
                        sx={{
                            mt: 1.5,
                            fontSize: { xs: 10, sm: 12, md: 12, lg: 14 },
                            color: "text.secondary",
                            textAlign: "center",
                            px: 1,
                            lineHeight: 1.7,
                            fontWeight: 600
                        }}
                    >
                        Thejaswi Staffs Decription goes Here.Works for Almost 8 Hours.
                    </Typography>

                    <Divider sx={{ width: "100%", my: 2 }} />

                    <Stack spacing={1.2} sx={{ width: "100%" }}>
                        <DetailItem icon={<EmailIcon sx={{ fontSize: { xs: 12, sm: 16 } }} />} text={employee?.email} color="#f47207" />
                        <DetailItem icon={<CallIcon sx={{ fontSize: { xs: 12, sm: 16 } }} />} text={employee?.mobile_number_1} color="#f47207" />
                        <DetailItem icon={<WcIcon sx={{ fontSize: { xs: 12, sm: 16 } }} />} text={employee?.gender === "M " ? "Male" : "Female"} color="#f47207" />
                        <DetailItem icon={<CakeIcon sx={{ fontSize: { xs: 12, sm: 16 } }} />} text={`${employee?.age} Years`} color="#f47207" />
                        <DetailItem icon={<LocationOnIcon sx={{ fontSize: { xs: 12, sm: 16 } }} />} text={`${employee?.address}`} color="#f47207" />
                        <DetailItem icon={<SchoolIcon sx={{ fontSize: { xs: 12, sm: 16 } }} />} text={`${employee?.company_name}`} color="#f47207" />
                    </Stack>
                </Box>

                <Box
                    sx={{
                        width: { xs: "100%", lg: "50%" },
                        py: { xs: 2, md: 3 },
                        bgcolor: "rgb(255, 255, 255)"
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <Stack spacing={2.5}>
                            <Box sx={{
                                px: 1,
                            }}>
                                <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
                                    Profile Overview
                                </Typography>
                                <Typography sx={{ color: "text.secondary", fontSize: { xs: 12, sm: 14 } }}>
                                    Quick details and work summary
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "repeat(3, minmax(0, 1fr))",
                                        sm: "repeat(3, minmax(0, 1fr))",
                                        md: "repeat(3, minmax(0, 1fr))",
                                        lg: "repeat(3, minmax(0, 1fr))",
                                    },
                                    gap: 1,
                                }}
                            >
                                {stats.map((item) => (
                                    <StatCard
                                        key={item.title}
                                        title={item.title}
                                        value={item.value}
                                        color={item.color}
                                        icon={item.icon}
                                    />
                                ))}
                            </Box>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    background: "#fff",
                                }}
                            >
                                <Box sx={{
                                    px: 1,
                                    mb: 2
                                }}>
                                    <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 800 }}>
                                        System Login Detail
                                    </Typography>
                                </Box>


                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                                        gap: 1,
                                        px: 1,
                                    }}
                                >
                                    <InfoCard
                                        title="Log In"
                                        value={
                                            attendanceData?.first_login
                                                ? format(new Date(attendanceData.first_login), "hh:mm a")
                                                : "--:--"
                                        }
                                        titleColor="success.700"
                                        valueColor="#10b981"
                                        bgColor="rgba(16,185,129,0.04)"
                                        borderColor="rgba(16,185,129,0.12)"
                                    />

                                    <InfoCard
                                        title="Log Out"
                                        value={
                                            attendanceData?.last_logout
                                                ? format(new Date(attendanceData.last_logout), "hh:mm a")
                                                : "--:--"
                                        }
                                        titleColor="warning.700"
                                        valueColor="#ea580c"
                                        bgColor="rgba(249,115,22,0.04)"
                                        borderColor="rgba(249,115,22,0.12)"
                                    />

                                    <InfoCard
                                        title="Total Hours"
                                        v value={formatHours(attendanceData?.total_productivity_hours)}
                                        titleColor="primary.700"
                                        valueColor="#2563eb"
                                        bgColor="rgba(37,99,235,0.04)"
                                        borderColor="rgba(37,99,235,0.12)"
                                    />
                                </Box>

                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    border: "1px solid rgba(0,0,0,0.06)",
                                    background: "#fff",
                                }}
                            >
                                <Typography sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 800, mb: 2 }}>
                                    Analytics Details
                                </Typography>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                                        gap: 2,
                                    }}
                                >
                                    <AnalyticsCard
                                        title="Quote"
                                        value="96"
                                        color="#2563eb"
                                        data={[65, 72, 68, 80, 90, 88, 96]}
                                    />
                                    <AnalyticsCard
                                        title="Callback"
                                        value="84"
                                        color="#f97316"
                                        data={[45, 55, 60, 72, 78, 82, 84]}
                                    />
                                    <AnalyticsCard
                                        title="Calls Sold"
                                        value="86"
                                        color="#16a34a"
                                        data={[40, 48, 52, 60, 68, 74, 86]}
                                    />
                                    <AnalyticsCard
                                        title="Lost"
                                        value="18"
                                        color="#eab308"
                                        data={[28, 26, 24, 22, 20, 19, 18]}
                                    />
                                </Box>
                            </Paper>

                        </Stack>
                    </motion.div>
                </Box>

                <Box
                    sx={{
                        width: { xs: "100%", lg: "25%" },
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        height: '95vh',
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
                                // borderRadius: 5,
                                boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                                border: "1px solid rgba(255,255,255,0.8)",
                            }}
                        >
                            {/* Header */}
                            <Box
                                sx={{
                                    p: 3,
                                    borderBottom: "1px solid #E5E7EB",
                                    bgcolor: "#fff",
                                    flexShrink: 0,
                                }}
                            >
                                <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
                                    Recent Activities
                                </Typography>
                                <Typography sx={{ color: "text.secondary", fontSize: { xs: 10, sm: 12 } }}>
                                    Recentlly done Jobs are Listed
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
                                }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35 }}
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

                                </motion.div>
                            </Box>
                        </Card>
                    </Box>
                </Box>
            </Box>
            <FloatingBackButton navigateTo="/home" />
        </Box>
    );
};

export default MyProfilePage;