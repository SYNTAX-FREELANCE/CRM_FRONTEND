import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const SessionTimeoutHandler = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const inactivityTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // Time thresholds: 2 minutes inactivity limit, 10 seconds warning countdown
  const INACTIVITY_LIMIT = 20 * 60 * 1000;
  const COUNTDOWN_LIMIT = 10;

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    // Only set the inactivity timeout if the warning modal is NOT already showing
    if (!showModal) {
      inactivityTimerRef.current = setTimeout(() => {
        setShowModal(true);
        setCountdown(COUNTDOWN_LIMIT);
      }, INACTIVITY_LIMIT);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      // If user logs out, clear all timers and close modal
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      setShowModal(false);
      return;
    }

    // List of user events to listen for to determine activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    const handleActivity = () => {
      resetInactivityTimer();
    };

    // Attach listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Start initial inactivity timer
    resetInactivityTimer();

    return () => {
      // Cleanup listeners
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [isAuthenticated, showModal]);

  // Countdown timer effect
  useEffect(() => {
    if (showModal && isAuthenticated) {
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            handleAutoLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [showModal, isAuthenticated]);

  const handleAutoLogout = () => {
    setShowModal(false);
    logout();
  };

  const handleStayLoggedIn = () => {
    setShowModal(false);
  };

  if (!isAuthenticated || !showModal) return null;

  // Calculate percentage of countdown remaining for circular indicator
  const progressValue = (countdown / COUNTDOWN_LIMIT) * 100;

  return (
    <Dialog
      open={showModal}
      onClose={handleStayLoggedIn}
      disableEscapeKeyDown
      backdropTransitionDuration={500}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          minWidth: 340,
          textAlign: "center",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.16)",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(234, 88, 12, 0.15)",
        }
      }}
    >
      <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 2 }}>
        <Box sx={{ position: "relative", display: "inline-flex", mb: 1 }}>
          <CircularProgress
            variant="determinate"
            value={progressValue}
            size={80}
            thickness={4}
            sx={{
              color: countdown <= 3 ? "#ef4444" : "#f59e0b",
              transition: "color 0.5s ease",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              component="div"
              fontWeight={800}
              sx={{ color: countdown <= 3 ? "#ef4444" : "#f59e0b" }}
            >
              {countdown}
            </Typography>
          </Box>
        </Box>

        <WarningAmberIcon
          sx={{
            fontSize: 42,
            color: "#f59e0b",
            animation: "pulseWarning 1.5s ease-in-out infinite",
            "@keyframes pulseWarning": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.15)" }
            }
          }}
        />

        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mt: 1 }}>
          Inactivity Warning
        </Typography>

        <Typography variant="body1" sx={{ color: "#64748b", lineHeight: 1.5 }}>
          You have been inactive for a while. You will be logged out automatically to protect your session.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2, pt: 1 }}>
        <Button
          onClick={handleStayLoggedIn}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
            boxShadow: "0 6px 20px rgba(234, 88, 12, 0.3)",
            color: "#ffffff",
            px: 5,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: "0.95rem",
            textTransform: "none",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: "linear-gradient(135deg, #d94e08 0%, #ea580c 100%)",
              transform: "translateY(-1px)",
              boxShadow: "0 8px 24px rgba(234, 88, 12, 0.4)",
            },
            "&:active": {
              transform: "translateY(1px)",
            }
          }}
        >
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeoutHandler;
