import React from 'react';
import { Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';

const UnlockNextBatchAction = ({
    onClick,
    open,
    title = 'Unlock Next Batch',
}) => {
    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: '8px',
                background:
                    'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
                border: '1px solid #dbeafe',
                boxShadow: '0 8px 24px rgba(37,99,235,0.12)',
                overflow: 'hidden',
                transition: 'all .25s ease',
                cursor: 'pointer',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 14px 30px rgba(37,99,235,.18)',
                },
            }}
            onClick={onClick}
        >
            {/* Orange Icon Section */}
            <Box
                sx={{
                    width: { xs: 32, sm: 52 },
                    height: { xs: 38, sm: 52 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                        'linear-gradient(135deg,#ff9800,#ff6d00)',
                    color: '#fff',
                }}
            >
                <LockOpenRoundedIcon sx={{ fontSize: { xs: 20, sm: 26 } }} />
            </Box>

            {/* Text Section */}
            <Box
                sx={{
                    height: { xs: 38, sm: 52 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: { xs: 1.5, sm: 2 },
                    minWidth: { xs: 90, sm: 120 },
                }}
            >
                <Typography
                    sx={{
                        fontWeight: { xs: 800, sm: 700 },
                        fontSize: { xs: 10, sm: 14 },
                        color: '#1e3a8a',
                        lineHeight: 1.2,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    sx={{
                        fontSize: { xs: 8, sm: 11 },
                        fontWeight: { xs: 800, sm: 700 },
                        color: '#64748b',
                        mt: 0.3,
                    }}
                >
                    Release the next set of leads
                </Typography>
            </Box>
        </Box>
    );
};

export default UnlockNextBatchAction;