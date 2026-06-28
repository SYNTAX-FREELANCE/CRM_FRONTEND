import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  useMediaQuery,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { DataGrid } from "@mui/x-data-grid";
import DetailRow from "./DetailRow";
import { summaryData } from "../CommonCode/Reusable";
import { useFectchFreshCalls, useGetMyActiveCalls, useLeadMaster } from "../CommonCode/useQuery";
import { errorNotify, getAuthUser, infoNotify, successNotify, warningNotify } from "../constant/Constant";
import { TastkColumns } from "./callcolumn";
import LeadDetailsDialog from "./LeadDetailsDrawer";
import LeadDetailsDrawer from "./LeadDetailsDrawer";
import { axioslogin } from "../Axios/axios";


export default function FreshCallsWorkspace() {
  const [selectedLead, setSelectedLead] = useState({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(1);

  const authUser = getAuthUser();
  const { id } = authUser ?? {};


  const { data: LeadMasterDetail } = useLeadMaster();

  const { data: FreshCalls = [], refetch: refetchmyactivecalls } = useGetMyActiveCalls(id, statusFilter);


  const openLead = (lead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
  };

  const getFreshCalls = async () => {
    console.log("calling");
    if (!id) return warningNotify("Employee Id is missing Please Login Again");
    if (FreshCalls?.length > 0 && statusFilter !== 1) return infoNotify("Please Complete the First Batch Before Fetching")
    try {
      const response = await axioslogin.get(`/lead/get-fresh-lead/${id}`);
      const { success, data, message } = response.data;
      if (success === 0) return infoNotify(message);
      if (success !== 0) return successNotify("Next Batch Fetched Successfully");
      refetchmyactivecalls()
    } catch (error) {
      errorNotify("Error in Fetching Next Queue..!", error);
    }
  };

  const isMobile = useMediaQuery("(max-width:600px)");
  const columns = useMemo(() => TastkColumns(openLead, isMobile), [openLead, isMobile]);

  const ActiveStatus = Array.isArray(LeadMasterDetail)
    ? LeadMasterDetail.filter((stat) => stat.is_active === 1)
    : [];

  const filteredRows = useMemo(() => {
    if (!Array.isArray(FreshCalls)) return [];
    if (statusFilter === 1) return FreshCalls;
    return FreshCalls.filter((lead) => lead.status_id === statusFilter);
  }, [FreshCalls, statusFilter]);


  return (
    <Box
      sx={{
        minHeight: "95vh",
        width: "100%",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
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
          minHeight: "95vh",
          width: "100%",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.05)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(24px)",

        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.5,
            borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
            background: "rgba(255, 255, 255, 0.35)",
            flex: "0 0 auto",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            gap={2}
          >
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
              onClick={getFreshCalls}
              startIcon={<PhoneIcon />}
              sx={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                px: 3,
                py: 1,
                boxShadow: "0 8px 20px rgba(37,99,235,0.18)",
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

        {/* <Box sx={{ px: { xs: 2, md: 3 }, pt: 3, pb: 1, flex: "0 0 auto" }}>
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
                  background: "rgb(255, 255, 255)",
                  // backdropFilter: "blur(12px)",
                  boxShadow: "0 25px 10px rgba(189, 208, 249, 0.3)",
                }}
              >
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                  <Typography variant="caption" color="#475569" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: 10 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={900} sx={{ color: item.color, mt: 1, letterSpacing: "-1px" }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box> */}

        {/* <Box sx={{ px: { xs: 2, md: 3 }, pt: 3, pb: 1, flex: "0 0 auto" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "repeat(5, minmax(0, 1fr))",
                 lg: "repeat(5, minmax(0, 1fr))",
              },
              gap: 2,
              width: "100%",
            }}
          >
            {summaryData.map((item) => (
              <Card
                key={item.label}
                elevation={0}
                sx={{
                  minWidth: 0,
                  borderRadius: 4,
                  border: "1px solid rgba(255, 255, 255, 0.65)",
                  borderLeft: `4px solid ${item.color}`,
                  background: "rgb(255, 255, 255)",
                  boxShadow: "0 25px 10px rgba(189, 208, 249, 0.3)",
                }}
              >
                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                  <Typography
                    variant="caption"
                    color="#475569"
                    fontWeight={800}
                    sx={{ textTransform: "uppercase", letterSpacing: "0.5px", fontSize: 10 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{ color: item.color, mt: 1, letterSpacing: "-1px" }}
                  >
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box> */}

        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            sx={{ mb: 2, alignItems: "center", flex: "0 0 auto" }}
          >
            {(ActiveStatus || []).map((status) => {
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
                    width: { xs: "calc(50% - 8px)", sm: "125px" },
                    py: 2,
                    borderColor: isActive ? "#cbd5e1" : "#e2e8f0",
                    backgroundColor: isActive ? "#b3c8ff" : "#ffffff",
                    color: "#334155",
                    boxShadow: isActive ? "0 4px 10px rgba(15, 23, 42, 0.08)" : "none",
                    transform: isActive ? "translateY(-1px)" : "none",
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

            <Typography variant="body2" sx={{ alignSelf: "center", ml: "auto", color: "#475569", fontWeight: 700 }}>
              Showing {filteredRows.length} records
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              minHeight: 0,
              width: "100%",
              borderRadius: 4,
              overflowX: "hidden",
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
              getRowId={(row) => row.lead_id}
              onRowClick={(params) => openLead(params.row)}
              pageSizeOptions={[5, 10, 25, 50]}
              rowHeight={36}
              columnHeaderHeight={44}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              sx={{
                height: "100%",
                width: "100%",
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
                "& .MuiDataGrid-virtualScroller": {
                  overflowY: "auto",
                },
              }}
            />
          </Paper>
        </Box>
      </Paper>

      <LeadDetailsDrawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        selectedLead={selectedLead}
        refetchFreshCalls={refetchmyactivecalls}
      />
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