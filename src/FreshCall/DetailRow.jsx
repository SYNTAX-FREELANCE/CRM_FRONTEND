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
        py: 1,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Typography
        variant="body2"
        color="#64748b"
        sx={{
          minWidth: 140,
          fontWeight: 500,
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