
import React, { useState } from "react";
import {
    Box,
    Typography,
    Collapse,
    IconButton,
    useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Section = ({
    title,
    icon,
    children,
    accent = "blue",
    defaultExpanded = true,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [expanded, setExpanded] = useState(defaultExpanded);

    const isOrange = accent === "orange";

    const colors = {
        background: isDark ? "#1b241e" : "#ffffff",
        headerBackground: isDark
            ? (isOrange ? "#30271f" : "#203329")
            : (isOrange ? "#fff7ed" : "#edf6f0"),
        border: isDark ? "#35443a" : "#e0ebe3",
        divider: isDark ? "#35443a" : "#e8f0ea",
        accent: isOrange
            ? (isDark ? "#f6a45e" : "#d97706")
            : (isDark ? "#70cf91" : "#21834b"),
        iconBackground: isDark
            ? (isOrange ? "#493426" : "#294633")
            : (isOrange ? "#ffedd5" : "#dff1e4"),
        text: isDark ? "#e7efe9" : "#263b30",
        arrow: isDark ? "#b7c8bc" : "#63766a",
    };

    return (
        <Box
            sx={{
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                boxShadow: isDark
                    ? "0 3px 12px rgba(0,0,0,0.18)"
                    : "0 3px 12px rgba(31,65,43,0.045)",
                backgroundColor: colors.background,
                overflow: "hidden",
                transition: "background-color 0.2s ease, border-color 0.2s ease",
            }}
        >
            {/* Section Header */}
            <Box
                onClick={() => setExpanded((prev) => !prev)}
                sx={{
                    px: 1.5,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    userSelect: "none",
                    backgroundColor: colors.headerBackground,
                    borderBottom: expanded
                        ? `1px solid ${colors.divider}`
                        : "none",
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                        filter: isDark ? "brightness(1.12)" : "brightness(0.98)",
                    },
                }}
            >
                {icon && (
                    <Box
                        sx={{
                            width: 29,
                            height: 29,
                            borderRadius: "8px",
                            display: "grid",
                            placeItems: "center",
                            backgroundColor: colors.iconBackground,
                            color: colors.accent,
                            flexShrink: 0,
                            border: `1px solid ${colors.border}`,
                            "& svg": {
                                fontSize: 18,
                            },
                        }}
                    >
                        {icon}
                    </Box>
                )}

                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 800,
                        letterSpacing: 0.7,
                        textTransform: "uppercase",
                        color: colors.accent,
                        fontSize: "0.72rem",
                        flex: 1,
                    }}
                >
                    {title}
                </Typography>

                <IconButton
                    size="small"
                    sx={{
                        width: 28,
                        height: 28,
                        color: colors.arrow,
                        "&:hover": {
                            backgroundColor: isDark
                                ? "rgba(255,255,255,0.07)"
                                : "rgba(33,131,75,0.08)",
                        },
                    }}
                >
                    <ExpandMoreIcon
                        sx={{
                            transform: expanded
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.25s ease",
                        }}
                    />
                </IconButton>
            </Box>

            {/* Section Content */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box
                    sx={{
                        px: 1,
                        py: 0.75,
                        backgroundColor: colors.background,
                        color: colors.text,
                    }}
                >
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
};

export default Section;
