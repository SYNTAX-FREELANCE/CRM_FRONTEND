import React, { memo, useMemo } from "react";
import { Card, CardContent, Typography, Box, Stack, Chip } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { BarChart as BarChartIcon, TrendingUp } from "@mui/icons-material";

const ReminderBarChartCard = ({ reminders }) => {
  const chartData = useMemo(() => {
    const overdue = Number(reminders?.summary?.overdue || reminders?.overdue?.length || 0);
    const today = Number(reminders?.summary?.today || reminders?.today?.length || 0);
    const tomorrow = Number(reminders?.summary?.tomorrow || reminders?.tomorrow?.length || 0);
    const upcoming = Number(reminders?.summary?.next7days || reminders?.upcoming?.length || 0);

    return [
      { label: "Overdue", count: overdue },
      { label: "Today", count: today },
      { label: "Tomorrow", count: tomorrow },
      { label: "Upcoming", count: upcoming },
    ];
  }, [reminders]);

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card
      sx={{
        borderRadius: 5,
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        border: "1px solid rgba(255,255,255,0.85)",
        overflow: "hidden",
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
            <Typography
              fontSize={{ xs: 18, md: 22 }}
              fontWeight={900}
              sx={{ color: "#0f172a" }}
            >
              Reminder Analytics
            </Typography>
            <Typography fontSize={{ xs: 12, md: 13 }} color="text.secondary">
              Overdue, today, tomorrow, and upcoming reminders
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

        <Box sx={{ width: "100%", height: { xs: 300, sm: 340, md: 420 } }}>
          <BarChart
            dataset={chartData}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "label",
                tickLabelStyle: { fill: "#64748b", fontSize: 12 },
              },
            ]}
            series={[
              {
                dataKey: "count",
                label: "Reminders",
                color: "#2563eb",
              },
            ]}
            margin={{ top: 20, right: 20, bottom: 40, left: 45 }}
            grid={{ horizontal: true }}
            height={undefined}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(ReminderBarChartCard);