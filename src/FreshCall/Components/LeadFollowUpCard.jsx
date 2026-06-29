import React, { memo } from "react";
import {
    Box,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CommentIcon from "@mui/icons-material/Comment";
import Row from "./Row";

const LeadFollowUpCard = ({ item, index }) => {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                transition: "all .2s ease",
                "&:hover": {
                    boxShadow: 2,
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
                {/* Next Follow-up */}
                {/* <Stack direction="row" spacing={1} alignItems="center">
                    <EventNoteIcon fontSize="small" color="warning" />
                    <Typography variant="body2">
                        <strong>Next Follow Up:</strong>{" "}
                        {item.next_followup_date
                            ? new Date(item.next_followup_date).toLocaleDateString()
                            : "-"}
                    </Typography>
                </Stack> */}
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