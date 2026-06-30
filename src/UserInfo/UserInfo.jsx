import React, { useState } from "react";
import {
    Box,
    Card,
    Typography,
    Input,
    Button,
    Avatar,
    IconButton,
    Chip,
    Grid,
    Sheet,
    Table,
    CircularProgress
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import { useNavigate } from "react-router-dom";
import { axioslogin } from "../Axios/axios";
import { errorNotify, warningNotify } from "../constant/Constant";
import { useRoleMaster } from "../CommonCode/useQuery";
import { useQuery } from "@tanstack/react-query";

const UserInfo = () => {
    const navigate = useNavigate();

    // Fetch roles master for chips filter
    const { data: rolesData } = useRoleMaster();

    // Search and filter states (updated in real-time)
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    // View mode: 'card' or 'list'
    const [viewMode, setViewMode] = useState("card");

    // Fetch employee list using useQuery
    const { data: employeeListData, isLoading: loading } = useQuery({
        queryKey: ["userInfoEmployees"],
        queryFn: async () => {
            try {
                const response = await axioslogin.get("/userinfo/employees");
                if (response.data && response.data.success === 1) {
                    return response.data.data || [];
                }
                warningNotify(response.data?.message || "No employees found");
                return [];
            } catch (error) {
                console.error("Error fetching employees:", error);
                errorNotify("Failed to load employee list");
                return [];
            }
        }
    });

    const employees = employeeListData || [];

    // Filter employees based on keyword & selected role chip dynamically in real-time
    const getFilteredEmployees = () => {
        return employees.filter((emp) => {
            // 1. Role Filter Chip selection
            if (selectedRole) {
                const matchRoleId = emp.role_id && emp.role_id.toString() === selectedRole;
                const matchRoleName = emp.role_name && emp.role_name.toLowerCase() === selectedRole.toLowerCase();
                if (!matchRoleId && !matchRoleName) return false;
            }

            // 2. Keyword Search (matches Name, ID, Phone, Role, Company)
            if (searchKeyword.trim()) {
                const term = searchKeyword.toLowerCase().trim();
                const matchesName = emp.name && emp.name.toLowerCase().includes(term);
                const matchesId = emp.employee_id && emp.employee_id.toString().includes(term);
                const matchesPhone = emp.mobile_number_1 && emp.mobile_number_1.includes(term);
                const matchesRole = emp.role_name && emp.role_name.toLowerCase().includes(term);
                const matchesCompany = emp.company_name && emp.company_name.toLowerCase().includes(term);

                return matchesName || matchesId || matchesPhone || matchesRole || matchesCompany;
            }

            return true;
        });
    };

    // Handle viewing employee details
    const handleViewDetails = (emp) => {
        navigate(`/home/userinfo/${emp.employee_id}`);
    };


    const filteredEmployees = getFilteredEmployees();

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                maxWidth: "1400px",
                margin: "0 auto",
                fontFamily: "'Inter', sans-serif",
                borderRadius: "24px",
                background: "radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.16) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(249, 115, 22, 0.12) 0%, transparent 50%), linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #fff7ed 100%)",
                border: "1px solid rgba(255, 255, 255, 0.65)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.02)",
                minHeight: "80vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    flexWrap: "wrap",
                    gap: 2.5,
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Input
                    placeholder="Search by name, ID, phone, role..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    startDecorator={<SearchIcon sx={{ color: "neutral.500" }} />}
                    sx={{
                        width: { xs: "100%", sm: "400px" },
                        flexShrink: 0,
                        height: "44px",
                        borderRadius: "14px",
                        background: "rgba(255, 255, 255, 0.55)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.45)",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.03)",
                        "--Input-focusedHighlight": "rgba(99, 102, 241, 0.25)",
                    }}
                />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        background: "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        p: "4px",
                        borderRadius: "14px",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
                        flexShrink: 0,
                        alignSelf: { xs: "flex-end", sm: "auto" },
                    }}
                >
                    <IconButton
                        size="sm"
                        variant={viewMode === "card" ? "solid" : "plain"}
                        onClick={() => setViewMode("card")}
                        sx={{
                            borderRadius: "lg",
                            width: "32px",
                            height: "32px",
                            ...(viewMode === "card"
                                ? { bgcolor: "rgba(99, 102, 241, 0.85)", color: "white", "&:hover": { bgcolor: "rgba(79, 70, 229, 0.95)" } }
                                : { color: "#475569", "&:hover": { background: "rgba(0,0,0,0.04)" } }),
                        }}
                    >
                        <GridViewIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                        size="sm"
                        variant={viewMode === "list" ? "solid" : "plain"}
                        onClick={() => setViewMode("list")}
                        sx={{
                            borderRadius: "lg",
                            width: "32px",
                            height: "32px",
                            ...(viewMode === "list"
                                ? { bgcolor: "rgba(99, 102, 241, 0.85)", color: "white", "&:hover": { bgcolor: "rgba(79, 70, 229, 0.95)" } }
                                : { color: "#475569", "&:hover": { background: "rgba(0,0,0,0.04)" } }),
                        }}
                    >
                        <FormatListBulletedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                <Typography level="body-xs" sx={{ fontWeight: 700, color: "neutral.600", mr: 1 }}>
                    Filter by Role:
                </Typography>
                <Chip
                    variant={selectedRole === "" ? "solid" : "soft"}
                    onClick={() => setSelectedRole("")}
                    sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        borderRadius: "lg",
                        px: 2,
                        py: 0.5,
                        backdropFilter: "blur(6px)",
                        transition: "all 0.2s ease",
                        ...(selectedRole === ""
                            ? { bgcolor: "rgba(99, 102, 241, 0.85)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }
                            : { bgcolor: "rgba(255, 255, 255, 0.4)", color: "neutral.700", border: "1px solid rgba(255, 255, 255, 0.45)", "&:hover": { bgcolor: "rgba(255,255,255,0.6)" } }),
                    }}
                >
                    All Staff
                </Chip>
                {rolesData && rolesData.filter(r => r.is_active === 1).map((role) => {
                    const isSelected = selectedRole === role.role_name;
                    return (
                        <Chip
                            key={role.role_id}
                            variant={isSelected ? "solid" : "soft"}
                            onClick={() => setSelectedRole(role.role_name)}
                            sx={{
                                cursor: "pointer",
                                fontWeight: 600,
                                borderRadius: "lg",
                                px: 2,
                                py: 0.5,
                                backdropFilter: "blur(6px)",
                                transition: "all 0.2s ease",
                                ...(isSelected
                                    ? { bgcolor: "rgba(99, 102, 241, 0.85)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }
                                    : { bgcolor: "rgba(255, 255, 255, 0.4)", color: "neutral.700", border: "1px solid rgba(255, 255, 255, 0.45)", "&:hover": { bgcolor: "rgba(255,255,255,0.6)" } }),
                            }}
                        >
                            {role.role_name}
                        </Chip>
                    );
                })}
            </Box>

            <Box sx={{ minHeight: "250px", mt: 1, width: "100%", overflow: "hidden" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8, flexDirection: "column", gap: 2 }}>
                        <CircularProgress size="lg" />
                        <Typography level="body-sm" color="neutral">Loading staff directory...</Typography>
                    </Box>
                ) : filteredEmployees.length === 0 ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8, flexDirection: "column", gap: 1.5 }}>
                        <Typography level="h4" color="neutral">No Record Found</Typography>
                        <Typography level="body-sm" color="neutral">Try modifying your search criteria.</Typography>
                    </Box>
                ) : viewMode === "card" ? (
                    <Grid container spacing={2.5} sx={{ width: "100%", m: 0 }}>
                        {filteredEmployees.map((emp) => (
                            <Grid xs={12} sm={6} md={4} lg={3} key={emp.employee_id || emp.user_id}>
                                <Card
                                    variant="outlined"
                                    onClick={() => handleViewDetails(emp)}
                                    sx={{
                                        p: 2.5,
                                        borderRadius: "20px",
                                        background: "rgba(255, 255, 255, 0.45)",
                                        backdropFilter: "blur(12px)",
                                        border: "1px solid rgba(255, 255, 255, 0.5)",
                                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.04)",
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "all 0.25s ease",
                                        width: "100%",
                                        boxSizing: "border-box",
                                        "&:hover": {
                                            boxShadow: "0 12px 24px rgba(31, 38, 135, 0.08)",
                                            border: "1px solid rgba(99, 102, 241, 0.4)",
                                            background: "rgba(255, 255, 255, 0.65)",
                                            transform: "translateY(-3px)",
                                        },
                                    }}
                                >
                                    <Avatar
                                        size="lg"
                                        variant="soft"
                                        sx={{
                                            width: 58,
                                            height: 58,
                                            borderRadius: "14px",
                                            background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                                            color: "#4f46e5",
                                            fontWeight: 700,
                                            fontSize: "18px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {emp.name ? emp.name.charAt(0).toUpperCase() : "E"}
                                    </Avatar>

                                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                        <Typography
                                            level="title-sm"
                                            sx={{
                                                fontWeight: 700,
                                                color: "neutral.800",
                                                m: 0,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            {emp.name}
                                        </Typography>
                                        <Typography level="body-xs" sx={{ color: "neutral.500", fontFamily: "monospace", mt: 0.5 }}>
                                            {emp.employee_id}
                                        </Typography>
                                        <Typography level="body-xs" sx={{ color: "neutral.600", mt: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {emp.mobile_number_1 || "No Phone"}
                                        </Typography>
                                        <Typography level="body-xs" sx={{ color: "neutral.600", mt: 0.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {emp.company_name || "N/A"}
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                                            <Chip
                                                size="sm"
                                                variant="solid"
                                                sx={{
                                                    bgcolor: "#e0e7ff",
                                                    color: "#4338ca",
                                                    fontWeight: 700,
                                                    fontSize: "10px",
                                                    px: 1,
                                                }}
                                            >
                                                {emp.role_name || "Staff"}
                                            </Chip>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Card
                        variant="outlined"
                        sx={{
                            width: "100%",
                            borderRadius: "20px",
                            overflow: "hidden",
                            p: 0,
                            background: "rgba(255, 255, 255, 0.45)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.04)",
                        }}
                    >
                        <Sheet sx={{ overflowX: "auto", width: "100%", background: "transparent" }}>
                            <Table
                                hoverRow
                                sx={{
                                    "--TableCell-paddingY": "12px",
                                    "--TableCell-paddingX": "14px",
                                    "& th": {
                                        background: "rgba(255, 255, 255, 0.6)",
                                        color: "neutral.700",
                                        fontWeight: "700",
                                        fontSize: "12px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                                    },
                                    "& td": {
                                        fontSize: "13px",
                                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                                    },
                                    background: "transparent",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Staff ID</th>
                                        <th>Name</th>
                                        <th>Role / Designation</th>
                                        <th>Company</th>
                                        <th>Contact No.</th>
                                        <th style={{ width: 100, textAlign: "center" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((emp) => (
                                        <tr key={emp.employee_id || emp.user_id}>
                                            <td style={{ fontWeight: 700 }}>{emp.employee_id}</td>
                                            <td>
                                                <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                                                    {emp.name}
                                                </Typography>
                                            </td>
                                            <td>{emp.role_name || "N/A"}</td>
                                            <td>{emp.company_name || "N/A"}</td>
                                            <td style={{ fontFamily: "monospace" }}>{emp.mobile_number_1 || "N/A"}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <Button
                                                    size="sm"
                                                    variant="soft"
                                                    color="primary"
                                                    onClick={() => handleViewDetails(emp)}
                                                    startDecorator={<VisibilityIcon sx={{ fontSize: 15 }} />}
                                                    sx={{
                                                        borderRadius: "md",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Sheet>
                    </Card>
                )}
            </Box>
        </Box>
    );
};

export default UserInfo;
