import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ label, value, color }) => {
  return (
    <Card
      elevation={0}
      sx={{
        flex: "1 1 0px",
        minWidth: {
          xs: "calc(50% - 8px)",
          sm: "calc(33.33% - 12px)",
          md: "0",
        },
        borderRadius: 4,
        border: "1px solid rgba(255, 255, 255, 0.65)",
        borderLeft: `4px solid ${color}`,
        background: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.02)",
        transition: "all 0.25s ease-in-out",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
        },
      }}
    >
      <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
        <Typography
          variant="caption"
          sx={{
            color: "#475569",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: 10,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color,
            mt: 1,
            fontWeight: 900,
            letterSpacing: "-1px",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;