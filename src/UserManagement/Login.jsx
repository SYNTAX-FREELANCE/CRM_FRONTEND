
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
    IconButton,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

import { axioslogin } from "../Connection/axios";
import { useNavigate } from "react-router-dom";
import { warningNotify } from "../constant/Constant";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "@mui/material";
import { useThemeMode } from "../Context/ThemeContext";
import ThemeToggle from "../CommonComponents/ThemeToggle";

const Login = () => {

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { mode, toggleTheme } = useThemeMode();

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
            if (!username?.trim() || !password?.trim()) {
                warningNotify("Please enter username and password");
                return;
            }

            const response = await axioslogin.post("/user/login", {
                username: username.trim(),
                password: password.trim(),
            });

            const {
                success,
                message,
                user,
                attendance_id
            } = response?.data ?? {};

            if (success !== 1) {
                return warningNotify(message);
            }

            if (attendance_id) {
                localStorage.setItem("attendance_id", attendance_id);
            }

            storeUserData(user);
            login(user);

            navigate("/home", { replace: true });

        } catch (error) {
            warningNotify(
                error.response?.data?.message || "Login Failed"
            );
        }
    };

    const features = [
        {
            icon: <GroupOutlinedIcon />,
            title: "Customer Management",
            color: "#078a48",
        },
        {
            icon: <TrendingUpIcon />,
            title: "Sales Analytics & Insights",
            color: "#f59e0b",
        },
        {
            icon: <PhoneAndroidIcon />,
            title: "Automated Workflows",
            color: "#08617c",
        },
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                overflow: "hidden",
                position: "relative",
                bgcolor: isDark ? "#0f172a" : "#e7f2eb",
                fontFamily: "'Poppins', sans-serif",
            }}
        >

            {/* Theme Toggle */}

            <Box
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    "& button": {
                        width: 34,
                        height: 34,
                    },
                }}
            >
                <ThemeToggle
                    mode={mode}
                    onToggle={toggleTheme}
                    size={30}
                />
            </Box>

            {/* LEFT PANEL */}

            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    width: "50%",
                    minHeight: "100vh",
                    alignItems: "center",
                    justifyContent: "center",
                    px: { md: 5, lg: 8 },
                    py: 5,
                    background: isDark
                        ? "linear-gradient(145deg, #123d4b 0%, #075b72 55%, #334e40 100%)"
                        : "linear-gradient(145deg, #205c6b 0%, #086781 55%, #71854c 100%)",
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 440 }}>

                    {/* BRAND */}

                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ mb: 3 }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                bgcolor: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 28,
                                    fontWeight: 900,
                                    color: "#f47721",
                                    lineHeight: 1,
                                }}
                            >
                                T
                            </Typography>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: { md: 25, lg: 29 },
                                fontWeight: 800,
                                color: "#ffffff",
                                letterSpacing: 1,
                                whiteSpace: "nowrap",
                            }}
                        >
                            POLICY POS
                        </Typography>

                        <Chip
                            label="PRO"
                            size="small"
                            sx={{
                                height: 23,
                                color: "#ffffff",
                                fontSize: 10,
                                fontWeight: 800,
                                borderRadius: 5,
                                bgcolor: "rgba(255,255,255,0.15)",
                                border: "1px solid rgba(255,255,255,0.4)",
                            }}
                        />
                    </Stack>

                    {/* HEADING */}

                    <Typography
                        sx={{
                            fontSize: {
                                md: 30,
                                lg: 38,
                                xl: 42,
                            },
                            fontWeight: 800,
                            color: "#ffffff",
                            lineHeight: 1.12,
                            mb: 2,
                            letterSpacing: -0.7,
                        }}
                    >
                        Advanced{" "}
                        <Box
                            component="span"
                            sx={{ color: "#ffbd45" }}
                        >
                            CRM
                        </Box>

                        <br />

                        Platform for Your Business
                    </Typography>

                    {/* DESCRIPTION */}

                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "rgba(255,255,255,0.88)",
                            lineHeight: 1.8,
                            maxWidth: 410,
                            mb: 2.8,
                        }}
                    >
                        Transform your business with POLICY POS - the
                        all-in-one solution for managing customers,
                        sales, and workflows with intelligence and speed.
                    </Typography>

                    {/* FEATURES */}

                    <Stack spacing={1.4} sx={{ mb: 3.5 }}>

                        {features.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    bgcolor: "rgba(255,255,255,0.94)",
                                    borderRadius: 5,
                                    px: 1.5,
                                    py: 1.1,
                                    minHeight: 53,
                                    transition: "0.25s",
                                    "&:hover": {
                                        transform: "translateX(5px)",
                                        bgcolor: "#ffffff",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 34,
                                        height: 34,
                                        flexShrink: 0,
                                        borderRadius: "50%",
                                        bgcolor: item.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                    }}
                                >
                                    {React.cloneElement(item.icon, {
                                        sx: { fontSize: 18 },
                                    })}
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        fontWeight: 750,
                                        color: "#17212b",
                                    }}
                                >
                                    {item.title}
                                </Typography>
                            </Box>
                        ))}

                    </Stack>

                    {/* STATISTICS */}

                    <Box
                        sx={{
                            borderTop: "1px solid rgba(255,255,255,0.25)",
                            pt: 2,
                            display: "flex",
                            gap: 2.5,
                        }}
                    >

                        {[
                            { value: "99.9%", label: "Uptime" },
                            { value: "24/7", label: "Support" },
                            { value: "85%", label: "Lead Conversion" },
                        ].map((item, index) => (
                            <Box key={index}>
                                <Typography
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 850,
                                        color: "#ffb21f",
                                    }}
                                >
                                    {item.value}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 11,
                                        color: "rgba(255,255,255,0.85)",
                                        mt: 0.3,
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </Box>
                        ))}

                    </Box>

                </Box>
            </Box>

            {/* RIGHT PANEL */}

            <Box
                sx={{
                    flex: 1,
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 2, sm: 3, md: 4 },
                    py: 4,
                    bgcolor: isDark ? "#111e2c" : "#e7f2eb",
                }}
            >

                {/* LOGIN CARD */}

                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 355,
                        p: {
                            xs: 3,
                            sm: 4,
                            md: 4,
                        },
                        pt: 4.2,
                        pb: 5,
                        borderRadius: 4,
                        bgcolor: isDark ? "#1e293b" : "#ffffff",
                        borderTop: "2px solid #07833f",
                        boxShadow: isDark
                            ? "0 15px 40px rgba(0,0,0,0.3)"
                            : "0 18px 45px rgba(28,78,58,0.10)",
                    }}
                >

                    {/* TITLE */}

                    <Typography
                        sx={{
                            fontSize: 16,
                            fontWeight: 850,
                            color: isDark ? "#f8fafc" : "#18212c",
                            mb: 0.5,
                        }}
                    >
                        Welc
                        <Box
                            component="span"
                            sx={{ color: "#ffb21f" }}
                        >
                            o
                        </Box>
                        me Back
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 11,
                            color: isDark ? "#94a3b8" : "#718096",
                            mb: 3,
                        }}
                    >
                        Sign in to continue to your account.
                    </Typography>

                    {/* LOGIN FORM */}

                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                    >

                        {/* USERNAME */}

                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            size="small"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            sx={{
                                mb: 1.5,

                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                    height: 41,
                                    fontSize: 13,
                                    bgcolor: isDark ? "#0f172a" : "#ffffff",
                                },

                                "& .MuiInputLabel-root": {
                                    fontSize: 12,
                                },

                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: isDark ? "#475569" : "#d5dde7",
                                },

                                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#07833f",
                                },

                                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#07833f",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineIcon
                                            sx={{
                                                color: "#1976d2",
                                                fontSize: 19,
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* PASSWORD */}

                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            size="small"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            sx={{
                                mb: 0.5,

                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2.5,
                                    height: 41,
                                    fontSize: 13,
                                    bgcolor: isDark ? "#0f172a" : "#ffffff",
                                },

                                "& .MuiInputLabel-root": {
                                    fontSize: 12,
                                },

                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: isDark ? "#475569" : "#d5dde7",
                                },

                                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#07833f",
                                },

                                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#07833f",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon
                                            sx={{
                                                color: "#ffb21f",
                                                fontSize: 18,
                                            }}
                                        />
                                    </InputAdornment>
                                ),

                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOutlinedIcon
                                                    sx={{
                                                        fontSize: 17,
                                                        color: "#64748b",
                                                    }}
                                                />
                                            ) : (
                                                <VisibilityOffOutlinedIcon
                                                    sx={{
                                                        fontSize: 17,
                                                        color: "#64748b",
                                                    }}
                                                />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* FORGOT PASSWORD */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 1,
                            }}
                        >
                            <Typography
                                onClick={() => navigate("/forget-password")}
                                sx={{
                                    cursor: "pointer",
                                    fontSize: 10,
                                    fontWeight: 750,
                                    color: "#07833f",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                Forgot Password?
                            </Typography>
                        </Box>

                        {/* SIGN IN BUTTON */}

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disableElevation
                            sx={{
                                mt: 3.5,
                                height: 42,
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontSize: 12,
                                fontWeight: 800,
                                color: "#ffffff",

                                background:
                                    "linear-gradient(100deg, #138047 0%, #08728a 100%)",

                                boxShadow: "0 9px 18px rgba(8,114,100,0.22)",

                                "&:hover": {
                                    background:
                                        "linear-gradient(100deg, #096b38 0%, #075c72 100%)",
                                    boxShadow: "0 11px 22px rgba(8,114,100,0.3)",
                                },
                            }}
                        >
                            Sign In
                        </Button>

                    </Box>

                </Paper>

            </Box>

        </Box>
    );
};

export default Login;
