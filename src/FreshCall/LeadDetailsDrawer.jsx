import React, { useMemo, useState } from "react";
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
import CallPopover from "./Components/CallPopover";
import Section from "./Components/Section";
import Row from "./Components/Row";
import { useFollowUpDetail, useGetLeadHistory, useLeadMaster } from "../CommonCode/useQuery";
import StatusActionCards from "./Components/StatusActionCards";
import FollowUpForm from "./Components/FollowUpForm";
import { errorNotify, getAuthUser, successNotify, warningNotify } from "../constant/Constant";
import axios from "axios";
import { axioslogin } from "../Axios/axios";
import { statusReasonMap } from "../CommonCode/Reusable";
import { useQueryClient } from "@tanstack/react-query";
import LeadHistoryTimelineItem from "./Components/LeadHistoryTimelineItem";
import LeadFollowUpCard from "./Components/LeadFollowUpCard";

const glassEffect = {
  backdropFilter: "blur(12px) saturate(1.5)",
  WebkitBackdropFilter: "blur(12px) saturate(1.5)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
};

const leadColor = "#2563eb";

const LeadDetailsDrawer = ({
  open,
  onClose,
  selectedLead
}) => {
  const lead = selectedLead || {};


  const leadId = lead?.lead_id;
  const statusId = lead?.status_id;
  const isCallAccess = lead?.is_call_required === 1;

  const authUser = getAuthUser();
  const { id } = authUser ?? {};

  const { data: LeadMasterDetail } = useLeadMaster();


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

  const hasHistory = LeadHistory && LeadHistory?.length > 0
  const hasFollowUp = LeadFollowUp && LeadFollowUp?.length > 0;
  console.log({
    LeadHistory,
    LeadFollowUp,
  });



  const ActiveStatus = Array.isArray(LeadMasterDetail)
    ? LeadMasterDetail.filter((stat) => stat.is_active === 1 && stat.status_id !== 1)
    : [];

  const hasPolicy =
    lead.policy_id ||
    lead.policy_number ||
    lead.start_date ||
    lead.expiry_date ||
    lead.premium_amount;

  const initials = useMemo(() => {
    return (lead.customer_name || "L")
      .split(" ")
      .map((x) => x?.[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [lead.customer_name]);

  const [callAnchorEl, setCallAnchorEl] = useState(null);
  const [followUpAction, setFollowUpAction] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpRemarks, setFollowUpRemarks] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const callMenuOpen = Boolean(callAnchorEl);
  const [followUpOutcome, setFollowUpOutcome] = useState("");
  const [policyData, setPolicyData] = useState({
    insurance_company_id: "",
    policy_number: "",
    renewal_cycle: "Annual",
    start_date: "",
    expiry_date: "",
    premium_amount: "",
    insured_declared_value: "",
    reminder_days: 30,
    renewal_year: new Date().getFullYear(),
    remarks: "",
  });


 
  const validatePolicy = () => {
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

  const queryClient = useQueryClient();
  const handleCallClick = (event) => setCallAnchorEl(event.currentTarget);
  const handleCallClose = () => setCallAnchorEl(null);

  const handleStatusClick = (id) => {
    const normalized = id;
    setFollowUpAction(normalized);
    setFollowUpDate("");
    setFollowUpRemarks("");
  };

  const HandleSaveFollowup = async () => {
    // Lead Validation
    if (!lead?.lead_id) {
      return warningNotify("Lead information is missing.");
    }

    // User Validation
    if (!id) {
      return warningNotify("Session expired. Please login again.");
    }

    if (selectedStatus?.is_policy_required === 1) {
      const isValid = validatePolicy();

      if (!isValid) {
        return;
      }
    }
    // Status Validation
    if (!followUpAction) {
      return warningNotify("Please select the lead status.");
    }

    // Require date only for specific statuses
    if (selectedStatus?.requires_followup === 1) {
      if (!followUpDate) {
        return warningNotify("Please select the next follow-up date.");
      }

      if (!followUpOutcome) {
        return warningNotify("Please select the call outcome.");
      }

      if (new Date(followUpDate) <= new Date()) {
        return warningNotify(
          "Follow-up date must be greater than the current date and time."
        );
      }
    }
    // Remarks Validation
    if (!followUpRemarks?.trim()) {
      return warningNotify("Please enter discussion remarks.");
    }

    if (followUpRemarks.trim().length < 5) {
      return warningNotify("Remarks should contain at least 5 characters.");
    }

    const payload = {
      lead_id: lead.lead_id,
      customer_id: lead.customer_id,
      vehicle_id: lead.vehicle_id,
      current_status_id: lead.status_id,
      new_status_id: followUpAction,
      requires_followup: selectedStatus.requires_followup,
      old_status_id: lead.status_id,
      call_outcome: followUpOutcome,
      remarks: followUpRemarks.trim(),
      next_followup_date: followUpDate,
      status_change_reason: statusReasonMap[followUpOutcome] || "Status Updated",
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
      const response = await axioslogin.post('/lead/update-status', payload);
      const { success, message } = response?.data ?? {}
      if (success !== 1) return warningNotify(message || "Error in Updating Lead");
      successNotify(message)
      queryClient.invalidateQueries({
        queryKey: ["mycalls", id],
      });
      onClose()
      setFollowUpAction("");
      setFollowUpDate("");
      setFollowUpRemarks("");
      setFollowUpOutcome("");
      setSelectedStatus("")
    } catch (error) {
      console.log({
        error
      });

      errorNotify("Error in Updating Status")
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
          width: { xs: "100%", sm: "80%", md: "50%" },
          maxWidth: "100%",
          height: "100%",
          ...glassEffect,
          bgcolor: "rgba(255, 255, 255, 0.82)",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.12), 0 0 1px rgba(255, 255, 255, 0.5) inset",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            p: 2,
            background:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(249, 115, 22, 0.12) 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            flex: "0 0 auto",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ minWidth: 0, flex: 1 }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: leadColor,
                  fontWeight: 800,
                }}
              >
                {initials}
              </Avatar>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.15 }}>
                  {lead.customer_name || "Customer"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mt: 0.5, flexWrap: "wrap" }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.78rem", color: "text.secondary" }}
                  >
                    {lead.state || "-"}
                  </Typography>
                  <Chip
                    size="small"
                    label={lead.status_name || "NEW"}
                    sx={{
                      height: 24,
                      fontWeight: 800,
                      bgcolor: "rgba(249, 115, 22, 0.2)",
                      color: "#f97316",
                      border: "1px solid rgba(249, 115, 22, 0.25)",
                      fontSize: "0.7rem",
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={handleCallClick}
                size="small"
                sx={{
                  bgcolor: "rgba(37, 99, 235, 0.2)",
                  color: "#2563eb",
                  border: "1px solid rgba(37, 99, 235, 0.25)",
                }}
              >
                <PhoneIcon fontSize="small" />
              </IconButton>

              <IconButton
                onClick={onClose}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.55)" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <CallPopover
            anchorEl={callAnchorEl}
            open={callMenuOpen}
            onClose={handleCallClose}
            mobile1={lead?.mobile_number_1}
            mobile2={lead?.mobile_number_2}
          />
        </Box>

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
                  label="Policy Type"
                  value={lead.policy_type || "-"}
                  icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                  accent="orange"
                />
                <Row
                  label="Start Date"
                  value={lead.start_date || "-"}
                  icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                  accent="orange"
                />
                <Row
                  label="Expiry Date"
                  value={lead.expiry_date || "-"}
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
                    bgcolor: "rgba(255,255,255,0.6)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 900, color: "#2563eb", letterSpacing: 0.8 }}
                  >
                    LEAD STATUS
                  </Typography>

                  <Divider sx={{ my: 1.2, borderColor: "rgba(37,99,235,0.12)" }} />

                  <StatusActionCards
                    statuses={ActiveStatus}
                    selectedStatus={selectedStatus}
                    onStatusClick={(item) => {
                      setSelectedStatus(item);
                      handleStatusClick(item.status_id);
                    }}
                    onReset={() => {
                      setSelectedStatus("");
                      setFollowUpAction("");
                      setFollowUpDate("");
                      setFollowUpRemarks("");
                    }}
                  />


                  {followUpAction && (
                    <FollowUpForm
                      statusName={selectedStatus}
                      followUpDate={followUpDate}
                      policyData={policyData}
                      setPolicyData={setPolicyData}
                      setFollowUpDate={setFollowUpDate}
                      followUpRemarks={followUpRemarks}
                      setFollowUpRemarks={setFollowUpRemarks}
                      outcome={followUpOutcome}
                      setOutcome={setFollowUpOutcome}
                      onCancel={() => {
                        setFollowUpAction("");
                        setFollowUpDate("");
                        setFollowUpRemarks("");
                        setFollowUpOutcome("");
                        setSelectedStatus("")
                      }}
                      onSave={HandleSaveFollowup}
                    />
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

export default LeadDetailsDrawer;