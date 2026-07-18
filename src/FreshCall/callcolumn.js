import { useMemo } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import { Box } from "@mui/joy";
import { format, isValid } from "date-fns";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Tooltip from "@mui/material/Tooltip";

export const TastkColumns = (openLead, isMobile = false) => {
  const mobileColumns = [
    {
      field: "customer_name",
      headerName: "Customer Name",
      minWidth: 180,
      flex: 1,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" spacing={0.7}>
          <Typography
            sx={{ fontSize: 12 }}
            variant="body2"
            fontWeight={900}
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
      ),
    },
    {
      field: "action",
      headerName: "Call",
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            openLead(params.row);
          }}
          sx={{
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            cursor: "pointer",
          }}
        >
          <CallIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
            Call
          </Typography>
        </Box>
      ),
    },
  ];

  const desktopColumns = [
    {
      field: "customer_name",
      headerName: "Customer Name",
      minWidth: 180,
      flex: 1,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" spacing={0.7}>
          {row.is_previous_customer === 1 && (
            <Tooltip placement="top" title="Returning Customer">
              <SupportAgentIcon
                sx={{
                  fontSize: 18,
                  color: "#ff730e",
                }}
              />
            </Tooltip>
          )}
          <Typography
            sx={{ fontSize: 12 }}
            variant="body2"
            fontWeight={900}
            color="#0f172a"
          >
            {row.customer_name}
          </Typography>

        </Stack>
      ),
    },
    {
      field: "model",
      headerName: "Model",
      minWidth: 140,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 12 }} variant="body2" color="#475569" fontWeight={900}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "known_policy_expiry_date",
      headerName: "Expiry Date",
      minWidth: 140,
      flex: 0.8,
      renderCell: ({ value }) => {
        const formattedDate =
          value && isValid(new Date(value))
            ? format(new Date(value), "MMMM d, yyyy")
            : "-";

        return (
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              sx={{ fontSize: 12 }}
              fontWeight={900}
              color="#475569"
            >
              {formattedDate}
            </Typography>
          </Stack>
        );
      },
    },
    {
      field: "registration_number",
      headerName: "Vehicle Reg No",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontSize: 12 }}
          fontWeight={900}
          color="#475569"
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Call",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            openLead(params.row);
          }}
          sx={{
            color: "#2563eb",
            fontSize: 12,
            display: "flex",
            gap: 1,
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <CallIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" fontWeight={700} color="#475569">
            Call
          </Typography>
        </Box>
      ),
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};