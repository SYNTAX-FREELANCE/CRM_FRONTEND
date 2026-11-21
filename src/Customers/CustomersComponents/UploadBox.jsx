
import React, { memo } from "react";
import {
    Box,
    Typography,
    Button,
    useTheme,
} from "@mui/material";

import CustomButton from "../../CommonComponents/CustomButton";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";

const UploadBox = ({
    title,
    subtitle,
    multiple = true,
    acceptImagesOnly = true,
    loading = false,
    onChange,
    onAdd,
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const colors = {
        border: isDark ? "#344239" : "#e2eae4",
        title: isDark ? "#f1f5f2" : "#26352b",
        subtitle: isDark ? "#9ba99f" : "#718078",
        uploadText: "#21834b",
        uploadBorder: isDark ? "#397c53" : "#b8d9c2",
        uploadHover: isDark ? "rgba(33,131,75,0.15)" : "#edf7f0",
        background: isDark ? "#1c2620" : "#ffffff",
    };

    const accept = ".jpg,.jpeg,.png,.pdf";

    const handleFileChange = (e) => {
        if (onChange) onChange(e);
    };

    const handleAddClick = (e) => {
        if (onAdd) onAdd(e);
    };

    return (
        <Box
            sx={{
                border: `1px solid ${colors.border}`,
                borderRadius: "15px",
                p: { xs: 1.75, sm: 2 },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                background: colors.background,
                transition: "border-color 0.2s ease",
                "&:hover": {
                    borderColor: isDark ? "#397c53" : "#b8d9c2",
                },
            }}
        >
            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    sx={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: colors.title,
                        lineHeight: 1.5,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: colors.subtitle,
                        mt: 0.5,
                        lineHeight: 1.5,
                    }}
                >
                    {subtitle}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexShrink: 0,
                }}
            >
                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        borderRadius: "9px",
                        fontWeight: 600,
                        fontSize: 12,
                        textTransform: "none",
                        px: 1.75,
                        py: 0.85,
                        color: colors.uploadText,
                        borderColor: colors.uploadBorder,
                        minWidth: 0,
                        "&:hover": {
                            borderColor: colors.uploadText,
                            background: colors.uploadHover,
                        },
                    }}
                >
                    Upload

                    <input
                        hidden
                        type="file"
                        multiple={multiple}
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </Button>

                <CustomButton
                    loading={loading}
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                >
                    Add
                </CustomButton>
            </Box>
        </Box>
    );
};

export default memo(UploadBox);
