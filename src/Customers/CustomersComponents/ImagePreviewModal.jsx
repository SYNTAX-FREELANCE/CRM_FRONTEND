import React, { memo } from "react";
import {
    Modal,
    Fade,
    Backdrop,
    Box,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImagePreviewModal = ({
    open,
    image,
    onClose,
}) => {

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{
                backdrop: Backdrop,
            }}
            slotProps={{
                backdrop: {
                    timeout: 300,
                },
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: "fixed",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.92)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 3,
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            bgcolor: "rgba(255,255,255,.15)",
                            color: "#fff",
                            zIndex: 2,
                            "&:hover": {
                                bgcolor: "rgba(255,255,255,.25)",
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box
                        component="img"
                        src={image}
                        alt="Preview"
                        sx={{
                            maxWidth: "95vw",
                            maxHeight: "90vh",
                            objectFit: "contain",
                            borderRadius: 2,
                            userSelect: "none",
                            boxShadow: "0 20px 60px rgba(0,0,0,.45)",
                        }}
                    />
                </Box>
            </Fade>
        </Modal>
    );
};

export default memo(ImagePreviewModal);