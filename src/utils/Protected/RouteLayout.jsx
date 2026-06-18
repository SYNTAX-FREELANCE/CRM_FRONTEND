// import { Box } from "@mui/joy";
// import { Navigate, Outlet } from "react-router-dom";
// import { memo } from "react";
// import logo from "../../assets/loginimages/logo.png";
// import SchoolIcon from "@mui/icons-material/School";
// import { getAuthUser } from "../../constant/Constant";
// import ReusableSidebar from "../../CommonComponents/ReusableSidebar";
// import ReusableTopBar from "../../CommonComponents/ReusableTopBar";
// import { Menu } from "../../Menu/menu";


// const RouteLayout = () => {
//     const token = localStorage.getItem("token");

//     // 🔐 AUTH CHECK (IMPORTANT)
//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     const user = getAuthUser();

//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 height: "100vh", //  important
//                 overflow: "hidden", //  prevent full page scroll
//             }}
//         >
//             {/* Sidebar */}
//             <Box
//                 sx={{
//                     height: "100vh", //  full height
//                     flexShrink: 0,
//                 }}
//             >
//                 <ReusableSidebar
//                     menuItems={Menu}
//                     title="Clynt"
//                     subTitle=""
//                     logo={logo}
//                     logoutPath="/faculty/logout"
//                 />
//             </Box>

//             {/* Right side */}
//             <Box
//                 sx={{
//                     flex: 1,
//                     display: "flex",
//                     flexDirection: "column",
//                     minWidth: 0,
//                     height: "100vh",
//                 }}
//             >
//                 {/* Top Navbar */}
//                 {/* <Box sx={{ flexShrink: 0 }}>
//                     <ReusableTopBar
//                         title="C R M"
//                         leftIcon={SchoolIcon}
//                         userName={user?.fac_name || "User Name"}
//                         background="#fffdfd"
//                         Department="Customer Relation Management"
//                     />
//                 </Box> */}

//                 {/* Scrollable Content */}
//                 <Box
//                     sx={{
//                         flex: 1,
//                         overflowY: "auto", //  only this scrolls
//                         p: 2,
//                         bgcolor: "#f9fafb",
//                     }}
//                 >
//                     <Outlet />
//                 </Box>
//             </Box>
//         </Box>
//     );
// };

// export default memo(RouteLayout);



// src/utils/Protected/RouteLayout.js
import { Box } from "@mui/joy";
import { Navigate, Outlet } from "react-router-dom";
import { memo } from "react";
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