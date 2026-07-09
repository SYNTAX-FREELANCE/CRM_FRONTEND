import React from "react";
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
} from "@mui/material";

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
    onAllocateAndAssign,
}) => {
    const firstRow = selectedRowDetails?.[0] || {};

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                        <FieldRow label="Previous Staff" value={firstRow.employee_name} />
                        <FieldRow label="New Staff" value={selectedEmployeeName} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1 }}>
                            Selected Rows
                        </Typography>

                        <Stack spacing={1}>
                            {selectedRowDetails.map((row) => (
                                <Box
                                    key={row.lead_id}
                                    sx={{
                                        p: 1.2,
                                        borderRadius: 2,
                                        bgcolor: "#fff",
                                        border: "1px solid #e2e8f0",
                                    }}
                                >
                                    <Stack direction="row" justifyContent="space-between" gap={1}>
                                        <Box>
                                            <Typography sx={{ fontSize: { xs: 10, sm: 13 }, fontWeight: 800 }}>
                                                {row.customer_name}
                                            </Typography>
                                            <Typography sx={{ fontSize: { xs: 8, sm: 10 }, color: "#64748b" }}>
                                                {row.registration_number}
                                            </Typography>
                                        </Box>

                                        <Chip
                                            size="small"
                                            label={row.work_status?.replace("_", " ") || "-"}
                                            sx={{
                                                fontWeight: 700,
                                                bgcolor: "#e0f2fe",
                                                color: "#0369a1",
                                                fontSize: { xs: 8, sm: 10 }
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1, flexWrap: "wrap" }}>
                <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", fontSize: { xs: 8, sm: 13 }, }}>
                    Cancel
                </Button>

                <Button
                    onClick={onAllocate}
                    variant="contained"
                    sx={{ textTransform: "none", fontWeight: 700, fontSize: { xs: 8, sm: 13 }, }}
                >
                    Allocate
                </Button>

                <Button
                    onClick={onAllocateAndAssign}
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

export default AllocationPreviewModal;