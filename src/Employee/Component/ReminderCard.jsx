import React from "react";
import { Box, Avatar, Typography, Chip, useTheme } from "@mui/material";

const ReminderCard = ({ title, count, color, bg, icon, active, onClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: { xs: 1.25, md: 1.5 },
        borderRadius: 3,
        bgcolor: active 
          ? (isDark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.06)")
          : (isDark ? "rgba(30,41,59,0.7)" : "#fff"),
        border: active
          ? "1px solid rgba(37,99,235,0.35)"
          : (isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(226,232,240,0.9)"),
        boxShadow: active
          ? (isDark ? "0 10px 25px rgba(0,0,0,0.5)" : "0 10px 25px rgba(37,99,235,0.10)")
          : (isDark ? "none" : "0 6px 18px rgba(15,23,42,0.04)"),
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: bg,
          color,
          width: { xs: 36, md: 40 },
          height: { xs: 36, md: 40 },
        }}
      >
        {icon}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            color: isDark ? "#f8fafc" : "#0f172a",
            fontWeight: 800,
            fontSize: { xs: 10, md: 12 },
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        {/* <Typography
          sx={{
            fontSize: { xs: 8, md: 10 },
            color: "text.secondary",
            mt: 0.25,
          }}
        >
          Tap to view reminders
        </Typography> */}
      </Box>

      <Chip
        label={count}
        size="small"
        sx={{
          bgcolor: bg,
          color,
          fontWeight: 900,
          minWidth: 34,
          "& .MuiChip-label": { px: 1 },
        }}
      />
    </Box>
  );
};

export default ReminderCard;