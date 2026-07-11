import React, { memo } from "react";
import { Box, Typography } from "@mui/material";

const OutcomeCard = ({
    item,
    active = false,
    onClick,
}) => {

    return (
        <Box
            onClick={onClick}
            sx={{
                cursor: "pointer",
                p: 1.25,
                borderRadius: 3,
                border: active
                    ? "1.5px solid #ff811a"
                    : "1px solid #e2e8f0",
                bgcolor: active
                    ? "rgba(37,99,235,.06)"
                    : "#fff",
                display: "flex",
                alignItems: "center",
                gap: 1,
                transition: "all .2s ease",

                "&:hover": {
                    borderColor: "#ff811a",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 20px rgba(37,99,235,.08)",
                },
            }}
        >
            <Box
                sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "10px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: active
                        ? "#ff811a"
                        : "rgba(37,99,235,.08)",
                    color: active ? "#fff" : "#2563eb",
                    flexShrink: 0,
                }}
            >
                {item?.icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    sx={{
                        fontWeight: 800,
                        color: "#0f172a",
                        fontSize: 8,
                    }}
                >
                    {item?.label}
                </Typography>
            </Box>
        </Box>
    );
};

export default memo(OutcomeCard);