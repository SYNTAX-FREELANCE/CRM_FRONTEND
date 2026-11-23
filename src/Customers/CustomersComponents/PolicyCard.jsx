
import { memo } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import LocationCityIcon from "@mui/icons-material/LocationCity";

const PolicyCard = ({ policy, onOpen, isDark }) => {
    const status = (policy.policy_status || "UNKNOWN").toUpperCase();

    const statusColor =
        status === "ACTIVE"
            ? "#22c55e"
            : status === "EXPIRED"
                ? "#ef4444"
                : "#f59e0b";

    return (
        <Card
            onClick={() => onOpen?.(policy)}
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: isDark
                    ? "rgba(119, 164, 140, 0.18)"
                    : "#dce9df",

                cursor: "pointer",
                transition: "all 0.25s ease",

                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: isDark
                    ? "linear-gradient(110deg, #102c25 0%, #142f25 100%)"
                    : "linear-gradient(110deg, #e8f5ed 0%, #dcefe3 100%)",
                border: isDark
                    ? "1px solid rgba(74, 222, 128, 0.08)"
                    : "1px solid rgba(22, 101, 52, 0.10)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "#43dc83",
                    boxShadow: isDark
                        ? "0 12px 25px rgba(0,0,0,0.3)"
                        : "0 12px 25px rgba(22,101,52,0.12)",
                },
            }}
        >
            <CardContent
                sx={{
                    flexGrow: 1,
                    p: 2,
                    "&:last-child": {
                        pb: 2,
                    },
                }}
            >
                {/* COMPANY AND STATUS */}
                <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ mb: 2 }}
                >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ mb: 0.8 }}
                        >
                            <LocationCityIcon
                                sx={{
                                    color: "#083f1fff",
                                    fontSize: 21,
                                    flexShrink: 0,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    color: isDark ? "#f1f5f9" : "#173d2d",
                                    fontSize: 14,
                                    lineHeight: 1.3,
                                }}
                                noWrap
                            >
                                {policy?.company_name?.toUpperCase() || "INSURER"}
                            </Typography>
                        </Stack>

                        <Typography
                            sx={{
                                color: isDark ? "#9fb5aa" : "#718579",
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.4px",
                            }}
                            noWrap
                        >
                            POLICY NO: {policy?.policy_number || "-"}
                        </Typography>
                    </Box>

                    <Chip
                        label={status}
                        size="small"
                        sx={{
                            height: 23,
                            borderRadius: "7px",
                            bgcolor: `${statusColor}18`,
                            color: statusColor,
                            border: `1px solid ${statusColor}50`,
                            fontWeight: 900,
                            fontSize: 9,
                            letterSpacing: "0.4px",
                        }}
                    />
                </Stack>

                {/* DIVIDER */}
                <Box
                    sx={{
                        height: "1px",
                        bgcolor: isDark
                            ? "rgba(148,163,184,0.15)"
                            : "rgba(22,101,52,0.12)",
                        mb: 1.8,
                    }}
                />

                {/* POLICY DETAILS */}
                <Stack spacing={1.3}>
                    <MinimalRow
                        label="Vehicle"
                        value={`${policy?.vehicle_maker || ""} ${policy?.model || ""}`.trim() || "-"}
                        isDark={isDark}
                    />

                    <MinimalRow
                        label="Reg No"
                        value={policy?.registration_number || "-"}
                        isDark={isDark}
                    />

                    <MinimalRow
                        label="Premium"
                        value={`₹${policy?.premium_amount ?? "-"}`}
                        isDark={isDark}
                        highlight
                    />
                </Stack>
            </CardContent>

            {/* VIEW DETAILS */}
            <CardActions
                sx={{
                    px: 2,
                    pb: 2,
                    pt: 0,
                }}
            >
                <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen?.(policy);
                    }}
                    sx={{
                        borderRadius: "11px",
                        background: "#2d7b4eff",
                        color: "#082c1c",
                        textTransform: "none",
                        fontWeight: 900,
                        fontSize: 12,
                        py: 1,
                        boxShadow: "none",

                        "&:hover": {
                            background: "#35c975",
                            boxShadow: "0 5px 15px rgba(67,220,131,0.18)",
                        },
                    }}
                >
                    View Details
                </Button>
            </CardActions>
        </Card>
    );
};

const MinimalRow = ({ label, value, isDark, highlight = false }) => (
    <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
    >
        <Typography
            sx={{
                color: isDark ? "#9fb5aa" : "#718579",
                minWidth: 65,
                fontSize: 11,
                fontWeight: 700,
            }}
        >
            {label}
        </Typography>

        <Typography
            sx={{
                color: highlight
                    ? "#1c5333ff"
                    : isDark
                        ? "#f1f5f9"
                        : "#173d2d",
                fontWeight: 800,
                textAlign: "right",
                fontSize: 12,
                minWidth: 0,
            }}
            noWrap
        >
            {value}
        </Typography>
    </Stack>
);

export default memo(PolicyCard);
