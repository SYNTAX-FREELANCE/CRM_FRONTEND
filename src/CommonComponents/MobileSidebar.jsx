// MobileSidebar.jsx
import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    Divider,
    Avatar,
    IconButton,
    Collapse,
} from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AdjustIcon from "@mui/icons-material/Adjust";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const MobileSidebar = ({ menuItems = [], user, onLogout }) => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [activeMenu, setActiveMenu] = useState("Dashboard");

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
                <Box sx={{ width: 280, p: 2 }}>

                    {/* USER HEADER */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar />
                        <Box>
                            <Typography fontWeight={700}>{user?.name}</Typography>
                            <Typography fontSize={12} color="text.secondary">
                                {user?.role}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

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

                    {/* LOGOUT */}
                    <Divider sx={{ my: 2 }} />

                    <Box
                        onClick={onLogout}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1.2,
                            cursor: "pointer",
                            borderRadius: 2,
                            color: "#dc2626",
                        }}
                    >
                        <LogoutIcon fontSize="small" />
                        <Typography fontWeight={600}>Logout</Typography>
                    </Box>

                </Box>
            </Drawer>
        </>
    );
};

export default MobileSidebar;