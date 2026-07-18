import React, { memo } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const Row = ({
  label,
  value,
  icon,
  accent = "blue",

  editable = false,
  isEditing = false,
  onEdit,
  onSave,
  children,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 1.5,
      py: 0.75,
      px: 0.25,
      borderBottom: "1px solid",
      borderColor:
        accent === "orange"
          ? "rgba(249,115,22,.10)"
          : "rgba(37,99,235,.10)",
    }}
  >
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ minWidth: 0 }}
    >
      {icon && (
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: "7px",
            display: "grid",
            placeItems: "center",
            bgcolor:
              accent === "orange"
                ? "rgba(249,115,22,.12)"
                : "rgba(37,99,235,.12)",
            color:
              accent === "orange"
                ? "warning.dark"
                : "primary.main",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}

      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          color:
            accent === "orange"
              ? "warning.dark"
              : "primary.main",
          textTransform: "uppercase",
          letterSpacing: 0.6,
          whiteSpace: "nowrap",
          fontSize: { xs: 11, sm: 14 },
        }}
      >
        {label}
      </Typography>
    </Stack>

    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="flex-end"
      sx={{ width: "80%" }}
    >
      {isEditing ? (
        children
      ) : (
        <Typography
          component="div"
          variant="body2"
          sx={{
            flex: 1,
            fontSize: { xs: 10, sm: 14 },
            fontWeight: { xs: 800, sm: 700 },
            color: "text.primary",
            textAlign: "right",
            wordBreak: "break-word",
          }}
        >
          {value || "-"}
        </Typography>
      )}

      {editable && (
        <IconButton
          size="small"
          color={isEditing ? "success" : "primary"}
          onClick={isEditing ? onSave : onEdit}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "#fff",
            "&:hover": {
              bgcolor: isEditing
                ? "success.lighter"
                : "primary.lighter",
            },
          }}
        >
          {isEditing ? (
            <SaveIcon fontSize="small" />
          ) : (
            <EditIcon fontSize="small" />
          )}
        </IconButton>
      )}
    </Stack>
  </Box>
);

export default memo(Row);