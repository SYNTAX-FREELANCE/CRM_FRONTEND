import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Button,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  ModalClose,
} from "@mui/joy";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { axioslogin } from "../Connection/axios";
import { successNotify, warningNotify, errorNotify } from "../constant/Constant";
import { useAuth } from "../Context/AuthContext";

const ChangePasswordModal = ({ open, onClose }) => {
  const { logout } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      warningNotify("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      warningNotify("Passwords do not match.");
      return;
    }

    if (password.length < 4) {
      warningNotify("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await axioslogin.post("/user/change-password", {
        password,
        confirmPassword,
      });

      if (response.data.success) {
        successNotify("Password changed successfully!");
        setPassword("");
        setConfirmPassword("");
        onClose();
        logout();
      } else {
        errorNotify(response.data.message || "Failed to change password.");
      }
    } catch (err) {
      console.error("Change password error:", err);
      const errMsg = err.response?.data?.message || "An error occurred. Please try again.";
      errorNotify(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: 320, sm: 380 },
          maxWidth: "95vw",
          bgcolor: "#ffffff",
          borderRadius: { xs: 16, sm: 24 },
          p: { xs: 2.5, sm: 4 },
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Decorative Top Line */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #f97316 0%, #ea580c 100%)",
          }}
        />

        <ModalClose onClick={handleClose} sx={{ top: 16, right: 16 }} />

        {/* Header Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "rgba(249, 115, 22, 0.1)",
            border: "1.5px solid rgba(249, 115, 22, 0.3)",
            mb: 2.5,
            mx: "auto",
          }}
        >
          <LockIcon sx={{ fontSize: 28, color: "#ea580c" }} />
        </Box>

        {/* Title & Subtitle */}
        <Typography
          fontWeight={700}
          fontSize="22px"
          textAlign="center"
          sx={{ color: "#111827", mb: 1 }}
        >
          Change Password
        </Typography>
        <Typography
          level="body-sm"
          textAlign="center"
          sx={{ color: "#6b7280", mb: 3 }}
        >
          Enter your new password below.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <FormControl required>
              <FormLabel sx={{ fontWeight: 600, color: "#374151" }}>New Password</FormLabel>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endDecorator={
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ color: "#9ca3af" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
                sx={{
                  borderRadius: 12,
                  "--Input-focusedThickness": "2px",
                  "--Input-focusedHighlight": "#ea580c",
                  "&:hover": {
                    borderColor: "#d1d5db",
                  },
                }}
              />
            </FormControl>

            <FormControl required>
              <FormLabel sx={{ fontWeight: 600, color: "#374151" }}>Re-enter Password</FormLabel>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endDecorator={
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    sx={{ color: "#9ca3af" }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                }
                sx={{
                  borderRadius: 12,
                  "--Input-focusedThickness": "2px",
                  "--Input-focusedHighlight": "#ea580c",
                  "&:hover": {
                    borderColor: "#d1d5db",
                  },
                }}
              />
            </FormControl>

            <Box sx={{ display: "flex", gap: 2, mt: 1.5 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  flex: 1,
                  py: 1.4,
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: "14px",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                  bgcolor: "rgba(148, 163, 184, 0.1)",
                  color: "#94a3b8",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "rgba(148, 163, 184, 0.2)",
                    border: "1px solid rgba(148, 163, 184, 0.5)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                variant="solid"
                sx={{
                  flex: 1,
                  py: 1.4,
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "14px",
                  bgcolor: "#f4a32a",
                  boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                  color: "#ffffff",
                  "&:hover:not(:disabled)": {
                    bgcolor: "#2563eb",
                    boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
