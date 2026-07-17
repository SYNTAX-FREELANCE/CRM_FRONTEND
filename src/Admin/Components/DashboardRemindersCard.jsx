import React, { memo, Suspense, useMemo, useState } from "react";
import {
    Card,
    useTheme,
    CardContent,
    Typography,
    Box,
    Grid,
    Stack,
    Chip,
    Avatar,
    Divider,
    Collapse,
} from "@mui/material";
import {
    Today,
    EventAvailable,
    Schedule,
    ErrorOutline,
    ExpandMore,
    ExpandLess,
} from "@mui/icons-material";
import ReminderItem from "../../Employee/Component/ReminderItem";
import ReminderCard from "../../Employee/Component/ReminderCard";
import ReminderItemSkeleton from "../../SkeletonComponent/ReminderItemSkeleton";
import ReminderCardSkeleton from "../../SkeletonComponent/ReminderCardSkeleton";


const statusMeta = {
    overdue: {
        label: "Overdue",
        color: "#dc2626",
        bg: "rgba(220,38,38,0.08)",
        icon: <ErrorOutline fontSize="small" />,
    },
    today: {
        label: "Today",
        color: "#2563eb",
        bg: "rgba(37,99,235,0.08)",
        icon: <Today fontSize="small" />,
    },
    tomorrow: {
        label: "Tomorrow",
        color: "#7c3aed",
        bg: "rgba(124,58,237,0.08)",
        icon: <Schedule fontSize="small" />,
    },
    upcoming: {
        label: "Upcoming",
        color: "#059669",
        bg: "rgba(5,150,105,0.08)",
        icon: <EventAvailable fontSize="small" />,
    },
};


const DashboardRemindersCard = ({ remindersData }) => {

    const summary = remindersData?.summary || {};
    const overdueList = remindersData?.overdue || [];
    const todayList = remindersData?.today || [];
    const tomorrowList = remindersData?.tomorrow || [];
    const upcomingList = remindersData?.upcoming || [];

    const [activeStatus, setActiveStatus] = useState("overdue");

    const summaryItems = [
        {
            key: "overdue",
            title: "Overdue",
            count: Number(summary.overdue || overdueList.length || 0),
            ...statusMeta.overdue,
        },
        {
            key: "today",
            title: "Today",
            count: Number(summary.today || todayList.length || 0),
            ...statusMeta.today,
        },
        {
            key: "tomorrow",
            title: "Tomorrow",
            count: Number(summary.tomorrow || tomorrowList.length || 0),
            ...statusMeta.tomorrow,
        },
        {
            key: "upcoming",
            title: "Upcoming",
            count: Number(summary.next7days || upcomingList.length || 0),
            ...statusMeta.upcoming,
        },
    ];

    const listMap = {
        overdue: overdueList.map((item) => ({ ...item, status: "overdue" })),
        today: todayList.map((item) => ({ ...item, status: "today" })),
        tomorrow: tomorrowList.map((item) => ({ ...item, status: "tomorrow" })),
        upcoming: upcomingList.map((item) => ({ ...item, status: "upcoming" })),
    };

    const activeItems = listMap[activeStatus] || [];
    const total = summaryItems.reduce((sum, item) => sum + item.count, 0);

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Card
            sx={{
                borderRadius: 5,
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.06)",
                border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.85)",
                height: "100%",
                overflow: "hidden",
                height: '60vh',
                overflowY: 'scroll',
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                position: 'relative',

            }}
        >
            <CardContent sx={{ px: 2 }}>
                <Box
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 100,
                        bgcolor: "background.paper",
                        p: 1
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between",
                            gap: 1.5,
                            flexDirection: { xs: "column", sm: "row" },
                            mb: 2,

                        }} >
                        <Box>
                            <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 900, color: isDark ? "#f8fafc" : "#0f172a" }}>
                                Today’s Reminders
                            </Typography>
                            <Typography sx={{ fontSize: { xs: 12, md: 13 }, color: isDark ? "#94a3b8" : "text.secondary", mt: 0.3 }}>
                                Tap a header to show the matching reminders below
                            </Typography>
                        </Box>

                        <Chip
                            label={`${total} total`}
                            sx={{
                                bgcolor: "rgba(37,99,235,0.08)",
                                color: "#2563eb",
                                fontWeight: 800,
                                fontSize: { xs: 12, md: 13 }
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "repeat(2, minmax(0, 1fr))",
                                sm: "repeat(2, minmax(0, 1fr))",
                                md: "repeat(4, minmax(0, 1fr))",
                                lg: "repeat(4, minmax(0, 1fr))",
                            },
                            gap: 2,
                            width: "100%",
                        }}
                    >

                        {summaryItems?.map((item) => {
                            const { key, ...rest } = item;

                            return (
                                <Grid item xs={6} sm={6} md={3} key={key}>
                                    <Suspense fallback={<ReminderCardSkeleton />}>
                                        <ReminderCard
                                            {...rest}
                                            active={activeStatus === key}
                                            onClick={() => setActiveStatus(key)}
                                        />
                                    </Suspense>
                                </Grid>
                            );
                        })}
                    </Box>
                </Box>
                <Divider sx={{ my: 2 }} />

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1.5,
                    }}
                >
                    <Typography sx={{ fontWeight: 800, color: isDark ? "#f8fafc" : "#0f172a" }}>
                        {statusMeta[activeStatus].label} Reminders
                    </Typography>
                    <Chip
                        label={activeItems?.length}
                        size="small"
                        sx={{
                            bgcolor: statusMeta[activeStatus].bg,
                            color: statusMeta[activeStatus].color,
                            fontWeight: 900,
                        }}
                    />
                </Box>

                <Stack spacing={1.2}>
                    {activeItems?.length ? (
                        activeItems?.map((item) => (
                            <Suspense key={item?.lead_id} fallback={<ReminderItemSkeleton />}>
                                <ReminderItem item={item} />
                            </Suspense>
                        ))
                    ) : (
                        <Box
                            sx={{
                                p: 3,
                                textAlign: "center",
                                borderRadius: 3,
                                bgcolor: isDark ? "rgba(30,41,59,0.9)" : "rgba(248,250,252,0.9)",
                                border: "1px dashed rgba(148,163,184,0.5)",
                            }}
                        >
                            <Typography sx={{ fontWeight: 700, color: isDark ? "#cbd5e1" : "#334155" }}>
                                No {statusMeta[activeStatus].label.toLowerCase()} reminders found
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "text.secondary", mt: 0.5 }}>
                                You are all caught up for this section.
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default memo(DashboardRemindersCard);