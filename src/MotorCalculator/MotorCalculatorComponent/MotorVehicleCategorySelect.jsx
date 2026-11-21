
import React, { memo, useState, useEffect } from "react";
import {
    Box,
    Typography,
    useTheme,
} from "@mui/material";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";

import { useMotorVehicleCategoryMaster } from "../../CommonCode/useQuery";
import { BACKEND_IMAGE } from "../../constant/Static";

const MotorVehicleCategorySelect = ({
    value,
    onChange,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const {
        data: vehicleCategoryMaster = [],
        isLoading,
    } = useMotorVehicleCategoryMaster();

    const [selectedCategory, setSelectedCategory] =
        useState(value || null);

    // Keep selection synchronized with parent value
    useEffect(() => {
        setSelectedCategory(value || null);
    }, [value]);

    const activeVehicleCategoryMaster =
        Array.isArray(vehicleCategoryMaster)
            ? vehicleCategoryMaster.filter(
                item => Number(item.is_active) === 1
            )
            : [];

    // Theme colors
    const pageBackground = isDark
        ? `
            radial-gradient(
                circle at 5% 10%,
                ${theme.palette.primary.main}20,
                transparent 35%
            ),
            radial-gradient(
                circle at 5% 90%,
                rgba(255, 190, 100, 0.07),
                transparent 30%
            ),
            ${theme.palette.background.default}
        `
        : `
            radial-gradient(
                circle at 5% 10%,
                rgba(111, 207, 207, 0.35),
                transparent 32%
            ),
            radial-gradient(
                circle at 5% 90%,
                rgba(255, 218, 140, 0.35),
                transparent 30%
            ),
            #e7f3eb
        `;

    const cardBackground = isDark
        ? theme.palette.background.paper
        : "#ffffff";

    const cardBorder = isDark
        ? theme.palette.divider
        : "rgba(255,255,255,0.9)";

    const primaryText = theme.palette.text.primary;
    const secondaryText = theme.palette.text.secondary;

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
                    bgcolor: "background.default",
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
                    bgcolor: "background.default",
                }}
            >
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
                minHeight: "100vh",
                position: "relative",

                px: {
                    xs: 2,
                    sm: 4,
                    md: 6,
                    lg: 8,
                },

                py: {
                    xs: 3,
                    sm: 3,
                    md: 3,
                },

                overflow: "hidden",

                // background: pageBackground,

                transition: "background 0.3s ease",

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

                    background: isDark
                        ? `${theme.palette.primary.main}09`
                        : "rgba(255,255,255,0.15)",

                    filter: "blur(80px)",
                    pointerEvents: "none",
                },
            }}
        >

            {/* HEADER */}

            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    textAlign: "center",

                    mb: {
                        xs: 3,
                        sm: 3,
                        md: 2.5,
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
                            backgroundColor: isDark
                                ? theme.palette.primary.light
                                : "#ad5a22",
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

                            color: isDark
                                ? theme.palette.primary.light
                                : "#ad5a22",

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
                            backgroundColor: isDark
                                ? theme.palette.primary.light
                                : "#ad5a22",
                            opacity: 0.7,
                        }}
                    />
                </Box>

                {/* MAIN TITLE */}

                <Typography
                    sx={{
                        fontSize: {
                            xs: 25,
                            sm: 30,
                            md: 36,
                        },

                        fontWeight: 800,
                        color: primaryText,
                        lineHeight: 1.15,
                        letterSpacing: "-0.6px",
                        fontFamily: "sans-serif",
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
                            sm: 14,
                            md: 16,
                        },

                        color: secondaryText,
                        lineHeight: 1.5,
                        fontFamily: "sans-serif",
                        fontWeight: 400,
                    }}
                >
                    Choose the vehicle category to start
                    your quotation
                </Typography>
            </Box>


            {/* VEHICLE GALLERY */}

            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,

                    width: "100%",
                    maxWidth: 1024,
                    mx: "auto",

                    display: "grid",

                    gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(3, minmax(0, 1fr))",
                        md: "repeat(4, minmax(0, 1fr))",
                    },

                    columnGap: {
                        xs: 1.5,
                        sm: 1.5,
                        md: 2,
                    },

                    rowGap: {
                        xs: 2,
                        sm: 2,
                        md: 2,
                    },
                }}
            >

                {activeVehicleCategoryMaster?.map(
                    category => {

                        const isSelected =
                            Number(selectedCategory) ===
                            Number(category.vehicle_category_id);

                        const imageUrl =
                            category.image_path
                                ? category.image_path.startsWith("http")
                                    ? category.image_path
                                    : `${BACKEND_IMAGE}${category.image_path}`
                                : null;

                        return (
                            <Box
                                key={category.vehicle_category_id}

                                onClick={() =>
                                    handleSelect(category)
                                }

                                sx={{
                                    position: "relative",

                                    cursor: "pointer",
                                    userSelect: "none",
                                    minWidth: 0,

                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",

                                    minHeight: {
                                        xs: 165,
                                        sm: 180,
                                    },

                                    p: {
                                        xs: 1.5,
                                        sm: 2,
                                    },

                                    borderRadius: "24px",

                                    bgcolor: cardBackground,

                                    border: isSelected
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : `1px solid ${cardBorder}`,

                                    boxShadow: isSelected
                                        ? `0 10px 28px ${theme.palette.primary.main}30`
                                        : isDark
                                            ? "0 5px 18px rgba(0,0,0,0.22)"
                                            : "0 5px 16px rgba(35,65,45,0.07)",

                                    transition: "all 0.3s ease",

                                    "&:hover": {
                                        transform: "translateY(-5px)",

                                        boxShadow: isDark
                                            ? `0 12px 28px ${theme.palette.primary.main}25`
                                            : "0 12px 28px rgba(35,65,45,0.12)",

                                        "& .vehicle-image": {
                                            transform:
                                                "translateY(-4px) scale(1.06)",
                                        },

                                        "& .vehicle-name": {
                                            color: "primary.main",
                                        },

                                        "& .vehicle-type": {
                                            color: "primary.main",
                                        },
                                    },
                                }}
                            >

                                {/* IMAGE AREA */}

                                <Box
                                    sx={{
                                        width: "100%",

                                        height: {
                                            xs: 85,
                                            sm: 95,
                                            md: 100,
                                        },

                                        position: "relative",

                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >

                                    {/* SOFT IMAGE GLOW */}

                                    <Box
                                        className="vehicle-glow"
                                        sx={{
                                            position: "absolute",

                                            left: "50%",
                                            bottom: 5,

                                            transform: "translateX(-50%)",

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

                                            borderRadius: "50%",

                                            background: `radial-gradient(
                                                ellipse,
                                                ${theme.palette.primary.main}28 0%,
                                                ${theme.palette.primary.main}10 42%,
                                                transparent 72%
                                            )`,

                                            filter: "blur(7px)",

                                            opacity: isSelected ? 0.9 : 0,

                                            transition: "all 0.35s ease",

                                            pointerEvents: "none",
                                        }}
                                    />

                                    {/* VEHICLE IMAGE */}

                                    {imageUrl ? (
                                        <Box
                                            component="img"
                                            className="vehicle-image"
                                            src={imageUrl}
                                            alt={category.category_name}
                                            sx={{
                                                position: "relative",
                                                zIndex: 1,

                                                width: "100%",
                                                height: "100%",

                                                objectFit: "contain",
                                                display: "block",

                                                transform: isSelected
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

                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <DirectionsCarRoundedIcon
                                                sx={{
                                                    fontSize: 44,
                                                    color: "text.disabled",
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    mt: 0.5,
                                                    fontSize: 10,
                                                    color: "text.disabled",
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
                                                position: "absolute",

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

                                                borderRadius: "50%",

                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",

                                                backgroundColor: "primary.main",

                                                color: "#fff",

                                                boxShadow: `0 4px 12px ${theme.palette.primary.main}45`,

                                                animation:
                                                    "vehicleSelected 0.25s ease-out",

                                                "@keyframes vehicleSelected": {
                                                    from: {
                                                        opacity: 0,
                                                        transform: "scale(0.6)",
                                                    },

                                                    to: {
                                                        opacity: 1,
                                                        transform: "scale(1)",
                                                    },
                                                },
                                            }}
                                        >
                                            <CheckRoundedIcon
                                                sx={{
                                                    fontSize: {
                                                        xs: 16,
                                                        sm: 18,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}

                                </Box>


                                {/* VEHICLE TYPE */}

                                <Typography
                                    className="vehicle-type"
                                    sx={{
                                        mt: 0.5,

                                        fontSize: {
                                            xs: 9,
                                            sm: 10,
                                        },

                                        fontWeight: 500,

                                        color: isSelected
                                            ? "primary.main"
                                            : secondaryText,

                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        lineHeight: 1.2,

                                        transition: "color 0.25s ease",
                                    }}
                                >
                                    {category.vehicle_type_name}
                                </Typography>


                                {/* CATEGORY NAME */}

                                <Typography
                                    className="vehicle-name"
                                    sx={{
                                        mt: 0.3,

                                        fontSize: {
                                            xs: 12,
                                            sm: 15,
                                            md: 16,
                                        },

                                        fontWeight: 750,

                                        color: isSelected
                                            ? "primary.main"
                                            : primaryText,

                                        lineHeight: 1.25,

                                        transition: "color 0.25s ease",

                                        px: 0.5,
                                    }}
                                >
                                    {category.category_name}
                                </Typography>


                                {/* ACTIVE LINE */}

                                <Box
                                    sx={{
                                        position: "relative",

                                        mt: 1,

                                        width: {
                                            xs: 42,
                                            sm: 48,
                                        },

                                        height: 3,

                                        overflow: "hidden",
                                        borderRadius: 10,

                                        backgroundColor: isSelected
                                            ? "primary.main"
                                            : "transparent",

                                        transition:
                                            "background-color 0.25s ease",

                                        "&::after": isSelected
                                            ? {
                                                content: '""',

                                                position: "absolute",
                                                inset: 0,

                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",

                                                animation:
                                                    "selectionShine 1.8s infinite",

                                                "@keyframes selectionShine": {
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
