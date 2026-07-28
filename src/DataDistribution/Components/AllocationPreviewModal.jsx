import React, { memo, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Stack,
    Typography,
    Divider,
    Chip,
    TextField,
    useTheme,
} from "@mui/material";
import LeadPreviewCard from "./LeadPreviewCard";

const FieldRow = ({ label, value, isDark }) => (
    <Box>
        <Typography sx={{ fontSize: { xs: 8, sm: 12 }, color: isDark ? "#94a3b8" : "#64748b", mb: 0.4 }}>
            {label}
        </Typography>
        <Typography sx={{ fontSize: { xs: 10, sm: 12 }, fontWeight: 700, color: isDark ? "#f8fafc" : "#0f172a" }}>
            {value || "-"}
        </Typography>
    </Box>
);

const AllocationPreviewModal = ({
    open,
    onClose,
    selectedRows = [],
    selectedRowDetails = [],
    selectedEmployeeName = "",
    onAllocate,
    onAllocateAndAssign
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const firstRow = selectedRowDetails?.[0] || {};
    const [remarks, setRemarks] = useState("");

    const handleClose = () => {
        setRemarks("");
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: "hidden",
                    background: isDark
                        ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)"
                        : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    color: isDark ? "#f8fafc" : undefined,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 900, pb: 1, color: isDark ? "#f8fafc" : undefined }}>
                Preview Allocation
            </DialogTitle>

            <DialogContent dividers sx={{
                py: 2,
                borderColor: isDark ? "rgba(255,255,255,0.1)" : undefined,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            }}>
                <Stack spacing={2}>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: isDark ? "rgba(37,99,235,0.18)" : "rgba(37,99,235,0.06)",
                            border: isDark ? "1px solid rgba(37,99,235,0.3)" : "1px solid rgba(37,99,235,0.12)",
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <FieldRow label="Previous Staff" value={firstRow.employee_name?.toUpperCase()} isDark={isDark} />
                        <FieldRow label="New Staff" value={selectedEmployeeName?.toUpperCase()} isDark={isDark} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mb: 1 }}>
                            Selected Rows
                        </Typography>

                        <Stack spacing={1}>
                            {selectedRowDetails?.map((row) => (
                                <LeadPreviewCard
                                    key={row?.lead_id}
                                    row={row}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks for this allocation..."
                    variant="outlined"
                    size="small"
                    inputProps={{
                        maxLength: 300,
                        style: { resize: "vertical" }
                    }}
                    sx={{
                        mt: 2,
                        "& .MuiInputBase-root": {
                            alignItems: "flex-start",
                            color: isDark ? "#f8fafc" : undefined,
                        },
                        "& textarea": {
                            cursor: "text",
                        },
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: isDark ? "rgba(15,23,42,0.6)" : undefined,
                            "& fieldset": {
                                borderColor: isDark ? "rgba(255,255,255,0.15)" : "#cbd5e1",
                            },
                            "&:hover fieldset": {
                                borderColor: "#f9a719",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: isDark ? "#60a5fa" : "rgb(27, 26, 23)",
                            },
                        },
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1, flexWrap: "wrap", borderColor: isDark ? "rgba(255,255,255,0.1)" : undefined }}>
                <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", fontSize: { xs: 8, sm: 13 }, color: isDark ? "#cbd5e1" : undefined, borderColor: isDark ? "rgba(255,255,255,0.2)" : undefined }}>
                    Cancel
                </Button>

                <Button
                    onClick={() => onAllocate("PENDING", 0, remarks)}
                    variant="contained"
                    sx={{ textTransform: "none", fontWeight: 700, fontSize: { xs: 8, sm: 13 }, }}
                >
                    Allocate
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(AllocationPreviewModal);