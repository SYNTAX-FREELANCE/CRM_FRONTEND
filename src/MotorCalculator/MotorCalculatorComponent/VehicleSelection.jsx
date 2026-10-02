import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import CustomerSearchToggle from "../../LeadTransfer/TransferComponents/CustomerSearchToggle";

const VehicleSelection = ({
    value,
    onChange,
    onConfirm,
}) => {
    const [selectedCustomer, setSelectedCustomer] =
        useState(value?.customer ? value : null);

    const [detailLoading, setDetailLoading] =
        useState(false);

    useEffect(() => {
        if (value) {
            setSelectedCustomer(value);
        }
    }, [value]);

    const handleCustomerChange = (data) => {
        setSelectedCustomer(data);

        onChange(data);
    };

    console.log({
        selectedCustomer
    });
    

    const selectedVehicle =
        selectedCustomer?.vehicle || null;

    const canContinue =
        Boolean(selectedCustomer?.customer) &&
        Boolean(selectedVehicle);

    return (
        <Box>
            {/* HEADER */}

            <Typography
                sx={{
                    fontSize: 14,
                    fontWeight: 700,
                }}
            >
                Vehicle Selection
            </Typography>

            <Typography
                sx={{
                    fontSize: 11,
                    color: "text.secondary",
                    mt: 0.3,
                }}
            >
                Select a customer and vehicle to start
                the calculation.
            </Typography>

            {/* CUSTOMER SEARCH */}

            <Box sx={{ my: 1 }}>
                <CustomerSearchToggle
                    selectedCustomer={
                        selectedCustomer
                    }
                    setSelectedCustomer={
                        handleCustomerChange
                    }
                    setDetailLoading={
                        setDetailLoading
                    }
                />
            </Box>

            {/* SELECTED VEHICLE */}

            {selectedVehicle && (
                <Box
                    sx={{
                        mt: 1,

                        p: 1.2,

                        border: "1px solid",
                        borderColor: "divider",

                        borderRadius: 1.5,

                        backgroundColor:
                            "background.default",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 10,
                            color: "text.secondary",
                        }}
                    >
                        Selected Vehicle
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            mt: 0.2,
                        }}
                    >
                        {selectedVehicle.registration_number ||
                            "Vehicle"}
                    </Typography>

                    {selectedVehicle.model && (
                        <Typography
                            sx={{
                                fontSize: 10,
                                color: "text.secondary",
                                mt: 0.2,
                            }}
                        >
                            {selectedVehicle.model}
                        </Typography>
                    )}
                </Box>
            )}

            {/* CONFIRM */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 1,
                }}
            >
                <Button
                    size="small"
                    variant="contained"
                    disabled={
                        !canContinue ||
                        detailLoading
                    }
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

export default VehicleSelection;