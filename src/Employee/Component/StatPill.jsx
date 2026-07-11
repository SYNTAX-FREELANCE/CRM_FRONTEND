import React, { memo } from "react";
import { Box, Typography } from "@mui/material";

const StatPill = ({
  icon,
  label,
  value,
  accent = "blue",
  colors,
}) => {
  const tone =
    accent === "orange"
      ? { bg: colors.orangeSoft, fg: colors.orange }
      : { bg: colors.blueSoft, fg: colors.blue };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px:3,
        py: 0.2,
        borderRadius:1,
        bgcolor: tone.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Box sx={{ color: tone.fg, display: "flex", alignItems: "center" }}>
        {icon}
      </Box>

      <Box>
        <Typography sx={{ fontSize: 11, color: colors.muted, lineHeight: 1.1 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.ink, lineHeight: 1.2 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default memo(StatPill);