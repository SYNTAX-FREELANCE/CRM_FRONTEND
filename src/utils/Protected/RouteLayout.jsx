// src/utils/Protected/RouteLayout.js
import { Box } from "@mui/joy";
import { Navigate, Outlet } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import logo from "../../assets/loginimages/logo.png";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "../../Context/AuthContext";
import ReusableSidebar from "../../CommonComponents/ReusableSidebar";
import ReusableTopBar from "../../CommonComponents/ReusableTopBar";
import { axioslogin } from "../../Axios/axios";

// Material UI Icons for dynamically generated sidebar
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import GroupsIcon from "@mui/icons-material/Groups";
import { Menu } from "../../Menu/menu";
import { useMediaQuery } from "@mui/material";
import MobileSidebar from "../../CommonComponents/MobileSidebar";

// Map database menu names to their corresponding frontend routes
const menuPathMap = {
    "Menu Master": "/home/setting/menumaster",
    "Module Master": "/home/setting/modulemaster",
    "Submodule Master": "/home/setting/submodulemaster",
    "Qualification Master": "/home/setting/qualificationmaster",
    "Company Master": "/home/setting/companymaster",
    "Status Master": "/home/setting/statusmaster",
    "Employee Master": "/home/setting/employeemaster",
    "Role Master": "/home/setting/rolemaster",
    "User Right Master": "/home/setting/userrightmaster",
    "Bank Master": "/home/setting/bankmaster",
    "User Reg": "/home/setting/userreg",
    "Common View": "/home/setting/commonview",
};

// Map database module names to their respective icons
const moduleIconMap = {
    "General Master": SettingsSuggestIcon,
    "User Management": GroupsIcon,
};

const RouteLayout = () => {
    const { isAuthenticated, loading, user, logout } = useAuth();
    const [menuItems, setMenuItems] = useState([]);

    const isMobile = useMediaQuery("(max-width: 768px)");
    // useEffect(() => {
    //     if (!isAuthenticated || !user?.role) return;

    //     const fetchAllowedMenus = async () => {
    //         try {
    //             const response = await axioslogin.get(`/userrights/allowed/${user.role}`);
    //             if (response.data.success === 1 && Array.isArray(response.data.data)) {
    //                 const allowedData = response.data.data;
    //                 console.log("allowedData:", allowedData);

    //                 // Group menus by module
    //                 const modulesMap = {};

    //                 // Always add Dashboard first
    //                 const items = [
    //                     {
    //                         label: "Dashboard",
    //                         icon: DashboardIcon,
    //                         path: "/home",
    //                     }
    //                 ];

    //                 allowedData.forEach((row) => {
    //                     const { module_name, menu_name } = row;
    //                     if (!modulesMap[module_name]) {
    //                         modulesMap[module_name] = [];
    //                     }

    //                     // Get path from lookup map or fallback to default pattern
    //                     const path = menuPathMap[menu_name] || `/home/setting/${menu_name.toLowerCase().replace(/\s+/g, "")}`;

    //                     modulesMap[module_name].push({
    //                         label: menu_name,
    //                         path: path,
    //                     });
    //                 });

    //                 // Add each group module to sidebar menu items
    //                 Object.keys(modulesMap).forEach((modName) => {
    //                     items.push({
    //                         label: modName,
    //                         icon: moduleIconMap[modName] || SettingsSuggestIcon,
    //                         nested: modulesMap[modName],
    //                     });
    //                 });

    //                 // Always add Settings at the end
    //                 items.push({
    //                     label: "Settings",
    //                     icon: SettingsSuggestIcon,
    //                     path: "/home/settings",
    //                 });

    //                 setMenuItems(items);
    //             } else {
    //                 // Fallback to basic Dashboard and Settings if no rights configured
    //                 setMenuItems([
    //                     {
    //                         label: "Dashboard",
    //                         icon: DashboardIcon,
    //                         path: "/home",
    //                     },
    //                     {
    //                         label: "Settings",
    //                         icon: SettingsSuggestIcon,
    //                         path: "/home/settings",
    //                     }
    //                 ]);
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch allowed menus:", error);
    //             // Fallback to basic Dashboard and Settings on error
    //             setMenuItems([
    //                 {
    //                     label: "Dashboard",
    //                     icon: DashboardIcon,
    //                     path: "/home",
    //                 },
    //                 {
    //                     label: "Settings",
    //                     icon: SettingsSuggestIcon,
    //                     path: "/home/settings",
    //                 }
    //             ]);
    //         }
    //     };

    //     fetchAllowedMenus();
    // }, [isAuthenticated, user]);


    useEffect(() => {

        if (!isAuthenticated || !user?.role) return;

        const fetchMenus = async () => {

            try {

                const result = await axioslogin.get(
                    `/userrights/allowed/${user.role}`
                );

                if (result.data.success !== 1) return;

                console.log("rolee:", user.role);

                console.log("Menu:", result.data.data);

                const modules = {};

                result.data.data.forEach(row => {

                    if (!modules[row.module_name]) {
                        modules[row.module_name] = [];
                    }

                    modules[row.module_name].push({
                        label: row.menu_name,
                        path:
                            menuPathMap[row.menu_name] ||
                            `/home/${row.menu_name
                                .toLowerCase()
                                .replace(/\s+/g, "")}`
                    });

                });

                const sidebarData = [];

                // Always add Dashboard first
                // sidebarData.push({
                //     label: "Dashboard",
                //     icon: DashboardIcon,
                //     path: "/home",
                // });

                Object.keys(modules).forEach(moduleName => {

                    sidebarData.push({
                        label: moduleName,
                        icon: moduleIconMap[moduleName] || SettingsSuggestIcon,
                        nested: modules[moduleName]
                    });

                });

                // Always add User Info at the end
                // sidebarData.push({
                //     label: "User Info",
                //     icon: GroupsIcon,
                //     path: "/home/userinfo",
                // });

                // // Always add Settings at the end
                // sidebarData.push({
                //     label: "Settings",
                //     icon: SettingsSuggestIcon,
                //     path: "/home/settings",
                // });

                setMenuItems(sidebarData);

            } catch (err) {
                console.log(err);
            }

        };

        fetchMenus();

    }, [isAuthenticated, user]);

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
                        width:20,
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

    // return (
    //     <Box
    //         sx={{
    //             display: "flex",
    //             height: "100vh",
    //             overflow: "hidden",
    //             background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 40%, #fff7ed 100%)",
    //         }}
    //     >
    //         {/* Sidebar */}
    //         <Box
    //             sx={{
    //                 height: "100vh",
    //                 flexShrink: 0,
    //             }}
    //         >
    //             {isMobile ? (
    //                 <MobileSidebar
    //                     menuItems={Menu}
    //                     user={{
    //                         name: user?.username || "Employee",
    //                         role: user?.role_name || "User",
    //                     }}
    //                     onLogout={logout}
    //                 />
    //             ) : (
    //                 <ReusableSidebar
    //                     menuItems={Menu}
    //                     user={{
    //                         name: user?.username || "Employee",
    //                         role: user?.role_name || "User",
    //                         avatar: "",
    //                     }}
    //                     onLogout={logout}
    //                 />
    //             )}
    //         </Box>

    //         {/* Right side */}
    //         <Box
    //             sx={{
    //                 flex: 1,
    //                 display: "flex",
    //                 flexDirection: "column",
    //                 minWidth: 0,
    //                 height: "100vh",
    //             }}
    //         >
    //             {/* Scrollable Content */}
    //             <Box
    //                 sx={{
    //                     flex: 1,
    //                     overflowY: "auto",
    //                     p: 2,
    //                     scrollbarWidth: "none",
    //                     msOverflowStyle: "none",
    //                     "&::-webkit-scrollbar": {
    //                         display: "none",
    //                     },
    //                     // bgcolor: "#f9fafb",
    //                 }}
    //             >
    //                 <Outlet />
    //             </Box>
    //         </Box>
    //     </Box>
    // );
};

export default memo(RouteLayout);
