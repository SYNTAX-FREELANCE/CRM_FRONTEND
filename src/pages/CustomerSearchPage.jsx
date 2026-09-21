import React, { useState } from "react";
import { Box, Typography, Paper, Divider, useTheme } from "@mui/material";
import CustomerDetailPanel from "./CustomerDetailPage";
import CustomerSearchBar from "./CustomerSearchBar";
import { glassStyles } from "../CommonCode/Reusable";


const CustomerSearchPage = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{
            minHeight: "90vh",
            // ...glassStyles(isDark),
        }}>
            <Box
                sx={{
                    p: { xs: 2, md: 3 },
                }}>
                <Box
                    sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                       
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={900}
                        sx={{
                            mb: 0.5,
                            color: isDark ? "text.primary" : "#000000",
                            fontSize: { xs: 25, md: 30 },
                        }}
                    >
                        Global Customer Search
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mb: 3,
                            color: "text.secondary",
                            fontSize: { xs: 8, md: 12 },
                        }}
                    >
                        Search by vehicle number, phone number, or customer name.
                    </Typography>

                    <CustomerSearchBar
                        onSelectCustomer={setSelectedCustomer}
                        setDetailLoading={setDetailLoading}
                    />
                </Box>
                {/* <Divider sx={{ my: 3, borderColor: isDark ? "rgba(255,255,255,0.12)" : undefined }} /> */}

                <CustomerDetailPanel
                    customer={selectedCustomer}
                    loading={detailLoading}
                />
            </Box>
        </Box>
    );
};

export default CustomerSearchPage;