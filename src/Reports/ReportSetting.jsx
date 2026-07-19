import React, { memo } from "react";
import { Box, Divider } from "@mui/joy";
import { useNavigate } from "react-router-dom";


// Icons
import ExtensionIcon from "@mui/icons-material/Extension";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import BadgeIcon from "@mui/icons-material/Badge";
import SecurityIcon from "@mui/icons-material/Security";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Stack } from "@mui/system";
import { Paper, Typography } from "@mui/material";

const items = [
    { label: "Policy Report", path: "/home/setting/menumaster", icon: <MenuIcon /> },
    { label: "Sales Report", path: "/home/setting/modulemaster", icon: <ExtensionIcon /> },
    { label: "Employee Performance Report", path: "/home/setting/employeemaster", icon: <BadgeIcon /> },
    { label: "Employee Loggin Report", path: "/home/setting/rolemaster", icon: <SecurityIcon /> },
];

const ReportSetting = () => {
    const navigate = useNavigate();

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
                background: `
          radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
          radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
          linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
        `,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    minHeight: "95vh",
                    width: "100%",
                    border: "1px solid rgba(255, 255, 255, 0.65)",
                    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.05)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 0,
                    background: "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(24px)",
                }}
            >
                <Box
                    sx={{
                        px: { xs: 2, md: 3 },
                        py: 2.5,
                        borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
                        background: "rgba(255, 255, 255, 0.35)",
                        flex: "0 0 auto",
                        display: 'flex',
                        gap: 2,
                        mb: 2
                    }}
                >
                    <Box
                        sx={{
                            width: 54,
                            height: 54,
                            borderRadius: "16px",
                            background:
                                "linear-gradient(135deg, #ee8207 0%, #ffebb5 50%, #077bff 100%)",
                            color: "#020202",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 20px rgba(15, 23, 42, 0.25)",
                        }}
                    >
                        <FlagCircleIcon sx={{ fontSize: "1.6rem" }} />
                    </Box>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", md: "center" }}
                        gap={2}
                    >
                        <Box>
                            <Typography variant="h5" fontWeight={900} color="#0f172a" sx={{ letterSpacing: "-0.5px" }}>
                                Report Settings
                            </Typography>
                            <Typography variant="body2" color="#475569" sx={{ fontWeight: 500 }}>
                                Configure the core masters used across reporting and analytics.
                            </Typography>
                        </Box>


                    </Stack>
                </Box>
                {/* List container */}
                <Box
                    sx={{
                        borderRadius: { xs: "14px", md: "16px" },
                        overflow: "hidden",
                        px: 2,

                    }}
                >
                    {items?.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <Box
                                key={item.label}
                                onClick={() =>
                                    navigate(item.path, {
                                        state: { title: item.label },
                                    })
                                }
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "auto minmax(0, 1fr) auto",
                                    alignItems: "center",
                                    columnGap: 1.5,
                                    px: { xs: 2, sm: 2.5 },
                                    py: { xs: 1.4, sm: 1.8 },
                                    cursor: "pointer",
                                    bgcolor: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.03)",
                                    borderBottom: isLast ? "none" : "1px solid #e5e7eb",
                                    mb: 1,
                                    transition:
                                        "background-color 0.16s ease, transform 0.12s ease, box-shadow 0.16s ease",
                                    "&:hover": {
                                        bgcolor: "#f9fafb",
                                        transform: { xs: "none", sm: "translateY(-1px)" },
                                        boxShadow: {
                                            xs: "none",
                                            sm: "0 8px 18px rgba(15, 23, 42, 0.06)",
                                        },
                                    },
                                    "&:active": {
                                        bgcolor: "#e5f0ff",
                                        transform: "scale(0.99)",
                                    },
                                }}
                            >
                                {/* Icon */}
                                <Box
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: "14px",
                                        bgcolor: "#fb600d",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#ffffff",
                                        flexShrink: 0,
                                    }}
                                >
                                    {React.cloneElement(item.icon, {
                                        sx: { fontSize: "1.25rem" },
                                    })}
                                </Box>

                                {/* Text block */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        minWidth: 0,
                                        rowGap: 0.3,
                                    }}
                                >
                                    <Typography
                                        level="body-sm"
                                        sx={{
                                            fontWeight: 600,
                                            color: "#0f172a",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                    <Typography
                                        level="body-xs"
                                        sx={{
                                            color: "#64748b",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                        }}
                                    >
                                        Manage {item.label.toLowerCase()} settings.
                                    </Typography>
                                </Box>

                                {/* Arrow */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        ml: 1,
                                        flexShrink: 0,
                                    }}
                                >
                                    <ArrowForwardIosIcon
                                        sx={{
                                            fontSize: "0.8rem",
                                            color: "#cbd5e1",
                                        }}
                                    />
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Paper>
        </Box>
    );
};

export default memo(ReportSetting);