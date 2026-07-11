import { Typography, Chip, Stack } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { Box } from "@mui/joy";
import { format } from "date-fns";

export const EmployeeBatchColumns = (openEmployee, isMobile = false) => {
  const mobileColumns = [
    {
      field: "name",
      headerName: "Employee",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
          }}
        >
          <PersonOutlineOutlinedIcon
            sx={{
              fontSize: 18,
              color: "#2563eb",
            }}
          />

          <Box>
            <Typography sx={{ fontSize: 12 }} fontWeight={700} color="#0f172a">
              {params.row.name}
            </Typography>
            <Typography sx={{ fontSize: 8 }} fontWeight={400} color="#0f172a">
              {params.row.role_name}
            </Typography>
          </Box>
        </Box>
      ),
    },

    {
      field: "pending_leads",
      headerName: "Pending",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: "rgba(249,115,22,.12)",
            color: "#ea580c",
            fontWeight: 700,
            borderRadius: 2,
          }}
        />
      ),
    },

    {
      field: "action",
      headerName: "View",
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            openEmployee(params.row);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            cursor: "pointer",
            color: "#2563eb",
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />

          <Typography fontWeight={700} sx={{ fontSize: 12 }}>
            View
          </Typography>
        </Box>
      ),
    },
  ];

  const desktopColumns = [
    {
      field: "name",
      headerName: "Employee",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.2} alignItems="center">
          <PersonOutlineOutlinedIcon
            sx={{
              fontSize: 18,
              color: "#2563eb",
            }}
          />

          <Stack spacing={0.2}>
            <Typography sx={{ fontSize: 12 }} fontWeight={700} color="#0f172a">
              {params.row.name}
            </Typography>

            <Typography sx={{ fontSize: 11 }} color="#64748b">
              {params.row.role_name}
            </Typography>
          </Stack>
        </Stack>
      ),
    },

    {
      field: "employee_id",
      headerName: "Employee ID",
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <BadgeOutlinedIcon
            sx={{
              fontSize: 16,
              color: "#f97316",
            }}
          />

          <Typography sx={{ fontSize: 12 }} fontWeight={700} color="#475569">
            {params.value}
          </Typography>
        </Stack>
      ),
    },

    {
      field: "current_batch",
      headerName: "Current Batch",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={`Batch ${params.value}`}
          size="small"
          sx={{
            bgcolor: "rgba(37,99,235,.10)",
            color: "#2563eb",
            fontWeight: 700,
            borderRadius: 2,
          }}
        />
      ),
    },

    {
      field: "pending_leads",
      headerName: "Pending",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: "rgba(249,115,22,.12)",
            color: "#ea580c",
            fontWeight: 700,
            borderRadius: 2,
          }}
        />
      ),
    },

    {
      field: "batch_assigned_at",
      headerName: "Assigned",
      minWidth: 170,
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 12 }} fontWeight={600} color="#475569">
          {params.value
            ? format(new Date(params.value), "dd MMM yyyy, hh:mm a")
            : "-"}
        </Typography>
      ),
    },

    {
      field: "action",
      headerName: "View Details",
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            openEmployee(params.row);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            color: "#2563eb",
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />

          <Typography sx={{ fontSize: 12 }} fontWeight={700}>
            View
          </Typography>
        </Box>
      ),
    },
  ];

  return isMobile ? mobileColumns : desktopColumns;
};
