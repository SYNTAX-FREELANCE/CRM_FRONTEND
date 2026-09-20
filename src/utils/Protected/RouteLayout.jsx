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
import { useThemeMode } from "../../Context/ThemeContext";

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
    const { role_id, id: userId, role } = authUser ?? {};
    const { data: RoleRights = [] } = useGetActiveModuleRightDetail(role_id);


    const Menu = getMenu(RoleRights, userId, role);
    const { mode } = useThemeMode();

    // const Menu = getMenu(RoleRights);

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
                background: mode === 'dark'
                    ? "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #020617 100%)"
                    : "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #fff7ed 100%)",
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: mode === 'dark'
                        ? `
          radial-gradient(at 15% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
          radial-gradient(at 85% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
          radial-gradient(at 50% 80%, rgba(236, 72, 153, 0.06) 0%, transparent 50%),
          linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)
        `
                        : `
          radial-gradient(at 15% 50%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
          radial-gradient(at 85% 30%, rgba(167, 139, 250, 0.1) 0%, transparent 50%),
          radial-gradient(at 50% 80%, rgba(251, 146, 60, 0.08) 0%, transparent 50%),
          linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)
        `,
                    pointerEvents: 'none',
                    zIndex: 0,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: mode === 'dark'
                        ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                    pointerEvents: 'none',
                    zIndex: 1,
                },
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
