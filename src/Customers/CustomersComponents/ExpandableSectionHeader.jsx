import React from "react";
import {
    Box,
    Typography,
    IconButton,
    Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ExpandableSectionHeader = ({
    icon,
    heading,
    expanded,
    onToggle,
    isDark,
    children,
}) => {
    return (
        <Box>
            {/* HEADER */}
            <Box
                onClick={onToggle}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    {icon}

                    <Typography
                        sx={{
                            fontSize: { xs: 15, sm: 20 },
                            fontWeight: 600,
                            color: isDark
                                ? "#f8fafc"
                                : "text.secondary",
                        }}
                    >
                        {heading}
                    </Typography>
                </Box>

                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                    sx={{
                        color: isDark
                            ? "#f8fafc"
                            : "#475569",
                        transform: expanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                    }}
                >
                    <ExpandMoreIcon />
                </IconButton>
            </Box>

            {/* CONTENT */}
            <Collapse
                in={expanded}
                timeout={300}
                unmountOnExit
            >
                <Box
                    sx={{
                        mt: 2,
                    }}
                >
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
};

export default ExpandableSectionHeader;