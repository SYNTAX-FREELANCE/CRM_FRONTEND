import React, { useState } from "react";
import { Box, Tooltip } from "@mui/material";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";

const CalculationIcon = ({
    onClick,
    title = "Premium calculation",
    size = 34,
}) => {
    const [active, setActive] = useState(false);

    return (
        <Tooltip title={title} placement="top" arrow>
            <Box
                component="button"
                type="button"
                aria-label={title}
                onClick={(event) => {
                    setActive((prev) => !prev);
                    onClick?.(event);
                }}
                sx={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: size,
                    height: size,
                    p: 0,
                    flexShrink: 0,
                    border: "1px solid",
                    borderColor: active ? "#2563EB" : "#DCE4F0",
                    borderRadius: "11px",
                    color: active ? "#FFFFFF" : "#334B70",
                    background: active ? "#2563EB" : "#FFFFFF",
                    cursor: "pointer",
                    outline: "none",
                    transition: "all 220ms cubic-bezier(.2,.8,.2,1)",

                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 3,
                        border: "1px solid",
                        borderColor: active
                            ? "rgba(255,255,255,0.22)"
                            : "#EDF1F7",
                        borderRadius: "8px",
                        pointerEvents: "none",
                    },

                    "&::after": {
                        content: '""',
                        position: "absolute",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        top: 3,
                        right: 3,
                        bgcolor: active ? "#BFDBFE" : "#22C55E",
                        boxShadow: active
                            ? "0 0 0 2px #2563EB"
                            : "0 0 0 2px #FFFFFF",
                        transition: "all 200ms ease",
                    },

                    "& svg": {
                        position: "relative",
                        zIndex: 1,
                        fontSize: size * 0.59,
                        transition: "transform 250ms ease",
                    },

                    "&:hover": {
                        color: "#FFFFFF",
                        background: "#172B4D",
                        borderColor: "#172B4D",
                        transform: "translateY(-2px)",
                        boxShadow: "0 5px 12px rgba(23,43,77,0.20)",
                    },

                    "&:hover svg": {
                        transform: "rotate(-12deg) scale(1.08)",
                    },

                    "&:active": {
                        transform: "scale(0.94)",
                    },

                    "&:focus-visible": {
                        outline: "2px solid #60A5FA",
                        outlineOffset: 3,
                    },

                    "@media (prefers-reduced-motion: reduce)": {
                        transition: "none",
                        "& svg": {
                            transition: "none",
                        },
                    },
                }}
            >
                <FunctionsRoundedIcon />
            </Box>
        </Tooltip>
    );
};

export default CalculationIcon;