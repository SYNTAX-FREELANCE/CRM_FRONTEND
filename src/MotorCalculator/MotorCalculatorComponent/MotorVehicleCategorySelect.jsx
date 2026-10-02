
import React, { memo, useState } from "react";
import {
    Box,
    Typography,
    useTheme,
} from "@mui/material";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";

import { useMotorVehicleCategoryMaster } from "../../CommonCode/useQuery";

const BACKEND_IMAGE = "http://localhost:7000";

const MotorVehicleCategorySelect = ({
    value,
    onChange,
}) => {
    const theme = useTheme();

    const {
        data: vehicleCategoryMaster = [],
        isLoading,
    } = useMotorVehicleCategoryMaster();

    const [selectedCategory, setSelectedCategory] =
        useState(value || null);

    const activeVehicleCategoryMaster =
        Array.isArray(vehicleCategoryMaster)
            ? vehicleCategoryMaster.filter(
                item => Number(item.is_active) === 1
            )
            : [];

    const handleSelect = category => {
        setSelectedCategory(
            category.vehicle_category_id
        );

        if (onChange) {
            onChange(category);
        }
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography
                    sx={{
                        fontSize: 13,
                        color: "text.secondary",
                    }}
                >
                    Loading vehicle categories...
                </Typography>
            </Box>
        );
    }

    if (!activeVehicleCategoryMaster.length) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <DirectionsCarRoundedIcon
                    sx={{
                        fontSize: 42,
                        color: "text.disabled",
                        mb: 1,
                    }}
                />

                <Typography
                    sx={{
                        fontSize: 13,
                        color: "text.secondary",
                    }}
                >
                    No vehicle categories available
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",

                px: {
                    xs: 2,
                    sm: 4,
                    md: 6,
                    lg: 8,
                },

                pt: {
                    xs: 3,
                    sm: 4,
                    md: 5,
                },

                pb: {
                    xs: 4,
                    sm: 5,
                    md: 6,
                },

                overflow: "hidden",

                /* Very subtle background */
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -180,
                    left: "50%",
                    transform: "translateX(-50%)",

                    width: {
                        xs: 350,
                        sm: 500,
                        md: 650,
                    },

                    height: {
                        xs: 350,
                        sm: 500,
                        md: 650,
                    },

                    borderRadius: "50%",

                    background: theme =>
                        theme.palette.mode === "dark"
                            ? `radial-gradient(
                                circle,
                                ${theme.palette.primary.main}08 0%,
                                transparent 68%
                              )`
                            : `radial-gradient(
                                circle,
                                ${theme.palette.primary.main}06 0%,
                                transparent 68%
                              )`,

                    pointerEvents: "none",
                },
            }}
        >
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,

                    textAlign: "center",

                    mb: {
                        xs: 4,
                        sm: 5,
                        md: 6,
                    },
                }}
            >
                {/* SMALL TOP LABEL */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        mb: 1.2,
                    }}
                >
                    <Box
                        sx={{
                            width: 24,
                            height: 1.5,
                            backgroundColor:
                                "primary.main",
                            opacity: 0.7,
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 9,
                                sm: 10,
                            },

                            fontWeight: 700,

                            color: "primary.main",

                            letterSpacing: "1.5px",

                            textTransform: "uppercase",
                        }}
                    >
                        Motor Insurance
                    </Typography>

                    <Box
                        sx={{
                            width: 24,
                            height: 1.5,
                            backgroundColor:
                                "primary.main",
                            opacity: 0.7,
                        }}
                    />
                </Box>

                {/* MAIN TITLE */}
                <Typography
                    sx={{
                        fontSize: {
                            xs: 22,
                            sm: 26,
                            md: 30,
                        },

                        fontWeight: 800,

                        color: "text.primary",

                        lineHeight: 1.15,

                        letterSpacing: "-0.6px",
                    }}
                >
                    Select Your Vehicle
                </Typography>

                {/* SUBTITLE */}
                <Typography
                    sx={{
                        mt: 1,

                        fontSize: {
                            xs: 12,
                            sm: 13,
                            md: 14,
                        },

                        color: "text.secondary",

                        lineHeight: 1.5,
                    }}
                >
                    Choose the vehicle category to start
                    your quotation
                </Typography>
            </Box>

            {/* ================================================= */}
            {/* VEHICLE GALLERY */}
            {/* ================================================= */}

            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,

                    width: "100%",
                    maxWidth: 1120,
                    mx: "auto",

                    display: "grid",

                    gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(3, minmax(0, 1fr))",
                        md: "repeat(4, minmax(0, 1fr))",
                    },

                    columnGap: {
                        xs: 2,
                        sm: 4,
                        md: 6,
                    },

                    rowGap: {
                        xs: 5,
                        sm: 6,
                        md: 7,
                    },
                }}
            >
                {activeVehicleCategoryMaster.map(
                    category => {
                        const isSelected =
                            Number(selectedCategory) ===
                            Number(
                                category.vehicle_category_id
                            );

                        const imageUrl =
                            category.image_path
                                ? category.image_path.startsWith(
                                    "http"
                                )
                                    ? category.image_path
                                    : `${BACKEND_IMAGE}${category.image_path}`
                                : null;

                        return (
                            <Box
                                key={
                                    category.vehicle_category_id
                                }
                                onClick={() =>
                                    handleSelect(category)
                                }
                                sx={{
                                    position: "relative",

                                    cursor: "pointer",

                                    userSelect: "none",

                                    minWidth: 0,

                                    display: "flex",

                                    flexDirection:
                                        "column",

                                    alignItems: "center",

                                    textAlign: "center",

                                    /* -------------------------------- */
                                    /* HOVER */
                                    /* -------------------------------- */

                                    "&:hover": {
                                        "& .vehicle-image": {
                                            transform:
                                                "translateY(-7px) scale(1.055)",
                                        },

                                        "& .vehicle-glow": {
                                            opacity: 0.85,
                                            transform:
                                                "translateX(-50%) scale(1.15)",
                                        },

                                        "& .vehicle-name": {
                                            color:
                                                "primary.main",
                                        },

                                        "& .vehicle-type": {
                                            color:
                                                "primary.main",
                                        },
                                    },
                                }}
                            >
                                {/* ================================= */}
                                {/* IMAGE AREA */}
                                {/* ================================= */}

                                <Box
                                    sx={{
                                        width: "100%",

                                        height: {
                                            xs: 125,
                                            sm: 155,
                                            md: 175,
                                        },

                                        position: "relative",

                                        display: "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",
                                    }}
                                >
                                    {/* SOFT IMAGE GLOW */}
                                    <Box
                                        className="vehicle-glow"
                                        sx={{
                                            position:
                                                "absolute",

                                            left: "50%",

                                            bottom: {
                                                xs: 15,
                                                sm: 17,
                                            },

                                            transform:
                                                "translateX(-50%)",

                                            width: {
                                                xs: 95,
                                                sm: 120,
                                                md: 140,
                                            },

                                            height: {
                                                xs: 28,
                                                sm: 34,
                                                md: 38,
                                            },

                                            borderRadius:
                                                "50%",

                                            background:
                                                theme =>
                                                    `radial-gradient(
                                                        ellipse,
                                                        ${theme.palette.primary.main}28 0%,
                                                        ${theme.palette.primary.main}10 42%,
                                                        transparent 72%
                                                    )`,

                                            filter:
                                                "blur(7px)",

                                            opacity:
                                                isSelected
                                                    ? 0.9
                                                    : 0,

                                            transition:
                                                "all 0.35s ease",

                                            pointerEvents:
                                                "none",
                                        }}
                                    />

                                    {/* VEHICLE IMAGE */}
                                    {imageUrl ? (
                                        <Box
                                            component="img"
                                            className="vehicle-image"
                                            src={imageUrl}
                                            alt={
                                                category.category_name
                                            }
                                            sx={{
                                                position:
                                                    "relative",

                                                zIndex: 1,

                                                width: "100%",

                                                height: "100%",

                                                objectFit:
                                                    "contain",

                                                display:
                                                    "block",

                                                transform:
                                                    isSelected
                                                        ? "translateY(-5px) scale(1.04)"
                                                        : "translateY(0) scale(1)",

                                                transition:
                                                    "transform 0.35s cubic-bezier(0.2, 0.7, 0.3, 1)",
                                            }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                height: "100%",

                                                display:
                                                    "flex",

                                                flexDirection:
                                                    "column",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",
                                            }}
                                        >
                                            <DirectionsCarRoundedIcon
                                                sx={{
                                                    fontSize: 44,

                                                    color:
                                                        "text.disabled",
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    mt: 0.5,

                                                    fontSize: 10,

                                                    color:
                                                        "text.disabled",
                                                }}
                                            >
                                                No Image
                                            </Typography>
                                        </Box>
                                    )}

                                    {/* SELECTED CHECK */}
                                    {isSelected && (
                                        <Box
                                            sx={{
                                                position:
                                                    "absolute",

                                                top: {
                                                    xs: 2,
                                                    sm: 4,
                                                },

                                                right: {
                                                    xs: 2,
                                                    sm: 8,
                                                },

                                                zIndex: 3,

                                                width: {
                                                    xs: 24,
                                                    sm: 27,
                                                },

                                                height: {
                                                    xs: 24,
                                                    sm: 27,
                                                },

                                                borderRadius:
                                                    "50%",

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",

                                                backgroundColor:
                                                    "primary.main",

                                                color: "#fff",

                                                boxShadow:
                                                    theme =>
                                                        `0 4px 12px ${theme.palette.primary.main}45`,

                                                animation:
                                                    "vehicleSelected 0.25s ease-out",

                                                "@keyframes vehicleSelected":
                                                {
                                                    from: {
                                                        opacity: 0,
                                                        transform:
                                                            "scale(0.6)",
                                                    },

                                                    to: {
                                                        opacity: 1,
                                                        transform:
                                                            "scale(1)",
                                                    },
                                                },
                                            }}
                                        >
                                            <CheckRoundedIcon
                                                sx={{
                                                    fontSize:
                                                    {
                                                        xs: 16,
                                                        sm: 18,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {/* ================================= */}
                                {/* VEHICLE TYPE */}
                                {/* ================================= */}

                                <Typography
                                    className="vehicle-type"
                                    sx={{
                                        mt: 1,

                                        fontSize: {
                                            xs: 8.5,
                                            sm: 9.5,
                                            md: 10,
                                        },

                                        fontWeight: 700,

                                        color: isSelected
                                            ? "primary.main"
                                            : "text.secondary",

                                        textTransform:
                                            "uppercase",

                                        letterSpacing:
                                            "1px",

                                        lineHeight: 1.2,

                                        transition:
                                            "color 0.25s ease",
                                    }}
                                >
                                    {
                                        category.vehicle_type_name
                                    }
                                </Typography>

                                {/* ================================= */}
                                {/* CATEGORY NAME */}
                                {/* ================================= */}

                                <Typography
                                    className="vehicle-name"
                                    sx={{
                                        mt: 0.5,

                                        fontSize: {
                                            xs: 13,
                                            sm: 15,
                                            md: 16,
                                        },

                                        fontWeight: 750,

                                        color: isSelected
                                            ? "primary.main"
                                            : "text.primary",

                                        lineHeight: 1.25,

                                        transition:
                                            "color 0.25s ease",

                                        px: 0.5,
                                    }}
                                >
                                    {
                                        category.category_name
                                    }
                                </Typography>

                                {/* ================================= */}
                                {/* ACTIVE LINE */}
                                {/* ================================= */}

                                <Box
                                    sx={{
                                        position:
                                            "relative",

                                        mt: 1.1,

                                        width: {
                                            xs: 42,
                                            sm: 48,
                                        },

                                        height: 3,

                                        overflow:
                                            "hidden",

                                        borderRadius:
                                            10,

                                        backgroundColor:
                                            isSelected
                                                ? "primary.main"
                                                : "transparent",

                                        transition:
                                            "background-color 0.25s ease",

                                        "&::after":
                                            isSelected
                                                ? {
                                                    content:
                                                        '""',

                                                    position:
                                                        "absolute",

                                                    inset: 0,

                                                    background:
                                                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",

                                                    animation:
                                                        "selectionShine 1.8s infinite",

                                                    "@keyframes selectionShine":
                                                    {
                                                        from: {
                                                            transform:
                                                                "translateX(-100%)",
                                                        },

                                                        to: {
                                                            transform:
                                                                "translateX(100%)",
                                                        },
                                                    },
                                                }
                                                : {},
                                    }}
                                />
                            </Box>
                        );
                    }
                )}
            </Box>
        </Box>
    );
};

export default memo(
    MotorVehicleCategorySelect
);
