import React, { memo } from 'react'
import { Box, Typography } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../CommonComponents/PageWrapper';

const Settings = () => {
    
    const navigate = useNavigate();

    const master = [
        { label: 'Menu Master', path:  "/home/setting/menumaster" },
        { label: 'Program Master', path: 'setting/programmast' },
        { label: 'Program Detail Master', path: '/setting/programdtlmast' },
        { label: 'Designation Master', path: '/setting/designation' },
        { label: 'User Group Master', path: '/setting/usergroup' },
    ]
    return (

        <PageWrapper>
            <Typography level="h3" mb={3}>
                Master Settings
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1
                }}
            >
                {master?.map((item, index) => (
                    <Box
                        onClick={() =>
                            navigate(item.path, {
                                state: { title: item.label }
                            })
                        }
                        key={index}
                        sx={{
                            flex: '0 0 calc(25% - 16px)', // 4 per row
                            cursor: 'pointer',
                        }}
                    >
                        <Typography
                            level="h5"
                            sx={{
                                display: 'inline-block',
                                px: 1,
                                borderBottom: '3px solid red',
                                transition: '0.3s',
                                borderBottomRightRadius: 5,
                                borderBottomLeftRadius: 5
                            }}
                        >
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </PageWrapper>

    )
}

export default memo(Settings)