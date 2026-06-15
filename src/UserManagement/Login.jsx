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
import { axiosLogin } from "../Axios/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axiosLogin.post("/user/login", {
                username,
                password,
            });

            localStorage.setItem("token", response.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.data || response.data.user),
            );

            navigate("/home");
        } catch (error) {
            alert(error.response?.data?.message || "Login Failed");
        }
    };
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                overflow: "hidden",
                position: "relative",
                background: {
                    xs: "linear-gradient(180deg, #eef7ff 0%, #fff5ec 100%)",
                    md: "linear-gradient(90deg, #eef7ff 0%, #eef7ff 50%, #fff5ec 50%, #fff5ec 100%)",
                },
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: { xs: 12, sm: 16, md: 18 },
                    left: { xs: 12, sm: 16, md: 18 },
                    zIndex: 2,
                    width: { xs: 40, sm: 46, md: 48 },
                    height: { xs: 40, sm: 46, md: 48 },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 0.5,
                }}
            >
                <Box
                    component="img"
                    src={logo}
                    alt="logo"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    px: 6,
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 560,
                        p: 4.5,
                        borderRadius: 6,
                        background:
                            "linear-gradient(145deg, rgba(255,255,255,0.78), rgba(255,255,255,0.45))",
                        boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
                        border: "1px solid rgba(255,255,255,0.75)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <Chip
                        icon={<PhoneAndroidIcon />}
                        label="CRM Software"
                        sx={{
                            mb: 3,
                            bgcolor: "#e8f2ff",
                            color: "#1d4ed8",
                            fontWeight: 700,
                            px: 0.5,
                        }}
                    />

                    <Typography
                        fontWeight={800}
                        sx={{
                            color: "#15345c",
                            mb: 1,
                            fontSize: "3rem",
                            lineHeight: 1.1,
                        }}
                    >
                        Manage Sales,
                        <br />
                        Leads & Support
                    </Typography>

                    <Typography
                        sx={{
                            color: "#607387",
                            maxWidth: 480,
                            lineHeight: 1.7,
                            fontSize: "1.05rem",
                            mb: 4,
                        }}
                    >
                        A simple CRM platform to track customers, follow up
                        faster, and keep your team connected from anywhere.
                    </Typography>

                    <Stack spacing={2}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 2,
                                borderRadius: 3,
                                bgcolor: "rgba(255,255,255,0.7)",
                                border: "1px solid rgba(37,99,235,0.08)",
                            }}
                        >
                            <CheckCircleOutlineIcon sx={{ color: "#2563eb" }} />
                            <Typography
                                sx={{ color: "#334155", fontWeight: 600 }}
                            >
                                Customer records in one place
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 2,
                                borderRadius: 3,
                                bgcolor: "rgba(255,255,255,0.7)",
                                border: "1px solid rgba(255,143,31,0.10)",
                            }}
                        >
                            <SupportAgentIcon sx={{ color: "#ff8f1f" }} />
                            <Typography
                                sx={{ color: "#334155", fontWeight: 600 }}
                            >
                                Faster follow-up and support tracking
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 2,
                                borderRadius: 3,
                                bgcolor: "rgba(255,255,255,0.7)",
                                border: "1px solid rgba(59,130,246,0.10)",
                            }}
                        >
                            <TrendingUpIcon sx={{ color: "#2563eb" }} />
                            <Typography
                                sx={{ color: "#334155", fontWeight: 600 }}
                            >
                                Grow your business with clear insights
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 2,
                                borderRadius: 3,
                                bgcolor: "rgba(255,255,255,0.7)",
                                border: "1px solid rgba(255,143,31,0.10)",
                            }}
                        >
                            <GroupOutlinedIcon sx={{ color: "#ff8f1f" }} />
                            <Typography
                                sx={{ color: "#334155", fontWeight: 600 }}
                            >
                                Team collaboration made easy
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: 9, sm: 8, md: 3 },
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: { xs: 420, md: 520 },
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
                                xs: "1.5rem",
                                sm: "1.8rem",
                                md: "2.2rem",
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
                                xs: "0.88rem",
                                sm: "0.95rem",
                                md: "1rem",
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
                                height: { xs: 48, md: 56 },
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
                                height: { xs: 48, md: 56 },
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
                                fontSize: { xs: "0.82rem", md: "0.95rem" },
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
                            py: { xs: 1.2, md: 1.7 },
                            borderRadius: 3,
                            textTransform: "none",
                            fontSize: { xs: "0.92rem", md: "1rem" },
                            fontWeight: 800,
                            minHeight: { xs: 46, md: 56 },
                            background:
                                "linear-gradient(90deg, #2563eb 0%, #ff8f1f 100%)",
                            boxShadow: "0 14px 28px rgba(37,99,235,0.20)",
                            "&:hover": {
                                background:
                                    "linear-gradient(90deg, #1d4ed8 0%, #f97316 100%)",
                            },
                        }}
                    >
                        Sign In
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
