import React from 'react'
import { Box, Typography, Button } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import ArrowBack from '@mui/icons-material/ArrowBack'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

const MasterWrapper = ({ title, children, sx = {} }) => {
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 0, // prevents sidebar break
                bgcolor: '#ffffff',
                borderRadius: 12,
                boxShadow: 'sm',
                // p: 2,
                boxSizing: 'border-box',
                height: '100%',
                position: 'relative',
                overflowY: 'scroll',

                // // Hide scrollbar (clean UI)
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',

                ...sx // allow custom overrides
            }}
        >

            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    bgcolor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                    p: 2,
                    borderBottom: '1px solid #eee'
                }}
            >
                <Typography level="h4">
                    <DisplaySettingsIcon sx={{ mr: 1 }} />
                    {title}
                </Typography>

                <Button
                    size="sm"
                    variant="outlined"
                    startDecorator={<ArrowBack />}
                    onClick={() => navigate('/home/settings')}
                >
                    Back to Settings
                </Button>
            </Box>
            {/* Content Area */}
            <Box>
                {children}
            </Box>

        </Box>
    )
}

export default MasterWrapper