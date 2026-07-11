import React, { memo, useMemo } from "react";
import {
    Box,
    Typography,
    Sheet,
} from "@mui/joy";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import male from "../../assets/loginimages/male.png";
import female from "../../assets/loginimages/female.png";

const InfoRow = ({ icon, children }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            color: "text.tertiary",
            minWidth: 0,
        }}
    >
        {icon}
        <Typography
            level="body-sm"
            noWrap
            sx={{
                color: "text.secondary",
                minWidth: 0,
                fontSize: { xs: "10px", sm: "12px" },
                fontWeight: 600,
            }}
        >
            {children}
        </Typography>
    </Box>
);

const StatCard = ({ label, value, color, data }) => (
    <Box
        sx={{
            borderRadius: "8px",
            px: { xs: 0.75, sm: 1 },
            // py: { xs: 0.6, sm: 0.75 },
            border: `1px solid ${color}22`,
            bgcolor: "#fff",
            boxShadow: "sm",
            display: "flex",
            flexDirection: "column",
            gap: 0.35,
            minHeight: { xs: 48, sm: 56 },
            justifyContent: "center",
        }}
    >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Typography
                level="body-xs"
                sx={{
                    fontSize: { xs: "9px", sm: "11px" },
                    color,
                    fontWeight: 800,
                    lineHeight: 1,
                }}
            >
                {label}
            </Typography>
            <Typography
                level="title-sm"
                sx={{
                    color: "#0f172a",
                    fontWeight: 800,
                    lineHeight: 1,
                    fontSize: { xs: "11px", sm: "13px" },
                }}
            >
                {value}
            </Typography>
        </Box>

        <Box sx={{ width: "100%", height: { xs: 22, sm: 26 } }}>
            <SparkLineChart
                data={data}
                area
                showHighlight={false}
                showTooltip={false}
                curve="natural"
                color={color}
                height={24}
                margin={{ top: 2, bottom: 2, left: 2, right: 2 }}
                sx={{
                    width: "100%",
                    "& .MuiAreaElement-root": {
                        fill: `${color}20`,
                    },
                    "& .MuiLineElement-root": {
                        strokeWidth: 2,
                    },
                }}
            />
        </Box>
    </Box>
);

const EmployeeCard = ({ emp, onClick }) => {
    const genderImage = emp?.gender === "F" ? female : male;

    const { soldData, lostData } = useMemo(() => {
        const assigned = Number(emp?.total_assigned) || 0;
        const sold = Number(emp?.total_sold) || 0;
        const lost = Number(emp?.total_lost) || 0;

        const base = assigned > 0 ? assigned : sold + lost || 1;

        const soldPct = Math.max(0, Math.min((sold / base) * 100, 100));
        const lostPct = Math.max(0, Math.min((lost / base) * 100, 100));

        return {
            soldData: [0, soldPct * 0.25, soldPct * 0.55, soldPct * 0.85, soldPct],
            lostData: [0, lostPct * 0.3, lostPct * 0.6, lostPct * 0.9, lostPct],
        };
    }, [emp]);

    return (
        <Sheet
            variant="outlined"
            onClick={() => onClick(emp)}
            sx={{
                borderRadius: "12px",
                cursor: "pointer",
                bgcolor: "background.surface",
                borderColor: "divider",
                transition: "all .2s ease",
                p: { xs: 1.25, sm: 1.5 },
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.25, sm: 1.75 },
                "&:hover": {
                    borderColor: "#ffa825",
                    boxShadow: "sm",
                    transform: { sm: "translateY(-2px)" },
                },
                "&:active": {
                    transform: "translateY(0)",
                },
            }}
        >
            <Box
                sx={{
                    flexShrink: 0,
                    width: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                    borderRadius: "10px",
                    overflow: "hidden",
                    bgcolor: "neutral.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={genderImage}
                    alt={emp?.name || "Employee"}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>

            <Box
                sx={{
                    minWidth: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.4,
                }}
            >
                <Typography
                    level="title-md"
                    noWrap
                    sx={{
                        fontSize: { xs: "12px", sm: "14px" },
                        fontWeight: 800,
                        color: "#0f172a",
                        textTransform: "capitalize",
                    }}
                >
                    {emp?.name}
                </Typography>

                <InfoRow icon={<BadgeOutlinedIcon sx={{ fontSize: { xs: 11, sm: 12 } }} />}>
                    TSJK{emp?.employee_id}
                </InfoRow>

                <InfoRow icon={<BusinessOutlinedIcon sx={{ fontSize: { xs: 11, sm: 12 } }} />}>
                    {emp?.company_name || "No Company"}
                </InfoRow>

                <InfoRow icon={<PhoneOutlinedIcon sx={{ fontSize: { xs: 11, sm: 12 } }} />}>
                    {emp?.mobile_number_1 || "No Phone"}
                </InfoRow>
            </Box>

            <Box
                sx={{
                    width: { xs: 122, sm: 150 },
                    display: "flex",
                    gap: 0.75,
                    
                }}
            >
                <StatCard
                    label="Sold"
                    value={emp?.total_sold ?? 0}
                    color="#16a34a"
                    data={soldData}
                />
                <StatCard
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