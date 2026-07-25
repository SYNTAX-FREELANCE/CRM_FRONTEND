import { memo } from "react";
import { Stack, Typography } from "@mui/material";

const InfoRow = ({
    label,
    value,
    labelColor = "#64748b",
    valueColor = "#0f172a",
    labelWidth = 92,
}) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            spacing={1}
        >
            <Typography
                variant="body2"
                sx={{
                    color: labelColor,
                    minWidth: labelWidth,
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: valueColor,
                    fontWeight: 600,
                    textAlign: "right",
                    wordBreak: "break-word",
                }}
            >
                {value || "-"}
            </Typography>
        </Stack>
    );
};

export default memo(InfoRow);