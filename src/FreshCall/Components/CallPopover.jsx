import React from "react";
import {
  Box,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import CallIcon from "@mui/icons-material/Call";
import CloseIcon from "@mui/icons-material/Close";

const CallPopover = ({ anchorEl, open, onClose, mobile1, mobile2 }) => {
  const [calling, setCalling] = React.useState(null);

  const handleCall = (number) => {
    if (!number) return;
    setCalling(number);
    window.location.href = `tel:${number}`;
    setTimeout(() => setCalling(null), 1800);
  };

  const Item = ({ label, number }) => {
    const active = calling === number;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.2,
          p: 1.2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: active ? "success.main" : "rgba(37,99,235,.14)",
          bgcolor: active ? "rgba(22,163,74,.08)" : "rgba(255,255,255,.95)",
          boxShadow: active ? "0 8px 24px rgba(22,163,74,.12)" : "0 6px 18px rgba(15,23,42,.06)",
        }}
      >
        <Stack spacing={0.2} sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 0.7,
              color: "text.secondary",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: "0.82rem",
              color: "text.primary",
            }}
          >
            {number || "-"}
          </Typography>
        </Stack>

        <IconButton
          onClick={() => handleCall(number)}
          size="small"
          disabled={!number}
          sx={{
            bgcolor: active ? "success.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: active ? "success.dark" : "primary.dark",
            },
          }}
        >
          {active ? <CallIcon fontSize="small" /> : <PhoneIcon fontSize="small" />}
        </IconButton>
      </Box>
    );
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          mt: 1,
          p: 1.2,
          width: 260,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(37,99,235,.14)",
          boxShadow: "0 18px 50px rgba(15,23,42,.18)",
          background: "linear-gradient(180deg, #ffffff, #f8fbff)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          px: 0.2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 900, color: "primary.main" }}
        >
          Call Numbers
        </Typography>

        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Stack spacing={1}>
        <Item label="Mobile 1" number={mobile1} />
        <Item label="Mobile 2" number={mobile2} />
      </Stack>
    </Popover>
  );
};

export default CallPopover;