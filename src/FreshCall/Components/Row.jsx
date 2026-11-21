
import React, { memo } from "react";
import {
    Box,
    Stack,
    Typography,
    IconButton,
    useTheme,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const Row = ({
    label,
    value,
    icon,
    accent = "blue",
    editable = false,
    isEditing = false,
    onEdit,
    onSave,
    children,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isOrange = accent === "orange";

    const colors = {
        border: isDark ? "#35443a" : "#e6eee8",
        label: isOrange
            ? (isDark ? "#f6a45e" : "#c87520")
            : (isDark ? "#70cf91" : "#21834b"),
        iconBg: isOrange
            ? (isDark ? "#493426" : "#fff0df")
            : (isDark ? "#294633" : "#e7f4ea"),
        iconColor: isOrange
            ? (isDark ? "#f6a45e" : "#d97706")
            : (isDark ? "#70cf91" : "#21834b"),
        text: isDark ? "#e1ebe4" : "#34483a",
        buttonBg: isDark ? "#26342b" : "#ffffff",
        buttonBorder: isDark ? "#46574b" : "#dfe9e2",
        buttonHover: isDark ? "#34483a" : "#edf6f0",
        saveHover: isDark ? "#244d34" : "#e5f5e9",
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                py: 0.85,
                px: 0.5,
                borderBottom: `1px solid ${colors.border}`,
                transition: "border-color 0.2s ease",
                "&:last-child": {
                    borderBottom: "none",
                },
            }}
        >
            {/* Label and Icon */}
            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                    minWidth: 0,
                    flexShrink: 0,
                }}
            >
                {icon && (
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "7px",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: colors.iconBg,
                            color: colors.iconColor,
                            flexShrink: 0,
                            "& svg": {
                                fontSize: 15,
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
                        color: colors.label,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        whiteSpace: "nowrap",
                        fontSize: { xs: 10, sm: 11 },
                    }}
                >
                    {label}
                </Typography>
            </Stack>

            {/* Value and Actions */}
            <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                justifyContent="flex-end"
                sx={{
                    width: "80%",
                    minWidth: 0,
                }}
            >
                {isEditing ? (
                    children
                ) : (
                    <Typography
                        component="div"
                        variant="body2"
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            fontSize: { xs: 11, sm: 13 },
                            fontWeight: { xs: 700, sm: 600 },
                            color: colors.text,
                            textAlign: "right",
                            wordBreak: "break-word",
                        }}
                    >
                        {value || "-"}
                    </Typography>
                )}

                {editable && (
                    <IconButton
                        size="small"
                        onClick={isEditing ? onSave : onEdit}
                        sx={{
                            width: 29,
                            height: 29,
                            flexShrink: 0,
                            borderRadius: "8px",
                            border: `1px solid ${colors.buttonBorder}`,
                            bgcolor: colors.buttonBg,
                            color: isEditing
                                ? (isDark ? "#70cf91" : "#21834b")
                                : colors.label,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                bgcolor: isEditing
                                    ? colors.saveHover
                                    : colors.buttonHover,
                                borderColor: colors.label,
                            },
                        }}
                    >
                        {isEditing ? (
                            <SaveIcon fontSize="small" />
                        ) : (
                            <EditIcon fontSize="small" />
                        )}
                    </IconButton>
                )}
            </Stack>
        </Box>
    );
};

export default memo(Row);
