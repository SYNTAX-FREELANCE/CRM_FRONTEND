
import React from "react";
import {
    Box,
    Divider,
    Typography,
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

// ============================================================
// PREVIEW SECTION
// ============================================================

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
                        textTransform: "uppercase",
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

// ============================================================
// DETAIL ROW
// ============================================================

const DetailRow = ({
    label,
    value,
}) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 1,
                py: 0.35,
            }}
        >
            <Typography
                sx={{
                    fontSize: 9.5,
                    color: "text.secondary",
                    flexShrink: 0,
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: 10,
                    fontWeight: 600,
                    textAlign: "right",
                    wordBreak: "break-word",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

// ============================================================
// DETAIL BOX
// ============================================================

const DetailBox = ({
    children,
}) => {
    return (
        <Box
            sx={{
                p: 1,
                borderRadius: 1.2,
                backgroundColor: "action.hover",
            }}
        >
            {children}
        </Box>
    );
};

// ============================================================
// VALUE HELPERS
// ============================================================

const getValue = (
    object,
    keys,
    fallback = null
) => {
    if (!object) {
        return fallback;
    }

    for (const key of keys) {
        if (
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {
            return object[key];
        }
    }

    return fallback;
};

const formatDate = (date) => {
    if (!date) {
        return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatBoolean = (value) => {
    if (
        value === true ||
        value === 1 ||
        value === "1"
    ) {
        return "Yes";
    }

    if (
        value === false ||
        value === 0 ||
        value === "0"
    ) {
        return "No";
    }

    return value;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const MotorQuotePreview = ({
    data = {},
    completed = {},
}) => {
    const customer = data?.customer;
    const vehicle = data?.vehicle;
    const insurance = data?.insurance;
    const policy = data?.policy;
    const vehicleDetails = data?.vehicleDetails;
    const coverage = data?.coverage;

    const hasAnyData =
        Boolean(customer) ||
        Boolean(vehicle) ||
        Boolean(insurance) ||
        Boolean(policy) ||
        Boolean(vehicleDetails) ||
        Boolean(coverage);

    // ============================================================
    // CUSTOMER DETAILS
    // ============================================================

    const customerName = getValue(
        customer,
        [
            "customer_name",
            "name",
            "customerName",
        ]
    );

    const customerMobile = getValue(
        customer,
        [
            "mobile_number_1",
            "mobile_number",
            "mobile",
            "phone",
        ]
    );

    const customerMobile2 = getValue(
        customer,
        [
            "mobile_number_2",
            "alternate_mobile",
            "alternate_mobile_number",
        ]
    );

    const customerEmail = getValue(
        customer,
        [
            "email",
            "email_address",
        ]
    );

    const customerAddress = getValue(
        customer,
        [
            "address",
            "customer_address",
        ]
    );

    // ============================================================
    // VEHICLE DETAILS
    // ============================================================

    const registrationNumber = getValue(
        vehicle,
        [
            "registration_number",
            "registration_no",
            "reg_number",
        ]
    );

    const vehicleMaker = getValue(
        vehicle,
        [
            "vehicle_maker",
            "maker",
            "make",
            "vehicle_make",
        ]
    );

    const vehicleModel = getValue(
        vehicle,
        [
            "model",
            "vehicle_model",
            "model_name",
        ]
    );

    const vehicleCategory = getValue(
        vehicle,
        [
            "vehicle_category",
            "vehicle_category_name",
            "category",
        ]
    );

    const vehicleClass = getValue(
        vehicle,
        [
            "vehicle_class",
            "vehicle_class_name",
            "class",
        ]
    );

    const fuelType = getValue(
        vehicle,
        [
            "fuel_type",
            "fuel",
        ]
    );

    const engineNumber = getValue(
        vehicle,
        [
            "engine_number",
            "engine_no",
        ]
    );

    const chassisNumber = getValue(
        vehicle,
        [
            "chassis_number",
            "chassis_no",
        ]
    );

    const seatCapacity = getValue(
        vehicle,
        [
            "seat_capacity",
            "seating_capacity",
            "seats",
        ]
    );

    const registrationDate = getValue(
        vehicle,
        [
            "registration_date",
            "registered_date",
        ]
    );

    const policyExpiry = getValue(
        vehicle,
        [
            "known_policy_expiry_date",
            "policy_expiry_date",
            "previous_policy_expiry",
        ]
    );

    // ============================================================
    // INSURANCE DETAILS
    // ============================================================

    const insuranceName = getValue(
        insurance,
        [
            "label",
            "company_name",
            "insurance_company_name",
            "name",
        ]
    );

    const insuranceId = getValue(
        insurance,
        [
            "id",
            "insurance_company_id",
        ]
    );

    // ============================================================
    // POLICY DETAILS
    // ============================================================

    const productName = getValue(
        policy,
        [
            "product_name",
            "product_label",
        ]
    );

    const productId = getValue(
        policy,
        [
            "product_id",
        ]
    );

    const policyTypeName = getValue(
        policy,
        [
            "policy_type_name",
            "policy_type_label",
        ]
    );

    const policyTypeId = getValue(
        policy,
        [
            "policy_type_id",
        ]
    );

    const businessTypeName = getValue(
        policy,
        [
            "business_type_name",
            "business_type_label",
        ]
    );

    const businessTypeId = getValue(
        policy,
        [
            "business_type_id",
        ]
    );

    const policyTermName = getValue(
        policy,
        [
            "policy_term_name",
            "term_name",
            "policy_term_label",
        ]
    );

    const policyTermId = getValue(
        policy,
        [
            "policy_term_id",
        ]
    );

    const policyStartDate = getValue(
        policy,
        [
            "policy_start_date",
            "start_date",
        ]
    );

    const previousPolicyExpiry = getValue(
        policy,
        [
            "previous_policy_expiry",
            "previous_policy_expiry_date",
        ]
    );

    // ============================================================
    // VEHICLE DETAILS STEP
    // ============================================================

    const vehicleDetailEntries =
        vehicleDetails
            ? Object.entries(vehicleDetails).filter(
                  ([key, value]) =>
                      value !== null &&
                      value !== undefined &&
                      value !== "" &&
                      ![
                          "vehicle_id",
                          "customer_id",
                      ].includes(key)
              )
            : [];

    // ============================================================
    // COVERAGE DETAILS STEP
    // ============================================================

    const coverageEntries =
        coverage
            ? Object.entries(coverage).filter(
                  ([key, value]) =>
                      value !== null &&
                      value !== undefined &&
                      value !== ""
              )
            : [];

    // ============================================================
    // RENDER
    // ============================================================

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
            {/* ================================================== */}
            {/* HEADER */}
            {/* ================================================== */}

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

            {/* ================================================== */}
            {/* CONTENT */}
            {/* ================================================== */}

            <Box
                sx={{
                    p: 1.5,
                    maxHeight: {
                        xs: "none",
                        lg: "calc(100vh - 100px)",
                    },
                    overflowY: {
                        xs: "visible",
                        lg: "auto",
                    },
                }}
            >
                {/* ================================================== */}
                {/* CUSTOMER */}
                {/* ================================================== */}

                {customer && (
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
                        <DetailBox>
                            <DetailRow
                                label="Name"
                                value={
                                    customerName
                                }
                            />

                            <DetailRow
                                label="Customer ID"
                                value={getValue(
                                    customer,
                                    [
                                        "customer_id",
                                        "id",
                                    ]
                                )}
                            />

                            <DetailRow
                                label="Mobile"
                                value={
                                    customerMobile
                                }
                            />

                            <DetailRow
                                label="Alt. Mobile"
                                value={
                                    customerMobile2
                                }
                            />

                            <DetailRow
                                label="Email"
                                value={
                                    customerEmail
                                }
                            />

                            <DetailRow
                                label="Address"
                                value={
                                    customerAddress
                                }
                            />
                        </DetailBox>
                    </PreviewSection>
                )}

                {/* ================================================== */}
                {/* VEHICLE */}
                {/* ================================================== */}

                {vehicle && (
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
                        <DetailBox>
                            <DetailRow
                                label="Registration"
                                value={
                                    registrationNumber
                                }
                            />

                            <DetailRow
                                label="Maker"
                                value={
                                    vehicleMaker
                                }
                            />

                            <DetailRow
                                label="Model"
                                value={
                                    vehicleModel
                                }
                            />

                            <DetailRow
                                label="Category"
                                value={
                                    vehicleCategory
                                }
                            />

                            <DetailRow
                                label="Class"
                                value={
                                    vehicleClass
                                }
                            />

                            <DetailRow
                                label="Fuel"
                                value={fuelType}
                            />

                            <DetailRow
                                label="Engine No."
                                value={
                                    engineNumber
                                }
                            />

                            <DetailRow
                                label="Chassis No."
                                value={
                                    chassisNumber
                                }
                            />

                            <DetailRow
                                label="Seats"
                                value={
                                    seatCapacity
                                }
                            />

                            <DetailRow
                                label="Registration Date"
                                value={formatDate(
                                    registrationDate
                                )}
                            />

                            <DetailRow
                                label="Policy Expiry"
                                value={formatDate(
                                    policyExpiry
                                )}
                            />
                        </DetailBox>
                    </PreviewSection>
                )}

                {/* ================================================== */}
                {/* INSURANCE */}
                {/* ================================================== */}

                {insurance && (
                    <PreviewSection
                        title="Insurance Company"
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
                        <DetailBox>
                            <Box
                                sx={{
                                    display: "flex",
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
                                        fontWeight: 700,
                                    }}
                                >
                                    {insuranceName ||
                                        `Insurance Company ${insuranceId || ""}`}
                                </Typography>
                            </Box>

                            {insuranceId && (
                                <Typography
                                    sx={{
                                        fontSize: 9,
                                        color:
                                            "text.secondary",
                                        mt: 0.4,
                                    }}
                                >
                                    ID: {insuranceId}
                                </Typography>
                            )}
                        </DetailBox>
                    </PreviewSection>
                )}

                {/* ================================================== */}
                {/* POLICY */}
                {/* ================================================== */}

                {policy && (
                    <PreviewSection
                        title="Policy Details"
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
                        <DetailBox>
                            <DetailRow
                                label="Product"
                                value={
                                    productName ||
                                    productId
                                }
                            />

                            <DetailRow
                                label="Policy Type"
                                value={
                                    policyTypeName ||
                                    policyTypeId
                                }
                            />

                            <DetailRow
                                label="Business Type"
                                value={
                                    businessTypeName ||
                                    businessTypeId
                                }
                            />

                            <DetailRow
                                label="Policy Term"
                                value={
                                    policyTermName ||
                                    policyTermId
                                }
                            />

                            <DetailRow
                                label="Start Date"
                                value={formatDate(
                                    policyStartDate
                                )}
                            />

                            <DetailRow
                                label="Previous Expiry"
                                value={formatDate(
                                    previousPolicyExpiry
                                )}
                            />
                        </DetailBox>
                    </PreviewSection>
                )}

                {/* ================================================== */}
                {/* VEHICLE DETAILS */}
                {/* ================================================== */}

                {vehicleDetails && (
                    <PreviewSection
                        title="Vehicle Details"
                        icon={
                            <SettingsRoundedIcon
                                sx={{
                                    fontSize: 15,
                                    color:
                                        "primary.main",
                                }}
                            />
                        }
                    >
                        <DetailBox>
                            {vehicleDetailEntries.length >
                            0 ? (
                                vehicleDetailEntries.map(
                                    ([key, itemValue]) => (
                                        <DetailRow
                                            key={key}
                                            label={key
                                                .replace(
                                                    /_/g,
                                                    " "
                                                )
                                                .replace(
                                                    /\b\w/g,
                                                    (letter) =>
                                                        letter.toUpperCase()
                                                )}
                                            value={
                                                formatBoolean(
                                                    itemValue
                                                )
                                            }
                                        />
                                    )
                                )
                            ) : (
                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    Vehicle details
                                    confirmed
                                </Typography>
                            )}
                        </DetailBox>
                    </PreviewSection>
                )}

                {/* ================================================== */}
                {/* COVERAGE */}
                {/* ================================================== */}

                {coverage && (
                    <PreviewSection
                        title="Coverage"
                        icon={
                            <ShieldRoundedIcon
                                sx={{
                                    fontSize: 15,
                                    color:
                                        "primary.main",
                                }}
                            />
                        }
                    >
                        <DetailBox>
                            {coverageEntries.length >
                            0 ? (
                                coverageEntries.map(
                                    ([key, itemValue]) => (
                                        <DetailRow
                                            key={key}
                                            label={key
                                                .replace(
                                                    /_/g,
                                                    " "
                                                )
                                                .replace(
                                                    /\b\w/g,
                                                    (letter) =>
                                                        letter.toUpperCase()
                                                )}
                                            value={
                                                formatBoolean(
                                                    itemValue
                                                )
                                            }
                                        />
                                    )
                                )
                            ) : (
                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        color:
                                            "text.secondary",
                                    }}
                                >
                                    Coverage confirmed
                                </Typography>
                            )}
                        </DetailBox>
                    </PreviewSection>
                )}

                {/* ================================================== */}
                {/* EMPTY STATE */}
                {/* ================================================== */}

                {!hasAnyData && (
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

            {/* ================================================== */}
            {/* PREMIUM */}
            {/* ================================================== */}

            <Divider />

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
