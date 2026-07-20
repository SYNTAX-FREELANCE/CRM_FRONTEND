import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { axioslogin } from "../Connection/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeMode } from "../Context/ThemeContext";


const LeadDetailsDrawer = lazy(() =>
  import("./LeadDetailsDrawer")
);

export default function FreshCallsWorkspace() {


  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === "dark";

  const [selectedLead, setSelectedLead] = useState({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(1);
  const [drawerLoaded, setDrawerLoaded] = useState(false);

  const authUser = getAuthUser();

  const { state } = useLocation();
  const Status = state?.status
  const LeadId = state?.leadId
  const openedRef = useRef(false);


  const { id } = authUser ?? {};

  const queryClient = useQueryClient();

  const { data: LeadMasterDetail } = useLeadMaster();

  const { data: FreshCalls = [], isLoading: LoadingTableData, refetch } = useGetMyActiveCalls(id, statusFilter);

  const openLead = useCallback((lead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
    setDrawerLoaded(true);
  }, []);


  const getFreshCalls = useCallback(async () => {
    if (!id) return warningNotify("Employee Id is missing Please Login Again");
    if (FreshCalls?.length > 0 && statusFilter !== 1) return infoNotify("Please Complete the First Batch Before Fetching")
    try {
      const response = await axioslogin.get(`/lead/get-fresh-lead/${id}`);
      const { success, data, message } = response.data;
      if (success === 0) return infoNotify(message);
      queryClient.invalidateQueries({ queryKey: ["mycalls", id, statusFilter], });
      await refetch()
      successNotify(message || "Next Batch Fetched Successfully");
    } catch (error) {
      errorNotify("Error in Fetching Next Queue..!", error);
    }
  }, [id, FreshCalls, statusFilter, queryClient, statusFilter]);

  const isMobile = useMediaQuery("(max-width:600px)");

  const columns = useMemo(() => TastkColumns(openLead, isMobile), [openLead, isMobile]);

  const ActiveStatus = useMemo(() => {
    if (!Array.isArray(LeadMasterDetail)) return [];
    return LeadMasterDetail.filter(stat => stat.is_active === 1);
  }, [LeadMasterDetail]);

  const filteredRows = useMemo(() => {
    if (!Array.isArray(FreshCalls)) return [];
    if (statusFilter === 1) return FreshCalls;
    return FreshCalls.filter((lead) => lead.status_id === statusFilter);
  }, [FreshCalls, statusFilter]);

  useEffect(() => {
    if (Status) setStatusFilter(Status);
    if (openedRef.current) return;
    if (!filteredRows?.length) return;

    if (!LeadId) {

      openedRef.current = true;
      navigate(".", { replace: true, state: null });
      return
    };



    const lead = filteredRows.find((item) => item.lead_id === LeadId);

    if (lead) {
      setSelectedLead(lead);
      setDetailOpen(true);
      setDrawerLoaded(true);
      openedRef.current = true;

      navigate(".", { replace: true, state: null });
    }
  }, [LeadId, Status, filteredRows, navigate]);


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
        background: isDark
            ? `
              radial-gradient(circle at 15% 25%, rgba(30, 41, 59, 0.4) 0%, transparent 45%),
              radial-gradient(circle at 85% 75%, rgba(15, 23, 42, 0.6) 0%, transparent 45%),
              linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)
            `
            : `
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
          border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.65)",
          boxShadow: isDark ? "0 20px 40px rgba(0, 0, 0, 0.6)" : "0 20px 40px rgba(15, 23, 42, 0.05)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          background: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(24px)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2.5,
            borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(226, 232, 240, 0.6)",
            background: isDark ? "rgba(15, 23, 42, 0.4)" : "rgba(255, 255, 255, 0.35)",
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
              <Typography variant="h5" fontWeight={900} color={isDark ? "#f8fafc" : "#0f172a"} sx={{ letterSpacing: "-0.5px" }}>
                Task Queue
              </Typography>
              <Typography variant="body2" color={isDark ? "#94a3b8" : "#475569"} sx={{ mt: 0.5, fontWeight: 500 }}>
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
                    width: { xs: "calc(50% - 8px)", sm: "125px" },
                    py: 2,
                    borderColor: isActive ? (isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1") : (isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"),
                    backgroundColor: isActive ? (isDark ? "#2563eb" : "#b3c8ff") : (isDark ? "#1e293b" : "#ffffff"),
                    color: isActive ? (isDark ? "#ffffff" : "#334155") : (isDark ? "#94a3b8" : "#334155"),
                    boxShadow: isActive ? (isDark ? "0 4px 10px rgba(0, 0, 0, 0.4)" : "0 4px 10px rgba(15, 23, 42, 0.08)") : "none",
                    transform: isActive ? "translateY(-1px)" : "none",
                    "&:hover": {
                      backgroundColor: isDark ? "#2d3748" : "#f8fafc",
                      transform: "translateY(-1px)",
                      boxShadow: isDark ? "0 4px 10px rgba(0, 0, 0, 0.4)" : "0 4px 10px rgba(15, 23, 42, 0.06)",
                    },
                    "& .MuiChip-label": {
                      textAlign: "center",
                      width: "100%",
                    },
                  }}
                />
              );
            })}

            <Typography variant="body2"
              sx={{ alignSelf: "center", ml: "auto", color: isDark ? "#94a3b8" : "#475569", fontWeight: 700 }}>
              Showing {filteredRows?.length} records
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
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.55)",
              background: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(16px)",
              boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.3)" : "0 10px 30px rgba(15, 23, 42, 0.02)",
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
              loading={LoadingTableData}
              slotProps={{
                loadingOverlay: {
                  variant: "skeleton",
                  noRowsVariant: "skeleton",
                },
              }}
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
                color: isDark ? "#cbd5e1" : "inherit",
                "& .MuiDataGrid-columnHeaders": {
                  background: isDark ? "#1e293b" : "rgba(248, 250, 252, 0.55)",
                  minHeight: "44px !important",
                  maxHeight: "44px !important",
                  borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(226, 232, 240, 0.6)",
                },
                "& .MuiDataGrid-columnHeader": {
                  padding: "0 12px",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 800,
                  color: isDark ? "#cbd5e1" : "#475569",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                },
                "& .MuiDataGrid-cell": {
                  padding: "0 12px",
                  borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(226, 232, 240, 0.4)",
                  outline: "none !important",
                  color: isDark ? "#cbd5e1" : "inherit",
                },
                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                  background: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.15)",
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    backgroundColor: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.04)",
                  },
                },
                "& .MuiDataGrid-footerContainer": {
                  minHeight: "44px",
                  borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(226, 232, 240, 0.6)",
                  background: isDark ? "#1e293b" : "rgba(248, 250, 252, 0.55)",
                  color: isDark ? "#cbd5e1" : "inherit",
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflowY: "auto",
                },
                "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-actions svg": {
                  color: isDark ? "#cbd5e1" : "inherit",
                }
              }}
            />
          </Paper>
        </Box>
      </Paper>
      <Suspense fallback={null}>
        {
          drawerLoaded &&
          <LeadDetailsDrawer
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            selectedLead={selectedLead}
          />
        }
      </Suspense>
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