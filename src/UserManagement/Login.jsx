
import React, { useState } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    InputAdornment,
    Stack,
    Chip,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import logo from "../assets/loginimages/companylogo.png";
import { axioslogin } from "../Connection/axios";
import { useNavigate } from "react-router-dom";
import { warningNotify } from "../constant/Constant";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();
    const encryptData = (data) => {
        try {
            return btoa(JSON.stringify(data));
        } catch (error) {
            console.error("Encryption error:", error);
            return null;
        }
    };

    const storeUserData = (user) => {
        try {
            const encryptedUser = encryptData(user);
            if (encryptedUser) {
                localStorage.setItem("user", encryptedUser);
            }
        } catch (error) {
            console.error("Storage error:", error);
        }
    };

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                warningNotify("Please enter username and password");
                return;
            }
            const response = await axioslogin.post("/user/login", {
                username,
                password,
            });
            const { success, message, user, attendance_id } = response?.data ?? {}
            if (success !== 1) return warningNotify(message);
            if (attendance_id) {
                localStorage.setItem("attendance_id", attendance_id);
            }
            storeUserData(user);
            login(user);
            navigate("/home", { replace: true });
        } catch (error) {
            warningNotify(error.response?.data?.message || "Login Failed");
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                overflow: "hidden",
                position: "relative",
                background: "linear-gradient(#eef7ff, #fff5ec)",
            }}
        >
            {/* Left Side - CRM & Nexus Info (visible on ALL screens) */}
            <Box
                sx={{
                    // display: "flex",
                    display: { xs: "none", md: "flex" },
                    flex: { xs: 1, md: 1 },
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
                    py: { xs: 2, sm: 3, md: 3, lg: 4, xl: 5 },
                    background: { xs: "transparent", md: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(255,143,31,0.08) 100%)" },
                    borderRight: { xs: "none", md: "1px solid rgba(255,255,255,0.5)" },
                }}
            >
                <Box sx={{ maxWidth: 520 }}>
                    {/* Nexus Brand Header */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: 52,
                                minHeight: 52,
                                borderRadius: 14,
                                background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                                boxShadow: "0 8px 24px rgba(234, 88, 12, 0.35)",
                                animation: "float 3s ease-in-out infinite",
                                '@keyframes float': {
                                    '0%, 100%': {
                                        transform: 'translateY(0px)',
                                    },
                                    '50%': {
                                        transform: 'translateY(-8px)',
                                    },
                                },
                            }}
                        >
                            <SupportAgentIcon
                                sx={{
                                    fontSize: 28,
                                    color: "#ffffff",
                                    animation: "iconPulse 3s ease-in-out infinite",
                                    '@keyframes iconPulse': {
                                        '0%, 100%': {
                                            transform: 'scale(1)',
                                        },
                                        '50%': {
                                            transform: 'scale(1.1)',
                                        },
                                    },
                                }}
                            />
                        </Box>
                        <Typography
                            level="h3"
                            sx={{
                                color: "#ea580c",
                                fontWeight: 800,
                                fontSize: "36px",
                                letterSpacing: "1.5px",
                                textTransform: "uppercase",
                                background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Nexus
                        </Typography>
                        <Chip
                            label="PRO"
                            sx={{
                                bgcolor: "rgba(234, 88, 12, 0.1)",
                                color: "#ea580c",
                                fontWeight: 700,
                                fontSize: "11px",
                                height: 24,
                                border: "1px solid rgba(234, 88, 12, 0.2)",
                            }}
                        />
                    </Box>

                    {/* Main Title */}
                    <Typography
                        level="h2"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: "24px", sm: "28px", md: "32px", lg: "38px", xl: "42px" },
                            color: "#1f2937",
                            mb: 2,
                            lineHeight: 1.2,
                        }}
                    >
                        Advanced <span style={{ color: "#2563eb" }}>CRM</span>
                        <br />
                        Platform for Your Business
                    </Typography>

                    {/* Description */}
                    <Typography
                        sx={{
                            fontSize: { xs: "14px", sm: "15px", md: "16px" },
                            color: "#6b7280",
                            lineHeight: 1.7,
                            mb: 3,
                            maxWidth: "90%",
                        }}
                    >
                        Transform your business with Nexus CRM - the all-in-one solution
                        for managing customers, sales, and workflows with intelligence and speed.
                    </Typography>

                    {/* Feature Cards - hidden on xs */}
                    <Stack spacing={2} sx={{ mb: 3, display: { xs: "none", sm: "flex" } }}>
                        {/* Feature 1 */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: 12,
                                background: "rgba(255, 255, 255, 0.7)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 38,
                                    minHeight: 38,
                                    borderRadius: 8,
                                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                }}
                            >
                                <GroupOutlinedIcon sx={{ fontSize: 18, color: "#ffffff" }} />
                            </Box>
                            <Typography sx={{ fontWeight: 600, color: "#1f2937", fontSize: "13px" }}>
                                Customer Management
                            </Typography>
                        </Box>

                        {/* Feature 2 */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: 12,
                                background: "rgba(255, 255, 255, 0.7)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 38,
                                    minHeight: 38,
                                    borderRadius: 8,
                                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                                }}
                            >
                                <TrendingUpIcon sx={{ fontSize: 18, color: "#ffffff" }} />
                            </Box>
                            <Typography sx={{ fontWeight: 600, color: "#1f2937", fontSize: "13px" }}>
                                Sales Analytics & Insights
                            </Typography>
                        </Box>

                        {/* Feature 3 */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: 12,
                                background: "rgba(255, 255, 255, 0.7)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minWidth: 38,
                                    minHeight: 38,
                                    borderRadius: 8,
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                }}
                            >
                                <PhoneAndroidIcon sx={{ fontSize: 18, color: "#ffffff" }} />
                            </Box>
                            <Typography sx={{ fontWeight: 600, color: "#1f2937", fontSize: "13px" }}>
                                Automated Workflows
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Stats Badge - hidden on xs */}
                    <Box
                        sx={{
                            display: { xs: "none", sm: "flex" },
                            gap: 2,
                            pt: 2,
                            borderTop: "1px solid rgba(231, 229, 228, 0.4)",
                        }}
                    >

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: "20px",
                                    color: "#f97316",
                                }}
                            >
                                99.9%
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    color: "#6b7280",
                                    fontWeight: 600,
                                }}
                            >
                                Uptime
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: "20px",
                                    color: "#2563eb",
                                }}
                            >
                                24/7
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    color: "#6b7280",
                                    fontWeight: 600,
                                }}
                            >
                                Support
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: "20px",
                                    color: "#ea580c",
                                }}
                            >
                                85%
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "11px",
                                    color: "#6b7280",
                                    fontWeight: 600,
                                }}
                            >
                                Lead Conversion
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Right Side - Login Form (visible on ALL screens) */}
            <Box
                sx={{
                    display: "flex",
                    flex: { xs: 1, md: 1 },
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 2, sm: 2, md: 3, lg: 5, xl: 6 },
                    py: { xs: 3, sm: 4, md: 3, lg: 4, xl: 5 },
                    bgcolor: { xs: "rgba(255,255,255,0.5)", md: "transparent" },
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 420,
                        p: { xs: 2.2, sm: 3, md: 4.5 },
                        borderRadius: { xs: 4, md: 5 },
                        bgcolor: "rgba(255,255,255,0.95)",
                        boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.75)",
                    }}
                >
                    <Typography
                        fontWeight={800}
                        color="#2c2d2e"
                        sx={{
                            mb: 1,
                            fontSize: {
                                xs: "1.2rem",
                                sm: "1.2rem",
                                md: "1.2rem",
                            },
                        }}
                    >
                        Welc<span style={{ color: "#ffb121" }}>o</span>me Back
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: { xs: 2.2, sm: 3, md: 4 },
                            lineHeight: 1.6,
                            fontSize: {
                                xs: "0.68rem",
                                sm: "0.78rem",
                                md: "0.78rem",
                            },
                        }}
                    >
                        Sign in to continue to your account.
                    </Typography>

                    <TextField
                        fullWidth
                        label="Username"
                        margin="normal"
                        variant="outlined"
                        size="small"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon
                                        sx={{ color: "#3b82f6", fontSize: 20 }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                backgroundColor: "#fff",
                                height: { xs: 48, md: 46 },
                            },
                            "& .MuiInputBase-input": {
                                fontSize: { xs: "0.9rem", md: "1rem" },
                                py: { xs: 1.2, md: 1.5 },
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: { xs: "0.9rem", md: "1rem" },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        margin="normal"
                        variant="outlined"
                        size="small"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon
                                        sx={{ color: "#ff8f1f", fontSize: 20 }}
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Box
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            color: "#64748b",
                                        }}
                                    >
                                        {showPassword ? (
                                            <VisibilityOutlinedIcon
                                                sx={{ fontSize: 20 }}
                                            />
                                        ) : (
                                            <VisibilityOffOutlinedIcon
                                                sx={{ fontSize: 20 }}
                                            />
                                        )}
                                    </Box>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                backgroundColor: "#fff",
                                height: { xs: 46, md: 46 },
                            },
                            "& .MuiInputBase-input": {
                                fontSize: { xs: "0.9rem", md: "1rem" },
                                py: { xs: 1.2, md: 1.5 },
                            },
                            "& .MuiInputLabel-root": {
                                fontSize: { xs: "0.9rem", md: "1rem" },
                            },
                        }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 1,
                        }}
                    >
                        <Typography
                            sx={{
                                cursor: "pointer",
                                color: "#2563eb",
                                fontWeight: 600,
                                fontSize: { xs: "0.62rem", md: "0.65rem" },
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Forgot Password?
                        </Typography>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleLogin}
                        sx={{
                            mt: { xs: 3, md: 4 },
                            py: { xs: 1.2, md: 1.2 },
                            borderRadius: 3,
                            textTransform: "none",
                            fontSize: { xs: "0.92rem", md: "1rem" },
                            fontWeight: 800,
                            minHeight: { xs: 40, md: 40 },
                            color: '#ffff',
                            background:
                                "linear-gradient(90deg, #2563eb 0%, #ff8f1f 100%)",
                            boxShadow: "0 14px 28px rgba(37,99,235,0.20)",
                            "&:hover": {
                                background:
                                    "linear-gradient(90deg, #1d4ed8 0%, #f97316 100%)",
                            },
                        }}>
                        Sign In
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;