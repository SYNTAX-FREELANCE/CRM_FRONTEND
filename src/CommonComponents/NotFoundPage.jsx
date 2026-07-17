import React, { memo } from "react";
import { Box, Typography, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F59E0B",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Floating circles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: 60 + i * 18,
            height: 60 + i * 18,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,.08)",
            left: `${10 + i * 12}%`,
            top: `${5 + (i % 4) * 22}%`,
            animation: `float${i} ${5 + i}s ease-in-out infinite`,
            "@keyframes float0": {
              "0%,100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
            "@keyframes float1": {
              "0%,100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(25px)" },
            },
            "@keyframes float2": {
              "0%,100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-30px)" },
            },
            "@keyframes float3": {
              "0%,100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(18px)" },
            },
            "@keyframes float4": {
              "0%,100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-24px)" },
            },
            "@keyframes float5": {
              "0%,100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(22px)" },
            },
            "@keyframes float6": {
              "0%,100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-28px)" },
            },
            "@keyframes float7": {
              "0%,100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(26px)" },
            },
          }}
        />
      ))}

      {/* Content */}
      <Box
        sx={{
          textAlign: "center",
          zIndex: 2,
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "7rem",
              sm: "9rem",
              md: "13rem",
            },
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 0.8,
            letterSpacing: "-10px",
            textShadow: `
                6px 6px 0 #0C2844,
                12px 12px 0 rgba(12,40,68,.35)
            `,
            animation: "bounce 4s ease-in-out infinite",
            "@keyframes bounce": {
              "0%,100%": {
                transform: "translateY(0px)",
              },
              "50%": {
                transform: "translateY(-10px)",
              },
            },
          }}
        >
          404
        </Typography>

        <Typography
          sx={{
            mt: 2,
            color: "#0C2844",
            fontWeight: 800,
            fontSize: {
              xs: "2rem",
              md: "3rem",
            },
          }}
        >
          Oops!
        </Typography>

        <Typography
          sx={{
            color: "#fff",
            mt: 1,
            fontSize: {xs:12,sm:20},
            maxWidth: 600,
            mx: "auto",
            opacity: .95,
          }}
        >
          Looks like the page you're looking for has gone on a coffee break.
          Let's get you back where you belong.
        </Typography>

        <Box
          sx={{
            mt: 5,
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/home")}
            sx={{
              bgcolor: "#0C2844",
              color: "#fff",
              px: 5,
              borderRadius: "50px",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#081c30",
              },
            }}
          >
            Go Home
          </Button>

          <Button
            size="lg"
            variant="soft"
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#ffffff",
              color: "#0C2844",
              px: 5,
              borderRadius: "50px",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#f3f4f6",
              },
            }}
          >
            Go Back
          </Button>
        </Box>
      </Box>

      {/* Bottom Wave */}
      <Box
        sx={{
          position: "absolute",
          bottom: -120,
          left: -150,
          width: "140%",
          height: 250,
          borderRadius: "50%",
          bgcolor: "#0C2844",
        }}
      />
    </Box>
  );
};

export default memo(NotFoundPage);