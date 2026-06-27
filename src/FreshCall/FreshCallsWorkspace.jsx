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
import { useFectchFreshCalls, useLeadMaster } from "../CommonCode/useQuery";
import { getAuthUser } from "../constant/Constant";

export default function FreshCallsWorkspace() {
  const [leads, setLeads] = useState(leadsSeed);
  const [selectedLead, setSelectedLead] = useState(leadsSeed[0]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [followupOpen, setFollowupOpen] = useState(false);
  const [followupStatus, setFollowupStatus] = useState("");
  const [followupDate, setFollowupDate] = useState("");
  const [followupRemarks, setFollowupRemarks] = useState("");
  const [statusFilter, setStatusFilter] = useState(1);

  const authUser = getAuthUser();
  const { id } = authUser ?? {};

  const { data: LeadMasterDetail } = useLeadMaster();

  const {
    data: FreshCalls,
    refetch: refetchFreshCalls
  } = useFectchFreshCalls(id);


  const ActiveStatus = LeadMasterDetail && Array.isArray(LeadMasterDetail)
    ? LeadMasterDetail?.filter(stat => stat.is_active === 1) : [];
  console.log({
    FreshCalls
  });

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
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={700} color="#0f172a">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "mobile",
      headerName: "Mobile Number",
      minWidth: 140,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color="#475569" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "regNo",
      headerName: "Vehicle Reg No",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            color: "#334155",
            fontWeight: 800,
            borderRadius: "6px",
            fontSize: "11px",
          }}
        />
      ),
    },
    {
      field: "vehicleModel",
      headerName: "Vehicle Model",
      minWidth: 170,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color="#334155" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "leadAge",
      headerName: "Lead Age",
      minWidth: 110,
      flex: 0.8,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" gap={1}>
          <ScheduleIcon sx={{ fontSize: 15, color: "#f97316" }} />
          <Typography variant="body2" fontWeight={700} color="#475569">
            {params.value}
          </Typography>
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
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            openLead(params.row);
          }}
          sx={{
            color: "#2563eb",
            bgcolor: "rgba(37,99,235,0.06)",
            "&:hover": {
              bgcolor: "rgba(37,99,235,0.12)",
            },
          }}
        >
          <EditIcon sx={{ fontSize: 18 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: "95vh",
        // p: { xs: 1.5, md: 3 },
        overflow: "hidden",
        background: `
          radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
          radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
          linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
        `,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.05)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4.5,
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Header bar */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
            background: "rgba(255, 255, 255, 0.35)",
            flex: "0 0 auto",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={900} color="#0f172a" sx={{ letterSpacing: "-0.5px" }}>
                Task Queue
              </Typography>
              <Typography variant="body2" color="#475569" sx={{ mt: 0.5, fontWeight: 500 }}>
                Process assigned leads, update status, and manage client communications.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => refetchFreshCalls()}
              startIcon={<PhoneIcon />}
              sx={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                px: 3,
                py: 1,
                boxShadow: "0 8px 20px rgba(37,99,235,0.18)",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 10px 25px rgba(37,99,235,0.25)",
                },
              }}
            >
              Load Next Queue
            </Button>
          </Stack>
        </Box>

        {/* Metrics Grid */}
        <Box sx={{ px: 3, pt: 3, pb: 1, flex: "0 0 auto" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              flexWrap: { xs: "wrap", md: "nowrap" },
              width: "100%",
            }}
          >
            {summaryData.map((item) => (
              <Card
                key={item.label}
                elevation={0}
                sx={{
                  flex: "1 1 0px",
                  minWidth: { xs: "calc(50% - 8px)", sm: "calc(33.33% - 12px)", md: "0" },
                  borderRadius: 4,
                  border: "1px solid rgba(255, 255, 255, 0.65)",
                  borderLeft: `4px solid ${item.color}`,
                  background: "rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.02)",
                  transition: "all 0.25s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="caption" color="#475569" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ color: item.color, mt: 1, letterSpacing: "-1px" }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Filter and Table Workspace */}
        <Box sx={{ px: 3, py: 2, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2, alignItems: "center" }}>
            {(ActiveStatus || [])?.map((status) => {
              const isActive = statusFilter === status.status_id;

              return (
                <Chip
                  key={status.status_id}
                  label={status.status_name?.toUpperCase()}
                  clickable
                  onClick={() => setStatusFilter(status.status_id)}
                  variant={isActive ? "filled" : "outlined"}
                  sx={{
                    fontWeight: 800,
                    fontSize: "12px",
                    borderRadius: 3.5,
                    color: isActive ? "rgb(253, 253, 253)" : "#000000",
                    width: { xs: "calc(50% - 8px)", sm: "125px" },
                    py: 2,
                    borderColor: isActive ? "#cbd5e1" : "#e2e8f0",
                    backgroundColor: isActive ? "#b3c8ff" : "#ffffff",
                    color: "#334155",
                    boxShadow: isActive ? "0 4px 10px rgba(15, 23, 42, 0.08)" : "none",
                    transform: isActive ? "translateY(-1px)" : "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 10px rgba(15, 23, 42, 0.06)",
                    },
                    "& .MuiChip-label": {
                      textAlign: "center",
                      width: "100%",
                    },
                  }}
                />
              );
            })}
            <Typography
              variant="body2"
              sx={{ alignSelf: "center", ml: "auto", color: "#475569", fontWeight: 700 }}
            >
              Showing {filteredRows.length} records
            </Typography>
          </Stack>

          {/* Leads DataGrid Table */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.55)",
              background: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.02)",
            }}
          >
            <DataGrid
              rows={filteredRows}
              columns={columns}
              disableRowSelectionOnClick
              onRowClick={(params) => openLead(params.row)}
              pageSizeOptions={[5, 10, 25, 50]}
              rowHeight={46}
              columnHeaderHeight={44}
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
                  background: "rgba(248, 250, 252, 0.55)",
                  minHeight: "44px !important",
                  maxHeight: "44px !important",
                  borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
                },
                "& .MuiDataGrid-columnHeader": {
                  padding: "0 12px",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 800,
                  color: "#475569",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                },
                "& .MuiDataGrid-cell": {
                  padding: "0 12px",
                  borderBottom: "1px solid rgba(226, 232, 240, 0.4)",
                  outline: "none !important",
                },
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.15)",
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    backgroundColor: "rgba(37,99,235,0.04)",
                  },
                },
                "& .MuiDataGrid-footerContainer": {
                  minHeight: "44px",
                  borderTop: "1px solid rgba(226, 232, 240, 0.6)",
                  background: "rgba(248, 250, 252, 0.55)",
                },
              }}
            />
          </Paper>
        </Box>
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4.5,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(32px)",
            border: "1px solid rgba(255, 255, 255, 0.65)",
            boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ pr: 6, borderBottom: "1px solid rgba(255, 255, 255, 0.5)", py: 2, background: "rgba(255, 255, 255, 0.2)" }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#2563eb", boxShadow: "0 0 10px rgba(37,99,235,0.6)" }} />
            <Typography variant="h6" fontWeight={900} color="#0f172a" sx={{ letterSpacing: "-0.5px" }}>
              Lead Details - {selectedLead?.customerName}
            </Typography>
          </Stack>
          <IconButton
            onClick={() => setDetailOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12, color: "#64748b" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 3,
            background: `
              radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 45%),
              radial-gradient(circle at 90% 80%, rgba(249, 115, 22, 0.12) 0%, transparent 45%),
              linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
            `,
          }}
        >
          <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
            {/* Customer Profile (Blue glass tint) */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ height: "100%", borderRadius: 3.5, border: "1px solid rgba(59, 130, 246, 0.22)", background: "rgba(239, 246, 255, 0.55)", backdropFilter: "blur(12px)", boxShadow: "none" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography fontWeight={800} color="#2563eb" sx={{ mb: 2, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Customer Profile
                  </Typography>
                  <Stack spacing={0.5}>
                    <DetailRow label="Name" value={selectedLead?.customerName} />
                    <DetailRow label="Mobile" value={selectedLead?.mobile} />
                    <DetailRow label="Alternate No" value={selectedLead?.alternateMobile} />
                    <DetailRow label="Address" value={selectedLead?.address} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Vehicle Specification (Orange glass tint) */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ height: "100%", borderRadius: 3.5, border: "1px solid rgba(249, 115, 22, 0.22)", background: "rgba(255, 247, 237, 0.55)", backdropFilter: "blur(12px)", boxShadow: "none" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography fontWeight={800} color="#ea580c" sx={{ mb: 2, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Vehicle Specification
                  </Typography>
                  <Stack spacing={0.5}>
                    <DetailRow label="Registration No" value={selectedLead?.regNo} />
                    <DetailRow label="Vehicle Model" value={selectedLead?.vehicleModel} />
                    <DetailRow label="Vehicle Type" value={selectedLead?.vehicleType} />
                    <DetailRow label="Next Follow-up" value={selectedLead?.nextFollowUp} />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Notes & Remarks (Translucent white glass) */}
            <Grid item xs={12}>
              <Card elevation={0} sx={{ borderRadius: 3.5, border: "1px solid rgba(255, 255, 255, 0.65)", background: "rgba(255,255,255,0.35)", backdropFilter: "blur(12px)", boxShadow: "none" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography fontWeight={800} color="#2563eb" sx={{ mb: 2, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Notes & Remarks
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ textTransform: "uppercase" }}>
                        Previous Notes
                      </Typography>
                      <Typography variant="body2" color="#334155" sx={{ mt: 0.5 }}>
                        {selectedLead?.previousNotes || "No previous interaction notes recorded."}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: "rgba(0,0,0,0.06)" }} />
                    <Box>
                      <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ textTransform: "uppercase" }}>
                        Current Status Remarks
                      </Typography>
                      <Typography variant="body2" color="#334155" sx={{ mt: 0.5 }}>
                        {selectedLead?.remarks || "No remarks entered."}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Disposition Actions */}
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ display: "block", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Update Disposition Status
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1.2}>
                <Button
                  variant="outlined"
                  onClick={() => updateLeadStatus("Call Back", true)}
                  sx={{
                    ...actionBtnStyle,
                    color: "#ea580c",
                    bgcolor: "rgba(249, 115, 22, 0.08)",
                    borderColor: "rgba(249, 115, 22, 0.3)",
                    "&:hover": { bgcolor: "rgba(249, 115, 22, 0.15)", borderColor: "rgba(249, 115, 22, 0.5)" }
                  }}
                >
                  Call Back
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => updateLeadStatus("New")}
                  sx={{
                    ...actionBtnStyle,
                    color: "#2563eb",
                    bgcolor: "rgba(37, 99, 235, 0.08)",
                    borderColor: "rgba(37, 99, 235, 0.3)",
                    "&:hover": { bgcolor: "rgba(37, 99, 235, 0.15)", borderColor: "rgba(37, 99, 235, 0.5)" }
                  }}
                >
                  New
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => updateLeadStatus("Quote", true)}
                  sx={{
                    ...actionBtnStyle,
                    color: "#4f46e5",
                    bgcolor: "rgba(79, 70, 229, 0.08)",
                    borderColor: "rgba(79, 70, 229, 0.3)",
                    "&:hover": { bgcolor: "rgba(79, 70, 229, 0.15)", borderColor: "rgba(79, 70, 229, 0.5)" }
                  }}
                >
                  Quote
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => updateLeadStatus("Appointment", true)}
                  sx={{
                    ...actionBtnStyle,
                    color: "#9333ea",
                    bgcolor: "rgba(147, 51, 234, 0.08)",
                    borderColor: "rgba(147, 51, 234, 0.3)",
                    "&:hover": { bgcolor: "rgba(147, 51, 234, 0.15)", borderColor: "rgba(147, 51, 234, 0.5)" }
                  }}
                >
                  Appointment
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => updateLeadStatus("Sold")}
                  sx={{
                    ...actionBtnStyle,
                    color: "#16a34a",
                    bgcolor: "rgba(22, 163, 74, 0.08)",
                    borderColor: "rgba(22, 163, 74, 0.3)",
                    "&:hover": { bgcolor: "rgba(22, 163, 74, 0.15)", borderColor: "rgba(22, 163, 74, 0.5)" }
                  }}
                >
                  Sold
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => updateLeadStatus("Lost")}
                  sx={{
                    ...actionBtnStyle,
                    color: "#dc2626",
                    bgcolor: "rgba(239, 68, 68, 0.08)",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    "&:hover": { bgcolor: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.5)" }
                  }}
                >
                  Lost
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: "1px solid rgba(255, 255, 255, 0.5)", background: "rgba(255, 255, 255, 0.2)" }}>
          <Button onClick={() => setDetailOpen(false)} sx={{ textTransform: "none", color: "#64748b", fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Follow-up Scheduler Modal Dialog */}
      <Dialog
        open={followupOpen}
        onClose={() => setFollowupOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, borderBottom: "1px solid rgba(226, 232, 240, 0.6)", pb: 2 }}>
          Set Follow-up Details
          <IconButton
            onClick={() => setFollowupOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12, color: "#64748b" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5}>
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
              placeholder="Enter context/remarks for follow-up..."
              multiline
              minRows={3}
              fullWidth
              value={followupRemarks}
              onChange={(e) => setFollowupRemarks(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: "1px solid rgba(226, 232, 240, 0.6)" }}>
          <Button onClick={() => setFollowupOpen(false)} sx={{ textTransform: "none", color: "#64748b", fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveFollowUp}
            sx={{
              bgcolor: "#2563eb",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              borderRadius: 2,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Save Follow-up
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

const actionBtnStyle = {
  textTransform: "none",
  fontWeight: 700,
  borderRadius: 2.5,
  px: 2.5,
  py: 0.8,
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
  },
};