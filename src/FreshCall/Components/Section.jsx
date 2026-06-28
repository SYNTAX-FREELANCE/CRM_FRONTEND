import React, { useState } from "react";
import { Box, Typography, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const glassEffect = {
  border: "1px solid rgba(255, 255, 255, 0.22)",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const Section = ({ title, icon, children, accent = "blue", defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const isOrange = accent === "orange";

  return (
    <Box
      sx={{
        borderRadius: 2.5,
        ...glassEffect,
        bgcolor: isOrange ? "rgba(255, 247, 237, 0.45)" : "rgba(239, 246, 255, 0.45)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          bgcolor: isOrange ? "rgba(255, 247, 237, 0.55)" : "rgba(239, 246, 255, 0.55)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
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
          bgcolor: isOrange ? "rgba(249, 115, 22, 0.08)" : "rgba(37, 99, 235, 0.08)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
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
              bgcolor: isOrange ? "rgba(249, 115, 22, 0.2)" : "rgba(37, 99, 235, 0.2)",
              color: isOrange ? "#f97316" : "#2563eb",
              flexShrink: 0,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
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
            color: isOrange ? "#f97316" : "#2563eb",
            fontSize: "0.72rem",
            flex: 1,
          }}
        >
          {title}
        </Typography>

        <IconButton size="small" sx={{ color: isOrange ? "#f97316" : "#2563eb" }}>
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