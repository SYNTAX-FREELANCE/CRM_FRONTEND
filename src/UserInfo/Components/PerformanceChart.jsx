import React from "react";
import { Card, Stack, Box, Typography } from "@mui/joy";
import { useThemeMode } from "../../Context/ThemeContext";

const PerformanceChart = ({
    performanceData = [],
    startDate,
    setStartDate,
    endDate,
    setEndDate
}) => {
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    return (
        <Card
            sx={{
                p: { xs: 2.5, sm: 3, md: 3.5 },
                borderRadius: "24px",
                bgcolor: isDark ? "#1e293b" : "white",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0,0,0,0.02)",
                boxShadow: isDark ? "0 12px 36px rgba(0, 0, 0, 0.4)" : "0 12px 36px rgba(15, 23, 42, 0.03)",
                mt: 3.5
            }}
        >
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2.5} mb={3.5}>
                <Box>
                    <Typography level="title-md" sx={{ fontWeight: 900, color: isDark ? "#f8fafc" : "#1e1b4b" }}>
                        Call Center Performance Analytics
                    </Typography>
                    <Typography level="body-xs" sx={{ color: isDark ? "#94a3b8" : "neutral.550", fontWeight: 700, mt: 0.25 }}>
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
                            bgcolor: isDark ? "#0f172a" : "#f8fafc",
                            px: 1.5,
                            py: 0.75,
                            borderRadius: "10px",
                            border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0,0,0,0.03)",
                            flex: { xs: 1, sm: "initial" }
                        }}
                    >
                        <Typography level="body-xs" sx={{ fontWeight: 800, color: isDark ? "#cbd5e1" : "neutral.600" }}>From:</Typography>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            style={{
                                border: "none",
                                background: "transparent",
                                fontSize: "12px",
                                fontWeight: 800,
                                color: isDark ? "#f8fafc" : "#1e1b4b",
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
                            bgcolor: isDark ? "#0f172a" : "#f8fafc",
                            px: 1.5,
                            py: 0.75,
                            borderRadius: "10px",
                            border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0,0,0,0.03)",
                            flex: { xs: 1, sm: "initial" }
                        }}
                    >
                        <Typography level="body-xs" sx={{ fontWeight: 800, color: isDark ? "#cbd5e1" : "neutral.600" }}>To:</Typography>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            style={{
                                border: "none",
                                background: "transparent",
                                fontSize: "12px",
                                fontWeight: 800,
                                color: isDark ? "#f8fafc" : "#1e1b4b",
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
                    <Typography level="body-xs" sx={{ fontWeight: 800, color: isDark ? "#cbd5e1" : "neutral.600" }}>Leads</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, bgcolor: "#f97316", borderRadius: "3px" }} />
                    <Typography level="body-xs" sx={{ fontWeight: 800, color: isDark ? "#cbd5e1" : "neutral.600" }}>Appointments</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 12, height: 12, bgcolor: "#0d9488", borderRadius: "3px" }} />
                    <Typography level="body-xs" sx={{ fontWeight: 800, color: isDark ? "#cbd5e1" : "neutral.600" }}>Callbacks</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 16, height: 4, bgcolor: "#6366f1", position: "relative", "&::after": { content: '""', position: "absolute", left: 6, top: -2, width: 4, height: 4, borderRadius: "50%", bgcolor: "#6366f1" } }} />
                    <Typography level="body-xs" sx={{ fontWeight: 800, color: isDark ? "#cbd5e1" : "neutral.600" }}>Sold (Sales)</Typography>
                </Stack>
            </Stack>

            {/* Responsive SVG Container */}
            <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Box sx={{ minWidth: "600px", height: "300px", position: "relative" }}>
                    {(() => {
                        const callCenterPerformance = [];
                        const start = new Date(startDate);
                        const end = new Date(endDate);

                        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
                            const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                            let step = diffDays > 45 ? 7 : diffDays > 25 ? 4 : diffDays > 14 ? 2 : 1;

                            const performanceMap = {};
                            if (Array.isArray(performanceData)) {
                                performanceData.forEach(item => {
                                    if (item.formatted_date) {
                                        performanceMap[item.formatted_date] = item;
                                    }
                                });
                            }

                            const cur = new Date(start);
                            let dayIdx = 0;
                            while (cur <= end) {
                                const year = cur.getFullYear();
                                const month = String(cur.getMonth() + 1).padStart(2, "0");
                                const dayStr = String(cur.getDate()).padStart(2, "0");
                                const dateKey = `${year}-${month}-${dayStr}`;

                                if (dayIdx % step === 0 || cur.getTime() === end.getTime()) {
                                    const match = performanceMap[dateKey];
                                    callCenterPerformance.push({
                                        date: dateKey,
                                        leads: match ? Number(match.total_leads || 0) : 0,
                                        appointments: match ? Number(match.appointments || 0) : 0,
                                        callbacks: match ? Number(match.callbacks || 0) : 0,
                                        sold: match ? Number(match.sold || 0) : 0
                                    });
                                }

                                cur.setDate(cur.getDate() + 1);
                                dayIdx++;
                            }
                        }

                        const filteredData = callCenterPerformance.length > 0 ? callCenterPerformance : [
                            { date: startDate || "2026-01-01", leads: 0, appointments: 0, callbacks: 0, sold: 0 }
                        ];

                        const chartWidth = 600;
                        const chartHeight = 300;
                        const padding = { top: 30, right: 30, bottom: 40, left: 40 };

                        const graphWidth = chartWidth - padding.left - padding.right;
                        const graphHeight = chartHeight - padding.top - padding.bottom;

                        const maxVal = Math.max(
                            ...filteredData.map(d => Math.max(d.leads, d.appointments, d.callbacks, d.sold, 10))
                        ) * 1.15;

                        const getX = (index) => {
                            if (filteredData.length === 1) return padding.left + graphWidth / 2;
                            return padding.left + (index / (filteredData.length - 1)) * graphWidth;
                        };

                        const getY = (val) => chartHeight - padding.bottom - (val / maxVal) * graphHeight;

                        const linePoints = filteredData.map((d, i) => `${getX(i)},${getY(d.sold)}`).join(" ");

                        return (
                            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                                    </linearGradient>
                                    <linearGradient id="apptsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
                                    </linearGradient>
                                    <linearGradient id="callbacksGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0.2" />
                                    </linearGradient>
                                </defs>

                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                                    const yPos = chartHeight - padding.bottom - ratio * graphHeight;
                                    const yVal = ratio * maxVal;
                                    return (
                                        <g key={idx}>
                                            <line
                                                x1={padding.left}
                                                y1={yPos}
                                                x2={chartWidth - padding.right}
                                                y2={yPos}
                                                stroke={isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9"}
                                                strokeDasharray={idx === 0 ? "0" : "4 4"}
                                            />
                                            <text
                                                x={padding.left - 8}
                                                y={yPos + 4}
                                                textAnchor="end"
                                                style={{ fontSize: "10px", fontWeight: 700, fill: isDark ? "#94a3b8" : "#94a3b8" }}
                                            >
                                                {Math.round(yVal)}
                                            </text>
                                        </g>
                                    );
                                })}

                                {filteredData.map((d, index) => {
                                    const xCenter = getX(index);
                                    const barWidth = 8;
                                    const gap = 2;
                                    const leadsHeight = (d.leads / maxVal) * graphHeight;
                                    const apptsHeight = (d.appointments / maxVal) * graphHeight;
                                    const callbackHeight = (d.callbacks / maxVal) * graphHeight;

                                    return (
                                        <g key={index}>
                                            <rect x={xCenter - barWidth * 1.5 - gap} y={getY(d.leads)} width={barWidth} height={leadsHeight} fill="url(#leadsGrad)" stroke="#3b82f6" strokeWidth="1" rx="2" />
                                            <rect x={xCenter - barWidth * 0.5} y={getY(d.appointments)} width={barWidth} height={apptsHeight} fill="url(#apptsGrad)" stroke="#f97316" strokeWidth="1" rx="2" />
                                            <rect x={xCenter + barWidth * 0.5 + gap} y={getY(d.callbacks)} width={barWidth} height={callbackHeight} fill="url(#callbacksGrad)" stroke="#0d9488" strokeWidth="1" rx="2" />
                                            <text
                                                x={xCenter}
                                                y={chartHeight - padding.bottom + 20}
                                                textAnchor="middle"
                                                style={{ fontSize: "10px", fontWeight: 800, fill: isDark ? "#94a3b8" : "#64748b" }}
                                            >
                                                {new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </text>
                                        </g>
                                    );
                                })}

                                {filteredData.length > 0 && (
                                    <polyline fill="none" stroke="#6366f1" strokeWidth="3" points={linePoints} />
                                )}

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
                                                stroke={isDark ? "#1e293b" : "#ffffff"}
                                                strokeWidth="2"
                                                style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }}
                                            />
                                            <text
                                                x={cx}
                                                y={cy - 10}
                                                textAnchor="middle"
                                                style={{ fontSize: "10px", fontWeight: 900, fill: isDark ? "#a5b4fc" : "#4338ca" }}
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
