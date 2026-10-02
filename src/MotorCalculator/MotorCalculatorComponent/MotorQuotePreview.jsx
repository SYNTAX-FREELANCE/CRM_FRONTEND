import React from "react";
import {
    Box,
    Divider,
    Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

const PreviewSection = ({
    icon,
    title,
    children,
}) => {
    return (
        <Box sx={{ mb: 1.5 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                    mb: 0.7,
                }}
            >
                {icon}

                <Typography
                    sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "text.secondary",
                        textTransform:
                            "uppercase",
                        letterSpacing: 0.5,
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {children}
        </Box>
    );
};



const MotorQuotePreview = ({
    data,
    completed,
}) => {
    const hasCustomer =
        completed.customer ||
        completed.vehicle;

    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor:
                    "background.paper",

                overflow: "hidden",

                position: "sticky",
                top: 0,
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    px: 1.5,
                    py: 1.2,

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",

                    backgroundColor:
                        "background.default",
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 800,
                        }}
                    >
                        Quote Preview
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 10,
                            color: "text.secondary",
                            mt: 0.2,
                        }}
                    >
                        Live calculation summary
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: 27,
                        height: 27,
                        borderRadius: "50%",

                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "center",

                        backgroundColor:
                            "primary.softBg",

                        color:
                            "primary.main",
                    }}
                >
                    <DescriptionRoundedIcon
                        sx={{
                            fontSize: 16,
                        }}
                    />
                </Box>
            </Box>

            <Divider />

            {/* CONTENT */}

            <Box sx={{ p: 1.5 }}>
                {/* CUSTOMER */}

                {data.customer && (
                    <PreviewSection
                        title="Customer"
                        icon={
                            <PersonRoundedIcon
                                sx={{
                                    fontSize: 15,
                                    color:
                                        "primary.main",
                                }}
                            />
                        }
                    >
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 1.2,
                                backgroundColor:
                                    "action.hover",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                            >
                                {data.customer
                                    .customer_name ||
                                    data.customer
                                        .name ||
                                    "Customer"}
                            </Typography>
                        </Box>
                    </PreviewSection>
                )}

                {/* VEHICLE */}

                {data.vehicle && (
                    <PreviewSection
                        title="Vehicle"
                        icon={
                            <DirectionsCarRoundedIcon
                                sx={{
                                    fontSize: 15,
                                    color:
                                        "primary.main",
                                }}
                            />
                        }
                    >
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 1.2,
                                backgroundColor:
                                    "action.hover",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                            >
                                {data.vehicle
                                    .registration_number ||
                                    "Vehicle"}
                            </Typography>

                            {data.vehicle.model && (
                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        color:
                                            "text.secondary",
                                        mt: 0.3,
                                    }}
                                >
                                    {
                                        data
                                            .vehicle
                                            .model
                                    }
                                </Typography>
                            )}
                        </Box>
                    </PreviewSection>
                )}

                {/* INSURANCE */}

                {data.insurance && (
                    <PreviewSection
                        title="Insurance"
                        icon={
                            <BusinessRoundedIcon
                                sx={{
                                    fontSize: 15,
                                    color:
                                        "primary.main",
                                }}
                            />
                        }
                    >
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 1.2,
                                backgroundColor:
                                    "action.hover",
                            }}
                        >
                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 0.5,
                                }}
                            >
                                <CheckCircleRoundedIcon
                                    sx={{
                                        fontSize: 14,
                                        color:
                                            "success.main",
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                    }}
                                >
                                    {
                                        data
                                            .insurance
                                            .label
                                    }
                                </Typography>
                            </Box>
                        </Box>
                    </PreviewSection>
                )}

                {/* POLICY */}

                {data.policy && (
                    <PreviewSection
                        title="Policy"
                        icon={
                            <DescriptionRoundedIcon
                                sx={{
                                    fontSize: 15,
                                    color:
                                        "primary.main",
                                }}
                            />
                        }
                    >
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 1.2,
                                backgroundColor:
                                    "action.hover",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                            >
                                Policy details
                                selected
                            </Typography>
                        </Box>
                    </PreviewSection>
                )}

                {/* EMPTY STATE */}

                {!data.customer &&
                    !data.vehicle &&
                    !data.insurance &&
                    !data.policy && (
                        <Box
                            sx={{
                                py: 4,
                                textAlign: "center",
                            }}
                        >
                            <DescriptionRoundedIcon
                                sx={{
                                    fontSize: 30,
                                    color:
                                        "text.disabled",
                                    mb: 0.8,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 11,
                                    color:
                                        "text.secondary",
                                }}
                            >
                                Start by selecting a
                                customer and vehicle
                            </Typography>
                        </Box>
                    )}
            </Box>

            <Divider />

            {/* PREMIUM */}

            <Box
                sx={{
                    px: 1.5,
                    py: 1.2,

                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                }}
            >
                <Typography
                    sx={{
                        fontSize: 11,
                        color:
                            "text.secondary",
                        fontWeight: 600,
                    }}
                >
                    Estimated Premium
                </Typography>

                <Typography
                    sx={{
                        fontSize: 17,
                        fontWeight: 800,
                        color:
                            "primary.main",
                    }}
                >
                    ₹ 0.00
                </Typography>
            </Box>
        </Box>
    );
};

export default MotorQuotePreview;
