
import React from "react";

import {
    Paper,
    Tabs,
    Tab,
    Button,
    Box,
} from "@mui/material";

import {
    Add,
    History,
    DoneAll,
} from "@mui/icons-material";

const NotificationTabs = ({
    activeTab,
    setActiveTab,
    colors,
    isAdmin,
    markall,
}) => {

    return (
        <Paper
            elevation={0}
            sx={{
                border: `1px solid ${colors.border}`,
                borderRadius: "11px",
                bgcolor: colors.paper,
                mb: 2.5,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Tabs
                value={isAdmin ? activeTab : 0}
                onChange={(event, newValue) => {
                    setActiveTab(isAdmin ? newValue : 1);
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    minHeight: 48,
                    px: 1,
                    flex: 1,
                    minWidth: 0,

                    "& .MuiTabs-indicator": {
                        height: 3,
                        borderRadius: "5px 5px 0 0",
                        bgcolor: colors.primary,
                    },

                    "& .MuiTab-root": {
                        minHeight: 48,
                        minWidth: 130,
                        textTransform: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        color: colors.muted,
                    },

                    "& .Mui-selected": {
                        color: `${colors.primary} !important`,
                    },
                }}
            >
                {isAdmin && (
                    <Tab
                        icon={<Add sx={{ fontSize: 18 }} />}
                        iconPosition="start"
                        label="Create Notification"
                    />
                )}

                <Tab
                    icon={<History sx={{ fontSize: 18 }} />}
                    iconPosition="start"
                    label={isAdmin ? "Sent Notifications" : "Received Notifications"}
                />
            </Tabs>

            {!isAdmin && activeTab === 1 && (
                <Box sx={{ px: 1, flexShrink: 0 }}>
                    <Button
                        size="small"
                        startIcon={<DoneAll />}
                        onClick={markall}
                        sx={{
                            textTransform: "none",
                            fontSize: 11,
                            fontWeight: 800,
                            whiteSpace: "nowrap",
                            color: colors.primary,
                            borderRadius: "8px",
                            "&:hover": {
                                bgcolor: colors.greenBg,
                            },
                        }}
                    >
                        Mark All Read
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default NotificationTabs;
