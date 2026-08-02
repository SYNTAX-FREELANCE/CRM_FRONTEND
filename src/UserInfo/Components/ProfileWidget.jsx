import React from "react";
import { Card, Box, Avatar, CircularProgress, Typography, Chip, Stack, IconButton, Divider } from "@mui/joy";
import { CameraAlt, Email, Call } from "@mui/icons-material";
import { useAuth } from "../../Context/AuthContext";
import { successNotify } from "../../constant/Constant";
import { useThemeMode } from "../../Context/ThemeContext";

const ProfileWidget = ({
    displayEmployee,
    profilePhotoUrl,
    isProfilePhotoUploading,
    handleProfilePhotoChange,
    isAdmin
}) => {
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    return (
        <Card
            sx={{
                p: 0,
                borderRadius: "24px",
                overflow: "hidden",
                bgcolor: isDark ? "#1e293b" : "white",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0,0,0,0.02)",
                boxShadow: isDark ? "0 12px 36px rgba(0, 0, 0, 0.4)" : "0 12px 36px rgba(15, 23, 42, 0.03)",
                height: { xs: "auto", md: "390px" }
            }}
        >
            <Box sx={{ position: "relative", width: "100%" }}>
                {/* Creative visual gradient header banner */}
                <Box
                    sx={{
                        height: "170px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isDark
                            ? "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)"
                            : "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
                        position: "relative"
                    }}
                >
                    {/* Low opacity abstract sphere watermark */}
                    <Box
                        sx={{
                            position: "absolute",
                            width: 140,
                            height: 140,
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.08)",
                            top: -20,
                            right: -20
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.04)",
                            bottom: 10,
                            left: 20
                        }}
                    />
                </Box>

                <Avatar
                    src={isProfilePhotoUploading ? undefined : (profilePhotoUrl || undefined)}
                    onClick={() => {
                        if (isAdmin || isProfilePhotoUploading) return;
                        const el = document.getElementById("profile-photo-input");
                        if (el) el.click();
                    }}
                    sx={{
                        width: 90,
                        height: 90,
                        border: isDark ? "4px solid #1e293b" : "4px solid #ffffff",
                        boxShadow: isDark ? "0 8px 24px rgba(0, 0, 0, 0.5)" : "0 8px 24px rgba(15, 23, 42, 0.1)",
                        position: "absolute",
                        bottom: "-45px",
                        left: { xs: "50%", sm: "24px" },
                        transform: { xs: "translateX(-50%)", sm: "none" },
                        zIndex: 2,
                        bgcolor: isDark ? "#312e81" : "#e0e7ff",
                        color: isDark ? "#a5b4fc" : "#4f46e5",
                        fontSize: "32px",
                        fontWeight: 800,
                        cursor: (isAdmin || isProfilePhotoUploading) ? "default" : "pointer",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1.2",
                        "&:hover": {
                            opacity: (isAdmin || isProfilePhotoUploading) ? 1 : 0.85
                        }
                    }}
                >
                    {isProfilePhotoUploading ? (
                        <CircularProgress size="sm" />
                    ) : !profilePhotoUrl ? (
                        <CameraAlt />
                    ) : null}
                </Avatar>


                <input
                    type="file"
                    id="profile-photo-input"
                    accept=".jpg,.jpeg,.jpj"
                    style={{ display: "none" }}
                    onChange={handleProfilePhotoChange}
                />

            </Box>

            {/* Info Section with padding-top layout offset for Avatar overlap */}
            <Box sx={{ pt: { xs: 8, sm: 7.5 }, px: { xs: 2.5, sm: 3 }, pb: 3.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "center", sm: "flex-start" },
                        justifyContent: "space-between",
                        textAlign: { xs: "center", sm: "left" },
                        mb: 2,
                        gap: { xs: 2, sm: 0 }
                    }}
                >
                    <Box sx={{ minWidth: 0, pr: { xs: 0, sm: 2 } }}>
                        <Typography level="title-lg" sx={{ fontWeight: 900, color: isDark ? "#f8fafc" : "#1e1b4b" }} noWrap>
                            {displayEmployee.name}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-start" }, alignItems: "center", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                            <Chip
                                size="sm"
                                variant="soft"
                                sx={{
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    bgcolor: isDark ? "rgba(167, 139, 250, 0.15)" : "rgba(124, 58, 237, 0.08)",
                                    color: isDark ? "#c084fc" : "#7c3aed",
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: "6px"
                                }}
                            >
                                #{displayEmployee.employee_id}
                            </Chip>
                            <Chip
                                size="sm"
                                variant="soft"
                                color="primary"
                                sx={{
                                    fontSize: "10px",
                                    fontWeight: 800,
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: "6px"
                                }}
                            >
                                {displayEmployee.role}
                            </Chip>
                        </Box>
                    </Box>

                    {/* Action Buttons Capsule */}
                    <Stack direction="row" spacing={1.2}>
                        <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={() => {
                                window.open(`mailto:${displayEmployee.email}`);
                                successNotify("Opening email client...");
                            }}
                            sx={{
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                borderColor: isDark ? "rgba(165, 180, 252, 0.3)" : "rgba(99, 102, 241, 0.15)",
                                color: isDark ? "#a5b4fc" : "#4f46e5",
                                bgcolor: isDark ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.02)",
                                transition: "0.2s",
                                "&:hover": { bgcolor: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.08)", transform: "scale(1.08)" }
                            }}
                        >
                            <Email sx={{ fontSize: 15 }} />
                        </IconButton>
                        <IconButton
                            size="sm"
                            variant="outlined"
                            onClick={() => {
                                window.open(`tel:${displayEmployee.mobile}`);
                                successNotify("Calling mobile number...");
                            }}
                            sx={{
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                borderColor: isDark ? "rgba(165, 180, 252, 0.3)" : "rgba(99, 102, 241, 0.15)",
                                color: isDark ? "#a5b4fc" : "#4f46e5",
                                bgcolor: isDark ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.02)",
                                transition: "0.2s",
                                "&:hover": { bgcolor: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(99, 102, 241, 0.08)", transform: "scale(1.08)" }
                            }}
                        >
                            <Call sx={{ fontSize: 15 }} />
                        </IconButton>
                    </Stack>
                </Box>
                <Divider sx={{ mb: 2, opacity: isDark ? 0.2 : 0.6 }} />
                <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "center", sm: "center" }, gap: { xs: 0.5, sm: 0 } }}>
                        <Typography level="body-xs" sx={{ color: isDark ? "#94a3b8" : "neutral.500", fontWeight: 700 }}>Worksite Location</Typography>
                        <Typography level="body-xs" sx={{ color: isDark ? "#f8fafc" : "#1e1b4b", fontWeight: 800 }}>{displayEmployee.company}</Typography>
                    </Box>
                </Stack>
            </Box>
        </Card>
    );
};

export default ProfileWidget;
