import React from "react";
import {
    Box,
    Paper,
    Typography,
    Chip,
    Stack,
    Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import HistoryIcon from "@mui/icons-material/History";
import NotesIcon from "@mui/icons-material/Notes";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArticleIcon from "@mui/icons-material/Article";

import Section from "../FreshCall/Components/Section";
import Row from "../FreshCall/Components/Row";
import LeadFollowUpCard from "../FreshCall/Components/LeadFollowUpCard";
import LeadHistoryTimelineItem from "../FreshCall/Components/LeadHistoryTimelineItem";
import EmptyCustomerState from "./EmptyCustomerState";

const themeColors = {
    blue: "#2563eb",
    blueSoft: "rgba(37,99,235,0.08)",
    orange: "#ea580c",
    orangeSoft: "rgba(234,88,12,0.08)",
    border: "rgba(226,232,240,0.95)",
    text: "#0f172a",
    muted: "#64748b",
};

const StatCard = ({ label, value, accent = "blue" }) => (
    <Paper
        variant="outlined"
        sx={{
            p: 1.5,
            borderRadius: 2.5,
            borderColor: themeColors.border,
            bgcolor: "#fff",
            boxShadow: "0 6px 18px rgba(15,23,42,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 0.25,
            minWidth: 92,
            flex: "1 1 92px",
        }}
    >
        <Typography sx={{ fontSize: 11, color: themeColors.muted, fontWeight: 700 }}>
            {label}
        </Typography>
        <Typography
            sx={{
                fontSize: 20,
                fontWeight: 900,
                color: accent === "orange" ? themeColors.orange : themeColors.blue,
                lineHeight: 1,
            }}
        >
            {value}
        </Typography>
    </Paper>
);

const ListCard = ({ title, subtitle, rightChip, icon, accent = "blue" }) => (
    <Paper
        variant="outlined"
        sx={{
            p: 1.5,
            borderRadius: 2.5,
            borderColor: themeColors.border,
            bgcolor: "#fff",
            display: "flex",
            alignItems: "flex-start",
            gap: 1.2,
            width: "100%",
        }}
    >
        <Avatar
            sx={{
                width: 36,
                height: 36,
                bgcolor: accent === "orange" ? themeColors.orangeSoft : themeColors.blueSoft,
                color: accent === "orange" ? themeColors.orange : themeColors.blue,
                flexShrink: 0,
            }}
        >
            {icon}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, color: themeColors.text, fontSize: 14 }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography sx={{ fontSize: 12, color: themeColors.muted, mt: 0.25 }}>
                    {subtitle}
                </Typography>
            )}
        </Box>

        {rightChip}
    </Paper>
);

const CustomerDetailPanel = ({ customer, loading }) => {
    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: "center", color: themeColors.muted }}>
                Loading customer details...
            </Box>
        );
    }

    if (!customer) return <EmptyCustomerState />;

    const customerInfo = customer.customer || {};
    const vehicles = customer.vehicles || [];
    const leads = customer.leads || [];
    const followups = customer.followups || [];
    const statusHistory = customer.statusHistory || [];

    const hasFollowUp = followups.length > 0;
    const hasHistory = statusHistory.length > 0;
    const hasPolicy = false;

    return (
        <Box sx={{ mt: 2, width: "100%", overflowX: "hidden" }}>
            <Paper
                variant="outlined"
                sx={{
                    p: { xs: 2, md: 2.5 },
                    borderRadius: 3,
                    borderColor: themeColors.border,
                    bgcolor: "#fff",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "flex-start", sm: "center" },
                        justifyContent: "space-between",
                        gap: 1.5,
                        flexDirection: { xs: "column", sm: "row" },
                        flexWrap: "wrap",
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={900} color={themeColors.text}>
                            {customerInfo.customer_name || "-"}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: themeColors.muted }}>
                            Customer profile overview
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <StatCard label="Vehicles" value={vehicles.length} accent="orange" />
                        <StatCard label="Leads" value={leads.length} accent="blue" />
                        <StatCard label="Follow-ups" value={followups.length} accent="orange" />
                    </Stack>
                </Box>
            </Paper>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                <Section title="Customer Information" icon={<PersonIcon sx={{ fontSize: 16 }} />} accent="blue" defaultExpanded>
                    <Stack spacing={0.5}>
                        <Row icon={<EmailIcon sx={{ fontSize: 14 }} />} label="Email" value={customerInfo.email} accent="blue" />
                        <Row icon={<LocationOnIcon sx={{ fontSize: 14 }} />} label="Address" value={customerInfo.address} accent="blue" />
                        <Row icon={<LocationOnIcon sx={{ fontSize: 14 }} />} label="City" value={customerInfo.city} accent="blue" />
                        <Row icon={<LocationOnIcon sx={{ fontSize: 14 }} />} label="District" value={customerInfo.district} accent="blue" />
                        <Row icon={<LocationOnIcon sx={{ fontSize: 14 }} />} label="State" value={customerInfo.state} accent="blue" />
                        <Row icon={<LocationOnIcon sx={{ fontSize: 14 }} />} label="Pincode" value={customerInfo.pincode} accent="blue" />
                    </Stack>
                </Section>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        alignItems: "stretch",
                        width: "100%",
                    }}
                >
                    {vehicles.length > 0 && (
                        <Box sx={{ flex: "1 1 420px", minWidth: { xs: "100%", md: 380 } }}>
                            <Section
                                title={`Vehicles (${vehicles.length})`}
                                icon={<DirectionsCarIcon sx={{ fontSize: 16 }} />}
                                accent="orange"
                                defaultExpanded
                            >
                                <Stack spacing={1.1}>
                                    {vehicles.map((v) => (
                                        <ListCard
                                            key={v.vehicle_id}
                                            title={v.registration_number}
                                            subtitle={[v.make, v.model, v.vehicle_category, v.fuel_type, v.rto].filter(Boolean).join(" • ")}
                                            icon={<DirectionsCarIcon sx={{ fontSize: 16 }} />}
                                            accent="orange"
                                            rightChip={
                                                <Chip
                                                    size="small"
                                                    label={v.is_active ? "Active" : "Inactive"}
                                                    sx={{
                                                        bgcolor: v.is_active ? "rgba(34,197,94,0.10)" : "rgba(148,163,184,0.12)",
                                                        color: v.is_active ? "#16a34a" : "#475569",
                                                        fontWeight: 800,
                                                        fontSize:{xs:10,sm:14}
                                                    }}
                                                />
                                            }
                                        />
                                    ))}
                                </Stack>
                            </Section>
                        </Box>
                    )}

                    {leads.length > 0 && (
                        <Box sx={{ flex: "1 1 420px", minWidth: { xs: "100%", md: 380 } }}>
                            <Section
                                title={`Current Leads (${leads.length})`}
                                icon={<AssignmentTurnedInIcon sx={{ fontSize: 16 }} />}
                                accent="blue"
                                defaultExpanded
                            >
                                <Stack spacing={1.1}>
                                    {leads.map((l) => (
                                        <ListCard
                                            key={l.lead_id}
                                            title={`Lead #${l.lead_id}`}
                                            subtitle={[l.status_name, l.work_status, l.lead_priority, l.assigned_to_name].filter(Boolean).join(" • ")}
                                            icon={<AssignmentTurnedInIcon sx={{ fontSize: 16 }} />}
                                            rightChip={
                                                <Chip
                                                    size="small"
                                                    label={l.work_status}
                                                    sx={{
                                                        bgcolor: "rgba(37,99,235,0.08)",
                                                        color: themeColors.blue,
                                                        fontWeight: 800,
                                                    }}
                                                />
                                            }
                                        />
                                    ))}
                                </Stack>
                            </Section>
                        </Box>
                    )}

                    {hasFollowUp && (
                        <Box sx={{ flex: "1 1 100%", minWidth: "100%" }}>
                            <Section
                                title="Follow Up History"
                                icon={<FollowTheSignsIcon sx={{ fontSize: 16 }} />}
                                accent="blue"
                                defaultExpanded
                            >
                                <Stack spacing={2}>
                                    {followups.map((item, index) => (
                                        <LeadFollowUpCard
                                            key={item.followup_id}
                                            item={item}
                                            index={index}
                                        />
                                    ))}
                                </Stack>
                            </Section>
                        </Box>
                    )}

                    {hasHistory && (
                        <Box sx={{ flex: "1 1 100%", minWidth: "100%" }}>
                            <Section
                                title="Lead Status History"
                                icon={<HistoryIcon sx={{ fontSize: 16 }} />}
                                accent="orange"
                                defaultExpanded
                            >
                                <Stack spacing={2}>
                                    {statusHistory.map((item, index) => (
                                        <LeadHistoryTimelineItem
                                            key={item.history_id}
                                            item={item}
                                            isLast={index === statusHistory.length - 1}
                                        />
                                    ))}
                                </Stack>
                            </Section>
                        </Box>
                    )}

                    {hasPolicy && (
                        <Box sx={{ flex: "1 1 100%", minWidth: "100%" }}>
                            <Section
                                title="Policy Details"
                                icon={<ArticleIcon sx={{ fontSize: 16 }} />}
                                accent="orange"
                                defaultExpanded
                            >
                                <Row
                                    label="Policy No"
                                    value={customer.policy_number || "-"}
                                    icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                                    accent="orange"
                                />
                                <Row
                                    label="Policy Type"
                                    value={customer.policy_type || "-"}
                                    icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                                    accent="orange"
                                />
                                <Row
                                    label="Start Date"
                                    value={customer.start_date || "-"}
                                    icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                                    accent="orange"
                                />
                                <Row
                                    label="Expiry Date"
                                    value={customer.expiry_date || "-"}
                                    icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                                    accent="orange"
                                />
                                <Row
                                    label="Premium"
                                    value={customer.premium_amount || "-"}
                                    icon={<ArticleIcon sx={{ fontSize: 14 }} />}
                                    accent="orange"
                                />
                            </Section>
                        </Box>
                    )}

                    {(customerInfo.remarks || leads.some((l) => l.remarks)) && (
                        <Box sx={{ flex: "1 1 100%", minWidth: "100%" }}>
                            <Section title="Notes and Remarks" icon={<NotesIcon sx={{ fontSize: 16 }} />} accent="orange" defaultExpanded>
                                <Typography sx={{ fontSize: 14, color: themeColors.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                                    {customerInfo.remarks ||
                                        leads.map((l) => l.remarks).filter(Boolean).join("\n\n") ||
                                        "No notes available"}
                                </Typography>
                            </Section>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default CustomerDetailPanel;