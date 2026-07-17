import React, { memo } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { format } from "date-fns";

const ActivityCard = ({ activity, icon, color, bgcolor }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        p: 2,
        borderRadius: 3,
        bgcolor: "#fff",
        border: "1px solid rgba(229,231,235,0.5)",
        transition: "0.2s",
        cursor: "pointer",

        "&:hover": {
          bgcolor: "#f8fafc",
          transform: "translateX(4px)",
          boxShadow: "0 8px 20px rgba(37,99,235,.15)",
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
          <Typography fontSize={14} fontWeight={700}>
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

        <Typography fontSize={12} fontWeight={500}>
          {activity?.remarks}
        </Typography>

        <Typography
          fontSize={11}
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {format(new Date(activity.changed_at), "dd MMM yyyy, hh:mm a")}
        </Typography>
      </Box>
    </Box>
  );
};

export default memo(ActivityCard);