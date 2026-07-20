import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, CircularProgress, Divider } from "@mui/joy";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import TableChartIcon from "@mui/icons-material/TableChart";
import StorageIcon from "@mui/icons-material/Storage";
import FileOpenIcon from "@mui/icons-material/FileOpen";

import Wrapper from "../../Settings/CommonMasterComponent/Wrapper";
import Panel from "../../Settings/CommonMasterComponent/Panel";
import Button from "../../Settings/CommonMasterComponent/Button";
import ButtonWrapper from "../../Settings/CommonMasterComponent/ButtonWrapper";
import Toast from "../../Settings/CommonMasterComponent/Toast";
import FormRow from "../../Settings/CommonMasterComponent/FormRow";
import InputLg from "../../Settings/CommonMasterComponent/InputLg";
import Checkbox from "../../Settings/CommonMasterComponent/Checkbox";

import { errorNotify, successNotify, warningNotify } from "../../constant/Constant";
import { axioslogin } from "../../Connection/axios";
import { useCustomerMaster, useVehicleMaster } from "../../CommonCode/useQuery";
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    return dateStr;
  }
};

const Uploadmaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: customerList, refetch: fetchCustomerMaster } = useCustomerMaster();
  const { refetch: fetchVehicleMaster } = useVehicleMaster();

  const { mode, id, type } = location.state || {};

  // Form states for editing
  const [customer, setCustomer] = useState({
    customer_name: "",
    mobile_number_1: "",
    mobile_number_2: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    is_active: "Active"
  });

  const [vehicle, setVehicle] = useState({
    customer_id: "",
    registration_number: "",
    rto: "",
    registration_data: "",
    model: "",
    vehicle_maker: "",
    engine_number: "",
    chassis_number: "",
    vehicle_class: "",
    vehicle_category: "",
    fuel_type: "",
    seat_capacity: ""
  });

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [uploadResult, setUploadResult] = useState(null);


  // Fetch record on mount if in edit mode
  useEffect(() => {
    if (mode === "edit" && id && type) {
      const fetchRecord = async () => {
        setLoading(true);
        try {
          const url = type === "customer"
            ? `/customer/getbyid/${id}`
            : `/customer/getbyid-vehicle/${id}`;

          const response = await axioslogin.get(url);
          const { success, data, message } = response.data;

          if (success === 1) {
            if (type === "customer") {
              setCustomer({
                customer_name: data.customer_name || "",
                mobile_number_1: data.mobile_number_1 || "",
                mobile_number_2: data.mobile_number_2 || "",
                email: data.email || "",
                address: data.address || "",
                city: data.city || "",
                district: data.district || "",
                state: data.state || "",
                pincode: data.pincode || "",
                is_active: data.is_active === 1 ? "Active" : "Inactive"
              });
            } else {
              setVehicle({
                customer_id: data.customer_id || "",
                registration_number: data.registration_number || "",
                rto: data.rto || "",
                registration_data: formatDate(data.registration_date),
                model: data.model || "",
                vehicle_maker: data.vehicle_maker || "",
                engine_number: data.engine_number || "",
                chassis_number: data.chassis_number || "",
                vehicle_class: data.vehicle_class || "",
                vehicle_category: data.vehicle_category || "",
                fuel_type: data.fuel_type || "",
                seat_capacity: data.seat_capacity || ""
              });
            }
          } else {
            errorNotify(message || "Failed to load record details.");
          }
        } catch (err) {
          console.error("Failed to load edit record:", err);
          errorNotify("Error loading record details.");
        } finally {
          setLoading(false);
        }
      };

      fetchRecord();
    }
  }, [mode, id, type]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  }, []);

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    const allowed = ["xlsx", "xls"];

    if (!allowed.includes(ext)) {
      errorNotify("Invalid file type. Only Excel (.xlsx, .xls) files are allowed.");
      return;
    }

    setFile(selectedFile);
    setUploadResult(null); // Clear previous results
    successNotify(`File "${selectedFile.name}" selected!`);
  };

  const handleClear = () => {
    setFile(null);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      warningNotify("Please select a file to upload first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const uploadUrl = "/customer/upload";

    try {
      const response = await axioslogin.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, message, fileType, stats, failedRows, insertedData } = response.data;

      if (success === 1) {
        successNotify(message || "File uploaded and processed successfully!");
        setUploadResult({
          fileType,
          stats,
          failedRows,
          insertedData
        });

        // Refresh both customer and vehicle query caches
        fetchCustomerMaster();
        fetchVehicleMaster();
      } else {
        errorNotify(message || "Failed to process the uploaded file.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errMsg = error.response?.data?.message || "An error occurred during file upload.";
      errorNotify(errMsg);

      // If there are detailed stats / failed rows inside response error
      if (error.response?.data?.stats) {
        setUploadResult({
          fileType: "excel",
          stats: error.response.data.stats,
          failedRows: error.response.data.failedRows || [],
          insertedData: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (type === "customer") {
      if (!customer.customer_name.trim()) {
        warningNotify("Customer Name is required.");
        return;
      }
      if (!customer.mobile_number_1.trim()) {
        warningNotify("Mobile Number 1 is required.");
        return;
      }
      if (!/^\d+$/.test(customer.mobile_number_1)) {
        warningNotify("Mobile Number 1 must be numeric.");
        return;
      }
      if (customer.mobile_number_2 && !/^\d+$/.test(customer.mobile_number_2)) {
        warningNotify("Mobile Number 2 must be numeric.");
        return;
      }

      setLoading(true);
      try {
        const updateData = {
          ...customer,
          is_active: customer.is_active === "Active" ? 1 : 0
        };
        const response = await axioslogin.patch(`/customer/update/${id}`, updateData);
        if (response.data.success === 1) {
          successNotify("Customer updated successfully!");
          fetchCustomerMaster();
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        } else {
          errorNotify(response.data.message || "Failed to update customer.");
        }
      } catch (err) {
        console.error("Update error:", err);
        errorNotify("An error occurred while updating customer.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!vehicle.registration_number.trim()) {
        warningNotify("Registration Number is required.");
        return;
      }
      if (!vehicle.customer_id) {
        warningNotify("Please select a Customer.");
        return;
      }

      setLoading(true);
      try {
        const response = await axioslogin.patch(`/customer/update-vehicle/${id}`, vehicle);
        if (response.data.success === 1) {
          successNotify("Vehicle updated successfully!");
          fetchVehicleMaster();
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        } else {
          errorNotify(response.data.message || "Failed to update vehicle.");
        }
      } catch (err) {
        console.error("Update error:", err);
        errorNotify("An error occurred while updating vehicle.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Navigates to the common grid view with standard customer or vehicle columns
  const handleView = (type) => {
    if (type === "customer") {
      navigate("/home/setting/commonview", {
        state: {
          title: "Customer Database",
          type: "customer",
          idField: "customer_id",
          editRoute: "Uploadmaster",
          columns: [
            { field: "customer_id", headerName: "ID", width: 80, flex: 0.3 },
            { field: "customer_name", headerName: "Customer Name", width: 180, flex: 1 },
            { field: "mobile_number_1", headerName: "Mobile Number 1", width: 140, flex: 0.8 },
            { field: "mobile_number_2", headerName: "Mobile Number 2", width: 140, flex: 0.8 },
            { field: "email", headerName: "Email", width: 180, flex: 1 },
            { field: "city", headerName: "City", width: 120, flex: 0.6 },
            { field: "district", headerName: "District", width: 120, flex: 0.6 },
            { field: "state", headerName: "State", width: 120, flex: 0.6 },
            { field: "pincode", headerName: "Pincode", width: 100, flex: 0.5 },
            { field: "is_active", headerName: "Status", width: 100, flex: 0.4, type: "status" },
          ],
        },
      });
    } else {
      navigate("/home/setting/commonview", {
        state: {
          title: "Vehicles Database",
          type: "vehicle",
          idField: "vehicle_id",
          editRoute: "Uploadmaster",
          columns: [
            { field: "vehicle_id", headerName: "Vehicle ID", width: 90, flex: 0.4 },
            { field: "customer_name", headerName: "Customer Name", width: 150, flex: 0.7 },
            { field: "registration_number", headerName: "Reg Number", width: 140, flex: 0.6 },
            { field: "rto", headerName: "RTO", width: 120, flex: 0.5 },
            { field: "registration_date", headerName: "Reg Date", width: 120, flex: 0.5 },
            { field: "model", headerName: "Model", width: 120, flex: 0.5 },
            { field: "vehicle_maker", headerName: "Maker", width: 120, flex: 0.5 },
            { field: "engine_number", headerName: "Engine No", width: 130, flex: 0.6 },
            { field: "chassis_number", headerName: "Chassis No", width: 140, flex: 0.6 },
            { field: "vehicle_class", headerName: "Class", width: 120, flex: 0.5 },
            { field: "vehicle_category", headerName: "Category", width: 120, flex: 0.5 },
            { field: "fuel_type", headerName: "Fuel", width: 100, flex: 0.4 },
            { field: "seat_capacity", headerName: "Seats", width: 80, flex: 0.3 },
          ],
        },
      });
    }
  };

  const renderEditForm = () => {
    if (type === "customer") {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px", p: 1 }}>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Customer Name" required>
              <InputLg
                placeholder="Enter Customer Name"
                value={customer.customer_name}
                onChange={(e) => setCustomer(prev => ({ ...prev, customer_name: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Mobile Number 1" required>
              <InputLg
                placeholder="Enter Mobile Number 1"
                value={customer.mobile_number_1}
                onChange={(e) => setCustomer(prev => ({ ...prev, mobile_number_1: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Mobile Number 2">
              <InputLg
                placeholder="Enter Mobile Number 2"
                value={customer.mobile_number_2}
                onChange={(e) => setCustomer(prev => ({ ...prev, mobile_number_2: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Email">
              <InputLg
                placeholder="Enter Email"
                value={customer.email}
                onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 100%" }}>
            <FormRow label="Address">
              <InputLg
                placeholder="Enter Address"
                value={customer.address}
                onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 30%", minWidth: "200px" }}>
            <FormRow label="City">
              <InputLg
                placeholder="Enter City"
                value={customer.city}
                onChange={(e) => setCustomer(prev => ({ ...prev, city: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 30%", minWidth: "200px" }}>
            <FormRow label="District">
              <InputLg
                placeholder="Enter District"
                value={customer.district}
                onChange={(e) => setCustomer(prev => ({ ...prev, district: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 30%", minWidth: "200px" }}>
            <FormRow label="State">
              <InputLg
                placeholder="Enter State"
                value={customer.state}
                onChange={(e) => setCustomer(prev => ({ ...prev, state: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Pincode">
              <InputLg
                placeholder="Enter Pincode"
                value={customer.pincode}
                onChange={(e) => setCustomer(prev => ({ ...prev, pincode: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Active Status">
              <Checkbox
                value={customer.is_active}
                onChange={(e) => setCustomer(prev => ({ ...prev, is_active: e.target.value }))}
              />
            </FormRow>
          </Box>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px", p: 1 }}>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Registration Number" required>
              <InputLg
                placeholder="Enter Registration Number"
                value={vehicle.registration_number}
                onChange={(e) => setVehicle(prev => ({ ...prev, registration_number: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Customer" required>
              <select
                value={vehicle.customer_id}
                onChange={(e) => setVehicle(prev => ({ ...prev, customer_id: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                  background: "#fff",
                }}
              >
                <option value="">-- Select Customer --</option>
                {customerList && customerList.map((c) => (
                  <option key={c.customer_id} value={c.customer_id}>
                    {c.customer_name} ({c.mobile_number_1})
                  </option>
                ))}
              </select>
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="RTO">
              <InputLg
                placeholder="Enter RTO"
                value={vehicle.rto}
                onChange={(e) => setVehicle(prev => ({ ...prev, rto: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Registration Date">
              <InputLg
                placeholder="Enter Registration Date"
                value={vehicle.registration_data}
                onChange={(e) => setVehicle(prev => ({ ...prev, registration_data: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Model">
              <InputLg
                placeholder="Enter Model"
                value={vehicle.model}
                onChange={(e) => setVehicle(prev => ({ ...prev, model: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Vehicle Maker">
              <InputLg
                placeholder="Enter Vehicle Maker"
                value={vehicle.vehicle_maker}
                onChange={(e) => setVehicle(prev => ({ ...prev, vehicle_maker: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Engine Number">
              <InputLg
                placeholder="Enter Engine Number"
                value={vehicle.engine_number}
                onChange={(e) => setVehicle(prev => ({ ...prev, engine_number: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Chassis Number">
              <InputLg
                placeholder="Enter Chassis Number"
                value={vehicle.chassis_number}
                onChange={(e) => setVehicle(prev => ({ ...prev, chassis_number: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Vehicle Class">
              <InputLg
                placeholder="Enter Vehicle Class"
                value={vehicle.vehicle_class}
                onChange={(e) => setVehicle(prev => ({ ...prev, vehicle_class: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Vehicle Category">
              <InputLg
                placeholder="Enter Vehicle Category"
                value={vehicle.vehicle_category}
                onChange={(e) => setVehicle(prev => ({ ...prev, vehicle_category: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Fuel Type">
              <InputLg
                placeholder="Enter Fuel Type"
                value={vehicle.fuel_type}
                onChange={(e) => setVehicle(prev => ({ ...prev, fuel_type: e.target.value }))}
              />
            </FormRow>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "280px" }}>
            <FormRow label="Seat Capacity">
              <InputLg
                placeholder="Enter Seat Capacity"
                value={vehicle.seat_capacity}
                onChange={(e) => setVehicle(prev => ({ ...prev, seat_capacity: e.target.value }))}
              />
            </FormRow>
          </Box>
        </Box>
      );
    }
  };

  return (
    <Wrapper>

      {mode === "edit" ? (
        <Panel
          title={type === "customer" ? "Edit Customer Details" : "Edit Vehicle Details"}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
              <CircularProgress size="md" />
            </Box>
          ) : (
            <>
              {renderEditForm()}
              <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #f1f5f9" }}>
                <ButtonWrapper>
                  <Button onClick={handleUpdate} disabled={loading}>
                    Save Changes
                  </Button>
                  <Button onClick={() => navigate(-1)} disabled={loading}>
                    Cancel
                  </Button>
                </ButtonWrapper>
              </Box>
            </>
          )}
        </Panel>
      ) : (
        <Panel
          title="Customer & Vehicle Data Upload Center"
        >
          {/* Upper Description Block */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Typography level="title-md" textColor="neutral.800" sx={{ fontWeight: 700 }}>
                Bulk Customer & Vehicle Onboarding
              </Typography>
              <Typography level="body-sm" textColor="neutral.500">
                Easily import customers and their vehicles by uploading a unified spreadsheet. The system will automatically create/link records.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button onClick={() => handleView("customer")}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StorageIcon sx={{ fontSize: 16 }} />
                  View Customer Database
                </Box>
              </Button>
              <Button onClick={() => handleView("vehicle")}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <StorageIcon sx={{ fontSize: 16 }} />
                  View Vehicles Database
                </Box>
              </Button>
            </Box>
          </Box>

          {/* Upload Container */}
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 20px",
              borderRadius: "16px",
              border: dragOver ? "2px dashed #3b82f6" : "2px dashed #cbd5e1",
              bgcolor: dragOver ? "rgba(59, 130, 246, 0.04)" : "#f8fafc",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              position: "relative",
              minHeight: "220px",
              "&:hover": {
                borderColor: "#3b82f6",
                bgcolor: "rgba(59, 130, 246, 0.02)",
              },
            }}
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />

            {!file ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    mb: 2,
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography level="title-md" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Drag & Drop unified Excel file here or Click to browse
                </Typography>
                <Typography level="body-xs" textColor="neutral.400">
                  Supports Excel (.xlsx, .xls) files up to 5MB containing Customer & Vehicle columns
                </Typography>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 50,
                    height: 50,
                    borderRadius: "10px",
                    bgcolor: "#f0fdf4",
                    color: "#16a34a",
                  }}
                >
                  <TableChartIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <Typography level="title-sm" sx={{ fontWeight: 600, maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </Typography>
                  <Typography level="body-xs" textColor="neutral.400">
                    {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Toolbar & Upload actions */}
          <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #f1f5f9" }}>
            <ButtonWrapper>
              <Button onClick={handleUpload} disabled={loading || !file}>
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size="sm" variant="solid" color="primary" />
                    Processing File...
                  </Box>
                ) : (
                  "Start Upload"
                )}
              </Button>
              <Button onClick={handleClear} disabled={loading || !file}>
                Clear
              </Button>
            </ButtonWrapper>
          </Box>

          {/* Results Panels */}
          {uploadResult && (
            <Box sx={{ mt: 4, animation: "fadeIn 0.3s ease-in-out" }}>
              <Divider sx={{ mb: 3 }} />

              {/* Excel Statistics Dashboard */}
              <Box>
                <Typography level="title-md" sx={{ fontWeight: 700, mb: 2, color: "#1e3a8a" }}>
                  Onboarding Statistics Dashboard
                </Typography>

                {/* Summary Badges */}
                <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
                  <Box sx={{ flex: 1, minWidth: "150px", p: 2, bgcolor: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe", textAlign: "center" }}>
                    <Typography level="body-xs" textColor="neutral.500" sx={{ fontWeight: 600 }}>TOTAL ROWS PARSED</Typography>
                    <Typography level="h3" sx={{ fontWeight: 800, color: "#2563eb", mt: 0.5 }}>{uploadResult.stats.totalRows}</Typography>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: "150px", p: 2, bgcolor: "#f0fdf4", borderRadius: "12px", border: "1px solid #bbf7d0", textAlign: "center" }}>
                    <Typography level="body-xs" textColor="neutral.500" sx={{ fontWeight: 600 }}>SUCCESSFULLY IMPORTED</Typography>
                    <Typography level="h3" sx={{ fontWeight: 800, color: "#16a34a", mt: 0.5 }}>{uploadResult.stats.insertedCount}</Typography>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: "150px", p: 2, bgcolor: uploadResult.stats.failedCount > 0 ? "#fef2f2" : "#f8fafc", borderRadius: "12px", border: uploadResult.stats.failedCount > 0 ? "#fecaca" : "#e2e8f0", textAlign: "center" }}>
                    <Typography level="body-xs" textColor="neutral.500" sx={{ fontWeight: 600 }}>VALIDATION FAILURES</Typography>
                    <Typography level="h3" sx={{ fontWeight: 800, color: uploadResult.stats.failedCount > 0 ? "#dc2626" : "#64748b", mt: 0.5 }}>{uploadResult.stats.failedCount}</Typography>
                  </Box>
                </Box>

                {/* Detailed Failures Section */}
                {uploadResult.failedRows && uploadResult.failedRows.length > 0 && (
                  <Box sx={{ mb: 4, p: 2, borderRadius: "12px", border: "1px solid #fca5a5", bgcolor: "#fff5f5" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, color: "#dc2626" }}>
                      <ErrorIcon />
                      <Typography level="title-sm" sx={{ fontWeight: 700 }}>
                        Formatting & Validation Errors ({uploadResult.failedRows.length})
                      </Typography>
                    </Box>
                    <Typography level="body-xs" textColor="neutral.600" sx={{ mb: 2 }}>
                      The following rows failed our data checks and were not imported. Please fix them in your spreadsheet and re-upload.
                    </Typography>

                    <Box sx={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #fecaca", borderRadius: "8px", bgcolor: "#fff" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "#fef2f2", borderBottom: "1px solid #fecaca" }}>
                            <th style={{ padding: "8px 12px", fontWeight: 700 }}>Excel Row</th>
                            <th style={{ padding: "8px 12px", fontWeight: 700 }}>Customer Name</th>
                            <th style={{ padding: "8px 12px", fontWeight: 700 }}>Reg Number</th>
                            <th style={{ padding: "8px 12px", fontWeight: 700, color: "#dc2626" }}>Validation Error</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadResult.failedRows.map((errRow, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "8px 12px", fontWeight: 600 }}>Row {errRow.row}</td>
                              <td style={{ padding: "8px 12px" }}>{errRow.data.Name || errRow.data.customer_name || "(blank)"}</td>
                              <td style={{ padding: "8px 12px" }}>{errRow.data.registration_number || errRow.data.reg_no || "(blank)"}</td>
                              <td style={{ padding: "8px 12px", color: "#dc2626", fontWeight: 500 }}>{errRow.errors.join(" ")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Box>
                )}

                {/* Inserted Records Preview Table */}
                {uploadResult.insertedData && uploadResult.insertedData.length > 0 && (
                  <Box sx={{ p: 2, borderRadius: "12px", border: "1px solid #cbd5e1", bgcolor: "#fff" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, color: "#1e3a8a" }}>
                      <FileOpenIcon sx={{ color: "#3b82f6" }} />
                      <Typography level="title-sm" sx={{ fontWeight: 700 }}>
                        Successfully Imported Customers & Vehicles ({uploadResult.insertedData.length})
                      </Typography>
                    </Box>
                    <Box sx={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                        <thead>
                          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "8px 12px", fontWeight: 700 }}>Customer Name</th>
                            <th style={{ padding: "8px 12px", fontWeight: 700 }}>Primary Mobile</th>
                            <th style={{ padding: "8px 12px", fontWeight: 700 }}>Reg Number</th>
                            <th style={{ padding: "8px 12px", fontWeight: 700 }}>Model</th>
                            <th style={{ padding: "8px 12px", fontWeight: 700 }}>Maker</th>
                            <th style={{ padding: "8px 12px", fontWeight: 700 }}>Fuel Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadResult.insertedData.map((record, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "8px 12px", fontWeight: 600 }}>{record.customer_name}</td>
                              <td style={{ padding: "8px 12px" }}>{record.mobile_number_1}</td>
                              <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1e3a8a" }}>{record.registration_number}</td>
                              <td style={{ padding: "8px 12px" }}>{record.model || "-"}</td>
                              <td style={{ padding: "8px 12px" }}>{record.vehicle_maker || "-"}</td>
                              <td style={{ padding: "8px 12px" }}>{record.fuel_type || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Panel>
      )}
    </Wrapper>
  );
};

export default Uploadmaster;