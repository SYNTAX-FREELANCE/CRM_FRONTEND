import React, { memo } from "react";
import {
    Box,
    Drawer,
    Stack,
    Typography,
    IconButton,
    Avatar,
    Chip,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RequestedItemCard from "./RequestedItemCard";

const RequestedDrawer = ({
    open,
    onClose,
    requestItems = [],
    onSelectRequest,
}) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 420 },
                    maxWidth: "100%",
                    height: "100%",
                    bgcolor: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    borderLeft: "1px solid rgba(226,232,240,0.9)",
                    boxShadow: "0 20px 60px rgba(15,23,42,0.14)",
                },
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Box
                    sx={{
                        p: 2,
                        background:
                            "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(249,115,22,0.12) 100%)",
                        borderBottom: "1px solid rgba(226,232,240,0.9)",
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography sx={{ fontWeight: 900, fontSize: 18, color: "#0f172a" }}>
                                Requested Drawer
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "#64748b", mt: 0.3 }}>
                                All employee requests
                            </Typography>
                        </Box>

                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: "auto",
                        p: 2,
                        "&::-webkit-scrollbar": { width: 0, height: 0 },
                    }}
                >
                    <Stack spacing={1.5}>
                        {requestItems?.map((item) => (
                            <RequestedItemCard
                                key={item.id}
                                item={item}
                                onSelectRequest={onSelectRequest}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Drawer>
    );
};

export default memo(RequestedDrawer);