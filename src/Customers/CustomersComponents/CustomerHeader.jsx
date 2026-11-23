
import { memo } from "react";
import {
    Avatar,
    Box,
    Chip,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";

import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const CustomerHeader = ({ customer }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const returningCustomer = Boolean(customer?.is_previous_customer);

    const details = [
        {
            icon: <PhoneOutlinedIcon />,
            label: "PHONE",
            value: customer?.mobile_number_1 || "-",
        },
        {
            icon: <EmailOutlinedIcon />,
            label: "EMAIL",
            value: customer?.email || "-",
        },
        {
            icon: <LocationOnOutlinedIcon />,
            label: "LOCATION",
            value:
                [customer?.city, customer?.district]
                    .filter(Boolean)
                    .join(", ") || "-",
        },
    ];

    return (
        <Box
            sx={{
                position: "relative",
                zIndex: 2,
                mb: 2,

                px: { xs: 2, md: 2.5 },
                py: { xs: 2, md: 2.5 },

                borderRadius: "18px",

                backgroundColor: isDark ? "#193328" : "#ffffff",

                border: `1px solid ${isDark ? "#294638" : "#e2ebe4"
                    }`,

                boxShadow: isDark
                    ? "0 3px 10px rgba(0,0,0,0.12)"
                    : "0 3px 12px rgba(20,60,40,0.05)",
            }}
        >
            <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "flex-start", md: "center" }}
                spacing={2.5}
            >
                {/* AVATAR */}
                <Avatar
                    sx={{
                        width: 60,
                        height: 60,
                        bgcolor: isDark ? "#28543e" : "#e3f5e9",
                        color: isDark ? "#43dc83" : "#16834a",
                        fontSize: 27,
                        fontWeight: 900,
                        border: `2px solid ${isDark ? "#376a4d" : "#ccebd6"
                            }`,
                    }}
                >
                    {customer?.customer_name?.charAt(0)?.toUpperCase() || "C"}
                </Avatar>

                {/* CUSTOMER INFORMATION */}
                <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>

                    {/* NAME + TYPE */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={1}
                        sx={{ mb: 2 }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: 18, md: 23 },
                                fontWeight: 900,
                                color: isDark ? "#f1f5f9" : "#193b2b",
                                letterSpacing: "-0.5px",
                                lineHeight: 1.3,
                            }}
                        >
                            {customer?.customer_name?.toUpperCase() || "CUSTOMER"}
                        </Typography>

                        <Chip
                            label={
                                returningCustomer
                                    ? "RETURNING CUSTOMER"
                                    : "NEW CUSTOMER"
                            }
                            size="small"
                            sx={{
                                height: 23,
                                borderRadius: "6px",
                                bgcolor: returningCustomer
                                    ? isDark ? "#244b35" : "#e3f6e9"
                                    : isDark ? "#253f50" : "#e6f3fb",
                                color: returningCustomer
                                    ? "#43dc83"
                                    : "#38a8e8",
                                fontWeight: 900,
                                fontSize: 9,
                                letterSpacing: "0.3px",
                            }}
                        />
                    </Stack>

                    {/* DETAILS */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, minmax(0, 1fr))",
                                lg: "repeat(3, minmax(0, 1fr))",
                            },
                            gap: { xs: 1.5, md: 2 },
                        }}
                    >
                        {details.map((item) => (
                            <Stack
                                key={item.label}
                                direction="row"
                                alignItems="center"
                                spacing={1.2}
                                sx={{ minWidth: 0 }}
                            >
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        minWidth: 32,
                                        borderRadius: "9px",
                                        bgcolor: isDark ? "#254536" : "#edf7ef",
                                        color: isDark ? "#43dc83" : "#16834a",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        "& svg": {
                                            fontSize: 17,
                                        },
                                    }}
                                >
                                    {item.icon}
                                </Box>

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontSize: 9,
                                            fontWeight: 800,
                                            color: isDark ? "#8fa99a" : "#84958a",
                                            letterSpacing: "0.7px",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {item.label}
                                    </Typography>

                                    <Typography
                                        title={item.value}
                                        sx={{
                                            fontSize: 11,
                                            fontWeight: 800,
                                            color: isDark ? "#e2eee6" : "#294638",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.value}
                                    </Typography>
                                </Box>
                            </Stack>
                        ))}
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default memo(CustomerHeader);
