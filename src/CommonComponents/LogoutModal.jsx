import React from "react";
import { Box, Typography, Modal, Button } from "@mui/joy";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";

const LogoutModal = ({ open, onClose, onStartLogout }) => {
    const [logoutCountdown, setLogoutCountdown] = React.useState(null);

    React.useEffect(() => {
        if (logoutCountdown !== null && logoutCountdown > 0) {
            const timer = setTimeout(() => {
                setLogoutCountdown(logoutCountdown - 1);
            }, 600);
            return () => clearTimeout(timer);
        } else if (logoutCountdown === 0) {
            onClose();
            setLogoutCountdown(null);
            onStartLogout();
        }
    }, [logoutCountdown, onClose, onStartLogout]);

    const cancelLogout = () => {
        onClose();
        setLogoutCountdown(null);
    };

    return (
        <Modal
            open={open}
            onClose={cancelLogout}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    width: { xs: 300, sm: 340 },
                    maxWidth: "95vw",
                    bgcolor: "#ffffff",
                    borderRadius: { xs: 16, sm: 24 },
                    p: { xs: 2.5, sm: 4 },
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Glowing Border Effect */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 24,
                        border: "2px solid rgba(246, 159, 59, 0.3)",
                        boxShadow: "0 0 40px rgba(59, 130, 246, 0.15)",
                    }}
                />

                {/* Check Icon */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        bgcolor: "rgba(59, 130, 246, 0.15)",
                        border: "2px solid rgba(59, 130, 246, 0.4)",
                        mb: 3,
                        ml: "auto",
                        mr: "auto",
                    }}
                >
                    <LogoutIcon sx={{ fontSize: 36, color: "#3b82f6" }} />
                </Box>

                {/* Title */}
                <Typography
                    fontWeight={700}
                    fontSize="22px"
                    sx={{
                        color: "#030303",
                        mb: 1.5,
                    }}
                >
                    {logoutCountdown !== null ? "Logging Out" : "Logout Confirmation"}
                </Typography>

                {/* Description */}
                <Typography
                    level="body-sm"
                    sx={{
                        color: "#94a3b8",
                        lineHeight: 1.7,
                        fontSize: "14px",
                        mb: 1,
                    }}
                >
                    <Typography
    sx={{
        color: "#6b7280",
        lineHeight: 1.7,
        fontSize: "15px",
        mb: 3,
    }}
>
    {logoutCountdown !== null ? (
        <>
            Session ends soon{" "}
            <Typography
                component="span"
                sx={{
                    color: "#ea580c",
                    fontWeight: 800,
                    fontSize: "18px",
                    display: "inline",
                }}>
                {logoutCountdown}
            </Typography>{" "}
            sec
        </>
    ) : (
        "Do you want to logout from your account?"
    )}
</Typography>
                </Typography>

                {/* Countdown Display */}
                

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        onClick={cancelLogout}
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
                        variant="solid"
                        onClick={() => setLogoutCountdown(5)}
                        disabled={logoutCountdown !== null}
                        sx={{
                            flex: 1,
                            py: 1.4,
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: "14px",
                            bgcolor: "#f4a32a",
                            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
                            color: "#ffffff",
                            opacity: logoutCountdown !== null ? 0.6 : 1,
                            "&:hover:not(:disabled)": {
                                bgcolor: "#2563eb",
                                boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                            },
                        }}
                    >
                        {logoutCountdown !== null ? "Logouting.." : "Clear Session"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default LogoutModal;