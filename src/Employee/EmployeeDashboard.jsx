import React, { Suspense, } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
} from "@mui/material";
import { getAuthUser } from "../constant/Constant";
import { useEmployeeCaptureCount, useEmployeeCurrentIncentiveAmount, useEmployeeIncentiveSlab, useFetchDashBoardCounts, useFetchDashBoardReminders, useTopEmployess } from "../CommonCode/useQuery";
import StatusCountCard from "../Admin/Components/StatusCountCard";

import DashboardRemindersCard from "../Admin/Components/DashboardRemindersCard";
import TopSalesExecutives from "../Admin/Components/TopSalesExecutives";
import StatusCountCardSkeleton from "../SkeletonComponent/StatusCountCardSkeleton";
import DashboardRemindersCardSkeleton from "../SkeletonComponent/DashboardRemindersCardSkeleton";
import TopSalesExecutivesSkeleton from "../SkeletonComponent/TopSalesExecutivesSkeleton";
import EmployeeIncentiveCard from "./Component/EmployeeIncentiveCard";


const EmployeeDashboard = () => {

    const authUser = getAuthUser();


    const { id } = authUser ?? {}

    const { data: TotalCount = [], isLoading: LoadingTotalCount } = useFetchDashBoardCounts(id);

    const { data: remindersData = [], isLoading: LoadingReminderData } = useFetchDashBoardReminders(id);

    const { data: ToSaleEmployees = [], isLoading: LoadingTopEmployees } = useTopEmployess();

    const { data: IncentiveSlabDetail = [] } = useEmployeeIncentiveSlab(id);

    const { data: CaptureCount = 0 } = useEmployeeCaptureCount(id);

    const { data: incentiveAmount = [] } = useEmployeeCurrentIncentiveAmount(id, CaptureCount);

    



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
                pb: 2,
                position: 'relative'
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

                <Grid container spacing={2} alignItems="center" justifyContent={'space-between'} ssx={{
                    width: "100%",
                    m: 0,
                }}>
                    <Grid item xs={12} md={6} sx={{
                        width: { xs: '100%', md: "50%" },
                        flexBasis: { xs: '100%', md: "50%" },
                    }}>
                        <Typography fontSize={{ xs: 16, sm: 20, md: 26 }} fontWeight={900} color="#fff">
                            WELCOME BACK {authUser?.emp_name?.toUpperCase() || "EMPLOYEE"}.
                        </Typography>
                        <Typography fontSize={{ xs: 10, sm: 11, md: 13 }} color="rgba(255,255,255,0.88)">
                            Track calls, follow-ups, appointments, renewals, and overall performance in one place.
                        </Typography>
                    </Grid>

                    {/* Incentive */}
                    <Grid item xs={12} md={6} sx={{
                        width: { xs: '100%', md: "40%" },
                        flexBasis:{ xs: '100%', md: "40%" },
                        display: "flex",
                        justifyContent: {
                            xs: "center",
                            md: "flex-end",
                        },
                    }}>
                        <EmployeeIncentiveCard
                            captureCount={CaptureCount}
                            incentiveAmount={incentiveAmount?.current_incentive}
                            slabs={IncentiveSlabDetail}
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
                height: '80vh'
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
                            }}>
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
                                    )))}
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
                        <Box
                            sx={{
                                flex: 2, // ~33%
                                minWidth: 0,
                            }}>

                            {LoadingReminderData ? (
                                <DashboardRemindersCardSkeleton />
                            ) : (
                                <DashboardRemindersCard
                                    remindersData={remindersData}
                                />
                            )}

                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    flex: 1,
                    minWidth: 0,
                    height: '90%',
                }}>
                    <Box
                        sx={{
                            flex: 1,
                            height: '100%'
                        }}>
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