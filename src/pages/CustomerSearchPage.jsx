import React, { useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import CustomerDetailPanel from "./CustomerDetailPage";
import CustomerSearchBar from "./CustomerSearchBar";


const CustomerSearchPage = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    return (
        <Box sx={{ minHeight: "90vh", bgcolor: "#f8fafc" }}>
            <Box
                sx={{
                    p: { xs: 2, md: 3 },
                }}>
                <Typography variant="h4"
                    fontWeight={900}
                    sx={{ mb: 0.5, color: "#0f172a", fontSize: { xs: 25, md: 30 } }}>
                    Global Customer Search
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: "text.secondary", fontSize: { xs: 8, md: 12 } }}>
                    Search by vehicle number, phone number, or customer name.
                </Typography>

                <CustomerSearchBar
                    onSelectCustomer={setSelectedCustomer}
                    setDetailLoading={setDetailLoading}
                />

                <Divider sx={{ my: 3 }} />

                <CustomerDetailPanel
                    customer={selectedCustomer}
                    loading={detailLoading}
                />
            </Box>
        </Box>
    );
};

export default CustomerSearchPage;