import React, { memo } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Skeleton,
} from "@mui/material";

const DashboardStatCardSkeleton = () => {
  return (
    <Card
      sx={{
        borderRadius: 5,
        height: "100%",
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "0 25px 10px rgba(189, 208, 249, 0.3)",
        width: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box sx={{ flex: 1 }}>
            {/* Title */}
            <Skeleton
              variant="text"
              width="40%"
              height={18}
              sx={{ mb: 1 }}
            />

            {/* Count */}
            <Skeleton
              variant="text"
              width="55%"
              height={50}
              sx={{ mb: 1 }}
            />

            {/* Subtitle */}
            <Skeleton
              variant="text"
              width="30%"
              height={18}
              sx={{ mb: 2 }}
            />

            {/* Chip */}
            <Skeleton
              variant="rounded"
              width={90}
              height={28}
              sx={{ borderRadius: 5 }}
            />
          </Box>

          {/* Avatar */}
          <Skeleton
            variant="circular"
            width={56}
            height={56}
            sx={{ ml: 2 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(DashboardStatCardSkeleton);