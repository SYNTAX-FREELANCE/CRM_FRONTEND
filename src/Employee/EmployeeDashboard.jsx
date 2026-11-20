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
                    borderRadius: 4,
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 2, sm: 2.5 },
                    mb: 1,
                    background: "linear-gradient(110deg, #164e63 0%, #087e91 55%, #8a9d54 100%)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 5px 18px rgba(20, 70, 75, 0.18)",
                    border: "1px solid rgba(255,255,255,0.12)",
                }}
            >
                {/* Background Decoration */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -80,
                        right: "25%",
                        width: 180,
                        height: 180,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.05)",
                        pointerEvents: "none",
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        bottom: -100,
                        left: "35%",
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        bgcolor: "rgba(255,255,255,0.04)",
                        pointerEvents: "none",
                    }}
                />

                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        width: "100%",
                        m: 0,
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Welcome Section */}
                    <Grid
                        item
                        xs={12}
                        md={7}
                        sx={{
                            width: { xs: "100%", md: "60%" },
                            flexBasis: { xs: "100%", md: "60%" },
                        }}
                    >
                        <Typography
                            fontSize={10}
                            fontWeight={800}
                            letterSpacing={1.3}
                            color="rgba(255,255,255,0.75)"
                            sx={{ mb: 0.5 }}
                        >
                            WELCOME BACK
                        </Typography>

                        <Typography
                            fontSize={{ xs: 19, sm: 23, md: 26 }}
                            fontWeight={900}
                            color="#FFFFFF"
                            lineHeight={1.2}
                            sx={{ mb: 0.7 }}
                        >
                            {authUser?.emp_name?.toUpperCase() || "EMPLOYEE"} 👋
                        </Typography>

                        <Typography
                            fontSize={{ xs: 10, sm: 11, md: 12 }}
                            fontWeight={600}
                            color="rgba(255,255,255,0.88)"
                            sx={{
                                lineHeight: 1.6,
                                maxWidth: 550,
                            }}
                        >
                            Your day at a glance: track calls, follow-ups, appointments,
                            renewals, and see how your performance is progressing.
                        </Typography>
                    </Grid>

                    {/* Incentive Section */}
                    <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                            width: { xs: "100%", md: "38%" },
                            flexBasis: { xs: "100%", md: "38%" },
                            display: "flex",
                            justifyContent: {
                                xs: "flex-start",
                                md: "flex-end",
                            },
                            alignItems: "center",
                        }}
                    >
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
                                    lg: "repeat(8, minmax(0, 1fr))",
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