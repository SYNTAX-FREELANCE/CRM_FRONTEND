import React, { memo } from "react";
import {
    Box,
    Chip,
    Divider,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CommentIcon from "@mui/icons-material/Comment";
import Row from "./Row";

const LeadFollowUpCard = ({ item, index }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: isDark ? "rgba(30, 41, 59, 0.6)" : "#f8fafc",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                transition: "all .2s ease",
                "&:hover": {
                    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.4)" : 2,
                    borderColor: "primary.main",
                },
            }}
        >
            {/* Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1.5}
            >
                <Chip
                    size="small"
                    color="primary"
                    label={item.status_name}
                />
            </Stack>

            <Stack spacing={1.5}>

                <Row
                    label="Outcome"
                    value={item.call_outcome || "-"}
                    icon={<PhoneInTalkIcon sx={{ fontSize: 14 }} />}
                    accent="blue"
                />

                <Row
                    label="Next Follow Up"
                    value={item.next_followup_date
                        ? new Date(item?.next_followup_date).toLocaleString()
                        : "-"}
                    icon={<EventNoteIcon sx={{ fontSize: 14 }} />}
                    accent="blue"
                />
                <Row
                    label="Remarks"
                    value={item.remarks || "No remarks"}
                    icon={<CommentIcon sx={{ fontSize: 14 }} />}
                    accent="blue"
                />
            </Stack>
        </Box>
    );
};

export default memo(LeadFollowUpCard);