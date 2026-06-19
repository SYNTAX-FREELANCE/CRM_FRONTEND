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
import { axioslogin } from "../Axios/axios";
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
        console.log("WORKING")
        try {
            if (!username || !password) {
                warningNotify("Please enter username and password");
                return;
            }
            const response = await axioslogin.post("/user/login", {
                username,
                password,
            });
            const { success, message, user } = response?.data ?? {}
            if (success !== 1) return warningNotify(message);
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
                background: "linear-gradient( #eef7ff , #fff5ec )"
                // background: {
                //     xs: "linear-gradient(180deg, #eef7ff 0%, #fff5ec 100%)",
                //     md: "linear-gradient(90deg, #eef7ff 0%, #eef7ff 50%, #fff5ec 50%, #fff5ec 100%)",
                // },
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
