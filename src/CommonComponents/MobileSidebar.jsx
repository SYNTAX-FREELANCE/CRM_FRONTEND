// MobileSidebar.jsx
import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    Divider,
    Avatar,
    Collapse,
    Menu,
    MenuItem,
} from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AdjustIcon from "@mui/icons-material/Adjust";
import LogoutIcon from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "./ChangePasswordModal";
import LogoutModal from "./LogoutModal";

const MobileSidebar = ({ menuItems = [], user, onLogout }) => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const [logoutCountdown, setLogoutCountdown] = useState(null);

    useEffect(() => {
        if (logoutCountdown !== null && logoutCountdown > 0) {
            const timer = setTimeout(() => {
                setLogoutCountdown(logoutCountdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (logoutCountdown === 0) {
            setLogoutModal(false);
            setLogoutCountdown(null);
            if (onLogout) onLogout();
        }
    }, [logoutCountdown, onLogout]);

    const handleLogout = () => setLogoutModal(true);

    const handleAvatarClick = (event) => {
        event.stopPropagation();
        setAvatarAnchorEl(event.currentTarget);
    };

    const handleCloseAvatarMenu = () => {
        setAvatarAnchorEl(null);
    };

    useEffect(() => {
        setAvatarAnchorEl(null);
    }, [open]);

    const handleNavigate = (item) => {
        if (item.path) {
            setActiveMenu(item.label);
            navigate(item.path);
            setOpen(false);
        } else {
            setExpanded(expanded === item.label ? null : item.label);
        }
    };

    const handleSub = (sub) => {
        setActiveMenu(sub.label);
        navigate(sub.path);
        setOpen(false);
    };

    return (
        <>
            {/* Top bar button */}
            {/* <Box sx={{ p: 1 }}>
                <IconButton onClick={() => setOpen(true)}>
                    <MenuIcon />
                </IconButton>
            </Box> */}
            <Box
                onClick={() => setOpen(true)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 52,
                    minHeight: 52,
                    borderRadius: 50,
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

            {/* Drawer */}
            <Drawer
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Box sx={{
                    width: 280,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                }}>
                    <Box
                        sx={{
                            p: 1.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            minHeight: 70,
                            borderBottom: "1px solid rgba(231, 229, 228, 0.4)",
                            background: "rgba(255, 255, 255, 0.4)",
                        }}
                    >
                        {/* Logo/Icon */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 52,
                                minHeight: 52,
                                borderRadius: 50,
                                background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                                boxShadow: "0 8px 24px rgba(234, 88, 12, 0.35)",
                                animation: "float 3s ease-in-out infinite",
                                '@keyframes float': {
                                    '0%, 100%': { transform: 'translateY(0px)' },
                                    '50%': { transform: 'translateY(-8px)' },
                                },
                            }}
                        >
                            <SupportAgentIcon
                                sx={{
                                    fontSize: 28,
                                    color: "#ffffff",
                                    animation: "iconPulse 3s ease-in-out infinite",
                                    '@keyframes iconPulse': {
                                        '0%, 100%': { transform: 'scale(1)' },
                                        '50%': { transform: 'scale(1.1)' },
                                    },
                                }}
                            />
                        </Box>
                        {/* Nexus Software Name */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Typography
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
                                <Typography sx={{ color: "#ea580c", fontWeight: 600, fontSize: "10px" }}>
                                    PRO
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
                        {/* MENU */}
                        {menuItems.map((item) => {
                            const isActive = activeMenu === item.label;

                            return (
                                <Box key={item.label} sx={{ mb: 1 }}>
                                    {/* MAIN ITEM */}
                                    <Box
                                        onClick={() => handleNavigate(item)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            p: 1.2,
                                            borderRadius: 2,
                                            cursor: "pointer",
                                            bgcolor: isActive ? "rgba(249,115,22,0.1)" : "transparent",
                                            color: isActive ? "#ea580c" : "#111827",
                                        }}
                                    >
                                        <Typography fontWeight={600}>
                                            {item.label}
                                        </Typography>

                                        {item.nested &&
                                            (expanded === item.label ? (
                                                <ExpandLessIcon />
                                            ) : (
                                                <ExpandMoreIcon />
                                            ))}
                                    </Box>

                                    {/* SUB MENU */}
                                    {item.nested && (
                                        <Collapse in={expanded === item.label}>
                                            <Box sx={{ pl: 2 }}>
                                                {item.nested.map((sub) => (
                                                    <Box
                                                        key={sub.label}
                                                        onClick={() => handleSub(sub)}
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                            p: 1,
                                                            cursor: "pointer",
                                                            borderRadius: 2,
                                                            "&:hover": {
                                                                bgcolor: "rgba(249,115,22,0.08)",
                                                            },
                                                        }}
                                                    >
                                                        <AdjustIcon sx={{ fontSize: 12 }} />
                                                        <Typography fontSize={14}>
                                                            {sub.label}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Collapse>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>

                    <Divider sx={{ opacity: 0.6, borderColor: "#e7e5e4" }} />

                    <Box
                        sx={{
                            p: 1.4,
                            minHeight: 38,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            bgcolor: "#ffffff",
                        }}
                    >
                        <Box  sx={{ display: "flex", alignItems: "center", gap: 1.2, width: "100%" }}>
                            <Avatar
                                src={user?.avatar}
                                onClick={handleAvatarClick}
                                sx={{ cursor: "pointer", width: 32, height: 32 }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography fontWeight={600} fontSize={14} noWrap sx={{ color: "#111827" }}>
                                    {user?.name}
                                </Typography>
                                <Typography fontSize={12} sx={{ color: "#6b7280" }} noWrap>
                                    {user?.role}
                                </Typography>
                            </Box>
                            <Box
                                onClick={handleLogout}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 36,
                                    height: 36,
                                    borderRadius: 3,
                                    cursor: "pointer",
                                    color: "#6b7280",
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

                </Box>
            </Drawer>

            <Menu
                anchorEl={avatarAnchorEl}
                open={Boolean(avatarAnchorEl)}
                onClose={handleCloseAvatarMenu}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 16px 40px rgba(234, 88, 12, 0.15))',
                        mt: { xs: 0, sm: -1 },
                        ml: { xs: 1, sm: 2 },
                        borderRadius: { xs: '16px', sm: '20px' },
                        minWidth: { xs: 220, sm: 240 },
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 1)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
                        padding: { xs: '6px 0', sm: '8px 0' },
                        '& .MuiMenuItem-root': {
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 1, sm: 1.2 },
                            borderRadius: { xs: '12px', sm: '14px' },
                            mx: { xs: 1, sm: 1.5 },
                            my: 0.5,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                        },
                    }
                }}
                sx={{ zIndex: 1400 }}
            >
                <Box sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 1, sm: 1.5 }, mb: 1, borderBottom: '1px dashed rgba(231, 229, 228, 0.8)' }}>
                    <Typography fontSize={{ xs: "10px", sm: "11px" }} fontWeight={800} color="#ea580c" textTransform="uppercase" letterSpacing="0.8px">
                        Security Settings
                    </Typography>
                </Box>

                <MenuItem
                    onClick={() => {
                        handleCloseAvatarMenu();
                        setPasswordModalOpen(true);
                    }}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1.5, sm: 2 },
                        color: "#374151",
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
                        <LockResetIcon 
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
                            Change Password
                        </Typography>
                        <Typography sx={{ fontSize: { xs: "10px", sm: "11px" }, color: "#9ca3af", mt: 0.3, fontWeight: 500, transition: 'color 0.3s', '.MuiMenuItem-root:hover &': { color: '#fb923c' } }}>
                            Update your credentials
                        </Typography>
                    </Box>
                </MenuItem>
            </Menu>

            <ChangePasswordModal
                open={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />

            <LogoutModal
                open={logoutModal}
                onClose={() => setLogoutModal(false)}
                onStartLogout={onLogout}
            />
        </>
    );
};

export default MobileSidebar;