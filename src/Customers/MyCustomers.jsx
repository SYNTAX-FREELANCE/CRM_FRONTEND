import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
    Stack,
    useMediaQuery,
    useTheme,
    Grid,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import React, { memo, Suspense, useState } from 'react'
import { useNavigate } from "react-router-dom";
import DashboardDateFilter from "../Admin/Components/DashboardDateFilter";
import { getAuthUser } from "../constant/Constant";
import { format, subDays } from "date-fns";
import { RenewalCustomerColumns } from "./RenewalCustomerColumns";
import { DataGrid } from "@mui/x-data-grid";
import { useGetEmployeePolicyDetails, useGetMyEmployeeActiveCalls } from "../CommonCode/useQuery";
import DashboardStatCard from "./CustomersComponents/DashboardStatCard";
import StatusCountCardSkeleton from "../SkeletonComponent/StatusCountCardSkeleton";

const MyCustomers = () => {
    const navigate = useNavigate();

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const authUser = getAuthUser();


    const isMobile = useMediaQuery("(max-width:600px)");

    const openCustomer = (row) => {
        navigate(`/home/customer/${row.customer_id}`, {
            state: row,
        });
    };

    const columns = RenewalCustomerColumns(openCustomer, isMobile, isDark);

    const { id } = authUser ?? {};
    const today = new Date();

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [dateFilter, setDateFilter] = useState("7days");

    const [fromDate, setFromDate] = useState(format(subDays(today, 6), "yyyy-MM-dd"));

    const [toDate, setToDate] = useState(format(today, "yyyy-MM-dd"));

    const {
        data: AllCallDetails = [],
        isLoading: LoadingTableData,
        refetch
    } = useGetMyEmployeeActiveCalls(id);

    const {
        data: DashBoardPolicyDetails = [],
        isLoading: LoadingDashboardDetails,
        refetch: FetchDashboardCountDetails
    } = useGetEmployeePolicyDetails(id);

    const rows = Array.isArray(AllCallDetails) ?
        AllCallDetails?.filter(item => Number(item.status_id) === 5) :
        [];

    const dashboardStats = [
        {
            title: "Total Sold",
            count: DashBoardPolicyDetails?.total_sold ?? 0,
        },
        {
            title: "This Month",
            count: DashBoardPolicyDetails?.this_month ?? 0,
        },
        {
            title: "Total Premium",
            count: Number(DashBoardPolicyDetails?.total_premium ?? 0).toLocaleString(
                "en-IN",
                {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                }
            ),
        },
        {
            title: "Renewal Due",
            count: DashBoardPolicyDetails?.renewal_due ?? 0,
        },
        {
            title: "Expired",
            count: DashBoardPolicyDetails?.expired ?? 0,
        },
    ];

    return (
        <Box
            sx={{
                minHeight: "95vh",
                width: "100%",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                background: isDark
                    ? `
                      radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.18) 0%, transparent 45%),
                      radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.15) 0%, transparent 45%),
                      linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
                    `
                    : `
                      radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
                      radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
                      linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
                    `,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    minHeight: "95vh",
                    width: "100%",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.65)",
                    boxShadow: isDark ? "0 20px 40px rgba(0, 0, 0, 0.5)" : "0 20px 40px rgba(15, 23, 42, 0.05)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 0,
                    background: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(24px)",
                }}
            >
                <Box
                    sx={{
                        px: { xs: 2, md: 3 },
                        py: 1.5,
                        borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(226, 232, 240, 0.6)",
                        flex: "0 0 auto",
                    }}
                >
                    <Card
                        sx={{
                            borderRadius: 5,
                            px: 2,
                            py: 2,
                            mb: 4,
                            background: "linear-gradient(135deg, #282726 0%, #050505 50%, #2554b4a8 100%)",
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
                                <Typography fontSize={{ xs: 16, sm: 20, md: 26 }} fontWeight={900} color="#fff7f7">
                                    POLICY HOLDERS
                                </Typography>
                                <Typography fontSize={{ xs: 10, sm: 11, md: 13 }} sx={{
                                    fontWeight: 800
                                }} color="rgba(255, 248, 248, 0.88)">
                                    View and manage your sold customers, monitor policy details, and stay prepared for upcoming renewals.
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
                                sm: "repeat(3, minmax(0, 1fr))",
                                md: "repeat(5, minmax(0, 1fr))",
                                lg: "repeat(5, minmax(0, 1fr))",
                            },
                            gap: 2,
                            width: '100%',
                            mt: 1
                        }}
                    >
                        {
                            LoadingDashboardDetails ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <StatusCountCardSkeleton key={index} />
                                ))
                            ) : (
                                dashboardStats?.map((item, index) => (
                                    <Suspense fallback={<StatusCountCardSkeleton />} key={index}>
                                        <DashboardStatCard
                                            title={item.title}
                                            count={item.count}
                                            isDark={isDark}
                                            borderColor="#ffb52c"
                                            onClick={() => { }}
                                        />
                                    </Suspense>
                                ))
                            )
                        }
                    </Box>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        width: "100%",
                        borderRadius: 4,
                        overflowX: "hidden",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.55)",
                        background: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.25)",
                        backdropFilter: "blur(16px)",
                        boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.3)" : "0 10px 30px rgba(15, 23, 42, 0.02)",
                        p: 2
                    }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.lead_id}
                        onRowClick={(params) => openCustomer(params.row)}
                        pageSizeOptions={[5, 10, 25, 50]}
                        rowHeight={36}
                        slotProps={{
                            loadingOverlay: {
                                variant: "skeleton",
                                noRowsVariant: "skeleton",
                            },
                        }}
                        columnHeaderHeight={44}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                        }}
                        sx={{
                            height: "100%",
                            width: "100%",
                            border: "none",
                            fontSize: "13px",
                            backgroundColor: "transparent",
                            color: isDark ? "#f8fafc" : undefined,
                            "& .MuiDataGrid-columnHeaders": {
                                background: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(248, 250, 252, 0.55)",
                                minHeight: "44px !important",
                                maxHeight: "44px !important",
                                borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(226, 232, 240, 0.6)",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                padding: "0 12px",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontWeight: 800,
                                color: isDark ? "#f8fafc" : "#0d0f0e",
                                fontSize: "12px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            },
                            "& .MuiDataGrid-cell": {
                                padding: "12px 12px",
                                borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(226, 232, 240, 0.4)",
                                outline: "none !important",
                                color: isDark ? "#cbd5e1" : undefined,
                            },
                            "& .MuiDataGrid-row": {
                                cursor: "pointer",
                                background: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.15)",
                                transition: "background-color 0.15s ease",
                                "&:hover": {
                                    backgroundColor: isDark ? "rgba(37,99,235,0.18)" : "rgba(37,99,235,0.04)",
                                },
                            },
                            "& .MuiDataGrid-footerContainer": {
                                minHeight: "44px",
                                borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(226, 232, 240, 0.6)",
                                background: isDark ? "rgba(15, 23, 42, 0.8)" : "rgba(248, 250, 252, 0.55)",
                                color: isDark ? "#f8fafc" : undefined,
                                "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiIconButton-root": {
                                    color: isDark ? "#f8fafc" : undefined,
                                },
                            },
                            "& .MuiDataGrid-virtualScroller": {
                                overflowY: "auto",
                            },
                        }}
                    />
                </Paper>
            </Paper>
        </Box>
    );
};

export default memo(MyCustomers);