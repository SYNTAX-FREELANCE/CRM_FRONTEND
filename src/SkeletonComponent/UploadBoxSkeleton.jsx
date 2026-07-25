// src/components/UploadBoxSkeleton.jsx
import React, { memo } from "react";
import { Box, Skeleton } from "@mui/material";

const UploadBoxSkeleton = () => {
  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left side: title + subtitle skeletons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 120 }}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="text" width={180} height={18} />
      </Box>

      {/* Right side: button skeletons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Skeleton variant="rectangular" width={80} height={36} />
        <Skeleton variant="rectangular" width={60} height={36} />
      </Box>
    </Box>
  );
};

export default memo(UploadBoxSkeleton);