import { Stack, Typography, Chip, Tooltip } from "@mui/material";
import { Box } from "@mui/joy";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { format } from "date-fns";

export const PolicyClaimColumns = (
    openClaim,
    isMobile = false,
    isDark = false
) => {
    const textColor = isDark ? "#cbd5e1" : "#475569";
    const headingColor = isDark ? "#f8fafc" : "#0f172a";


    const renderDate = (value) =>
        value ? format(new Date(value), "dd/MM/yyyy") : "-";

    const renderAmount = (value) =>
        value !== null && value !== undefined && value !== ""
            ? `₹ ${Number(value).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`
            : "-";

    const mobileColumns = [
        {
            field: "claim_number",
            headerName: "Claim Details",
            minWidth: 220,
            flex: 1,
            renderCell: ({ row }) => (
                <Stack spacing={0.4}>
                    <Typography
                        sx={{
                            fontSize: 12,
                            fontWeight: 900,
                            color: headingColor,
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        {row.claim_number}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: textColor,
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        {row.customer_name}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 10,
                            color: textColor,
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        {row.registration_number} | {row.policy_number}
                    </Typography>
                </Stack>
            ),
        },
        {
            field: "claim_status",
            headerName: "Status",
            width: 110,
            sortable: false,
            renderCell: ({ value }) => (
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: textColor, fontFamily: "Bahnschrift", textTransform: 'uppercase' }}>
                    {value || "-"}
                </Typography>
            )
        },
        {
            field: "action",
            headerName: "View",
            width: 70,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => (
                <Tooltip title="View Claim">
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                            openClaim(row);
                        }}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#ff632f",
                        }}
                    >
                        <VisibilityOutlinedIcon sx={{ fontSize: 19 }} />
                    </Box>
                </Tooltip>
            ),
        },
    ];

    const desktopColumns = [
        {
            field: "claim_number",
            headerName: "Claim No",
            minWidth: 150,
            flex: 1,
            renderCell: ({ value }) => (
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: headingColor,
                    }}
                >
                    {value}
                </Typography>
            ),
        },
        {
            field: "customer_name",
            headerName: "Customer",
            minWidth: 150,
            flex: 1,
            renderCell: ({ value }) => (
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: headingColor,
                        fontFamily: "Bahnschrift",
                    }}
                >
                    {value}
                </Typography>
            ),
        },
        {
            field: "policy_number",
            headerName: "Policy No",
            minWidth: 160,
            flex: 1,
            renderCell: ({ value }) => (
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: textColor,
                        fontFamily: "Bahnschrift",
                    }}
                >
                    {value || "-"}
                </Typography>
            ),
        },
        {
            field: "registration_number",
            headerName: "Registration",
            minWidth: 120,
            flex: 0.8,
            renderCell: ({ value }) => (
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: textColor,
                        fontFamily: "Bahnschrift",
                    }}
                >
                    {value || "-"}
                </Typography>
            ),
        },
        {
            field: "insurance_company_name",
            headerName: "Insurance Company",
            minWidth: 190,
            flex: 1.2,
            renderCell: ({ value }) => (
                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: textColor,
                        fontFamily: "Bahnschrift",
                    }}
                >
                    {value || "-"}
                </Typography>
            ),
        },
        {
            field: "claim_date",
            headerName: "Claim Date",
            minWidth: 110,
            flex: 0.7,
            renderCell: ({ value }) => (
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: textColor, fontFamily: "Bahnschrift", }}>
                    {renderDate(value)}
                </Typography>
            ),
        },
        {
            field: "accident_date",
            headerName: "Accident Date",
            minWidth: 115,
            flex: 0.8,
            renderCell: ({ value }) => (
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: textColor, fontFamily: "Bahnschrift", }}>
                    {renderDate(value)}
                </Typography>
            ),
        },
        {
            field: "driver_name",
            headerName: "Driver",
            minWidth: 130,
            flex: 0.9,
            renderCell: ({ value }) => (
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: textColor, fontFamily: "Bahnschrift", textTransform: 'uppercase' }}>
                    {value || "-"}
                </Typography>
            ),
        },
        {
            field: "estimated_repair_cost",
            headerName: "Estimated Cost",
            minWidth: 125,
            flex: 0.8,
            renderCell: ({ value }) => (
                <Typography sx={{ fontSize: 14, fontWeight: 800, color: textColor, fontFamily: "Bahnschrift", }}>
                    {renderAmount(value)}
                </Typography>
            ),
        },
        {
            field: "claim_status",
            headerName: "Status",
            minWidth: 115,
            flex: 0.7,
            renderCell: ({ row }) => (
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: row?.claim_status_color, fontFamily: "Bahnschrift", textTransform: 'uppercase' }}>
                    {row.claim_status || "-"}
                </Typography>
            )
        },
        {
            field: "action",
            headerName: "View",
            width: 75,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => (
                <Tooltip title="View Claim">
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                            openClaim(row);
                        }}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#ff632f",
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        <VisibilityOutlinedIcon sx={{ fontSize: 19 }} />
                    </Box>
                </Tooltip>
            ),
        },
    ];

    return isMobile ? mobileColumns : desktopColumns;
};