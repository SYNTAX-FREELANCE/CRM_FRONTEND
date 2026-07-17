import React, { memo } from "react";
import { Box, Typography } from "@mui/joy";

const InfoCard = ({
    title,
    value,
    titleColor,
    valueColor,
    bgColor,
    borderColor,
}) => {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: "16px",
                bgcolor: bgColor,
                border: `1px solid ${borderColor}`,
                textAlign: "center",
            }}
        >
            <Typography
                level="body-xs"
                sx={{
                    color: titleColor,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontSize: { xs: 8, sm: 10 },
                    letterSpacing: "0.2px",
                }}
            >
                {title}
            </Typography>

            <Typography
                level="title-md"
                sx={{
                    mt: 1,
                    fontWeight: 900,
                    color: valueColor,
                    fontFamily: "monospace",
                    fontSize: "14px",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default memo(InfoCard);