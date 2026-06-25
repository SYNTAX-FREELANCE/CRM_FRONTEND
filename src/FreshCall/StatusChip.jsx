import React from "react";
import { Chip } from "@mui/material";
import { statusColors } from "../CommonCode/Reusable";

const StatusChip = ({ status }) => {
  const s = statusColors[status] || statusColors.New;

  return (
    <Chip
      size="small"
      label={status}
      sx={{
        backgroundColor: s.bg,
        color: s.color,
        fontWeight: 700,
        borderRadius: "999px",
        px: 1,
      }}
    />
  );
};

export default StatusChip;