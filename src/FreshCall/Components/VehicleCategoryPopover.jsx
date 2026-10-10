import React from "react";
import {
    Box,
    Popover,
    Typography,
    IconButton,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import { BACKEND_IMAGE } from "../../constant/Static";

const VehicleCategoryPopover = ({
    anchorEl,
    open,
    onClose,
    categories = [],
    onSelectCategory,
}) => {
    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            slotProps={{
                paper: {
                    sx: {
                        mt: 1.2,
                        width: { xs: 320, sm: 420 },
                        maxWidth: "calc(100vw - 20px)",
                        maxHeight: "none",
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "0 16px 45px rgba(15, 23, 42, 0.14)",
                        overflow: "hidden",
                        backgroundImage: "none",
                    },
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    py: 1.8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: (theme) =>
                        theme.palette.mode === "dark"
                            ? "linear-gradient(110deg, #202b40 0%, #182235 100%)"
                            : "linear-gradient(110deg, #f0f5ff 0%, #ffffff 100%)",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
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
                            width: 39,
                            height: 39,
                            flexShrink: 0,
                            borderRadius: 2.2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "primary.main",
                            color: "#fff",
                            boxShadow: "0 4px 10px rgba(25, 118, 210, 0.22)",
                        }}
                    >
                        <DirectionsCarOutlinedIcon sx={{ fontSize: 23 }} />
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 800,
                                lineHeight: 1.4,
                                color: "text.primary",
                            }}
                        >
                            Choose Vehicle
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "text.secondary",
                                mt: 0.2,
                            }}
                        >
                            Select a category to calculate premium
                        </Typography>
                    </Box>
                </Box>

                <IconButton
                    size="small"
                    onClick={onClose}
                    aria-label="Close vehicle categories"
                    sx={{
                        ml: 1,
                        borderRadius: 2,
                        color: "text.secondary",
                        "&:hover": {
                            bgcolor: "action.hover",
                            color: "text.primary",
                        },
                    }}
                >
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Category Grid */}
            <Box
                sx={{
                    p: 1.5,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 1.2,
                }}
            >
                {categories.map((category, index) => (
                    <Box
                        key={category.vehicle_category_id}
                        component="button"
                        type="button"
                        onClick={() => onSelectCategory?.(category)}
                        sx={{
                            minWidth: 0,
                            minHeight: 132,
                            p: 1.2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "stretch",
                            textAlign: "left",
                            position: "relative",
                            overflow: "hidden",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2.5,
                            bgcolor: "background.paper",
                            cursor: "pointer",
                            transition:
                                "border-color 180ms ease, background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",

                            "&:hover": {
                                borderColor: "primary.main",
                                bgcolor: "action.hover",
                                transform: "translateY(-3px)",
                                boxShadow: (theme) =>
                                    `0 7px 18px ${theme.palette.mode === "dark"
                                        ? "rgba(0,0,0,0.22)"
                                        : "rgba(30, 64, 175, 0.10)"
                                    }`,
                            },

                            "&:hover .vehicle-image": {
                                transform: "scale(1.07)",
                            },

                            "&:hover .vehicle-arrow": {
                                color: "primary.main",
                                transform: "translateX(2px)",
                            },

                            "&:focus-visible": {
                                outline: "2px solid",
                                outlineColor: "primary.main",
                                outlineOffset: 2,
                            },
                        }}
                    >
                        {/* Vehicle image area */}
                        <Box
                            sx={{
                                height: 69,
                                width: "100%",
                                mb: 1,
                                borderRadius: 1.8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                        ? "rgba(255,255,255,0.045)"
                                        : index % 2 === 0
                                            ? "#f2f6ff"
                                            : "#f5f7fa",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                component="img"
                                className="vehicle-image"
                                src={
                                    category.image_path?.startsWith("http")
                                        ? category.image_path
                                        : `${BACKEND_IMAGE}${category.image_path || ""}`
                                }
                                alt={category.category_name}
                                loading="lazy"
                                onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                }}
                                sx={{
                                    width: "90%",
                                    height: 59,
                                    objectFit: "contain",
                                    transition: "transform 180ms ease",
                                }}
                            />
                        </Box>

                        {/* Category name */}
                        <Typography
                            sx={{
                                fontSize: 11.5,
                                fontWeight: 750,
                                lineHeight: 1.4,
                                color: "text.primary",
                                mb: 0.8,
                                overflowWrap: "anywhere",
                            }}
                        >
                            {category.category_name}
                        </Typography>

                        {/* Vehicle type */}
                        <Box
                            sx={{
                                mt: "auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 0.5,
                            }}
                        >
                            <Box
                                sx={{
                                    px: 0.8,
                                    py: 0.35,
                                    borderRadius: 1,
                                    bgcolor: "action.selected",
                                    maxWidth: "calc(100% - 20px)",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 9.5,
                                        fontWeight: 700,
                                        color: "text.secondary",
                                        lineHeight: 1.4,
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {category.vehicle_type_name}
                                </Typography>
                            </Box>

                            <ArrowForwardRoundedIcon
                                className="vehicle-arrow"
                                sx={{
                                    flexShrink: 0,
                                    fontSize: 17,
                                    color: "text.disabled",
                                    transition: "all 180ms ease",
                                }}
                            />
                        </Box>
                    </Box>
                ))}

                {categories.length === 0 && (
                    <Box
                        sx={{
                            gridColumn: "1 / -1",
                            py: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <DirectionsCarOutlinedIcon
                            sx={{
                                fontSize: 34,
                                color: "text.disabled",
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 12,
                                color: "text.secondary",
                            }}
                        >
                            No vehicle categories available
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Footer */}
            {categories.length > 0 && (
                <Box
                    sx={{
                        px: 1.8,
                        py: 1,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "background.default",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 10.5,
                            color: "text.secondary",
                        }}
                    >
                        Available categories
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            color: "primary.main",
                        }}
                    >
                        {categories.length} {categories.length === 1 ? "category" : "categories"}
                    </Typography>
                </Box>
            )}
        </Popover>
    );
};

export default VehicleCategoryPopover;
