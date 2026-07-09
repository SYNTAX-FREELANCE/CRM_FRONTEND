import React, { useMemo, useState } from "react";
import {
    Avatar,
    Box,
    Drawer,
    IconButton,
    Stack,
    Typography,
    Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Section from "../../FreshCall/Components/Section";
import Row from "../../FreshCall/Components/Row";

const glassEffect = {
    backdropFilter: "blur(12px) saturate(1.5)",
    WebkitBackdropFilter: "blur(12px) saturate(1.5)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
};

const leadColor = "#2563eb";

const EmployeeAssignedDrawer = ({ open, onClose, assigned }) => {
    const data = assigned || {};

    const initials = useMemo(() => {
        return (data.employee_name || "E")
            .split(" ")
            .map((x) => x?.[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }, [data.employee_name]);

    const [callAnchorEl, setCallAnchorEl] = useState(null);
    const callMenuOpen = Boolean(callAnchorEl);

    const handleCallClick = (event) => setCallAnchorEl(event.currentTarget);
    const handleCallClose = () => setCallAnchorEl(null);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: "80%", md: "55%" },
                    maxWidth: "100%",
                    height: "100%",
                    ...glassEffect,
                    bgcolor: "rgba(255, 255, 255, 0.9)",
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
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
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
                                    {data.employee_name || "Employee"}
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
                                        {data.employee_mobile || "-"}
                                    </Typography>

                                    <Chip
                                        size="small"
                                        label={data.work_status || "UNASSIGNED"}
                                        sx={{
                                            height: 24,
                                            fontWeight: 800,
                                            bgcolor: "rgba(37, 99, 235, 0.12)",
                                            color: "#2563eb",
                                            border: "1px solid rgba(37, 99, 235, 0.18)",
                                            fontSize: "0.7rem",
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <IconButton
                                onClick={onClose}
                                size="small"
                                sx={{ bgcolor: "rgba(255,255,255,0.55)" }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Stack>

                    
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
                            title="Assignment Details"
                            icon={<WorkIcon sx={{ fontSize: 16 }} />}
                            accent="blue"
                            defaultExpanded
                        >
                            <Row
                                label="Lead ID"
                                value={data.lead_id ?? "-"}
                                icon={<WorkIcon sx={{ fontSize: 14 }} />}
                                accent="blue"
                            />
                            <Row
                                label="Assigned Date"
                                value={
                                    data.assigned_date
                                        ? new Date(data.assigned_date).toLocaleString()
                                        : "-"
                                }
                                icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
                                accent="blue"
                            />
                            <Row
                                label="Priority"
                                value={data.lead_priority || "-"}
                                icon={<WorkIcon sx={{ fontSize: 14 }} />}
                                accent="blue"
                            />
                            <Row
                                label="Source"
                                value={data.lead_source || "-"}
                                icon={<WorkIcon sx={{ fontSize: 14 }} />}
                                accent="blue"
                            />
                            <Row
                                label="Work Status"
                                value={data.work_status || "-"}
                                icon={<WorkIcon sx={{ fontSize: 14 }} />}
                                accent="blue"
                            />
                        </Section>

                        <Section
                            title="Customer Details"
                            icon={<PersonIcon sx={{ fontSize: 16 }} />}
                            accent="purple"
                            defaultExpanded
                        >
                            <Row
                                label="Customer Name"
                                value={data.customer_name || "-"}
                                icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                accent="purple"
                            />
                            <Row
                                label="Mobile 1"
                                value={data.mobile_number_1 || "-"}
                                icon={<PhoneIcon sx={{ fontSize: 14 }} />}
                                accent="purple"
                            />
                            <Row
                                label="Mobile 2"
                                value={data.mobile_number_2 || "-"}
                                icon={<PhoneIcon sx={{ fontSize: 14 }} />}
                                accent="purple"
                            />
                            <Row
                                label="Email"
                                value={data.email || "-"}
                                icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                accent="purple"
                            />
                            <Row
                                label="Address"
                                value={data.address || "-"}
                                icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                                accent="purple"
                            />
                            <Row
                                label="District - City"
                                value={`${data.district || "-"} - ${data.city || "-"}`}
                                icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                                accent="purple"
                            />
                            <Row
                                label="State - PIN"
                                value={`${data.state || "-"} - ${data.pincode || "-"}`}
                                icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
                                accent="purple"
                            />
                        </Section>

                        <Section
                            title="Vehicle Details"
                            icon={<DirectionsCarIcon sx={{ fontSize: 16 }} />}
                            accent="orange"
                            defaultExpanded
                        >
                            <Row
                                label="Reg No"
                                value={data.registration_number || "-"}
                                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                                accent="orange"
                            />
                            <Row
                                label="Model"
                                value={data.model || "-"}
                                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                                accent="orange"
                            />
                            <Row
                                label="Vehicle Category"
                                value={data.vehicle_category || "-"}
                                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                                accent="orange"
                            />
                            <Row
                                label="Fuel Type"
                                value={data.fuel_type || "-"}
                                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                                accent="orange"
                            />
                            <Row
                                label="Make"
                                value={data.make || "-"}
                                icon={<DirectionsCarIcon sx={{ fontSize: 14 }} />}
                                accent="orange"
                            />
                        </Section>

                        <Section
                            title="Employee Details"
                            icon={<PersonIcon sx={{ fontSize: 16 }} />}
                            accent="green"
                            defaultExpanded
                        >
                            <Row
                                label="Employee ID"
                                value={data.employee_id || "-"}
                                icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                accent="green"
                            />
                            <Row
                                label="Employee Name"
                                value={data.employee_name || "-"}
                                icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                accent="green"
                            />
                            <Row
                                label="Employee Mobile"
                                value={data.employee_mobile || "-"}
                                icon={<PhoneIcon sx={{ fontSize: 14 }} />}
                                accent="green"
                            />
                            <Row
                                label="User ID"
                                value={data.user_id ?? "-"}
                                icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                accent="green"
                            />
                        </Section>
                    </Stack>
                </Box>
            </Box>
        </Drawer>
    );
};

export default EmployeeAssignedDrawer;