
import React, { memo } from "react";
import {
    Box,
    Chip,
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

    const colors = {
        background: isDark ? "#1c2620" : "#ffffff",
        border: isDark ? "#344239" : "#e5ebe7",
        text: isDark ? "#e8f0ea" : "#26352b",
        muted: isDark ? "#9ba99f" : "#718078",
        primary: "#21834b",
        chipBg: isDark
            ? "rgba(33,131,75,0.18)"
            : "#edf7f0",
        hoverBorder: isDark ? "#397c53" : "#b8d9c2",
    };

    return (
        <Box
            sx={{
                p: { xs: 1.75, sm: 2 },
                borderRadius: "16px",
                background: colors.background,
                border: `1px solid ${colors.border}`,
                transition: "all 0.2s ease",
                "&:hover": {
                    boxShadow: isDark
                        ? "0 4px 14px rgba(0,0,0,0.2)"
                        : "0 4px 14px rgba(15,23,42,0.05)",
                    borderColor: colors.hoverBorder,
                },
            }}
        >
            {/* Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <Box
                        sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "9px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: colors.chipBg,
                        }}
                    >
                        <EventNoteIcon
                            sx={{
                                fontSize: 17,
                                color: colors.primary,
                            }}
                        />
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: colors.text,
                        }}
                    >
                        Follow-up Details
                    </Typography>
                </Stack>

                <Chip
                    size="small"
                    label={item.status_name}
                    sx={{
                        height: 25,
                        borderRadius: "7px",
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: colors.primary,
                        bgcolor: colors.chipBg,
                        border: `1px solid ${colors.hoverBorder}`,
                        "& .MuiChip-label": {
                            px: 1.1,
                        },
                    }}
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
                    value={
                        item.next_followup_date
                            ? new Date(item?.next_followup_date).toLocaleString()
                            : "-"
                    }
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
