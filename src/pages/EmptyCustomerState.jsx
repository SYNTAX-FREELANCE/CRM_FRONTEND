
import React from "react";
import {
    Box,
    Paper,
    Typography,
    Chip,
    useTheme,
} from "@mui/material";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SearchIcon from "@mui/icons-material/Search";
import ShieldIcon from "@mui/icons-material/Shield";

import { glassStyles } from "../CommonCode/Reusable";

const EmptyCustomerState = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const features = [
        {
            icon: <DirectionsCarIcon sx={{ fontSize: 17 }} />,
            title: "Vehicle records",
            sub: "Registration, model, ownership",
            color: "#dc2626",
        },
        {
            icon: <VerifiedUserIcon sx={{ fontSize: 17 }} />,
            title: "Insurance",
            sub: "Policy and renewal visibility",
            color: "#0d9488",
        },
        {
            icon: <AssignmentIndIcon sx={{ fontSize: 17 }} />,
            title: "Customer profile",
            sub: "Contact and account details",
            color: "#2563eb",
        },
        {
            icon: <ShieldIcon sx={{ fontSize: 17 }} />,
            title: "Service history",
            sub: "Follow-up and status timeline",
            color: "#d97706",
        },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                position: "relative",
                overflow: "hidden",

                p: {
                    xs: 2,
                    sm: 2.5,
                    md: 2.5,
                },

                borderRadius: "24px",

                ...glassStyles(isDark),

                bgcolor: isDark
                    ? theme.palette.background.paper
                    : "#ffffff",

                border: isDark
                    ? `1px solid ${theme.palette.divider}`
                    : "1px solid rgba(255,255,255,0.9)",

                boxShadow: isDark
                    ? "0 8px 28px rgba(0,0,0,0.22)"
                    : "0 8px 25px rgba(35,65,45,0.07)",

                minHeight: {
                    xs: "auto",
                    md: 294,
                },

                transition: "all 0.3s ease",

                // BACKGROUND GLOW

                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,

                    background: isDark
                        ? `
                            radial-gradient(
                                circle at top left,
                                ${theme.palette.primary.main}16,
                                transparent 38%
                            ),
                            radial-gradient(
                                circle at bottom right,
                                rgba(16,185,129,0.08),
                                transparent 35%
                            )
                        `
                        : `
                            radial-gradient(
                                circle at top left,
                                rgba(16,185,129,0.07),
                                transparent 38%
                            ),
                            radial-gradient(
                                circle at bottom right,
                                rgba(255,218,140,0.10),
                                transparent 35%
                            )
                        `,

                    pointerEvents: "none",
                },
            }}
        >

            {/* MAIN CONTENT */}

            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,

                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },

                    alignItems: "center",

                    gap: {
                        xs: 2.5,
                        md: 3,
                    },

                    height: "100%",
                    minHeight: {
                        md: 244,
                    },
                }}
            >

                {/* LEFT ILLUSTRATION */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            md: 220,
                            lg: 256,
                        },

                        height: {
                            xs: 180,
                            md: 214,
                        },

                        flexShrink: 0,

                        borderRadius: "24px",

                        display: "grid",
                        placeItems: "center",

                        position: "relative",
                        overflow: "hidden",

                        background: isDark
                            ? `
                                linear-gradient(
                                    145deg,
                                    ${theme.palette.primary.dark}30,
                                    ${theme.palette.background.default}
                                )
                            `
                            : `
                                linear-gradient(
                                    145deg,
                                    #e0f2e9,
                                    #d9eee1
                                )
                            `,

                        border: isDark
                            ? `1px solid ${theme.palette.divider}`
                            : "1px solid rgba(255,255,255,0.7)",
                    }}
                >

                    {/* DECORATIVE CIRCLES */}

                    <Box
                        sx={{
                            position: "absolute",
                            width: 130,
                            height: 130,
                            borderRadius: "50%",
                            bgcolor: isDark
                                ? `${theme.palette.primary.main}12`
                                : "rgba(255,255,255,0.25)",
                            top: -45,
                            left: -35,
                        }}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            bgcolor: isDark
                                ? `${theme.palette.primary.main}10`
                                : "rgba(255,255,255,0.2)",
                            bottom: -35,
                            right: -20,
                        }}
                    />

                    {/* VEHICLE ILLUSTRATION */}

                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 1,
                            fontSize: {
                                xs: 72,
                                md: 86,
                            },

                            filter: isDark
                                ? "drop-shadow(0 8px 12px rgba(0,0,0,0.25))"
                                : "drop-shadow(0 8px 10px rgba(0,0,0,0.12))",

                            animation: "carFloat 3s ease-in-out infinite",

                            "@keyframes carFloat": {
                                "0%, 100%": {
                                    transform: "translateY(0)",
                                },
                                "50%": {
                                    transform: "translateY(-5px)",
                                },
                            },
                        }}
                    >
                        🚗
                    </Box>

                    {/* CRM LABEL */}

                    <Box
                        sx={{
                            position: "absolute",
                            right: 12,
                            top: "40%",

                            px: 1.2,
                            py: 0.6,

                            borderRadius: "12px",

                            bgcolor: isDark
                                ? theme.palette.background.paper
                                : "rgba(255,255,255,0.9)",

                            boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 11,
                                fontWeight: 800,
                                color: isDark
                                    ? theme.palette.success.light
                                    : "#15803d",
                            }}
                        >
                            ✓ CRM
                        </Typography>
                    </Box>

                </Box>


                {/* RIGHT CONTENT */}

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        width: "100%",
                    }}
                >

                    {/* WORKSPACE CHIP */}

                    <Chip
                        icon={
                            <SearchIcon
                                sx={{ fontSize: "15px !important" }}
                            />
                        }

                        label="Customer workspace"

                        size="small"

                        sx={{
                            mb: 1.2,

                            height: 27,
                            borderRadius: "20px",

                            bgcolor: isDark
                                ? `${theme.palette.success.main}20`
                                : "#e0f2e5",

                            color: isDark
                                ? theme.palette.success.light
                                : "#15803d",

                            fontSize: 12,
                            fontWeight: 800,

                            "& .MuiChip-icon": {
                                color: "inherit",
                            },

                            "& .MuiChip-label": {
                                px: 1.2,
                            },
                        }}
                    />

                    {/* TITLE */}

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 23,
                                sm: 26,
                                md: 28,
                            },

                            fontWeight: 850,

                            color: "text.primary",

                            lineHeight: 1.15,
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Nothing selected yet
                    </Typography>

                    {/* DESCRIPTION */}

                    <Typography
                        sx={{
                            mt: 1,

                            color: "text.secondary",

                            fontSize: {
                                xs: 13,
                                sm: 14,
                            },

                            lineHeight: 1.65,
                        }}
                    >
                        Start by searching with a vehicle number,
                        mobile number, or customer name. Once you
                        pick a match, this page can show vehicle
                        records, insurance status, customer profile,
                        and related CRM activity.
                    </Typography>


                    {/* FEATURE CARDS */}

                    <Box
                        sx={{
                            display: "grid",

                            gridTemplateColumns: {
                                xs: "repeat(1, minmax(0, 1fr))",
                                sm: "repeat(2, minmax(0, 1fr))",
                                lg: "repeat(4, minmax(0, 1fr))",
                            },

                            gap: 1.2,

                            mt: 2.2,
                            width: "100%",
                        }}
                    >

                        {features.map((item) => (
                            <Box
                                key={item.title}
                                sx={{
                                    minWidth: 0,

                                    display: "flex",
                                    alignItems: "center",

                                    gap: 1.2,

                                    p: 1.3,

                                    borderRadius: "17px",

                                    border: isDark
                                        ? `1px solid ${theme.palette.divider}`
                                        : "1px solid rgba(148,163,184,0.25)",

                                    bgcolor: isDark
                                        ? "rgba(255,255,255,0.025)"
                                        : "rgba(255,255,255,0.55)",

                                    transition: "all 0.25s ease",

                                    "&:hover": {
                                        transform: "translateY(-3px)",

                                        borderColor: `${item.color}65`,

                                        bgcolor: isDark
                                            ? "rgba(255,255,255,0.055)"
                                            : "#ffffff",

                                        boxShadow: isDark
                                            ? "0 5px 15px rgba(0,0,0,0.2)"
                                            : "0 5px 15px rgba(15,23,42,0.05)",
                                    },
                                }}
                            >

                                {/* ICON */}

                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,

                                        borderRadius: "50%",

                                        flexShrink: 0,

                                        display: "grid",
                                        placeItems: "center",

                                        bgcolor: isDark
                                            ? `${item.color}20`
                                            : `${item.color}15`,

                                        color: item.color,
                                    }}
                                >
                                    {item.icon}
                                </Box>

                                {/* LABEL */}

                                <Box
                                    sx={{
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: 13.5,
                                            fontWeight: 800,
                                            color: "text.primary",
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 11.5,
                                            color: "text.secondary",
                                            mt: 0.3,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {item.sub}
                                    </Typography>
                                </Box>

                            </Box>
                        ))}

                    </Box>


                    {/* TIP */}

                    <Typography
                        sx={{
                            mt: 2,

                            fontSize: 12.5,

                            color: "text.secondary",

                            fontStyle: "italic",
                        }}
                    >
                        Tip: typing at least 3 characters gives
                        more accurate customer matches.
                    </Typography>

                </Box>

            </Box>

        </Paper>
    );
};

export default EmptyCustomerState;
