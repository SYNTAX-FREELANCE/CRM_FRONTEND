import { memo } from "react";
import {
    Avatar,
    Box,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const CustomerHeader = ({ customer }) => {

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    return (
        <Box
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                px: 3,
                py: 2.5,
                borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.8)",
                bgcolor: isDark ? "rgba(34, 46, 69, 0.93)" : "#fff",
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                width="100%"
                position="relative"
            >
                <Stack direction="row" spacing={2.5} sx={{ width: "100%" }}>
                    <Avatar
                        sx={{
                            width: { xs: 60, sm: 60 },
                            height: { xs: 60, sm: 60 },
                            bgcolor: "#e3dfdf",
                            color: "#ef410c",
                            fontWeight: 800,
                            fontSize: 34,
                        }}
                    >
                        {customer?.customer_name?.charAt(0)}
                    </Avatar>

                    <Box sx={{ width: "100%" }}>
                        <Typography
                            sx={{
                                fontSize: { xs: 16, md: 24 },
                                fontWeight: 800,
                                color: isDark ? "#f8fafc" : "#2f333c",
                            }}
                        >
                            {customer?.customer_name?.toUpperCase()}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                flexDirection: { xs: "column", sm: "row" },
                                mt: 0.8,
                                gap: 1,
                            }}
                        >
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PhoneOutlinedIcon
                                        sx={{ fontSize: 14, color: "#ef410c" }}
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 800,
                                            color: isDark ? "#f8fafc" : "text.secondary",
                                        }}
                                    >
                                        {customer?.mobile_number_1 || "-"}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <EmailOutlinedIcon
                                        sx={{ fontSize: 14, color: "#ef410c" }}
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 800,
                                            color: isDark ? "#f8fafc" : "text.secondary",
                                        }}
                                    >
                                        {customer?.email || "-"}
                                    </Typography>
                                </Stack>
                            </Box>

                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PersonOutlineOutlinedIcon
                                        sx={{ fontSize: 12, color: "#ef410c" }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 800,
                                            color: isDark ? "#f8fafc" : "text.secondary",
                                        }}
                                    >
                                        Customer Type -
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 800,
                                            color: isDark ? "#f8fafc" : "text.secondary",
                                        }}
                                    >
                                        {customer?.is_previous_customer
                                            ? "RETURNING"
                                            : "NEW CUSTOMER"}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOnOutlinedIcon
                                        sx={{ fontSize: 12, color: "#ef410c" }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 800,
                                            color: isDark ? "#f8fafc" : "text.secondary",
                                        }}
                                    >
                                        {[customer?.city, customer?.district]
                                            .filter(Boolean)
                                            .join(", ") || "-"}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
};

export default memo(CustomerHeader);