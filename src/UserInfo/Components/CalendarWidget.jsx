import React from "react";
import { Card, Stack, IconButton, Typography, Box } from "@mui/joy";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { format, getDaysInMonth, startOfMonth, getDay, isToday, isSameDay } from "date-fns";

const CalendarWidget = ({
    calendarDate,
    selectedDate,
    setSelectedDate,
    handlePrevMonth,
    handleNextMonth,
    allReminders = []
}) => {
    const getActiveEvents = (date) => {
        const dateKey = format(date, "yyyy-MM-dd");
        return allReminders.filter(item => {
            if (!item.next_followup_date) return false;
            const followupDate = new Date(item.next_followup_date);
            return format(followupDate, "yyyy-MM-dd") === dateKey;
        });
    };

    // Calculate calendar day cells in component scope
    const daysInMonthCount = getDaysInMonth(calendarDate);
    const firstDay = startOfMonth(calendarDate);
    const firstDayOfWeek = getDay(firstDay);
    // Map Sunday (0) to index 6, Monday (1) to index 0, ..., Saturday (6) to index 5
    const firstDayIndex = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Offset empty cells using Array.from
    const emptyCells = Array.from({ length: firstDayIndex }, (_, i) => (
        <Box key={`empty-${i}`} sx={{ height: "30px" }} />
    ));

    // Actual day cells using Array.from
    const dayCells = Array.from({ length: daysInMonthCount }, (_, i) => {
        const day = i + 1;
        const currentDayDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
        const isSelected = isSameDay(selectedDate, currentDayDate);
        const dayEvents = getActiveEvents(currentDayDate);
        const hasEvents = dayEvents.length > 0;
        const isCurrentDayToday = isToday(currentDayDate);

        return (
            <Box
                key={`day-${day}`}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    height: "30px"
                }}
            >
                <Box
                    onClick={() => setSelectedDate(currentDayDate)}
                    sx={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isSelected
                            ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                            : hasEvents
                                ? (dayEvents[0].lineBg ? `${dayEvents[0].lineBg}1f` : "rgba(124, 58, 237, 0.12)")
                                : "transparent",
                        color: isSelected
                            ? "white"
                            : hasEvents
                                ? (dayEvents[0].lineBg || "#7c3aed")
                                : "#1e1b4b",
                        border: isCurrentDayToday && !isSelected ? "2px solid #7c3aed" : "2px solid transparent",
                        fontWeight: isSelected || isCurrentDayToday || hasEvents ? 900 : 600,
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: isSelected ? "0 4px 12px rgba(124, 58, 237, 0.25)" : "none",
                        "&:hover": {
                            background: isSelected
                                ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                                : hasEvents
                                    ? `${dayEvents[0].lineBg || "#7c3aed"}33`
                                    : "rgba(124, 58, 237, 0.06)",
                            transform: "scale(1.05)"
                        }
                    }}
                >
                    {day}
                </Box>
                {hasEvents && !isSelected && (
                    <Box sx={{ display: "flex", gap: "2px", position: "absolute", bottom: "-1px" }}>
                        {dayEvents.slice(0, 3).map((e, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    bgcolor: e.lineBg || "#7c3aed"
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        );
    });

    const cells = [...emptyCells, ...dayCells];

    return (
        <Card
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: "24px",
                bgcolor: "white",
                border: "1px solid rgba(0,0,0,0.02)",
                boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                height: { xs: "auto", md: "390px" }
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <IconButton size="sm" variant="plain" onClick={handlePrevMonth} sx={{ borderRadius: "50%", "&:hover": { bgcolor: "neutral.50" } }}>
                    <ChevronLeft sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b", fontSize: "16px" }}>
                    {format(calendarDate, "MMMM yyyy")}
                </Typography>
                <IconButton size="sm" variant="plain" onClick={handleNextMonth} sx={{ borderRadius: "50%", "&:hover": { bgcolor: "neutral.50" } }}>
                    <ChevronRight sx={{ fontSize: 18 }} />
                </IconButton>
            </Stack>

            {/* Weekday titles */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", mb: 1.5, pb: 1, borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <Typography key={i} level="body-xs" sx={{ color: "neutral.400", fontWeight: 800, fontSize: "11px" }}>
                        {d}
                    </Typography>
                ))}
            </Box>

            {/* Dynamic Grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", rowGap: "10px", textAlign: "center" }}>
                {cells}
            </Box>
        </Card>
    );
};

export default CalendarWidget;
