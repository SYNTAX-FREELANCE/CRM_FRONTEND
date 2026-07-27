// PolicyCard.jsx
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
import LocationCityIcon from '@mui/icons-material/LocationCity';


const PolicyCard = ({ policy, onOpen }) => {
    const status = (policy.policy_status || "UNKNOWN").toUpperCase();

    const statusColor =
        status === "ACTIVE"
            ? "#2e7d32" // green
            : status === "EXPIRED"
                ? "#d32f2f" // red
                : "#f57c00"; // orange

    return (
        <Card
            onClick={() => onOpen?.(policy)}
            sx={{
                height: "100%",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 6px rgba(40, 40, 37, 0.68)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: `
              radial-gradient(circle at 15% 25%, rgba(144, 179, 255, 0.22) 0%, transparent 45%),
              radial-gradient(circle at 85% 75%, rgba(255, 184, 133, 0.18) 0%, transparent 45%),
              linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)`,
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                    border: "1px solid #ff9327",
                },
            }}>
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1.5}
                    sx={{ mb: 1.2 }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                        }}>
                            <LocationCityIcon sx={{
                                color: '#ef410c'
                            }} />
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    color: "#111827",
                                    lineHeight: 1,
                                }}
                                noWrap
                            >
                                {policy?.company_name?.toUpperCase() || "Insurer"}
                            </Typography>
                        </Box>
                        <Typography
                            variant="caption"
                            sx={{ color: "#151616", fontSize: 10, fontWeight: 800 }}
                            noWrap
                        >
                            POLICY NO :{policy?.policy_number || "-"}
                        </Typography>
                    </Box>

                    <Chip
                        label={status}
                        size="small"
                        sx={{
                            bgcolor: "rgba(0,0,0,0.04)",
                            color: statusColor,
                            fontWeight: 800,
                            fontSize: 10
                        }}
                    />
                </Stack>

                {/* Minimal key details (only 3 lines) */}
                <Stack spacing={0.6}>
                    <MinimalRow
                        label="Vehicle"
                        value={`${policy?.vehicle_maker || ""} ${policy?.model || ""}`}
                    />
                    <MinimalRow label="Reg No" value={policy?.registration_number || "-"} />
                    <MinimalRow
                        label="Premium"
                        value={`₹${policy?.premium_amount || "-"}`}
                    />
                </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen?.(policy);
                    }}
                    sx={{
                        borderRadius: 1,
                        background: "#111010",
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: 12,
                        "&:hover": {
                            background: "#050505",
                        },
                    }}
                >
                    View Details
                </Button>
            </CardActions>
        </Card>
    );
};

const MinimalRow = ({ label, value }) => (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Typography
            variant="body2"
            sx={{
                color: "#6b7280",
                minWidth: 72,
                fontSize: 13,
                fontWeight: 800,
            }}
        >
            {label}
        </Typography>
        <Typography
            variant="body2"
            sx={{
                color: "#080808",
                fontWeight: 800,
                textAlign: "right",
                fontSize: 12,
            }}
            noWrap
        >
            {value}
        </Typography>
    </Stack>
);

export default memo(PolicyCard);