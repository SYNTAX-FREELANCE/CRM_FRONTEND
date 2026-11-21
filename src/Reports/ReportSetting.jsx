
import React, { memo } from "react";
import { Box } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../Context/ThemeContext";

import MenuIcon from "@mui/icons-material/Menu";
import BadgeIcon from "@mui/icons-material/Badge";
import SecurityIcon from "@mui/icons-material/Security";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CallIcon from "@mui/icons-material/Call";

import { Paper, Typography } from "@mui/material";

const items = [
    {
        label: "Policy Report",
        path: "./policyreport",
        icon: <MenuIcon />,
    },
    {
        label: "Employee Performance Report",
        path: "./employeperformance",
        icon: <BadgeIcon />,
    },
    {
        label: "All Employee Performance Report",
        path: "./allemployeeperformance",
        icon: <BadgeIcon />,
    },
    {
        label: "Employee Login Report",
        path: "./UserLogReports",
        icon: <SecurityIcon />,
    },
    {
        label: "Detailed Employee Login Report",
        path: "./DetailedUserLogReports",
        icon: <SecurityIcon />,
    },
    {
        label: "Daily Employee Productivity Report",
        path: "./dailyemployeeproductivity",
        icon: <AssessmentIcon />,
    },
    {
        label: "Employee Call Details Report",
        path: "./employeecalldetails",
        icon: <CallIcon />,
    },
];

const ReportSetting = () => {

    const navigate = useNavigate();

    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const handleNavigate = (item) => {
        navigate(item.path, {
            state: { title: item.label },
        });
    };

    return (
        <Box
            sx={{
                minHeight: "95vh",
                width: "100%",

                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",

                "&::-webkit-scrollbar": {
                    display: "none",
                },

                position: "relative",

                background: isDark
                    ? `
                        radial-gradient(
                            circle at 5% 10%,
                            rgba(59,130,246,0.09),
                            transparent 35%
                        ),
                        radial-gradient(
                            circle at 5% 90%,
                            rgba(16,185,129,0.07),
                            transparent 30%
                        ),
                        ${" "}
                        #0f172a
                    `
                    : `
                        radial-gradient(
                            circle at 5% 10%,
                            rgba(111,207,207,0.35),
                            transparent 32%
                        ),
                        radial-gradient(
                            circle at 5% 90%,
                            rgba(255,218,140,0.35),
                            transparent 30%
                        ),
                        #e7f3eb
                    `,

                transition: "background 0.3s ease",

                px: {
                    xs: 1.5,
                    sm: 2,
                    md: 3,
                },

                py: {
                    xs: 2,
                    sm: 2.5,
                    md: 3,
                },
            }}
        >

            {/* MAIN CONTAINER */}

            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    minHeight: "90vh",

                    overflow: "hidden",

                    borderRadius: "24px",

                    background: isDark
                        ? "rgba(15,23,42,0.72)"
                        : "rgba(255,255,255,0.38)",

                    border: isDark
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(255,255,255,0.65)",

                    backdropFilter: "blur(24px)",

                    boxShadow: isDark
                        ? "0 15px 40px rgba(0,0,0,0.22)"
                        : "0 12px 35px rgba(35,65,45,0.06)",

                    position: "relative",
                }}
            >

                {/* HEADER */}

                <Box
                    sx={{
                        px: {
                            xs: 2,
                            sm: 2.5,
                            md: 3,
                        },

                        pt: {
                            xs: 2.5,
                            sm: 3,
                        },

                        pb: 2.5,

                        display: "flex",
                        alignItems: "center",

                        gap: 2,

                        borderBottom: isDark
                            ? "1px solid rgba(255,255,255,0.07)"
                            : "1px solid rgba(255,255,255,0.65)",
                    }}
                >

                    {/* HEADER ICON */}

                    <Box
                        sx={{
                            width: {
                                xs: 46,
                                sm: 54,
                            },

                            height: {
                                xs: 46,
                                sm: 54,
                            },

                            borderRadius: "17px",

                            flexShrink: 0,

                            background:
                                "linear-gradient(135deg, #ee8207 0%, #ffebb5 50%, #077bff 100%)",

                            color: "#172033",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            boxShadow: isDark
                                ? "0 6px 18px rgba(0,0,0,0.3)"
                                : "0 6px 18px rgba(15,23,42,0.12)",
                        }}
                    >
                        <FlagCircleIcon
                            sx={{
                                fontSize: {
                                    xs: 25,
                                    sm: 29,
                                },
                            }}
                        />
                    </Box>

                    {/* HEADER TEXT */}

                    <Box
                        sx={{
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 22,
                                    sm: 27,
                                    md: 30,
                                },

                                fontWeight: 850,

                                color: isDark
                                    ? "#f1f5f9"
                                    : "#202938",

                                lineHeight: 1.15,

                                letterSpacing: "-0.6px",
                            }}
                        >
                            Report Settings
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.6,

                                fontSize: {
                                    xs: 11,
                                    sm: 13,
                                },

                                color: isDark
                                    ? "#94a3b8"
                                    : "#727d83",

                                lineHeight: 1.5,
                            }}
                        >
                            Configure and access your reporting
                            and analytics modules.
                        </Typography>
                    </Box>

                </Box>


                {/* REPORT LIST */}

                <Box
                    sx={{
                        px: {
                            xs: 1.5,
                            sm: 2.5,
                            md: 3,
                        },

                        py: 2.5,

                        display: "flex",
                        flexDirection: "column",

                        gap: 1.2,

                        position: "relative",
                        zIndex: 1,
                    }}
                >

                    {items.map((item) => (

                        <Box
                            key={item.label}

                            onClick={() =>
                                handleNavigate(item)
                            }

                            sx={{
                                display: "grid",

                                gridTemplateColumns:
                                    "auto minmax(0,1fr) auto",

                                alignItems: "center",

                                columnGap: 1.5,

                                px: {
                                    xs: 1.5,
                                    sm: 2,
                                    md: 2.2,
                                },

                                py: {
                                    xs: 1.5,
                                    sm: 1.7,
                                },

                                minHeight: 67,

                                cursor: "pointer",

                                borderRadius: "17px",

                                bgcolor: isDark
                                    ? "rgba(30,41,59,0.72)"
                                    : "rgba(255,255,255,0.82)",

                                border: isDark
                                    ? "1px solid rgba(255,255,255,0.07)"
                                    : "1px solid rgba(255,255,255,0.9)",

                                boxShadow: isDark
                                    ? "0 4px 14px rgba(0,0,0,0.12)"
                                    : "0 4px 14px rgba(35,65,45,0.045)",

                                transition:
                                    "all 0.25s ease",

                                userSelect: "none",

                                "&:hover": {
                                    transform: {
                                        xs: "none",
                                        sm: "translateY(-3px)",
                                    },

                                    bgcolor: isDark
                                        ? "rgba(45,55,72,0.95)"
                                        : "#ffffff",

                                    borderColor: isDark
                                        ? "rgba(59,130,246,0.3)"
                                        : "rgba(22,128,68,0.25)",

                                    boxShadow: isDark
                                        ? "0 9px 22px rgba(0,0,0,0.25)"
                                        : "0 9px 22px rgba(35,65,45,0.09)",

                                    "& .report-icon": {
                                        transform: "scale(1.07)",
                                    },

                                    "& .report-arrow": {
                                        transform: "translateX(4px)",
                                        color: "primary.main",
                                    },
                                },

                                "&:active": {
                                    transform: "scale(0.99)",
                                },
                            }}
                        >

                            {/* ICON */}

                            <Box
                                className="report-icon"
                                sx={{
                                    width: {
                                        xs: 39,
                                        sm: 43,
                                    },

                                    height: {
                                        xs: 39,
                                        sm: 43,
                                    },

                                    borderRadius: "15px",

                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    bgcolor: isDark
                                        ? "rgba(251,96,13,0.16)"
                                        : "rgba(251,96,13,0.10)",

                                    color: isDark
                                        ? "#ff9b60"
                                        : "#e96816",

                                    flexShrink: 0,

                                    transition: "transform 0.25s ease",
                                }}
                            >
                                {React.cloneElement(item.icon, {
                                    sx: {
                                        fontSize: {
                                            xs: "1.2rem",
                                            sm: "1.3rem",
                                        },
                                    },
                                })}
                            </Box>


                            {/* TEXT */}

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",

                                    justifyContent: "center",

                                    minWidth: 0,
                                    rowGap: 0.35,
                                }}
                            >

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 12.5,
                                            sm: 14,
                                        },

                                        fontWeight: 750,

                                        color: isDark
                                            ? "#f1f5f9"
                                            : "#202936",

                                        lineHeight: 1.3,

                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {item.label}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: 10.5,
                                            sm: 12,
                                        },

                                        color: isDark
                                            ? "#94a3b8"
                                            : "#78818a",

                                        lineHeight: 1.4,

                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    Manage {item.label.toLowerCase()} settings.
                                </Typography>

                            </Box>


                            {/* ARROW */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    width: 30,
                                    height: 30,

                                    borderRadius: "50%",

                                    bgcolor: isDark
                                        ? "rgba(255,255,255,0.04)"
                                        : "rgba(22,128,68,0.045)",

                                    flexShrink: 0,
                                }}
                            >
                                <ArrowForwardIosIcon
                                    className="report-arrow"
                                    sx={{
                                        fontSize: 13,

                                        color: isDark
                                            ? "#64748b"
                                            : "#9aa5a9",

                                        transition: "all 0.25s ease",
                                    }}
                                />
                            </Box>

                        </Box>

                    ))}

                </Box>

            </Paper>

        </Box>
    );
};

export default memo(ReportSetting);
