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
import { groupedData, groupLeadData, summaryData } from "../CommonCode/Reusable";
import { useGetMyEmployeeActiveCalls, useLeadMaster } from "../CommonCode/useQuery";
import { errorNotify, getAuthUser, infoNotify, successNotify, warningNotify } from "../constant/Constant";
import { TastkColumns } from "./callcolumn";
import { axioslogin } from "../Connection/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import StatusFilterCard from "./Components/StatusFilterCard";


const LeadDetailsDrawer = lazy(() =>
  import("./LeadDetailsDrawer")
);

export default function FreshCallsWorkspace() {


  const navigate = useNavigate()

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

  const {
    data: AllCallDetails = [],
    isLoading: LoadingTableData,
    refetch
  } = useGetMyEmployeeActiveCalls(id);

  const openLead = useCallback(async (lead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
    setDrawerLoaded(true);

    if (
      statusFilter === 1 &&
      lead?.work_status === "IN_PROGRESS"
    ) {
      try {
        const { data } = await axioslogin.post("/lead/update-fetchStatus", {
          lead_id: lead.lead_id,
          edited_by: id,
        });

        if (data.success !== 1) {
          return warningNotify(data.message);
        }

        await refetch();
      } catch (error) {
        errorNotify("Error changing work status");
      }
    }
  }, [id, statusFilter, refetch]);


  const getFreshCalls = useCallback(async () => {
    if (!id) return warningNotify("Employee Id is missing Please Login Again");
    if (AllCallDetails?.length > 0 && statusFilter !== 1) return infoNotify("Please Complete the First Batch Before Fetching")
    try {
      const response = await axioslogin.get(`/lead/get-fresh-lead/${id}`);
      const { success, data, message } = response.data;
      if (success === 0) return infoNotify(message);
      queryClient.invalidateQueries({ queryKey: ["emp-mycalls", id] });
      await refetch()
      successNotify(message || "Next Batch Fetched Successfully");
    } catch (error) {
      errorNotify("Error in Fetching Next Queue..!", error);
    }
  }, [id, AllCallDetails, statusFilter, queryClient, statusFilter]);

  const isMobile = useMediaQuery("(max-width:600px)");

  const columns = useMemo(() => TastkColumns(openLead, isMobile), [openLead, isMobile]);

  const ActiveStatus = useMemo(() => {
    if (!Array.isArray(LeadMasterDetail)) return [];
    return LeadMasterDetail.filter(stat => stat.is_active === 1);
  }, [LeadMasterDetail]);

  const customStatuses = [
    {
      status_id: -1,
      display_order: 3,
      status_name: "PENDING",
    },
    {
      status_id: -2,
      display_order: 2,
      status_name: "REMINDER",
    },
    {
      status_id: -3,
      display_order: 3,
      status_name: "RENEWAL",
    }
  ];

  const DisplayStatus = useMemo(() => {
    return [...(ActiveStatus || []), ...customStatuses].sort(
      (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999)
    );
  }, [ActiveStatus]);

  const groupedData = useMemo(
    () => groupLeadData(AllCallDetails, ActiveStatus),
    [AllCallDetails, ActiveStatus]
  );

  const statusCount = useMemo(() => {
    const counts = {};
    Object.keys(groupedData).forEach((key) => {
      counts[key] = groupedData[key].length;
    });
    return counts;
  }, [groupedData]);


  const filteredRows = useMemo(() => {
    return groupedData[statusFilter] || [];
  }, [groupedData, statusFilter]);

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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(3, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "repeat(5, minmax(0, 1fr))",
                lg: "repeat(6, minmax(0, 1fr))",
                xl: "repeat(10, minmax(0, 1fr))",
              },
              gap: 1,
              width: "100%",
              mb: 2
            }}
          >
            {DisplayStatus?.map((status) => (
              <StatusFilterCard
                key={status.status_id}
                title={status.status_name}
                count={statusCount[status.status_id] || 0}
                active={statusFilter === status.status_id}
                onClick={() => setStatusFilter(status.status_id)}
              />
            ))}

          </Box>

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
                  color: "#0d0f0e",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                },
                "& .MuiDataGrid-cell": {
                  padding: "12px 12px",
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
      <Suspense fallback={null}>
        {
          drawerLoaded &&
          <LeadDetailsDrawer
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            selectedLead={selectedLead}
            setSelectedLead={setSelectedLead}
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