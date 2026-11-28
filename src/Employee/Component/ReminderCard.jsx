import React from "react";
import { Box, Avatar, Typography, Chip, useTheme } from "@mui/material";

const ReminderCard = ({ title, count, color, bg, icon, icons, active, onClick }) => {
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

        background: isDark
          ? "linear-gradient(110deg, #102c25 0%, #142f25 100%)"
          : "linear-gradient(110deg, #e8f5ed 0%, #dcefe3 100%)",

        border: active
          ? "1px solid rgba(74, 222, 128, 0.35)"
          : isDark
            ? "1px solid rgba(74, 222, 128, 0.08)"
            : "1px solid rgba(22, 101, 52, 0.10)",

        boxShadow: active
          ? isDark
            ? "0 8px 25px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.10)"
            : "0 8px 25px rgba(22,101,52,0.14), inset 0 1px 0 rgba(255,255,255,0.85)"
          : isDark
            ? "0 8px 25px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 8px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.85)",

        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",

        cursor: "pointer",
        transition: "all 0.25s ease",

        "&:hover": {
          transform: "translateY(-2px)",

          boxShadow: isDark
            ? "0 12px 30px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.12)"
            : "0 12px 30px rgba(22,101,52,0.14), inset 0 1px 0 rgba(255,255,255,1)",
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
        {icons}
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