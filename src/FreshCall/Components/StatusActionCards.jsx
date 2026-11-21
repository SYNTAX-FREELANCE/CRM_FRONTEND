// import React, { memo, useMemo } from "react";
// import {
//     Box,
//     Stack,
//     Typography,
//     Button,
//     alpha,
//     useTheme,
// } from "@mui/material";

// import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
// import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import FiberNewIcon from "@mui/icons-material/FiberNew";
// import { useLeadMaster } from "../../CommonCode/useQuery";

// const statusConfig = {
//     CALLBACK: {
//         icon: <PhoneCallbackIcon />,
//         color: "#f97316",
//         desc: "Schedule another call",
//     },
//     QUOTE: {
//         icon: <RequestQuoteIcon />,
//         color: "#2563eb",
//         desc: "Prepare quotation",
//     },
//     APPOINTMENT: {
//         icon: <EventAvailableIcon />,
//         color: "#7c3aed",
//         desc: "Book customer visit",
//     },
//     SOLD: {
//         icon: <CheckCircleIcon />,
//         color: "#16a34a",
//         desc: "Policy renewed",
//     },
//     LOST: {
//         icon: <CancelIcon />,
//         color: "#ef4444",
//         desc: "Lead closed",
//     },
//     NEW: {
//         icon: <FiberNewIcon />,
//         color: "#0891b2",
//         desc: "Fresh Lead",
//     },
// };

// const StatusActionCards = ({
//     selectedStatus = {},
//     onStatusClick,
//     onReset,
//     title = "Choose Next Action",
// }) => {


//     const { data: LeadMasterDetail = [] } = useLeadMaster();

//     const theme = useTheme();
//     const isDark = theme.palette.mode === 'dark';

//     const statuses = useMemo(() => {
//         return Array.isArray(LeadMasterDetail)
//             ? LeadMasterDetail.filter(
//                 stat => stat.is_active === 1 && stat.status_id !== 1
//             )
//             : [];
//     }, [LeadMasterDetail]);



//     const displayStatuses = selectedStatus
//         ? statuses.filter((s) => s.status_id === selectedStatus?.status_id)
//         : statuses;

//     return (
//         <Stack spacing={2.5}>
//             <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//             >
//                 <Typography
//                     sx={{
//                         fontWeight: 900,
//                         fontSize: 18,
//                         color: isDark ? "#ffffff" : "#1e293b",
//                     }}
//                 >
//                     {title}
//                 </Typography>

//                 {selectedStatus && (
//                     <Button
//                         onClick={onReset}
//                         size="small"
//                         variant="outlined"
//                         sx={{
//                             textTransform: "none",
//                             fontWeight: 700,
//                             borderRadius: 3,
//                         }}
//                     >
//                         Change Status
//                     </Button>
//                 )}
//             </Stack>

//             <Box
//                 sx={{
//                     display: "grid",
//                     gridTemplateColumns: {
//                         xs: "1fr",
//                         sm: selectedStatus ? "1fr" : "repeat(2,1fr)",
//                         md: selectedStatus ? "1fr" : "repeat(3,1fr)",
//                     },
//                     gap: 2,
//                 }}
//             >
//                 {displayStatuses?.map((item) => {
//                     const cfg =
//                         statusConfig[item.status_name?.toUpperCase()] || {
//                             icon: <FiberNewIcon />,
//                             color: "#2563eb",
//                             desc: "Update Lead Status",
//                         };

//                     const active =
//                         selectedStatus &&
//                         item.status_id ===
//                         selectedStatus?.status_id;


//                     const statusName = item.status_name === 'SOLD' ? 'CAPTURED' : item.status_name;

//                     return (
//                         <Box
//                             key={item.status_id}
//                             onClick={() => onStatusClick(item)}
//                             sx={{
//                                 cursor: "pointer",
//                                 position: "relative",
//                                 overflow: "hidden",
//                                 borderRadius: 4,
//                                 p: 2,
//                                 transition: ".3s",

//                                 background: active
//                                     ? `linear-gradient(135deg,
//                      ${alpha(cfg.color, .12)},
//                      #ffffff)`
//                                     : "linear-gradient(135deg,#ffffff,#f8fbff)",

//                                 border: `2px solid ${active
//                                     ? cfg.color
//                                     : alpha(cfg.color, .15)
//                                     }`,

//                                 boxShadow: active
//                                     ? `0 18px 45px ${alpha(
//                                         cfg.color,
//                                         .25
//                                     )}`
//                                     : "0 8px 25px rgba(15,23,42,.05)",

//                                 "&:hover": {
//                                     transform: "translateY(-6px)",
//                                     borderColor: cfg.color,
//                                     boxShadow: `0 20px 40px ${alpha(
//                                         cfg.color,
//                                         .22
//                                     )}`,
//                                 },

//                                 "&::after": {
//                                     content: '""',
//                                     position: "absolute",
//                                     right: -20,
//                                     top: -20,
//                                     width: 90,
//                                     height: 90,
//                                     borderRadius: "50%",
//                                     background: alpha(cfg.color, .08),
//                                 },
//                             }}
//                         >
//                             <Stack
//                                 direction="row"
//                                 spacing={2}
//                                 alignItems="center"
//                             >
//                                 <Box
//                                     sx={{
//                                         width: active ? 40 : 30,
//                                         height: active ? 40 : 30,
//                                         borderRadius: "18px",
//                                         bgcolor: alpha(cfg.color, .12),
//                                         color: cfg.color,
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "center",

//                                         "& svg": {
//                                             fontSize: active ? 25 : 20,
//                                         },
//                                     }}
//                                 >
//                                     {cfg.icon}
//                                 </Box>

//                                 <Box flex={1}>
//                                     <Typography
//                                         sx={{
//                                             fontWeight: 900,
//                                             fontSize: active ? 15 : 10,
//                                             color: "#0f172a",
//                                         }} >
//                                         {statusName}
//                                     </Typography>

//                                     <Typography
//                                         sx={{
//                                             mt: .5,
//                                             color: "#64748b",
//                                             fontWeight: 600,
//                                             fontSize: active ? 12 : 8,
//                                         }}
//                                     >
//                                         {cfg.desc}
//                                     </Typography>
//                                 </Box>
//                             </Stack>
//                         </Box>
//                     );
//                 })}
//             </Box>
//         </Stack>
//     );  
// };

// export default memo(StatusActionCards);



import React, { memo, useMemo } from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    alpha,
    useTheme,
} from "@mui/material";

import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FiberNewIcon from "@mui/icons-material/FiberNew";

import { useLeadMaster } from "../../CommonCode/useQuery";

const statusConfig = {
    CALLBACK: {
        icon: <PhoneCallbackIcon />,
        color: "#d97706",
        desc: "Schedule another call",
    },
    QUOTE: {
        icon: <RequestQuoteIcon />,
        color: "#21834b",
        desc: "Prepare quotation",
    },
    APPOINTMENT: {
        icon: <EventAvailableIcon />,
        color: "#21834b",
        desc: "Book customer visit",
    },
    SOLD: {
        icon: <CheckCircleIcon />,
        color: "#21834b",
        desc: "Policy renewed",
    },
    LOST: {
        icon: <CancelIcon />,
        color: "#dc5555",
        desc: "Lead closed",
    },
    NEW: {
        icon: <FiberNewIcon />,
        color: "#21834b",
        desc: "Fresh Lead",
    },
};

const StatusActionCards = ({
    selectedStatus = {},
    onStatusClick,
    onReset,
    title = "Choose Next Action",
}) => {
    const { data: LeadMasterDetail = [] } = useLeadMaster();

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const colors = {
        background: isDark ? "#1c2620" : "#ffffff",
        border: isDark ? "#344239" : "#e5ebe7",
        text: isDark ? "#edf4ef" : "#26352b",
        muted: isDark ? "#9ba99f" : "#718078",
        primary: "#21834b",
        soft: isDark ? "#222e26" : "#f5f9f6",
    };

    const statuses = useMemo(() => {
        return Array.isArray(LeadMasterDetail)
            ? LeadMasterDetail.filter(
                stat => stat.is_active === 1 && stat.status_id !== 1
            )
            : [];
    }, [LeadMasterDetail]);

    const displayStatuses = selectedStatus
        ? statuses.filter((s) => s.status_id === selectedStatus?.status_id)
        : statuses;

    return (
        <Stack spacing={2}>
            {/* HEADER */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={1}
            >
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: 15, sm: 17 },
                            color: colors.text,
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 11,
                            color: colors.muted,
                            mt: 0.3,
                        }}
                    >
                        Select the next action for this lead
                    </Typography>
                </Box>

                {selectedStatus && (
                    <Button
                        onClick={onReset}
                        size="small"
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 11,
                            borderRadius: "9px",
                            px: 1.5,
                            color: colors.primary,
                            borderColor: isDark ? "#397c53" : "#b8d9c2",
                            flexShrink: 0,
                            "&:hover": {
                                bgcolor: isDark
                                    ? "rgba(33,131,75,0.12)"
                                    : "#edf7f0",
                                borderColor: colors.primary,
                            },
                        }}
                    >
                        Change Status
                    </Button>
                )}
            </Stack>

            {/* STATUS CARDS */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: selectedStatus ? "1fr" : "repeat(2, minmax(0, 1fr))",
                        md: selectedStatus ? "1fr" : "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                }}
            >
                {displayStatuses?.map((item) => {
                    const cfg =
                        statusConfig[item.status_name?.toUpperCase()] || {
                            icon: <FiberNewIcon />,
                            color: colors.primary,
                            desc: "Update Lead Status",
                        };

                    const active =
                        selectedStatus &&
                        item.status_id === selectedStatus?.status_id;

                    const statusName =
                        item.status_name === "SOLD"
                            ? "CAPTURED"
                            : item.status_name;

                    return (
                        <Box
                            key={item.status_id}
                            onClick={() => onStatusClick(item)}
                            sx={{
                                cursor: "pointer",
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: "15px",
                                p: { xs: 1.75, sm: 2 },
                                background: active
                                    ? isDark
                                        ? "rgba(33,131,75,0.16)"
                                        : "#f0f8f2"
                                    : colors.background,
                                border: `1px solid ${
                                    active
                                        ? colors.primary
                                        : colors.border
                                }`,
                                boxShadow: active
                                    ? isDark
                                        ? "0 0 0 1px rgba(33,131,75,0.12)"
                                        : "0 3px 12px rgba(33,131,75,0.08)"
                                    : isDark
                                        ? "none"
                                        : "0 2px 8px rgba(15,23,42,0.025)",
                                transition: "all 0.2s ease",

                                "&:hover": {
                                    borderColor: colors.primary,
                                    bgcolor: isDark
                                        ? "rgba(33,131,75,0.12)"
                                        : "#f6fbf7",
                                    transform: "translateY(-2px)",
                                    boxShadow: isDark
                                        ? "0 5px 14px rgba(0,0,0,0.2)"
                                        : "0 5px 15px rgba(33,131,75,0.08)",
                                },

                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    right: -24,
                                    top: -28,
                                    width: 85,
                                    height: 85,
                                    borderRadius: "50%",
                                    background: alpha(cfg.color, 0.055),
                                    pointerEvents: "none",
                                },
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                            >
                                {/* ICON */}
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "12px",
                                        bgcolor: alpha(cfg.color, 0.12),
                                        color: cfg.color,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        "& svg": {
                                            fontSize: 21,
                                        },
                                    }}
                                >
                                    {cfg.icon}
                                </Box>

                                {/* STATUS DETAILS */}
                                <Box flex={1} minWidth={0}>
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: 13,
                                            color: colors.text,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {statusName}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.4,
                                            color: colors.muted,
                                            fontWeight: 500,
                                            fontSize: 11,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {cfg.desc}
                                    </Typography>
                                </Box>

                                {/* SELECTED INDICATOR */}
                                {active && (
                                    <CheckCircleIcon
                                        sx={{
                                            color: colors.primary,
                                            fontSize: 19,
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                            </Stack>
                        </Box>
                    );
                })}
            </Box>
        </Stack>
    );
};

export default memo(StatusActionCards);
