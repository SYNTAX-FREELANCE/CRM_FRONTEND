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
  Divider,
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
    <Box
      sx={{
  height: "95vh",
  overflow: "hidden",
  background: `
    radial-gradient(circle at top left, rgba(37,99,235,.18), transparent 30%),
    radial-gradient(circle at top right, rgba(249,115,22,.18), transparent 30%),
    radial-gradient(circle at bottom left, rgba(59,130,246,.12), transparent 25%),
    linear-gradient(135deg,#eef5ff 0%,#f8fbff 45%,#fff7ef 100%)
  `,
}}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow: "0 18px 50px rgba(15, 23, 42, 0.10)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "rgba(255,255,255,0.58)",
          backdropFilter: "blur(18px)",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid rgba(255,255,255,0.6)",
            background:
              "linear-gradient(90deg, rgba(219,234,254,0.72) 0%, rgba(255,255,255,0.68) 50%, rgba(255,237,213,0.72) 100%)",
            flex: "0 0 auto",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={900} color="#0f172a">
                Task Queue
              </Typography>
              <Typography variant="body2" color="#475569">
                Process 10 leads at a time, update status, and auto-pull the next task
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              sx={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 55%, #f97316 140%)",
                textTransform: "none",
                fontWeight: 800,
                borderRadius: 3,
                px: 2.5,
                boxShadow: "0 10px 24px rgba(37,99,235,0.24)",
              }}
            >
              Load Next Queue
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
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.7)",
                    background: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
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
                  borderRadius: 2.5,
                  bgcolor: statusFilter === status ? "#1d4ed8" : "rgba(255,255,255,0.72)",
                  color: statusFilter === status ? "#fff" : "#334155",
                  border: "1px solid rgba(148,163,184,0.22)",
                  backdropFilter: "blur(8px)",
                  boxShadow: statusFilter === status ? "0 8px 18px rgba(37,99,235,0.22)" : "none",
                  "&:hover": {
                    bgcolor: statusFilter === status ? "#1d4ed8" : "rgba(255,255,255,0.92)",
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
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.68)",
              background: "rgba(255,255,255,0.62)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
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
                backgroundColor: "transparent",
                "& .MuiDataGrid-columnHeaders": {
                  background:
                    "linear-gradient(90deg, rgba(219,234,254,0.72), rgba(255,247,237,0.72))",
                  minHeight: "36px !important",
                  maxHeight: "36px !important",
                  borderBottom: "1px solid rgba(226,232,240,0.9)",
                },
                "& .MuiDataGrid-columnHeader": {
                  padding: "0 8px",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#334155",
                },
                "& .MuiDataGrid-cell": {
                  padding: "0 8px",
                  fontSize: "13px",
                  color: "#0f172a",
                  outline: "none !important",
                  borderBottom: "1px solid rgba(241,245,249,0.85)",
                },
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(37,99,235,0.06)",
                  },
                },
                "& .MuiDataGrid-footerContainer": {
                  minHeight: "40px",
                  background: "rgba(255,255,255,0.7)",
                  borderTop: "1px solid rgba(226,232,240,0.9)",
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
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.16)",
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

        <DialogContent dividers sx={{ backgroundColor: "rgba(248,251,255,0.7)" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
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
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
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
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
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
                    <Divider />
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