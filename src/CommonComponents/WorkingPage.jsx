// src/Common/WorkingPage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";

const WorkingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#ffffff",
        color: "white",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography level="h2" sx={{ mb: 2 }}>
        🚧 Feature Coming Soon
      </Typography>

      <Typography level="body-lg" sx={{ mb: 3, opacity: 0.7 }}>
        This page is under development. We’re working on it!
      </Typography>

      <Button
        color="primary"
        onClick={() => navigate(-1)} //  go back
      >
        Go Back
      </Button>
    </Box>
  );
};

export default WorkingPage;