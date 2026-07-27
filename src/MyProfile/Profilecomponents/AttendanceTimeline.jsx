import React, { memo } from "react";
import {
    Box,
    Chip,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { format } from "date-fns";

const AttendanceTimeline = ({ attendance = [] }) => {

    if (!attendance.length) return null;

    const active = attendance.some(item => item.logout_time == null);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                height: {
                    xs: 350,
                    sm: 420,
                    md: "calc(100vh - 500px)",
                },
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Box>
                    <Typography
                        fontSize={12}
                        color="text.secondary"
                        fontWeight={600}
                    >
                        {attendance.length} Session(s)
                    </Typography>
                </Box>

                <Chip
                    variant="outlined"
                    color={active ? "success" : "default"}
                    label={active ? "Working" : "Logged Out"}
                    sx={{
                        fontSize: 11,
                        fontWeight: 800,
                    }}
                />
            </Stack>

            {/* Scrollable Content */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    pr: 0.5,

                    scrollbarWidth: "none",
                    msOverflowStyle: "none",

                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                <Stack spacing={2}>
                    {attendance.map((item, index) => (
                        <Paper
                            key={item.id}
                            elevation={0}
                            sx={{
                                p: 1.5,
                                bgcolor: "#fff",
                                border: "1px solid #E2E8F0",
                                borderRadius: 2,
                            }}
                        >
                            {/* Session Header */}
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={1.5}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <FiberManualRecordIcon
                                        color={
                                            item.logout_time
                                                ? "disabled"
                                                : "success"
                                        }
                                        sx={{ fontSize: 10 }}
                                    />

                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            fontSize: {
                                                xs: 12,
                                                sm: 14,
                                            },
                                        }}
                                    >
                                        Session {attendance.length - index}
                                    </Typography>
                                </Stack>

                                <Chip
                                    size="small"
                                    variant="outlined"
                                    color={
                                        item.logout_time
                                            ? "default"
                                            : "success"
                                    }
                                    label={
                                        item.logout_time
                                            ? "Completed"
                                            : "Active"
                                    }
                                    sx={{
                                        fontSize: 10,
                                        fontWeight: 800,
                                    }}
                                />
                            </Stack>

                            {/* Session Details */}
                            <Stack
                                direction={{
                                    xs: "column",
                                    md: "row",
                                }}
                                spacing={2}
                                justifyContent="space-between"
                            >
                                {/* Login */}
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <LoginIcon
                                        color="success"
                                        sx={{ fontSize: 16 }}
                                    />

                                    <Box>
                                        <Typography
                                            fontSize={9}
                                            color="text.secondary"
                                        >
                                            Login
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                            sx={{
                                                fontSize: {
                                                    xs: 10,
                                                    sm: 12,
                                                },
                                            }}
                                        >
                                            {format(
                                                new Date(item.login_time),
                                                "dd MMM yyyy hh:mm a"
                                            )}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Logout */}
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <LogoutIcon
                                        color="error"
                                        sx={{ fontSize: 16 }}
                                    />

                                    <Box>
                                        <Typography
                                            fontSize={9}
                                            color="text.secondary"
                                        >
                                            Logout
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                            sx={{
                                                fontSize: {
                                                    xs: 10,
                                                    sm: 12,
                                                },
                                            }}
                                        >
                                            {item.logout_time
                                                ? format(
                                                      new Date(item.logout_time),
                                                      "dd MMM yyyy hh:mm a"
                                                  )
                                                : "Currently Working"}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Productivity */}
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <TimerOutlinedIcon
                                        color="warning"
                                        sx={{ fontSize: 16 }}
                                    />

                                    <Box>
                                        <Typography
                                            fontSize={9}
                                            color="text.secondary"
                                        >
                                            Productivity
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                            sx={{
                                                fontSize: {
                                                    xs: 10,
                                                    sm: 12,
                                                },
                                            }}
                                        >
                                            {item.productivity_hours} hrs
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </Box>
        </Paper>
    );
};

export default memo(AttendanceTimeline);