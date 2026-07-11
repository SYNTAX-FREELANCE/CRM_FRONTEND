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
} from "@mui/material";
import LeadPreviewCard from "./LeadPreviewCard";

const FieldRow = ({ label, value }) => (
    <Box>
        <Typography sx={{ fontSize: { xs: 8, sm: 12 }, color: "#64748b", mb: 0.4 }}>
            {label}
        </Typography>
        <Typography sx={{ fontSize: { xs: 10, sm: 12 }, fontWeight: 700, color: "#0f172a" }}>
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
                    borderRadius: 1,
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 900, pb: 1 }}>
                Preview Allocation
            </DialogTitle>

            <DialogContent dividers sx={{
                py: 2, scrollbarWidth: "none",
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
                            bgcolor: "rgba(37,99,235,0.06)",
                            border: "1px solid rgba(37,99,235,0.12)",
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <FieldRow label="Previous Staff" value={firstRow.employee_name?.toUpperCase()} />
                        <FieldRow label="New Staff" value={selectedEmployeeName?.toUpperCase()} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1 }}>
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
                        },
                        "& textarea": {
                            cursor: "text",
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#cbd5e1",
                            },
                            "&:hover fieldset": {
                                borderColor: "#f9a719",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "rgb(27, 26, 23)",
                            },
                        },
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1, flexWrap: "wrap" }}>
                <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", fontSize: { xs: 8, sm: 13 }, }}>
                    Cancel
                </Button>

                <Button
                    onClick={() => onAllocate("PENDING", 0, remarks)}
                    variant="contained"
                    sx={{ textTransform: "none", fontWeight: 700, fontSize: { xs: 8, sm: 13 }, }}
                >
                    Allocate
                </Button>

                <Button
                    onClick={() => onAllocateAndAssign("IN_PROGRESS", 1, remarks)}
                    variant="contained"
                    color="success"
                    sx={{ textTransform: "none", fontWeight: 700, fontSize: { xs: 8, sm: 13 }, }}
                >
                    Allocate & Assign
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default memo(AllocationPreviewModal);