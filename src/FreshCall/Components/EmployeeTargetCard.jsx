import React, { memo } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    useTheme
} from "@mui/material";

import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PercentIcon from "@mui/icons-material/Percent";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import { useGetCallsLeft } from "../../CommonCode/useQuery";


const EmployeeTargetCard = ({ data = [] }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const emp = data[0];
    const { data: callsLeftCount = 0 } = useGetCallsLeft(emp?.employee_id);

    if (!emp) return null;


    const totalTarget =
        Number(emp.normal_target) + Number(emp.renewal_target);

    const achievement =
        totalTarget > 0
            ? ((Number(emp.total_sold) / totalTarget) * 100).toFixed(2)
            : 0;


    const cards = [
        {
            title: "Normal Target",
            value: emp.normal_target,
            icon: <TrackChangesIcon sx={{
                fontSize: { xs: 12, sm: 14 },
                color: '#186f11'
            }} />
        },
        {
            title: "Normal Sold",
            value: emp.normal_sold,
            icon: <TrendingUpIcon sx={{
                fontSize: { xs: 12, sm: 14 },
                color: '#ff5a0d'
            }} />
        },
        {
            title: "Renewal Target",
            value: emp.renewal_target,
            icon: <AutorenewIcon sx={{
                fontSize: { xs: 12, sm: 14 },
                color: '#186f11'
            }} />
        },
        {
            title: "Renewal Sold",
            value: emp.renewal_sold,
            icon: <TrendingUpIcon sx={{
                fontSize: { xs: 12, sm: 14 },
                color: '#ff5a0d'
            }} />
        },
        {
            title: "Total Sold",
            value: emp.total_sold,
            icon: <TrendingUpIcon sx={{
                fontSize: { xs: 12, sm: 14 },
                color: '#186f11'
            }} />
        },
        {
            title: "Calls Left",
            value: callsLeftCount,
            icon: <PhoneCallbackIcon sx={{
                fontSize: { xs: 12, sm: 14 },
                color: '#d32f2f'
            }} />
        },
        {
            title: "Achievement",
            value: `${achievement}%`,
            icon: <PercentIcon sx={{
                fontSize: { xs: 12, sm: 14 },
                color: '#ff5a0d'
            }} />
        },
    ];

    return (
        <Box
            display="grid"
            gridTemplateColumns={{
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(7, 1fr)"
            }}
            gap={{ xs: 1, sm: 1.25, md: 1.5 }}
            width={'100%'}
        >
            {cards?.map((card) => (
                <Card
                    key={card.title}
                    sx={{
                        borderRadius: 2,
                        boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : 1,
                        bgcolor: isDark ? "rgba(30,41,59,0.85)" : "#fff",
                        minWidth: 0,
                        height: "100%",
                        minHeight: 60,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.5)" : 3
                        }
                    }}
                >
                    <CardContent
                        sx={{
                            p: { xs: 1, sm: 1.25 },
                            "&:last-child": { pb: { xs: 1, sm: 1.25 } }
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={0.5}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                                title={card.title}
                                sx={{
                                    fontSize: { xs: 9, sm: 10, md: 11 },
                                    fontWeight: 800,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    color: isDark ? "#94a3b8" : "text.secondary"
                                }}
                            >
                                {card.title}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0
                                }}
                            >
                                {card.icon}
                            </Box>
                        </Box>

                        <Typography
                            fontWeight={700}
                            sx={{
                                fontSize: { xs: 13, sm: 15, md: 16 },
                                lineHeight: 1.2,
                                mt: 0.5,
                                color: isDark ? "#f8fafc" : "text.primary"
                            }}
                        >
                            {card.value}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default memo(EmployeeTargetCard);