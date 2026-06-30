import React, { memo } from "react";
import {
    Box,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import ScheduleIcon from "@mui/icons-material/Schedule";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Row from "./Row";

const LeadHistoryTimelineItem = ({
    item,
    isLast = false,
}) => {
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
                        bgcolor: "#d1d5db",
                    }}
                />
            )}

            {/* Timeline Dot */}
            <Box
                sx={{
                    position: "absolute",
                    left: 4,
                    top: 6,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    bgcolor: "#f78819",
                }}
            />

            <Stack spacing={1}>
                {/* Status Change */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            size="small"
                            color="default"
                            label={item?.old_status_name}
                            sx={{
                                fontSize: 10,
                                fontWeight: 800
                            }}
                        />

                        <Typography
                            fontWeight={700}
                            color="text.secondary"
                        >
                            →
                        </Typography>

                        <Chip
                            size="small"
                            // color="primary"
                            label={item?.new_status_name}
                            sx={{
                                fontSize: 10,
                                fontWeight: 800,
                                bgcolor:'none',
                                border:'2px solid orange'
                            }}
                        />

                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="caption" sx={{
                            fontSize: 12,
                            fontWeight: 600
                        }}>
                            {new Date(item?.changed_at).toLocaleString()}
                        </Typography>
                    </Stack>
                </Box>
                {/* Changed Date */}


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