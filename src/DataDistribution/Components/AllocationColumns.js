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
    handleSelectAll,
    isDark = false
) => {

    const STATUS_CONFIG = {
        NEW: {
            color: "#2563EB",
            darkColor: "#60a5fa",
            icon: <AutorenewIcon fontSize="small" sx={{ color: isDark ? "#60a5fa" : "#2563EB" }} />,
        },
        CALLBACK: {
            color: "#ffa200",
            darkColor: "#fbbf24",
            icon: <PhoneCallbackIcon fontSize="small" sx={{ color: isDark ? "#fbbf24" : "#ffa200" }} />,
        },
        QUOTE: {
            color: "#5309ff",
            darkColor: "#a78bfa",
            icon: <RequestQuoteIcon fontSize="small" sx={{ color: isDark ? "#a78bfa" : "#5309ff" }} />,
        },
        APPOINTMENT: {
            color: "#0b7d87",
            darkColor: "#2dd4bf",
            icon: <Groups3Icon fontSize="small" sx={{ color: isDark ? "#2dd4bf" : "#0b7d87" }} />,
        },
        LOST: {
            color: "#df0d0d",
            darkColor: "#f87171",
            icon: <Groups3Icon fontSize="small" sx={{ color: isDark ? "#f87171" : "#df0d0d" }} />,
        },
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
                <Typography fontWeight={700} sx={{ color: isDark ? "#cbd5e1" : "#334155" }}>Action</Typography>
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
                        color: isDark ? "#fb923c" : "#ff6e20",
                        cursor: "pointer",
                    }}
                >
                    <AutoStoriesIcon sx={{
                        fontSize: 16
                    }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 800, color: isDark ? "#fb923c" : "#ff6e20" }}>
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
                    <Typography fontWeight={700} sx={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: isDark ? "#f8fafc" : "inherit" }}>
                        {row?.employee_name}
                    </Typography>
                    <Typography sx={{ fontSize: 9, color: isDark ? "#94a3b8" : "inherit" }}>{row.customer_name}({row?.registration_number})</Typography>
                    <Typography sx={{ fontSize: 8, color: isDark ? "#cbd5e1" : "#030303" }}> {row?.status_name}</Typography>
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
                    <PersonIcon sx={{ fontSize: 18, color: isDark ? "#94a3b8" : "#64748b" }} />
                    <Typography sx={{ fontSize: 12, textTransform: 'uppercase', color: isDark ? "#f8fafc" : "inherit" }} fontWeight={600}>
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
                <Typography sx={{ fontSize: 12, color: isDark ? "#f8fafc" : "inherit" }} fontWeight={600} style={{
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
                    <DirectionsCarIcon sx={{ fontSize: 16, color: isDark ? "#94a3b8" : "inherit" }} />
                    <Typography sx={{ fontSize: 12, color: isDark ? "#f8fafc" : "inherit" }}>{value}</Typography>
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
                const activeColor = isDark ? (config?.darkColor || config?.color) : config?.color;
                return (
                    <Chip
                        icon={getStatusIcon(value)}
                        size="small"
                        label={value}
                        sx={{
                            bgcolor: isDark ? `${activeColor}30` : `${activeColor}20`,
                            color: isDark ? "#f8fafc" : "#1f2937",
                            fontWeight: 800,
                            fontSize: 10,
                            "& .MuiChip-icon": {
                                color: activeColor,
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