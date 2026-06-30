import { useMemo } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import { Box } from "@mui/joy";

export const TastkColumns = (openLead, isMobile = false) => {
  const mobileColumns = [
    {
      field: "customer_name",
      headerName: "Customer Name",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 12 }} variant="body2" fontWeight={700} color="#0f172a">
          {params.value || "-"}
        </Typography>
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
      renderCell: (params) => (
        <Typography sx={{ fontSize: 12 }} variant="body2" fontWeight={600} color="#0f172a">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "district",
      headerName: "Place",
      minWidth: 140,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 12 }} variant="body2" color="#475569" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "city",
      headerName: "City",
      minWidth: 110,
      flex: 0.8,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography sx={{ fontSize: 12 }} variant="body2" fontWeight={600} color="#475569">
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "registration_number",
      headerName: "Vehicle Reg No",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,.4)",
            border: "1px solid rgba(255,255,255,.6)",
            color: "#334155",
            fontWeight: 800,
            borderRadius: "6px",
            fontSize: "11px",
          }}
        />
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