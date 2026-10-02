
import React, { memo, useMemo, useState } from "react";
import {
    Box,
    Chip,
    IconButton,
    Typography,
    Tooltip,
    useTheme,
} from "@mui/material";

import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import MotorQuotePreview from "./MotorCalculatorComponent/MotorQuotePreview";
import CalculatorStep from "./MotorCalculatorComponent/CalculatorStep";
import VehicleSelection from "./MotorCalculatorComponent/VehicleSelection";
import InsuranceDetails from "./MotorCalculatorComponent/InsuranceDetails";

const MotorCalculatorContainer = () => {
    const theme = useTheme();

    const isDark = theme.palette.mode === "dark";

    const colors = useMemo(
        () => ({
            background: isDark ? "#0f172a" : "#f5f7fb",
            surface: isDark ? "#1e293b" : "#ffffff",
            border: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(15,23,42,0.08)",
            text: isDark ? "#f8fafc" : "#172033",
            secondaryText: isDark
                ? "#94a3b8"
                : "#64748b",
            primary: theme.palette.primary.main,
        }),
        [isDark, theme.palette.primary.main]
    );

    // ============================================================
    // CALCULATOR DATA
    // ============================================================

    const [calculatorData, setCalculatorData] = useState({
        customer: null,
        vehicle: null,
        insurance: null,
        policy: null,
        vehicleDetails: null,
        coverage: null,
    });

    // ============================================================
    // ACTIVE STEP
    // ============================================================

    const [activeStep, setActiveStep] = useState("vehicle");

    // ============================================================
    // VEHICLE / CUSTOMER CHANGE
    // ============================================================

    const handleVehicleChange = (data) => {
        setCalculatorData((prev) => ({
            ...prev,
            customer: data?.customer || null,
            vehicle: data?.vehicles?.[0] || null,
        }));
    };

    // ============================================================
    // CONFIRM VEHICLE
    // ============================================================

    const handleVehicleConfirm = () => {
        if (
            !calculatorData.customer ||
            !calculatorData.vehicle
        ) {
            return;
        }

        setActiveStep("insurance");
    };

    // ============================================================
    // CONFIRM INSURANCE
    // ============================================================

    const handleInsuranceConfirm = () => {
        if (!calculatorData.insurance) {
            return;
        }

        setActiveStep("policy");
    };

    // ============================================================
    // RESET
    // ============================================================

    const handleReset = () => {
        setCalculatorData({
            customer: null,
            vehicle: null,
            insurance: null,
            policy: null,
            vehicleDetails: null,
            coverage: null,
        });

        setActiveStep("vehicle");
    };

    // ============================================================
    // COMPLETED SECTIONS
    // ============================================================

    const completedSections = useMemo(
        () => ({
            vehicle:
                Boolean(calculatorData.customer) &&
                Boolean(calculatorData.vehicle),

            insurance: Boolean(
                calculatorData.insurance
            ),

            policy: Boolean(
                calculatorData.policy
            ),

            vehicleDetails: Boolean(
                calculatorData.vehicleDetails
            ),

            coverage: Boolean(
                calculatorData.coverage
            ),
        }),
        [calculatorData]
    );

    // ============================================================
    // COMPLETED COUNT
    // ============================================================

    const completedCount = Object.values(
        completedSections
    ).filter(Boolean).length;

    const totalSections = Object.keys(
        completedSections
    ).length;

    return (
        <Box
            sx={{
                height: "100%",
                minHeight: "90vh",
                backgroundColor: colors.background,
                color: colors.text,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* =====================================================
                HEADER
            ===================================================== */}

            <Box
                sx={{
                    minHeight: {
                        xs: 58,
                        sm: 64,
                    },

                    px: {
                        xs: 1.5,
                        sm: 2,
                        md: 2.5,
                    },

                    py: 0.8,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    backgroundColor: colors.surface,

                    borderBottom: `1px solid ${colors.border}`,
                }}
            >
                {/* LEFT */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        minWidth: 0,
                    }}
                >
                    <Box
                        sx={{
                            width: {
                                xs: 36,
                                sm: 40,
                            },

                            height: {
                                xs: 36,
                                sm: 40,
                            },

                            flexShrink: 0,

                            borderRadius: 2,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            background: `linear-gradient(
                                135deg,
                                ${colors.primary},
                                #7c3aed
                            )`,

                            color: "#fff",

                            boxShadow: `0 5px 15px ${colors.primary}35`,
                        }}
                    >
                        <CalculateRoundedIcon
                            sx={{
                                fontSize: 21,
                            }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: 14,
                                    sm: 17,
                                },

                                fontWeight: 800,

                                lineHeight: 1.2,

                                whiteSpace: "nowrap",

                                overflow: "hidden",

                                textOverflow: "ellipsis",
                            }}
                        >
                            Motor Insurance Calculator
                        </Typography>

                        <Typography
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "block",
                                },

                                fontSize: 10,

                                color:
                                    colors.secondaryText,

                                mt: 0.3,
                            }}
                        >
                            Create and calculate motor
                            insurance quotation
                        </Typography>
                    </Box>
                </Box>

                {/* RIGHT */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                    }}
                >
                    <Chip
                        icon={
                            <CheckCircleRoundedIcon
                                sx={{
                                    fontSize:
                                        "15px !important",
                                    color:
                                        "#16a34a !important",
                                }}
                            />
                        }
                        label={`${completedCount}/${totalSections}`}
                        size="small"
                        sx={{
                            display: {
                                xs: "none",
                                sm: "flex",
                            },

                            height: 25,

                            fontSize: 10,

                            fontWeight: 600,

                            backgroundColor: isDark
                                ? "#14351f"
                                : "#f0fdf4",

                            border: "1px solid",

                            borderColor: isDark
                                ? "#1f6b36"
                                : "#bbf7d0",
                        }}
                    />

                    <Tooltip title="Reset Calculator">
                        <IconButton
                            size="small"
                            onClick={handleReset}
                            sx={{
                                color:
                                    colors.secondaryText,
                            }}
                        >
                            <RestartAltRoundedIcon
                                fontSize="small"
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* =====================================================
                WORKSPACE
            ===================================================== */}

            <Box
                sx={{
                    flex: 1,

                    minHeight: 200,

                    display: "flex",

                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },

                    gap: {
                        xs: 1,
                        sm: 1.5,
                    },

                    p: {
                        xs: 1,
                        sm: 1.5,
                        md: 2,
                    },
                }}
            >
                {/* =================================================
                    70% WORK AREA
                ================================================= */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            md: "70%",
                        },

                        minWidth: 0,

                        overflowY: {
                            xs: "visible",
                            md: "auto",
                        },

                        scrollbarWidth: "none",

                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >
                    {/* STEP 1 */}

                    <CalculatorStep
                        number={1}
                        title="Customer & Vehicle"
                        completed={
                            completedSections.vehicle
                        }
                        active={
                            activeStep === "vehicle"
                        }
                    >
                        <VehicleSelection
                            value={calculatorData}
                            onChange={
                                handleVehicleChange
                            }
                            onConfirm={
                                handleVehicleConfirm
                            }
                        />
                    </CalculatorStep>

                    {/* STEP 2 */}

                    <CalculatorStep
                        number={2}
                        title="Insurance Company"
                        completed={
                            completedSections.insurance
                        }
                        active={
                            activeStep === "insurance"
                        }
                    >
                        <InsuranceDetails
                            value={
                                calculatorData.insurance
                            }
                            onChange={(value) =>
                                setCalculatorData(
                                    (prev) => ({
                                        ...prev,
                                        insurance: value,
                                    })
                                )
                            }
                            onConfirm={
                                handleInsuranceConfirm
                            }
                        />
                    </CalculatorStep>

                    {/* STEP 3 */}

                    <CalculatorStep
                        number={3}
                        title="Policy Details"
                        completed={
                            completedSections.policy
                        }
                        active={
                            activeStep === "policy"
                        }
                    >
                        <Box sx={{ py: 2 }}>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "text.secondary",
                                }}
                            >
                                Policy Details
                                component will come
                                here.
                            </Typography>
                        </Box>
                    </CalculatorStep>

                    {/* STEP 4 */}

                    <CalculatorStep
                        number={4}
                        title="Vehicle Details"
                        completed={
                            completedSections.vehicleDetails
                        }
                        active={
                            activeStep ===
                            "vehicleDetails"
                        }
                    >
                        <Box sx={{ py: 2 }}>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "text.secondary",
                                }}
                            >
                                Vehicle Details
                                component will come
                                here.
                            </Typography>
                        </Box>
                    </CalculatorStep>

                    {/* STEP 5 */}

                    <CalculatorStep
                        number={5}
                        title="Coverage"
                        completed={
                            completedSections.coverage
                        }
                        active={
                            activeStep === "coverage"
                        }
                    >
                        <Box sx={{ py: 2 }}>
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: "text.secondary",
                                }}
                            >
                                Coverage component
                                will come here.
                            </Typography>
                        </Box>
                    </CalculatorStep>
                </Box>

                {/* =================================================
                    30% LIVE PREVIEW
                ================================================= */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            md: "30%",
                        },

                        minWidth: 0,

                        position: {
                            md: "sticky",
                        },

                        top: {
                            md: 16,
                        },

                        alignSelf: {
                            md: "flex-start",
                        },
                    }}
                >
                    <MotorQuotePreview
                        data={calculatorData}
                        completed={
                            completedSections
                        }
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default memo(
    MotorCalculatorContainer
);
