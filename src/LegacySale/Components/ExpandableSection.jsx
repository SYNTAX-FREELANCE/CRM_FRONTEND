
import React, { useState } from "react";
import { Box, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ExpandableSection = ({
    children,
    isDark,
    defaultOpen = true,
    header,
}) => {
    const [open, setOpen] = useState(defaultOpen);

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: isDark
                    ? "rgba(255,255,255,0.10)"
                    : "#e2e8f0",

                borderRadius: "16px",

                mb: 2.5,

                bgcolor: isDark
                    ? "rgba(255,255,255,0.015)"
                    : "#ffffff",

                overflow: "hidden",
            }}
        >
            {/* HEADER */}
            <Box
                onClick={handleToggle}
                sx={{
                    display: "flex",
                    alignItems: "center",

                    px: {
                        xs: 2,
                        md: 3,
                    },

                    pt: {
                        xs: 2,
                        md: 2.5,
                    },

                    cursor: "pointer",

                    "&:hover": {
                        bgcolor: isDark
                            ? "rgba(255,255,255,0.02)"
                            : "#f8fafc",
                    },
                }}
            >
                {/* YOUR EXISTING SECTION HEADER */}
                <Box sx={{ flex: 1 }}>
                    {header}
                </Box>

                {/* EXPAND ICON */}
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle();
                    }}
                    sx={{
                        mr: 0.5,
                        mb: 2,

                        color: "text.secondary",

                        transform: open
                            ? "rotate(180deg)"
                            : "rotate(0deg)",

                        transition:
                            "transform 0.25s ease",
                    }}
                >
                    <ExpandMoreIcon />
                </IconButton>
            </Box>

            {/* CONTENT */}
            <Collapse in={open} timeout="auto">
                <Box
                    sx={{
                        px: {
                            xs: 2,
                            md: 3,
                        },

                        pb: {
                            xs: 2,
                            md: 3,
                        },
                    }}
                >
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
};

export default ExpandableSection;

