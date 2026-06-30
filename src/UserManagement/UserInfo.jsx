import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Table,
  Input,
  Select,
  Option,
  Button,
  Modal,
  ModalDialog,
  Divider,
  Sheet,
  Tab,
  TabList,
  Tabs,
  Avatar,
  IconButton,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RingVolumeIcon from "@mui/icons-material/RingVolume";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { axioslogin } from "../Axios/axios";
import { useAuth } from "../Context/AuthContext";

const UserInfo = () => {
  const { user } = useAuth();
  
  // Detect original role from AuthContext
  const getInitialRole = () => {
    const roleId = parseInt(user?.role);
    if (roleId === 1) return "Admin";
    if (roleId === 2) return "Team Lead";
    return "Employee";
  };

  // State to support simulator for testing all 3 views
  const [currentRole, setCurrentRole] = useState(getInitialRole());
  
  // Data lists
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  
  // Filter states
  const [filterEmpId, setFilterEmpId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  
  // Performance stats state
  const [timeRange, setTimeRange] = useState("monthly"); // monthly, weekly, datewise
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [perfData, setPerfData] = useState(null);
  const [loadingPerf, setLoadingPerf] = useState(false);
  const [loadingEmps, setLoadingEmps] = useState(false);

  // View details modal
  const [openModal, setOpenModal] = useState(false);

  // Load companies for dropdown filter
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axioslogin.get("/companimast/get-active");
        if (response.data.success === 1) {
          setCompanies(response.data.data);
        }
      } catch (err) {
        console.error("Failed to load companies", err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch employees list (only for Admin and Team Lead)
  const fetchEmployees = async () => {
    if (currentRole === "Employee") return;
    setLoadingEmps(true);
    try {
      // Admin uses filters, Team Lead fetches all without filters
      const params = currentRole === "Admin" ? {
        emp_id: filterEmpId || undefined,
        name: filterName || undefined,
        company_id: filterCompany || undefined
      } : {};

      const response = await axioslogin.get("/userinfo/employees", { params });
      if (response.data.success === 1) {
        const data = response.data.data || [];
        setEmployees(data);
        // Default to first employee's performance if none selected
        if (data.length > 0 && !selectedEmp) {
          setSelectedEmp(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load employees", err);
    } finally {
      setLoadingEmps(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentRole, filterCompany]); // auto refetch on company dropdown change or role swap

  // Fetch performance metrics for the active employee (or self if Employee role)
  useEffect(() => {
    const fetchPerformance = async () => {
      const activeEmpId = currentRole === "Employee" ? user?.id : selectedEmp?.user_id;
      if (!activeEmpId) return;

      setLoadingPerf(true);
      try {
        const response = await axioslogin.get(`/userinfo/performance/${activeEmpId}`, {
          params: {
            range: timeRange,
            fromDate: timeRange === "datewise" ? fromDate : undefined,
            toDate: timeRange === "datewise" ? toDate : undefined
          }
        });
        if (response.data.success === 1) {
          setPerfData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to load performance metrics", err);
      } finally {
        setLoadingPerf(false);
      }
    };
    fetchPerformance();
  }, [selectedEmp, timeRange, fromDate, toDate, currentRole, user]);

  const handleResetFilters = () => {
    setFilterEmpId("");
    setFilterName("");
    setFilterCompany("");
    fetchEmployees();
  };

  const handleViewDetails = (emp) => {
    setSelectedEmp(emp);
    setOpenModal(true);
  };

  // Custom SVG bar chart renderer for premium aesthetics
  const renderSVGChart = (data) => {
    if (!data || !data.chartData) return null;
    
    const chartData = data.chartData;
    const width = 600;
    const height = 240;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 20;
    const paddingRight = 20;
    
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    
    // Find max value for scaling
    const maxVal = Math.max(...chartData.map(d => Math.max(d.calls, d.appointments, d.callbacks || 0))) || 10;
    const scaleY = chartHeight / (maxVal * 1.15);
    const scaleX = chartWidth / chartData.length;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="240px" style={{ background: "transparent" }}>
        <defs>
          <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#ffedd5" />
          </linearGradient>
          <linearGradient id="apptsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#dbeafe" />
          </linearGradient>
          <linearGradient id="callbacksGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const gridVal = Math.round(maxVal * 1.15 * ratio);
          return (
            <g key={idx}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <text x={paddingLeft - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#6b7280" fontWeight="600">{gridVal}</text>
            </g>
          );
        })}

        {/* Chart Bars */}
        {chartData.map((d, idx) => {
          const x = paddingLeft + idx * scaleX + (scaleX - 45) / 2;
          const callsHeight = d.calls * scaleY;
          const apptsHeight = d.appointments * scaleY;
          const callbacksHeight = (d.callbacks || 0) * scaleY;

          return (
            <g key={idx} style={{ transition: "all 0.3s ease" }}>
              {/* Calls Bar */}
              <rect
                x={x}
                y={height - paddingBottom - callsHeight}
                width="14"
                height={callsHeight}
                fill="url(#callsGrad)"
                rx="4"
              />
              {/* Appointments Bar */}
              <rect
                x={x + 16}
                y={height - paddingBottom - apptsHeight}
                width="14"
                height={apptsHeight}
                fill="url(#apptsGrad)"
                rx="4"
              />
              {/* Callbacks Bar */}
              <rect
                x={x + 32}
                y={height - paddingBottom - callbacksHeight}
                width="14"
                height={callbacksHeight}
                fill="url(#callbacksGrad)"
                rx="4"
              />
              
              {/* X Axis Label */}
              <text
                x={paddingLeft + idx * scaleX + scaleX / 2}
                y={height - paddingBottom + 18}
                fontSize="11"
                textAnchor="middle"
                fill="#374151"
                fontWeight="700"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* X Axis Line */}
        <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#d1d5db" strokeWidth="2" />
      </svg>
    );
  };

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3, width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Simulation Bar (Admin/TL/Employee view selection) */}
      <Card variant="outlined" sx={{ py: 1.5, px: 2, bgcolor: "#f8fafc", borderColor: "#cbd5e1" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography level="title-md" fontWeight="800" sx={{ color: "#0f172a" }}>
              Dynamic View Simulator
            </Typography>
            <Typography level="body-xs" sx={{ color: "#64748b" }}>
              Switch roles here to test each specific User Info scenario layout
            </Typography>
          </Box>
          <Tabs
            size="sm"
            value={currentRole}
            onChange={(event, value) => {
              setCurrentRole(value);
              setSelectedEmp(null);
              setPerfData(null);
            }}
            sx={{ borderRadius: "lg", p: 0.5, bgcolor: "#e2e8f0" }}
          >
            <TabList disableUnderline>
              <Tab value="Admin" sx={{ fontWeight: 700 }}>Admin View</Tab>
              <Tab value="Team Lead" sx={{ fontWeight: 700 }}>Team Lead View</Tab>
              <Tab value="Employee" sx={{ fontWeight: 700 }}>Employee View</Tab>
            </TabList>
          </Tabs>
        </Box>
      </Card>

      {/* Main Layout Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: currentRole === "Employee" ? "1fr" : { xs: "1fr", lg: "4fr 5fr" }, gap: 3 }}>
        
        {/* Left Side: Employees List (Only for Admin & Team Lead) */}
        {currentRole !== "Employee" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            
            {/* Filters Bar (Only for Admin) */}
            {currentRole === "Admin" && (
              <Card variant="outlined" sx={{ p: 1.5, borderRadius: "12px", boxShadow: "sm", bgcolor: "#f8fafc" }}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
                  <Input
                    placeholder="Emp ID"
                    size="sm"
                    value={filterEmpId}
                    onChange={(e) => setFilterEmpId(e.target.value)}
                    sx={{ width: 100 }}
                  />
                  <Input
                    placeholder="Name"
                    size="sm"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    sx={{ flex: 1, minWidth: 120 }}
                  />
                  <Select
                    placeholder="Company"
                    size="sm"
                    value={filterCompany}
                    onChange={(e, val) => setFilterCompany(val || "")}
                    sx={{ width: 140 }}
                  >
                    <Option value="">All Companies</Option>
                    {companies.map((c) => (
                      <Option key={c.company_id} value={c.company_id.toString()}>
                        {c.company_name}
                      </Option>
                    ))}
                  </Select>
                  <Button size="sm" startDecorator={<SearchIcon />} onClick={fetchEmployees} sx={{ px: 2 }}>
                    Search
                  </Button>
                  <IconButton size="sm" variant="outlined" color="neutral" onClick={handleResetFilters} title="Reset Filters">
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Card>
            )}

            {/* Employee List Table Card */}
            <Card variant="outlined" sx={{ p: 2, borderRadius: "16px", boxShadow: "sm", overflow: "hidden" }}>
              <Typography level="title-md" sx={{ mb: 2, fontWeight: 800, color: "#1e293b" }}>
                {currentRole} - Employee Roster
              </Typography>
              <Sheet sx={{ overflowX: "auto", borderRadius: "8px", maxHeight: "400px" }}>
                <Table stickyHeader hoverRow size="sm" sx={{ "& th": { bgcolor: "#f1f5f9", fontWeight: 700 } }}>
                  <thead>
                    <tr>
                      <th>Emp ID</th>
                      <th>Name</th>
                      <th>Company</th>
                      <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingEmps ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                          Loading employee roster...
                        </td>
                      </tr>
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                          No employees found.
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp) => (
                        <tr
                          key={emp.user_id}
                          onClick={() => setSelectedEmp(emp)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: selectedEmp?.user_id === emp.user_id ? "rgba(249,115,22,0.08)" : "transparent",
                          }}
                        >
                          <td style={{ fontWeight: 600 }}>{emp.employee_id}</td>
                          <td>{emp.name}</td>
                          <td>{emp.company_name || "N/A"}</td>
                          <td style={{ textAlign: "center" }}>
                            <IconButton
                              size="sm"
                              variant="plain"
                              color="neutral"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(emp);
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Sheet>
            </Card>
          </Box>
        )}

        {/* Right Side: Performance Dashboard & Charts */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          
          {/* Header Card (Active Employee Info summary) */}
          <Card variant="outlined" sx={{ p: 2.5, borderRadius: "16px", boxShadow: "sm", bgcolor: "#ffffff" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar size="lg" variant="soft" color="warning" sx={{ fontWeight: 700 }}>
                {currentRole === "Employee"
                  ? user?.username?.charAt(0).toUpperCase()
                  : selectedEmp?.name?.charAt(0).toUpperCase() || "E"}
              </Avatar>
              <Box>
                <Typography level="h4" fontWeight="800" sx={{ color: "#0f172a" }}>
                  {currentRole === "Employee" ? user?.username : selectedEmp?.name || "Select Employee"}
                </Typography>
                <Typography level="body-sm" sx={{ color: "#64748b", fontWeight: 500 }}>
                  {currentRole === "Employee"
                    ? `Role ID: ${user?.role || "Employee"}`
                    : `${selectedEmp?.role_name || "N/A"} | ID: ${selectedEmp?.employee_id || "N/A"}`}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* Quick Metrics Summary Cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <Card variant="outlined" sx={{ p: 2, borderRadius: "12px", borderLeft: "4px solid #ea580c" }}>
              <Typography level="body-xs" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Total Calls
              </Typography>
              <Typography level="h3" fontWeight="800" sx={{ color: "#ea580c", mt: 0.5 }}>
                {loadingPerf ? "..." : perfData?.summary?.calls || "0"}
              </Typography>
            </Card>
            <Card variant="outlined" sx={{ p: 2, borderRadius: "12px", borderLeft: "4px solid #2563eb" }}>
              <Typography level="body-xs" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Appointments
              </Typography>
              <Typography level="h3" fontWeight="800" sx={{ color: "#2563eb", mt: 0.5 }}>
                {loadingPerf ? "..." : perfData?.summary?.appointments || "0"}
              </Typography>
            </Card>
            <Card variant="outlined" sx={{ p: 2, borderRadius: "12px", borderLeft: "4px solid #16a34a" }}>
              <Typography level="body-xs" sx={{ fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Callbacks
              </Typography>
              <Typography level="h3" fontWeight="800" sx={{ color: "#16a34a", mt: 0.5 }}>
                {loadingPerf ? "..." : perfData?.summary?.callbacks || "0"}
              </Typography>
            </Card>
          </Box>

          {/* Performance Chart & Period Tab Panel */}
          <Card variant="outlined" sx={{ p: 2.5, borderRadius: "16px", boxShadow: "sm" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 1.5 }}>
              <Typography level="title-lg" fontWeight="800" sx={{ color: "#1e293b" }}>
                Employee Performance Sheet
              </Typography>
              
              <Tabs
                size="sm"
                value={timeRange}
                onChange={(event, val) => setTimeRange(val)}
                sx={{ borderRadius: "lg", p: 0.5, bgcolor: "#f1f5f9" }}
              >
                <TabList disableUnderline>
                  <Tab value="datewise" sx={{ fontWeight: 700 }}>Datewise</Tab>
                  <Tab value="weekly" sx={{ fontWeight: 700 }}>Weekly</Tab>
                  <Tab value="monthly" sx={{ fontWeight: 700 }}>Monthly</Tab>
                </TabList>
              </Tabs>
            </Box>

            {/* Date Pickers (Only shows for datewise range) */}
            {timeRange === "datewise" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
                <Typography level="body-sm" fontWeight="600">From:</Typography>
                <Input
                  type="date"
                  size="sm"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  sx={{ width: 140 }}
                />
                <Typography level="body-sm" fontWeight="600">To:</Typography>
                <Input
                  type="date"
                  size="sm"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  sx={{ width: 140 }}
                />
              </Box>
            )}

            {/* Performance charts or lists depending on selection */}
            {loadingPerf ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "240px" }}>
                <Typography>Loading performance sheet...</Typography>
              </Box>
            ) : timeRange === "datewise" && perfData ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
                
                {/* Appointment Details Table */}
                <Box>
                  <Typography level="title-sm" startDecorator={<CalendarMonthIcon />} sx={{ mb: 1.5, fontWeight: 700, color: "#475569" }}>
                    Appointment Details
                  </Typography>
                  <Sheet sx={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Client Name</th>
                          <th>Purpose</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {perfData.appointments?.map((app, idx) => (
                          <tr key={idx}>
                            <td>{app.date ? new Date(app.date).toLocaleDateString() : "N/A"}</td>
                            <td>{app.time}</td>
                            <td style={{ fontWeight: 600 }}>{app.client}</td>
                            <td>{app.purpose}</td>
                            <td>
                              <span style={{
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 700,
                                backgroundColor: app.status === "Completed" ? "#dcfce7" : app.status === "Scheduled" ? "#dbeafe" : "#fee2e2",
                                color: app.status === "Completed" ? "#15803d" : app.status === "Scheduled" ? "#1d4ed8" : "#b91c1c"
                              }}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Sheet>
                </Box>

                {/* Callback Details Table */}
                <Box>
                  <Typography level="title-sm" startDecorator={<RingVolumeIcon />} sx={{ mb: 1.5, fontWeight: 700, color: "#475569" }}>
                    Callback Details
                  </Typography>
                  <Sheet sx={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Client Name</th>
                          <th>Phone</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {perfData.callbacks?.map((cb, idx) => (
                          <tr key={idx}>
                            <td>{cb.date ? new Date(cb.date).toLocaleDateString() : "N/A"}</td>
                            <td>{cb.time}</td>
                            <td style={{ fontWeight: 600 }}>{cb.client}</td>
                            <td>{cb.phone}</td>
                            <td>{cb.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Sheet>
                </Box>
              </Box>
            ) : (
              <Box>
                {/* SVG Chart Render */}
                {renderSVGChart(perfData)}

                {/* Chart Legend */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: "#ea580c", borderRadius: "3px" }} />
                    <Typography level="body-xs" fontWeight="600">Calls</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: "#2563eb", borderRadius: "3px" }} />
                    <Typography level="body-xs" fontWeight="600">Appointments</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: "#16a34a", borderRadius: "3px" }} />
                    <Typography level="body-xs" fontWeight="600">Callbacks</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* View Details Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalDialog variant="outlined" sx={{ width: "100%", maxWidth: "480px", borderRadius: "20px", p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography level="h4" fontWeight="800" startDecorator={<AccountCircleIcon />}>
              Employee Details
            </Typography>
            <IconButton variant="plain" size="sm" color="neutral" onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2.5 }} />

          {selectedEmp && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm" fontWeight="600" sx={{ color: "#64748b" }}>Employee ID</Typography>
                <Typography level="body-sm" fontWeight="700" sx={{ color: "#1e293b" }}>{selectedEmp.employee_id}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm" fontWeight="600" sx={{ color: "#64748b" }}>Full Name</Typography>
                <Typography level="body-sm" fontWeight="700" sx={{ color: "#1e293b" }}>{selectedEmp.name}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm" fontWeight="600" sx={{ color: "#64748b" }}>Company</Typography>
                <Typography level="body-sm" fontWeight="700" sx={{ color: "#1e293b" }}>{selectedEmp.company_name || "N/A"}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm" fontWeight="600" sx={{ color: "#64748b" }}>Designated Role</Typography>
                <Typography level="body-sm" fontWeight="700" sx={{ color: "#1e293b" }}>{selectedEmp.role_name || "N/A"}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm" fontWeight="600" sx={{ color: "#64748b" }}>Age</Typography>
                <Typography level="body-sm" fontWeight="700" sx={{ color: "#1e293b" }}>{selectedEmp.age || "N/A"}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm" fontWeight="600" sx={{ color: "#64748b" }}>Total Experience</Typography>
                <Typography level="body-sm" fontWeight="700" sx={{ color: "#1e293b" }}>{selectedEmp.experience || "N/A"}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm" fontWeight="600" sx={{ color: "#64748b" }}>Date of Join</Typography>
                <Typography level="body-sm" fontWeight="700" sx={{ color: "#1e293b" }}>
                  {selectedEmp.date_of_join ? new Date(selectedEmp.date_of_join).toLocaleDateString() : "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography level="body-sm" fontWeight="600" sx={{ color: "#64748b" }}>Mobile Number</Typography>
                <Typography level="body-sm" fontWeight="700" sx={{ color: "#1e293b" }}>{selectedEmp.mobile_number_1 || "N/A"}</Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2.5 }} />
          <Button size="md" variant="solid" color="neutral" fullWidth onClick={() => setOpenModal(false)}>
            Close Details
          </Button>
        </ModalDialog>
      </Modal>

    </Box>
  );
};

export default UserInfo;
