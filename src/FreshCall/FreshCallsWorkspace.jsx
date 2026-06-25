import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import DetailRow from "./DetailRow";
import StatusChip from "./StatusChip";
import { leadsSeed, statusOptions, summaryData } from "../CommonCode/Reusable";







export default function FreshCallsWorkspace() {
  const [leads, setLeads] = useState(leadsSeed);
  const [selectedLead, setSelectedLead] = useState(leadsSeed[0]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [followupOpen, setFollowupOpen] = useState(false);
  const [followupStatus, setFollowupStatus] = useState("");
  const [followupDate, setFollowupDate] = useState("");
  const [followupRemarks, setFollowupRemarks] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRows = useMemo(() => {
    if (statusFilter === "All") return leads;
    return leads.filter((lead) => lead.status === statusFilter);
  }, [leads, statusFilter]);

  const openLead = (lead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
  };

  const updateLeadStatus = (status, needFollowUp = false) => {
    if (needFollowUp) {
      setFollowupStatus(status);
      setFollowupOpen(true);
      return;
    }

    setLeads((prev) =>
      prev.map((item) => (item.id === selectedLead.id ? { ...item, status } : item))
    );
    setSelectedLead((prev) => ({ ...prev, status }));
  };

  const saveFollowUp = () => {
    setLeads((prev) =>
      prev.map((item) =>
        item.id === selectedLead.id
          ? {
              ...item,
              status: followupStatus,
              nextFollowUp: followupDate || item.nextFollowUp,
              remarks: followupRemarks || item.remarks,
            }
          : item
      )
    );
    setSelectedLead((prev) => ({
      ...prev,
      status: followupStatus,
      nextFollowUp: followupDate || prev.nextFollowUp,
      remarks: followupRemarks || prev.remarks,
    }));
    setFollowupOpen(false);
    setFollowupDate("");
    setFollowupRemarks("");
    setFollowupStatus("");
  };

  const columns = [
    {
      field: "customerName",
      headerName: "Customer Name",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "mobile",
      headerName: "Mobile Number",
      minWidth: 140,
      flex: 1,
    },
    {
      field: "regNo",
      headerName: "Vehicle Reg No",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "vehicleModel",
      headerName: "Vehicle Model",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "leadAge",
      headerName: "Lead Age",
      minWidth: 110,
      flex: 0.8,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <ScheduleIcon sx={{ fontSize: 16, color: "#f97316" }} />
          {params.value}
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.9,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <EditIcon
          sx={{ cursor: "pointer", color: "#e78910", fontSize: 20 }}
          onClick={(e) => {
            e.stopPropagation();
            openLead(params.row);
          }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ height: "95vh", overflow: "hidden" }}>
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(90deg, #eff6ff 0%, #ffffff 100%)",
            flex: "0 0 auto",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0f172a">
                Fresh Calls
              </Typography>
              <Typography variant="body2" color="#64748b">
                Telecaller workspace with status filters and modal lead details
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              sx={{
                bgcolor: "#1d4ed8",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
              }}
            >
              Get Fresh Tasks
            </Button>
          </Stack>
        </Box>

        <Box sx={{ px: 3, pt: 2, flex: "0 0 auto" }}>
          <Grid container spacing={2}>
            {summaryData.map((item) => (
              <Grid item xs={6} md={2.4} key={item.label}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" color="#64748b">
                      {item.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ color: item.color, mt: 0.5 }}>
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ px: 3, py: 2, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
            {statusOptions.map((status) => (
              <Chip
                key={status}
                label={status}
                clickable
                onClick={() => setStatusFilter(status)}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: statusFilter === status ? "#1d4ed8" : "#f8fafc",
                  color: statusFilter === status ? "#fff" : "#334155",
                  border: "1px solid #e2e8f0",
                  "&:hover": {
                    bgcolor: statusFilter === status ? "#1d4ed8" : "#eff6ff",
                  },
                }}
              />
            ))}
            <Typography
              variant="body2"
              sx={{ alignSelf: "center", ml: "auto", color: "#64748b", fontWeight: 600 }}
            >
              Showing {filteredRows.length} records
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <DataGrid
              rows={filteredRows}
              columns={columns}
              disableRowSelectionOnClick
              onRowClick={(params) => openLead(params.row)}
              pageSizeOptions={[5, 10, 25, 50]}
              rowHeight={34}
              columnHeaderHeight={36}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                    page: 0,
                  },
                },
              }}
              sx={{
                border: "none",
                fontSize: "13px",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f7f7f7",
                  minHeight: "36px !important",
                  maxHeight: "36px !important",
                },
                "& .MuiDataGrid-columnHeader": {
                  padding: "0 8px",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                  fontSize: "13px",
                },
                "& .MuiDataGrid-cell": {
                  padding: "0 8px",
                  fontSize: "13px",
                  outline: "none !important",
                },
                "& .MuiDataGrid-footerContainer": {
                  minHeight: "40px",
                },
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                },
              }}
            />
          </Paper>
        </Box>
      </Paper>

      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
          {selectedLead?.customerName}
          <IconButton
            onClick={() => setDetailOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ backgroundColor: "#f8fbff" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb" }}>
                <CardContent>
                  <Typography fontWeight={800} color="#1d4ed8" sx={{ mb: 1.5 }}>
                    Customer Details
                  </Typography>
                  <Stack spacing={1}>
                    <DetailRow label="Name" value={selectedLead?.customerName} />
                    <DetailRow label="Mobile" value={selectedLead?.mobile} />
                    <DetailRow label="Alternate" value={selectedLead?.alternateMobile} />
                    <DetailRow label="Address" value={selectedLead?.address} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb" }}>
                <CardContent>
                  <Typography fontWeight={800} color="#1d4ed8" sx={{ mb: 1.5 }}>
                    Vehicle Details
                  </Typography>
                  <Stack spacing={1}>
                    <DetailRow label="Reg No" value={selectedLead?.regNo} />
                    <DetailRow label="Model" value={selectedLead?.vehicleModel} />
                    <DetailRow label="Type" value={selectedLead?.vehicleType} />
                    <DetailRow label="Next Follow-up" value={selectedLead?.nextFollowUp} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e5e7eb" }}>
                <CardContent>
                  <Typography fontWeight={800} color="#1d4ed8" sx={{ mb: 1.5 }}>
                    Notes & Remarks
                  </Typography>
                  <Stack spacing={1.2}>
                    <Box>
                      <Typography variant="caption" color="#64748b">
                        Previous Notes
                      </Typography>
                      <Typography color="#0f172a">{selectedLead?.previousNotes}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="#64748b">
                        Important Remarks
                      </Typography>
                      <Typography color="#0f172a">{selectedLead?.remarks}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" flexWrap="wrap" gap={1.2}>
                <Button variant="contained" onClick={() => updateLeadStatus("Call Back", true)} sx={actionBtn}>
                  Call Back
                </Button>
                <Button variant="contained" onClick={() => updateLeadStatus("New")} sx={actionBtn}>
                  New
                </Button>
                <Button variant="contained" onClick={() => updateLeadStatus("Quote", true)} sx={actionBtn}>
                  Quote
                </Button>
                <Button variant="contained" onClick={() => updateLeadStatus("Appointment", true)} sx={actionBtn}>
                  Appointment
                </Button>
                <Button variant="contained" onClick={() => updateLeadStatus("Sold")} sx={actionBtn}>
                  Sold
                </Button>
                <Button variant="contained" onClick={() => updateLeadStatus("Lost")} sx={actionBtn}>
                  Lost
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailOpen(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={followupOpen} onClose={() => setFollowupOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Set Follow-up
          <IconButton
            onClick={() => setFollowupOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Next Follow-up Date & Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={followupDate}
              onChange={(e) => setFollowupDate(e.target.value)}
            />
            <TextField
              label="Remarks"
              multiline
              minRows={3}
              fullWidth
              value={followupRemarks}
              onChange={(e) => setFollowupRemarks(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFollowupOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveFollowUp}
            sx={{ bgcolor: "#f97316", textTransform: "none", fontWeight: 700 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const actionBtn = {
  bgcolor: "#f97316",
  "&:hover": { bgcolor: "#ea580c" },
  textTransform: "none",
  fontWeight: 700,
  borderRadius: 2,
  px: 2,
};