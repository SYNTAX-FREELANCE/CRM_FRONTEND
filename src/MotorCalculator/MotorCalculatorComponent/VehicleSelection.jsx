import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CustomerSearchToggle from "../../LeadTransfer/TransferComponents/CustomerSearchToggle";

const VehicleSelection = ({ value, onChange }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(
        value?.customer ? value : null
    );

    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        if (value) {
            setSelectedCustomer(value);
        }
    }, [value]);

    const handleCustomerChange = (data) => {
        setSelectedCustomer(data);

        onChange(data);
    };

    return (
        <Box>
            <Typography variant="h6" fontWeight={700}>
                Vehicle Selection
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
            >
                Select a customer and vehicle to start the calculation.
            </Typography>

            <Box sx={{ my: 1 }}>
                <CustomerSearchToggle
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={handleCustomerChange}
                    setDetailLoading={setDetailLoading}
                />
            </Box>
        </Box>
    );
};

export default VehicleSelection;