
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
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: size,
                    height: size,
                    p: 0,
                    flexShrink: 0,

                    border: "1px solid",
                    borderColor: active ? "#07833f" : "#cce8d6",
                    borderRadius: "10px",

                    color: active ? "#ffffff" : "#07833f",
                    backgroundColor: active ? "#07833f" : "#e9f6ed",

                    cursor: "pointer",
                    outline: "none",
                    transition: "all 180ms ease",

                    "& svg": {
                        fontSize: size * 0.59,
                        transition: "transform 180ms ease",
                    },

                    "&:hover": {
                        color: "#ffffff",
                        backgroundColor: "#07833f",
                        borderColor: "#07833f",
                        boxShadow: "0 3px 8px rgba(7,131,63,0.18)",
                    },

                    "&:hover svg": {
                        transform: "scale(1.08)",
                    },

                    "&:active": {
                        transform: "scale(0.94)",
                    },

                    "&:focus-visible": {
                        outline: "2px solid #07833f",
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
                {/* <FunctionsRoundedIcon />
                 */}
                📟
            </Box>
        </Tooltip>
    );
};

export default CalculationIcon;
