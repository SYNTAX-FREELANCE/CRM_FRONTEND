import React, { memo } from 'react';
import { Box, Stack, Typography } from '@mui/joy';

import PersonPinIcon from '@mui/icons-material/PersonPin';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Chip } from '@mui/material';

const LeadCard = ({ row }) => {

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return '#16a34a';
            case 'IN_PROGRESS':
                return '#f59e0b';
            case 'PENDING':
                return '#64748b';
            default:
                return '#2563eb';
        }
    };
    return (
        <Box
            sx={{
                p: { xs: 1.4, md: 1.8 },
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                background:
                    'linear-gradient(90deg, rgba(37,99,235,0.08) 0%, rgba(255,255,255,0.85) 52%, rgba(249,115,22,0.08) 100%)',
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                spacing={1.2}
            >
                <Box sx={{ flex: 1 }}>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: 13, sm: 16 },
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <PersonPinIcon
                                sx={{
                                    fontSize: { xs: 18, sm: 20 },
                                    color: '#ee790b',
                                }}
                            />
                            {row.customer_name}
                        </Typography>



                        <Chip
                            label={row.work_status}
                            size="small"
                            sx={{
                                bgcolor: getStatusColor(row.work_status),
                                color: '#fff',
                                fontSize: { xs: 8, sm: 10 },
                            }}
                        />
                    </Stack>

                    <Stack spacing={0.3}>
                        <Typography
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: { xs: 10, sm: 12 },
                                gap: 1,
                                fontWeight: 600,
                            }}
                        >
                            <EditLocationAltIcon
                                sx={{
                                    fontSize: { xs: 10, sm: 12 },
                                    color: '#ee790b',
                                }}
                            />
                            {row.city}, {row.district}, {row.state}
                        </Typography>

                        <Typography
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: { xs: 10, sm: 12 },
                                gap: 1,
                                fontWeight: 600,
                            }}
                        >
                            <DirectionsCarIcon
                                sx={{
                                    fontSize: { xs: 10, sm: 12 },
                                    color: '#ee790b',
                                }}
                            />
                            {row.registration_number}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default memo(LeadCard);