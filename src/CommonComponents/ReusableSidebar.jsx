import React, { useState, memo } from "react";
import { Box, Typography, Modal, Button, Avatar, Divider } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AdjustIcon from "@mui/icons-material/Adjust";
import LogoutIcon from "@mui/icons-material/Logout";
import { color } from "@mui/system";

const ReusableSidebar = ({
  menuItems = [],
  user = {
    name: "Mr Arafat",
    role: "UI UX Designer",
    avatar: "",
  },
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeMenu, setActiveMenu] = useState("");
  const [logoutModal, setLogoutModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);

  const handleMenuClick = (item) => {
    if (!item.nested) {
      setActiveMenu(item.label);
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
  };

  const handleSubMenuClick = (sub) => {
    setActiveMenu(sub.label);
    navigate(sub.path);
  };

  const handleLogout = () => setLogoutModal(true);

  const confirmLogout = () => {
    localStorage.removeItem("authUser");
    setLogoutModal(false);
    navigate("/home");
  };

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
    color: isActive || isHovered ? "#ea580c" : "#374151",
    background: isActive ? "rgba(249,115,22,0.10)" : "transparent",
    boxShadow: isActive ? "0 0 0 1px rgba(249,115,22,0.12) inset" : "none",
    transform: isHovered ? "translateX(2px)" : "translateX(0px)",
    transition: "all 0.18s ease",
  });

  return (
    <Box
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false);
        setOpenMenu(null);
        setHoveredItem(null);
        setHoveredSub(null);
      }}
      sx={{
        width: open ? 280 : 72,
        height: "100vh",
        bgcolor: "#ffffff",
        color: "#1f2937",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
      }}
    >
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
                    color: activeMenu === item.label || hoveredItem === item.label ? "#ea580c" : "#0a0f17",
                  }}
                >
                  <item.icon sx={{ fontSize: 18 }} />
                </Box>
              )}

              {open && (
                <Typography level="body-sm" sx={{ flex: 1, color: "inherit",fontWeight:600}}>
                  {item.label}
                </Typography>
              )}

              {open && item.nested && (
                <ExpandMoreIcon
                  sx={{
                    fontSize: 18,
                    color: hoveredItem === item.label ? "#ea580c" : "#0e0f11",
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
                        color: isSubActive || isSubHover ? "#ea580c" : "#151619",
                        background: isSubActive ? "rgba(249,115,22,0.08)" : "transparent",
                        transform: isSubHover ? "translateX(2px)" : "translateX(0px)",
                        transition: "all 0.18s ease",
                      }}
                    >
                      <AdjustIcon
                        sx={{
                          fontSize: 11,
                          color: isSubActive || isSubHover ? "#ea580c" : "#9ca3af",
                        }}
                      />
                      <Typography level="body-sm" sx={{ color: "inherit",fontWeight:600 }}>
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

      <Divider sx={{ opacity: 0.6, borderColor: "#e7e5e4" }} />

      <Box
        sx={{
          p: 1.4,
          minHeight: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          bgcolor: "#ffffff",
        }}
      >
        {open ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, width: "100%" }}>
            <Avatar src={user.avatar} size="sm" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography level="body-sm" fontWeight={600} noWrap sx={{ color: "#111827" }}>
                {user.name}
              </Typography>
              <Typography level="body-xs" sx={{ color: "#6b7280" }} noWrap>
                {user.role}
              </Typography>
            </Box>
            <Box
              role="button"
              tabIndex={0}
              onClick={handleLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 12,
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
        ) : (
          <Avatar src={user.avatar} size="sm" />
        )}
      </Box>

      <Modal
        open={logoutModal}
        onClose={() => setLogoutModal(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "white",
            p: 3,
            borderRadius: 16,
            width: 320,
            textAlign: "center",
          }}
        >
          <Typography fontWeight={600} mb={2}>
            Are you sure you want to logout?
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setLogoutModal(false)}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={confirmLogout} sx={{ flex: 1 }}>
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default memo(ReusableSidebar);