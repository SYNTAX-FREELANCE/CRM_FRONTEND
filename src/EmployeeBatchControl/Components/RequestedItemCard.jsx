import React, { memo } from "react";
import { Box, Stack, Typography, Avatar, Chip } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const RequestedItemCard = ({ item, onSelectRequest }) => {
  return (
    <Box
      onClick={() => onSelectRequest?.(item)}
      sx={{
        p: 1.5,
        borderRadius: 3,
        border: "1px solid rgba(226,232,240,0.9)",
        bgcolor: "#fff",
        boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
        },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1.2}>
        <Stack direction="row" spacing={1.2} alignItems="flex-start" sx={{ minWidth: 0, flex: 1 }}>
          <Avatar
            sx={{
              bgcolor:"rgba(249,115,22,0.12)",
              color: "#f9920a",
              width: { xs: 30, sm: 38 },
              height: { xs: 30, sm: 38 },
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: 13, sm: 15 } }}>
              {item.name}
            </Typography>
            <Typography sx={{ fontSize: { xs: 10.5, sm: 12 }, color: "#64748b",  }}>
              {item.empId} • {item.designation}
            </Typography>
            <Typography sx={{ fontSize: { xs: 11.5, sm: 13 }, color: "#475569", }}>
              {item.message}
            </Typography>
            <Typography sx={{ fontSize: { xs: 10.5, sm: 12 }, color: "#94a3b8", }}>
              {item.time}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default memo(RequestedItemCard);