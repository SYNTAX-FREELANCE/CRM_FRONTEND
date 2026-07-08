import React, { useMemo } from 'react';
import { Box, Stack, Chip, Typography, Divider, Paper } from '@mui/material';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import { useGetBatchDetails } from '../CommonCode/useQuery';
import { useParams } from 'react-router-dom';

const EmployeeBatchDetail = () => {
    const { empid } = useParams();
    const { data: batchDetail = [] } = useGetBatchDetails(empid);



    const groupedBatches = useMemo(() => {
        return batchDetail.reduce((acc, item) => {
            const key = item.batch_no;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    }, [batchDetail]);

    const batchNumbers = Object.keys(groupedBatches).sort((a, b) => Number(a) - Number(b));

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
                minHeight: '95vh',
                width: '100%',
                p: { xs: 1.5, md: 3 },
                overflowY: 'auto',
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
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(18px)',
                    border: '1px solid rgba(255,255,255,0.7)',
                    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'rgba(37,99,235,0.12)',
                            color: '#2563eb',
                        }}
                    >
                        <SettingsAccessibilityIcon />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                            Employee Batch Detail
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Grouped by batch number
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={2.5}>
                    {batchNumbers.map((batchNo) => {
                        const items = groupedBatches[batchNo];
                        const first = items[0];

                        return (
                            <Paper
                                key={batchNo}
                                elevation={0}
                                sx={{
                                    p: { xs: 1.5, md: 2 },
                                    borderRadius: 3,
                                    border: '1px solid #e2e8f0',
                                    background: 'rgba(255,255,255,0.88)',
                                }}
                            >
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    justifyContent="space-between"
                                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                                    spacing={1.5}
                                    sx={{ mb: 1.5 }}
                                >
                                    <Box>
                                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                                Batch #{batchNo}
                                            </Typography>
                                            <Chip label={`${items.length} Leads`} size="small" color="primary" />
                                            <Chip label={first.name} size="small" variant="outlined" />
                                            <Chip label={first.role_name} size="small" variant="outlined" />
                                        </Stack>
                                        <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                            Employee ID: {first.employee_id} • Assigned: {new Date(first.assigned_at).toLocaleString()}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={first.work_status}
                                        size="small"
                                        sx={{
                                            bgcolor: getStatusColor(first.work_status),
                                            color: '#fff',
                                            fontWeight: 700,
                                        }}
                                    />
                                </Stack>

                                <Divider sx={{ my: 1.5 }} />

                                <Stack spacing={1.5}>
                                    {items.map((row) => (
                                        <Box
                                            key={row.lead_id}
                                            sx={{
                                                p: { xs: 1.4, md: 1.8 },
                                                borderRadius: 2,
                                                bgcolor: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                            }}
                                        >
                                            <Stack
                                                direction={{ xs: 'column', md: 'row' }}
                                                justifyContent="space-between"
                                                spacing={1.2}
                                            >
                                                <Box sx={{ flex: 1 }}>
                                                    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                                            {row.customer_name}
                                                        </Typography>
                                                        <Chip
                                                            label={row.work_status}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: getStatusColor(row.work_status),
                                                                color: '#fff',
                                                            }}
                                                        />
                                                        <Chip label={row.lead_priority} size="small" variant="outlined" />
                                                    </Stack>

                                                    <Typography variant="body2" sx={{ mt: 0.7, color: 'text.secondary' }}>
                                                        Lead ID: {row.lead_id} • Customer ID: {row.customer_id}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ minWidth: { xs: '100%', md: 280 } }}>
                                                    <Stack spacing={0.3}>
                                                        <Typography variant="body2">
                                                            <strong>Mobile:</strong> {row.mobile_number_1}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Location:</strong> {row.city}, {row.district}, {row.state}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>Vehicle:</strong> {row.registration_number}
                                                        </Typography>
                                                    </Stack>
                                                </Box>
                                            </Stack>

                                            <Divider sx={{ my: 1.2 }} />

                                            <Stack
                                                direction={{ xs: 'column', md: 'row' }}
                                                spacing={1.5}
                                                justifyContent="space-between"
                                            >
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2">
                                                        <strong>Model:</strong> {row.model}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Engine:</strong> {row.engine_number}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Chassis:</strong> {row.chassis_number}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2">
                                                        <strong>Remarks:</strong> {row.remarks || '-'}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Source:</strong> {row.lead_source}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>
                        );
                    })}
                </Stack>
            </Paper>
        </Box>
    );
};

export default EmployeeBatchDetail;