import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent, Typography, Box, Stack, Chip } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

const ReminderAreaChartCard = ({ reminders }) => {
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
        chart: {
            type: "area",
            height: 350,
            zoom: { enabled: false },
            toolbar: { show: false },
            fontFamily: "inherit",
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
            theme: "light",
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
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                border: "1px solid rgba(255,255,255,0.85)",
                overflow: "hidden",
                height:'100%'
            }}
        >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    sx={{ mb: 2 }}
                    gap={1.5}
                >
                    <Box>
                        <Typography fontSize={{ xs: 18, md: 22 }} fontWeight={900} sx={{ color: "#0f172a" }}>
                            Reminder Area Chart
                        </Typography>
                        <Typography fontSize={{ xs: 12, md: 13 }} color="text.secondary">
                            Blue and orange chart for reminder summary
                        </Typography>
                    </Box>

                    <Chip
                        label={`Total: ${total}`}
                        icon={<TrendingUp sx={{ fontSize: 16 }} />}
                        sx={{
                            bgcolor: "rgba(37,99,235,0.08)",
                            color: "#2563eb",
                            fontWeight: 800,
                        }}
                    />
                </Stack>

                <Box sx={{ width: "100%" }}>
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="area"
                        height={'90%'}
                        width="100%"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReminderAreaChartCard;