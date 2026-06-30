import React from "react";
import { Stack, Typography } from "@mui/material";

const DetailRow = ({ label, value }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      sx={{
        py: 1.2,
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          minWidth: 140,
          fontWeight: 500,
          color: "#64748b",
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: "#0f172a",
          textAlign: "right",
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </Typography>
    </Stack>
  );
};

export default DetailRow;