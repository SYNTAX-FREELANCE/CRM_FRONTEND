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
  useTheme,
  TextField,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { groupLeadData, parseDateValue } from "../CommonCode/Reusable";
import { useGetMyEmployeeActiveCalls, useGetMyTargetDetail, useLeadMaster } from "../CommonCode/useQuery";
import { errorNotify, getAuthUser, infoNotify, successNotify, warningNotify } from "../constant/Constant";
import { TastkColumns } from "./callcolumn";
import { axioslogin } from "../Connection/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import StatusFilterCard from "./Components/StatusFilterCard";
import EmployeeTargetCard from "./Components/EmployeeTargetCard";
import { CustomToolbar } from "./Components/CustomToolbar";


const LeadDetailsDrawer = lazy(() =>
  import("./LeadDetailsDrawer")
);

export default function FreshCallsWorkspace() {

  const theme = useTheme();
  const navigate = useNavigate()
  const authUser = getAuthUser();
  const { state } = useLocation();
  const openedRef = useRef(false);
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [selectedDateType, setSelectedDateType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const [selectedLead, setSelectedLead] = useState({});
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(2);
  const [drawerLoaded, setDrawerLoaded] = useState(false);

  const isDark = theme.palette.mode === 'dark';

  const Status = state?.status
  const LeadId = state?.leadId
  const { id, role } = authUser ?? {};

  const isAdmin = role?.toUpperCase() === "ADMIN";

  const { data: LeadMasterDetail = [] } = useLeadMaster();
  const { data: EmployeeTargetDetails = [] } = useGetMyTargetDetail(id);

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

  const columns = useMemo(() => TastkColumns(openLead, isMobile, isDark), [openLead, isMobile, isDark]);

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
    return [...(ActiveStatus || []), ...customStatuses]
      .filter((status) => {
        const statusName = status.status_name?.toUpperCase();
        // Admin should NOT see NEW and PENDING
        if (isAdmin) {
          return statusName !== "NEW" && statusName !== "PENDING";
        }

        // Non-admin users can see all statuses
        return true;
      })
      .sort(
        (a, b) =>
          (a.display_order ?? 999) -
          (b.display_order ?? 999)
      );
  }, [ActiveStatus, isAdmin]);



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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchText]);


  useEffect(() => {
    if (!state) return;

    const targetLeadId = state.lead_id ?? state.leadId;
    const targetStatusId = state.status_id ?? state.status;

    if (targetStatusId != null) {
      setStatusFilter(Number(targetStatusId));
    }

    if (!targetLeadId || !AllCallDetails?.length) return;

    const lead = AllCallDetails?.find(
      (item) => Number(item.lead_id) === Number(targetLeadId)
    );

    if (!lead) return;

    setSelectedLead(lead);
    setDetailOpen(true);
    setDrawerLoaded(true);

    navigate(".", { replace: true, state: null });
  }, [state, AllCallDetails, navigate]);


  const filteredRows = useMemo(() => {
    const search = debouncedSearchText.trim().toLowerCase();


    // --------------------------------------------------
    // SEARCH MODE
    // Search regardless of selected status
    // --------------------------------------------------
    if (search) {
      return AllCallDetails?.filter((row) => {
        const registrationNumber = String(
          row.registration_number || ""
        ).toLowerCase();

        const customerName = String(
          row.customer_name || ""
        ).toLowerCase();

        return (
          registrationNumber.includes(search) ||
          customerName.includes(search)
        );
      });
    }

    // --------------------------------------------------
    // NORMAL STATUS + DATE FILTER
    // --------------------------------------------------
    const statusRows = groupedData[statusFilter] || [];

    if (!selectedDateType || !selectedMonth) {
      return statusRows;
    }

    return statusRows.filter((row) => {
      const date = parseDateValue(row[selectedDateType]);

      if (!date) return false;

      const rowMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      return rowMonth === selectedMonth;
    });
  }, [
    AllCallDetails,
    groupedData,
    statusFilter,
    selectedDateType,
    selectedMonth,
    searchText,
  ]);

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
        minHeight: "90vh",
        width: "100%",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // bgcolor: isDark ? "rgba(30,41,59,0.7)" : "#fff",
        // background: isDark ? "rgba(30,41,59,0.7)" : `
        //   radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
        //   radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
        //   linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
        // `,
      }}
    >
      <Box
        elevation={0}
        sx={{
          minHeight: "95vh",
          width: "100%",
          // border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.85)",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.05)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          // bgcolor: isDark ? "rgba(30,41,59,0.7)" : "#fff",
          backdropFilter: "blur(24px)",
        }}
      >

        <Box
          sx={{
            px: { xs: 2, md: 2.75 },
            py: { xs: 2, md: 2.5 },
            mb: 2.5,
            borderRadius: "26px",
            background: isDark
              ? "linear-gradient(110deg, #102c25 0%, #142f25 100%)"
              : "linear-gradient(110deg, #e8f5ed 0%, #dcefe3 100%)",
            border: isDark
              ? "1px solid rgba(74, 222, 128, 0.08)"
              : "1px solid rgba(22, 101, 52, 0.10)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            flex: "0 0 auto",
          }}
        >
          <Stack
            direction={{ xs: "column", xl: "row" }}
            alignItems={{ xs: "flex-start", xl: "center" }}
            justifyContent="space-between"
            gap={2.5}
            width="100%"
          >
            {/* LEFT - TITLE */}
            <Box
              sx={{
                width: { xs: "100%", xl: "34%" },
                minWidth: 220,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={900}
                sx={{
                  letterSpacing: "-0.5px",
                  color: isDark ? "#f1f5f9" : "#123b2c",
                  fontSize: { xs: 21, md: 25 },
                }}
              >
                Task Queue
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: isDark ? "#a7b9b0" : "#587568",
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                Process assigned leads, update status, and manage client communications.
              </Typography>
            </Box>

            {/* RIGHT - TARGETS + BUTTON */}
            <Box
              sx={{
                display: "flex",
                flex: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {/* TARGET CARDS */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 280,
                  "& > *": {
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "8px",
                    justifyContent: "flex-end",
                  },
                }}
              >
                <EmployeeTargetCard data={EmployeeTargetDetails} />
              </Box>

              {/* NEXT QUEUE */}
              <Button
                variant="contained"
                onClick={getFreshCalls}
                startIcon={<PhoneIcon />}
                sx={{
                  background: "#43dc83",
                  color: "#082c1c",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: 15,
                  borderRadius: "15px",
                  minWidth: 163,
                  px: 2.5,
                  py: 1.5,
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    background: "#35c975",
                    boxShadow: "0 5px 15px rgba(67,220,131,0.2)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Next Queue
              </Button>
            </Box>
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
            // background: isDark
            //   ? "linear-gradient(110deg, #102c25 0%, #142f25 100%)"
            //   : "linear-gradient(110deg, #e8f5ed 0%, #dcefe3 100%)",
            // border: isDark
            //   ? "1px solid rgba(74, 222, 128, 0.08)"
            //   : "1px solid rgba(22, 101, 52, 0.10)",
            // boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            // flex: "0 0 auto",
            borderRadius: 5
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

          <Box
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
              showToolbar
              slots={{
                toolbar: CustomToolbar,
              }}
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
                toolbar: {
                  selectedDateType,
                  setSelectedDateType,
                  selectedMonth,
                  setSelectedMonth,
                  setSearchText,
                  searchText,
                }
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
                fontFamily: "Bahnschrift",
                backgroundColor: "transparent",
                "& .MuiDataGrid-columnHeaders": {

                  bgcolor: isDark ? "linear-gradient(110deg, #102c25 0%, #142f25 100%)" : "linear-gradient(110deg, #e8f5ed 0%, #dcefe3 100%)",
                  minHeight: "44px !important",
                  maxHeight: "44px !important",
                  borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
                  fontFamily: "Bahnschrift",
                },
                "& .MuiDataGrid-columnHeader": {
                  padding: "0 12px",
                  fontFamily: "Bahnschrift",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 800,
                  color: isDark ? "#f8fafc" : "#0f172a",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontFamily: "Bahnschrift",
                },
                "& .MuiDataGrid-cell": {
                  padding: "12px 12px",
                  borderBottom: "1px solid rgba(226, 232, 240, 0.4)",
                  outline: "none !important",
                  fontFamily: "Bahnschrift",
                },
                "& .MuiDataGrid-row": {
                  cursor: "pointer",

                  background: isDark
                    ? "linear-gradient(110deg, rgba(16,44,37,0.96) 0%, rgba(20,47,37,0.92) 55%, rgba(30,65,50,0.88) 100%)"
                    : "linear-gradient(110deg, rgba(232,245,237,0.98) 0%, rgba(220,239,227,0.95) 55%, rgba(245,255,248,0.96) 100%)",

                  boxShadow: isDark
                    ? "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.12)"
                    : "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(34,100,60,0.06)",

                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",

                  transition: "all 0.2s ease",
                  fontFamily: "Bahnschrift",

                  "&:hover": {
                    background: isDark
                      ? "linear-gradient(110deg, #194b3b 0%, #205440 100%)"
                      : "linear-gradient(110deg, #d5f0df 0%, #c5e8d2 100%)",

                    boxShadow: isDark
                      ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 3px 12px rgba(0,0,0,0.18)"
                      : "inset 0 1px 0 rgba(255,255,255,1), 0 3px 12px rgba(34,100,60,0.10)",
                  },
                },
                "& .MuiDataGrid-footerContainer": {
                  minHeight: "44px",
                  borderTop: "1px solid rgba(226, 232, 240, 0.6)",
                  fontFamily: "Bahnschrift",
                  bgcolor: isDark ? "linear-gradient(110deg, #102c25 0%, #142f25 100%)" : "linear-gradient(110deg, #e8f5ed 0%, #dcefe3 100%)",
                },
                "& .MuiDataGrid-virtualScroller": {
                  overflowY: "auto",
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Suspense fallback={null}>
        {
          drawerLoaded &&
          <LeadDetailsDrawer
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            selectedLead={selectedLead}
            setSelectedLead={setSelectedLead}
            statusFilter={statusFilter}
          />
        }
      </Suspense>
    </Box>
  );
}
