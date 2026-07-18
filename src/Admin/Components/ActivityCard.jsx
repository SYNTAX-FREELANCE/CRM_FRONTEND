import React, { memo } from "react";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";

const ActivityCard = ({ activity, icon, color, bgcolor }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        p: 2,
        borderRadius: 3,
        bgcolor: isDark ? "rgba(15,23,42,0.6)" : "#fff",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(229,231,235,0.5)",
        transition: "0.2s",
        cursor: "pointer",

        "&:hover": {
          bgcolor: isDark ? "rgba(30,41,59,0.8)" : "#f8fafc",
          transform: "translateX(4px)",
          boxShadow: isDark ? "0 8px 20px rgba(0,0,0,0.5)" : "0 8px 20px rgba(37,99,235,.15)",
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: color,
          width: 44,
          height: 44,
          mr: 2,
          borderRadius: '50%',
        }}
      >
        {icon}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0.5,
          }}
        >
          <Typography fontSize={14} fontWeight={700} color={isDark ? "#f8fafc" : "inherit"}>
            {activity?.name}
          </Typography>

          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              bgcolor,
              color,
              borderRadius: 2,
            }}
          >
            <Typography fontSize={9} fontWeight={800}>
              {activity?.status_name}
            </Typography>
          </Box>
        </Box>

        <Typography fontSize={12} fontWeight={500} color={isDark ? "#cbd5e1" : "inherit"}>
          {activity?.remarks}
        </Typography>

        <Typography
          fontSize={11}
          color={isDark ? "#94a3b8" : "text.secondary"}
          sx={{ mt: 0.5 }}
        >
          {format(new Date(activity.changed_at), "dd MMM yyyy, hh:mm a")}
        </Typography>
      </Box>
    </Box>
  );
};

export default memo(ActivityCard);