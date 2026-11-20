
import React from "react";
import {
  Box,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
  TextField,
  Button,
  Tooltip,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import CallIcon from "@mui/icons-material/Call";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

import { axioslogin } from "../../Connection/axios";
import {
  errorNotify,
  getAuthUser,
  successNotify,
  warningNotify,
} from "../../constant/Constant";

const CallPopover = ({
  anchorEl,
  open,
  onClose,
  mobile1,
  mobile2,
  lead,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const authUser = getAuthUser();
  const { id } = authUser ?? {};

  const [numbers, setNumbers] = React.useState({
    mobile1: mobile1 || "",
    mobile2: mobile2 || "",
  });

  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [switching, setSwitching] = React.useState(false);
  const [calling, setCalling] = React.useState(null);

  React.useEffect(() => {
    setNumbers({
      mobile1: mobile1 || "",
      mobile2: mobile2 || "",
    });
  }, [mobile1, mobile2]);

  // API 1: Update individual mobile number
  const updateLeadMobileNumber = async (field, number) => {
    const payload = {
      customer_id: lead?.customer_id,
      field,
      mobile_number: number,
      user_id: id,
    };

    return axioslogin.patch(
      "/lead/update-mobile-number",
      payload
    );
  };

  // API 2: Switch Mobile 1 and Mobile 2
  const switchLeadMobileNumbers = async () => {
    const payload = {
      customer_id: lead?.customer_id,
      user_id: id,
    };

    return axioslogin.patch(
      "/lead/switch-mobile-numbers",
      payload
    );
  };

  // Start editing
  const handleEdit = (field) => {
    setEditing(field);
    setDraft(numbers[field]);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditing(null);
    setDraft("");
  };

  // Save individual number
  const handleSave = async () => {
    const number = draft.trim();

    if (!/^[6-9]\d{9}$/.test(number)) {
      warningNotify("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setSaving(true);

      const response = await updateLeadMobileNumber(
        editing,
        number
      );

      if (
        response.data?.success === false ||
        response.data?.success === 0
      ) {
        errorNotify(response.data?.message || "Mobile update failed");
        return;
      }

      setNumbers((prev) => ({
        ...prev,
        [editing]: number,
      }));

      successNotify(
        response.data?.message || "Mobile number updated successfully"
      );

      handleCancel();
    } catch (error) {
      errorNotify(
        error.response?.data?.message ||
        error.message ||
        "Mobile update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  // Switch both numbers
  const handleSwitch = async () => {
    if (
      switching ||
      saving ||
      editing ||
      !numbers.mobile1 ||
      !numbers.mobile2
    ) {
      return;
    }

    try {
      setSwitching(true);

      const response = await switchLeadMobileNumbers();

      if (
        response.data?.success === false ||
        response.data?.success === 0
      ) {
        errorNotify(response.data?.message || "Mobile switch failed");
        return;
      }

      setNumbers((prev) => ({
        mobile1: prev.mobile2,
        mobile2: prev.mobile1,
      }));

      successNotify(
        response.data?.message || "Mobile numbers switched successfully"
      );
    } catch (error) {
      errorNotify(
        error.response?.data?.message ||
        error.message ||
        "Mobile switch failed"
      );
    } finally {
      setSwitching(false);
    }
  };

  // Existing call notification functionality
  const handleCall = async (number) => {
    if (!number) {
      warningNotify("Phone number is missing");
      return;
    }

    try {
      setCalling(number);

      const payload = {
        leadId: lead?.lead_id,
        customerName: lead?.customer_name,
        phoneNumber: number,
        registrationNumber: lead?.registration_number,
        model: lead?.model,
        user_id: id,
      };

      const response = await axioslogin.post(
        "/notifications/test",
        payload
      );

      const result = response.data;

      if (result.success !== 1) {
        errorNotify(result.message || "Notification failed");
        return;
      }

      const devices = result.devices || [];

      if (devices.length === 0) {
        warningNotify("No active device found");
        return;
      }

      const successfulDevices = [];
      const failedDevices = [];

      devices.forEach((device) => {
        const tickets = device.tickets || [];

        tickets.forEach((ticket) => {
          if (ticket.status === "ok") {
            successfulDevices.push({
              deviceName: device.deviceName,
              ticketId: ticket.id,
            });
          } else {
            failedDevices.push({
              deviceName: device.deviceName,
              message:
                ticket.message ||
                ticket.details?.error ||
                "Notification failed",
            });
          }
        });
      });

      if (successfulDevices.length > 0) {
        successNotify(
          `Notification accepted by Expo for ${successfulDevices.length} device(s)`
        );
      }

      if (failedDevices.length > 0) {
        failedDevices.forEach((device) => {
          errorNotify(
            `${device.deviceName}: ${device.message}`
          );
        });
      }

      if (
        successfulDevices.length === 0 &&
        failedDevices.length > 0
      ) {
        errorNotify("All notification attempts failed");
      }
    } catch (error) {
      errorNotify(
        error.response?.data?.message ||
        error.message ||
        "Push notification request failed"
      );
    } finally {
      setCalling(null);
    }
  };

  // Mobile number item
  const Item = ({ label, field }) => {
    const number = numbers[field];
    const active = calling === number && !!number;
    const isEditing = editing === field;

    return (
      <Box
        sx={{
          p: 1.2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: isEditing
            ? "primary.main"
            : "rgba(37,99,235,.14)",
          boxShadow: "0 6px 18px rgba(15,23,42,.06)",
          bgcolor: isDark ? "rgba(15,23,42,0.6)" : "#fff",
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 900,
                letterSpacing: 0.7,
                color: isDark ? "#fff" : "#1e293b",
                fontFamily: "Bahnschrift",
              }}
            >
              {label}
            </Typography>

            {!isEditing && (
              <Tooltip title="Edit number">
                <IconButton
                  size="small"
                  disabled={saving || switching || !!editing || !!calling}
                  onClick={() => handleEdit(field)}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {isEditing ? (
            <>
              <TextField
                size="small"
                fullWidth
                value={draft}
                onChange={(e) =>
                  setDraft(
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                placeholder="Enter 10 digit mobile number"
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                }}
                error={
                  draft.length > 0 &&
                  !/^[6-9]\d{9}$/.test(draft)
                }
                helperText={
                  draft.length > 0 &&
                    !/^[6-9]\d{9}$/.test(draft)
                    ? "Enter a valid 10-digit mobile number"
                    : ""
                }
                autoFocus
              />

              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
              >
                <Button
                  size="small"
                  color="inherit"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CheckIcon />}
                  onClick={handleSave}
                  disabled={
                    saving ||
                    !/^[6-9]\d{9}$/.test(draft.trim())
                  }
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </Stack>
            </>
          ) : (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: isDark ? "#fff" : "#1e293b",
                  fontFamily: "Bahnschrift",
                }}
              >
                {number || "-"}
              </Typography>

              <IconButton
                onClick={() => handleCall(number)}
                size="small"
                disabled={!number || !!calling || switching || !!editing}
                sx={{
                  bgcolor: active ? "success.main" : "primary.main",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: active ? "success.dark" : "primary.dark",
                  },
                }}
              >
                {active ? (
                  <CallIcon fontSize="small" />
                ) : (
                  <PhoneIcon fontSize="small" />
                )}
              </IconButton>
            </Stack>
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          mt: 1,
          p: 1.2,
          width: 280,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: isDark ? "rgba(15,23,42,0.95)" : "#fff",
          border: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(229,231,235,0.5)",
          boxShadow: isDark
            ? "0 8px 20px rgba(0,0,0,0.5)"
            : "0 8px 20px rgba(37,99,235,.15)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          px: 0.2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 900, color: "primary.main" }}
        >
          Call Numbers
        </Typography>

        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Stack spacing={1}>
        <Item label="Mobile 1" field="mobile1" />
        <Item label="Mobile 2" field="mobile2" />

        <Button
          fullWidth
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<SwapVertIcon />}
          onClick={handleSwitch}
          disabled={
            switching ||
            saving ||
            !!editing ||
            !!calling ||
            !numbers.mobile1 ||
            !numbers.mobile2
          }
        >
          {switching ? "Switching..." : "Switch Numbers"}
        </Button>
      </Stack>
    </Popover>
  );
};

export default CallPopover;
