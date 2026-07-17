import React, { useState, memo, useEffect, useMemo, useCallback } from "react";
import { Box, Typography, Modal, Button, Avatar, Divider, Menu, MenuItem } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AdjustIcon from "@mui/icons-material/Adjust";
import LogoutIcon from "@mui/icons-material/Logout";
import { color } from "@mui/system";
import { axiosApi } from "../Connection/axios";
import { getAuthUser } from "../constant/Constant";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LogoutModal from "./LogoutModal";
import ChangePasswordModal from "./ChangePasswordModal";
import LockResetIcon from "@mui/icons-material/LockReset";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useProfilePhoto } from "../CommonCode/useQuery";
import { Skeleton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../Context/ThemeContext";

const ReusableSidebar = ({
  menuItems = [],
  user = {
    name: "Mr Arafat",
    role: "UI UX Designer",
    avatar: "",
  },
  onLogout
}) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  const [logoutCountdown, setLogoutCountdown] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);


  const authUser = getAuthUser();
  const { emp_name, id, role } = authUser ?? {};
  const { data: profilePhotoUrl = "", isLoading: LoadingProfilePicture } = useProfilePhoto(id);
  const { mode, toggleTheme } = useThemeMode();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarAnchorEl) {
        // Don't close if clicking inside the menu or on the avatar button itself
        if (
          event.target.closest('.MuiMenu-root') ||
          event.target.closest('[role="menu"]') ||
          avatarAnchorEl.contains(event.target)
        ) {
          return;
        }
        setAvatarAnchorEl(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [avatarAnchorEl]);

  const handleAvatarClick = useCallback((event) => {
    event.stopPropagation();
    if (open) {
      setAvatarAnchorEl(event.currentTarget);
    }
  }, [open]);


  const activeMenu = useMemo(() => {
    const path = location.pathname;
    for (const item of menuItems) {
      // Main menu
      if (item.path === path) {
        return item.label;
      }
      // Nested menu
      if (item.nested) {
        const sub = item.nested.find((s) => path === s.path);
        if (sub) return sub.label;
      }
    }

    return "";
  }, [location.pathname, menuItems]);



  const handleCloseAvatarMenu = () => {
    setAvatarAnchorEl(null);
  };

  useEffect(() => {
    setAvatarAnchorEl(null);
  }, [open]);



  const handleMenuClick = useCallback((item) => {
    if (!item.nested) {
      navigate(item.path);
      setOpenMenu(null);
      return;
    }
    if (!open) {
      setOpen(true);
      setOpenMenu(item.label);
      return;
    }
    setOpenMenu((prev) => (prev === item.label ? null : item.label));
  }, [navigate]);


  useEffect(() => {
    if (logoutCountdown !== null && logoutCountdown > 0) {
      const timer = setTimeout(() => {
        setLogoutCountdown(logoutCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (logoutCountdown === 0) {
      // Countdown finished, actually logout
      setLogoutModal(false);
      setLogoutCountdown(null);
      if (onLogout) onLogout();
    }
  }, [logoutCountdown, onLogout]);

  const cancelLogout = useCallback(() => {
    setLogoutModal(false);
    setLogoutCountdown(null);
  }, []);

  const handleSubMenuClick = useCallback((sub) => {
    navigate(sub.path);
  }, []);

  const handleLogout = () => setLogoutModal(true);

  const menuRowStyle = (isActive, isHovered) => ({
    display: "flex",
    alignItems: "center",
    gap: open ? 1.2 : 0,
    width: "100%",
    minHeight: 46,
    padding: open ? "0 14px" : "0",
    justifyContent: open ? "flex-start" : "center",
    borderRadius: 14,
    cursor: "pointer",
    userSelect: "none",
    color: isActive || isHovered ? "#ea580c" : (mode === 'dark' ? '#94a3b8' : '#374151'),
    background: isActive ? "rgba(249,115,22,0.10)" : "transparent",
    boxShadow: isActive ? "0 0 0 1px rgba(249,115,22,0.12) inset" : "none",
    transform: isHovered ? "translateX(2px)" : "translateX(0px)",
    transition: "all 0.18s ease",
  });

  return (
    <Box sx={{
      p: 1
    }}>
      <Box
        sx={{
          width: open ? 280 : 72,
          height: "95vh",
          bgcolor: mode === 'dark' ? '#0f172a' : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          color: mode === 'dark' ? '#f8fafc' : "#1f2937",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.25s ease",
          overflow: "hidden",
          borderRadius: 20,
          boxShadow: mode === 'dark' ? "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset" : "0 20px 60px rgba(86, 137, 255, 0.15), 0 0 0 1px rgba(255, 209, 153, 0.5) inset",
          border: mode === 'dark' ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.6)",
        }}
      >
        <Box
          sx={{
            p: open ? 1.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center",
            gap: open ? 1.2 : 0,
            minHeight: 70,
            borderBottom: mode === 'dark' ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(231, 229, 228, 0.4)",
            background: mode === 'dark' ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.4)",
            borderRadius: open ? "16px 16px 0 0" : 0,
          }}
        >
          {/* Logo/Icon */}
          <Box
            onClick={() => setOpen(prev => !prev)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 52,
              minHeight: 52,
              borderRadius: 50,
              cursor: 'pointer',
              background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
              boxShadow: "0 8px 24px rgba(234, 88, 12, 0.35)",
              animation: "float 3s ease-in-out infinite",
              '@keyframes float': {
                '0%, 100%': {
                  transform: 'translateY(0px)',
                },
                '50%': {
                  transform: 'translateY(-8px)',
                },
              },
            }}
          >
            <SupportAgentIcon
              sx={{
                fontSize: 28,
                color: "#ffffff",
                animation: "iconPulse 3s ease-in-out infinite",
                '@keyframes iconPulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                },
              }}
            />
          </Box>

          {/* Nexus Software Name */}
          {open && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Typography
                level="h5"
                sx={{
                  color: "#ea580c",
                  fontWeight: 800,
                  fontSize: "24px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Nexus
              </Typography>

              {/* Small badge */}
              <Box
                sx={{
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 6,
                  background: "rgba(234, 88, 12, 0.1)",
                  border: "1px solid rgba(234, 88, 12, 0.2)",
                }}
              >
                <Typography
                  level="body-xs"
                  sx={{
                    color: "#ea580c",
                    fontWeight: 600,
                    fontSize: "10px",
                  }}
                >
                  PRO
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            p: open ? 1.5 : 1,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {menuItems?.map((item) => (
            <Box key={item.label} sx={{ mb: item.groupLabel ? 1.5 : 0 }}>

              <Box
                role="button"
                tabIndex={0}
                onClick={() => handleMenuClick(item)}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={menuRowStyle(activeMenu === item.label, hoveredItem === item.label)}
              >
                {item.icon && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 18,
                      color: activeMenu === item.label || hoveredItem === item.label ? "#ea580c" : (mode === 'dark' ? '#cbd5e1' : '#0a0f17'),
                    }}
                  >
                    <item.icon sx={{ fontSize: 18 }} />
                  </Box>
                )}

                {open && (
                  <Typography level="body-sm" sx={{ flex: 1, color: "inherit", fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                )}

                {open && item.nested && (
                  <ExpandMoreIcon
                    sx={{
                      fontSize: 18,
                      color: hoveredItem === item.label ? "#ea580c" : (mode === 'dark' ? '#cbd5e1' : '#0e0f11'),
                      transform: openMenu === item.label ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.2s",
                    }}
                  />
                )}
              </Box>

              {open && openMenu === item.label && item.nested && (
                <Box sx={{ ml: 2.5, mt: 0.7 }}>
                  {item.nested.map((sub) => {
                    const isSubActive = activeMenu === sub.label;
                    const isSubHover = hoveredSub === sub.label;

                    return (
                      <Box
                        key={sub.label}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSubMenuClick(sub)}
                        onMouseEnter={() => setHoveredSub(sub.label)}
                        onMouseLeave={() => setHoveredSub(null)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          minHeight: 40,
                          px: 1.4,
                          borderRadius: 12,
                          cursor: "pointer",
                          userSelect: "none",
                          color: isSubActive || isSubHover ? "#ea580c" : (mode === 'dark' ? '#94a3b8' : '#151619'),
                          background: isSubActive ? "rgba(249,115,22,0.08)" : "transparent",
                          transform: isSubHover ? "translateX(2px)" : "translateX(0px)",
                          transition: "all 0.18s ease",
                        }}
                      >
                        <AdjustIcon
                          sx={{
                            fontSize: 11,
                            color: isSubActive || isSubHover ? "#ea580c" : (mode === 'dark' ? '#64748b' : '#9ca3af'),
                          }}
                        />
                        <Typography level="body-sm" sx={{ color: "inherit", fontWeight: 600 }}>
                          {sub.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          ))}
        </Box>

        <Divider sx={{ opacity: 0.6, borderColor: mode === 'dark' ? "rgba(255,255,255,0.1)" : "#e7e5e4" }} />

        <Box
          sx={{
            p: 1.4,
            minHeight: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            bgcolor: mode === 'dark' ? '#1e293b' : "#ffffff",
          }}
        >
          {open ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, width: "100%" }}>
              {
                LoadingProfilePicture ? (
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{ cursor: "pointer" }}
                  />
                ) : (
                  <Avatar
                    src={profilePhotoUrl ?? user.avatar}
                    size="sm"
                    onClick={handleAvatarClick}
                    sx={{ cursor: "pointer" }}
                  />
                )
              }

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography level="body-sm" fontWeight={600} noWrap sx={{ color: mode === 'dark' ? '#f8fafc' : "#111827" }}>
                  {emp_name}
                </Typography>
                <Typography level="body-xs" sx={{ color: mode === 'dark' ? '#94a3b8' : "#6b7280" }} noWrap>
                  {role}
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Box
                  onClick={toggleTheme}
                  role="button"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    cursor: "pointer",
                    color: mode === 'dark' ? '#94a3b8' : "#6b7280",
                    "&:hover": {
                      bgcolor: mode === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                      color: mode === 'dark' ? '#f8fafc' : "#111827",
                    },
                  }}
                >
                  {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                </Box>
                <Box
                  role="button"
                  tabIndex={0}
                  onClick={handleLogout}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    cursor: "pointer",
                    color: mode === 'dark' ? '#94a3b8' : "#6b7280",
                    "&:hover": {
                      bgcolor: "rgba(249,115,22,0.12)",
                      color: "#ea580c",
                    },
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              {
                LoadingProfilePicture ? (
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{ cursor: "pointer" }}
                  />
                ) : (
                  <Avatar
                    src={profilePhotoUrl ?? user.avatar}
                    size="sm"
                    onClick={handleAvatarClick}
                    sx={{ cursor: "pointer" }}
                  />
                )
              }
              <Box
                onClick={toggleTheme}
                role="button"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  cursor: "pointer",
                  color: mode === 'dark' ? '#94a3b8' : "#6b7280",
                  "&:hover": {
                    bgcolor: mode === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                    color: mode === 'dark' ? '#ea580c' : "#ea580c",
                  },
                }}
              >
                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </Box>
            </Box>
          )}
        </Box>

        <LogoutModal
          open={logoutModal}
          onClose={() => setLogoutModal(false)}
          onStartLogout={onLogout}
        />

        <Menu
          anchorEl={avatarAnchorEl}
          open={Boolean(avatarAnchorEl)}
          onClose={handleCloseAvatarMenu}
          placement="top-start"
          sx={{
            zIndex: 1400,
            overflow: 'visible',
            filter: 'drop-shadow(0px 16px 40px rgba(234, 88, 12, 0.15))',
            mt: { xs: 0, sm: -1 },
            ml: { xs: 1, sm: 2 },
            borderRadius: { xs: '16px', sm: '20px' },
            minWidth: { xs: 200, sm: 240 },
            background: mode === 'dark' ? 'linear-gradient(145deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.95) 100%)' : 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            backdropFilter: 'blur(24px)',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 1)',
            boxShadow: mode === 'dark' ? 'inset 0 0 0 1px rgba(255,255,255,0.1)' : 'inset 0 0 0 1px rgba(255,255,255,0.5)',
            padding: { xs: '6px 0', sm: '8px 0' },
            '--ListItem-radius': { xs: '12px', sm: '14px' },
            '& .JoyMenuItem-root': {
              px: { xs: 1, sm: 1.5 },
              py: { xs: 1, sm: 1.2 },
              mx: { xs: 1, sm: 1.5 },
              my: 0.5,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
            },
          }}
        >
          <Box sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 1, sm: 1.5 }, mb: 1, borderBottom: mode === 'dark' ? '1px dashed rgba(255, 255, 255, 0.2)' : '1px dashed rgba(231, 229, 228, 0.8)' }}>
            <Typography
              fontSize={{ xs: "10px", sm: "11px" }}
              fontWeight={800}
              color="#ea580c"
              textTransform="uppercase"
              letterSpacing="0.8px">
              Settings
            </Typography>
          </Box>
          <MenuItem
            onClick={() => {
              setOpen(false);
              navigate(`/home/my-profile`)
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              color: mode === 'dark' ? "#cbd5e1" : "#374151",
              fontWeight: 600,
              fontSize: { xs: "13px", sm: "14px" },
              zIndex: 1,
              "&:hover": {
                bgcolor: "transparent",
                color: "#ea580c",
                transform: "translateX(4px)",
                "& .icon-container": {
                  transform: "rotate(10deg) scale(1.15)",
                  background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)",
                },
              },
              "&::before": {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(234, 88, 12, 0.08) 0%, rgba(249, 115, 22, 0) 100%)',
                opacity: 0,
                zIndex: -1,
                transition: 'opacity 0.3s ease',
              },
              "&:hover::before": {
                opacity: 1,
              }
            }}
          >
            <Box
              className="icon-container"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                borderRadius: '10px',
                background: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(243, 244, 246, 0.8)',
                color: mode === 'dark' ? '#94a3b8' : '#6b7280',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <AccountCircleIcon
                sx={{
                  fontSize: { xs: '18px', sm: '20px' },
                  animation: "spinPulse 3s ease-in-out infinite",
                  "@keyframes spinPulse": {
                    "0%, 100%": { transform: "scale(1) rotate(0deg)" },
                    "50%": { transform: "scale(1.15) rotate(10deg)" }
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: "13px", sm: "14px" }, lineHeight: 1.2, color: 'inherit' }}>
                My Profile
              </Typography>
              <Typography sx={{ fontSize: { xs: "10px", sm: "11px" }, color: "#9ca3af", mt: 0.3, fontWeight: 500, transition: 'color 0.3s', '.MuiMenuItem-root:hover &': { color: '#fb923c' } }}>
                View Details
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleCloseAvatarMenu();
              setPasswordModalOpen(true);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              color: mode === 'dark' ? "#cbd5e1" : "#374151",
              fontWeight: 600,
              fontSize: { xs: "13px", sm: "14px" },
              zIndex: 1,
              "&:hover": {
                bgcolor: "transparent",
                color: "#ea580c",
                transform: "translateX(4px)",
                "& .icon-container": {
                  transform: "rotate(10deg) scale(1.15)",
                  background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)",
                },
              },
              "&::before": {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(234, 88, 12, 0.08) 0%, rgba(249, 115, 22, 0) 100%)',
                opacity: 0,
                zIndex: -1,
                transition: 'opacity 0.3s ease',
              },
              "&:hover::before": {
                opacity: 1,
              }
            }}
          >
            <Box
              className="icon-container"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                borderRadius: '10px',
                background: 'rgba(243, 244, 246, 0.8)',
                color: '#6b7280',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <LockResetIcon sx={{ fontSize: { xs: '18px', sm: '20px' } }} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600, fontSize: { xs: "13px", sm: "14px" }, lineHeight: 1.2, color: 'inherit' }}>
                Change Password
              </Typography>
              <Typography sx={{ fontSize: { xs: "10px", sm: "11px" }, color: "#9ca3af", mt: 0.3, fontWeight: 500, transition: 'color 0.3s', '.JoyMenuItem-root:hover &': { color: '#fb923c' } }}>
                Update your credentials
              </Typography>
            </Box>
          </MenuItem>


        </Menu>

        <ChangePasswordModal
          open={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default memo(ReusableSidebar);