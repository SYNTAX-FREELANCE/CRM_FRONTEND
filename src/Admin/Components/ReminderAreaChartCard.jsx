import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography, Box, Stack, Chip, useTheme } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

const ReminderAreaChartCard = ({ reminders }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const overdue = Number(reminders?.summary?.overdue || reminders?.overdue?.length || 0);
    const today = Number(reminders?.summary?.today || reminders?.today?.length || 0);
    const tomorrow = Number(reminders?.summary?.tomorrow || reminders?.tomorrow?.length || 0);
    const upcoming = Number(reminders?.summary?.next7days || reminders?.upcoming?.length || 0);

    const series = [
        {
            name: "Overdue",
            data: [overdue, today, tomorrow, upcoming],
        },
        {
            name: "Today",
            data: [today, tomorrow, upcoming, overdue],
        },
    ];

    const options = {
        theme: {
            mode: isDark ? 'dark' : 'light'
        },
        chart: {
            type: "area",
            height: 350,
            zoom: { enabled: false },
            toolbar: { show: false },
            fontFamily: "inherit",
            background: "transparent",
        },
        dataLabels: { enabled: false },
        stroke: { curve: "straight", width: 3 },
        grid: {
            borderColor: "#e2e8f0",
            strokeDashArray: 4,
        },
        title: {
            text: "Reminder Analytics",
            align: "left",
        },
        subtitle: {
            text: "Overdue, today, tomorrow, and upcoming",
            align: "left",
        },
        labels: ["Overdue", "Today", "Tomorrow", "Upcoming"],
        xaxis: {
            type: "category",
            labels: {
                style: {
                    colors: "#64748b",
                    fontSize: "12px",
                },
            },
        },
        yaxis: {
            opposite: true,
            labels: {
                style: {
                    colors: "#64748b",
                    fontSize: "12px",
                },
            },
        },
        legend: {
            horizontalAlign: "left",
        },
        colors: ["#2563eb", "#f97316"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0.3,
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 100],
            },
        },
        tooltip: {
            theme: isDark ? "dark" : "light",
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 280,
                    },
                    title: {
                        style: {
                            fontSize: "14px",
                        },
                    },
                    subtitle: {
                        style: {
                            fontSize: "11px",
                        },
                    },
                    xaxis: {
                        labels: {
                            style: { fontSize: "10px" },
                        },
                    },
                    yaxis: {
                        labels: {
                            style: { fontSize: "10px" },
                        },
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };

    const total = overdue + today + tomorrow + upcoming;

    return (
        <Card
            sx={{
                borderRadius: 5,
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.06)",
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.85)",
                overflow: "hidden",
                height: '100%',
                bgcolor: isDark ? "rgba(30,41,59,0.7)" : "#fff",
            }}
        >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", m: "center" }}
                    sx={{ mb: 2 }}
                    gap={1.5}
                >
                    <Box>
                        <Typography fontSize={{ xs: 18, md: 20 }} fontWeight={900} sx={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                            Reminder Chart.
                        </Typography>
                        <Typography fontSize={{ xs: 10, md: 11 }} color={isDark ? "#94a3b8" : "text.secondary"}>
                            Chart show the Rate of Reminders.
                        </Typography>
                    </Box>

                    <Chip
                        label={`Total: ${total}`}
                        icon={<TrendingUp sx={{ fontSize: 16 }} />}
                        sx={{
                            bgcolor: "rgba(37,99,235,0.08)",
                            color: "#2563eb",
                            fontWeight: 800,
                            fontSize: { xs: 10, md: 11 }
                        }}
                    />
                </Stack>

                <Box sx={{ width: "100%",  height: '100%' }}>
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="area"
                        height={400}
                        width="100%"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReminderAreaChartCard;