import React from "react";
import { Card, Stack, IconButton, Typography, Box } from "@mui/joy";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Map Sunday to index 6, Monday to index 0 for ISO grid starting Monday
};

const formatDateKey = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const CalendarWidget = ({
    calendarDate,
    selectedDate,
    setSelectedDate,
    handlePrevMonth,
    handleNextMonth,
    allReminders = []
}) => {
    const getActiveEvents = (date) => {
        const dateKey = formatDateKey(date);
        return allReminders.filter(item => {
            if (!item.next_followup_date) return false;
            const followupDate = new Date(item.next_followup_date);
            return formatDateKey(followupDate) === dateKey;
        });
    };

    return (
        <Card
            sx={{
                p: 3,
                borderRadius: "24px",
                bgcolor: "white",
                border: "1px solid rgba(0,0,0,0.02)",
                boxShadow: "0 12px 36px rgba(15, 23, 42, 0.03)",
                height: "100%"
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <IconButton size="sm" variant="plain" onClick={handlePrevMonth} sx={{ borderRadius: "50%", "&:hover": { bgcolor: "neutral.50" } }}>
                    <ChevronLeft sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography level="title-md" sx={{ fontWeight: 900, color: "#1e1b4b", fontSize: "16px" }}>
                    {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
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
                {(() => {
                    const year = calendarDate.getFullYear();
                    const month = calendarDate.getMonth();
                    const daysInMonth = getDaysInMonth(year, month);
                    const firstDayIndex = getFirstDayOfMonth(year, month);
                    const cells = [];

                    // Offset empty cells
                    for (let i = 0; i < firstDayIndex; i++) {
                        cells.push(<Box key={`empty-${i}`} sx={{ height: "30px" }} />);
                    }

                    // Actual day cells
                    for (let day = 1; day <= daysInMonth; day++) {
                        const currentDayDate = new Date(year, month, day);
                        const dateKey = formatDateKey(currentDayDate);
                        const isSelected = formatDateKey(selectedDate) === dateKey;
                        const dayEvents = getActiveEvents(currentDayDate);
                        const hasEvents = dayEvents.length > 0;

                        // Highlight today with outline border
                        const isToday = formatDateKey(new Date()) === dateKey;

                        cells.push(
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
                                        border: isToday && !isSelected ? "2px solid #7c3aed" : "2px solid transparent",
                                        fontWeight: isSelected || isToday || hasEvents ? 900 : 600,
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
                    }
                    return cells;
                })()}
            </Box>
        </Card>
    );
};

export default CalendarWidget;
