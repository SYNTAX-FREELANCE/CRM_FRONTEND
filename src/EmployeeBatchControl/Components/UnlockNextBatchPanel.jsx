import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Button,
    LinearProgress,
    Chip,
} from "@mui/material";
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';

const UnlockNextBatchPanel = ({ open, batchNo, onClose ,onClick}) => {
    return (
        <>
            {/* Backdrop */}
            <Box
                onClick={onClose}
                sx={{
                    position: 'fixed',
                    inset: 0,
                    bgcolor: 'rgba(15,23,42,0.45)',
                    backdropFilter: 'blur(2px)',
                    opacity: open ? 1 : 0,
                    visibility: open ? 'visible' : 'hidden',
                    transition: 'all .3s ease',
                    zIndex: 1299,
                }}
            />

            {/* Bottom Sheet */}
            <Box
                sx={{
                    position: 'fixed',
                    left: '50%',
                    bottom: 0,
                    transform: open
                        ? 'translate(-50%, 0)'
                        : 'translate(-50%, 100%)',
                    transition: 'transform .35s ease',
                    width: {
                        xs: '100%',
                        sm: '95%',
                        md: 650,
                    },
                    bgcolor: '#fff',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    overflow: 'hidden',
                    boxShadow: '0 -15px 40px rgba(15,23,42,.25)',
                    zIndex: 1300,
                    height: { xs: '85vh', sm: '90vh' }
                }}
            >
                {/* Drag Handle */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pt: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 60,
                            height: 6,
                            borderRadius: 10,
                            bgcolor: '#cbd5e1',
                        }}
                    />
                </Box>

                <Card
                    sx={{
                        // borderRadius: 5,
                        px: 2,
                        py: 2,
                        mb: 4,
                        background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #f97316 100%)",
                        // boxShadow: "0 25px 60px rgba(37, 99, 235, 0.3)",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Decorative Circles */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: -60,
                            right: -60,
                            width: 200,
                            height: 200,
                            borderRadius: "50%",
                            bgcolor: "rgba(255, 255, 255, 0.1)",
                        }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: -80,
                            left: -40,
                            width: 150,
                            height: 150,
                            borderRadius: "50%",
                            bgcolor: "rgba(255, 255, 255, 0.08)",
                        }}
                    />

                    <Grid container spacing={2} alignItems="center" justifyContent={'space-between'}>
                        <Grid item xs={12} md={8}>
                            <Typography fontSize={{ xs: 16, sm: 20, md: 26 }} fontWeight={900} color="#fff">
                                REMOVE BATCH LOCK.
                            </Typography>
                            <Typography fontSize={{ xs: 8, sm: 11, md: 13 }} color="rgba(255,255,255,0.88)">
                                Override the automatic batch lock and release the next batch for continued lead processing.
                            </Typography>
                        </Grid>

                    </Grid>
                </Card>


                {/* Body */}
                <Box
                    sx={{
                        px: 3,
                        flex: 1,
                        overflowY: "auto",
                        maxHeight: "calc(90vh - 100px)", // Adjust based on your header/footer height
                        /* Hide scrollbar - Firefox */
                        scrollbarWidth: "none",
                        /* Hide scrollbar - IE/Edge */
                        msOverflowStyle: "none",
                        /* Hide scrollbar - Chrome/Safari */
                        "&::-webkit-scrollbar": {
                            display: "none",
                        },
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: { xs: 12, sm: 14 },
                            color: "#475569",
                            lineHeight: 1.9,
                            fontWeight: 600
                        }}>
                        The employee is currently restricted from accessing the next batch because
                        the existing batch has not yet satisfied the required completion criteria.
                        Normally, the system unlocks the next batch automatically only after the
                        current batch reaches the configured completion threshold.
                    </Typography>

                    <Box
                        sx={{
                            mt: 3,
                            p: 2.5,
                            borderRadius: 3,
                            bgcolor: "#eff6ff",
                            border: "1px solid #bfdbfe",
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                color: "#060606",
                                mb: 1.5,
                                fontSize: { xs: 14, sm: 16 },
                            }}>
                            What happens when you Force Unlock?
                        </Typography>

                        <Box
                            component="ul"
                            sx={{
                                pl: 2.5,
                                m: 0,
                                color: "#334155",
                                lineHeight: 2,
                                fontSize: { xs: 9, sm: 14 },
                            }}
                        >
                            <li>The next lead batch Can be Fetched.</li>
                            <li>The employee can continue working without completeing existing calls.</li>
                            <li>The current batch will remain available and its progress will not be affected.</li>
                            <li>The employee may have multiple active batches after this action.</li>
                            <li>This action is recorded in the audit log with administrator details.</li>
                            <li>Force Unlock should only be used in exceptional business situations.</li>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: "#fff7ed",
                            border: "1px solid #fdba74",
                        }}
                    >
                        <Typography
                            sx={{
                                color: "#c2410c",
                                fontWeight: 800,
                                mb: 1,
                            }}
                        >
                            ⚠ Administrator Confirmation
                        </Typography>

                        <Typography
                            sx={{
                                color: "#7c2d12",
                                fontSize: 13,
                                lineHeight: 1.8,
                                fontSize: { xs: 10, sm: 14 },
                            }}
                        >
                            You are about to bypass the standard batch allocation policy for this
                            employee. This operation should only be performed with proper business
                            approval. Once unlocked, the employee will gain immediate access to the
                            next batch and this action cannot be automatically reversed.
                        </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box
                        sx={{
                            mt: 4,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<LockOpenRoundedIcon />}
                            sx={{
                                px: 4,
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 800,
                                background:
                                    "linear-gradient(135deg,#2563eb,#f97316)",
                                boxShadow: "0 10px 25px rgba(37,99,235,.25)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg,#1d4ed8,#ea580c)",
                                },
                            }}
                        onClick={onClick}
                        >
                            Unlock
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default UnlockNextBatchPanel;