// src/components/UploadBox.jsx
import React, { memo } from "react";
import { Box, Typography, Button } from "@mui/material";
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
                border: "1px solid #E5E7EB",
                borderRadius: 3,
                p: 2,
                display: "flex",
                flexDirection: { xs: 'column', sm: "row" },
                justifyContent: "space-between",
                // alignItems: "center",
                gap: 2
            }}
        >
            <Box>
                <Typography fontSize={14} fontWeight={600}>{title}</Typography>
                <Typography fontSize={10} fontWeight={600}>{subtitle}</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2,  }}>
                <Button
                    sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: { xs: 10, md: 14 }
                    }}
                    startIcon={<UploadIcon sx={{
                        fontSize: 9
                    }} />}
                    component="label" variant="outlined">
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