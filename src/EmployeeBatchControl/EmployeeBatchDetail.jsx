import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Stack,
    Chip,
    Typography,
    Paper,
    Button,
    Collapse,
} from '@mui/material';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';
import { useGetBatchDetails } from '../CommonCode/useQuery';
import { useParams } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UnlockNextBatchAction from './Components/UnlockNextBatchAction';
import UnlockNextBatchPanel from './Components/UnlockNextBatchPanel';
import FloatingBackButton from '../CommonComponents/FloatingBackButton';
import LeadCard from './Components/LeadCard';
import { axioslogin } from '../Connection/axios';
import { errorNotify, getAuthUser, successNotify, warningNofity } from '../constant/Constant';
import { useQueryClient } from '@tanstack/react-query';
import { useThemeMode } from '../Context/ThemeContext';


const EmployeeBatchDetail = () => {
    const { empid } = useParams();
    const authUser = getAuthUser();
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const queryClient = useQueryClient();

    const { id: LoggedEmployeId } = authUser ?? {}

    const { data: batchDetail = [] } = useGetBatchDetails(empid);
    const [expandedBatch, setExpandedBatch] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);

    const groupedBatches = useMemo(() => {
        return batchDetail?.reduce((acc, item) => {
            const key = item.batch_no;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    }, [batchDetail]);

    const batchNumbers = Object.keys(groupedBatches).sort((a, b) => Number(a) - Number(b));

    useEffect(() => {
        if (!initialized && batchNumbers.length > 0) {
            setExpandedBatch(batchNumbers[0]);
            setInitialized(true);
        }
    }, [batchNumbers, initialized]);



    const handleToggleBatch = (batchNo) => {
        setExpandedBatch((prev) => (prev === batchNo ? null : batchNo));
    };

    const handleUnlockNextBatch = () => {
        if (!batchNumbers.length) return;
        const currentIndex = batchNumbers.findIndex((b) => b === expandedBatch);
        const nextIndex = currentIndex === -1 ? 0 : currentIndex + 1;
        if (nextIndex < batchNumbers.length) {
            setExpandedBatch(batchNumbers[nextIndex]);
        }
    };

    const handleUnlockBlock = useCallback(async () => {
        try {
            const payload = {
                employee_id: Number(empid),
                batch_no: Number(batchNumbers?.[0]),
                unlocked_by: Number(LoggedEmployeId)
            };
            const response = await axioslogin.post("/lead/release-block", payload);
            const { success, message } = response.data ?? {};
            if (success !== 1) return warningNofity(message || "Error in Api Occured");
            successNotify(message || "Unlocked SuccessFully")
            setPanelOpen(false)
            await queryClient.invalidateQueries({
                queryKey: ['batch-detils', Number(empid)],
            });
            await queryClient.invalidateQueries({ queryKey: ['active-batches'] });

        } catch (error) {
            console.error(error);
            errorNotify("Error in Preforming Release Block Operations")
        }
    }, [empid, batchNumbers]);

    return (
        <Box
            sx={{
                height: '95vh',
                width: '100%',
                background: isDark
                    ? `
                        radial-gradient(circle at 15% 25%, rgba(30, 41, 59, 0.4) 0%, transparent 45%),
                        radial-gradient(circle at 85% 75%, rgba(15, 23, 42, 0.6) 0%, transparent 45%),
                        linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)
                      `
                    : `
                        radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.22) 0%, transparent 45%),
                        radial-gradient(circle at 85% 75%, rgba(249, 115, 22, 0.18) 0%, transparent 45%),
                        linear-gradient(135deg, #ffffff 0%, #eff6ff 50%, #fff7ed 100%)
                      `,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.7)',
                    background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255,255,255,0.62)',
                    backdropFilter: 'blur(22px)',
                    boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.6)' : '0 18px 50px rgba(15, 23, 42, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        px: { xs: 2, md: 3 },
                        py: { xs: 2, md: 2.5 },
                        background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255,255,255,0.62)',
                        backdropFilter: 'blur(22px)',
                        borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        boxShadow: isDark ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 18px 50px rgba(15, 23, 42, 0.08)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 20,
                        flexShrink: 0,
                    }}
                >
                    <Stack
                        direction={{ xs: 'row', md: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        gap={2}
                    >
                        <Box>
                            <Stack direction="row" alignItems="center" gap={1.2}>
                                <Box
                                    sx={{
                                        width: { xs: 32, sm: 42 },
                                        height: { xs: 32, sm: 42 },
                                        borderRadius: '50%',
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.12)',
                                        color: isDark ? '#60a5fa' : '#2563eb',
                                        boxShadow: isDark ? 'inset 0 0 0 1px rgba(96,165,250,0.3)' : 'inset 0 0 0 1px rgba(37,99,235,0.15)',
                                    }}
                                >
                                    <SettingsAccessibilityIcon sx={{ fontSize: { xs: 16, sm: 22 } }} />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: 16, sm: 26 },
                                            fontWeight: 900,
                                            letterSpacing: '-0.6px',
                                            color: isDark ? '#f8fafc' : '#0f172a',
                                            lineHeight: 1.1,
                                        }}>
                                        Batch Detail
                                    </Typography>
                                    <Typography
                                        sx={{
                                            mt: 0.4,
                                            color: isDark ? '#94a3b8' : '#475569',
                                            fontSize: { xs: 8, sm: 14 },
                                            fontWeight: 500,
                                        }}
                                    >
                                        Pending Employee Details.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Box >
                            <UnlockNextBatchAction
                                onClick={() => {
                                    setPanelOpen((prev) => !prev);
                                }}
                                open={panelOpen}
                            />

                        </Box>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        maxHeight: '95vh',
                        overflowY: 'auto',
                        // px: ,
                        py: 2,
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                    }}
                >
                    <Stack spacing={0.5} mt={1}>
                        {batchNumbers?.map((batchNo) => {
                            const items = groupedBatches[batchNo];
                            const first = items[0];
                            const expanded = expandedBatch === batchNo;

                            return (
                                <Paper
                                    key={batchNo}
                                    elevation={0}
                                    sx={{
                                        p: { xs: 1.5, md: 2 },
                                        borderRadius: 3,
                                        background: 'transparent',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: expanded ? 'transparent' : (isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255,255,255,0.62)'),
                                            borderTopRightRadius: 19,
                                            borderTopLeftRadius: 19,
                                            borderBottom: '0.5px solid rgba(240, 131, 21, 0.91)',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Stack
                                            direction={{ xs: 'column', sm: 'row' }}
                                            justifyContent="space-between"
                                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                                            // spacing={1.5}
                                            sx={{
                                                px: { xs: 2, md: 3 },
                                                py: { xs: 2, md: 2.5 },
                                                cursor: 'pointer',
                                                background: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255,255,255,0.62)',
                                                backdropFilter: 'blur(22px)',
                                                boxShadow: isDark ? '0 18px 50px rgba(0, 0, 0, 0.4)' : '0 18px 50px rgba(238, 121, 20, 0.08)',
                                                borderTopRightRadius: 10,
                                                borderTopLeftRadius: 10,
                                            }}
                                            onClick={() => handleToggleBatch(batchNo)}
                                        >
                                            <Box sx={{ width: '100%' }}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    flexWrap="wrap"
                                                    justifyContent="space-between"
                                                    sx={{ width: '100%' }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ fontWeight: 800, fontSize: { xs: 13, sm: 16 }, color: isDark ? '#f8fafc' : '#0f172a' }}
                                                    >
                                                        BATCH NO #{batchNo}
                                                    </Typography>

                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip
                                                            label={`${items.length} Leads`}
                                                            sx={{
                                                                fontSize: 10,
                                                                fontWeight: 800,
                                                                bgcolor: isDark ? 'rgba(255,255,255,0.12)' : undefined,
                                                                color: isDark ? '#f8fafc' : undefined,
                                                            }}
                                                        />
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                                fontSize: 12,
                                                                fontWeight: 800,
                                                                color: isDark ? '#60a5fa' : '#2563eb',
                                                                userSelect: 'none',
                                                            }}
                                                        >
                                                            <ExpandMoreIcon
                                                                sx={{
                                                                    transition: '0.25s ease',
                                                                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                }}
                                                            />
                                                        </Box>
                                                    </Stack>
                                                </Stack>

                                                <Typography
                                                    sx={{
                                                        fontWeight: 800,
                                                        fontSize: { xs: 8, sm: 10 },
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        color: isDark ? '#cbd5e1' : 'inherit'
                                                    }}
                                                >
                                                    <CalendarMonthIcon sx={{
                                                        fontSize: 12,
                                                        color: isDark ? '#f97316' : '#ee790b'
                                                    }} /> {new Date(first.assigned_at).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                                            <Stack spacing={1.5} p={2}>
                                                {items?.map((row) => (
                                                    <LeadCard
                                                        key={row.lead_id}
                                                        row={row}
                                                    />
                                                ))}
                                            </Stack>
                                        </Collapse>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Box>
            </Paper>

            <FloatingBackButton navigateTo="/home/batchcontrol" />

            <UnlockNextBatchPanel
                open={panelOpen}
                batchNo={batchNumbers?.[0]}
                onClose={() => setPanelOpen(false)}
                onClick={handleUnlockBlock}
            />
        </Box>
    );
};

export default EmployeeBatchDetail;