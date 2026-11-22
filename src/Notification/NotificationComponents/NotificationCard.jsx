
import React from "react";

import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Stack,
    Typography,
    Tooltip,
} from "@mui/material";

import {
    NotificationsActive,
    GroupOutlined,
    Schedule,
    DeleteOutline,
    MarkEmailRead,
    DoneAll,
} from "@mui/icons-material";
import { getAuthUser } from "../../constant/Constant";

const NotificationCard = ({
    item,
    colors,
    getAudienceLabel,
    formatDate,
    handleDeleteNotification,
    handleMarkAsRead,
}) => {

    const isRead = Number(item.is_read) === 1;
    const authUser = getAuthUser();
    const { id: userId, role } = authUser ?? {}

    const isAdmin = role?.toLowerCase() === "admin";

    return (
        <Card
            elevation={0}
            sx={{
                position: "relative",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
                borderRadius: "14px",
                bgcolor: colors.paper,
                transition: "all 0.25s ease",

                "&:hover": {
                    borderColor: colors.primary,
                    transform: "translateY(-2px)",
                    boxShadow: `0 5px 18px ${colors.primary}18`,
                },

                "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "3px",
                    bgcolor: isRead ? colors.border : colors.primary,
                },
            }}
        >
            <CardContent
                sx={{
                    p: 2,
                    "&:last-child": { pb: 2 },
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">

                    {/* Notification Icon */}
                    <Avatar
                        variant="rounded"
                        sx={{
                            width: 43,
                            height: 43,
                            borderRadius: "12px",
                            bgcolor: colors.greenBg,
                            color: colors.primary,
                            flexShrink: 0,
                        }}
                    >
                        <NotificationsActive fontSize="small" />
                    </Avatar>

                    {/* Notification Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>

                        {/* Title and Type */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            flexWrap="wrap"
                            spacing={1}
                            useFlexGap
                        >
                            <Typography
                                fontWeight={800}
                                fontSize={13.5}
                                color={colors.text}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {item.title}
                            </Typography>

                            <Chip
                                label={item.notification_type || "GENERAL"}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: 9,
                                    fontWeight: 800,
                                    letterSpacing: 0.3,
                                    bgcolor: colors.orangeBg,
                                    color: colors.secondary,
                                    borderRadius: "6px",
                                }}
                            />

                            {isRead && (
                                <Chip
                                    icon={<DoneAll />}
                                    label="READ"
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: 9,
                                        fontWeight: 800,
                                        bgcolor: colors.greenBg,
                                        color: colors.primary,
                                        "& .MuiChip-icon": {
                                            color: colors.primary,
                                            fontSize: 13,
                                        },
                                    }}
                                />
                            )}
                        </Stack>

                        {/* Message */}
                        <Typography
                            fontSize={12.5}
                            color={colors.muted}
                            sx={{
                                mt: 0.8,
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere",
                                lineHeight: 1.7,
                            }}
                        >
                            {item.message}
                        </Typography>

                        {/* Notification Details */}
                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            spacing={1}
                            useFlexGap
                            alignItems="center"
                            mt={1.5}
                        >
                            <Chip
                                size="small"
                                icon={<GroupOutlined />}
                                label={getAudienceLabel(item)}
                                sx={{
                                    height: 24,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    bgcolor: colors.greenBg,
                                    color: colors.primary,

                                    "& .MuiChip-icon": {
                                        color: colors.primary,
                                        fontSize: 15,
                                    },
                                }}
                            />

                            <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                            >
                                <Schedule
                                    sx={{
                                        fontSize: 13,
                                        color: colors.muted,
                                    }}
                                />

                                <Typography
                                    fontSize={10.5}
                                    color={colors.muted}
                                >
                                    {formatDate(item.created_at)}
                                </Typography>
                            </Stack>
                        </Stack>

                    </Box>

                    {/* Actions */}
                    <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        flexShrink={0}
                    >
                        {!isRead && !isAdmin && (
                            <Tooltip title="Mark as read">
                                <IconButton
                                    size="small"
                                    onClick={() => handleMarkAsRead(item.notification_id,
                                        userId)}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "9px",
                                        color: colors.primary,
                                        border: `1px solid ${colors.border}`,

                                        "&:hover": {
                                            bgcolor: colors.greenBg,
                                            borderColor: colors.primary,
                                        },
                                    }}
                                >
                                    <MarkEmailRead fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}

                        <Tooltip title="Delete notification">
                            <IconButton
                                size="small"
                                onClick={() =>
                                    handleDeleteNotification(
                                        item.notification_id,
                                        userId
                                    )
                                }
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "9px",
                                    color: colors.muted,
                                    border: `1px solid ${colors.border}`,

                                    "&:hover": {
                                        color: colors.danger,
                                        bgcolor: "rgba(211,47,47,0.09)",
                                        borderColor: colors.danger,
                                    },
                                }}
                            >
                                <DeleteOutline fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                </Stack>
            </CardContent>
        </Card>
    );
};

export default NotificationCard;
