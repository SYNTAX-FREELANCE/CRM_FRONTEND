
import React, { memo } from "react";
import {
    Box,
    Chip,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

import ScheduleIcon from "@mui/icons-material/Schedule";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Row from "./Row";

const LeadHistoryTimelineItem = ({
    item,
    isLast = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const colors = {
        line: isDark ? "#46564b" : "#dce9df",
        dot: isDark ? "#65c98a" : "#21834b",
        oldBg: isDark ? "#303a33" : "#f0f3f1",
        oldText: isDark ? "#c1ccc4" : "#65736a",
        oldBorder: isDark ? "#46534a" : "#e1e8e3",
        newBg: isDark ? "#203b2b" : "#eaf6ed",
        newText: isDark ? "#80d69d" : "#168044",
        newBorder: isDark ? "#426c4e" : "#cde6d4",
        text: isDark ? "#e1ebe4" : "#34483a",
        secondary: isDark ? "#a2b1a6" : "#78877e",
    };

    return (
        <Box
            sx={{
                position: "relative",
                pl: 4,
                pb: !isLast ? 3 : 0,
            }}
        >
            {/* Timeline Line */}
            {!isLast && (
                <Box
                    sx={{
                        position: "absolute",
                        left: 13,
                        top: 30,
                        width: 2,
                        bottom: -12,
                        bgcolor: colors.line,
                        borderRadius: 2,
                    }}
                />
            )}

            {/* Timeline Dot */}
            <Box
                sx={{
                    position: "absolute",
                    left: 4,
                    top: 6,
                    width: 19,
                    height: 19,
                    borderRadius: "50%",
                    bgcolor: colors.dot,
                    border: `4px solid ${isDark ? "#26332a" : "#e6f3e9"}`,
                    boxShadow: isDark
                        ? "0 0 0 1px #42634b"
                        : "0 0 0 1px #c9e5d0",
                    zIndex: 1,
                }}
            />

            <Stack spacing={1}>
                {/* Status Change and Date */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        flexWrap="wrap"
                    >
                        <Chip
                            size="small"
                            label={item?.old_status_name}
                            sx={{
                                height: 22,
                                fontSize: 10,
                                fontWeight: 700,
                                color: colors.oldText,
                                bgcolor: colors.oldBg,
                                border: `1px solid ${colors.oldBorder}`,
                                borderRadius: "6px",
                            }}
                        />

                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: colors.secondary,
                                fontSize: 14,
                            }}
                        >
                            →
                        </Typography>

                        <Chip
                            size="small"
                            label={item?.new_status_name}
                            sx={{
                                height: 22,
                                fontSize: 10,
                                fontWeight: 800,
                                color: colors.newText,
                                bgcolor: colors.newBg,
                                border: `1px solid ${colors.newBorder}`,
                                borderRadius: "6px",
                            }}
                        />
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={0.6}
                        alignItems="center"
                    >
                        <ScheduleIcon
                            sx={{
                                fontSize: 15,
                                color: colors.secondary,
                            }}
                        />

                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: colors.secondary,
                            }}
                        >
                            {new Date(item?.changed_at).toLocaleString()}
                        </Typography>
                    </Stack>
                </Box>

                {/* Reason */}
                <Row
                    label="Reason"
                    value={item?.status_change_reason || "-"}
                    icon={<ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />}
                    accent="blue"
                />

                {/* Remarks */}
                <Row
                    label="Remarks"
                    value={item.remarks || "No Remarks"}
                    icon={<ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />}
                    accent="blue"
                />
            </Stack>
        </Box>
    );
};

export default memo(LeadHistoryTimelineItem);
