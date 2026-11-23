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
                // background: isDark
                //     ? `
                //       radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.18) 0%, transparent 45%),
                //       radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.15) 0%, transparent 45%),
                //       linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
                //     `
                //     : `
                //       radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
                //       radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
                //       linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
                //     `,
            }}
        >
            <Box
                sx={{
                    minHeight: "95vh",
                    width: "100%",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",

                    // borderRadius: 0,
                    // boxShadow: isDark ? "0 20px 40px rgba(0, 0, 0, 0.5)" : "0 20px 40px rgba(15, 23, 42, 0.05)",
                    // border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.65)",
                    // background: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(255, 255, 255, 0.5)",
                    // backdropFilter: "blur(24px)",
                }}
            >

                <Box
                    sx={{
                        px: { xs: 2, md: 1 },
                        py: 1.5,
                        flex: "0 0 auto",
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: "26px",
                            px: { xs: 2, sm: 2.5, md: 3.5 },
                            py: { xs: 2.5, md: 3 },
                            mb: 2.5,

                            background:
                                "linear-gradient(110deg, #315c70 0%, #087b91 48%, #9a9e55 100%)",

                            position: "relative",
                            overflow: "hidden",

                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",

                            minHeight: { xs: 110, md: 126 },

                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                zIndex: 1,
                                width: "100%",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "rgba(255,255,255,0.85)",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: "2px",
                                    mb: 0.4,
                                }}
                            >
                                CLAIM MANAGEMENT
                            </Typography>

                            <Typography
                                fontSize={{ xs: 21, sm: 25, md: 28 }}
                                fontWeight={900}
                                sx={{
                                    color: "#ffffff",
                                    lineHeight: 1.2,
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                Policy Claim Details
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.7,
                                    color: "rgba(255,255,255,0.9)",
                                    fontSize: { xs: 11, sm: 12, md: 14 },
                                    fontWeight: 500,
                                    lineHeight: 1.5,
                                }}
                            >
                                Review claim information, track settlement progress,
                                and manage claim status updates.
                            </Typography>
                        </Box>
                    </Card>
                </Box>


                <Box
                    elevation={0}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        width: "100%",
                        borderRadius: 4,
                        overflowX: "hidden",
                        minHeight: '70vh',
                        // border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.55)",
                        // background: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.25)",
                        // backdropFilter: "blur(16px)",
                        // boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.3)" : "0 10px 30px rgba(15, 23, 42, 0.02)",
                        p: 2,
                        background: isDark
                            ? "linear-gradient(110deg, #102c25 0%, #142f25 100%)"
                            : "linear-gradient(110deg, #e8f5ed 0%, #dcefe3 100%)",
                        border: isDark
                            ? "1px solid rgba(74, 222, 128, 0.08)"
                            : "1px solid rgba(22, 101, 52, 0.10)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                        flex: "0 0 auto",
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
                </Box>
            </Box>


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

