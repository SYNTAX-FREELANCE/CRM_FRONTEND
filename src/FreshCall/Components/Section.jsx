import React, { useState } from "react";
import { Box, Typography, Collapse, IconButton, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Section = ({ title, icon, children, accent = "blue", defaultExpanded = true }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [expanded, setExpanded] = useState(defaultExpanded);

  const isOrange = accent === "orange";

  return (
    <Box
      sx={{
        borderRadius: 2.5,
        border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.22)",
        boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.3)" : "0 10px 30px rgba(15, 23, 42, 0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        bgcolor: isDark
          ? (isOrange ? "rgba(30, 41, 59, 0.6)" : "rgba(30, 41, 59, 0.6)")
          : (isOrange ? "rgba(255, 247, 237, 0.45)" : "rgba(239, 246, 255, 0.45)"),
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          bgcolor: isDark
            ? (isOrange ? "rgba(30, 41, 59, 0.8)" : "rgba(30, 41, 59, 0.8)")
            : (isOrange ? "rgba(255, 247, 237, 0.55)" : "rgba(239, 246, 255, 0.55)"),
          border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(255, 255, 255, 0.25)",
        },
      }}
    >
      <Box
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          userSelect: "none",
          bgcolor: isDark
            ? (isOrange ? "rgba(249, 115, 22, 0.18)" : "rgba(37, 99, 235, 0.18)")
            : (isOrange ? "rgba(249, 115, 22, 0.08)" : "rgba(37, 99, 235, 0.08)"),
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        {icon && (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "10px",
              display: "grid",
              placeItems: "center",
              bgcolor: isOrange
                ? (isDark ? "rgba(249, 115, 22, 0.25)" : "rgba(249, 115, 22, 0.2)")
                : (isDark ? "rgba(37, 99, 235, 0.25)" : "rgba(37, 99, 235, 0.2)"),
              color: isOrange
                ? (isDark ? "#fb923c" : "#f97316")
                : (isDark ? "#60a5fa" : "#2563eb"),
              flexShrink: 0,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            {icon}
          </Box>
        )}

        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            letterSpacing: 0.9,
            textTransform: "uppercase",
            color: isOrange
              ? (isDark ? "#fb923c" : "#f97316")
              : (isDark ? "#60a5fa" : "#2563eb"),
            fontSize: "0.72rem",
            flex: 1,
          }}
        >
          {title}
        </Typography>

        <IconButton size="small" sx={{ color: isOrange ? (isDark ? "#fb923c" : "#f97316") : (isDark ? "#60a5fa" : "#2563eb") }}>
          <ExpandMoreIcon
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
            }}
          />
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 1, py: 0.5 }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default Section;