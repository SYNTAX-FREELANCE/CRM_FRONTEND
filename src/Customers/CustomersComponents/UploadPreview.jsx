import React, { memo, useState } from "react";
import {
    Box,
    IconButton,
    Skeleton,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideocamIcon from "@mui/icons-material/Videocam";
import { BACKEND_IMAGE } from "../../constant/Static";
import ImagePreviewModal from "./ImagePreviewModal";

const UploadPreview = ({
    files = [],
    onRemove,
    LoadingPolicyFiles
}) => {


    const [previewImage, setPreviewImage] = useState("");
    const [openPreview, setOpenPreview] = useState(false);

    const handleImagePreview = (url) => {
        setPreviewImage(url);
        setOpenPreview(true);
    };

    const handleClosePreview = () => {
        setPreviewImage("");
        setOpenPreview(false);
    };

    if (!Array.isArray(files) || files.length === 0) {
        return null;
    }

    if (LoadingPolicyFiles) {
        return (
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                {[...Array(4)].map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 110,
                            position: "relative",
                        }}
                    >
                        <Skeleton
                            variant="rounded"
                            width={90}
                            height={90}
                            sx={{ borderRadius: 2 }}
                        />

                        <Skeleton
                            variant="text"
                            width={80}
                            height={18}
                            sx={{ mt: 0.5 }}
                        />
                    </Box>
                ))}
            </Box>
        );
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
            {files?.map((item, index) => {

                const isServer = Boolean(item.file_id);

                const fileName = isServer
                    ? item.filename || item.name
                    : item.file?.name;

                const mimeType = isServer
                    ? item.mime_type
                    : item.file?.type;

                const fileUrl = isServer
                    ? `${BACKEND_IMAGE}${item.url}`
                    : item.preview;

                const isImage = mimeType?.startsWith("image/");
                const isVideo = mimeType?.startsWith("video/");
                const isPdf = mimeType === "application/pdf";

                return (
                    <Box
                        key={item.file_id ?? item.id ?? index}
                        sx={{
                            position: "relative",
                            width: 110,
                        }}
                    >
                        {isImage ? (

                            <Box
                                component="img"
                                src={fileUrl}
                                onClick={() => handleImagePreview(fileUrl)}
                                sx={{
                                    width: 90,
                                    height: 90,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    border: "1px solid #ddd",
                                }}
                            />

                        ) : isVideo ? (

                            <Box
                                component="video"
                                src={fileUrl}
                                controls
                                sx={{
                                    width: 90,
                                    height: 90,
                                    borderRadius: 2,
                                    border: "1px solid #ddd",
                                    objectFit: "cover",
                                }}
                            />

                        ) : isPdf ? (

                            <Box
                                component="a"
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    width: 90,
                                    height: 90,
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    textDecoration: "none",
                                    color: "inherit",
                                    p: 1
                                }}
                            >
                                <PictureAsPdfIcon
                                    color="error"
                                    sx={{ fontSize: 40 }}
                                />

                                <Typography
                                    fontSize={10}
                                    textAlign="center"
                                    noWrap
                                    width="100%"
                                >
                                    {fileName}
                                </Typography>
                            </Box>

                        ) : (

                            <Box
                                sx={{
                                    width: 90,
                                    height: 90,
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    p: 1
                                }}
                            >
                                <VideocamIcon />

                                <Typography
                                    fontSize={10}
                                    textAlign="center"
                                    sx={{
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {fileName}
                                </Typography>
                            </Box>

                        )}

                        <IconButton
                            onClick={() => onRemove(item)}
                            sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: "white",
                                "&:hover": {
                                    bgcolor: "#f5f5f5",
                                },
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                );
            })}
            <ImagePreviewModal
                open={openPreview}
                image={previewImage}
                onClose={handleClosePreview}
            />
        </Box>
    );
};

export default memo(UploadPreview);