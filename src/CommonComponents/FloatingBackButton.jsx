import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from 'react-router-dom';

const FloatingBackButton = ({
    label = 'Back',
    bottom = 24,
    right = 24,
    navigateTo = null,
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (navigateTo) {
            navigate(navigateTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <Tooltip title={label}>
            <Fab
                onClick={handleBack}
                size="medium"
                sx={{
                    position: 'fixed',
                    bottom,
                    right,
                    zIndex: 1300,
                    background:
                        'linear-gradient(135deg,#2563eb,#f97316)',
                    color: '#fff',
                    boxShadow:
                        '0 10px 25px rgba(37,99,235,.25)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        background:
                            'linear-gradient(135deg,#1d4ed8,#ea580c)',
                    },
                    transition: '.2s',
                }}
            >
                <ArrowBackRoundedIcon />
            </Fab>
        </Tooltip>
    );
};

export default FloatingBackButton;