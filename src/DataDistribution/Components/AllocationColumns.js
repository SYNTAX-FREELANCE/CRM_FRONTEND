import { Typography, Chip, Stack, Checkbox } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { Box } from "@mui/joy";
import { height } from "@mui/system";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import AutorenewIcon from "@mui/icons-material/Autorenew";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import Groups3Icon from '@mui/icons-material/Groups3';


export const AllocationColumns = (
    openLead,
    isMobile = false,
    isReallocateMode = false,
    selectedRows = [],
    handleSelect,
    AssignDetails = [],
    handleSelectAll
) => {

    const STATUS_CONFIG = {
        NEW: {
            color: "#2563EB",
            icon: <AutorenewIcon fontSize="small" sx={{ color: "#2563EB" }} />,
        },
        CALLBACK: {
            color: "#ffa200",
            icon: <PhoneCallbackIcon fontSize="small" sx={{ color: "#ffa200" }} />,
        },
        QUOTE: {
            color: "#5309ff",
            icon: <RequestQuoteIcon fontSize="small" sx={{ color: "#5309ff" }} />,
        },
        APPOINTMENT: {
            color: "#0b7d87",
            icon: <Groups3Icon fontSize="small" sx={{ color: "#0b7d87" }} />,
        },
        LOST: {
            color: "#df0d0d",
            icon: <Groups3Icon fontSize="small" sx={{ color: "#df0d0d" }} />,
        },
    };

    const getStatusColor = (status) => {
        const config = STATUS_CONFIG[status];

        return {
            bgcolor: config ? `${config.color}20` : "#F1F5F9",
            color: "#1f2937", // black text
        };
    };


    const getStatusIcon = (status) => {
        return STATUS_CONFIG[status]?.icon ?? null;
    };

    const actionColumn = {
        field: "action",
        headerName: isReallocateMode ? "" : "Action",
        width: 90,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderHeader: () =>
            isReallocateMode ? (
                <Checkbox
                    checked={
                        AssignDetails.length > 0 &&
                        selectedRows.length === AssignDetails.length
                    }
                    indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < AssignDetails.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
            ) : (
                <Typography fontWeight={700}>Action</Typography>
            ),

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
                    <Typography sx={{ fontSize: 9 }}>{row.customer_name}({row?.registration_number})</Typography>
                    <Typography sx={{ fontSize: 8, color: '#030303' }}> {row?.status_name}</Typography>
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
            field: "status_name",
            headerName: "Status",
            minWidth: 120,
            flex: 0.8,
            renderCell: ({ value }) => {
                const config = STATUS_CONFIG[value];
                return (
                    <Chip
                        icon={getStatusIcon(value)}
                        size="small"
                        label={value}
                        sx={{
                            bgcolor: `${config?.color}20`,
                            color: "#1f2937",
                            fontWeight: 800,
                            fontSize: 10,

                            "& .MuiChip-icon": {
                                color: config?.color,
                            },
                        }}
                    />
                );
            },
        },
        actionColumn,
    ];

    return isMobile ? mobileColumns : desktopColumns;
};