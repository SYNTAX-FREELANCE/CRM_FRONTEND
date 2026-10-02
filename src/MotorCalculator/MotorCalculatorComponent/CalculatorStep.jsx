import React from "react";
import {
    Box,
    Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const CalculatorStep = ({
    number,
    title,
    completed,
    active,
    children,
    onClick,
}) => {
    const canGoBack = completed && !active;

    return (
        <Box
            sx={{
                mb: 1,

                border: "1px solid",

                borderColor: active
                    ? "primary.main"
                    : "divider",

                borderRadius: 1.5,

                backgroundColor:
                    "background.paper",

                transition:
                    "all 0.2s ease",
            }}
        >
            {/* STEP HEADER */}

            <Box
                onClick={
                    canGoBack
                        ? onClick
                        : undefined
                }
                sx={{
                    minHeight: 48,

                    px: 1.3,

                    display: "flex",

                    alignItems: "center",

                    gap: 1,

                    cursor: canGoBack
                        ? "pointer"
                        : "default",

                    "&:hover": canGoBack
                        ? {
                              backgroundColor:
                                  "action.hover",
                          }
                        : {},
                }}
            >
                {/* NUMBER / CHECK */}

                <Box
                    sx={{
                        width: 27,
                        height: 27,

                        borderRadius: "50%",

                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        flexShrink: 0,

                        backgroundColor:
                            completed
                                ? "success.main"
                                : active
                                ? "primary.main"
                                : "action.hover",

                        color:
                            completed || active
                                ? "#fff"
                                : "text.secondary",

                        fontSize: 11,

                        fontWeight: 700,
                    }}
                >
                    {completed ? (
                        <CheckCircleRoundedIcon
                            sx={{
                                fontSize: 17,
                            }}
                        />
                    ) : (
                        number
                    )}
                </Box>

                {/* TITLE */}

                <Typography
                    sx={{
                        flex: 1,

                        fontSize: 13,

                        fontWeight:
                            active || completed
                                ? 700
                                : 500,
                    }}
                >
                    {title}
                </Typography>

                {/* STATUS */}

                {completed && (
                    <Typography
                        sx={{
                            fontSize: 10,

                            color:
                                "success.main",

                            fontWeight: 600,
                        }}
                    >
                        {active
                            ? "Editing"
                            : "Completed"}
                    </Typography>
                )}

                {active && !completed && (
                    <Typography
                        sx={{
                            fontSize: 10,

                            color:
                                "primary.main",

                            fontWeight: 600,
                        }}
                    >
                        In Progress
                    </Typography>
                )}
            </Box>

            {/* CONTENT */}

            {active && (
                <Box
                    sx={{
                        px: 1.3,

                        pb: 1.3,

                        pt: 0.5,

                        borderTop: "1px solid",

                        borderColor:
                            "divider",
                    }}
                >
                    {children}
                </Box>
            )}
        </Box>
    );
};

export default CalculatorStep;