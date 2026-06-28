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

import CallPopover from "./Components/CallPopover";
import Section from "./Components/Section";
import Row from "./Components/Row";
import { useLeadMaster } from "../CommonCode/useQuery";
import StatusActionCards from "./Components/StatusActionCards";
import FollowUpForm from "./Components/FollowUpForm";
import { errorNotify, getAuthUser, successNotify, warningNotify } from "../constant/Constant";
import axios from "axios";
import { axioslogin } from "../Axios/axios";
import { statusReasonMap } from "../CommonCode/Reusable";
import { useQueryClient } from "@tanstack/react-query";

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

  const authUser = getAuthUser();
  const { id } = authUser ?? {};

  const { data: LeadMasterDetail } = useLeadMaster();
  const ActiveStatus = Array.isArray(LeadMasterDetail)
    ? LeadMasterDetail.filter((stat) => stat.is_active === 1 && stat.status_id !== 1)
    : [];

  const hasPolicy =
    lead.policy_id ||
    lead.policy_number ||
    lead.policy_type ||
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

    // Status Validation
    if (!followUpAction) {
      return warningNotify("Please select the lead status.");
    }

    // Call Outcome Validation

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
            mobile1={lead.mobile_number_1}
            mobile2={lead.mobile_number_2}
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
                value={lead.address}
                icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                accent="blue"
              />
              <Row
                label="District - City"
                value={`${lead.district || "-"} - ${lead.city || "-"}`}
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
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default LeadDetailsDrawer;