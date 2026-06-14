import React, { useState, memo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  // ListItemContent,
  Divider,
  Modal,
  Button,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import AdjustIcon from "@mui/icons-material/Adjust";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuItem from "./MenuItem";


const ReusableSidebar = ({
  menuItems = [],
  title = "Dashboard",
  subTitle = "",
  logo = null,
}) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [activeMenu, setActiveMenu] = useState("");

  // Modal state
  const [logoutModal, setLogoutModal] = useState(false);

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

  const handleLogout = () => {
    // Show confirmation modal
    setLogoutModal(true);
  };

  const confirmLogout = () => {
    // Clear only the specific localStorage key
    localStorage.removeItem("authUser");
    setLogoutModal(false);
    navigate("/home");
  };

  const cancelLogout = () => {
    setLogoutModal(false);
  };

  return (
    <Box
      sx={{
        width: open ? 260 : 70,
        height: "100vh",
        bgcolor: "#111827",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
      }}
    >
      {/* Header */}
      <Box
        onClick={() => {
          setOpen(!open);
          if (open) setOpenMenu(null);
        }}
        sx={{ position: "relative", mb: 1, cursor: "pointer" }}
      >
        {!open && logo && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img src={logo} alt="logo" width={60} height={50} />
          </Box>
        )}

        {open && (
          <>
            <KeyboardDoubleArrowLeftIcon
              sx={{
                position: "absolute",
                right: 10,
                top: 10,
                color: "white",
                fontSize: 20,
              }}
            />
            <Typography level="h4" sx={{ color: "white" }}>
              {title}
            </Typography>
            <Typography level="body-sm" sx={{ color: "white" }}>
              {subTitle}
            </Typography>
          </>
        )}
      </Box>

      <Divider />

      {/* Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <div key={item.label}>
            <MenuItem
              {...item}
              open={open}
              active={activeMenu === item.label}
              onClick={() => handleMenuClick(item)}
              endIcon={
                item.nested && open && (
                  <ExpandMoreIcon
                    sx={{
                      color: "white",
                      transform:
                        openMenu === item.label
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition: "0.3s",
                    }}
                  />
                )
              }
            />

            {open && openMenu === item.label && item.nested && (
              <Box sx={{ ml: 3 }}>
                {item.nested.map((sub) => (
                  <ListItem key={sub.label}>
                    <ListItemButton
                      onClick={() => handleSubMenuClick(sub)}
                      sx={{
                        bgcolor:
                          activeMenu === sub.label ? "#1f2937" : "transparent",
                        "&:hover": { bgcolor: "#374151" },
                      }}
                    >
                      <AdjustIcon
                        sx={{
                          fontSize: 14,
                          mr: 1,
                          color: "#9ca3af",
                        }}
                      />
                      <span style={{ color: "white" }}>
                        {sub.label}
                      </span>
                    </ListItemButton>
                  </ListItem>
                ))}
              </Box>
            )}
          </div>
        ))}
      </List>

      {/* Logout */}
      <MenuItem
        icon={LogoutIcon}
        label="Logout"
        open={open}
        onClick={handleLogout}
      />

      {/* Logout Confirmation Modal */}
      <Modal
        open={logoutModal}
        onClose={cancelLogout}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            width: 300,
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
              onClick={cancelLogout}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={confirmLogout}
              sx={{ flex: 1 }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default memo(ReusableSidebar);