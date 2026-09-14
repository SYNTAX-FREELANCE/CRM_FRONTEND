import { Stack, Typography, Chip, Tooltip } from "@mui/material";
import { Box } from "@mui/joy";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { format } from "date-fns";
import { getAuthUser } from "../constant/Constant";

export const RenewalCustomerColumns = (
  openCustomer,
  DownloadPdf,
  isMobile = false,
  isDark = false,
) => {
  const authuser = getAuthUser();
  const { role } = authuser;

  const isEmployee = role?.toUpperCase() === "EMPLOYEE";

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
              color={isDark ? "#f8fafc" : "#0f172a"}
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
            color={isDark ? "#94a3b8" : "#64748b"}
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
            color: isDark ? "#60a5fa" : "#2563eb",
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 17 ,color:"#ff632f"}} />
        </Box>
      ),
    },
       {
      field: "download",
      headerName: "Save",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            DownloadPdf(row);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            cursor: "pointer",
            color: isDark ? "#60a5fa" : "#2563eb",
          }}
        >
          <PictureAsPdfIcon sx={{ fontSize: 18,color:"#ff632f" }} />
        </Box>
      ),
    },
  ];

  const desktopColumns = [
    {
      field: "customer_name",
      headerName: "Customer",
      minWidth: 150,
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
            color={isDark ? "#f8fafc" : "#0f172a"}
          >
            {row.customer_name}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "registration_number",
      headerName: "Registration No",
      minWidth: 100,
      flex: 0.9,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          fontWeight={900}
          sx={{ fontSize: 12 }}
          color={isDark ? "#cbd5e1" : "#475569"}
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
          color={isDark ? "#cbd5e1" : "#475569"}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "premium_amount",
      headerName: "Premium",
      minWidth: 100,
      flex: 0.9,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          fontWeight={900}
          sx={{ fontSize: 12 }}
          color={isDark ? "#cbd5e1" : "#475569"}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "paid_amount",
      headerName: "Paid",
      minWidth: 100,
      flex: 0.9,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          fontWeight={900}
          sx={{ fontSize: 12 }}
          color={isDark ? "#cbd5e1" : "#475569"}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "discount_amount",
      headerName: "Discount",
      minWidth: 100,
      flex: 0.9,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          fontWeight={900}
          sx={{ fontSize: 12 }}
          color={isDark ? "#cbd5e1" : "#475569"}
        >
          {value}
        </Typography>
      ),
    },
    {
      field: "sale_date",
      headerName: "Sale Date",
      minWidth: 150,
      flex: 0.9,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          fontWeight={900}
          sx={{ fontSize: 12 }}
          color={isDark ? "#cbd5e1" : "#475569"}
        >
          {value ? format(new Date(value), "dd/MM/yyyy") : "-"}
        </Typography>
      ),
    },
    ...(!isEmployee
      ? [
          {
            field: "employee_name",
            headerName: "Agent",
            minWidth: 100,
            flex: 0.9,
            renderCell: ({ value }) => (
              <Typography
                variant="body2"
                fontWeight={900}
                sx={{ fontSize: 12 }}
                color={isDark ? "#cbd5e1" : "#475569"}
              >
                {value}
              </Typography>
            ),
          },
        ]
      : []),

    {
      field: "action",
      headerName: "Views",
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
            color: isDark ? "#60a5fa" : "#2563eb",
          }}
        >
          <EventRepeatOutlinedIcon sx={{ fontSize: 18 ,color:"#ff632f"}} />
        </Box>
      ),
    },
      {
      field: "download",
      headerName: "Save",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            DownloadPdf(row);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            cursor: "pointer",
            color: isDark ? "#60a5fa" : "#2563eb",
          }}
        >
          <PictureAsPdfIcon sx={{ fontSize: 18,color:"#ff632f" }} />
        </Box>
      ),
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
