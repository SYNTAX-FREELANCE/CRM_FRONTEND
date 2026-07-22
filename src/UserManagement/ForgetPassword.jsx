import React, { useRef, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    CircularProgress,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { axioslogin } from "../Connection/axios";
import { successNotify, warningNotify } from "../constant/Constant";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import illustariton2 from '../assets/loginimages/forget2.png'
import { useNavigate } from "react-router-dom";
import GlobalLoader from "../CommonComponents/GlobalLoader";

const ForgetPassword = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const otpRefs = useRef([]);
    const [data, setData] = useState({
        employee_id: "",
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]:
                name === "otp"
                    ? value.replace(/\D/g, "").slice(0, 6)
                    : value,
        }));
    };

    const navigate = useNavigate()
    // const otpArray = Array.from({ length: 6 }, (_, i) => data.otp[i] || "");

    const handleSendOtp = async () => {
        if (!data.employee_id.trim() || !data.email.trim()) {
            warningNotify("Employee ID and Email are required");
            return;
        }

        setLoading(true);
        try {
            const res = await axioslogin.post("/user/forgot-password", {
                employee_id: data.employee_id,
                email: data.email,
            });

            if (res?.data?.success === 1) {
                successNotify(res?.data?.message || "OTP sent successfully");
                setStep(2);
            } else {
                warningNotify(res?.data?.message || "Failed to send OTP");
            }
        } catch (error) {
            warningNotify(error?.response?.data?.message || "Error sending OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (data.otp.length !== 6) {
            warningNotify("Enter valid 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const res = await axioslogin.post("/user/verify-otp", {
                employee_id: data.employee_id,
                email: data.email,
                otp: data.otp,
            });

            if (res?.data?.success === 1) {
                successNotify(res?.data?.message || "OTP verified successfully");
                setStep(3);
            } else {
                warningNotify(res?.data?.message || "Invalid OTP");
            }
        } catch (error) {
            warningNotify(error?.response?.data?.message || "Error verifying OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!data.newPassword || data.newPassword.length < 4) {
            warningNotify("Password must be at least 6 characters");
            return;
        }
        if (data.newPassword !== data.confirmPassword) {
            warningNotify("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await axioslogin.post("/user/reset-password", {
                employee_id: data.employee_id,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });

            if (res?.data?.success === 1) {
                successNotify(res?.data?.message || "Password updated successfully");
                navigate('/login')
                setData({
                    employee_id: "",
                    email: "",
                    otp: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                warningNotify(res?.data?.message || "Failed to update password");
            }
        } catch (error) {
            warningNotify(error?.response?.data?.message || "Error updating password");
        } finally {
            setLoading(false);
        }
    };



    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const otpArr = data.otp.split("");
        otpArr[index] = value.slice(-1);

        const newOtp = otpArr.join("").slice(0, 6);
        setData((prev) => ({ ...prev, otp: newOtp }));

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !data.otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        setData((prev) => ({ ...prev, otp: pasted }));
        const focusIndex = Math.min(pasted.length, 5);
        otpRefs.current[focusIndex]?.focus();
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#fff",
                px: { xs: 2, sm: 4 },
                py: { xs: 3, sm: 4 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    alignItems: "center",
                }}
            >
                {
                    loading && <GlobalLoader text={"Sending Otp...!"} />
                }
                {/* LEFT / TOP SECTION */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Box
                        component="img"
                        src={illustariton2}
                        alt="Forgot password"
                        sx={{
                            width: '100%',
                            maxWidth: 420,
                            height: "auto",
                            mb: 1,
                        }}
                    />

                    {step === 1 && (
                        <>
                            <Typography
                                sx={{
                                    fontSize: 34,
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    color: "#000000",
                                }}
                            >
                                Forg<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>t Passw<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>rd?
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 15,
                                    color: "#0c0c0c",
                                    textAlign: 'center',
                                    maxWidth: 400,
                                    lineHeight: 1.6,
                                    fontWeight: 600
                                }}
                            >
                                ``  Please enter y<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>ur Empl<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>yee ID and email address.
                                We will send the <span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>TP to verify y<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>ur identity.``
                            </Typography>

                            <Box sx={{ width: "100%", maxWidth: 360, mt: 1 }}>
                                <TextField
                                    fullWidth
                                    name="employee_id"
                                    value={data.employee_id}
                                    onChange={handleChange}
                                    placeholder="Enter Employee ID"
                                    size="small"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            bgcolor: "#fff",
                                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                            "& fieldset": {
                                                borderColor: "#e5e7eb",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#cbd5e1",
                                            },
                                            "&.Mui-focused fieldset": {
                                                border: '1px solid #fb7f14',
                                            },
                                            fontWeight: 600
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon sx={{ color: "#0a0a0a" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box sx={{ width: "100%", maxWidth: 360 }}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder="Enter Email Address"
                                    size="small"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            bgcolor: "#fff",
                                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                            "& fieldset": {
                                                borderColor: "#e5e7eb",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#cbd5e1",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#fb7f14",
                                                border: '1px solid #fb7f14',
                                            },
                                            fontWeight: 600
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: "#000000" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Button
                                fullWidth
                                onClick={handleSendOtp}
                                disabled={loading}
                                sx={{
                                    width: "100%",
                                    maxWidth: 360,
                                    mt: 1,
                                    py: 1.5,
                                    borderRadius: 2,
                                    bgcolor: "#ff570a",
                                    color: "#fff",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: 16,
                                    boxShadow: "0 10px 20px rgba(109,40,217,0.25)",
                                    "&:hover": {
                                        bgcolor: "#ff570a",
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="#fff" /> : "Continue"}
                            </Button>
                            <Typography
                                onClick={() => navigate("/login")}
                                sx={{
                                    fontSize: 15,
                                    color: "#010101",
                                    maxWidth: 400,
                                    lineHeight: 1.6,
                                    fontWeight: 600,
                                    textDecoration: "underline",
                                    cursor: "pointer"

                                }}
                            >
                                G<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a',
                                    marginRight: '2px'
                                }}>o</span>
                                Back.
                            </Typography>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <Typography
                                sx={{
                                    fontSize: 34,
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    color: "#020202",
                                }}
                            >
                                <span style={{
                                    fontSize: '40px',
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>TP
                                Verificati<span style={{
                                    fontSize: 34,
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>n
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 15,
                                    color: "#010101",
                                    maxWidth: 400,
                                    lineHeight: 1.6,
                                    fontWeight: 600
                                }}
                            >
                                Enter the
                                <span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>TP sent to y
                                <span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>ur registered email address.
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1.2}
                                sx={{
                                    mt: 2,
                                    mb: 1,
                                    justifyContent: { xs: "center", md: "flex-start" },
                                }}
                            >
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <Box
                                        key={index}
                                        component="input"
                                        ref={(el) => (otpRefs.current[index] = el)}
                                        value={data.otp[index] || ""}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        onPaste={handleOtpPaste}
                                        inputMode="numeric"
                                        maxLength={1}
                                        sx={{
                                            width: 48,
                                            height: 54,
                                            borderRadius: 2,
                                            border: "1px solid #e5e7eb",
                                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            fontSize: 20,
                                            fontWeight: 700,
                                            color: "#111827",
                                            bgcolor: "#fff",
                                            outline: "none",
                                            "&:focus": {
                                                borderColor: "#ff570a",
                                                boxShadow: "0 0 0 2px rgba(255, 182, 98, 0.85)",
                                            },
                                        }}
                                    />
                                ))}
                            </Stack>

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "#6b7280",
                                    mt: 0.5,
                                }}
                            >
                                Didn’t receive code?{" "}
                                <Box
                                    component="span"
                                    sx={{
                                        color: "#ff570a",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                    onClick={handleSendOtp}
                                >
                                    Re-send
                                </Box>
                            </Typography>

                            <Button
                                fullWidth
                                onClick={handleVerifyOtp}
                                disabled={loading || data.otp.length !== 6}
                                sx={{
                                    width: "100%",
                                    maxWidth: 360,
                                    mt: 1,
                                    py: 1.5,
                                    borderRadius: 2,
                                    bgcolor: "#ff570a",
                                    color: "#fff",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: 16,
                                    boxShadow: "0 10px 20px rgba(109,40,217,0.25)",
                                    "&:hover": {
                                        bgcolor: "#ff570a",
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                            </Button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <Typography
                                sx={{
                                    fontSize: { xs: 28, sm: 34 },
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    color: "#111827",
                                }}
                            >
                                <span style={{
                                    fontSize: '30px',
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>R</span>eset
                                Passw<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>rd
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 15,
                                    color: "#020202",
                                    maxWidth: 360,
                                    lineHeight: 1.6,
                                    fontWeight: 600
                                }}
                            >
                                <span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>C</span>reate a new passw<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>rd f<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>r your acc<span style={{
                                    fontWeight: 800,
                                    color: '#ff570a'
                                }}>o</span>unt.
                            </Typography>

                            <Box sx={{ width: "100%", maxWidth: 360 }}>
                                <TextField
                                    fullWidth
                                    name="newPassword"
                                    value={data.newPassword}
                                    onChange={handleChange}
                                    placeholder="New Password"
                                    type={showPassword ? "text" : "password"}
                                    size="small"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            bgcolor: "#fff",
                                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                            "& fieldset": {
                                                borderColor: "#e5e7eb",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#cbd5e1",
                                            },
                                            "&.Mui-focused fieldset": {
                                                border: '1px solid #fb7f14',
                                            },
                                            fontWeight: 600
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: "#070706" }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box sx={{ width: "100%", maxWidth: 360 }}>
                                <TextField
                                    fullWidth
                                    name="confirmPassword"
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    size="small"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            bgcolor: "#fff",
                                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                            "& fieldset": {
                                                borderColor: "#e5e7eb",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#cbd5e1",
                                            },
                                            "&.Mui-focused fieldset": {
                                                border: '1px solid #fb7f14',
                                            },
                                            fontWeight: 600
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: "#000000" }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword((p) => !p)}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Button
                                fullWidth
                                onClick={handleResetPassword}
                                disabled={loading}
                                sx={{
                                    width: "100%",
                                    maxWidth: 360,
                                    mt: 1,
                                    py: 1.5,
                                    borderRadius: 2,
                                    bgcolor: "#ff570a",
                                    color: "#fff",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: 16,
                                    boxShadow: "0 10px 20px rgba(248, 171, 64, 0.25)",
                                    "&:hover": {
                                        bgcolor: "#ff570a",
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ForgetPassword;