import React, { memo } from "react";
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    Stack,
    Divider,
} from "@mui/material";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import SellIcon from "@mui/icons-material/Sell";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { SparkLineChart } from "@mui/x-charts";
import StatPill from "./StatPill";
import { axioslogin } from "../../Connection/axios";

const buildSparkSeries = (calls, sold) => {
    const callValue = Number(calls || 0);
    const soldValue = Number(sold || 0);

    return [
        Math.max(1, Math.round(callValue * 0.15)),
        Math.max(1, Math.round(callValue * 0.22)),
        Math.max(1, Math.round(callValue * 0.28)),
        Math.max(1, Math.round(callValue * 0.35)),
        Math.max(1, Math.round(callValue * 0.42)),
        Math.max(1, Math.round(soldValue * 0.55)),
        Math.max(1, Math.round(soldValue * 0.72)),
        Math.max(1, Math.round(soldValue)),
    ];
};

const ExecutiveCard = ({
    rank,
    name,
    avatar,
    calls,
    sold,
    empid,
    highlight = false,
}) => {
    const colors = {
        blue: "#1D4ED8",
        blueSoft: "#DBEAFE",
        orange: "#F97316",
        orangeSoft: "#FFEDD5",
        ink: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
        bg: "linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)",
    };

    const sparkData = buildSparkSeries(calls, sold);
    const color = highlight ? colors.orange : colors.blue;

    return (
        <Card
            sx={{
                position: "relative",
                overflow: "visible",
                borderRadius: 3.5,
                border: `1px solid ${highlight ? colors.orange : colors.border}`,
                boxShadow: highlight
                    ? "0 18px 40px rgba(249,115,22,0.12)"
                    : "0 10px 26px rgba(15,23,42,0.06)",
                background: colors.bg,
                transition: "transform .18s ease, box-shadow .18s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 16px 32px rgba(15,23,42,0.10)",
                },
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 15,
                    width: 26,
                    height: 26,
                    borderRadius: "999px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: highlight ? colors.orange : colors.blueSoft,
                    color: highlight ? "#fff" : colors.blue,
                    fontWeight: 800,
                    fontSize: 14,
                }}
            >
                {rank}
            </Box>

            <CardContent sx={{ p: 2 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: highlight ? colors.orange : colors.blue,
                            fontSize: 12,
                            fontWeight: 600
                        }}
                        
                        src={`${axioslogin.defaults.baseURL}/employee/profile-photo/${empid}`}
                        imgProps={{
                            onError: (e) => {
                                e.target.style.display = "none";
                            },
                        }}
                    >
                        {name
                            .split(" ")
                            .map((s) => s[0])
                            .slice(0, 2)
                            .join("")}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 800, color: colors.ink }} noWrap>
                            {name}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ mt: 0.6, alignItems: "center", flexWrap: "wrap" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: colors.muted }}>
                                <PhoneInTalkIcon sx={{ fontSize: 15, color: "#1f2eff" }} />
                                <Typography sx={{ fontSize: 12.5 }}>{calls} calls</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: colors.muted }}>
                                <SellIcon sx={{ fontSize: 15, color: '#f0a308' }} />
                                <Typography sx={{ fontSize: 12.5 }}>{sold} sold</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <EmojiEventsIcon sx={{ color: highlight ? colors.orange : colors.blue, fontSize: 24 }} />
                </Stack>

                <Divider sx={{ my: 1.75, borderColor: colors.border }} />

                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>

                        <Box sx={{ width: "100%", height: { xs: 20, sm: 20 } }}>
                            <SparkLineChart
                                data={sparkData}
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
                </Box>
            </CardContent>
        </Card>
    );
};

export default memo(ExecutiveCard);