// src/utils/Protected/RouteLayout.js
import { Box } from "@mui/joy";
import { Navigate, Outlet } from "react-router-dom";
import { memo, useEffect } from "react";
import logo from "../../assets/loginimages/logo.png";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "../../Context/AuthContext";
import ReusableSidebar from "../../CommonComponents/ReusableSidebar";
import ReusableTopBar from "../../CommonComponents/ReusableTopBar";
import { Menu } from "../../Menu/menu";


const RouteLayout = () => {
    const { isAuthenticated, loading, user, logout } = useAuth();

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {/* Sidebar */}
            <Box
                sx={{
                    height: "100vh",
                    flexShrink: 0,
                }}
            >
                <ReusableSidebar
                    menuItems={Menu}
                    title="Clynt"
                    subTitle=""
                    logo={logo}
                    logoutPath="/logout"
                    onLogout={logout}
                />
            </Box>

            {/* Right side */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    height: "100vh",
                }}
            >
                {/* Scrollable Content */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: 2,
                        bgcolor: "#f9fafb",
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default memo(RouteLayout);