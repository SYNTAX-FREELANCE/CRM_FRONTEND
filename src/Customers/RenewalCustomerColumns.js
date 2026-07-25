import { Stack, Typography, Chip, Tooltip } from "@mui/material";
import { Box } from "@mui/joy";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";

export const RenewalCustomerColumns = (
    openCustomer,
    isMobile = false
) => {

    const mobileColumns = [
        {
            field: "customer_name",
            headerName: "Customer",
            minWidth: 180,
            flex: 1,
            renderCell: ({ row }) => (
                <Stack spacing={0.3}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography
                            variant="body2"
                            fontWeight={900}
                            sx={{ fontSize: 12 }}
                            color="#0f172a"
                        >
                            {row.customer_name}
                        </Typography>

                        {row.is_previous_customer === 1 && (
                            <Tooltip title="Returning Customer">
                                <SupportAgentIcon
                                    sx={{
                                        fontSize: 16,
                                        color: "#ff730e",
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Stack>

                    <Typography
                        variant="caption"
                        color="#64748b"
                        fontWeight={700}
                    >
                        {row.registration_number}
                    </Typography>
                </Stack>
            ),
        },
        {
            field: "action",
            headerName: "View",
            width: 90,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => (
                <Box
                    onClick={(e) => {
                        e.stopPropagation();
                        openCustomer(row);
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        cursor: "pointer",
                        color: "#2563eb",
                    }}
                >
                    <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                    <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{ fontSize: 12 }}
                    >
                        View
                    </Typography>
                </Box>
            ),
        },
    ];

    const desktopColumns = [
        {
            field: "customer_name",
            headerName: "Customer Name",
            minWidth: 200,
            flex: 1,
            renderCell: ({ row }) => (
                <Stack direction="row" alignItems="center" spacing={0.6}>
                    {row.is_previous_customer === 1 && (
                        <Tooltip title="Returning Customer">
                            <SupportAgentIcon
                                sx={{
                                    fontSize: 18,
                                    color: "#ff730e",
                                }}
                            />
                        </Tooltip>
                    )}

                    <Typography
                        variant="body2"
                        fontWeight={900}
                        sx={{ fontSize: 12 }}
                        color="#0f172a"
                    >
                        {row.customer_name}
                    </Typography>
                </Stack>
            ),
        },
        {
            field: "registration_number",
            headerName: "Registration No",
            minWidth: 150,
            flex: 0.9,
            renderCell: ({ value }) => (
                <Typography
                    variant="body2"
                    fontWeight={900}
                    sx={{ fontSize: 12 }}
                    color="#475569"
                >
                    {value}
                </Typography>
            ),
        },
        {
            field: "model",
            headerName: "Model",
            minWidth: 150,
            flex: 0.9,
            renderCell: ({ value }) => (
                <Typography
                    variant="body2"
                    fontWeight={900}
                    sx={{ fontSize: 12 }}
                    color="#475569"
                >
                    {value}
                </Typography>
            ),
        },
        {
            field: "action",
            headerName: "View",
            width: 120,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => (
                <Box
                    onClick={(e) => {
                        e.stopPropagation();
                        openCustomer(row);
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        cursor: "pointer",
                        color: "#2563eb",
                    }}
                >
                    <EventRepeatOutlinedIcon sx={{ fontSize: 18 }} />

                    <Typography
                        variant="body2"
                        fontWeight={700}
                        color="#475569"
                    >
                        Renew
                    </Typography>
                </Box>
            ),
        },
    ];

    return isMobile ? mobileColumns : desktopColumns;
};