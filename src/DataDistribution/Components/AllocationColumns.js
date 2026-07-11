import { Typography, Chip, Stack, Checkbox } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Box } from "@mui/joy";
import { height } from "@mui/system";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

export const AllocationColumns = (
    openLead,
    isMobile = false,
    isReallocateMode = false,
    selectedRows = [],
    handleSelect
) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return {
                    bgcolor: "#FEF3C7",
                    color: "#92400E",
                };
            case "IN_PROGRESS":
                return {
                    bgcolor: "#DBEAFE",
                    color: "#1D4ED8",
                };
            default:
                return {
                    bgcolor: "#F1F5F9",
                    color: "#475569",
                };
        }
    };

    const actionColumn = {
        field: "action",
        headerName: isReallocateMode ? "" : "Action",
        width: 90,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => {
            if (isReallocateMode) {
                return (
                    <Checkbox
                        checked={selectedRows.includes(row.lead_id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleSelect(row, e.target.checked)}
                    />
                );
            }

            return (
                <Box
                    onClick={(e) => {
                        e.stopPropagation();
                        openLead(row);
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        color: "#ff6e20",
                        cursor: "pointer",
                    }}
                >
                    <AutoStoriesIcon sx={{
                        fontSize: 16
                    }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
                        View
                    </Typography>
                </Box>
            );
        },
    };

    const mobileColumns = [
        {
            field: "employee_name",
            headerName: "Allocation",
            flex: 1.6,
            minWidth: 220,
            renderCell: ({ row }) => (
                <Stack spacing={0.4} sx={{ py: 1 }}>
                    <Typography fontWeight={700} sx={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>
                        {row?.employee_name}
                    </Typography>
                    <Typography sx={{ fontSize: 9 }}>{row.customer_name}({row.registration_number})</Typography>
                    <Typography sx={{ fontSize: 8, color: getStatusColor(row.work_status) }}> {row.work_status?.replace("_", " ")}</Typography>
                </Stack>
            ),
        },
        {
            ...actionColumn,
            width: 90,
        },
    ];
    const desktopColumns = [
        {
            field: "employee_name",
            headerName: "Allocated To",
            minWidth: 180,
            flex: 1,
            renderCell: ({ value }) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon sx={{ fontSize: 18, color: "#64748b" }} />
                    <Typography sx={{ fontSize: 12, textTransform: 'uppercase' }} fontWeight={600}>
                        {value}
                    </Typography>
                </Stack>
            ),
        },
        {
            field: "customer_name",
            headerName: "Customer",
            minWidth: 180,
            flex: 1,
            renderCell: ({ value }) => (
                <Typography sx={{ fontSize: 12 }} fontWeight={600} style={{
                    textTransform: 'uppercase'
                }}>
                    {value}
                </Typography>
            ),
        },
        {
            field: "registration_number",
            headerName: "Vehicle",
            minWidth: 150,
            flex: 1,
            renderCell: ({ value }) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <DirectionsCarIcon sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 12 }}>{value}</Typography>
                </Stack>
            ),
        },
        {
            field: "work_status",
            headerName: "Status",
            minWidth: 120,
            flex: 0.8,
            renderCell: ({ value }) => (
                <Chip
                    size="small"
                    label={value.replace("_", " ")}
                    sx={{
                        ...getStatusColor(value),
                        fontWeight: 700,
                    }}
                />
            ),
        },
        actionColumn,
    ];

    return isMobile ? mobileColumns : desktopColumns;
};