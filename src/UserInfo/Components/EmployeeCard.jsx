
import React, { memo, useMemo, useState } from "react";
import {
    Box,
    Typography,
    Sheet,
    Skeleton,
} from "@mui/joy";

import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

import male from "../../assets/loginimages/male.png";
import female from "../../assets/loginimages/female.png";

import { axioslogin } from "../../Connection/axios";
import { useThemeMode } from "../../Context/ThemeContext";


const InfoRow = ({ icon, children, isDark }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            minWidth: 0,
            color: isDark ? "#94a3b8" : "#84918b",
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: isDark ? "#6ee7b7" : "#16804c",
            }}
        >
            {icon}
        </Box>

        <Typography
            level="body-xs"
            noWrap
            sx={{
                minWidth: 0,
                fontSize: { xs: "10px", sm: "11px" },
                fontWeight: 600,
                color: isDark ? "#cbd5e1" : "#64748b",
            }}
        >
            {children}
        </Typography>
    </Box>
);


const StatCard = ({ label, value, color, data, isDark }) => (
    <Box
        sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 0.8, sm: 1 },
            borderRadius: "13px",
            border: `1px solid ${color}${isDark ? "35" : "30"}`,
            background: isDark
                ? `linear-gradient(145deg, ${color}12, rgba(15,23,42,0.35))`
                : `linear-gradient(145deg, ${color}0c, rgba(255,255,255,0.45))`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 0.5,
            transition: "all 0.25s ease",

            "&:hover": {
                borderColor: `${color}75`,
                transform: "translateY(-2px)",
            },
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 0.5,
            }}
        >
            <Typography
                sx={{
                    color: isDark ? "#aab7c8" : "#77847d",
                    fontSize: { xs: "8px", sm: "8px" },
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    color,
                    fontSize: { xs: "15px", sm: "12px" },
                    fontWeight: 900,
                    lineHeight: 1,
                }}
            >
                {value}
            </Typography>
        </Box>

        <Box sx={{ width: "100%", height: 27 }}>
            <SparkLineChart
                data={data}
                area
                showHighlight={false}
                showTooltip={false}
                curve="natural"
                color={color}
                height={27}
                margin={{
                    top: 3,
                    bottom: 2,
                    left: 2,
                    right: 2,
                }}
                sx={{
                    width: "100%",
                    "& .MuiAreaElement-root": {
                        fill: `${color}22`,
                    },
                    "& .MuiLineElement-root": {
                        strokeWidth: 2.5,
                        strokeLinecap: "round",
                    },
                }}
            />
        </Box>
    </Box>
);


const EmployeeCard = ({ emp, onClick }) => {

    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const [imageLoading, setImageLoading] = useState(true);

    const genderImage = emp?.gender === "F" ? female : male;

    const { soldData, lostData } = useMemo(() => {

        const assigned = Number(emp?.total_assigned) || 0;
        const sold = Number(emp?.total_sold) || 0;
        const lost = Number(emp?.total_lost) || 0;

        const base = assigned > 0 ? assigned : sold + lost || 1;

        const soldPct = Math.max(0, Math.min((sold / base) * 100, 100));
        const lostPct = Math.max(0, Math.min((lost / base) * 100, 100));

        return {
            soldData: [
                0,
                soldPct * 0.25,
                soldPct * 0.55,
                soldPct * 0.85,
                soldPct,
            ],
            lostData: [
                0,
                lostPct * 0.3,
                lostPct * 0.6,
                lostPct * 0.9,
                lostPct,
            ],
        };

    }, [emp]);


    return (
        <Sheet
            variant="outlined"
            onClick={() => onClick(emp)}
            sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "20px",
                cursor: "pointer",
                p: { xs: 1.25, sm: 1.5 },

                display: "flex",
                alignItems: "center",
                gap: { xs: 1.25, sm: 1.75 },
                minWidth: 0,

                background: isDark
                    ? "linear-gradient(125deg, rgba(30,41,59,0.88), rgba(15,23,42,0.78))"
                    : "linear-gradient(125deg, rgba(255,255,255,0.88), rgba(239,250,242,0.72))",

                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",

                border: isDark
                    ? "1px solid rgba(148,163,184,0.16)"
                    : "1px solid rgba(255,255,255,0.95)",

                boxShadow: isDark
                    ? "0 8px 24px rgba(0,0,0,0.2)"
                    : "0 8px 24px rgba(42,83,57,0.07)",

                transition: "all 0.25s ease",

                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    background: "linear-gradient(180deg, #34d399, #0f766e)",
                    opacity: 0.9,
                },

                "&:hover": {
                    borderColor: isDark
                        ? "rgba(52,211,153,0.45)"
                        : "rgba(22,128,68,0.3)",
                    boxShadow: isDark
                        ? "0 12px 30px rgba(0,0,0,0.3)"
                        : "0 12px 30px rgba(42,83,57,0.12)",
                    transform: { xs: "none", sm: "translateY(-3px)" },

                    "& .employee-avatar": {
                        transform: "scale(1.05)",
                    },
                },

                "&:active": {
                    transform: "scale(0.99)",
                },
            }}
        >

            {/* PROFILE IMAGE */}

            <Box
                className="employee-avatar"
                sx={{
                    position: "relative",
                    flexShrink: 0,
                    width: { xs: 55, sm: 66 },
                    height: { xs: 55, sm: 66 },
                    borderRadius: "17px",
                    p: "2px",

                    background: "linear-gradient(145deg, #34d399, #0f766e, #fbbf24)",
                    transition: "transform 0.3s ease",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "15px",
                        overflow: "hidden",
                        position: "relative",
                        bgcolor: isDark ? "#1e293b" : "#e8f5ed",
                    }}
                >
                    {imageLoading && (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            animation="wave"
                            sx={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 2,
                            }}
                        />
                    )}

                    <img
                        src={`${axioslogin.defaults.baseURL}/employee/profile-photo/${emp.user_id}`}
                        onLoad={() => setImageLoading(false)}
                        alt={
                            emp?.name
                                ?.split(" ")
                                .map((s) => s[0])
                                .slice(0, 2)
                                .join("") || "Employee"
                        }
                        onError={(e) => {
                            setImageLoading(false);
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = genderImage;
                        }}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: imageLoading ? "none" : "block",
                        }}
                    />
                </Box>
            </Box>


            {/* EMPLOYEE INFORMATION */}

            <Box
                sx={{
                    minWidth: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.65,
                }}
            >
                <Typography
                    level="title-md"
                    noWrap
                    sx={{
                        fontSize: { xs: "12px", sm: "14px" },
                        fontWeight: 900,
                        color: isDark ? "#f1f5f9" : "#20342b",
                        textTransform: "capitalize",
                        letterSpacing: "0.1px",
                    }}
                >
                    {emp?.name || "Employee"}
                </Typography>

                <InfoRow
                    isDark={isDark}
                    icon={<BadgeOutlinedIcon sx={{ fontSize: 13 }} />}
                >
                    TSJK{emp?.employee_id}
                </InfoRow>

                <InfoRow
                    isDark={isDark}
                    icon={<BusinessOutlinedIcon sx={{ fontSize: 13 }} />}
                >
                    {emp?.company_name || "No Company"}
                </InfoRow>

                <InfoRow
                    isDark={isDark}
                    icon={<PhoneOutlinedIcon sx={{ fontSize: 13 }} />}
                >
                    {emp?.mobile_number_1 || "No Phone"}
                </InfoRow>
            </Box>


            {/* PERFORMANCE STATISTICS */}

            <Box
                sx={{
                    width: { xs: 122, sm: 158 },
                    flexShrink: 0,
                    display: "flex",
                    gap: 0.75,
                }}
            >
                <StatCard
                    isDark={isDark}
                    label="Sold"
                    value={emp?.total_sold ?? 0}
                    color="#16a34a"
                    data={soldData}
                />

                <StatCard
                    isDark={isDark}
                    label="Lost"
                    value={emp?.total_lost ?? 0}
                    color="#ea580c"
                    data={lostData}
                />
            </Box>

        </Sheet>
    );
};

export default memo(EmployeeCard);
