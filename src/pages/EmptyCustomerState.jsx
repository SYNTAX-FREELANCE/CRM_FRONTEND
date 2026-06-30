import React from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Chip,
    Divider,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SearchIcon from "@mui/icons-material/Search";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import DescriptionIcon from "@mui/icons-material/Description";
import ShieldIcon from "@mui/icons-material/Shield";

const EmptyCustomerState = () => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 4,
                border: "1px solid rgba(226,232,240,0.95)",
                bgcolor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
                overflow: "hidden",
                position: "relative",
                minHeight: { xs: 420, md: 500 },
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle at top left, rgba(37,99,235,0.12), transparent 32%), radial-gradient(circle at bottom right, rgba(16,185,129,0.10), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.9))",
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    gap: { xs: 3, md: 5 },
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        width: { xs: 220, sm: 260, md: 320 },
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <Box
                        component="svg"
                        viewBox="0 0 420 340"
                        sx={{ width: "100%", height: "auto" }}
                    >
                        <defs>
                            <linearGradient id="bgGrad" x1="0" x2="1" y1="0" y2="1">
                                <stop offset="0%" stopColor="#eff6ff" />
                                <stop offset="100%" stopColor="#ecfeff" />
                            </linearGradient>
                            <linearGradient id="carGrad" x1="0" x2="1" y1="0" y2="1">
                                <stop offset="0%" stopColor="#2563eb" />
                                <stop offset="100%" stopColor="#0f766e" />
                            </linearGradient>
                            <linearGradient id="glassGrad" x1="0" x2="1" y1="0" y2="1">
                                <stop offset="0%" stopColor="#dbeafe" />
                                <stop offset="100%" stopColor="#bfdbfe" />
                            </linearGradient>
                        </defs>

                        <rect x="25" y="25" width="370" height="290" rx="34" fill="url(#bgGrad)" />
                        <circle cx="330" cy="74" r="24" fill="rgba(37,99,235,0.10)" />
                        <circle cx="105" cy="74" r="16" fill="rgba(16,185,129,0.12)" />
                        <circle cx="344" cy="245" r="20" fill="rgba(245,158,11,0.14)" />
                        <circle cx="75" cy="245" r="12" fill="rgba(37,99,235,0.10)" />

                        <rect x="108" y="154" width="204" height="56" rx="22" fill="url(#carGrad)" />
                        <path d="M132 154 L164 120 H254 L282 154 Z" fill="#3b82f6" />
                        <rect x="172" y="128" width="48" height="20" rx="8" fill="url(#glassGrad)" />
                        <rect x="225" y="128" width="38" height="20" rx="8" fill="#bfdbfe" />
                        <circle cx="158" cy="218" r="22" fill="#0f172a" />
                        <circle cx="260" cy="218" r="22" fill="#0f172a" />
                        <circle cx="158" cy="218" r="10" fill="#94a3b8" />
                        <circle cx="260" cy="218" r="10" fill="#94a3b8" />

                        <rect x="300" y="138" width="48" height="70" rx="14" fill="#ffffff" />
                        <path
                            d="M314 158 L322 166 L337 150"
                            stroke="#10b981"
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <text
                            x="324"
                            y="193"
                            textAnchor="middle"
                            fontSize="14"
                            fill="#2563eb"
                            fontWeight="700"
                        >
                            CRM
                        </text>

                        <circle cx="88" cy="210" r="28" fill="#ffffff" />
                        <path
                            d="M88 199c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9zm0-8c-9 0-16 7-16 16 0 14 16 28 16 28s16-14 16-28c0-9-7-16-16-16z"
                            fill="#2563eb"
                        />
                        <path d="M88 202c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z" fill="#93c5fd" />

                        <rect x="54" y="36" width="76" height="24" rx="12" fill="#ffffff" />
                        <text x="92" y="52" textAnchor="middle" fontSize="12" fill="#2563eb" fontWeight="700">
                            Search ready
                        </text>
                    </Box>
                </Box>

                <Box
                    sx={{
                        position: "relative",
                        flex: 1,
                        minWidth: 0,
                        textAlign: { xs: "center", md: "left" },
                    }}
                >
                    <Chip
                        icon={<SearchIcon sx={{ fontSize: 18 }} />}
                        label="Customer workspace"
                        sx={{
                            mb: 1.5,
                            bgcolor: "rgba(37,99,235,0.08)",
                            color: "#1d4ed8",
                            fontWeight: 700,
                            "& .MuiChip-icon": { color: "#1d4ed8" },
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: { xs: 24, sm: 28, md: 34 },
                            fontWeight: 900,
                            color: "#0f172a",
                            lineHeight: 1.05,
                            fontSize: { xs: 14, sm: 16, md: 18 }
                        }}
                    >
                        Nothing selected yet
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.2,
                            color: "#64748b",
                            fontSize: { xs: 14, sm: 15, md: 16 },
                            maxWidth: 620,
                            mx: { xs: "auto", md: 0 },
                            lineHeight: 1.7,
                            fontSize: { xs: 10, sm: 12, md: 16 }

                        }}
                    >
                        Start by searching with a vehicle number, mobile number, or customer name. Once you pick a match, this page can show vehicle records, insurance status, customer profile, and related CRM activity.
                    </Typography>

                    <Divider sx={{ my: 2.5, borderColor: "rgba(226,232,240,0.9)" }} />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "repeat(1, minmax(0, 1fr))",
                                sm: "repeat(2, minmax(0, 1fr))",
                                md: "repeat(1, minmax(0, 1fr))",
                                lg: "repeat(3, minmax(0, 1fr))",
                            },
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        {[
                            { icon: <DirectionsCarIcon sx={{ fontSize: 18 }} />, title: "Vehicle records", sub: "Registration, model, ownership" },
                            { icon: <VerifiedUserIcon sx={{ fontSize: 18 }} />, title: "Insurance", sub: "Policy and renewal visibility" },
                            { icon: <AssignmentIndIcon sx={{ fontSize: 18 }} />, title: "Customer profile", sub: "Contact and account details" },
                            { icon: <ShieldIcon sx={{ fontSize: 18 }} />, title: "Service history", sub: "Follow-up and status timeline" },
                        ].map((item) => (
                            <Box
                                key={item.title}
                                sx={{
                                    minWidth: { xs: "100%", sm: 220 },
                                    flex: "1 1 220px",
                                    p: 1.5,
                                    borderRadius: 3,
                                    border: "1px solid rgba(226,232,240,0.95)",
                                    bgcolor: "rgba(248,250,252,0.9)",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1.2,
                                    transition: "0.2s ease",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
                                        borderColor: "rgba(37,99,235,0.18)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        display: "grid",
                                        placeItems: "center",
                                        bgcolor: "rgba(37,99,235,0.10)",
                                        color: "#2563eb",
                                        flexShrink: 0,
                                    }}
                                >
                                    {item.icon}
                                </Box>

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography 
                                    sx={{ fontSize: 14,
                                     fontWeight: 800, color: "#0f172a" }}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12.5, color: "#64748b", mt: 0.2 }}>
                                        {item.sub}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <Typography
                        sx={{
                            mt: 3,
                            fontSize: 13,
                            color: "#94a3b8",
                            fontStyle: "italic",
                        }}
                    >
                        Tip: typing at least 3 characters gives more accurate customer matches.
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default EmptyCustomerState;