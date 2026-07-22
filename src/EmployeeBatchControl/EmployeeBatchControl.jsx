import React, { useCallback, useMemo, useState } from 'react';
import {
    Box,
    Paper,
    Stack,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Divider,
    Grid,
    Card,
    CardContent,
    Avatar,
    Checkbox,
    FormControlLabel,
    Chip,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    ListItemAvatar,
    Badge,
    useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import QueueIcon from '@mui/icons-material/Queue';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
// import RequestedDrawer from './Components/RequestedDrawer';
import { DataGrid } from '@mui/x-data-grid';
import { EmployeeBatchColumns } from './Components/EmployeeBatchColumns';
import { useNavigate } from 'react-router-dom';
import { useGetActiveBatchs } from '../CommonCode/useQuery';
import { useThemeMode } from "../Context/ThemeContext";



// const requestItems = [
//     {
//         id: 1,
//         name: 'Rahul Kumar',
//         empId: 'EMP004',
//         designation: 'Telecaller',
//         time: '2 min ago',
//         message: 'Requested one extra batch permission.',
//         status: 'Open',
//     },
//     {
//         id: 2,
//         name: 'Anjali S',
//         empId: 'EMP019',
//         designation: 'Telecaller',
//         time: '15 min ago',
//         message: 'Need next batch to continue calling.',
//         status: 'Closed',
//     },
//     {
//         id: 3,
//         name: 'Vishnu P',
//         empId: 'EMP021',
//         designation: 'Senior Telecaller',
//         time: 'Today 10:40 AM',
//         message: 'Batch completed, asking for next queue.',
//         status: 'Open',
//     },
//     {
//         id: 3,
//         name: 'Vishnu P',
//         empId: 'EMP021',
//         designation: 'Senior Telecaller',
//         time: 'Today 10:40 AM',
//         message: 'Batch completed, asking for next queue.',
//         status: 'Open',
//     },
//     {
//         id: 3,
//         name: 'Vishnu P',
//         empId: 'EMP021',
//         designation: 'Senior Telecaller',
//         time: 'Today 10:40 AM',
//         message: 'Batch completed, asking for next queue.',
//         status: 'Open',
//     },
//     {
//         id: 3,
//         name: 'Vishnu P',
//         empId: 'EMP021',
//         designation: 'Senior Telecaller',
//         time: 'Today 10:40 AM',
//         message: 'Batch completed, asking for next queue.',
//         status: 'Open',
//     }
// ];

const EmployeeBatchControl = () => {
    const { mode } = useThemeMode();
    const isDark = mode === "dark";

    const [requestPanelOpen, setRequestPanelOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const { data: ActiveBatchDetisl = [] } = useGetActiveBatchs()

    const isMobile = useMediaQuery("(max-width:600px)");
    const navigate = useNavigate();

    const openEmployee = useCallback((row) => {
        navigate(`/home/batchcontrol/${row.user_id}`)
    }, [navigate]);


    // const handleOpenRequest = useCallback((item) => {
    //     setRequestPanelOpen(false)
    //     navigate(`/home/batchcontrol/${item.id}`)
    // }, [navigate])

    const columns = useMemo(
        () => EmployeeBatchColumns(openEmployee, isMobile),
        [isMobile]
    );



    return (
        <Box
            sx={{
                minHeight: '95vh',
                width: '100%',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
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
                    minHeight: '95vh',
                    width: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255,255,255,0.7)',
                    background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255,255,255,0.62)',
                    backdropFilter: 'blur(22px)',
                    boxShadow: isDark ? '0 18px 50px rgba(0, 0, 0, 0.6)' : '0 18px 50px rgba(15, 23, 42, 0.08)',
                }}
            >
                <Box
                    sx={{
                        px: { xs: 2, md: 3 },
                        py: { xs: 2, md: 2.5 },
                        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226,232,240,0.9)',
                        background: isDark
                            ? 'linear-gradient(90deg, rgba(37, 99, 235, 0.15) 0%, rgba(15, 23, 42, 0.85) 52%, rgba(249, 115, 22, 0.15) 100%)'
                            : 'linear-gradient(90deg, rgba(37,99,235,0.08) 0%, rgba(255,255,255,0.85) 52%, rgba(249,115,22,0.08) 100%)',
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
                                        bgcolor: isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.12)',
                                        color: isDark ? '#60a5fa' : '#2563eb',
                                        boxShadow: isDark ? 'inset 0 0 0 1px rgba(255, 255, 255, 0.15)' : 'inset 0 0 0 1px rgba(37,99,235,0.15)',
                                    }}
                                >
                                    <QueueIcon sx={{ fontSize: { xs: 16, sm: 22 } }} />
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: 16, sm: 26 },
                                            fontWeight: 900,
                                            letterSpacing: '-0.6px',
                                            color: isDark ? '#f8fafc' : '#0f172a',
                                            lineHeight: 1.1,
                                        }}
                                    >
                                        Employee Batch Control
                                    </Typography>
                                    <Typography
                                        sx={{
                                            mt: 0.4,
                                            color: isDark ? '#94a3b8' : '#475569',
                                            fontSize: { xs: 8, sm: 14 },
                                            fontWeight: 500,
                                        }}
                                    >
                                        Search employee, review current batch, and manage requests.
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                        {/* 
                        <IconButton
                            onClick={() => setRequestPanelOpen(true)}
                            sx={{
                                ml: 'auto',
                                bgcolor: 'rgba(249,115,22,0.10)',
                                border: '1px solid rgba(249,115,22,0.18)',
                                color: '#f97316',
                                '&:hover': { bgcolor: 'rgba(249,115,22,0.16)' },
                            }}
                        >
                            <Badge
                                sx={{
                                    fontSize: { xs: 8, sm: 16 }
                                }}
                                badgeContent={3}
                                color="error"
                                overlap="circular"
                            >
                                <NotificationsActiveOutlinedIcon sx={{
                                    fontSize: { xs: 16, sm: 26 }
                                }} />
                            </Badge>
                        </IconButton> */}
                    </Stack>
                </Box>

                <Box sx={{ p: 1 }}>

                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minHeight: '100%',
                            width: "100%",
                            borderRadius: 4,
                            overflowX: "hidden",
                            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(255, 255, 255, 0.55)",
                            background: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.25)",
                            backdropFilter: "blur(16px)",
                            boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.3)" : "0 10px 30px rgba(15, 23, 42, 0.02)",
                        }}
                    >
                        <DataGrid
                            rows={ActiveBatchDetisl}
                            columns={columns}
                            getRowId={(row) => row.user_id}
                            disableRowSelectionOnClick
                            pageSizeOptions={[5, 10, 25, 50]}
                            rowHeight={44}
                            columnHeaderHeight={48}
                            slotProps={{
                                loadingOverlay: {
                                    variant: "skeleton",
                                    noRowsVariant: "skeleton",
                                },
                            }}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                        page: 0,
                                    },
                                },
                            }}
                            onRowClick={(params) => {
                                console.log(params.row);

                            }}
                            sx={{
                                height: "100%",
                                width: "100%",
                                border: "none",
                                fontSize: "13px",
                                background: "transparent",
                                color: isDark ? "#cbd5e1" : "inherit",

                                "& .MuiDataGrid-columnHeaders": {
                                    background: isDark ? "#1e293b" : "rgba(248,250,252,.55)",
                                    borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(226,232,240,.6)",
                                },

                                "& .MuiDataGrid-columnHeaderTitle": {
                                    fontWeight: 800,
                                    color: isDark ? "#cbd5e1" : "#475569",
                                    fontSize: 12,
                                    textTransform: "uppercase",
                                    letterSpacing: ".5px",
                                },

                                "& .MuiDataGrid-cell": {
                                    borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(226,232,240,.35)",
                                    color: isDark ? "#cbd5e1" : "inherit",
                                },

                                "& .MuiDataGrid-row": {
                                    cursor: "pointer",
                                    transition: ".2s",
                                    background: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.15)",
                                    "&:hover": {
                                        background: isDark ? "rgba(37,99,235,.12)" : "rgba(37,99,235,.05)",
                                    },
                                },

                                "& .MuiDataGrid-footerContainer": {
                                    background: isDark ? "#1e293b" : "rgba(248,250,252,.55)",
                                    borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                                    color: isDark ? "#cbd5e1" : "inherit",
                                },
                                "& .MuiTablePagination-root, & .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-actions svg": {
                                    color: isDark ? "#cbd5e1" : "inherit",
                                }
                            }}
                        />
                    </Paper>

                </Box>
            </Paper>

            {/* <RequestedDrawer
                open={requestPanelOpen}
                onClose={() => setRequestPanelOpen(false)}
                requestItems={requestItems}
                onSelectRequest={(item) => handleOpenRequest(item)}
            /> */}
        </Box>
    );
};

export default EmployeeBatchControl;