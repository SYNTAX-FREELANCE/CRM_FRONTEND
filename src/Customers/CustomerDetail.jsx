// CustomerDetail.jsx
import React, { memo, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    Paper,
    Card,
    CardContent,
    CardActions,
    Chip,
    Button,
    Divider,
    Stack,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Avatar,
} from '@mui/material';
import { useGetCustomerPolicyDetails } from '../CommonCode/useQuery';
import PolicyCard from './CustomersComponents/PolicyCard';


import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import FloatingBackButton from '../CommonComponents/FloatingBackButton';
import CustomerHeader from './CustomersComponents/CustomerHeader';

const themeColors = {
    orange: '#F57C00',
    orangeLight: '#FFF3E0',
    blue: '#1565C0',
    blueLight: '#E3F2FD',
    border: '#DCE8F7',
    textDark: '#1E293B',
    textLight: '#64748B',
    white: '#FFFFFF',
};

const formatDate = (isoString) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const CustomerDetail = () => {
    const { customerid } = useParams();
    const navigate = useNavigate();

    const {
        data: policyDetails = [],
        isLoading,
        isError,
        refetch,
    } = useGetCustomerPolicyDetails(customerid);

    const customer = useMemo(() => {
        if (!policyDetails?.length) return null;
        const p = policyDetails[0];
        return {
            customer_id: p.customer_id,
            customer_name: p.customer_name,
            mobile_number_1: p.mobile_number_1,
            mobile_number_2: p.mobile_number_2,
            email: p.customeremail,
            address: p.address,
            city: p.city,
            district: p.district,
            state: p.state,
            pincode: p.pincode,
            is_previous_customer: p.is_previous_customer,
        };
    }, [policyDetails]);

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
                <CircularProgress sx={{ color: themeColors.orange }} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load customer policy details.
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => refetch()}
                    sx={{ background: themeColors.blue }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    if (!customer) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">No policy details found for this customer.</Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "95vh",
                width: "100%",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                background: `
              radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
              radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
              linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
            `,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    height: "95vh",
                    width: "100%",
                    border: "1px solid rgba(255,255,255,.65)",
                    boxShadow: "0 20px 40px rgba(15,23,42,.05)",
                    borderRadius: 0,
                    background: "rgba(255,255,255,.5)",
                    backdropFilter: "blur(24px)",

                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >

                <CustomerHeader customer={customer} />

                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",

                        scrollbarWidth: "none",
                        msOverflowStyle: "none",

                        "&::-webkit-scrollbar": {
                            display: "none",
                        },

                        p: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "repeat(1,minmax(0,1fr))",
                                md: "repeat(2,minmax(0,1fr))",
                                lg: "repeat(3,minmax(0,1fr))",
                            },
                            gap: 1,
                        }}
                    >
                        {policyDetails?.map((policy) => (
                            <PolicyCard
                                key={policy.policy_id}
                                policy={policy}
                                onOpen={() =>
                                    navigate(`/home/customer/${customerid}/policy/${policy.policy_id}`)
                                }
                            />
                        ))}
                    </Box>
                </Box>
            </Paper>
            <FloatingBackButton navigateTo="/home/mycustomer" />
        </Box>
    );
};

export default memo(CustomerDetail);