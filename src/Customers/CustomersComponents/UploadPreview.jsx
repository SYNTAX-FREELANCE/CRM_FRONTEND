import React, { memo } from "react";
import {
    Box,
    Button,
    IconButton,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const UploadPreview = ({
    files = [],
    multiple = true,
    onRemove,
}) => {

    if (!Array.isArray(files) || files.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                mt: 2,
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
            }}
        >
            {files.map((item, index) => (
                <Box
                    key={item.id ?? index}
                    sx={{
                        position: "relative",
                        width: 110,
                    }}
                >
                    {item.preview ? (
                        <Box
                            component="img"
                            src={item.preview}
                            sx={{
                                width: 90,
                                height: 90,
                                borderRadius: 2,
                                objectFit: "cover",
                                border: "1px solid #ddd",
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: 90,
                                height: 90,
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                p: 1,
                            }}
                        >
                            <Typography
                                fontSize={12}
                                textAlign="center"
                                sx={{
                                    wordBreak: "break-word",
                                }}
                            >
                                {item.file?.name}
                            </Typography>
                        </Box>
                    )}

                    <IconButton
                        onClick={() => onRemove(item.id)}
                        sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "white",
                            "&:hover": {
                                bgcolor: "#f5f5f5",
                            },
                            fontSize: 10
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
};

export default memo(UploadPreview);