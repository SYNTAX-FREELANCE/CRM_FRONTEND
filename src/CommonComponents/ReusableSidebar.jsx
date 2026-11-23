// import React, { useState, memo, useEffect, useMemo, useCallback } from "react";
// import { Box, Typography, Avatar, Divider, Menu, MenuItem } from "@mui/joy";
// import { useLocation, useNavigate } from "react-router-dom";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import AdjustIcon from "@mui/icons-material/Adjust";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { getAuthUser } from "../constant/Constant";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
// import LogoutModal from "./LogoutModal";
// import ChangePasswordModal from "./ChangePasswordModal";
// import LockResetIcon from "@mui/icons-material/LockReset";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import { useProfilePhoto } from "../CommonCode/useQuery";
// import { Skeleton } from "@mui/material";
// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import LightModeIcon from "@mui/icons-material/LightMode";
// import { useThemeMode } from "../Context/ThemeContext";

// const ReusableSidebar = ({
//   menuItems = [],
//   user = {
//     name: "Mr Arafat",
//     role: "UI UX Designer",
//     avatar: "",
//   },
//   onLogout
// }) => {

//   const location = useLocation();
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const [openMenu, setOpenMenu] = useState(null);
//   const [logoutModal, setLogoutModal] = useState(false);
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const [hoveredSub, setHoveredSub] = useState(null);
//   const [logoutCountdown, setLogoutCountdown] = useState(null);
//   const [passwordModalOpen, setPasswordModalOpen] = useState(false);
//   const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);


//   const authUser = getAuthUser();
//   const { emp_name, id, role } = authUser ?? {};
//   const { data: profilePhotoUrl = "", isLoading: LoadingProfilePicture } = useProfilePhoto(id);
//   const { mode, toggleTheme } = useThemeMode();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (avatarAnchorEl) {
//         // Don't close if clicking inside the menu or on the avatar button itself
//         if (
//           event.target.closest('.MuiMenu-root') ||
//           event.target.closest('[role="menu"]') ||
//           avatarAnchorEl.contains(event.target)
//         ) {
//           return;
//         }
//         setAvatarAnchorEl(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("touchstart", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("touchstart", handleClickOutside);
//     };
//   }, [avatarAnchorEl]);

//   const handleAvatarClick = useCallback((event) => {
//     event.stopPropagation();
//     if (open) {
//       setAvatarAnchorEl(event.currentTarget);
//     }
//   }, [open]);


//   const activeMenu = useMemo(() => {
//     const path = location.pathname;
//     for (const item of menuItems) {
//       // Main menu
//       if (item.path === path) {
//         return item.label;
//       }
//       // Nested menu
//       if (item.nested) {
//         const sub = item.nested.find((s) => path === s.path);
//         if (sub) return sub.label;
//       }
//     }

//     return "";
//   }, [location.pathname, menuItems]);



//   const handleCloseAvatarMenu = () => {
//     setAvatarAnchorEl(null);
//   };

//   useEffect(() => {
//     setAvatarAnchorEl(null);
//   }, [open]);



//   const handleMenuClick = useCallback((item) => {
//     if (!item.nested) {
//       navigate(item.path);
//       setOpenMenu(null);
//       return;
//     }
//     if (!open) {
//       setOpen(true);
//       setOpenMenu(item.label);
//       return;
//     }
//     setOpenMenu((prev) => (prev === item.label ? null : item.label));
//   }, [navigate]);


//   useEffect(() => {
//     if (logoutCountdown !== null && logoutCountdown > 0) {
//       const timer = setTimeout(() => {
//         setLogoutCountdown(logoutCountdown - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else if (logoutCountdown === 0) {
//       // Countdown finished, actually logout
//       setLogoutModal(false);
//       setLogoutCountdown(null);
//       if (onLogout) onLogout();
//     }
//   }, [logoutCountdown, onLogout]);

//   const cancelLogout = useCallback(() => {
//     setLogoutModal(false);
//     setLogoutCountdown(null);
//   }, []);

//   const handleSubMenuClick = useCallback((sub) => {
//     navigate(sub.path);
//   }, []);

//   const handleLogout = () => setLogoutModal(true);

//   const menuRowStyle = (isActive, isHovered) => ({
//     display: "flex",
//     alignItems: "center",
//     gap: open ? 1.2 : 0,
//     width: "100%",
//     minHeight: 46,
//     padding: open ? "0 14px" : "0",
//     justifyContent: open ? "flex-start" : "center",
//     borderRadius: 14,
//     cursor: "pointer",
//     userSelect: "none",
//     color: isActive || isHovered ? "#ea580c" : (mode === 'dark' ? '#94a3b8' : '#374151'),
//     background: isActive ? "rgba(249,115,22,0.10)" : "transparent",
//     boxShadow: isActive ? "0 0 0 1px rgba(249,115,22,0.12) inset" : "none",
//     transform: isHovered ? "translateX(2px)" : "translateX(0px)",
//     transition: "all 0.18s ease",
//   });

//   return (
//     <Box sx={{
//       p: 1
//     }}>
//       <Box
//         sx={{
//           width: open ? 280 : 72,
//           height: "95vh",
//           bgcolor: mode === 'dark'
//             ? 'rgba(15, 23, 42, 0.6)'
//             : 'rgba(255, 255, 255, 0.25)',
//           backdropFilter: "blur(20px) saturate(180%)",
//           WebkitBackdropFilter: "blur(20px) saturate(180%)",
//           color: mode === 'dark' ? '#f8fafc' : "#1f2937",
//           display: "flex",
//           flexDirection: "column",
//           transition: "all 0.25s ease",
//           overflow: "hidden",
//           borderRadius: 20,
//           boxShadow: mode === 'dark'
//             ? '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
//             : '0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
//           border: mode === 'dark'
//             ? '1px solid rgba(255, 255, 255, 0.12)'
//             : '1px solid rgba(255, 255, 255, 0.8)',
//           position: 'relative',
//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: -1,
//             right: -1,
//             bottom: 0,
//             borderRadius: 3,
//             background: mode === 'dark'
//               ? 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.03) 100%)'
//               : 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)',
//             pointerEvents: 'none',
//             zIndex: 0,
//           },
//         }}
//       >
//         <Box
//           sx={{
//             p: open ? 1.5 : 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: open ? "flex-start" : "center",
//             gap: open ? 1.2 : 0,
//             minHeight: 70,
//             background: mode === 'dark' ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.4)",
//             borderRadius: open ? "16px 16px 0 0" : 0,
//           }}
//         >
//           {/* Logo/Icon */}
//           <Box
//             onClick={() => setOpen(prev => !prev)}
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               minWidth: 52,
//               minHeight: 52,
//               borderRadius: 50,
//               cursor: 'pointer',
//               background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
//               boxShadow: "0 8px 24px rgba(234, 88, 12, 0.35)",
//               animation: "float 3s ease-in-out infinite",
//               '@keyframes float': {
//                 '0%, 100%': {
//                   transform: 'translateY(0px)',
//                 },
//                 '50%': {
//                   transform: 'translateY(-8px)',
//                 },
//               },
//             }}
//           >
//             <SupportAgentIcon
//               sx={{
//                 fontSize: 28,
//                 color: "#ffffff",
//                 animation: "iconPulse 3s ease-in-out infinite",
//                 '@keyframes iconPulse': {
//                   '0%, 100%': {
//                     transform: 'scale(1)',
//                   },
//                   '50%': {
//                     transform: 'scale(1.1)',
//                   },
//                 },
//               }}
//             />
//           </Box>

//           {/* Nexus Software Name */}
//           {open && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//               }}
//             >
//               <Box>
//                 <Typography
//                   level="h5"
//                   sx={{
//                     color: "#ea580c",
//                     fontWeight: 800,
//                     fontSize: "24px",
//                     letterSpacing: "1px",
//                     textTransform: "uppercase",
//                     background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
//                     backgroundClip: "text",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                   }}
//                 >
//                   pos
//                 </Typography>
//                 <Typography
//                   sx={{
//                     color: "#020202",
//                     fontWeight: 800,
//                     fontSize: "6px",
//                     letterSpacing: "1px",
//                     textTransform: "uppercase",
//                     background: "linear-gradient(135deg, #030303 0%, #0c0c0c 100%)",
//                     backgroundClip: "text",
//                     WebkitBackgroundClip: "text",
//                     WebkitTextFillColor: "transparent",
//                   }}
//                 >
//                   POINT OF SALE
//                 </Typography>
//               </Box>

//               {/* Small badge */}
//               <Box
//                 sx={{
//                   px: 0.8,
//                   py: 0.2,
//                   borderRadius: 6,
//                   background: "rgba(234, 88, 12, 0.1)",
//                   border: "1px solid rgba(234, 88, 12, 0.2)",
//                 }}
//               >
//                 <Typography
//                   level="body-xs"
//                   sx={{
//                     color: "#ea580c",
//                     fontWeight: 600,
//                     fontSize: "10px",
//                   }}
//                 >
//                   PRO
//                 </Typography>
//               </Box>
//             </Box>
//           )}
//         </Box>
//         <Box
//           sx={{
//             flex: 1,
//             minHeight: 0,
//             overflowY: "auto",
//             p: open ? 1.5 : 1,
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//             "&::-webkit-scrollbar": {
//               display: "none",
//             },
//           }}
//         >
//           {menuItems?.map((item) => (
//             <Box key={item.label} >

//               <Box
//                 role="button"
//                 tabIndex={0}
//                 onClick={() => handleMenuClick(item)}
//                 onMouseEnter={() => setHoveredItem(item.label)}
//                 onMouseLeave={() => setHoveredItem(null)}
//                 sx={menuRowStyle(activeMenu === item.label, hoveredItem === item.label)}
//               >
//                 {item.icon && (
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       minWidth: 18,
//                       color: activeMenu === item.label || hoveredItem === item.label ? "#ea580c" : (mode === 'dark' ? '#cbd5e1' : '#0a0f17'),
//                     }}
//                   >
//                     <item.icon sx={{ fontSize: 16 }} />
//                   </Box>
//                 )}

//                 {open && (
//                   <Typography level="body-sm" sx={{ flex: 1, color: "inherit", fontWeight: 600, fontSize: 12 }}>
//                     {item.label}
//                   </Typography>
//                 )}

//                 {open && item.nested && (
//                   <ExpandMoreIcon
//                     sx={{
//                       fontSize: 16,
//                       color: hoveredItem === item.label ? "#ea580c" : (mode === 'dark' ? '#cbd5e1' : '#0e0f11'),
//                       transform: openMenu === item.label ? "rotate(180deg)" : "rotate(0deg)",
//                       transition: "0.2s",
//                     }}
//                   />
//                 )}
//               </Box>

//               {open && openMenu === item.label && item.nested && (
//                 <Box sx={{ ml: 2.5, mt: 0.7 }}>
//                   {item.nested.map((sub) => {
//                     const isSubActive = activeMenu === sub.label;
//                     const isSubHover = hoveredSub === sub.label;

//                     return (
//                       <Box
//                         key={sub.label}
//                         role="button"
//                         tabIndex={0}
//                         onClick={() => handleSubMenuClick(sub)}
//                         onMouseEnter={() => setHoveredSub(sub.label)}
//                         onMouseLeave={() => setHoveredSub(null)}
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: 1,
//                           minHeight: 30,
//                           px: 1.4,
//                           borderRadius: 12,
//                           cursor: "pointer",
//                           userSelect: "none",
//                           color: isSubActive || isSubHover ? "#ea580c" : (mode === 'dark' ? '#94a3b8' : '#151619'),
//                           background: isSubActive ? "rgba(249,115,22,0.08)" : "transparent",
//                           transform: isSubHover ? "translateX(2px)" : "translateX(0px)",
//                           transition: "all 0.18s ease",
//                         }}
//                       >
//                         <AdjustIcon
//                           sx={{
//                             fontSize: 11,
//                             color: isSubActive || isSubHover ? "#ea580c" : (mode === 'dark' ? '#64748b' : '#9ca3af'),
//                           }}
//                         />
//                         <Typography level="body-sm" sx={{ color: "inherit", fontWeight: 600, fontSize: 12 }}>
//                           {sub.label}
//                         </Typography>
//                       </Box>
//                     );
//                   })}
//                 </Box>
//               )}
//             </Box>
//           ))}
//         </Box>

//         <Divider sx={{ opacity: 0.6, borderColor: mode === 'dark' ? "rgba(255,255,255,0.1)" : "#e7e5e4" }} />

//         <Box
//           sx={{
//             p: 1.4,
//             minHeight: 38,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: open ? "space-between" : "center",
//             bgcolor: mode === 'dark' ? '#1e293b' : "#ffffff",
//           }}
//         >
//           {open ? (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, width: "100%" }}>
//               {
//                 LoadingProfilePicture ? (
//                   <Skeleton
//                     variant="circular"
//                     width={40}
//                     height={40}
//                     sx={{ cursor: "pointer" }}
//                   />
//                 ) : (
//                   <Avatar
//                     src={profilePhotoUrl ?? user.avatar}
//                     size="sm"
//                     onClick={handleAvatarClick}
//                     sx={{ cursor: "pointer" }}
//                   />
//                 )
//               }

//               <Box sx={{ flex: 1, minWidth: 0 }}>
//                 <Typography level="body-sm" fontWeight={600} noWrap sx={{ color: mode === 'dark' ? '#f8fafc' : "#111827" }}>
//                   {emp_name}
//                 </Typography>
//                 <Typography level="body-xs" sx={{ color: mode === 'dark' ? '#94a3b8' : "#6b7280" }} noWrap>
//                   {role}
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", gap: 0.5 }}>
//                 <Box
//                   onClick={toggleTheme}
//                   role="button"
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     width: 32,
//                     height: 32,
//                     borderRadius: 10,
//                     cursor: "pointer",
//                     color: mode === 'dark' ? '#94a3b8' : "#6b7280",
//                     "&:hover": {
//                       bgcolor: mode === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
//                       color: mode === 'dark' ? '#f8fafc' : "#111827",
//                     },
//                   }}
//                 >
//                   {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
//                 </Box>
//                 <Box
//                   role="button"
//                   tabIndex={0}
//                   onClick={handleLogout}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     width: 32,
//                     height: 32,
//                     borderRadius: 10,
//                     cursor: "pointer",
//                     color: mode === 'dark' ? '#94a3b8' : "#6b7280",
//                     "&:hover": {
//                       bgcolor: "rgba(249,115,22,0.12)",
//                       color: "#ea580c",
//                     },
//                   }}
//                 >
//                   <LogoutIcon fontSize="small" />
//                 </Box>
//               </Box>
//             </Box>
//           ) : (
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
//               {
//                 LoadingProfilePicture ? (
//                   <Skeleton
//                     variant="circular"
//                     width={40}
//                     height={40}
//                     sx={{ cursor: "pointer" }}
//                   />
//                 ) : (
//                   <Avatar
//                     src={profilePhotoUrl ?? user.avatar}
//                     size="sm"
//                     onClick={handleAvatarClick}
//                     sx={{ cursor: "pointer" }}
//                   />
//                 )
//               }
//               <Box
//                 onClick={toggleTheme}
//                 role="button"
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   width: 32,
//                   height: 32,
//                   borderRadius: 10,
//                   cursor: "pointer",
//                   color: mode === 'dark' ? '#94a3b8' : "#6b7280",
//                   "&:hover": {
//                     bgcolor: mode === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
//                     color: mode === 'dark' ? '#ea580c' : "#ea580c",
//                   },
//                 }}
//               >
//                 {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
//               </Box>
//             </Box>
//           )}
//         </Box>

//         <LogoutModal
//           open={logoutModal}
//           onClose={() => setLogoutModal(false)}
//           onStartLogout={onLogout}
//         />

//         <Menu
//           anchorEl={avatarAnchorEl}
//           open={Boolean(avatarAnchorEl)}
//           onClose={handleCloseAvatarMenu}
//           placement="top-start"
//           sx={{
//             zIndex: 1400,
//             overflow: 'visible',
//             filter: 'drop-shadow(0px 16px 40px rgba(234, 88, 12, 0.15))',
//             mt: { xs: 0, sm: -1 },
//             ml: { xs: 1, sm: 2 },
//             borderRadius: { xs: '16px', sm: '20px' },
//             minWidth: { xs: 200, sm: 240 },
//             background: mode === 'dark' ? 'linear-gradient(145deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.95) 100%)' : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
//             backdropFilter: 'blur(24px)',
//             border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 1)',
//             boxShadow: mode === 'dark' ? 'inset 0 0 0 1px rgba(255,255,255,0.1)' : 'inset 0 0 0 1px rgba(255,255,255,0.5)',
//             padding: { xs: '6px 0', sm: '8px 0' },
//             '--ListItem-radius': { xs: '12px', sm: '14px' },
//             '& .JoyMenuItem-root': {
//               px: { xs: 1, sm: 1.5 },
//               py: { xs: 1, sm: 1.2 },
//               mx: { xs: 1, sm: 1.5 },
//               my: 0.5,
//               transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//               position: 'relative',
//               overflow: 'hidden',
//             },
//           }}
//         >
//           <Box sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 1, sm: 1.5 }, mb: 1, borderBottom: mode === 'dark' ? '1px dashed rgba(255, 255, 255, 0.2)' : '1px dashed rgba(231, 229, 228, 0.8)' }}>
//             <Typography
//               fontSize={{ xs: "10px", sm: "11px" }}
//               fontWeight={800}
//               color="#ea580c"
//               textTransform="uppercase"
//               letterSpacing="0.8px">
//               Settings
//             </Typography>
//           </Box>
//           <MenuItem
//             onClick={() => {
//               setOpen(false);
//               navigate(`/home/my-profile`)
//             }}
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: { xs: 1.5, sm: 2 },
//               color: mode === 'dark' ? "#cbd5e1" : "#374151",
//               fontWeight: 600,
//               fontSize: { xs: "13px", sm: "14px" },
//               zIndex: 1,
//               "&:hover": {
//                 bgcolor: "transparent",
//                 color: "#ea580c",
//                 transform: "translateX(4px)",
//                 "& .icon-container": {
//                   transform: "rotate(10deg) scale(1.15)",
//                   background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
//                   color: "#ffffff",
//                   boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)",
//                 },
//               },
//               "&::before": {
//                 content: '""',
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 background: 'linear-gradient(90deg, rgba(234, 88, 12, 0.08) 0%, rgba(249, 115, 22, 0) 100%)',
//                 opacity: 0,
//                 zIndex: -1,
//                 transition: 'opacity 0.3s ease',
//               },
//               "&:hover::before": {
//                 opacity: 1,
//               }
//             }}
//           >
//             <Box
//               className="icon-container"
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: { xs: 32, sm: 36 },
//                 height: { xs: 32, sm: 36 },
//                 borderRadius: '10px',
//                 background: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(243, 244, 246, 0.8)',
//                 color: mode === 'dark' ? '#94a3b8' : '#6b7280',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//               }}
//             >
//               <AccountCircleIcon
//                 sx={{
//                   fontSize: { xs: '18px', sm: '20px' },
//                   animation: "spinPulse 3s ease-in-out infinite",
//                   "@keyframes spinPulse": {
//                     "0%, 100%": { transform: "scale(1) rotate(0deg)" },
//                     "50%": { transform: "scale(1.15) rotate(10deg)" }
//                   }
//                 }}
//               />
//             </Box>
//             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//               <Typography sx={{ fontWeight: 600, fontSize: { xs: "13px", sm: "14px" }, lineHeight: 1.2, color: 'inherit' }}>
//                 My Profile
//               </Typography>
//               <Typography sx={{ fontSize: { xs: "10px", sm: "11px" }, color: "#9ca3af", mt: 0.3, fontWeight: 500, transition: 'color 0.3s', '.MuiMenuItem-root:hover &': { color: '#fb923c' } }}>
//                 View Details
//               </Typography>
//             </Box>
//           </MenuItem>

//           <MenuItem
//             onClick={() => {
//               handleCloseAvatarMenu();
//               setPasswordModalOpen(true);
//             }}
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: { xs: 1.5, sm: 2 },
//               color: mode === 'dark' ? "#cbd5e1" : "#374151",
//               fontWeight: 600,
//               fontSize: { xs: "13px", sm: "14px" },
//               zIndex: 1,
//               "&:hover": {
//                 bgcolor: "transparent",
//                 color: "#ea580c",
//                 transform: "translateX(4px)",
//                 "& .icon-container": {
//                   transform: "rotate(10deg) scale(1.15)",
//                   background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
//                   color: "#ffffff",
//                   boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)",
//                 },
//               },
//               "&::before": {
//                 content: '""',
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 background: 'linear-gradient(90deg, rgba(234, 88, 12, 0.08) 0%, rgba(249, 115, 22, 0) 100%)',
//                 opacity: 0,
//                 zIndex: -1,
//                 transition: 'opacity 0.3s ease',
//               },
//               "&:hover::before": {
//                 opacity: 1,
//               }
//             }}
//           >
//             <Box
//               className="icon-container"
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: { xs: 32, sm: 36 },
//                 height: { xs: 32, sm: 36 },
//                 borderRadius: '10px',
//                 background: 'rgba(243, 244, 246, 0.8)',
//                 color: '#6b7280',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//               }}
//             >
//               <LockResetIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
//             </Box>
//             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//               <Typography sx={{ fontWeight: 600, fontSize: { xs: "13px", sm: "14px" }, lineHeight: 1.2, color: 'inherit' }}>
//                 Change Password
//               </Typography>
//               <Typography sx={{ fontSize: { xs: "10px", sm: "11px" }, color: "#9ca3af", mt: 0.3, fontWeight: 500, transition: 'color 0.3s', '.JoyMenuItem-root:hover &': { color: '#fb923c' } }}>
//                 Update your credentials
//               </Typography>
//             </Box>
//           </MenuItem>


//         </Menu>

//         <ChangePasswordModal
//           open={passwordModalOpen}
//           onClose={() => setPasswordModalOpen(false)}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default memo(ReusableSidebar);





import React, { useState, memo, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/joy";
import { Badge, Skeleton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import LogoutIcon from "@mui/icons-material/Logout";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LockResetIcon from "@mui/icons-material/LockReset";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { getAuthUser } from "../constant/Constant";
import { useProfilePhoto, useReceivedNotifications } from "../CommonCode/useQuery";
import { useThemeMode } from "../Context/ThemeContext";

import LogoutModal from "./LogoutModal";
import ChangePasswordModal from "./ChangePasswordModal";

const MENU_ICON_COLORS = [
  "#15803d",
  "#db2777",
  "#0891b2",
  "#7c3aed",
  "#64748b",
  "#9333ea",
  "#64748b",
  "#0d9488",
  "#2563eb",
  "#ca8a04",
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#0d9488",
];

const ReusableSidebar = ({
  menuItems = [],
  user = {
    name: "Mr Arafat",
    role: "UI UX Designer",
    avatar: "",
  },
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [logoutModal, setLogoutModal] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [nestedAnchorEl, setNestedAnchorEl] = useState(null);
  const [nestedMenuItem, setNestedMenuItem] = useState(null);
  const [animateNotification, setAnimateNotification] = useState(false);
  const authUser = getAuthUser();
  const { emp_name, id, role } = authUser ?? {};

  const {
    data: receivedNotifications = [],
    // refetch: RefetchReceivedNotifications,
  } = useReceivedNotifications(id);


  const unreadCount = receivedNotifications?.filter(
    (notification) => Number(notification.is_read) === 0
  ).length;
  const previousUnreadCount = useRef(unreadCount);



  const {
    data: profilePhotoUrl = "",
    isLoading: LoadingProfilePicture,
  } = useProfilePhoto(id);




  useEffect(() => {
    if (unreadCount > previousUnreadCount.current) {
      setAnimateNotification(true);

      const timer = setTimeout(() => {
        setAnimateNotification(false);
      }, 900);

      previousUnreadCount.current = unreadCount;

      return () => clearTimeout(timer);
    }

    previousUnreadCount.current = unreadCount;
  }, [unreadCount]);



  const { mode, toggleTheme } = useThemeMode();

  const isDark = mode === "dark";

  // Find active menu
  const activeMenu = useMemo(() => {
    const path = location.pathname;

    for (const item of menuItems) {
      if (item.path && item.path === path) {
        return item.label;
      }

      if (item.nested) {
        const sub = item.nested.find((s) => s.path === path);

        if (sub) return sub.label;
      }
    }

    return "";
  }, [location.pathname, menuItems]);

  const handleMenuClick = useCallback(
    (item, event) => {
      if (item.nested?.length) {
        setAvatarAnchorEl(null);

        setNestedAnchorEl(event.currentTarget);
        setNestedMenuItem(item);
        return;
      }

      if (item.path) {
        navigate(item.path);
      }
    },
    [navigate]
  );

  const handleNestedClose = useCallback(() => {
    setNestedAnchorEl(null);
    setNestedMenuItem(null);
  }, []);

  const handleSubMenuClick = useCallback(
    (sub) => {
      if (sub.path) {
        navigate(sub.path);
      }

      handleNestedClose();
    },
    [navigate, handleNestedClose]
  );

  const handleAvatarClick = useCallback((event) => {
    setNestedAnchorEl(null);
    setNestedMenuItem(null);
    setAvatarAnchorEl(event.currentTarget);
  }, []);

  const handleCloseAvatarMenu = useCallback(() => {
    setAvatarAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    setAvatarAnchorEl(null);
    setLogoutModal(true);
  }, []);

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  useEffect(() => {
    setAvatarAnchorEl(null);
    setNestedAnchorEl(null);
    setNestedMenuItem(null);
  }, [location.pathname]);

  // Sidebar colors
  const sidebarBackground = isDark
    ? "rgba(15, 23, 42, 0.92)"
    : "linear-gradient(180deg, #d4f2ec 0%, #d8f4ed 48%, #f8f0d1 100%)";

  const iconButtonStyle = {
    width: 38,
    height: 38,
    minHeight: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
    outline: "none",
  };

  const popupMenuStyle = {
    zIndex: 1500,
    minWidth: 205,
    p: 0.8,
    borderRadius: "14px",
    bgcolor: isDark ? "#1e293b" : "#ffffff",
    border: isDark
      ? "1px solid rgba(255,255,255,0.1)"
      : "1px solid #e5e7eb",
    boxShadow: "0 12px 35px rgba(15,23,42,0.16)",
    "--ListItem-radius": "9px",
  };

  return (
    <Box
      sx={{
        p: 0.75,
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      {/* SIDEBAR */}
      <Box
        sx={{
          width: 58,
          minWidth: 58,
          height: "95vh",
          maxHeight: "850px",
          minHeight: "420px",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          background: sidebarBackground,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",

          borderRadius: "23px",

          border: isDark
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(255,255,255,0.85)",

          boxShadow: isDark
            ? "0 8px 30px rgba(0,0,0,0.3)"
            : "0 8px 30px rgba(31,38,135,0.12)",

          overflow: "hidden",
          position: "relative",
          transition: "background 0.2s ease",
        }}
      >
        {/* LOGO */}
        {/* <Box
          sx={{
            width: "100%",
            height: 62,
            minHeight: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tooltip title="POS" placement="right">
            <Box
              onClick={() => navigate("/home")}
              sx={{
                width: 43,
                height: 43,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: "15px",

                background: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.75)",

                border: "1px solid rgba(255,255,255,0.9)",
                cursor: "pointer",

                boxShadow: "0 3px 10px rgba(15,23,42,0.08)",

                "&:hover": {
                  transform: "translateY(-2px)",
                },

                transition: "all 0.2s ease",
              }}
            >
              <SupportAgentIcon
                sx={{
                  fontSize: 29,
                  color: "#ea580c",
                }}
              />
            </Box>
          </Tooltip>
        </Box> */}



        <Box
          sx={{
            width: "100%",
            height: 62,
            minHeight: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tooltip title="POS Notifications" placement="right">
            <Badge
              badgeContent={unreadCount}
              max={99}
              invisible={unreadCount <= 0}
              color="success"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "10px",
                  fontWeight: 800,
                  minWidth: 19,
                  height: 19,
                  border: "2px solid",
                  borderColor: isDark ? "#172d32" : "#e8f4eb",
                  boxShadow: "0 2px 8px rgba(22,163,74,0.3)",

                  animation: animateNotification
                    ? "badgePop 0.65s ease"
                    : "none",

                  "@keyframes badgePop": {
                    "0%": {
                      transform: "scale(1)",
                    },
                    "35%": {
                      transform: "scale(1.6)",
                    },
                    "65%": {
                      transform: "scale(0.85)",
                    },
                    "100%": {
                      transform: "scale(1)",
                    },
                  },
                },
              }}
            >
              <Box
                onClick={() => navigate("/home")}
                sx={{
                  width: 43,
                  height: 43,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "15px",

                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.75)",

                  border: "1px solid rgba(255,255,255,0.9)",
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(15,23,42,0.08)",

                  animation: animateNotification
                    ? "notificationShake 0.8s ease"
                    : "none",

                  "@keyframes notificationShake": {
                    "0%, 100%": {
                      transform: "rotate(0deg) scale(1)",
                    },
                    "15%": {
                      transform: "rotate(-13deg) scale(1.08)",
                    },
                    "30%": {
                      transform: "rotate(13deg) scale(1.08)",
                    },
                    "45%": {
                      transform: "rotate(-10deg)",
                    },
                    "60%": {
                      transform: "rotate(10deg)",
                    },
                    "75%": {
                      transform: "rotate(-5deg)",
                    },
                    "90%": {
                      transform: "rotate(5deg)",
                    },
                  },

                  "&:hover": {
                    transform: "translateY(-2px)",
                  },

                  transition: "all 0.2s ease",
                }}
              >
                <SupportAgentIcon
                  sx={{
                    fontSize: 29,
                    color: "#ea580c",
                    animation: animateNotification
                      ? "iconPulse 0.8s ease"
                      : "none",

                    "@keyframes iconPulse": {
                      "0%, 100%": {
                        transform: "scale(1)",
                      },
                      "50%": {
                        transform: "scale(1.2)",
                      },
                    },
                  }}
                />
              </Box>
            </Badge>
          </Tooltip>
        </Box>



        {/* NAVIGATION */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            minHeight: 0,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            gap: 0.65,
            py: 0.8,

            overflowY: "auto",
            overflowX: "hidden",

            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {menuItems?.map((item, index) => {
            const isActive =
              activeMenu === item.label ||
              item.nested?.some((sub) => sub.label === activeMenu);

            const Icon = item.icon;
            const iconColor =
              MENU_ICON_COLORS[index % MENU_ICON_COLORS.length];

            return (
              <Tooltip
                key={item.label}
                title={item.label}
                placement="right"
                arrow
              >
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={(event) => handleMenuClick(item, event)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleMenuClick(item, event);
                    }
                  }}
                  sx={{
                    ...iconButtonStyle,

                    background: isActive
                      ? "linear-gradient(135deg, #168344 0%, #08743a 100%)"
                      : "transparent",

                    color: isActive
                      ? "#ffffff"
                      : isDark
                        ? "#cbd5e1"
                        : iconColor,

                    boxShadow: isActive
                      ? "0 4px 10px rgba(22,131,68,0.28)"
                      : "none",

                    transform: isActive
                      ? "scale(1.02)"
                      : "scale(1)",

                    "&:hover": {
                      background: isActive
                        ? "#08743a"
                        : isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(255,255,255,0.65)",

                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {Icon && (
                    <Icon
                      sx={{
                        fontSize: 19,
                        color: "inherit",
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* BOTTOM SECTION */}
        <Box
          sx={{
            width: "100%",
            minHeight: 104,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            gap: 1,

            py: 1,

            borderTop: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(255,255,255,0.45)",
          }}
        >
          {/* USER AVATAR */}
          {LoadingProfilePicture ? (
            <Skeleton
              variant="circular"
              width={33}
              height={33}
            />
          ) : (
            <Tooltip title={emp_name || user.name} placement="right">
              <Avatar
                src={profilePhotoUrl || user.avatar}
                size="sm"
                onClick={handleAvatarClick}
                sx={{
                  width: 33,
                  height: 33,
                  minHeight: 33,

                  cursor: "pointer",

                  bgcolor: "#15803d",
                  color: "#ffffff",

                  fontSize: 13,
                  fontWeight: 700,

                  border: "2px solid rgba(255,255,255,0.8)",

                  boxShadow: "0 3px 9px rgba(15,23,42,0.12)",

                  "&:hover": {
                    transform: "scale(1.08)",
                  },

                  transition: "all 0.2s ease",
                }}
              >
                {emp_name?.charAt(0)}
              </Avatar>
            </Tooltip>
          )}

          {/* THEME TOGGLE */}
          <Tooltip
            title={isDark ? "Light Mode" : "Dark Mode"}
            placement="right"
          >
            <Box
              role="button"
              tabIndex={0}
              onClick={handleThemeToggle}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleThemeToggle();
                }
              }}
              sx={{
                width: 32,
                height: 32,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: "50%",
                cursor: "pointer",

                color: isDark ? "#fbbf24" : "#64748b",

                "&:hover": {
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.55)",
                },

                transition: "all 0.2s ease",
              }}
            >
              {isDark ? (
                <LightModeIcon sx={{ fontSize: 18 }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: 18 }} />
              )}
            </Box>
          </Tooltip>
        </Box>
      </Box>

      {/* NESTED MENU POPUP */}
      <Menu
        anchorEl={nestedAnchorEl}
        open={Boolean(nestedAnchorEl)}
        onClose={handleNestedClose}
        placement="right-start"
        sx={popupMenuStyle}
      >
        {nestedMenuItem?.nested?.map((sub) => {
          const isSubActive = activeMenu === sub.label;

          return (
            <MenuItem
              key={sub.label}
              onClick={() => handleSubMenuClick(sub)}
              sx={{
                minHeight: 38,
                px: 1.3,
                mb: 0.4,

                fontSize: 12,
                fontWeight: isSubActive ? 700 : 600,

                color: isSubActive
                  ? "#15803d"
                  : isDark
                    ? "#cbd5e1"
                    : "#374151",

                bgcolor: isSubActive
                  ? isDark
                    ? "rgba(22,131,68,0.2)"
                    : "rgba(22,131,68,0.08)"
                  : "transparent",

                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "#f0fdf4",
                  color: "#15803d",
                },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: isSubActive ? "#15803d" : "#94a3b8",
                  }}
                />
                {sub.label}
              </Box>

              <ChevronRightIcon sx={{ fontSize: 15, opacity: 0.5 }} />
            </MenuItem>
          );
        })}
      </Menu>

      {/* PROFILE MENU */}
      <Menu
        anchorEl={avatarAnchorEl}
        open={Boolean(avatarAnchorEl)}
        onClose={handleCloseAvatarMenu}
        placement="top-start"
        sx={{
          ...popupMenuStyle,
          minWidth: 220,
          mb: 1,
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1.2,
            mb: 0.5,

            borderBottom: isDark
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid #f1f5f9",
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 800,
              color: "#15803d",
            }}
          >
            {emp_name || user.name}
          </Typography>

          <Typography
            sx={{
              fontSize: 10,
              color: isDark ? "#94a3b8" : "#64748b",
              mt: 0.3,
            }}
          >
            {role || user.role}
          </Typography>
        </Box>

        <MenuItem
          onClick={() => {
            handleCloseAvatarMenu();
            navigate("/home/my-profile");
          }}
          sx={{
            minHeight: 40,
            borderRadius: 9,
            fontSize: 12,
            fontWeight: 600,
            gap: 1.2,
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 19, color: "#15803d" }} />
          My Profile
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleCloseAvatarMenu();
            setPasswordModalOpen(true);
          }}
          sx={{
            minHeight: 40,
            borderRadius: 9,
            fontSize: 12,
            fontWeight: 600,
            gap: 1.2,
          }}
        >
          <LockResetIcon sx={{ fontSize: 19, color: "#64748b" }} />
          Change Password
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            minHeight: 40,
            borderRadius: 9,
            fontSize: 12,
            fontWeight: 600,
            gap: 1.2,
            color: "#dc2626",

            "&:hover": {
              bgcolor: "rgba(220,38,38,0.08)",
            },
          }}
        >
          <LogoutIcon sx={{ fontSize: 18 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* LOGOUT MODAL */}
      <LogoutModal
        open={logoutModal}
        onClose={() => setLogoutModal(false)}
        onStartLogout={onLogout}
      />

      {/* CHANGE PASSWORD MODAL */}
      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </Box>
  );
};

export default memo(ReusableSidebar);
