
import React, { lazy, Suspense, useCallback, useMemo, useState } from "react";

import {
    Box,
    Input,
    Grid,
} from "@mui/joy";

import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import EmployeeCardSkeleton from "./Components/EmployeeCardSkeleton";
import { useAuth } from "../Context/AuthContext";
import { useAllEmployeeDetails } from "../CommonCode/useQuery";

import {
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { useThemeMode } from "../Context/ThemeContext";

const EmployeeCard = lazy(() => import("./Components/EmployeeCard"));

const UserInfo = () => {

    const navigate = useNavigate();

    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const [searchKeyword, setSearchKeyword] = useState("");

    const { user } = useAuth();

    const isAdmin = user?.role?.toLowerCase() === "admin";

    const {
        data: employeeListData = [],
        isLoading: loading,
    } = useAllEmployeeDetails();

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
                .some((value) =>
                    value.toString().toLowerCase().includes(term)
                )
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

                position: "relative",

                px: {
                    xs: 1.5,
                    sm: 2,
                    md: 3,
                },

                py: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                },

                // background: isDark
                //     ? `
                //         radial-gradient(
                //             circle at 5% 10%,
                //             rgba(59,130,246,0.09),
                //             transparent 35%
                //         ),
                //         radial-gradient(
                //             circle at 5% 90%,
                //             rgba(16,185,129,0.07),
                //             transparent 30%
                //         ),
                //         #0f172a
                //     `
                //     : `
                //         radial-gradient(
                //             circle at 5% 10%,
                //             rgba(111,207,207,0.35),
                //             transparent 32%
                //         ),
                //         radial-gradient(
                //             circle at 5% 90%,
                //             rgba(255,218,140,0.35),
                //             transparent 30%
                //         ),
                //         #e7f3eb
                //     `,

                transition: "background 0.3s ease",
            }}
        >

            {/* MAIN CONTAINER */}

            <Paper
                elevation={0}
                sx={{
                    minHeight: "90vh",
                    width: "100%",

                    // border: isDark
                    //     ? "1px solid rgba(255,255,255,0.08)"
                    //     : "1px solid rgba(255,255,255,0.75)",

                    // boxShadow: isDark
                    //     ? "0 15px 40px rgba(0,0,0,0.22)"
                    //     : "0 12px 35px rgba(35,65,45,0.06)",

                    overflow: "hidden",

                    display: "flex",
                    flexDirection: "column",

                    borderRadius: "24px",

                    background: isDark
                        ? "rgba(15,23,42,0.75)"
                        : "rgba(255,255,255,0.38)",

                    // backdropFilter: "blur(24px)",

                    transition: "all 0.3s ease",
                }}
            >

                {/* HEADER */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 2.5,
                            md: 3,
                        },

                        py: {
                            xs: 2,
                            sm: 2.5,
                        },

                        // borderBottom: isDark
                        //     ? "1px solid rgba(255,255,255,0.07)"
                        //     : "1px solid rgba(255,255,255,0.75)",

                        background: isDark
                            ? "rgba(15,23,42,0.35)"
                            : "rgba(255,255,255,0.3)",

                        flex: "0 0 auto",
                    }}
                >

                    <Stack
                        direction={{
                            xs: "column",
                            md: "row",
                        }}

                        justifyContent="space-between"

                        alignItems={{
                            xs: "stretch",
                            md: "center",
                        }}

                        gap={2}
                    >

                        {/* TITLE SECTION */}

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.8,
                                minWidth: 0,
                            }}
                        >

                            {/* ICON */}

                            <Box
                                sx={{
                                    width: {
                                        xs: 45,
                                        sm: 53,
                                    },

                                    height: {
                                        xs: 45,
                                        sm: 53,
                                    },

                                    flexShrink: 0,

                                    borderRadius: "17px",

                                    background:
                                        "linear-gradient(135deg, #ee8207 0%, #ffebb5 50%, #077bff 100%)",

                                    color: "#172033",

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    boxShadow: isDark
                                        ? "0 6px 18px rgba(0,0,0,0.3)"
                                        : "0 6px 18px rgba(15,23,42,0.12)",
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        fontSize: {
                                            xs: 23,
                                            sm: 27,
                                        },
                                        fontWeight: 900,
                                    }}
                                >
                                    👥
                                </Box>
                            </Box>

                            {/* HEADING */}

                            <Box
                                sx={{
                                    minWidth: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 22,
                                            sm: 27,
                                            md: 30,
                                        },

                                        fontWeight: 850,

                                        color: isDark
                                            ? "#f1f5f9"
                                            : "#202938",

                                        letterSpacing: "-0.6px",
                                        lineHeight: 1.15,
                                    }}
                                >
                                    Employees
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 0.6,

                                        fontSize: {
                                            xs: 11,
                                            sm: 13,
                                        },

                                        fontWeight: 400,

                                        color: isDark
                                            ? "#94a3b8"
                                            : "#727d83",
                                    }}
                                >
                                    Search and view employee records.
                                </Typography>
                            </Box>

                        </Box>


                        {/* SEARCH */}

                        <Box
                            sx={{
                                width: {
                                    xs: "100%",
                                    md: 320,
                                    lg: 380,
                                },

                                flexShrink: 0,
                            }}
                        >

                            <Input
                                placeholder="Search employees..."

                                value={searchKeyword}

                                onChange={(e) =>
                                    setSearchKeyword(e.target.value)
                                }

                                startDecorator={
                                    <Box
                                        sx={{
                                            width: 38,
                                            height: 38,

                                            borderRadius: "12px",

                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",

                                            bgcolor: isDark
                                                ? "rgba(16,185,129,0.15)"
                                                : "#e0f0e5",

                                            color: isDark
                                                ? "#6ee7b7"
                                                : "#168044",

                                            flexShrink: 0,
                                        }}
                                    >
                                        <SearchIcon
                                            sx={{
                                                fontSize: 19,
                                            }}
                                        />
                                    </Box>
                                }

                                size="lg"

                                sx={{
                                    width: "100%",
                                    minHeight: 54,

                                    borderRadius: "17px",

                                    px: 1,

                                    bgcolor: isDark
                                        ? "rgba(30,41,59,0.8)"
                                        : "rgba(255,255,255,0.9)",

                                    color: isDark
                                        ? "#f1f5f9"
                                        : "#202938",

                                    border: isDark
                                        ? "1px solid rgba(255,255,255,0.1)"
                                        : "1px solid rgba(255,255,255,0.9)",

                                    boxShadow: isDark
                                        ? "0 4px 14px rgba(0,0,0,0.12)"
                                        : "0 4px 14px rgba(35,65,45,0.05)",

                                    transition: "all 0.25s ease",

                                    "&:hover": {
                                        borderColor: isDark
                                            ? "rgba(16,185,129,0.4)"
                                            : "rgba(22,128,68,0.3)",
                                    },

                                    "&:focus-within": {
                                        borderColor: isDark
                                            ? "#34d399"
                                            : "#168044",

                                        boxShadow: isDark
                                            ? "0 0 0 3px rgba(52,211,153,0.12)"
                                            : "0 0 0 3px rgba(22,128,68,0.08)",
                                    },

                                    "& input": {
                                        color: isDark
                                            ? "#f1f5f9"
                                            : "#202938",

                                        fontSize: 14,

                                        "&::placeholder": {
                                            color: isDark
                                                ? "#94a3b8"
                                                : "#78818a",

                                            opacity: 1,
                                        },
                                    },
                                }}
                            />

                        </Box>

                    </Stack>

                </Box>


                {/* EMPLOYEE CONTENT */}

                <Box
                    sx={{
                        minHeight: 260,

                        mt: 1.5,

                        px: {
                            xs: 1,
                            sm: 1.5,
                            md: 2,
                        },

                        pb: 3,

                        flex: 1,
                    }}
                >

                    {loading ? (

                        <EmployeeCardSkeleton />

                    ) : filteredEmployees.length === 0 ? (

                        /* EMPTY STATE */

                        <Box
                            sx={{
                                minHeight: 300,

                                display: "flex",
                                flexDirection: "column",

                                alignItems: "center",
                                justifyContent: "center",

                                textAlign: "center",

                                borderRadius: "20px",

                                p: 3,
                            }}
                        >

                            <Box
                                sx={{
                                    width: 75,
                                    height: 75,

                                    borderRadius: "24px",

                                    display: "grid",
                                    placeItems: "center",

                                    bgcolor: isDark
                                        ? "rgba(16,185,129,0.12)"
                                        : "rgba(22,128,68,0.09)",

                                    color: isDark
                                        ? "#6ee7b7"
                                        : "#168044",

                                    mb: 2,
                                }}
                            >
                                <SearchIcon
                                    sx={{
                                        fontSize: 36,
                                    }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: 21,
                                    fontWeight: 800,
                                    color: isDark
                                        ? "#f1f5f9"
                                        : "#202938",
                                }}
                            >
                                No Record Found
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.8,
                                    fontSize: 13,
                                    color: isDark
                                        ? "#94a3b8"
                                        : "#78818a",
                                }}
                            >
                                Try a different keyword.
                            </Typography>

                        </Box>

                    ) : (

                        /* EMPLOYEE GRID */

                        <Box
                            sx={{
                                display: "grid",

                                gridTemplateColumns: {
                                    xs: "repeat(1, minmax(0, 1fr))",
                                    sm: "repeat(1, minmax(0, 1fr))",
                                    md: "repeat(2, minmax(0, 1fr))",
                                    lg: "repeat(3, minmax(0, 1fr))",
                                },

                                gap: {
                                    xs: 1.5,
                                    sm: 1.5,
                                    md: 2,
                                },

                                width: "100%",
                            }}
                        >

                            {filteredEmployees?.map((emp) => (

                                <Grid
                                    key={
                                        emp.employee_id || emp.user_id
                                    }
                                >
                                    <Suspense
                                        fallback={
                                            <EmployeeCardSkeleton />
                                        }
                                    >
                                        <EmployeeCard
                                            emp={emp}
                                            onClick={handleViewDetails}
                                        />
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
