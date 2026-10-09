import React, { useState } from "react";
import { Box, Fab, Tooltip } from "@mui/material";

import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const MotorPremiumSidePanel = ({
    onBack,
    onClear,
    onViewPolicy,
}) => {
    const [open, setOpen] = useState(false);

    const actions = [
        {
            label: "Clear",
            icon: <DeleteOutlineRoundedIcon />,
            color: "#ef4444",
            onClick: onClear,
            angle: -180,
        },
        {
            label: "Go Back",
            icon: <ArrowBackRoundedIcon />,
            color: "#64748b",
            onClick: onBack,
            angle: -140,
        },
        {
            label: "Preview",
            icon: <VisibilityRoundedIcon />,
            color: "#2563eb",
            onClick: onViewPolicy,
            angle: -100,
        },
    ];

    const radius = 90;

    return (
        <Box
            sx={{
                position: "fixed",
                right: 24,
                bottom: 24,
                zIndex: 1300,
                width: 58,
                height: 58,
            }}
        >
            {actions.map((action) => {
                const radians = (action.angle * Math.PI) / 180;

                return (
                    <Tooltip
                        key={action.label}
                        title={action.label}
                        placement="left"
                    >
                        <Fab
                            size="medium"
                            onClick={() => {
                                setOpen(false);
                                action.onClick?.();
                            }}
                            sx={{
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                                width: 48,
                                height: 48,
                                minHeight: 48,
                                bgcolor: action.color,
                                color: "#fff",
                                boxShadow: 3,
                                opacity: open ? 1 : 0,
                                pointerEvents: open ? "auto" : "none",
                                transform: open
                                    ? `translate(${Math.cos(radians) * radius}px, ${Math.sin(radians) * radius}px)`
                                    : "translate(0, 0) scale(0.3)",
                                transition:
                                    "transform 300ms ease, opacity 200ms ease",
                                "&:hover": {
                                    bgcolor: action.color,
                                    filter: "brightness(0.9)",
                                },
                            }}
                        >
                            {action.icon}
                        </Fab>
                    </Tooltip>
                );
            })}

            <Fab
                color="primary"
                onClick={() => setOpen((prev) => !prev)}
                sx={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: 58,
                    height: 58,
                    bgcolor: "#2563eb",
                    color: "#fff",
                    boxShadow: 5,
                    zIndex: 2,
                    "&:hover": {
                        bgcolor: "#1d4ed8",
                    },
                }}
            >
                {open ? <CloseRoundedIcon /> : <MoreVertRoundedIcon />}
            </Fab>
        </Box>
    );
};

export default MotorPremiumSidePanel;

