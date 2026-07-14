import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const Row = ({ label, value, icon, accent = "blue" }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 1.5,
      py: 0.75,
      px: 0.25,
      borderBottom: "1px solid",
      borderColor: accent === "orange" ? "rgba(249,115,22,.10)" : "rgba(37,99,235,.10)",
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
      {icon && (
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: "7px",
            display: "grid",
            placeItems: "center",
            bgcolor: accent === "orange" ? "rgba(249,115,22,.12)" : "rgba(37,99,235,.12)",
            color: accent === "orange" ? "warning.dark" : "primary.main",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          color: accent === "orange" ? "warning.dark" : "primary.main",
          textTransform: "uppercase",
          letterSpacing: 0.6,
          whiteSpace: "nowrap",
            fontSize: { xs: 11, sm: 14 }
        }}
      >
        {label}
      </Typography>
    </Stack>

    <Typography
      variant="body2"
      sx={{
        fontSize: { xs: 10, sm: 14 },
        fontWeight: 600,
        color: "text.primary",
        textAlign: "right",
        wordBreak: "break-word",
        ml: 1,
        width: '80%'
      }}
    >
      {value || "-"}
    </Typography>
  </Box>
);

export default Row;