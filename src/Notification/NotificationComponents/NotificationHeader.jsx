
import React from "react";

import {
    Box,
    Stack,
    Typography,
    Button,
} from "@mui/material";

import {
    NotificationsActive,
    Refresh,
} from "@mui/icons-material";

const NotificationHeader = ({
    colors,
    onRefresh,
}) => {

    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            mb={2.5}
        >

            <Stack direction="row" spacing={1.5} alignItems="center">

                <Box
                    sx={{
                        width: 46,
                        height: 46,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "12px",
                        bgcolor: colors.greenBg,
                        color: colors.primary,
                    }}
                >
                    <NotificationsActive />
                </Box>

                <Box>

                    <Typography
                        fontSize={20}
                        fontWeight={800}
                        color={colors.text}
                    >
                        Notification Management
                    </Typography>

                    <Typography
                        fontSize={11.5}
                        color={colors.muted}
                    >
                        Create, send and manage employee notifications
                    </Typography>

                </Box>

            </Stack>

            <Button
                variant="outlined"
                size="small"
                startIcon={<Refresh />}
                onClick={onRefresh}
                sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    borderColor: colors.border,
                    color: colors.primary,
                    fontWeight: 700,

                    "&:hover": {
                        bgcolor: colors.greenBg,
                        borderColor: colors.primary,
                    },
                }}
            >
                Refresh
            </Button>

        </Stack>
    );
};

export default NotificationHeader;
