import React from "react";
import { Box, Typography, useTheme } from "@mui/material";


/* =====================================================
   CALCULATION STEP
===================================================== */

export const CalculationStep = ({
    number,
    title,
    description,
    formula,
    formulaResult,
    amount,
    amountColor,
    children,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                mb: 1,
                p: 1.3,

                border: `1px solid ${
                    isDark ? "#334155" : "#e2e8f0"
                }`,

                borderRadius: 1.8,

                backgroundColor: isDark
                    ? "#1e293b"
                    : "#fff",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: 26,
                            height: 26,
                            flexShrink: 0,

                            borderRadius: 1,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: isDark
                                ? "#334155"
                                : "#f1f5f9",

                            color: isDark
                                ? "#cbd5e1"
                                : "#64748b",

                            fontSize: "10px",
                            fontWeight: 800,
                        }}
                    >
                        {number}
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontWeight: 700,

                                color: isDark
                                    ? "#f1f5f9"
                                    : "#334155",
                            }}
                        >
                            {title}
                        </Typography>

                        {description && (
                            <Typography
                                sx={{
                                    mt: 0.2,
                                    fontSize: "10px",

                                    color: isDark
                                        ? "#94a3b8"
                                        : "#94a3b8",
                                }}
                            >
                                {description}
                            </Typography>
                        )}

                        {formula && (
                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: "11px",
                                    fontWeight: 600,

                                    color: isDark
                                        ? "#cbd5e1"
                                        : "#64748b",
                                }}
                            >
                                {formula}
                            </Typography>
                        )}

                        {formulaResult && (
                            <Typography
                                sx={{
                                    mt: 0.1,
                                    fontSize: "10px",

                                    color: isDark
                                        ? "#94a3b8"
                                        : "#94a3b8",
                                }}
                            >
                                {formulaResult}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {amount !== undefined &&
                    amount !== null &&
                    amount !== "" && (
                        <Typography
                            sx={{
                                flexShrink: 0,
                                fontSize: "14px",
                                fontWeight: 800,

                                color:
                                    amountColor ||
                                    (isDark
                                        ? "#f8fafc"
                                        : "#334155"),

                                textAlign: "right",
                            }}
                        >
                            {amount}
                        </Typography>
                    )}
            </Box>

            {children && (
                <Box
                    sx={{
                        mt: 1,
                        pt: 0.8,

                        borderTop: `1px dashed ${
                            isDark
                                ? "#475569"
                                : "#e2e8f0"
                        }`,
                    }}
                >
                    {children}
                </Box>
            )}
        </Box>
    );
};


/* =====================================================
   CALCULATION LINE
===================================================== */

export const CalculationLine = ({
    label,
    formula,
    amount,
    pending = false,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                py: 0.65,

                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",

                gap: 2,
            }}
        >
            <Box
                sx={{
                    minWidth: 0,
                    flex: 1,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "11px",
                        fontWeight: 600,

                        color: isDark
                            ? "#cbd5e1"
                            : "#475569",
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    sx={{
                        mt: 0.2,
                        fontSize: "10px",

                        color: pending
                            ? "#f59e0b"
                            : isDark
                                ? "#94a3b8"
                                : "#94a3b8",
                    }}
                >
                    {formula}
                </Typography>
            </Box>

            <Typography
                sx={{
                    flexShrink: 0,

                    fontSize: "11px",
                    fontWeight: 700,

                    color: pending
                        ? "#f59e0b"
                        : isDark
                            ? "#e2e8f0"
                            : "#475569",
                }}
            >
                {amount}
            </Typography>
        </Box>
    );
};


/* =====================================================
   INFORMATION LINE
===================================================== */

export const CalculationInfoLine = ({
    label,
    value,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                py: 0.55,

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                gap: 2,
            }}
        >
            <Typography
                sx={{
                    fontSize: "10px",

                    color: isDark
                        ? "#94a3b8"
                        : "#94a3b8",
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: "10px",
                    fontWeight: 600,

                    color: isDark
                        ? "#cbd5e1"
                        : "#64748b",

                    textAlign: "right",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};