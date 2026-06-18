import { Box, CircularProgress } from "@mui/joy";
import { Navigate, Outlet } from "react-router-dom";
import { memo, useEffect } from "react";
import logo from "../../assets/loginimages/logo.png";
import SchoolIcon from "@mui/icons-material/School";
import { getAuthUser } from "../../constant/Constant";
import ReusableSidebar from "../../CommonComponents/ReusableSidebar";
import ReusableTopBar from "../../CommonComponents/ReusableTopBar";
import { Menu } from "../../Menu/menu";
import useValidateToken from "../useValidateToken";
import { axiosApi } from "../../Axios/axios";

const RouteLayout = () => {
    const token = localStorage.getItem("token");
    const { isValid, isLoading } = useValidateToken();

    // 🕒 Attendance Control & Automatic Session Management
    useEffect(() => {
        if (!token) return;

        let inactivityTimeout;

        const handleAutoLogout = async (reason) => {
            const attendanceId = localStorage.getItem("attendance_id");
            try {
                if (attendanceId) {
                    await axiosApi.post("/user/logout", { attendance_id: attendanceId });
                }
            } catch (error) {
                console.error("Auto logout API error:", error);
            } finally {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("authUser");
                localStorage.removeItem("app_auth");
                localStorage.removeItem("attendance_id");
                alert(`Session Terminated: ${reason}`);
                window.location.href = "/login";
            }
        };

        const resetInactivityTimer = () => {
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            // 5 minutes of inactivity (5 * 60 * 1000 ms)
            inactivityTimeout = setTimeout(() => {
                handleAutoLogout("Inactivity boundary (5 minutes) exceeded.");
            }, 5 * 60 * 1000);
        };

        // Track user activity events
        const activityEvents = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
        activityEvents.forEach((event) => {
            window.addEventListener(event, resetInactivityTimer);
        });

        // Initialize timers
        resetInactivityTimer();

        return () => {
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetInactivityTimer);
            });
        };
    }, [token]);

    // 🔐 AUTH CHECK (IMPORTANT)
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isValid) {
        return <Navigate to="/login" replace />;
    }

    const user = getAuthUser();

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh", //  important
                overflow: "hidden", //  prevent full page scroll
            }}
        >
            {/* Sidebar */}
            <Box
                sx={{
                    height: "100vh", //  full height
                    flexShrink: 0,
                }}
            >
                <ReusableSidebar
                    menuItems={Menu}
                    title="Clynt"
                    subTitle=""
                    logo={logo}
                    logoutPath="/faculty/logout"
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
                {/* Top Navbar */}
                {/* <Box sx={{ flexShrink: 0 }}>
                    <ReusableTopBar
                        title="C R M"
                        leftIcon={SchoolIcon}
                        userName={user?.fac_name || "User Name"}
                        background="#fffdfd"
                        Department="Customer Relation Management"
                    />
                </Box> */}

                {/* Scrollable Content */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto", //  only this scrolls
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
