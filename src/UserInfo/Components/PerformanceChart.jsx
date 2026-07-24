import React from "react";
import { Card, Stack, Box, Typography } from "@mui/joy";

const PerformanceChart = ({
    performanceData = [],
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    return (
        <Card
            sx={{
                p: { xs: 2.5, sm: 3, md: 3.5 },
                borderRadius: "24px",
                bgcolor: "white",
                border: "1px solid rgba(0,0,0,0.02)",
                boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                mt: 3.5
            }}
        >
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2.5} mb={3.5}>
                <Box>
                    <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b" }}>
                        Call Center Performance Analytics
                    </Typography>
                    <Typography level="body-xs" sx={{ color: "neutral.550", fontWeight: 700, mt: 0.25 }}>
                        Mixed Chart: Leads, Appointments, Callbacks (Bar) & Sales Sold (Line)
                    </Typography>
                </Box>

                {/* Date Picker inputs */}
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            bgcolor: "#f8fafc",
                            px: 1.5,
                            py: 0.75,
                            borderRadius: "10px",
                            border: "1px solid rgba(0,0,0,0.03)",
                            flex: { xs: 1, sm: "initial" }
                        }}
                    >
                        <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>From:</Typography>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{
                                border: "none",
                                background: "transparent",
                                fontSize: "12px",
                                fontWeight: 800,
                                color: "#1e1b4b",
                                fontFamily: "inherit",
                                outline: "none",
                                cursor: "pointer",
                                width: "100%"
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            bgcolor: "#f8fafc",
                            px: 1.5,
                            py: 0.75,
                            borderRadius: "10px",
                            border: "1px solid rgba(0,0,0,0.03)",
                            flex: { xs: 1, sm: "initial" }
                        }}
                    >
                        <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>To:</Typography>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{
                                border: "none",
                                background: "transparent",
                                fontSize: "12px",
                                fontWeight: 800,
                                color: "#1e1b4b",
                                fontFamily: "inherit",
                                outline: "none",
                                cursor: "pointer",
                                width: "100%"
                            }}
                        />
                    </Box>
                </Stack>
            </Stack>

            {/* Legends */}
            <Stack direction="row" spacing={3} sx={{ mb: 3 }} justifyContent="center" useFlexGap flexWrap="wrap">
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, bgcolor: "#3b82f6", borderRadius: "3px" }} />
                    <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>Leads</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, bgcolor: "#f97316", borderRadius: "3px" }} />
                    <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>Appointments</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, bgcolor: "#0d9488", borderRadius: "3px" }} />
                    <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>Callbacks</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 16, height: 4, bgcolor: "#6366f1", position: "relative", "&::after": { content: '""', position: "absolute", left: 6, top: -2, width: 4, height: 4, borderRadius: "50%", bgcolor: "#6366f1" } }} />
                    <Typography level="body-xs" sx={{ fontWeight: 800, color: "neutral.600" }}>Sold (Sales)</Typography>
                </Stack>
            </Stack>

            {/* Responsive SVG Container */}
            <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Box sx={{ minWidth: "600px", height: "300px", position: "relative" }}>
                    {(() => {
                        // Generate date-range chart details dynamically from backend performanceData
                        const callCenterPerformance = [];
                        const start = new Date(startDate);
                        const end = new Date(endDate);

                        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
                            const diffTime = Math.abs(end - start);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                            // Adjust tick spacing dynamically to prevent text collision
                            let step = 1;
                            if (diffDays > 45) step = 7; // Show weekly data points
                            else if (diffDays > 25) step = 4;
                            else if (diffDays > 14) step = 2;
                            else step = 1;

                            const performanceMap = {};
                            if (Array.isArray(performanceData)) {
                                performanceData.forEach(item => {
                                    try {
                                        const dStr = new Date(item.date).toISOString().split('T')[0];
                                        performanceMap[dStr] = {
                                            leads: item.leads || 0,
                                            appointments: item.appointments || 0,
                                            callbacks: item.callbacks || 0,
                                            sold: item.sold || 0
                                        };
                                    } catch (e) {
                                        console.error("Date format error:", e);
                                    }
                                });
                            }

                            let currentDate = new Date(start);
                            while (currentDate <= end) {
                                const dateStr = currentDate.toISOString().split('T')[0];
                                const dbData = performanceMap[dateStr] || { leads: 0, appointments: 0, callbacks: 0, sold: 0 };

                                callCenterPerformance.push({
                                    date: dateStr,
                                    leads: dbData.leads,
                                    appointments: dbData.appointments,
                                    callbacks: dbData.callbacks,
                                    sold: dbData.sold
                                });

                                currentDate.setDate(currentDate.getDate() + step);
                            }
                        }

                        const filteredData = callCenterPerformance;

                        if (filteredData.length === 0) {
                            return (
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                                    <Typography level="body-sm" color="neutral">
                                        No data available for the selected date range.
                                    </Typography>
                                </Box>
                            );
                        }

                        // Chart scaling calculations
                        const padding = { top: 20, right: 30, bottom: 40, left: 40 };
                        const chartWidth = 700;
                        const chartHeight = 280;
                        const graphWidth = chartWidth - padding.left - padding.right;
                        const graphHeight = chartHeight - padding.top - padding.bottom;

                        // Max value logic to adjust Y axis
                        const maxVal = Math.max(
                            ...filteredData.map(d => Math.max(d.leads, d.appointments, d.callbacks, d.sold)),
                            10
                        ) * 1.15;

                        const getX = (index) => padding.left + (index / (filteredData.length - 1 || 1)) * graphWidth;
                        const getY = (val) => chartHeight - padding.bottom - (val / maxVal) * graphHeight;

                        // Generate Line Path points for Sold
                        const linePoints = filteredData.map((d, i) => `${getX(i)},${getY(d.sold)}`).join(" ");

                        return (
                            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: "visible" }}>
                                <defs>
                                    <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.15" />
                                    </linearGradient>
                                    <linearGradient id="apptsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" />
                                        <stop offset="100%" stopColor="#fdba74" stopOpacity="0.15" />
                                    </linearGradient>
                                    <linearGradient id="callbacksGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0d9488" />
                                        <stop offset="100%" stopColor="#5eead4" stopOpacity="0.15" />
                                    </linearGradient>
                                </defs>

                                {/* Grid Lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                                    const yVal = maxVal * ratio;
                                    const y = getY(yVal);
                                    return (
                                        <g key={index}>
                                            <line
                                                x1={padding.left}
                                                y1={y}
                                                x2={chartWidth - padding.right}
                                                y2={y}
                                                stroke="rgba(0,0,0,0.05)"
                                                strokeWidth="1"
                                                strokeDasharray="4 4"
                                            />
                                            <text
                                                x={padding.left - 8}
                                                y={y + 4}
                                                textAnchor="end"
                                                style={{ fontSize: "10px", fontWeight: 800, fill: "#94a3b8" }}
                                            >
                                                {Math.round(yVal)}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Bars (Leads, Appointments, Callbacks) */}
                                {filteredData.map((d, index) => {
                                    const xCenter = getX(index);
                                    const barWidth = 10;
                                    const gap = 3;
                                    const leadsHeight = (d.leads / maxVal) * graphHeight;
                                    const apptsHeight = (d.appointments / maxVal) * graphHeight;
                                    const callbackHeight = (d.callbacks / maxVal) * graphHeight;

                                    return (
                                        <g key={index}>
                                            {/* Leads Bar */}
                                            <rect
                                                x={xCenter - barWidth * 1.5 - gap}
                                                y={getY(d.leads)}
                                                width={barWidth}
                                                height={leadsHeight}
                                                fill="url(#leadsGrad)"
                                                stroke="#3b82f6"
                                                strokeWidth="1"
                                                rx="2"
                                            />
                                            {/* Appointments Bar */}
                                            <rect
                                                x={xCenter - barWidth * 0.5}
                                                y={getY(d.appointments)}
                                                width={barWidth}
                                                height={apptsHeight}
                                                fill="url(#apptsGrad)"
                                                stroke="#f97316"
                                                strokeWidth="1"
                                                rx="2"
                                            />
                                            {/* Callbacks Bar */}
                                            <rect
                                                x={xCenter + barWidth * 0.5 + gap}
                                                y={getY(d.callbacks)}
                                                width={barWidth}
                                                height={callbackHeight}
                                                fill="url(#callbacksGrad)"
                                                stroke="#0d9488"
                                                strokeWidth="1"
                                                rx="2"
                                            />
                                            {/* X Axis Label */}
                                            <text
                                                x={xCenter}
                                                y={chartHeight - padding.bottom + 20}
                                                textAnchor="middle"
                                                style={{ fontSize: "10px", fontWeight: 800, fill: "#64748b" }}
                                            >
                                                {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Line Connection for Sold */}
                                {filteredData.length > 1 && (
                                    <polyline
                                        fill="none"
                                        stroke="#6366f1"
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={linePoints}
                                        style={{ filter: "drop-shadow(0px 4px 8px rgba(99, 102, 241, 0.35))" }}
                                    />
                                )}

                                {/* Line Points Dots */}
                                {filteredData.map((d, index) => {
                                    const cx = getX(index);
                                    const cy = getY(d.sold);
                                    return (
                                        <g key={index}>
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r="5"
                                                fill="#6366f1"
                                                stroke="#ffffff"
                                                strokeWidth="2"
                                                style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }}
                                            />
                                            <text
                                                x={cx}
                                                y={cy - 10}
                                                textAnchor="middle"
                                                style={{ fontSize: "10px", fontWeight: 900, fill: "#4338ca" }}
                                            >
                                                {d.sold}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        );
                    })()}
                </Box>
            </Box>
        </Card>
    );
};

export default PerformanceChart;
