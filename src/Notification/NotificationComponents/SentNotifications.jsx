
import React from "react";

import {
    Box,
    Stack,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
    Avatar,
    IconButton,
    CircularProgress,
    Button,
} from "@mui/material";

import {
    NotificationsActive,
    History,
    DeleteOutline,
    GroupOutlined,
    Schedule,
    Add,
} from "@mui/icons-material";
import NotificationCard from "./NotificationCard";

const SentNotifications = ({
    notifications,
    loading,
    colors,
    formatDate,
    getAudienceLabel,
    handleDeleteNotification,
    setActiveTab,
    handleMarkAsRead
}) => {

    return (
        <Box sx={{ bgcolor: 'transparent' }}>

            {/* <Box
                sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                }}
            >

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >

                    <Box
                        sx={{
                            width: 34,
                            height: 34,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "9px",
                            bgcolor: colors.greenBg,
                            color: colors.primary,
                        }}
                    >
                        <History fontSize="small" />
                    </Box>

                    <Box>

                        <Typography
                            fontSize={15}
                            fontWeight={800}
                            color={colors.text}
                        >
                            Sent Notifications
                        </Typography>

                        <Typography
                            fontSize={11}
                            color={colors.muted}
                        >
                            Manage your previously sent notifications
                        </Typography>

                    </Box>

                </Stack>

                <Chip
                    label={`${notifications.length} Sent`}
                    size="small"
                    sx={{
                        bgcolor: colors.greenBg,
                        color: colors.primary,
                        fontWeight: 800,
                        borderRadius: "7px",
                    }}
                />

            </Box> */}

            {/* <Divider sx={{ borderColor: colors.border }} /> */}

            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>

                {loading ? (

                    <Box
                        display="flex"
                        justifyContent="center"
                        py={6}
                    >
                        <CircularProgress
                            size={28}
                            sx={{ color: colors.primary }}
                        />
                    </Box>

                ) : notifications.length === 0 ? (

                    <Box textAlign="center" py={7}>

                        <Box
                            sx={{
                                width: 65,
                                height: 65,
                                borderRadius: "18px",
                                display: "grid",
                                placeItems: "center",
                                bgcolor: colors.greenBg,
                                color: colors.primary,
                                mx: "auto",
                                mb: 1.5,
                            }}
                        >
                            <NotificationsActive sx={{ fontSize: 32 }} />
                        </Box>

                        <Typography
                            fontWeight={800}
                            fontSize={14}
                            color={colors.text}
                        >
                            No Notifications Sent Yet
                        </Typography>

                        <Typography
                            fontSize={12}
                            color={colors.muted}
                            mt={0.5}
                        >
                            Your sent notifications will appear here
                        </Typography>

                        <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => setActiveTab(0)}
                            sx={{
                                mt: 1.5,
                                color: colors.primary,
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Create Notification
                        </Button>

                    </Box>

                ) : (

                    <Stack spacing={1.5}>

                        {notifications?.map((item) => (

                            <NotificationCard
                                key={item.notification_id}
                                item={item}
                                colors={colors}
                                handleMarkAsRead={handleMarkAsRead}
                                getAudienceLabel={getAudienceLabel}
                                formatDate={formatDate}
                                handleDeleteNotification={handleDeleteNotification}
                            />
                        ))}

                    </Stack>

                )}

            </Box>

        </Box>
    );
};

export default SentNotifications;
