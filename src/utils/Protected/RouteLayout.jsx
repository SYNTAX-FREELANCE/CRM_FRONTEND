// src/utils/Protected/RouteLayout.js
import { Box } from "@mui/joy";
import { Navigate, Outlet } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import logo from "../../assets/loginimages/logo.png";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "../../Context/AuthContext";
import ReusableSidebar from "../../CommonComponents/ReusableSidebar";
import ReusableTopBar from "../../CommonComponents/ReusableTopBar";
import { axioslogin } from "../../Connection/axios";

// Material UI Icons for dynamically generated sidebar
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import GroupsIcon from "@mui/icons-material/Groups";
import { getMenu } from "../../Menu/menu";
import { useMediaQuery } from "@mui/material";
import MobileSidebar from "../../CommonComponents/MobileSidebar";
import { getAuthUser } from "../../constant/Constant";
import { useGetActiveModuleRightDetail } from "../../CommonCode/useQuery";

const RouteLayout = () => {

    const { isAuthenticated, loading, user, logout } = useAuth();
    const authUser = getAuthUser();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { role_id } = authUser ?? {};
    const { data: RoleRights = [] } = useGetActiveModuleRightDetail(role_id);

    const Menu = getMenu(RoleRights);

    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}>
                <span>Loading...</span>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                height: "100vh",
                overflow: "hidden",
                background:
                    "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #fff7ed 100%)",
            }}
        >
            {/* MOBILE TOP SIDEBAR */}
            {isMobile && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                        width: 20,
                        zIndex: 1200,
                        display: "flex",
                        alignItems: "center",
                        px: 2,

                    }}
                >
                    <MobileSidebar
                        menuItems={Menu}
                        user={{
                            name: user?.username || "Employee",
                            role: user?.role_name || "User",
                        }}
                        onLogout={logout}
                    />
                </Box>
            )}

            {/* DESKTOP SIDEBAR */}
            {!isMobile && (
                <Box
                    sx={{
                        height: "100vh",
                        flexShrink: 0,
                    }}
                >
                    <ReusableSidebar
                        menuItems={Menu}
                        user={{
                            name: user?.username || "Employee",
                            role: user?.role_name || "User",
                            avatar: "",
                        }}
                        onLogout={logout}
                    />
                </Box>
            )}

            {/* MAIN CONTENT */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    height: "100vh",
                    pt: isMobile ? 3 : 0, // IMPORTANT: space for top bar
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: 2,
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );

};

export default memo(RouteLayout);
