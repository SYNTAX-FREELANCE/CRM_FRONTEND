

import React from "react";
import {
    Box,
    Grid,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

const VehicleDetail = ({
    icon,
    label,
    value,
    color = "#2563eb",
    isDark,
}) => {
    return (
        <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
            sx={{ minWidth: 0 }}
        >
            <Box
                sx={{
                    width: 27,
                    height: 27,
                    flexShrink: 0,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: isDark
                        ? `${color}18`
                        : `${color}0d`,
                    color,
                    "& svg": {
                        fontSize: 15,
                    },
                }}
            >
                {icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: 7.5,
                        fontWeight: 900,
                        letterSpacing: 0.6,
                        color: "#94a3b8",
                        lineHeight: 1,
                        mb: 0.35,
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    title={value}
                    sx={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: isDark ? "#f8fafc" : "#0f172a",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {value || "-"}
                </Typography>
            </Box>
        </Stack>
    );
};

const VehicleInfoCard = ({ selectedVehicle }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    if (!selectedVehicle) return null;

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                mt: 1,
                px: 1.5,
                py: 1.35,
                borderRadius: 3,
                border: isDark
                    ? "1px solid rgba(255,255,255,.08)"
                    : "1px solid #e2e8f0",
                bgcolor: isDark
                    ? "rgba(15,23,42,.72)"
                    : "#fff",
                boxShadow: isDark
                    ? "0 8px 25px rgba(0,0,0,.18)"
                    : "0 6px 22px rgba(15,23,42,.055)",
            }}
        >
            {/* Decorative vehicle circle */}
            <Box
                sx={{
                    position: "absolute",
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    right: -55,
                    bottom: -70,
                    bgcolor: isDark
                        ? "rgba(249,115,22,.07)"
                        : "rgba(249,115,22,.045)",
                    pointerEvents: "none",
                }}
            />

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
                sx={{ mb: 1.3 }}
            >
                <Stack
                    direction="row"
                    spacing={0.9}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#f9731610",
                            color: "#f97316",
                            border: "1px solid #f9731620",
                        }}
                    >
                        <DirectionsCarOutlinedIcon
                            sx={{ fontSize: 19 }}
                        />
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 8,
                                fontWeight: 900,
                                letterSpacing: 0.7,
                                color: "#94a3b8",
                            }}
                        >
                            VEHICLE
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 950,
                                letterSpacing: 0.8,
                                color: isDark
                                    ? "#fff"
                                    : "#0f172a",
                                lineHeight: 1.1,
                            }}
                        >
                            {selectedVehicle.registration_number ||
                                "-"}
                        </Typography>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        px: 1,
                        py: 0.45,
                        borderRadius: 1.5,
                        bgcolor: isDark
                            ? "rgba(255,255,255,.04)"
                            : "#f8fafc",
                        border: isDark
                            ? "1px solid rgba(255,255,255,.06)"
                            : "1px solid #e2e8f0",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 8,
                            fontWeight: 800,
                            color: "#64748b",
                        }}
                    >
                        {selectedVehicle.model || "Vehicle"}
                    </Typography>
                </Box>
            </Stack>

            <Grid
                container
                spacing={1.4}
                alignItems="center"
            >
                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                    <VehicleDetail
                        icon={
                            <ConfirmationNumberOutlinedIcon />
                        }
                        label="CHASSIS NUMBER"
                        value={
                            selectedVehicle.chassis_number
                        }
                        color="#2563eb"
                        isDark={isDark}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                    <VehicleDetail
                        icon={<SettingsOutlinedIcon />}
                        label="ENGINE NUMBER"
                        value={
                            selectedVehicle.engine_number
                        }
                        color="#7c3aed"
                        isDark={isDark}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 4, md: 1.8 }}>
                    <VehicleDetail
                        icon={<LocationOnOutlinedIcon />}
                        label="RTO"
                        value={selectedVehicle.rto}
                        color="#f97316"
                        isDark={isDark}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 4, md: 1.8 }}>
                    <VehicleDetail
                        icon={
                            <LocalGasStationOutlinedIcon />
                        }
                        label="FUEL"
                        value={selectedVehicle.fuel_type}
                        color="#16a34a"
                        isDark={isDark}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 4, md: 1.8 }}>
                    <VehicleDetail
                        icon={<DirectionsCarOutlinedIcon />}
                        label="CLASS"
                        value={selectedVehicle.vehicle_class}
                        color="#0891b2"
                        isDark={isDark}
                    />
                </Grid>

                <Grid size={{ xs: 6, sm: 4, md: 1.8 }}>
                    <VehicleDetail
                        icon={<EventOutlinedIcon />}
                        label="REG. DATE"
                        value={
                            selectedVehicle.registration_date
                                ? new Date(
                                    selectedVehicle.registration_date
                                ).toLocaleDateString("en-GB")
                                : "-"
                        }
                        color="#db2777"
                        isDark={isDark}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default VehicleInfoCard;
