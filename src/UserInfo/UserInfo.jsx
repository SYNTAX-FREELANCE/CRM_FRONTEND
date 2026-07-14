import React, { lazy, Suspense, useMemo, useState } from "react";
import {
    Box,
    // Card,
    Typography,
    Input,
    // Button,
    // Avatar,
    Grid,
    CircularProgress,
    Divider,
    // Chip,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
// import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
// import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
// import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import { useNavigate } from "react-router-dom";
import { axioslogin } from "../Axios/axios";
import { errorNotify, warningNotify } from "../constant/Constant";
import { useQuery } from "@tanstack/react-query";
// import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
// import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
// import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";


const EmployeeCard = lazy(() => import('./Components/EmployeeCard'))


const UserInfo = () => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState("");
    // const [viewMode, setViewMode] = useState("card");

    const { data: employeeListData, isLoading: loading } = useQuery({
        queryKey: ["userInfoEmployees"],
        queryFn: async () => {
            try {
                const response = await axioslogin.get("/userinfo/employees");
                if (response.data?.success === 1) return response.data.data || [];
                warningNotify(response.data?.message || "No employees found");
                return [];
            } catch (error) {
                console.error("Error fetching employees:", error);
                errorNotify("Failed to load employee list");
                return [];
            }
        },
    });

    const employees = employeeListData || [];

    const filteredEmployees = useMemo(() => {
        const term = searchKeyword.trim().toLowerCase();
        if (!term) return employees;

        return employees.filter((emp) =>
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

    const handleViewDetails = (emp) => {
        navigate(`/home/userinfo/${emp.user_id}`);
    };


    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: "20px",
                minHeight: "80vh",
                bgcolor: "#f8fafc",
                border: "1px solid rgba(226, 232, 240, 1)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", md: "center" },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography level="h3" sx={{ fontWeight: 800, color: "#0f172a" }}>
                        Employees
                    </Typography>
                    <Typography level="body-sm" sx={{ color: "neutral.500", mt: 0.5 }}>
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
                        startDecorator={<SearchIcon sx={{ color: "neutral.500" }} />}
                        size="sm"
                        sx={{
                            width: { xs: "100%", sm: 300 },
                            borderRadius: "12px",
                            bgcolor: "#fff",
                        }}
                    />
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ minHeight: 260 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress size="lg" />
                    </Box>
                ) : filteredEmployees.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Typography level="h4" sx={{ fontWeight: 700 }}>
                            No Record Found
                        </Typography>
                        <Typography level="body-sm" sx={{ color: "neutral.500", mt: 1 }}>
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
        </Box>
    );
};

export default UserInfo;