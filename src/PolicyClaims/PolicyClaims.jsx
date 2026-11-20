import {
    Box,
    Paper,
    Typography,
    Card,
    useMediaQuery,
    useTheme,
    Grid,
} from "@mui/material";
import React, { memo, useMemo, useState, } from 'react'
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "../constant/Constant";
// import { RenewalCustomerColumns } from "./RenewalCustomerColumns";
import { DataGrid } from "@mui/x-data-grid";
import {
    useFetchActivePolicyClaims,
} from "../CommonCode/useQuery";

import { PolicyClaimToolbar } from "../FreshCall/Components/CustomToolbar";
import { PolicyClaimColumns } from "./ClaimComponents/PolicyClaimColumns";
import PolicyClaimDrawer from "./ClaimComponents/PolicyClaimDrawer";

const PolicyClaims = () => {


    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [selectedMonth, setSelectedMonth] = useState("");
    const authUser = getAuthUser();
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [claimDrawerOpen, setClaimDrawerOpen] = useState(false);



    const openClaim = (row) => {
        setSelectedClaim(row);
        setClaimDrawerOpen(true);
    };

    const isMobile = useMediaQuery("(max-width:600px)");



    const columns = PolicyClaimColumns(openClaim, isMobile, isDark);

    const { id } = authUser ?? {};


    const { data: rows = [],
        isLoading: LoadingTableData,
        refetch: FetchPloicyClaims
    } = useFetchActivePolicyClaims();

    const filteredRows = useMemo(() => {
        if (!selectedMonth) {
            return rows;
        }

        return rows.filter((row) => {
            if (!row.claim_date) return false;

            const date = new Date(row.claim_date);

            if (isNaN(date.getTime())) return false;

            const rowMonth = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

            return rowMonth === selectedMonth;
        });
    }, [rows, selectedMonth]);




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
                                    POLICY CLAIM DETAILS
                                </Typography>
                                <Typography fontSize={{ xs: 10, sm: 11, md: 13 }} sx={{
                                    fontWeight: 800
                                }} color="rgba(255, 248, 248, 0.88)">
                                    Review claim information, track settlement progress, and manage claim status updates.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
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
                        rows={filteredRows}
                        columns={columns}
                        showToolbar
                        slots={{
                            toolbar: PolicyClaimToolbar,
                        }}

                        loading={LoadingTableData}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.claim_id}
                        onRowClick={(params) => openClaim(params.row)}
                        pageSizeOptions={[5, 10, 25, 50]}
                        rowHeight={36}
                        slotProps={{
                            loadingOverlay: {
                                variant: "skeleton",
                                noRowsVariant: "skeleton",
                            },
                            toolbar: {
                                selectedMonth,
                                setSelectedMonth,
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


            <PolicyClaimDrawer
                open={claimDrawerOpen}
                onClose={() => setClaimDrawerOpen(false)}
                claim={selectedClaim}
                refetch={FetchPloicyClaims}
            />
        </Box>
    );
};

export default memo(PolicyClaims);

