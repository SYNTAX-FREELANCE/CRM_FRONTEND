
import React from "react";
import {
    Avatar,
    Box,
    Chip,
    Divider,
    Paper,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";

import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import CustomerSearchToggle from "../../LeadTransfer/TransferComponents/CustomerSearchToggle";

const VehicleDetailsCard = ({
    vehicle = {},
    customer = {},
    setSelectedCustomer,
    selectedCustomer,
    setDetailLoading,
    registrationNumber = ""
}) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const colors = {
        text: theme.palette.text.primary,
        secondary: theme.palette.text.secondary,
        border: theme.palette.divider,
        primary: theme.palette.primary.main,
        primarySoft: isDark
            ? "rgba(255, 255, 255, 0.06)"
            : theme.palette.action.hover,
        surface: theme.palette.background.paper,
        surfaceAlt: isDark
            ? theme.palette.background.default
            : theme.palette.grey[50],
    };

    /*
     * Supports both possible structures:
     * selectedCustomer = { customer_id, customer_name, ... }
     * selectedCustomer = { customer: {...}, vehicles: [...] }
     */
    const selectedCustomerData =
        selectedCustomer?.customer ||
        selectedCustomer ||
        {};

    const customerData =
        selectedCustomerData?.customer_id
            ? selectedCustomerData
            : customer || {};

    const selectedVehicle =
        selectedCustomer?.vehicles?.find(
            (item) =>
                item.vehicle_id ===
                selectedCustomer?.vehicle_id
        ) ||
        selectedCustomer?.vehicles?.[0] ||
        selectedCustomerData?.vehicle ||
        vehicle ||
        {};

    const hasSelectedCustomer = Boolean(
        selectedCustomer?.customer_id ||
        selectedCustomer?.customer?.customer_id
    );

    const hasVehicle = Boolean(
        selectedVehicle?.vehicle_id ||
        selectedVehicle?.registration_number
    );

    const formatDate = (value) => {
        if (!value) return null;

        let date;

        if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
            const [year, month, day] = String(value)
                .split("-")
                .map(Number);

            date = new Date(year, month - 1, day);
        } else {
            date = new Date(value);
        }

        if (Number.isNaN(date.getTime())) return null;

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const fullAddress = [
        customerData.address,
        customerData.city,
        customerData.district,
        customerData.state,
        customerData.pincode,
    ]
        .filter(Boolean)
        .join(", ");

    const customerName = customerData.customer_name || "Customer";

    const initials = customerName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    const vehicleTitle =
        [
            selectedVehicle.vehicle_maker,
            selectedVehicle.model,
        ]
            .filter(Boolean)
            .join(" ") || "Vehicle details";

    const vehicleMeta = [
        {
            label: "RTO",
            value: selectedVehicle.rto,
            icon: <LocationCityOutlinedIcon />,
        },
        {
            label: "Registration date",
            value: formatDate(selectedVehicle.registration_date),
            icon: <EventOutlinedIcon />,
        },
        {
            label: "Policy expiry",
            value: formatDate(
                selectedVehicle.known_policy_expiry_date
            ),
            icon: <EventOutlinedIcon />,
        },
        {
            label: "Engine number",
            value: selectedVehicle.engine_number,
            icon: <BadgeOutlinedIcon />,
        },
        {
            label: "Chassis number",
            value: selectedVehicle.chassis_number,
            icon: <BadgeOutlinedIcon />,
        },
    ].filter(
        (item) =>
            item.value !== null &&
            item.value !== undefined &&
            item.value !== ""
    );

    const SectionHeading = ({ icon, title, action }) => (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1.75 }}
        >
            <Box
                sx={{
                    width: 30,
                    height: 30,
                    borderRadius: 1.25,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: colors.primarySoft,
                    color: colors.primary,
                    flexShrink: 0,
                    "& svg": { fontSize: 17 },
                }}
            >
                {icon}
            </Box>

            <Typography
                sx={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: colors.text,
                    letterSpacing: 0.2,
                    fontFamily: "Bahnschrift",
                }}
            >
                {title}
            </Typography>

            {action}
        </Stack>
    );

    const InfoTile = ({ label, value, icon }) => (
        <Box
            sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: colors.surfaceAlt,
                border: `1px solid ${colors.border}`,
                minWidth: 0,
            }}
        >
            <Stack direction="row" alignItems="center" spacing={0.75}>
                <Box
                    sx={{
                        display: "grid",
                        placeItems: "center",
                        color: colors.primary,
                        "& svg": { fontSize: 15 },
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    sx={{
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: colors.secondary,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        fontFamily: "Bahnschrift",
                    }}
                >
                    {label}
                </Typography>
            </Stack>

            <Tooltip title={String(value)}>
                <Typography
                    sx={{
                        mt: 0.75,
                        fontSize: 13,
                        fontWeight: 600,
                        color: colors.text,
                        lineHeight: 1.45,
                        overflowWrap: "anywhere",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontFamily: "Bahnschrift",
                    }}
                >
                    {value}
                </Typography>
            </Tooltip>
        </Box>
    );

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
                borderRadius: 3,
                bgcolor: colors.surface,
            }}
        >
            {/* Customer search always remains visible */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: `1px solid ${colors.border}`,
                }}
            >
                <CustomerSearchToggle
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                    setDetailLoading={setDetailLoading}
                    rgNo={registrationNumber}
                />
            </Box>

            {/* Empty state: no customer selected */}
            {!hasSelectedCustomer ? (
                <Box
                    sx={{
                        py: 5,
                        px: 2.5,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: 54,
                            height: 54,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: colors.primarySoft,
                            color: colors.primary,
                        }}
                    >
                        <PersonOutlineOutlinedIcon
                            sx={{ fontSize: 27 }}
                        />
                    </Box>

                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: colors.text,
                        }}
                    >
                        No customer selected
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 12,
                            color: colors.secondary,
                            maxWidth: 300,
                            lineHeight: 1.6,
                            fontFamily: "Bahnschrift",
                        }}
                    >
                        Search and select a customer to view their
                        information and associated vehicle details.
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* Vehicle header */}
                    {hasVehicle && (
                        <Box
                            sx={{
                                px: { xs: 2, sm: 2.5 },
                                pt: 2.5,
                                pb: 2,
                                bgcolor: colors.primarySoft,
                                borderBottom: `1px solid ${colors.border}`,
                            }}
                        >
                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                alignItems={{
                                    xs: "flex-start",
                                    sm: "center",
                                }}
                                justifyContent="space-between"
                                spacing={1.5}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1.25}
                                    sx={{ minWidth: 0 }}
                                >
                                    <Box
                                        sx={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: 1.5,
                                            display: "grid",
                                            placeItems: "center",
                                            bgcolor: colors.primary,
                                            color: "#fff",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <DirectionsCarOutlinedIcon
                                            sx={{ fontSize: 22 }}
                                        />
                                    </Box>

                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                fontSize: 15,
                                                fontWeight: 750,
                                                color: colors.text,
                                                lineHeight: 1.4,
                                                overflowWrap: "anywhere",
                                                fontFamily: "Bahnschrift",
                                            }}
                                        >
                                            {vehicleTitle}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 11.5,
                                                color: colors.secondary,
                                                mt: 0.25,
                                                fontFamily: "Bahnschrift",
                                            }}
                                        >
                                            Vehicle overview
                                        </Typography>
                                    </Box>
                                </Stack>

                                {selectedVehicle.vehicle_category && (
                                    <Chip
                                        size="small"
                                        label={
                                            selectedVehicle.vehicle_category
                                        }
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 11,
                                            bgcolor: colors.surface,
                                            color: colors.primary,
                                            border: `1px solid ${colors.border}`,
                                        }}
                                    />
                                )}
                            </Stack>

                            <Box
                                sx={{
                                    mt: 2,
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    bgcolor: colors.surface,
                                    border: `1px solid ${colors.border}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    minWidth: 0,
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: colors.secondary,
                                            textTransform: "uppercase",
                                            letterSpacing: 0.6,
                                            mb: 0.4,
                                            fontFamily: "Bahnschrift",
                                        }}
                                    >
                                        Registration number
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: 18,
                                                sm: 21,
                                            },
                                            fontWeight: 800,
                                            letterSpacing: 1,
                                            color: colors.text,
                                            lineHeight: 1.35,
                                            overflowWrap: "anywhere",
                                            fontFamily: "Bahnschrift",
                                        }}
                                    >
                                        {selectedVehicle.registration_number ||
                                            "Not available"}
                                    </Typography>
                                </Box>

                                <BadgeOutlinedIcon
                                    sx={{
                                        display: {
                                            xs: "none",
                                            sm: "block",
                                        },
                                        fontSize: 30,
                                        color: colors.primary,
                                        flexShrink: 0,
                                    }}
                                />
                            </Box>
                        </Box>
                    )}

                    {/* Customer information */}
                    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                        <SectionHeading
                            icon={<PersonOutlineOutlinedIcon />}
                            title="Customer information"
                        />

                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                            sx={{ mb: 2 }}
                        >
                            <Avatar
                                sx={{
                                    width: 44,
                                    height: 44,
                                    bgcolor: colors.primarySoft,
                                    color: colors.primary,
                                    fontSize: 14,
                                    fontWeight: 800,
                                    border: `1px solid ${colors.border}`,
                                    flexShrink: 0,
                                }}
                            >
                                {initials || (
                                    <PersonOutlineOutlinedIcon />
                                )}
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: colors.text,
                                        overflowWrap: "anywhere",
                                        fontFamily: "Bahnschrift",
                                    }}
                                >
                                    {customerName}
                                </Typography>
                            </Box>
                        </Stack>

                        {(customerData.mobile_number_1 ||
                            customerData.mobile_number_2) && (
                                <Stack
                                    direction={{
                                        xs: "column",
                                        sm: "row",
                                    }}
                                    spacing={1}
                                    sx={{
                                        mb: fullAddress ? 1.5 : 0,
                                    }}
                                >
                                    {[
                                        customerData.mobile_number_1,
                                        customerData.mobile_number_2,
                                    ]
                                        .filter(Boolean)
                                        .map((number, index) => (
                                            <Box
                                                key={`${number}-${index}`}
                                                component="a"
                                                href={`tel:${number}`}
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    px: 1.5,
                                                    py: 1.25,
                                                    borderRadius: 1.5,
                                                    bgcolor: colors.surfaceAlt,
                                                    border: `1px solid ${colors.border}`,
                                                    textDecoration: "none",
                                                    transition: "all 0.15s ease",
                                                    "&:hover": {
                                                        borderColor: colors.primary,
                                                        bgcolor: colors.primarySoft,
                                                    },
                                                }}
                                            >
                                                <CallOutlinedIcon
                                                    sx={{
                                                        fontSize: 16,
                                                        color: colors.primary,
                                                        flexShrink: 0,
                                                    }}
                                                />

                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: 10,
                                                            color: colors.secondary,
                                                            fontFamily: "Bahnschrift",
                                                        }}
                                                    >
                                                        {index === 0
                                                            ? "Mobile number"
                                                            : "Alternate mobile"}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: 13,
                                                            fontWeight: 650,
                                                            color: colors.text,
                                                            overflowWrap: "anywhere",
                                                            fontFamily: "Bahnschrift",
                                                        }}
                                                    >
                                                        {number}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                </Stack>
                            )}

                        {fullAddress && (
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1.5,
                                    bgcolor: colors.surfaceAlt,
                                    border: `1px solid ${colors.border}`,
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1,
                                }}
                            >
                                <LocationOnOutlinedIcon
                                    sx={{
                                        fontSize: 17,
                                        color: colors.primary,
                                        mt: 0.2,
                                        flexShrink: 0,
                                    }}
                                />

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            fontWeight: 600,
                                            color: colors.secondary,
                                            textTransform: "uppercase",
                                            letterSpacing: 0.4,
                                            fontFamily: "Bahnschrift",
                                        }}
                                    >
                                        Address
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontSize: 12.5,
                                            fontWeight: 500,
                                            color: colors.text,
                                            lineHeight: 1.55,
                                            overflowWrap: "anywhere",
                                            fontFamily: "Bahnschrift",
                                        }}
                                    >
                                        {fullAddress}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {/* Vehicle information */}
                    {hasVehicle && (
                        <>
                            <Divider
                                sx={{ borderColor: colors.border }}
                            />

                            <Box
                                sx={{
                                    p: { xs: 2, sm: 2.5 },
                                }}
                            >
                                <SectionHeading
                                    icon={<BadgeOutlinedIcon />}
                                    title="Vehicle information"
                                    action={
                                        <Box sx={{ flex: 1 }} />
                                    }
                                />

                                {vehicleMeta.length > 0 ? (
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "minmax(0, 1fr)",
                                                sm: "repeat(2, minmax(0, 1fr))",
                                                md: "repeat(3, minmax(0, 1fr))",
                                            },
                                            gap: 1.25,
                                        }}
                                    >
                                        {vehicleMeta.map((item) => (
                                            <InfoTile
                                                key={item.label}
                                                {...item}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: colors.secondary,
                                        }}
                                    >
                                        No additional vehicle information
                                        available.
                                    </Typography>
                                )}
                            </Box>
                        </>
                    )}

                    {/* Selected customer exists, but no vehicle */}
                    {!hasVehicle && (
                        <Box
                            sx={{
                                px: 2.5,
                                py: 3,
                                borderTop: `1px solid ${colors.border}`,
                                textAlign: "center",
                            }}
                        >
                            <DirectionsCarOutlinedIcon
                                sx={{
                                    fontSize: 25,
                                    color: colors.secondary,
                                    mb: 0.5,
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color: colors.secondary,
                                }}
                            >
                                No vehicle information available for this
                                customer.
                            </Typography>
                        </Box>
                    )}
                </>
            )}
        </Paper>
    );
};

export default VehicleDetailsCard;
