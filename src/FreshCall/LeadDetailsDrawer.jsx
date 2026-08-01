import React, { lazy, memo, Suspense, useCallback, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Stack,
  Typography,
  Divider,
  TextField,
  Paper,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ArticleIcon from "@mui/icons-material/Article";
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import EventNoteIcon from "@mui/icons-material/EventNote";
import CommentIcon from "@mui/icons-material/Comment";
import HistoryIcon from "@mui/icons-material/History";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EditDocumentIcon from '@mui/icons-material/EditDocument';

import CallPopover from "./Components/CallPopover";
import Section from "./Components/Section";
import Row from "./Components/Row";
import { useFollowUpDetail, useGetLeadHistory } from "../CommonCode/useQuery";
import { errorNotify, getAuthUser, successNotify, warningNofity, warningNotify } from "../constant/Constant";
import axios from "axios";
import { axioslogin } from "../Connection/axios";
import { statusReasonMap } from "../CommonCode/Reusable";
import { useQueryClient } from "@tanstack/react-query";
import LeadHistoryTimelineItem from "./Components/LeadHistoryTimelineItem";
import LeadFollowUpCard from "./Components/LeadFollowUpCard";
import { format } from "date-fns";
import StatusActionCardsSkeleton from "../SkeletonComponent/StatusActionCardsSkeleton";
import FollowUpFormSkeleton from "../SkeletonComponent/FollowUpFormSkeleton";
import { DatePicker } from "@mui/x-date-pickers";
import EditableDateField from "./Components/EditableDateField";
import LeadVehicleUploads from "./Components/LeadVehicleUploads";

const glassEffect = {
  backdropFilter: "blur(12px) saturate(1.5)",
  WebkitBackdropFilter: "blur(12px) saturate(1.5)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
};

const StatusActionCards = lazy(() => import("./Components/StatusActionCards"))
const FollowUpForm = lazy(() => import("./Components/FollowUpForm"))
const LeadHeader = lazy(() => import("./Components/LeadHeader"))

const leadColor = "#2563eb";

const LeadDetailsDrawer = ({
  open,
  onClose,
  selectedLead,
  setSelectedLead,
  statusFilter
}) => {

  const authUser = getAuthUser();
  const { id } = authUser ?? {};

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const formatDate = (date) => {
    if (!date) return "-";
    return format(new Date(date), "dd-MMM-yyyy");
  };

  const lead = selectedLead || {};
  const isRenewalTab = Number(statusFilter) === -3;
  const leadId = lead?.lead_id;
  const statusId = lead?.status_id;
  const isCallAccess = lead?.is_call_required === 1 || isRenewalTab;
  const VehicleId = lead?.vehicle_id;

  const [callAnchorEl, setCallAnchorEl] = useState(null);
  const [followUpAction, setFollowUpAction] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [editingField, setEditingField] = useState(null);

  const [expiryDate, setExpiryDate] = useState(
    lead?.known_policy_expiry_date || null
  );

  const queryClient = useQueryClient();

  const handleExpirySave = useCallback(async (date) => {
    // Instant update only for opened lead
    setSelectedLead((prev) => ({
      ...prev,
      known_policy_expiry_date: date,
    }));

    try {
      const { data } = await axioslogin.post("/lead/update-expiry", {
        vehicle_id: VehicleId,
        edited_by: id,
        known_policy_expiry_date: date
          ? format(new Date(date), "yyyy-MM-dd")
          : null,
      });
      if (data.success !== 1) {
        warningNotify(data.message);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["emp-mycalls", id], })
      successNotify("Expiry date updated");
    } catch (err) {
      errorNotify("Error updating expiry date");
    }
  }, [VehicleId, id]);


  const shouldFetchHistory = open && !!leadId;

  const shouldFetchFollowUp =
    open &&
    !!leadId &&
    !!statusId &&
    Number(lead?.requires_followup) === 1;

  const { data: LeadHistory = [] } = useGetLeadHistory(
    leadId,
    shouldFetchHistory
  );

  const { data: LeadFollowUp = null } = useFollowUpDetail(
    leadId,
    statusId,
    shouldFetchFollowUp
  );

  const hasHistory = useMemo(
    () => LeadHistory?.length > 0,
    [LeadHistory]
  );

  const hasFollowUp = useMemo(
    () => LeadFollowUp?.length > 0,
    [LeadFollowUp]
  );

  const hasPolicy = useMemo(() => (
    lead.policy_id ||
    lead.policy_number ||
    lead.start_date ||
    lead.expiry_date ||
    lead.premium_amount
  ), [lead]);

  const initials = useMemo(() => {
    return (lead.customer_name || "L")
      .split(" ")
      .map((x) => x?.[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [lead.customer_name]);

  const callMenuOpen = Boolean(callAnchorEl);

  const handleSelectStatus = useCallback((item) => {
    setSelectedStatus(item);
    handleStatusClick(item.status_id);
  }, []);


  const handleReset = useCallback(() => {
    setSelectedStatus("");
    setFollowUpAction("");

  }, []);


  const resetFollowup = useCallback(() => {
    setFollowUpAction("");
    setSelectedStatus("");
  }, []);


  const validatePolicy = (policyData) => {
    if (!policyData.insurance_company_id) {
      warningNotify("Please select the insurance company.");
      return false;
    }

    if (!policyData.policy_number?.trim()) {
      warningNotify("Please enter the policy number.");
      return false;
    }


    if (!policyData.renewal_cycle) {
      warningNotify("Please select the renewal cycle.");
      return false;
    }

    if (!policyData.start_date) {
      warningNotify("Please select the policy start date.");
      return false;
    }

    if (!policyData.expiry_date) {
      warningNotify("Please select the policy expiry date.");
      return false;
    }

    if (new Date(policyData.start_date) >= new Date(policyData.expiry_date)) {
      warningNotify("Expiry date must be greater than the start date.");
      return false;
    }

    if (!policyData.premium_amount || Number(policyData.premium_amount) <= 0) {
      warningNotify("Please enter a valid premium amount.");
      return false;
    }

    if (
      !policyData.insured_declared_value ||
      Number(policyData.insured_declared_value) <= 0
    ) {
      warningNotify("Please enter a valid Net amount.");
      return false;
    }

    if (!policyData.renewal_year) {
      warningNotify("Please enter the renewal year.");
      return false;
    }

    if (!policyData.reminder_days) {
      warningNotify("Please select reminder days.");
      return false;
    }

    return true;
  };

  const handleCallClick = (event) => setCallAnchorEl(event.currentTarget);
  const handleCallClose = () => setCallAnchorEl(null);

  const handleStatusClick = (id) => {
    const normalized = id;
    setFollowUpAction(normalized);
  };


  const HandleSaveFollowup = async ({
    remarks: followUpRemarks,
    followUpDate,
    followUpOutcome,
    policyData,
  }) => {
    // Lead Validation
    if (!lead?.lead_id) {
      warningNotify("Lead information is missing.");
      return false;
    }

    // User Validation
    if (!id) {
      warningNotify("Session expired. Please login again.");
      return false;
    }

    // Policy Validation
    if (selectedStatus?.is_policy_required === 1) {
      const isValid = validatePolicy(policyData);

      if (!isValid) {
        return false;
      }
    }

    // Status Validation
    if (!followUpAction) {
      warningNotify("Please select the lead status.");
      return false;
    }

    // Follow-up Validation
    if (selectedStatus?.requires_followup === 1) {
      if (!followUpDate && selectedStatus?.is_followup_date_required === 1) {
        warningNotify("Please select the next follow-up date.");
        return false;
      }

      if (!followUpOutcome) {
        warningNotify("Please select the call outcome.");
        return false;
      }

      if (followUpDate && new Date(followUpDate) <= new Date()) {
        warningNotify(
          "Follow-up date must be greater than the current date and time."
        );
        return false;
      }
    }

    // Remarks Validation
    if (!followUpRemarks?.trim()) {
      warningNotify("Please enter discussion remarks.");
      return false;
    }

    if (followUpRemarks.trim().length < 5) {
      warningNotify("Remarks should contain at least 5 characters.");
      return false;
    }

    const payload = {
      lead_id: lead.lead_id,
      customer_id: lead.customer_id,
      vehicle_id: lead.vehicle_id,
      current_status_id: lead.status_id,
      old_status_id: lead.status_id,
      new_status_id: followUpAction,
      requires_followup: selectedStatus?.requires_followup,
      call_outcome: followUpOutcome,
      remarks: followUpRemarks ? followUpRemarks.trim() : "No Remarks",
      next_followup_date: followUpDate
        ? format(new Date(followUpDate), "yyyy-MM-dd HH:mm:ss")
        : null,
      status_change_reason:
        statusReasonMap[followUpOutcome] || "Status Updated",
      created_by: id,
      policyrequierd: selectedStatus?.is_policy_required,

      ...(selectedStatus?.is_policy_required === 1 && {
        policy: {
          insurance_company_id: policyData.insurance_company_id,
          policy_number: policyData.policy_number.trim(),
          renewal_year: policyData.renewal_year,
          renewal_cycle: policyData.renewal_cycle,
          start_date: policyData.start_date,
          expiry_date: policyData.expiry_date,
          premium_amount: policyData.premium_amount,
          insured_declared_value: policyData.insured_declared_value,
          reminder_days: policyData.reminder_days,
          remarks: policyData.remarks,
        },
      }),
    };

    try {
      const response = await axioslogin.post(
        "/lead/update-status",
        payload
      );
      const { success, message } = response?.data ?? {};
      if (success !== 1) {
        warningNotify(message || "Error in Updating Lead");
        return false;
      }
      successNotify(message);
      await queryClient.invalidateQueries({ queryKey: ["emp-mycalls", id] });
      resetFollowup()
      onClose();
      return true;
    } catch (error) {
      errorNotify("Error in Updating Status");
      return false;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "80%", md: "70%" },
          maxWidth: "100%",
          height: "100%",
          ...glassEffect,
          bgcolor: isDark ? "rgba(15,23,42,0.6)" : "#fff",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.12), 0 0 1px rgba(255, 255, 255, 0.5) inset",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: isDark ? "rgba(15,23,42,0.6)" : "#fff", }}>

        <LeadHeader
          lead={lead}
          initials={initials}
          leadColor={leadColor}
          onClose={onClose}
          handleCallClick={handleCallClick}
          handleCallClose={handleCallClose}
          callAnchorEl={callAnchorEl}
          callMenuOpen={callMenuOpen}
        />

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: 2,
            py: 2,
            bgcolor: "rgba(255, 255, 255, 0.5)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Stack spacing={1.5}>
            <Section
              title="Customer Details"
              icon={<PersonIcon sx={{ fontSize: 16 }} />}
              accent="blue"
              defaultExpanded={true}
            >
              <Row
                label="Address"
                value={lead?.address}
                icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                accent="blue"
              />
              <Row
                label="District - City"
                value={`${lead?.district || "-"} - ${lead.city || "-"}`}
                icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                accent="blue"
              />
            </Section>

            <Section
              title="Vehicle Details"
              icon={<DirectionsCarIcon sx={{ fontSize: 16 }} />}
              accent="blue"
              defaultExpanded={true}
            >
              <Row
                label="Reg No"
                value={lead.registration_number || "-"}
                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                accent="orange"
              />
              <Row
                label="Expiry Date"
                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                accent="orange"
                value={
                  <EditableDateField
                    value={lead?.known_policy_expiry_date}
                    editable
                    onSave={handleExpirySave}
                  />
                }
              />
              <Row
                label="Model"
                value={lead.model || "-"}
                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                accent="orange"
              />
              <Row
                label="Engine No"
                value={lead.engine_number || "-"}
                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                accent="orange"
              />
              <Row
                label="Chassis No"
                value={lead.chassis_number || "-"}
                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                accent="orange"
              />
            </Section>

            {/* <Section
              title="Upload Details"
              icon={<DirectionsCarIcon sx={{ fontSize: 16 }} />}
              accent="blue"
              defaultExpanded={true}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: `1px solid ${themeColors.border}`,
                  // width: { xs: "100%", lg: "50%" },
                  width: '100%'
                }}
              >
                <Box sx={{
                  display: "flex",
                  gap: 1
                }}>
                  <EditDocumentIcon sx={{
                    color: '#fb3e05'
                  }} />
                  <Typography
                    sx={{
                      fontSize: { xs: 15, sm: 20 },
                      fontWeight: 600,
                      color: themeColors.textDark,
                      mb: 3,
                    }}>
                    POLICY DOCUMENT UPLOADS
                  </Typography>
                </Box>



                <Stack spacing={2}>

                  <UploadBox
                    title="Registration Certificate (RC)"
                    subtitle="Upload the vehicle Registration Certificate (Smart Card or RC Book)."
                    multiple
                    loading={loading}
                    onChange={(e) => handleUpload(e, setRcFiles)}
                    onAdd={() => uploadFiles(rcFiles, "RC")}
                  />

                  <UploadPreview
                    files={[
                      ...(uploadedRC ?? []),
                      ...rcFiles
                    ]}
                    LoadingPolicyFiles={LoadingPolicyFiles}
                    onRemove={(item) => removeFile(item, setRcFiles)}
                  />

                  <UploadBox
                    title="Previous Insurance Policy"
                    subtitle="Upload the latest insurance policy document for renewal verification."
                    multiple
                    loading={loading}
                    onChange={(e) => handleUpload(e, setPolicyFiles)}
                    onAdd={() => uploadFiles(policyFiles, "PREVIOUS_POLICY")}
                  />
                  <UploadPreview
                    files={[
                      ...(uploadedPolicy ?? []),
                      ...policyFiles
                    ]}
                    LoadingPolicyFiles={LoadingPolicyFiles}
                    onRemove={(item) => removeFile(item, setPolicyFiles)}
                  />

                  <UploadBox
                    title="Customer KYC Documents"
                    subtitle="Upload Aadhaar Card, PAN Card, Driving Licence, Passport or other valid identity/address proof."
                    multiple
                    loading={loading}
                    onChange={(e) => handleUpload(e, setKycFiles)}
                    onAdd={() => uploadFiles(kycFiles, "KYC")}
                  />

                  <UploadPreview
                    files={[
                      ...(uploadedKYC ?? []),
                      ...kycFiles
                    ]}
                    LoadingPolicyFiles={LoadingPolicyFiles}
                    onRemove={(item) => removeFile(item, setKycFiles)}
                  />

                  <UploadBox
                    title="Vehicle Inspection Images"
                    subtitle="Upload clear photos of the Front, Rear, Left Side, Right Side and any existing damages if applicable."
                    multiple
                    loading={loading}
                    onChange={(e) => handleUpload(e, setVehicleImages)}
                    onAdd={() => uploadFiles(vehicleImages, "VEHICLE_IMAGE")}
                  />

                  <UploadPreview
                    LoadingPolicyFiles={LoadingPolicyFiles}
                    files={[
                      ...(uploadedVehicle ?? []),
                      ...vehicleImages
                    ]}
                    onRemove={(item) => removeFile(item, setVehicleImages)}
                  />

                </Stack>
              </Paper>
            </Section> */}
            <Section
              title="Upload Details"
              icon={<DirectionsCarIcon sx={{ fontSize: 16 }} />}
              accent="blue"
              defaultExpanded={true}
            >

              <LeadVehicleUploads lead={lead} />
            </Section>



            {
              hasFollowUp && (
                <Section
                  title="Follow Up History"
                  icon={<FollowTheSignsIcon sx={{ fontSize: 16 }} />}
                  accent="blue"
                  defaultExpanded
                >
                  <Stack spacing={2}>
                    {LeadFollowUp?.map((item, index) => (
                      <LeadFollowUpCard
                        key={item.followup_id}
                        item={item}
                        index={index}
                      />
                    ))}
                  </Stack>
                </Section>
              )
            }

            {hasHistory && (
              <Section
                title="Lead Status History"
                icon={<HistoryIcon sx={{ fontSize: 16 }} />}
                accent="purple"
                defaultExpanded
              >
                <Stack spacing={2}>
                  {LeadHistory?.map((item, index) => (
                    <LeadHistoryTimelineItem
                      key={item.history_id}
                      item={item}
                      isLast={index === LeadHistory.length - 1}
                    />
                  ))}
                </Stack>
              </Section>
            )}

            {hasPolicy && (
              <Section
                title="Policy Details"
                icon={<ArticleIcon sx={{ fontSize: 16 }} />}
                accent="orange"
                defaultExpanded={true}
              >
                <Row
                  label="Policy No"
                  value={lead.policy_number || "-"}
                  icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                  accent="orange"
                />
                <Row
                  label="Start Date"
                  value={formatDate(lead.start_date)}
                  icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                  accent="orange"
                />
                <Row
                  label="Expiry Date"
                  value={formatDate(lead.policy_expiry_date)}
                  icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                  accent="orange"
                />
                <Row
                  label="Premium"
                  value={lead.premium_amount || "-"}
                  icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                  accent="orange"
                />
              </Section>
            )}

            {
              isCallAccess && (
                <Box
                  sx={{
                    mt: 0.5,
                    p: 1.5,
                    borderRadius: 2.5,
                    ...glassEffect,
                    bgcolor: isDark ? "rgba(10, 17, 45, 0.78)" : "rgba(255,255,255,0.6)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 900, color: isDark ? "#ffffff" : "#1e293b", letterSpacing: 0.8 }}
                  >
                    LEAD STATUS
                  </Typography>

                  <Divider sx={{ my: 1.2, borderColor: "rgba(37,99,235,0.12)" }} />

                  <Suspense fallback={<StatusActionCardsSkeleton />}>
                    <StatusActionCards
                      selectedStatus={selectedStatus}
                      onStatusClick={handleSelectStatus}
                      onReset={handleReset}
                    />
                  </Suspense>

                  {followUpAction && (
                    <Suspense fallback={<FollowUpFormSkeleton />}>
                      <FollowUpForm
                        statusName={selectedStatus}
                        onCancel={resetFollowup}
                        onSave={HandleSaveFollowup}
                      />
                    </Suspense>
                  )}

                </Box>
              )
            }
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default memo(LeadDetailsDrawer);