import React from "react";
import { ListItem, ListItemButton, Typography } from "@mui/joy";

const MenuItem = ({
  icon: Icon,
  label,
  open,
  active,
  hovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  endIcon,
}) => {
  return (
    <ListItem sx={{ px: 0, py: 0.2 }}>
      <ListItemButton
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        sx={{
          borderRadius: 14,
          px: open ? 1.5 : 1.2,
          py: 1,
          justifyContent: open ? "flex-start" : "center",
          minHeight: 44,
          color: active || hovered ? "#fff" : "#d1d5db",
          bgcolor: active ? "rgba(245,158,11,0.16)" : "transparent",
          boxShadow: active ? "0 0 0 1px rgba(245,158,11,0.18) inset" : "none",
          transform: hovered ? "translateX(2px)" : "translateX(0px)",
          transition: "all 0.18s ease",
          "&:hover": {
            bgcolor: "rgba(245,158,11,0.12)",
            color: "#fff",
          },
        }}
      >
        {Icon && (
          <Icon
            sx={{
              fontSize: 18,
              color: active || hovered ? "#f59e0b" : "#9ca3af",
            }}
          />
        )}

        {open && (
          <Typography level="body-sm" sx={{ ml: 1.2, flex: 1 }}>
            {label}
          </Typography>
        )}

        {open && endIcon}
      </ListItemButton>
    </ListItem>
  );
};

export default MenuItem;