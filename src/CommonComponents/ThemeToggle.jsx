import React, { memo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ThemeToggle = ({
    mode = "light",
    onToggle,
    top,
    bottom = 20,
    left,
    right = 20,
    zIndex = 9999,
    size = 52,
}) => {
    return (
        <Box
            sx={{
                position: "fixed", // change to absolute if needed
                top,
                bottom,
                left,
                right,
                zIndex,
            }}
        >
            <Tooltip title={mode === "light" ? "Dark Mode" : "Light Mode"}>
                <IconButton
                    onClick={onToggle}
                    sx={{
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        bgcolor:
                            mode === "light"
                                ? "rgba(33,33,33,0.9)"
                                : "rgba(255,255,255,0.9)",
                        color:
                            mode === "light"
                                ? "#FFD54F"
                                : "#1976D2",
                        backdropFilter: "blur(12px)",
                        border: "1px solid",
                        borderColor:
                            mode === "light"
                                ? "rgba(255,255,255,.15)"
                                : "rgba(0,0,0,.08)",
                        boxShadow: "0 8px 20px rgba(0,0,0,.18)",
                        transition: "all .35s ease",
                        "&:hover": {
                            transform: "scale(1.08) rotate(15deg)",
                        },
                    }}
                >
                    {mode === "light" ? (
                        <DarkModeIcon sx={{ fontSize: 14 }} />
                    ) : (
                        <LightModeIcon sx={{ fontSize: 14 }} />
                    )}
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default memo(ThemeToggle);