import React, { memo } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

const DashboardStatCard = ({ item, DashboardCount }) => {
  return (
    <Card
      sx={{
        borderRadius: 5,
        height: "100%",
        transition: "0.3s",
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "0 25px 10px rgba(189, 208, 249, 0.3)",
        width: "100%",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box sx={{ flex: 1 }}>
            <Typography
              color="text.secondary"
              sx={{
                mb: 0.5,
                fontSize: { xs: 9, sm: 10, md: 12 },
                fontWeight: 900,
              }}
            >
              {item?.title?.toUpperCase()}
            </Typography>

            <Typography
              fontWeight={900}
              fontSize={{ xs: 32, sm: 36, md: 42 }}
              sx={{
                mb: 0.5,
                color: "#1e293b",
                letterSpacing: 1,
                textShadow: `
                  1px 1px 0px #fff,
                  2px 2px 0px #d1d5db,
                  3px 3px 0px #cbd5e1,
                  4px 4px 6px rgba(0,0,0,0.25)
                `,
              }}
            >
              {DashboardCount?.[item.key] ?? 0}
            </Typography>

            {item.key !== "totalUploaded" && (
              <Typography
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontSize: { xs: 9, sm: 10, md: 12 },
                  fontWeight: 900,
                }}
              >
                of {DashboardCount?.totalUploaded ?? 0}
              </Typography>
            )}

            <Chip
              label={
                item.key === "totalUploaded"
                  ? "Overall Leads"
                  : `${(
                      ((Number(DashboardCount?.[item.key] || 0) /
                        Number(DashboardCount?.totalUploaded || 1)) *
                        100) || 0
                    ).toFixed(0)}%`
              }
              sx={{
                bgcolor: item.bgColor,
                color: item.color,
                fontWeight: 700,
                fontSize: 12,
                height: 28,
              }}
            />
          </Box>

          <Avatar
            sx={{
              bgcolor: item.color,
              width: 56,
              height: 56,
              ml: 2,
            }}
          >
            {item.icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default memo(DashboardStatCard);