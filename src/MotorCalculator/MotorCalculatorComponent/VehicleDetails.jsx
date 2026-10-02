
import React from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";

const VehicleDetails = ({
    value,
    vehicle,
    onChange,
    onConfirm,
}) => {
    // ============================================================
    // CHANGE HANDLER
    // ============================================================

    const handleChange = (field, fieldValue) => {
        onChange({
            ...(value || {}),
            [field]: fieldValue,
        });
    };

    // ============================================================
    // VEHICLE VALUES
    // Use vehicle master data as default values.
    // User can still change calculation-specific fields.
    // ============================================================

    const vehicleCategory =
        value?.vehicle_category ||
        vehicle?.vehicle_category ||
        "";

    const vehicleClass =
        value?.vehicle_class ||
        vehicle?.vehicle_class ||
        "";

    const fuelType =
        value?.fuel_type ||
        vehicle?.fuel_type ||
        "";

    const vehicleUsage =
        value?.vehicle_usage ||
        vehicle?.vehicle_usage ||
        "";

    const engineCc =
        value?.engine_cc ||
        vehicle?.engine_cc ||
        "";

    const gvw =
        value?.gvw ||
        vehicle?.gvw ||
        "";

    const seatCapacity =
        value?.seat_capacity ||
        vehicle?.seat_capacity ||
        "";

    const registrationDate =
        value?.registration_date ||
        vehicle?.registration_date ||
        "";

    const manufacturingYear =
        value?.manufacturing_year ||
        vehicle?.manufacturing_year ||
        "";

    const rto =
        value?.rto ||
        vehicle?.rto ||
        "";

    // ============================================================
    // REQUIRED
    // ============================================================

    const canContinue =
        Boolean(vehicleCategory) &&
        Boolean(vehicleClass) &&
        Boolean(fuelType) &&
        Boolean(vehicleUsage);

    // ============================================================
    // INPUT STYLE
    // ============================================================

    const inputStyle = {
        width: "100%",
        height: 36,
        boxSizing: "border-box",
        padding: "0 8px",
        borderRadius: 6,
        border: "1px solid #cbd5e1",
        background: "transparent",
        fontSize: 12,
    };

    // ============================================================
    // FIELD
    // ============================================================

    const Field = ({
        label,
        value,
        onChange,
        type = "text",
        placeholder = "",
        disabled = false,
    }) => {
        return (
            <Box>
                <Typography
                    sx={{
                        fontSize: 10,
                        fontWeight: 600,
                        mb: 0.4,
                    }}
                >
                    {label}
                </Typography>

                <input
                    type={type}
                    value={value ?? ""}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    style={{
                        ...inputStyle,
                        backgroundColor: disabled
                            ? "action.disabledBackground"
                            : "transparent",
                    }}
                />
            </Box>
        );
    };

    // ============================================================
    // READONLY FIELD
    // ============================================================

    const ReadonlyField = ({
        label,
        value,
    }) => {
        return (
            <Box>
                <Typography
                    sx={{
                        fontSize: 10,
                        fontWeight: 600,
                        mb: 0.4,
                    }}
                >
                    {label}
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        height: 36,
                        boxSizing: "border-box",
                        px: 1,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        backgroundColor:
                            "action.hover",
                        fontSize: 12,
                        color: value
                            ? "text.primary"
                            : "text.disabled",
                    }}
                >
                    {value || "-"}
                </Box>
            </Box>
        );
    };

    return (
        <Box>
            {/* ================================================== */}
            {/* HEADER */}
            {/* ================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    mb: 1,
                }}
            >
                <DirectionsCarRoundedIcon
                    sx={{
                        fontSize: 18,
                        color: "primary.main",
                    }}
                />

                <Box>
                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 700,
                        }}
                    >
                        Vehicle Details
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 10,
                            color: "text.secondary",
                        }}
                    >
                        Vehicle rating and valuation
                        details
                    </Typography>
                </Box>
            </Box>

            {/* ================================================== */}
            {/* VEHICLE INFORMATION */}
            {/* ================================================== */}

            <Typography
                sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    mb: 0.8,
                }}
            >
                Vehicle Information
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: 1,
                }}
            >
                <ReadonlyField
                    label="Vehicle Category"
                    value={vehicleCategory}
                />

                <ReadonlyField
                    label="Vehicle Class"
                    value={vehicleClass}
                />

                <ReadonlyField
                    label="Fuel Type"
                    value={fuelType}
                />

                <Field
                    label="Vehicle Usage"
                    value={vehicleUsage}
                    onChange={(newValue) =>
                        handleChange(
                            "vehicle_usage",
                            newValue
                        )
                    }
                    placeholder="Enter usage"
                />

                <Field
                    label="Engine CC"
                    type="number"
                    value={engineCc}
                    onChange={(newValue) =>
                        handleChange(
                            "engine_cc",
                            newValue
                                ? Number(newValue)
                                : null
                        )
                    }
                    placeholder="Engine CC"
                />

                <Field
                    label="GVW"
                    type="number"
                    value={gvw}
                    onChange={(newValue) =>
                        handleChange(
                            "gvw",
                            newValue
                                ? Number(newValue)
                                : null
                        )
                    }
                    placeholder="GVW"
                />

                <Field
                    label="Seating Capacity"
                    type="number"
                    value={seatCapacity}
                    onChange={(newValue) =>
                        handleChange(
                            "seat_capacity",
                            newValue
                                ? Number(newValue)
                                : null
                        )
                    }
                    placeholder="Seats"
                />

                <ReadonlyField
                    label="RTO"
                    value={rto}
                />

                <ReadonlyField
                    label="Registration Date"
                    value={registrationDate}
                />

                <Field
                    label="Manufacturing Year"
                    type="number"
                    value={manufacturingYear}
                    onChange={(newValue) =>
                        handleChange(
                            "manufacturing_year",
                            newValue
                                ? Number(newValue)
                                : null
                        )
                    }
                    placeholder="YYYY"
                />
            </Box>

            {/* ================================================== */}
            {/* VALUATION */}
            {/* ================================================== */}

            <Box sx={{ mt: 1.5 }}>
                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        mb: 0.8,
                    }}
                >
                    Vehicle Valuation
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(4, 1fr)",
                        },
                        gap: 1,
                    }}
                >
                    <Field
                        label="IDV"
                        type="number"
                        value={
                            value?.idv || ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "idv",
                                newValue
                                    ? Number(newValue)
                                    : null
                            )
                        }
                        placeholder="Enter IDV"
                    />

                    <Field
                        label="Previous Policy IDV"
                        type="number"
                        value={
                            value?.previous_idv ||
                            ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "previous_idv",
                                newValue
                                    ? Number(newValue)
                                    : null
                            )
                        }
                        placeholder="Previous IDV"
                    />

                    <Field
                        label="Accessories Value"
                        type="number"
                        value={
                            value?.accessories_value ||
                            ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "accessories_value",
                                newValue
                                    ? Number(newValue)
                                    : null
                            )
                        }
                        placeholder="0.00"
                    />

                    <Field
                        label="CNG / LPG Kit Value"
                        type="number"
                        value={
                            value?.fuel_kit_value ||
                            ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "fuel_kit_value",
                                newValue
                                    ? Number(newValue)
                                    : null
                            )
                        }
                        placeholder="0.00"
                    />
                </Box>
            </Box>

            {/* ================================================== */}
            {/* PREVIOUS POLICY */}
            {/* ================================================== */}

            <Box sx={{ mt: 1.5 }}>
                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        mb: 0.8,
                    }}
                >
                    Previous Policy
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(4, 1fr)",
                        },
                        gap: 1,
                    }}
                >
                    <Field
                        label="Previous Insurer"
                        value={
                            value?.previous_insurer ||
                            ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "previous_insurer",
                                newValue
                            )
                        }
                        placeholder="Previous insurer"
                    />

                    <Field
                        label="Previous Policy Number"
                        value={
                            value?.previous_policy_number ||
                            ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "previous_policy_number",
                                newValue
                            )
                        }
                        placeholder="Policy number"
                    />

                    <Field
                        label="Previous Policy Expiry"
                        type="date"
                        value={
                            value?.previous_policy_expiry ||
                            ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "previous_policy_expiry",
                                newValue || null
                            )
                        }
                    />

                    <Field
                        label="NCB %"
                        type="number"
                        value={
                            value?.ncb_percentage ??
                            ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "ncb_percentage",
                                newValue
                                    ? Number(newValue)
                                    : null
                            )
                        }
                        placeholder="0"
                    />
                </Box>
            </Box>

            {/* ================================================== */}
            {/* CLAIM DETAILS */}
            {/* ================================================== */}

            <Box sx={{ mt: 1.5 }}>
                <Typography
                    sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        mb: 0.8,
                    }}
                >
                    Previous Claim Details
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(4, 1fr)",
                        },
                        gap: 1,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontSize: 10,
                                fontWeight: 600,
                                mb: 0.4,
                            }}
                        >
                            Previous Claim
                        </Typography>

                        <select
                            value={
                                value?.has_previous_claim ??
                                ""
                            }
                            onChange={(e) =>
                                handleChange(
                                    "has_previous_claim",
                                    e.target.value === ""
                                        ? null
                                        : e.target.value ===
                                          "true"
                                )
                            }
                            style={inputStyle}
                        >
                            <option value="">
                                Select
                            </option>

                            <option value="false">
                                No
                            </option>

                            <option value="true">
                                Yes
                            </option>
                        </select>
                    </Box>

                    <Field
                        label="Number of Claims"
                        type="number"
                        value={
                            value?.claim_count ??
                            ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "claim_count",
                                newValue
                                    ? Number(newValue)
                                    : null
                            )
                        }
                        placeholder="0"
                    />

                    <Field
                        label="Voluntary Deductible"
                        type="number"
                        value={
                            value?.voluntary_deductible ||
                            ""
                        }
                        onChange={(newValue) =>
                            handleChange(
                                "voluntary_deductible",
                                newValue
                                    ? Number(newValue)
                                    : null
                            )
                        }
                        placeholder="0.00"
                    />

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 10,
                                fontWeight: 600,
                                mb: 0.4,
                            }}
                        >
                            Anti-theft Device
                        </Typography>

                        <select
                            value={
                                value?.anti_theft_device ??
                                ""
                            }
                            onChange={(e) =>
                                handleChange(
                                    "anti_theft_device",
                                    e.target.value === ""
                                        ? null
                                        : e.target.value ===
                                          "true"
                                )
                            }
                            style={inputStyle}
                        >
                            <option value="">
                                Select
                            </option>

                            <option value="false">
                                No
                            </option>

                            <option value="true">
                                Yes
                            </option>
                        </select>
                    </Box>
                </Box>
            </Box>

            {/* ================================================== */}
            {/* CONTINUE */}
            {/* ================================================== */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 1.5,
                }}
            >
                <Button
                    size="small"
                    variant="contained"
                    disabled={!canContinue}
                    onClick={onConfirm}
                    endIcon={
                        <ArrowForwardRoundedIcon
                            sx={{
                                fontSize: 16,
                            }}
                        />
                    }
                    sx={{
                        minHeight: 32,
                        px: 1.5,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "none",
                    }}
                >
                    Confirm & Continue
                </Button>
            </Box>
        </Box>
    );
};

export default VehicleDetails;
