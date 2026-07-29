
import React, { lazy, Suspense, useCallback, useMemo, useState } from "react";
import {
    Box,

    Input,
    Grid,
    CircularProgress,
    Divider,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { errorNotify, warningNotify } from "../constant/Constant";
import { useQuery } from "@tanstack/react-query";
import EmployeeCardSkeleton from "./Components/EmployeeCardSkeleton";
import { useAuth } from "../Context/AuthContext";
import { useAllEmployeeDetails } from "../CommonCode/useQuery";
import { Paper, Stack, Typography } from "@mui/material";
import GlobalLoader from "../CommonComponents/GlobalLoader";
import { useThemeMode } from "../Context/ThemeContext";

const EmployeeCard = lazy(() => import('./Components/EmployeeCard'))

const UserInfo = () => {
    const navigate = useNavigate();
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const [searchKeyword, setSearchKeyword] = useState("");
    const { user } = useAuth();
    const isAdmin = user?.role?.toLowerCase() === "admin";

    const { data: employeeListData = [], isLoading: loading } = useAllEmployeeDetails()

    const employees = employeeListData || [];

    const filteredEmployees = useMemo(() => {
        const term = searchKeyword.trim().toLowerCase();
        if (!term) return employees;

        return employees?.filter((emp) =>
            [
                emp.name,
                emp.employee_id,
                emp.mobile_number_1,
                emp.role_name,
                emp.company_name,
            ]
                .filter(Boolean)
                .some((value) => value.toString().toLowerCase().includes(term))
        );
    }, [employees, searchKeyword]);

    const handleViewDetails = useCallback((emp) => {
        navigate(`/home/userinfo/${emp.user_id}`);
    }, [navigate]);

    if (!isAdmin) {
        return null;
    }

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
                      radial-gradient(circle at 15% 25%, rgba(30, 41, 59, 0.4) 0%, transparent 45%),
                      radial-gradient(circle at 85% 75%, rgba(15, 23, 42, 0.6) 0%, transparent 45%),
                      linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)
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
                    boxShadow: isDark ? "0 20px 40px rgba(0, 0, 0, 0.6)" : "0 20px 40px rgba(15, 23, 42, 0.05)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 0,
                    background: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(24px)",
                }}
            >
                <Box
                    sx={{
                        px: { xs: 2, md: 3 },
                        py: 2.5,
                        borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(226, 232, 240, 0.6)",
                        background: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.35)",
                        flex: "0 0 auto",
                    }}>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", md: "center" }}
                        gap={2}
                    >
                        <Box>
                            <Typography variant="h5" fontWeight={900} color={isDark ? "#f8fafc" : "#0f172a"} sx={{ letterSpacing: "-0.5px" }}>
                                Employees
                            </Typography>
                            <Typography variant="body2" color={isDark ? "#94a3b8" : "#475569"} sx={{ mt: 0.5, fontWeight: 500 }}>
                                Search and view employee records.
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 1,
                                alignItems: "center",
                                width: { xs: "100%", md: "auto" },
                            }}
                        >
                            <Input
                                placeholder="Search employees"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                startDecorator={<SearchIcon sx={{ color: isDark ? "#94a3b8" : "neutral.500" }} />}
                                size="sm"
                                sx={{
                                    width: { xs: "100%", sm: 300 },
                                    borderRadius: "12px",
                                    bgcolor: isDark ? "#0f172a" : "#fff",
                                    color: isDark ? "#f8fafc" : "#0f172a",
                                    border: isDark ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid #cbd5e1",
                                    "& input": {
                                        color: isDark ? "#f8fafc" : "#0f172a",
                                    },
                                    "& input::placeholder": {
                                        color: isDark ? "#94a3b8" : "#64748b",
                                    }
                                }}
                            />
                        </Box>
                    </Stack>
                </Box>


                <Box sx={{ minHeight: 260, mt: 2, p: 1 }}>
                    {loading ? (
                        <EmployeeCardSkeleton />
                    ) : filteredEmployees.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <Typography level="h4" sx={{ fontWeight: 700, color: isDark ? "#f8fafc" : "inherit" }}>
                                No Record Found
                            </Typography>
                            <Typography level="body-sm" sx={{ color: isDark ? "#94a3b8" : "neutral.500", mt: 1 }}>
                                Try a different keyword.
                            </Typography>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(1, minmax(0, 1fr))",
                                    sm: "repeat(1, minmax(0, 1fr))",
                                    md: "repeat(2, minmax(0, 1fr))",
                                    lg: "repeat(3, minmax(0, 1fr))",
                                },
                                gap: 1,
                                width: "100%",
                            }}>
                            {filteredEmployees?.map((emp) => (
                                <Grid key={emp.employee_id || emp.user_id}>
                                    <Suspense fallback={<EmployeeCardSkeleton />}>
                                        <EmployeeCard emp={emp} onClick={handleViewDetails} />
                                    </Suspense>
                                </Grid>
                            ))}
                        </Box>
                    )}
                </Box>

            </Paper>
        </Box>
    );
};

export default UserInfo;